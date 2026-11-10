/* BEAM engine: beam tracing, exhaustive solver and level generator (runs in the browser or Node.js) */
function lasersOf(lv){ return lv.lasers || [lv.laser]; }
function startBeam(l, W, H){
  const [s,i]=l;
  if(s==='L')return [-1,i,1,0]; if(s==='R')return [W,i,-1,0];
  if(s==='T')return [i,-1,0,1]; return [i,H,0,-1];
}
const turnSlash=(dx,dy)=>[-dy,-dx], turnBack=(dx,dy)=>[dy,dx];

/* trace every beam; returns drawable paths, lit stars and a hit bomb (if any) */
function traceAll(lv, mir){
  const rows=lv.rows, H=rows.length, W=rows[0].length;
  const queue=lasersOf(lv).map(l=>startBeam(l,W,H));
  const paths=[], lit=new Set(), seen=new Set(); let bomb=null, guard=0;
  while(queue.length && guard++<200){
    let [x,y,dx,dy]=queue.shift();
    const inside=x>=0&&y>=0&&x<W&&y<H;
    const pts=[[x+.5+(inside?0:dx*.35), y+.5+(inside?0:dy*.35)]];
    for(let s=0;s<600;s++){
      const nx=x+dx, ny=y+dy;
      if(nx<0||ny<0||nx>=W||ny>=H){pts.push([x+.5+dx*.5,y+.5+dy*.5]);break;}
      const c=rows[ny][nx];
      if(c==='#'){pts.push([x+.5+dx*.45,y+.5+dy*.45]);break;}
      x=nx;y=ny; const k=x+','+y;
      if(c==='X'){pts.push([x+.5,y+.5]); bomb=bomb||k; break;}
      if(c==='T')lit.add(k);
      const st=k+','+dx+','+dy;
      if(seen.has(st)){pts.push([x+.5,y+.5]);break;}
      seen.add(st);
      let m=null;
      if(c==='f')m='/'; else if(c==='g')m='\\'; else if(c==='.')m=mir[k]||null;
      if(m){pts.push([x+.5,y+.5]); [dx,dy]=m==='/'?turnSlash(dx,dy):turnBack(dx,dy);}
      else if(c==='p'||c==='q'){
        const [rx,ry]=c==='p'?turnSlash(dx,dy):turnBack(dx,dy);
        queue.push([x,y,rx,ry]);
      }
    }
    paths.push(pts);
  }
  const total=rows.join('').split('T').length-1;
  return {paths, lit, bomb, total, allLit: total>0 && lit.size===total && !bomb};
}

/* exhaustive search: every way to place up to `limit` mirrors that lights all stars */
function solveLevel(lv, limit, budget){
  const rows=lv.rows, H=rows.length, W=rows[0].length;
  const tIndex={}; let nt=0;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(rows[y][x]==='T')tIndex[x+','+y]=nt++;
  const litc=new Array(nt).fill(0); let litTotal=0;
  const dec=new Map(), seen=new Set(), sols=new Map(); let nodes=0, aborted=false;
  function walk(beam, rest, used){
    if(++nodes>budget){aborted=true;return;}
    let [x,y,dx,dy]=beam;
    const added=[], litAdded=[];
    const cleanup=()=>{for(const s of added)seen.delete(s);for(const i of litAdded){if(--litc[i]===0)litTotal--;}};
    while(true){
      x+=dx;y+=dy;
      if(x<0||y<0||x>=W||y>=H)break;
      const c=rows[y][x];
      if(c==='#')break;
      if(c==='X'){cleanup();return;}
      const k=x+','+y;
      if(c==='T'){const i=tIndex[k];if(litc[i]++===0)litTotal++;litAdded.push(i);}
      const s=k+','+dx+','+dy;
      if(seen.has(s))break;
      seen.add(s);added.push(s);
      if(c==='f'){[dx,dy]=turnSlash(dx,dy);continue;}
      if(c==='g'){[dx,dy]=turnBack(dx,dy);continue;}
      if(c==='p'||c==='q'){const [rx,ry]=c==='p'?turnSlash(dx,dy):turnBack(dx,dy); rest=[[x,y,rx,ry],...rest]; continue;}
      if(c==='.'){
        if(dec.has(k)){const m=dec.get(k); if(m==='/')[dx,dy]=turnSlash(dx,dy); else if(m==='\\')[dx,dy]=turnBack(dx,dy); continue;}
        for(const mm of ['','/','\\']){
          if(mm&&used>=limit)continue;
          dec.set(k,mm);
          const [ndx,ndy]=mm==='/'?turnSlash(dx,dy):mm==='\\'?turnBack(dx,dy):[dx,dy];
          walk([x,y,ndx,ndy],rest,used+(mm?1:0));
          dec.delete(k);
          if(aborted)break;
        }
        cleanup();return;
      }
    }
    if(rest.length) walk(rest[0],rest.slice(1),used);
    else if(litTotal===nt){
      const arr=[...dec].filter(e=>e[1]).sort((a,b)=>a[0]<b[0]?-1:1);
      const key=arr.map(e=>e.join(':')).join('|');
      if(!sols.has(key))sols.set(key,arr);
    }
    cleanup();
  }
  const beams=lasersOf(lv).map(l=>startBeam(l,W,H));
  walk(beams[0],beams.slice(1),0);
  if(aborted)return null;
  if(!sols.size)return {min:null,count:0,nodes};
  let min=Infinity; for(const a of sols.values())min=Math.min(min,a.length);
  const best=[...sols.values()].filter(a=>a.length===min);
  return {min,count:best.length,sol:best[0],nodes};
}

function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
function hashStr(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}

/* random level: fixed pieces first, then a hidden mirror layout, stars on its path, then verify */
function makeLevel(R, spec){
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
      if(c==='f'){[dx,dy]=turnSlash(dx,dy);continue;}
      if(c==='g'){[dx,dy]=turnBack(dx,dy);continue;}
      if(c==='p'||c==='q'){const [rx,ry]=c==='p'?turnSlash(dx,dy):turnBack(dx,dy);queue.push([x,y,rx,ry]);continue;}
      const first=!visited.has(kk); visited.add(kk);
      if(mir[kk]){[dx,dy]=mir[kk]==='/'?turnSlash(dx,dy):turnBack(dx,dy);continue;}
      if(first&&c==='.'&&fx<fixed&&R()<0.12){const ch=R()<.5?'f':'g';grid[y][x]=ch;fx++;[dx,dy]=ch==='f'?turnSlash(dx,dy):turnBack(dx,dy);continue;}
      if(first&&c==='.'&&sp<splits&&R()<0.12){const ch=R()<.5?'p':'q';grid[y][x]=ch;sp++;const [rx,ry]=ch==='p'?turnSlash(dx,dy):turnBack(dx,dy);queue.push([x,y,rx,ry]);continue;}
      if(placed<k&&first&&R()<0.3){mir[kk]=R()<.5?'/':'\\';placed++;[dx,dy]=mir[kk]==='/'?turnSlash(dx,dy):turnBack(dx,dy);continue;}
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
  let res;
  if(spec.loose){
    // big boards: prove there is no solution with fewer mirrors, and use the hidden layout as the answer
    const cheaper=solveLevel(lv,k-1,budget);
    if(!cheaper||cheaper.count>0)return null;
    if(!traceAll(lv,mir).allLit)return null;
    res={sol:Object.entries(mir).sort((a,b)=>a[0]<b[0]?-1:1),nodes:cheaper.nodes};
  } else {
    res=solveLevel(lv,k,budget);
    if(!res||res.min!==k||res.count>maxSols)return null;
  }
  // every fixed piece must matter: it has to be on the solved beam path
  const solMir={}; for(const [kk,m] of res.sol)solMir[kk]=m;
  const tr=traceAll(lv,solMir); const hit=new Set();
  for(const p of tr.paths)for(const [px,py] of p)hit.add(Math.floor(px)+','+Math.floor(py));
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if('fgpq'.includes(grid[y][x])&&!hit.has(x+','+y))return null;
  lv.sol=res.sol; lv.nodes=res.nodes;
  return lv;
}

function dailyLevel(dateStr){
  const R=mulberry32(hashStr('beam-'+dateStr));
  const v=hashStr(dateStr)%4;
  const specs=[
    {W:7,H:7,k:4,nt:3,walls:3,bombs:3,fixed:1,maxSols:2,budget:150000},
    {W:7,H:7,k:4,nt:3,walls:2,bombs:3,splits:1,maxSols:2,budget:150000},
    {W:7,H:7,k:5,nt:3,walls:3,bombs:3,maxSols:2,budget:150000},
    {W:7,H:7,k:3,nt:3,walls:2,bombs:2,lasers:2,maxSols:2,budget:150000},
  ];
  for(let i=0;i<300;i++){const lv=makeLevel(R,specs[v]);if(lv)return lv;}
  for(let i=0;i<300;i++){const lv=makeLevel(R,{W:6,H:6,k:3,nt:2,walls:2,bombs:2,maxSols:2,budget:100000});if(lv)return lv;}
  return {rows:["......","....T.","......","......",".T....","......"],lasers:[['L',1]],max:2,sol:[['5,1','\\'],['5,4','/']]};
}

if (typeof module !== 'undefined') module.exports = { traceAll, solveLevel, makeLevel, dailyLevel, mulberry32, hashStr };
