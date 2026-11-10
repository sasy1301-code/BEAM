// Harder-level generator: build a candidate with the stock generator, then keep adding bombs/blocks on the paths of
// every alternative solution until exactly one solution is left. What remains is a board full of tempting wrong turns.
const E=require('./engine.js');
const fs=require('fs');
const {traceAll,mulberry32,hashStr}=E; const startBeamE=null;
function layoutLevel(R, spec){
  const {W,H,k,nt,walls=0,bombs=0,fixed=0,splits=0,lasers=1,maxSols=1,budget=400000}=spec;
  const grid=Array.from({length:H},()=>Array(W).fill('.'));
  const rc=()=>[Math.floor(R()*W),Math.floor(R()*H)];
  const place=(ch,n)=>{for(let i=0,g=0;i<n&&g<200;g++){const [x,y]=rc(); if(grid[y][x]==='.'){grid[y][x]=ch;i++;}}};
  const L=[]; const sides='LRTB';
  for(let i=0,g=0;i<lasers&&g<50;g++){
    const s=sides[Math.floor(R()*4)], idx=Math.floor(R()*((s==='L'||s==='R')?H:W));
    if(!L.some(l=>l[0]===s&&Math.abs(l[1]-idx)<2))L.push([s,idx]),i++;
  }
  // random hidden layout
  const mir={}; let placed=0, fx=0, sp=0;
  const rows0=()=>grid.map(r=>r.join(''));
  // walk beams, dropping mirrors randomly on first visits
  const queue=L.map(l=>startBeam(l,W,H)); const seen=new Set(), visited=new Set(); const pathCells=[];
  let guard=0;
  while(queue.length&&guard++<50){
    let [x,y,dx,dy]=queue.shift();
    for(let s=0;s<400;s++){
      x+=dx;y+=dy;
      if(x<0||y<0||x>=W||y>=H)break;
      const c=grid[y][x]; const kk=x+','+y;
      const st=kk+','+dx+','+dy; if(seen.has(st))break; seen.add(st);
      if(c==='f'){[dx,dy]=tS(dx,dy);continue;}
      if(c==='g'){[dx,dy]=tB(dx,dy);continue;}
      if(c==='p'||c==='q'){const [rx,ry]=c==='p'?tS(dx,dy):tB(dx,dy);queue.push([x,y,rx,ry]);continue;}
      const first=!visited.has(kk); visited.add(kk);
      if(mir[kk]){[dx,dy]=mir[kk]==='/'?tS(dx,dy):tB(dx,dy);continue;}
      if(first&&c==='.'&&fx<fixed&&R()<0.12){const ch=R()<.5?'f':'g';grid[y][x]=ch;fx++;[dx,dy]=ch==='f'?tS(dx,dy):tB(dx,dy);continue;}
      if(first&&c==='.'&&sp<splits&&R()<0.12){const ch=R()<.5?'p':'q';grid[y][x]=ch;sp++;const [rx,ry]=ch==='p'?tS(dx,dy):tB(dx,dy);queue.push([x,y,rx,ry]);continue;}
      if(placed<k&&first&&R()<0.3){mir[kk]=R()<.5?'/':'\\';placed++;[dx,dy]=mir[kk]==='/'?tS(dx,dy):tB(dx,dy);continue;}
      pathCells.push(kk);
    }
  }
  if(placed<k||fx<fixed||sp<splits)return null;
  const cand=[...new Set(pathCells)].filter(c=>!mir[c]);
  if(cand.length<nt)return null;
  // prefer late cells for stars so every mirror matters
  const tg=new Set(); const late=cand.slice(Math.floor(cand.length*0.4));
  tg.add(late[Math.floor(R()*late.length)]);
  let g2=0; while(tg.size<nt&&g2++<200)tg.add(cand[Math.floor(R()*cand.length)]);
  for(const c of tg){const [x,y]=c.split(',').map(Number);grid[y][x]='T';}
  const onPath=new Set([...visited]);
  const free=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(grid[y][x]==='.'&&!onPath.has(x+','+y))free.push([x,y]);
  for(let i=free.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[free[i],free[j]]=[free[j],free[i]];}
  for(let i=0;i<walls&&free.length;i++){const [x,y]=free.pop();grid[y][x]='#';}
  for(let i=0;i<bombs&&free.length;i++){const [x,y]=free.pop();grid[y][x]='X';}
  const lv={rows:grid.map(r=>r.join('')), lasers:L, max:k};
  if(!traceAll(lv,mir).allLit)return null;
  lv.sol=Object.entries(mir).sort((a,b)=>a[0]<b[0]?-1:1);
  return lv;
}

function lasersOf(lv){return lv.lasers||[lv.laser];}
function startBeam(l,W,H){const [s,i]=l; if(s==='L')return[-1,i,1,0]; if(s==='R')return[W,i,-1,0]; if(s==='T')return[i,-1,0,1]; return[i,H,0,-1];}
const tS=(dx,dy)=>[-dy,-dx], tB=(dx,dy)=>[dy,dx];
// same search as the engine's solver, but hands back every solution that uses the fewest mirrors
function solveAll(lv,limit,budget,cap=400){
  const rows=lv.rows,H=rows.length,W=rows[0].length; const tI={}; let nt=0;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(rows[y][x]==='T')tI[x+','+y]=nt++;
  const litc=new Array(nt).fill(0); let litT=0; const dec=new Map(),seen=new Set(),sols=new Map(); let nodes=0,ab=false;
  function walk(beam,rest,used){
    if(++nodes>budget||sols.size>cap){ab=true;return;}
    let [x,y,dx,dy]=beam; const added=[],la=[];
    const clean=()=>{for(const s of added)seen.delete(s);for(const i of la){if(--litc[i]===0)litT--;}};
    while(true){
      x+=dx;y+=dy; if(x<0||y<0||x>=W||y>=H)break; const c=rows[y][x]; if(c==='#')break; if(c==='X'){clean();return;}
      const k=x+','+y; if(c==='T'){const i=tI[k];if(litc[i]++===0)litT++;la.push(i);}
      const s=k+','+dx+','+dy; if(seen.has(s))break; seen.add(s);added.push(s);
      if(c==='f'){[dx,dy]=tS(dx,dy);continue;} if(c==='g'){[dx,dy]=tB(dx,dy);continue;}
      if(c==='p'||c==='q'){const [rx,ry]=c==='p'?tS(dx,dy):tB(dx,dy); rest=[[x,y,rx,ry],...rest]; continue;}
      if(c==='.'){
        if(dec.has(k)){const m=dec.get(k); if(m==='/')[dx,dy]=tS(dx,dy); else if(m==='\\')[dx,dy]=tB(dx,dy); continue;}
        for(const mm of ['','/','\\']){ if(mm&&used>=limit)continue; dec.set(k,mm);
          const [ndx,ndy]=mm==='/'?tS(dx,dy):mm==='\\'?tB(dx,dy):[dx,dy]; walk([x,y,ndx,ndy],rest,used+(mm?1:0)); dec.delete(k); if(ab)break; }
        clean();return;
      }
    }
    if(rest.length)walk(rest[0],rest.slice(1),used);
    else if(litT===nt){const arr=[...dec].filter(e=>e[1]).sort((a,b)=>a[0]<b[0]?-1:1); const key=arr.map(e=>e.join(':')).join('|'); if(!sols.has(key))sols.set(key,arr);}
    clean();
  }
  const beams=lasersOf(lv).map(l=>startBeam(l,W,H)); walk(beams[0],beams.slice(1),0);
  if(ab)return null; if(!sols.size)return{min:null,count:0,nodes,all:[]};
  let min=Infinity; for(const a of sols.values())min=Math.min(min,a.length);
  const best=[...sols.values()].filter(a=>a.length===min); return{min,count:best.length,all:best,nodes};
}
function pathCells(lv,sol){const m={};for(const [k,v] of sol)m[k]=v; const tr=E.traceAll(lv,m); const set=new Set();
  for(const p of tr.paths)for(let i=0;i+1<p.length;i++){const [x0,y0]=p[i],[x1,y1]=p[i+1]; const n=Math.round(Math.max(Math.abs(x1-x0),Math.abs(y1-y0))*2);
    for(let s=0;s<=n;s++){const x=Math.floor(x0+(x1-x0)*s/Math.max(n,1)),y=Math.floor(y0+(y1-y0)*s/Math.max(n,1)); set.add(x+','+y);}}
  return set;}
const keyOf=sol=>sol.map(e=>e.join(':')).join('|');
function harden(R,lv,k,budget,maxAdd){
  const H=lv.rows.length,W=lv.rows[0].length; const grid=lv.rows.map(r=>r.split(''));
  const cur=()=>({rows:grid.map(r=>r.join('')),lasers:lv.lasers,max:k});
  const intended=lv.sol, ikey=keyOf(intended); const keep=pathCells(lv,intended); for(const [kk] of intended)keep.add(kk);
  let added=0, last=null;
  let lo=1;
  for(let it=0;it<=maxAdd;it++){
    let res=null;
    for(let lim=lo;lim<=k;lim++){ const r=solveAll(cur(),lim,budget); if(!r)return null; if(r.count>0){res=r;lo=lim;break;} }
    if(!res)return null;
    if(res.min===k){
      if(!res.all.some(a=>keyOf(a)===ikey))return null;
      if(res.count===1){const out=cur(); out.sol=intended; out.nodes=res.nodes; out.added=added; return out;}
    }
    if(it===maxAdd)return null;
    const score=new Map();
    for(const a of res.all){ if(keyOf(a)===ikey)continue; const pc=pathCells(cur(),a); for(const [kk] of a)pc.add(kk);
      for(const c of pc){ if(keep.has(c))continue; const [x,y]=c.split(',').map(Number); if(x<0||y<0||x>=W||y>=H||grid[y][x]!=='.')continue; score.set(c,(score.get(c)||0)+1);} }
    if(!score.size)return null;
    const top=[...score].sort((a,b)=>b[1]-a[1]); const pick=top[Math.floor(R()*Math.min(3,top.length))][0]; const [px,py]=pick.split(',').map(Number);
    grid[py][px]=R()<0.75?'X':'#'; added++;
  }
  return null;
}
function hammerList(lv,budget){ const out=[]; const H=lv.rows.length,W=lv.rows[0].length;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(lv.rows[y][x]==='#'){ const rows=lv.rows.map((r,yy)=>yy===y?r.slice(0,x)+'.'+r.slice(x+1):r);
    const r=E.solveLevel({rows,lasers:lv.lasers},lv.max-1,budget); if(r&&r.count>0)out.push(x+','+y); }
  return out; }
const [,, name, specJson, secs, outFile]=process.argv; const spec=JSON.parse(specJson);
const R=E.mulberry32(E.hashStr('hard-'+name+'-'+Date.now())); const t0=Date.now(); let tries=0,solved=0; const seenRows=new Set();
while(Date.now()-t0<secs*1000){
  tries++;
  const cand=layoutLevel(R,spec);
  if(!cand)continue; solved++;
  const lv=harden(R,cand,spec.k,spec.budget,spec.maxAdd||18); if(!lv)continue;
  // every fixed mirror and splitter must sit on the solved path, or it is only decoration
  { const pc=pathCells(lv,lv.sol); let ok=true; for(let y=0;y<lv.rows.length;y++)for(let x=0;x<lv.rows[0].length;x++)if('fgpq'.includes(lv.rows[y][x])&&!pc.has(x+','+y))ok=false; if(!ok)continue; }
  const sig=lv.rows.join('|'); if(seenRows.has(sig))continue; seenRows.add(sig);
  const total=lv.rows.join('').split('T').length-1; const chk=E.traceAll(lv,Object.fromEntries(lv.sol)); if(!chk.allLit||total!==spec.nt)continue;
  const final=E.solveLevel(lv,spec.k,spec.budget*2); if(!final||final.count!==1||final.min!==spec.k)continue;
  lv.hammer=hammerList(lv,spec.budget); lv.nodes=final.nodes;
  lv.id='L'+E.hashStr(sig+JSON.stringify(lv.lasers)).toString(36);
  fs.appendFileSync(outFile,JSON.stringify({pool:name,k:spec.k,...lv})+'\n');
}
console.log(name,'tries',tries,'cands',solved,'kept',seenRows.size,'sec',((Date.now()-t0)/1000).toFixed(0));
