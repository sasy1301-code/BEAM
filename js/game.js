/* day / night: flip every dark-mode media block on or off by the saved choice */
function getTheme() { try { return localStorage.getItem('beam:theme') || 'auto'; } catch (e) { return 'auto'; } }
function applyTheme(t) {
  const walk = rules => { for (const r of rules) {
    if (r.media && (r._orig || r.media.mediaText).includes('prefers-color-scheme')) {
      r._orig = r._orig || r.media.mediaText;
      r.media.mediaText = t === 'dark' ? 'all' : t === 'light' ? 'not all' : r._orig;
    }
    if (r.cssRules) walk(r.cssRules);
  } };
  for (const sh of document.styleSheets) { try { walk(sh.cssRules); } catch (e) { /* cross-origin sheet */ } }
  for (const [id, v] of [['themeLight', 'light'], ['themeDark', 'dark'], ['themeAuto', 'auto']]) { const b = document.getElementById(id); if (b) b.setAttribute('aria-pressed', String(t === v)); }
}
function setTheme(t) { try { localStorage.setItem('beam:theme', t); } catch (e) { /* storage blocked */ } applyTheme(t); }
applyTheme(getTheme());
/* ================= language =================
   The game is written in Hebrew. Every visible string passes through T(), and when the language is English
   T() looks the Hebrew text up in EN below. Templates use a tag: T`שלב ${n}` is looked up as "שלב {}" and
   the English entry places the values with {0}, {1}… A string with no entry simply stays in Hebrew.
   The choice is remembered in the browser; without one, Hebrew browsers get Hebrew and everyone else English. */
const LANG = (() => {
  try { const s = localStorage.getItem('beam:lang'); if (s === 'he' || s === 'en') return s; } catch (e) { /* storage blocked */ }
  return /^(he|iw)\b/i.test(navigator.language || 'he') ? 'he' : 'en';
})();
function setLang(l) { try { localStorage.setItem('beam:lang', l); } catch (e) { /* storage blocked */ } location.reload(); }
const EN = {
  'אימוג׳ים': 'Emojis', 'סטים של 5 פרצופים לשליחה ליריב בדו-קרב. כל סט שקונים נוסף לבחירה במשחק.': 'Sets of 5 faces to send your opponent in a duel. Every set you buy is added to your picker.',
  'יש לכם': 'Owned', 'אימוג׳ים: {}': 'Emojis: {0}', 'הסט נוסף לדו-קרב': 'Set added to your duels',
  'נחיל גחליליות': 'Firefly swarm',
  'שועל הצללים': 'Shadow Fox', 'ארנבת הכוכבים': 'Star Bunny', 'ינשוף הלילה': 'Night Owl', 'חתול הירח': 'Moon Cat', 'קיפוד הברקים': 'Lightning Hedgehog', 'צפרדע הרעל': 'Poison Frog', 'דביבון התעלומות': 'Mystery Raccoon', 'איילת הזוהר': 'Aurora Deer', 'פרפר הקסם': 'Magic Butterfly', 'דרקון האש': 'Fire Dragon',
  'אתגר השבוע': 'Weekly challenge', 'בונים את הלוח של השבוע…': 'Building this week\'s board…', 'שיא חדש לשבוע!': 'New best this week!', 'אתגר השבוע הושלם!': 'Weekly challenge complete!',
  '{} נקודות בטבלת השבוע. {}:{} דקות, {}.{}': '{0} points on the weekly board. {1}:{2} minutes, {3}.{4}', 'לטבלת השבוע': 'To the weekly board', 'השבוע': 'This week', 'היום': 'Today',
  'לוח אחד קשה לכל השבוע. כולם מקבלים את אותו לוח': 'One hard board for the whole week. Everyone gets the same one', 'אף אחד עוד לא פתר את אתגר השבוע.': 'Nobody has solved this week\'s challenge yet.',
  'התקנה במסך הבית': 'Add to home screen', 'פתיחה בלחיצה אחת, במסך מלא, כמו אפליקציה.': 'Opens with one tap, full screen, like an app.', 'להוספה למסך הבית': 'Add it', 'BEAM במסך הבית': 'BEAM on your home screen',
  'ככה המשחק נפתח במסך מלא, כמו אפליקציה, בלגיעה אחת.': 'The game then opens full screen, like an app, with one tap.', 'לוחצים על כפתור השיתוף בתחתית הדפדפן (ריבוע עם חץ למעלה).': 'Tap the Share button at the bottom of the browser (a square with an arrow).',
  'גוללים ובוחרים "הוספה למסך הבית".': 'Scroll and choose "Add to Home Screen".', 'לוחצים "הוסף", והגחלילית מחכה לכם במסך הבית.': 'Tap "Add" and the firefly is waiting on your home screen.',
  'פותחים את התפריט של הדפדפן (שלוש הנקודות).': 'Open the browser menu (the three dots).', 'בוחרים "הוספה למסך הבית" או "התקנת אפליקציה".': 'Choose "Add to Home screen" or "Install app".', 'הבנתי': 'Got it', 'המשחק נוסף למסך הבית': 'The game is on your home screen',
  'שומרים את ההתקדמות?': 'Keep your progress safe?', 'כבר פתרתם {} שלבים! חברו חשבון, וההתקדמות, הנקודות והקניות יישמרו גם אם תחליפו טלפון או תמחקו את הדפדפן.': 'You have solved {0} levels already! Connect an account and your progress, points and purchases stay safe even if you change phones or clear the browser.', 'אולי אחר כך': 'Maybe later',
  'חדש בלוח!': 'New on the board!', 'הבנתי, בואו נשחק': 'Got it, let\'s play',
  'לשחק ולצבור נקודות': 'Play and earn points', 'הבית עולה {}. חסרות עוד {} נקודות.': 'The house costs {0}. You need {1} more points.',
  'הגחלילית צריכה בית!': 'The firefly needs a home!', 'בונים לה בית, ואז ממלאים את הגן ואת הבית בקישוטים.': 'Build her a house, then fill the garden and the house with decorations.', 'בנו בית · {}': 'Build a house · {0}', 'חסרות {} נקודות': '{0} points short',
  'בום! הפצצה התפוצצה, והסיבוב עובר ליריב.': 'Boom! The bomb went off, and the round goes to your opponent.',
  'שליחת אימוג׳י': 'Send an emoji', 'שלחתם': 'Sent',
  'הנקודות כבר בארנק שלכם.': 'The points are already in your wallet.', 'תודה!': 'Thanks!',
  'עוד פעולות': 'More', 'לראות את הלוח בזמן אמת': 'See the board live', 'נקודות מהארנק שלכם': 'Points from your wallet', 'הזמנה לדו-קרב': 'Invite to a duel', 'בוחרים רמת קושי וסכום': 'Pick a difficulty and a stake', 'אפשר כשהחבר מחובר ופנוי': 'When your friend is online and free', 'הסרה מהחברים': 'Remove from friends',
  'סובבו את הטלפון לאורך': 'Turn your phone upright',
  'מתחברים…': 'Connecting…', 'אי אפשר לצפות ביריב באמצע דו-קרב': 'You cannot watch your opponent during a duel', '{} לא משחק כרגע': '{0} is not playing right now', 'דו-קרב · סיבוב {}': 'Duel · round {0}', '{} פתר את הלוח!': '{0} solved the board!', 'מהלכים: {}': 'Moves: {0}', 'צפייה במשחק': 'Watch the game',
  'רמת קושי': 'Difficulty', 'קל': 'Easy', 'בינוני': 'Medium', 'קשה': 'Hard',
  'פרק {} מתוך {}': 'Chapter {0} of {1}', 'פרס הפרק!': 'Chapter prize!', 'הפרק הושלם · לפרק הבא': 'Chapter complete · on to the next', 'הפרק הושלם': 'Chapter complete', 'פרס הפרק · עוד שלב אחד': 'Chapter prize · 1 level to go', 'פרס הפרק · עוד {} שלבים': 'Chapter prize · {0} levels to go', 'לפרק הבא': 'Next chapter',
  'שליחת מתנה': 'Send a gift', 'מתנה ל-{}': 'A gift for {0}', 'הנקודות יורדות מהארנק שלכם. יש לכם {}.': 'The points come out of your wallet. You have {0}.', 'שליחה': 'Send', 'המתנה נשלחה ל-{}': 'Gift sent to {0}', 'הגעתם למכסת המתנות להיום. נסו שוב מחר.': 'You have reached today\'s gift limit. Try again tomorrow.', 'אפשר לשלוח מתנות רק לחברים': 'Gifts can only be sent to friends', 'מתנה מ-{}!': 'A gift from {0}!',
  'קיבלתם מתנה!': 'You got a gift!',
  'אין לכם מספיק נקודות': 'You do not have enough points', 'הדו-קרב על {} נקודות ויש לכם {}. חסרות {}.': 'The duel is for {0} points and you have {1}. You are {2} short.', '{} מזמין לדו-קרב': '{0} invites you to a duel',
  'חברים': 'Friends', 'חברים מחוברים': 'Friends online', '+ הוספת חבר': '+ Add a friend', 'בקשות חברות': 'Friend requests', 'אף חבר לא מחובר כרגע. אפשר להזמין בקישור.': 'No friend is online right now. You can invite with a link.', 'עוד אין לכם חברים כאן. מוסיפים חברים מהכפתור "חברים" במסך הבית.': 'No friends here yet. Add friends from the Friends button on the home screen.',
  'זהירות! עוד שתי פגיעות בפצצה והיא מתפוצצת.': 'Careful! Two more hits and the bomb blows up.',
  'הוספת חבר': 'Add a friend', 'חיפוש לפי שם שחקן': 'Search by player name', 'חיפוש': 'Search', 'שיחקתם לאחרונה': 'Played recently', 'כבר חברים': 'Already friends', 'הוספה': 'Add', 'לא נמצא שחקן בשם הזה': 'No player with that name', 'כתבו לפחות שתי אותיות': 'Type at least two letters', 'מחפשים…': 'Searching…', 'יש יותר מדי בקשות פתוחות': 'Too many open requests',
  'נקודות': 'Points', 'הכי משתלם': 'Best value', 'אוצר': 'Treasure', 'חסרות נקודות ללוח או לדמות? אפשר להשלים כאן.': 'Short on points for a board or a character? Top up here.', 'בקרוב': 'Coming soon', 'הבנתי': 'Got it', 'הנקודות נוספו': 'Points added',
  'התשלום ייפתח בקרוב. בינתיים אפשר לצבור נקודות בשלבים, באתגר היומי ובדו-קרב.': 'Payments open soon. Meanwhile you can earn points in levels, the daily challenge and duels.',
  'פריחת שקיעה': 'Sunset bloom', 'פטריות קסם': 'Magic mushrooms', 'שמש וירח': 'Sun and moon',
  'יער קסום': 'Enchanted forest', 'גן פרחים': 'Flower garden', 'קריסטל ירח': 'Moon crystal',
  'עדינה': 'Gentle', 'תיבת נגינה': 'Music box',
  'נקודות': 'Points',
  'הבסיס': 'Basics', 'מכשולים': 'Obstacles',
  'אבקת קסם': 'Magic dust', 'שלג קריסטל': 'Crystal snow', 'שובל קשת': 'Rainbow trail', 'ברק': 'Lightning', 'שער האור': 'Gate of light',
  'פרק {}': 'Chapter {0}', '{} מתוך {} כוכבים': '{0} of {1} stars',
  'ממשיכים כאן · שלב {}': 'Continue here · level {0}', 'הושלם': 'Done',
  'הפסקה': 'Paused', 'חזרה למפה': 'Back to the map', 'יציאה': 'Leave', 'חינם': 'Free', 'השהיה': 'Pause', 'שלב עם עזרה שווה כוכב אחד ורבע מהנקודות': 'A level with help is worth one star and a quarter of the points',
  'דמויות': 'Characters', 'גחלילית': 'Firefly', 'שועלה חוקרת': 'Fox explorer', 'ארנבת ממציאה': 'Bunny inventor', 'ינשוף קוסם': 'Owl wizard', 'חתול נינג\'ה': 'Ninja cat', 'קיפודה גננת': 'Hedgehog gardener', 'צפרדע אלכימאי': 'Frog alchemist',
  'דביבון מכונאי': 'Raccoon mechanic', 'איילה שומרת': 'Deer guardian', 'נסיכת העשים': 'Moth princess', 'דרקונצ\'יק': 'Baby dragon', 'חד-קרן': 'Unicorn', 'הדמות הזאת מחכה לכם בחנות': 'This character is waiting for you in the shop',
  'מראה אחת': '1 mirror',
  'בואו נשחק': 'Let\'s play', 'כבר שיחקתם? התחברו וההתקדמות תחזור': 'Played before? Sign in and your progress comes back', 'ההתקדמות נשמרת ומגובה גם בלי חשבון. אפשר לחבר חשבון בכל רגע מההגדרות.': 'Your progress is saved and backed up even without an account. You can connect one any time in Settings.', 'קרן': 'Beam', 'לוח': 'Board', 'אפקט': 'Effect',
  'כל הפרקים': 'All chapters', 'בונוס יומי': 'Daily bonus', 'הזמנת חבר': 'Invite a friend', 'מובילים': 'Leaders', 'בית': 'Home', 'קישוט': 'Decorate',
  'מתחילים': 'Let\'s start', 'ממשיכים': 'Continue', 'סיימתם הכול!': 'All done!', 'שלב {}': 'Level {0}', '{} מראות': '{0} mirrors', 'יש לי קוד': 'I have a code',
  'ניצחונות': 'Wins', 'הפסדים': 'Losses', 'תיקו': 'Draws', 'הבונוס של היום כבר נאסף. חזרו מחר!': 'Today\'s bonus is already collected. Come back tomorrow!',
  // ---- static page text ----
  'טוענים את האור…': 'Lighting up…', 'עזרו לגחלילית להדליק את כל הכוכבים': 'Help the firefly light every star',
  'המשך עם Google': 'Continue with Google', 'המשך עם Facebook': 'Continue with Facebook', 'או': 'or', 'כניסה כאורח': 'Play as a guest',
  'גם כאורח ההתקדמות נשמרת ומגובה. אפשר לחבר חשבון בכל רגע מההגדרות.': 'Guest progress is saved and backed up too. You can connect an account any time in Settings.',
  'פרופיל ושם': 'Profile and name', 'הגדרות': 'Settings', 'נקודות לקניות': 'Points to spend', 'אתגר יומי': 'Daily challenge', 'שחק': 'Play',
  'טבלת מובילים': 'Leaderboard', 'הישגים': 'Achievements', 'איך משחקים': 'How to play', 'מקום לפרסומת': 'Ad space', 'כאן יוצג באנר פרסומי': 'A banner ad will appear here',
  'הסרת פרסומות': 'Remove ads', 'שלבים': 'Levels', 'פרקים, החליקו לצדדים': 'Chapters, swipe sideways', 'מעבר בין פרקים': 'Switch chapter',
  '› חזרה': '‹ Back', 'השתקה': 'Mute', 'איפוס': 'Reset', 'קניית מראה נוספת': 'Buy an extra mirror', 'פטיש לשבירת חסימה': 'Hammer to break a block', 'רמז': 'Hint',
  'קונים בנקודות. שלב עם עזרה שווה כוכב אחד ורבע מהנקודות.': 'Bought with points. A level solved with help earns one star and a quarter of the points.',
  'נסו שוב לשלושה כוכבים': 'Try again for three stars', 'שתפו את התוצאה': 'Share your result', 'כל הזמנים': 'All time', 'האתגר של היום': "Today's challenge",
  'אין חיבור לטבלה כרגע. מוצגות רק התוצאות שלכם.': 'The leaderboard is unreachable right now. Only your own results are shown.',
  'השם והניקוד שלכם גלויים לכל מי שמשחק במשחק הזה.': 'Your name and score are visible to everyone who plays this game.', 'שנו שם': 'Change name',
  'צלילים ורטט': 'Sound and vibration', 'אפקטים קוליים': 'Sound effects', 'מוזיקת רקע במשחק': 'Music while playing', 'רטט': 'Vibration',
  '· לא נתמך במכשיר הזה': '· not supported on this device', 'סגנון מוזיקה': 'Music style', 'רגועה': 'Calm', 'קצבית': 'Upbeat',
  'שם בטבלת המובילים': 'Leaderboard name', 'שינוי שם': 'Change name', 'הסרת השם והניקוד מהטבלה': 'Remove my name and score from the leaderboard',
  'איפוס התקדמות': 'Reset progress', 'מוחק שלבים, כוכבים, נקודות והישגים. רכישות נשמרות.': 'Erases levels, stars, points and achievements. Purchases are kept.',
  'מדיניות פרטיות': 'Privacy Policy', 'תמיכה': 'Support', 'שפה': 'Language', 'מדבקות לוואטסאפ': 'WhatsApp stickers', '12 הגחליליות של המשחק, לשמירה בטלפון ולשליחה בוואטסאפ.': "The game's 12 fireflies, to save on your phone and send on WhatsApp.", 'להורדת המדבקות': 'Get the stickers', 'הקישו על גחלילית כדי לשמור אותה, או שמרו את כולן יחד.': 'Tap a firefly to save it, or save them all at once.', 'שמירת כל ה-12': 'Save all 12', 'איך מוסיפים לוואטסאפ?': 'How to add them to WhatsApp?', 'לוחצים "שמירת כל ה-12" ובוחרים "שמירת תמונות".': 'Tap "Save all 12" and choose "Save images".', 'בוואטסאפ פותחים צ׳אט, נוגעים בסמל המדבקות ואז ב-+ (יצירת מדבקה).': 'In WhatsApp open a chat, tap the sticker icon, then + (Create sticker).', 'בוחרים גחלילית מהתמונות, והיא נשמרת אצלכם כמדבקה.': 'Pick a firefly from your photos and it is saved as a sticker.', 'לוחצים "שמירת כל ה-12" ושומרים את הקבצים בטלפון.': 'Tap "Save all 12" and keep the files on your phone.', 'פותחים אפליקציית מדבקות (למשל Sticker.ly) ויוצרים חבילה חדשה מהתמונות.': 'Open a sticker app (for example Sticker.ly) and make a new pack from the images.', 'לוחצים "הוספה לוואטסאפ", והחבילה מופיעה אצלכם במדבקות.': 'Tap "Add to WhatsApp" and the pack shows up in your stickers.', 'תצוגה': 'Display', 'יום': 'Day', 'אוטומטי': 'Auto',
  'הגחלילית יורה קרן אור. הציבו מראות כך שהקרן תעבור דרך כל הכוכבים.': 'The firefly shoots a beam of light. Place mirrors so the beam passes through every star.',
  'מראות': 'Mirrors', 'הקישו על משבצת כדי להציב מראה. הקשה שנייה מסובבת אותה, ושלישית מסירה. מראה מפנה את הקרן ברבע סיבוב.': 'Tap a tile to place a mirror. A second tap turns it, a third removes it. A mirror bends the beam a quarter turn.',
  'כוכבים': 'Stars', 'הקרן עוברת דרכם, מדליקה אותם וממשיכה הלאה. השלב נגמר כשכל הכוכבים דולקים.': 'The beam passes through them, lights them and carries on. The level ends when every star is lit.',
  'חסימות': 'Blocks', 'משבצות עם איקס עוצרות את הקרן.': 'Tiles with an X stop the beam.',
  'פצצות': 'Bombs', 'אם קרן כלשהי נוגעת בפצצה, הכול נכבה. יש רגע לתקן. מי שמשאיר את הקרן על פצצה שלוש פעמים באותו שלב, הפצצה מתפוצצת והשלב מתחיל מחדש. בדו-קרב, פיצוץ מעביר את הסיבוב ליריב.': 'If any beam touches a bomb, everything goes dark. You have a moment to fix it. Leave the beam on a bomb three times in the same level and it blows up, and the level starts over. In a duel, a blast hands the round to your opponent.',
  'מראות קבועות': 'Fixed mirrors', 'מראות כהות עם ברגים. הן כבר מותקנות, ואי אפשר להזיז או לסובב אותן.': 'Dark mirrors with bolts. They are already installed and cannot be moved or turned.',
  'זכוכית מפצלת': 'Splitter glass', 'חלק מהאור ממשיך ישר וחלק מוחזר הצידה. מקרן אחת נוצרות שתיים, וכל אחת מהן יכולה להדליק כוכבים או לפגוע בפצצה.': 'Part of the light goes straight on and part is turned aside. One beam becomes two, and each can light stars or hit a bomb.',
  'שתי גחליליות': 'Two fireflies', 'בשלבים המתקדמים יש שתי קרניים. כל מראה משפיעה על שתיהן.': 'Later levels have two beams. Every mirror affects both.',
  'שלושה כוכבים': 'Three stars', 'כל הקשה היא מהלך. פתרו בלי עזרה ובתוך יעד המהלכים כדי לקבל שלושה כוכבים ואת מלוא הנקודות. לכל שלב יש זמן מוגבל, חצי דקה לכל מראה. כשהזמן נגמר מתחילים את השלב מחדש.': 'Every tap is a move. Solve without help and within the move target for three stars and full points. Every level has a time limit, half a minute per mirror. When time runs out the level starts again.',
  'מה עושים עם הנקודות': 'What points are for', 'הנקודות שצברתם קובעות את הדרגה והמקום בטבלה, ונשארות שם תמיד. במקביל יש לכם יתרה לקניות. המחיר תלוי בשלב: רמז עולה 100 נקודות לכל מראה בשלב, ומראה נוספת או פטיש 75 לכל מראה. רמזים יכולים להציב עד חצי מהמראות בשלב. שלב שנפתר עם עזרה שווה רבע מהנקודות.': 'The points you earn set your rank and leaderboard place, and never go down. Alongside them you have a balance to spend. Prices depend on the level: a hint costs 100 points per mirror in the level, an extra mirror or a hammer 75 per mirror. Hints can place up to half of a level\'s mirrors. A level solved with help is worth a quarter of the points.',
  'פטיש': 'Hammer', 'מופיע רק בשלבים שבהם שבירת חסימה באמת עוזרת, כלומר מאפשרת פתרון עם פחות מראות. לחצו על הפטיש, והחסימות ששווה לשבור יתחילו להבהב.': 'Appears only in levels where breaking a block really helps, meaning it allows a solution with fewer mirrors. Tap the hammer and the blocks worth breaking start to blink.',
  'שלב חדש בכל יום, זהה לכל השחקנים. הניקוד תלוי במהירות ובמספר המהלכים, ונכנס לטבלת המובילים.': 'A new level every day, the same for all players. Your score depends on speed and move count, and goes on the leaderboard.',
  'נסו בעצמכם': 'Try it yourself', 'הציבו מראה אחת כך שהקרן תפנה למעלה אל הכוכב.': 'Place one mirror so the beam turns up toward the star.', 'טיפים': 'Tips',
  'התחילו מהסוף.': 'Start from the end.', 'חשבו מאיזה כיוון הקרן יכולה להגיע לכוכב הרחוק ביותר, ובנו את המסלול לאחור.': 'Think which way the beam can reach the farthest star, and build the path backwards.',
  'ספרו פניות.': 'Count the turns.', 'כל פנייה במסלול דורשת מראה. מספר המראות שקיבלתם הוא רמז.': 'Every turn in the path needs a mirror. The number of mirrors you are given is a clue.',
  'עקבו אחרי כל הקרניים.': 'Follow every beam.', 'עם זכוכית מפצלת או שתי גחליליות, מראה שעוזרת לקרן אחת יכולה לשלוח את השנייה לפצצה.': 'With splitter glass or two fireflies, a mirror that helps one beam can send the other into a bomb.',
  'חשבו לפני שמקישים.': 'Think before you tap.', 'כל הקשה נספרת, ושלושה כוכבים שווים את מלוא הנקודות.': 'Every tap counts, and three stars are worth full points.',
  'התחילו לשחק': 'Start playing',
  // ---- game data ----
  'הארה': 'Light', 'מבוך': 'Maze', 'ליקוי': 'Eclipse', 'קבועות': 'Fixed', 'פיצול': 'Split', 'תאומות': 'Twins', 'מאסטר': 'Master',
  'מראות, כוכבים וחסימות.': 'Mirrors, stars and blocks.', 'לא כל דרך פתוחה.': 'Not every path is open.', 'לוחות גדולים, פתרון אחד.': 'Big boards, one solution.',
  'שש מראות ומעלה.': 'Six mirrors and more.', 'מראות שאי אפשר להזיז.': 'Mirrors that cannot be moved.', 'קרן אחת, שני כיוונים.': 'One beam, two directions.',
  'שתי גחליליות, לוח אחד.': 'Two fireflies, one board.', 'רק לחזקים.': 'For the strong only.',
  'הקישו על משבצת כדי להציב מראה. הקשה נוספת מסובבת אותה, ושלישית מסירה.': 'Tap a tile to place a mirror. Another tap turns it, a third removes it.',
  'הקרן עוברת דרך כוכבים וממשיכה הלאה. הדליקו את שניהם.': 'The beam passes through stars and carries on. Light them both.',
  'פצצה: אם הקרן נוגעת בה, הכול נכבה.': 'Bomb: if the beam touches it, everything goes dark.', 'הקרן יכולה לחצות את עצמה.': 'The beam can cross itself.',
  'המראות הכהות עם הברגים כבר מותקנות. אי אפשר להזיז אותן, אבל הקרן מוחזרת מהן.': 'The dark mirrors with bolts are already installed. They cannot be moved, but the beam bounces off them.',
  'זכוכית מפצלת: חלק מהאור ממשיך ישר וחלק מוחזר הצידה. עקבו אחרי שתי הקרניים.': 'Splitter glass: part of the light goes straight on and part is turned aside. Follow both beams.',
  'שתי גחליליות. כל מראה משפיעה על שתי הקרניים, וכל אחת מהן יכולה לפגוע בפצצה.': 'Two fireflies. Every mirror affects both beams, and either one can hit a bomb.',
  'הכול ביחד, על לוחות גדולים. קחו את הזמן.': 'Everything together, on big boards. Take your time.',
  'ניצוץ': 'Spark', 'גחלילית': 'Firefly', 'פנס': 'Lantern', 'מגדלור': 'Lighthouse', 'ירח': 'Moon', 'שמש': 'Sun', 'גלקסיה': 'Galaxy',
  'אור ראשון': 'First light', 'פתרו את השלב הראשון': 'Solve the first level', 'מושלם': 'Perfect', 'קבלו שלושה כוכבים בשלב': 'Get three stars on a level',
  'בלי עזרה': 'No help needed', 'שלושה כוכבים בשלב מהפרק האחרון': 'Three stars on a level in the last chapter', 'אספן כוכבים': 'Star collector', 'צברו 60 כוכבים': 'Collect 60 stars',
  'שמיים זרועי כוכבים': 'A sky full of stars', 'צברו את כל {} הכוכבים': 'Collect all {0} stars', 'אתגר ראשון': 'First challenge', 'סיימו אתגר יומי': 'Finish a daily challenge',
  'שבוע של אתגרים': 'A week of challenges', 'סיימו 7 אתגרים יומיים': 'Finish 7 daily challenges', 'חוזרים לאור': 'Back to the light', 'היכנסו שלושה ימים ברצף': 'Come back three days in a row',
  'שבוע זוהר': 'A glowing week', 'היכנסו שבעה ימים ברצף': 'Come back seven days in a row', 'פרק {}': '{0} chapter', 'השלימו את כל שלבי פרק {}': 'Finish every level in chapter {0}',
  // ---- duel ----
  'דו-קרב': 'Duel', 'מי פותר ראשון?': 'Who solves it first?', 'שחקו מול חברים': 'Play your friends', 'סיבוב {} · עד 3 ניצחונות': 'Round {0} · first to 3',
  'הראשון שמדליק את כל הכוכבים מנצח': 'First to light every star wins',
  'שני שחקנים, אותו לוח. הראשון שמדליק את כל הכוכבים מנצח בסיבוב. מי שמגיע ל-3 ניצחונות מנצח.': 'Two players, the same board. First to light every star takes the round. First to 3 wins takes the duel.',
  'הזמנת חבר': 'Invite a friend', 'קיבלתם קוד מחבר?': 'Got a code from a friend?', 'קוד חדר': 'Room code', 'הצטרפות': 'Join',
  'פותחים חדר…': 'Opening a room…', 'מצטרפים לחדר…': 'Joining the room…', 'החדר הזה כבר מלא': 'This room is already full',
  'צריך לרענן את הדף כדי לשחק מול החבר': 'Refresh the page to play your friend', 'לא מצאנו חדר עם הקוד הזה': 'No room found with that code',
  'החיבור נקטע. מנסים להתחבר מחדש…': 'Connection lost. Reconnecting…', 'החדר נסגר': 'The room was closed',
  'שלחו את הקישור או את הקוד לחבר': 'Send the link or the code to a friend', 'ממתינים ליריב…': 'Waiting for your opponent…', 'שליחת הקישור': 'Send the link',
  'החדר נשאר פתוח כל עוד המסך הזה פתוח.': 'The room stays open as long as this screen is open.',
  'בואו לדו-קרב ב-BEAM! מי פותר ראשון?': 'Duel me in BEAM! Who solves it first?', 'הקישור הועתק, אפשר להדביק ולשלוח': 'Link copied, ready to paste and send',
  'הסיבוב נגמר בתיקו': 'The round was a draw', 'ניצחתם בסיבוב!': 'You won the round!', 'היריב היה מהיר יותר': 'Your opponent was faster', 'יריב נמצא!': 'Opponent found!',
  'הלוח ייחשף לשניכם באותו רגע.': 'The board appears for both of you at the same moment.', 'פתרתם! בודקים מי היה ראשון…': 'Solved! Checking who was first…',
  'היריב עזב את המשחק': 'Your opponent left the game', 'תיקו!': 'A draw!', 'ניצחתם בדו-קרב!': 'You won the duel!', 'הפעם היריב ניצח': 'Your opponent won this time',
  'היריב רוצה משחק חוזר. לשחק!': 'Your opponent wants a rematch. Play!', 'משחק חוזר': 'Rematch', 'חזרה לבית': 'Back home',
  'הפרופיל שלי': 'My profile', 'בחרו דמות': 'Choose your character', 'דמות': 'Character', 'דו-קרב: {} ניצחונות': 'Duels: {0} wins', 'שם ודמות': 'Name and character',
  '★ {} · {} שלבים · {} בלי עזרה': '★ {0} · {1} levels · {2} unaided',
  'על מה משחקים?': 'What are you playing for?', 'שני השחקנים שמים את אותו סכום, והמנצח לוקח את הקופה.': 'Both players put in the same amount, and the winner takes the pot.',
  '{} נקודות': '{0} points', 'משחק ידידותי': 'Friendly match', 'הדו-קרב הזה על {} נקודות, ואין לכם מספיק': 'This duel is for {0} points, and you do not have enough',
  'דו-קרב על {} נקודות': 'Duel for {0} points', '{} מזמין לדו-קרב. המנצח לוקח {}.': '{0} invites you to a duel. The winner takes {1}.', 'סיבוב {} · הקופה: {}': 'Round {0} · pot: {1}',
  'שמתם בקופה': 'You put in', 'אין מספיק נקודות למשחק חוזר': 'Not enough points for a rematch', 'כולל הקופה: {}': 'Including the pot: {0}', 'הקופה של {} הלכה ליריב': 'The pot of {0} went to your opponent',
  'משחקים על {} נקודות. המנצח לוקח {}.': 'Playing for {0} points. The winner takes {1}.',
  'זהירות! עוד פגיעה בפצצה והיא מתפוצצת.': 'Careful! One more hit and the bomb blows up.', 'בום! הפצצה התפוצצה, והלוח התאפס.': 'Boom! The bomb blew up and the board was wiped.', 'בום! הפצצה התפוצצה.': 'Boom! The bomb blew up.',
  'הקרן נגעה בפצצה שלוש פעמים. מתחילים את השלב מחדש.': 'The beam touched a bomb three times. The level starts over.', 'הקרן על פצצה! הזיזו את המראה מהר.': 'The beam is on a bomb! Move the mirror quickly.', 'נסו שוב': 'Try again',
  // ---- garden ----
  'בנו לה בית וקשטו את הגן': 'Build her a house and decorate the garden', 'כניסה': 'Enter', 'מה מוסיפים לגן?': 'What goes in the garden?', '{} מתוך {} פריטים בגן': '{0} of {1} items in the garden',
  'הגן עוד ריק. התחילו מבית לגחלילית!': 'The garden is empty. Start with a house for the firefly!', 'הושלם': 'Complete', 'שדרוג הבית': 'House upgrade', 'הבית הראשון': 'The first house', 'הבית הכי גדול': 'The biggest house',
  'בית קטן': 'Small house', 'בית משפחתי': 'Family house', 'ארמון': 'Palace', 'פרח': 'Flower', 'אבן': 'Stone', 'פטריה זוהרת': 'Glowing mushroom', 'פנס': 'Lamp', 'שיח פרחים': 'Flower bush', 'צמח אורות': 'Light plant',
  'משפחת פטריות': 'Mushroom family', 'אדנית פרחים': 'Flower box', 'הבית מוכן!': 'The house is ready!', 'נוסף לגן': 'Added to the garden', 'הגן מושלם!': 'The garden is complete!',
  'הגן': 'Garden', 'בתוך הבית': 'Inside the house', 'מה מוסיפים לבית?': 'What goes in the house?', 'קודם בונים בית, ואז אפשר להיכנס': 'Build a house first, then you can go in', 'יציאה לגן': 'Out to the garden',
  'הקישו על הבית כדי להיכנס': 'Tap the house to go inside', 'נוסף לבית': 'Added to the house', 'הגן והבית מושלמים!': 'The garden and the house are complete!',
  'שטיח פרח': 'Flower rug', 'עציץ זוהר': 'Glowing plant', 'אדנית לחלון': 'Window box', 'מנורת קיר': 'Wall lamp', 'מדף שיקויים': 'Potion shelf', 'מנורת פרח': 'Flower lamp', 'כורסה': 'Armchair', 'טלסקופ': 'Telescope',
  'הקרן פוגעת בפצצה. הסיטו אותה עם מראה.': 'The beam is hitting a bomb. Turn it away with a mirror.',
  'ברוכים הבאים ל-BEAM!': 'Welcome to BEAM!', 'הגחלילית צריכה עזרה להדליק את הכוכבים. בואו נלמד איך משחקים, זה לוקח חצי דקה.': 'The firefly needs help lighting the stars. Let\'s learn how to play. It takes half a minute.',
  'בואו נתחיל': 'Let\'s start', 'אני כבר יודע לשחק': 'I already know how to play', 'המראה הזו לא במקום. הקישו עליה עד שהיא נעלמת.': 'This mirror is in the wrong place. Tap it until it disappears.',
  'הקישו על המשבצת המסומנת כדי להציב מראה. המראה מפנה את הקרן.': 'Tap the marked cell to place a mirror. A mirror turns the beam.', 'יפה! עכשיו הקישו עליה שוב כדי לסובב אותה אל הכוכב.': 'Nice! Now tap it again to turn it toward the star.',
  'נגמר הזמן!': 'Time is up!', 'לא נורא. מתחילים את השלב מחדש, או ממשיכים מאותה נקודה עם עוד דקה.': 'Never mind. Start the level again, or carry on from here with one more minute.',
  'עוד דקה · {} נקודות': 'One more minute · {0} points', 'קיבלתם עוד דקה. עזרה מגבילה את השלב לכוכב אחד.': 'You have one more minute. Help caps the level at one star.',
  'הפרק הקודם': 'Previous chapter', 'הפרק הבא': 'Next chapter', 'השער לפרק הבא': 'The gate to the next chapter', 'קודם פותרים את השלב שלפניו': 'Solve the level before it first',
  'השער נפתח כשפותרים את כל שלבי הפרק': 'The gate opens when every level in the chapter is solved', 'סיימתם את כל הפרקים!': 'You finished every chapter!',
  'המשך': 'Continue', 'השער נפתח!': 'The gate is open!',
  // ---- shop ----
  'חנות': 'Shop', 'קונים בנקודות שבארנק. הדירוג בטבלה לא יורד.': 'Bought with the points in your wallet. Your leaderboard rank never drops.', 'צבע הקרן': 'Beam colour', 'בקרוב': 'Coming soon',
  'קלאסית': 'Classic', 'זהב': 'Gold', 'קרח': 'Ice', 'ליים': 'Lime', 'סגול לילה': 'Night violet', 'אש': 'Fire', 'קשת': 'Rainbow', 'אבק כוכבים': 'Stardust',
  'בשימוש': 'In use', 'בחירה': 'Use', 'דמויות': 'Characters', 'לוחות': 'Boards', 'הגן של הגחלילית': 'The firefly\'s garden', 'אפקטי ניצחון': 'Win effects',
  'עיצוב הלוח': 'Board theme', 'אפקט ניצחון': 'Win effect', 'קלאסי': 'Classic', 'ממתקים': 'Candy', 'אוקיינוס': 'Ocean', 'יער': 'Forest', 'לילה': 'Night', 'מלכותי': 'Royal',
  'בלי אפקט': 'No effect', 'קונפטי': 'Confetti', 'בועות': 'Bubbles', 'גשם כוכבים': 'Star shower', 'לבבות': 'Hearts', 'זיקוקים': 'Fireworks', 'תצוגה מקדימה': 'Preview', 'נוסף לאוסף שלכם': 'Added to your collection',
  'המחיר: {} נקודות. יישארו לכם {}.': 'Price: {0} points. You will have {1} left.', 'קנייה': 'Buy', 'הקרן החדשה שלכם מוכנה': 'Your new beam is ready',
  // ---- friends ----
  'החברים שלי': 'My friends', 'חברים': 'Friends', 'שליחת קישור לחבר': 'Send a link to a friend', 'שליחה בוואטסאפ': 'Send on WhatsApp', 'שיתוף באפליקציה אחרת': 'Share with another app', 'העתקת הקישור': 'Copy the link', 'סגירה': 'Close', 'הצג אותי כמחובר לחברים': 'Show me as online to friends', 'הזמנה בקישור': 'Invite by link',
  'ממתינים ל-{}…': 'Waiting for {0}…', 'הוספת {} לחברים': 'Add {0} to friends', 'אתם חברים עכשיו': 'You are friends now', 'בקשת החברות נשלחה': 'Friend request sent',
  'יש לכם בקשת חברות חדשה': 'You have a new friend request', '{} חברים מחוברים עכשיו': '{0} friends online now', 'ההזמנה כבר לא בתוקף': 'That invitation is no longer open',
  'הזמנה לדו-קרב מ-{}': '{0} invites you to a duel', 'קבל': 'Accept', 'לא עכשיו': 'Not now', '{}: לא עכשיו': '{0}: not now', 'אין תשובה מ-{}': 'No answer from {0}',
  'טוען…': 'Loading…', 'מחוברים עכשיו: {}': 'Online now: {0}', 'חבר אחד מחובר עכשיו': '1 friend online now', 'עוד אין לכם חברים כאן. שלחו קישור לחבר, או חפשו שחקן לפי שם.': 'No friends here yet. Send a friend a link, or search for a player by name.',
  'בקשת חברות': 'Friend request', 'ממתין לאישור': 'Waiting for approval', 'לא מחובר': 'Offline', 'בדו-קרב': 'In a duel', 'משחק כרגע': 'Playing now', 'מחובר': 'Online',
  'אישור': 'Accept', 'דחייה': 'Decline', 'הזמן לדו-קרב': 'Invite', 'הסרת חבר': 'Remove friend', 'ביטול הבקשה': 'Cancel request', 'להסיר את {} מהחברים?': 'Remove {0} from your friends?', 'הסרה': 'Remove',
  '{} כבר לא מחובר': '{0} is no longer online', 'בואו נהיה חברים ב-BEAM ונשחק דו-קרב!': 'Be my friend on BEAM and let\'s duel!',
  'זה הקישור שלכם. שלחו אותו לחבר.': 'That is your own link. Send it to a friend.', 'הקישור הזה כבר לא פעיל': 'This link is no longer active',
  'ההזמנה נשלחה': 'Invitation sent',
  // ---- account & backup ----
  'ההתחברות לא הושלמה': 'Sign-in was not completed', 'בחשבון הזה כבר יש התקדמות': 'This account already has progress',
  'בחשבון: {} כוכבים. במכשיר הזה: {} כוכבים. אם תמשיכו עם החשבון, ההתקדמות שבמכשיר הזה תוחלף.': 'Account: {0} stars. This device: {1} stars. If you continue with the account, the progress on this device is replaced.',
  'המשך עם החשבון': 'Continue with the account', 'ביטול והתנתקות': 'Cancel and sign out', 'לא מצאנו גיבוי לקישור הזה': 'No backup found for this link',
  'לשחזר את ההתקדמות?': 'Restore your progress?', 'ההתקדמות שבמכשיר הזה תוחלף בהתקדמות מהקישור.': 'The progress on this device will be replaced by the progress from the link.', 'שחזור': 'Restore',
  'ההתקדמות נשמרת בחשבון, ואפשר להמשיך אותה מכל מכשיר.': 'Your progress is saved to the account, and you can continue it on any device.',
  'גיבוי והמשך במכשיר אחר': 'Backup and other devices', 'ההתקדמות שלכם נשמרת במכשיר הזה ומגובה בשרת.': 'Your progress is saved on this device and backed up on the server.',
  'חיבור עם {}': 'Connect {0}', 'קישור אישי להמשך במכשיר אחר': 'Personal link to continue on another device',
  'הקישור אישי: מי שמחזיק בו יכול לשחק בשמכם. אל תשתפו אותו.': 'The link is personal: whoever holds it can play as you. Do not share it.',
  'עוד אין מה לגבות. שחקו שלב אחד קודם.': 'Nothing to back up yet. Play a level first.', 'הקישור האישי שלי ל-BEAM': 'My personal BEAM link',
  'הקישור הועתק. פתחו אותו במכשיר השני.': 'Link copied. Open it on the other device.', 'התנתקתם. ההתקדמות נשארת במכשיר הזה.': 'Signed out. Your progress stays on this device.',
  'מחיקת כל המידע שלי מהשרת': 'Delete all my data from the server', 'למחוק את כל המידע?': 'Delete all your data?', 'מחיקה': 'Delete',
  'הגיבוי, השם והניקוד יימחקו מהשרת, וההתקדמות תימחק גם מהמכשיר הזה. אי אפשר לבטל את זה.': 'Your backup, name and score are deleted from the server, and progress is erased from this device too. This cannot be undone.',
  'היריב כבר יצא מהמשחק': 'Your opponent has already left', 'היריב יצא, אי אפשר לשחק שוב באותו חדר.': 'Your opponent left, so this room cannot be replayed.',
  'ניצחונות: {} · הפסדים: {} · תיקו: {}': 'Wins: {0} · Losses: {1} · Draws: {2}',
  // ---- messages ----
  'חסימה': 'Block', 'משבצת': 'Tile', '{} {}, {}': '{0} {1}, {2}', 'אין חיבור כרגע. נסו שוב מאוחר יותר.': 'No connection right now. Try again later.',
  'השם והניקוד הוסרו מהטבלה': 'Your name and score were removed', 'הישג חדש: {}': 'New achievement: {0}', 'מהלך אחד': '1 move', '{} מהלכים': '{0} moves',
  'גחלילית {}': 'Firefly {0}', 'איך לקרוא לכם?': 'What should we call you?', 'השם יופיע בטבלת המובילים, וכל השחקנים יוכלו לראות אותו.': 'The name appears on the leaderboard, where every player can see it.',
  'שם': 'Name', 'שמירה': 'Save', '{} ימים ברצף!': '{0} days in a row!', 'ברוכים השבים!': 'Welcome back!',
  'קיבלתם {} נקודות לקניות. חזרו מחר כדי להגדיל את הבונוס.': 'You got {0} points to spend. Come back tomorrow for a bigger bonus.', 'איסוף': 'Collect',
  'שחקן חדש': 'New player', '{}, {} נקודות שנצברו': '{0}, {1} points earned', 'עוד {} ל{}': '{0} more to {1}', 'הדרגה הגבוהה ביותר': 'Highest rank',
  'השיא שלכם היום: {} נקודות': 'Your best today: {0} points', 'שלב חדש היום, אותו שלב לכולם': 'A new level today, the same for everyone', 'לשפר': 'Improve',
  'הישגים {}/{}': 'Achievements {0}/{1}', 'פרק {}: {}': 'Chapter {0}: {1}', 'ייפתח אחרי פרק {}': 'Opens after chapter {0}', 'שלב {}{}': 'Level {0}{1}', ', {} כוכבים': ', {0} stars',
  'פרק {} מתוך {}': 'Chapter {0} of {1}', '{} מתוך {} שלבים, {} מתוך {} כוכבים': '{0} of {1} levels, {2} of {3} stars', 'שפרו כוכבים': 'Improve your stars', 'המשך לשלב {}': 'Continue to level {0}',
  '{} מתוך {} כוכבים דולקים': '{0} of {1} stars lit', 'נותרו {} מראות': '{0} mirrors left', 'זמן': 'Time', '{} מהלכים, יעד {}': '{0} moves, target {1}',
  'יעד מהלכים: {}': 'Move target: {0}', 'שלב {}': 'Level {0}', 'הקישו על חסימה מהבהבת כדי לשבור אותה': 'Tap a blinking block to break it', 'בום! הקרן פגעה בפצצה.': 'Boom! The beam hit a bomb.',
  'הקישו על משבצת כדי להציב מראה': 'Tap a tile to place a mirror', 'מראה': 'Mirror', 'ביטול': 'Cancel',
  'את המראה הזו הציב הרמז, והיא נשארת במקום.': 'The hint placed this mirror, and it stays put.', 'נגמרו המראות. הסירו אחת או קנו מראה נוספת.': 'Out of mirrors. Remove one or buy an extra.',
  'קיבלתם מראה נוספת': 'You got an extra mirror', 'החסימה נשברה': 'Block broken', 'הרמז הציב מראה במקום הנכון': 'The hint placed a mirror in the right spot',
  'פתרתם שוב!': 'Solved again!', 'שיא חדש להיום!': 'New best for today!', 'האתגר היומי הושלם!': 'Daily challenge complete!',
  '{} נקודות בטבלה. {}:{} דקות, {}.{}': '{0} points on the board. {1}:{2}, {3}.{4}', ' השיא שלכם: {}.': ' Your best: {0}.', 'לטבלת המובילים': 'To the leaderboard', 'נסו שוב לשיא': 'Try for a new best',
  'מושלם!': 'Perfect!', 'סיימתם את המשחק!': 'You finished the game!', 'הפרק הושלם!': 'Chapter complete!', 'כל הכבוד!': 'Well done!',
  'פתרתם ב{}, בתוך היעד.': 'Solved in {0}, within the target.', '{}. פתרו ב-{} מהלכים או פחות בשביל שלושה כוכבים.': '{0}. Solve it in {1} moves or fewer for three stars.',
  'השתמשתם בעזרה. פתרו בלי עזרה בשביל עוד כוכבים.': 'You used help. Solve without it for more stars.', 'חזרה לשלבים': 'Back to levels', 'לשלב הבא': 'Next level',
  'כבר השגתם את התוצאה הזו': 'You already had this result',
  'BEAM · האתגר היומי {}\n{} נקודות · {} · {}:{}\nמצליחים לעקוף אותי?': 'BEAM · Daily challenge {0}\n{1} points · {2} · {3}:{4}\nCan you beat me?',
  'התוצאה הועתקה, אפשר להדביק ולשלוח': 'Result copied, ready to paste and send', 'לא הצלחנו להעתיק את התוצאה': 'Could not copy the result',
  '<li class="empty">טוען…</li>': '<li class="empty">Loading…</li>', 'כל הנקודות שנצברו במשחק': 'All points earned in the game', 'האתגר של {}': 'Challenge for {0}',
  'עוד אין שחקנים בטבלה. היו הראשונים!': 'No players yet. Be the first!', 'אף אחד עוד לא פתר את האתגר של היום.': 'Nobody has solved today\'s challenge yet.',
  ' (אתם)': ' (you)', '{} כוכבים, {}': '{0} stars, {1}', '{} מתוך {} הושגו': '{0} of {1} earned',
  'אישור רכישה': 'Confirm purchase', 'הסרת פרסומות לתמיד בתשלום חד-פעמי של {}.': 'Remove ads forever for a one-time payment of {0}.',
  'גרסת הדגמה: לא יבוצע חיוב. במשחק המפורסם כאן ייפתח מסך התשלום של החנות.': 'Demo version: you will not be charged. In the published game the store payment screen opens here.',
  'רכישה ב-{}': 'Buy for {0}', 'תודה על התמיכה!': 'Thank you for your support!', 'הפרסומות הוסרו, וקיבלתם {} נקודות לקניות במתנה.': 'Ads are removed, and you got {0} bonus points to spend.',
  'יופי': 'Great', 'הרכישה שוחזרה': 'Purchase restored', 'לא נמצאו רכישות קודמות': 'No previous purchases found', 'פרסומת': 'Ad', 'מקום לפרסומת בין שלבים': 'Space for an ad between levels',
  'אפשר לסגור בעוד': 'You can close in', 'הסרת פרסומות ב-{}': 'Remove ads for {0}', 'המשך למשחק': 'Back to the game', 'המשחק בלי פרסומות': 'The game is ad-free',
  'תודה שתמכתם בגחלילית!': 'Thanks for supporting the firefly!', 'תשלום חד-פעמי, לתמיד.': 'One payment, forever.', 'בלי באנרים במסך הבית': 'No banners on the home screen',
  'בלי פרסומות בין שלבים': 'No ads between levels', 'מתנה: {} נקודות לקניות': 'Gift: {0} points to spend', 'שחזור רכישות': 'Restore purchases',
  'כרגע: {}': 'Currently: {0}', 'עוד לא בחרתם שם.': 'You have not chosen a name yet.', 'לאפס את ההתקדמות?': 'Reset your progress?',
  'כל השלבים, הכוכבים, הנקודות וההישגים יימחקו. אי אפשר לבטל את זה.': 'All levels, stars, points and achievements will be erased. This cannot be undone.', 'כן, לאפס': 'Yes, reset',
  'ההתקדמות אופסה': 'Progress reset', 'בדיוק ככה!': 'Exactly like that!', 'כמעט. נסו לסובב או להזיז.': 'Almost. Try turning or moving it.', 'הקישו על משבצת.': 'Tap a tile.',
  'הפעלת צלילים': 'Turn sound on', 'התחברות עם {}': 'Sign in with {0}', 'כאן ייפתח חלון ההתחברות של {}.': 'The {0} sign-in window opens here.',
  'גרסת הדגמה: אין חיבור אמיתי לחשבון. במשחק המפורסם ההתקדמות תישמר בחשבון ותעבור בין מכשירים.': 'Demo version: no real account is connected. In the published game your progress is saved to the account and follows you between devices.',
  'המשך': 'Continue', 'התחברתם עם {}': 'Signed in with {0}', 'חשבון': 'Account',
  'אתם משחקים כאורח. ההתקדמות נשמרת רק במכשיר הזה. חברו חשבון כדי לשמור אותה ולהמשיך ממכשיר אחר.': 'You are playing as a guest. Progress stays on this device. Connect an account to keep it and continue on another device.',
  'חיבור עם Google': 'Connect Google', 'חיבור עם Facebook': 'Connect Facebook', 'מחוברים עם {}.': 'Connected with {0}.', 'התנתקות': 'Sign out', 'החשבון חובר עם {}': 'Account connected with {0}',
  'מכינים את השלבים…': 'Preparing the levels…', 'מדליקים את הכוכבים…': 'Lighting the stars…', 'מוכן!': 'Ready!',
};
function T(s, ...v) {
  if (typeof s === 'string') return LANG === 'en' && EN[s] !== undefined ? EN[s] : s;
  const key = s.join('{}');
  if (LANG === 'en' && EN[key] !== undefined) return EN[key].replace(/\{(\d)\}/g, (m, i) => v[+i]);
  return s.reduce((a, c, i) => a + c + (i < v.length ? v[i] : ''), '');
}
/* the page itself is written in Hebrew: for English, swap its text and attributes once, and turn it left-to-right */
if (LANG === 'en') {
  document.documentElement.lang = 'en'; document.documentElement.dir = 'ltr';
  document.title = 'BEAM · a puzzle game of mirrors and light';
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const n of nodes) {
    const raw = n.nodeValue, k = raw.trim();
    if (k && EN[k] !== undefined && !n.parentElement.closest('script,style')) n.nodeValue = raw.replace(k, EN[k]);
  }
  for (const e of document.querySelectorAll('[aria-label],[alt],[placeholder]')) for (const a of ['aria-label', 'alt', 'placeholder']) {
    const val = e.getAttribute(a); if (val && EN[val] !== undefined) e.setAttribute(a, EN[val]);
  }
}

/* const CHAPTERS lives in js/levels.js */
if (LANG === 'en') for (const c of CHAPTERS) { c.name = T(c.name); c.desc = T(c.desc); for (const l of c.levels) if (l.tip) l.tip = T(l.tip); }
// level order before chapters had 10 levels each, used once to move saved progress to level ids
const OLD_IDS = ["L17k8zoe","L1ktnd9e","La3hh9f","L17u1vbf","L14yb9ud","L1385b7j","L1ky0lre","L1v68ees","Lkjrs0f","Lmkswja","L3vg2lj","Le65itp","Lsylebo","L3a5pq2","L174e44s","Lci9r7m","Lum26p1","L1fdeqer","L1i5bgs","L96mhg0","L1sbcvl9","L1ujmwsg","L197sare","Lmks94h","L1m9x3dk","L4l9oo","L1ar3xry","L24w3ni","Lqybgri","L1np8c6o","Ldd0gak","L1odsfav","Lghyz6c","L1hxcjqa","L16lpvnu","L1kgnhf1","L4c7gjx","L1mxemrg","L187qx8u","L1m7gn23","Lx7qrqi","L6izjov","L32iodq","L1m82ydi","Lt8b7tc","L17dtwjf","L1madtlp","Liqz0i4","Lm2y9ks"];
/* ---------- core: shared by the game and the level generator ---------- */
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

/* the weekly challenge: one hard board for the whole week, the same for everyone */
function weeklyLevel(weekStr){
  const R=mulberry32(hashStr('beam-week-'+weekStr));
  const specs=[
    {W:8,H:8,k:5,nt:4,walls:4,bombs:4,maxSols:2,budget:200000},
    {W:7,H:7,k:5,nt:4,walls:3,bombs:4,fixed:1,maxSols:2,budget:200000},
    {W:8,H:8,k:5,nt:4,walls:4,bombs:4,splits:1,maxSols:2,budget:200000},
  ];
  const v=hashStr(weekStr)%3;
  for(let o=0;o<3;o++){const sp=specs[(v+o)%3]; for(let i=0,n=o?400:800;i<n;i++){const lv=makeLevel(R,sp);if(lv){lv.week=sp;return lv;}}}
  for(let i=0;i<1500;i++){const lv=makeLevel(R,{W:7,H:7,k:5,nt:4,walls:3,bombs:4,maxSols:2,budget:150000});if(lv)return lv;}   // the hard duel board as a safety net
  return dailyLevel(weekStr);
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
  // the day's own variant gets the most tries; if it finds nothing, the other 7x7 variants take over before any smaller board
  for(let o=0;o<4;o++){const sp=specs[(v+o)%4]; for(let i=0,n=o?300:600;i<n;i++){const lv=makeLevel(R,sp);if(lv)return lv;}}
  for(let i=0;i<300;i++){const lv=makeLevel(R,{W:6,H:6,k:3,nt:2,walls:2,bombs:2,maxSols:2,budget:100000});if(lv)return lv;}
  return {rows:["......","....T.","......","......",".T....","......"],lasers:[['L',1]],max:2,sol:[['5,1','\\'],['5,4','/']]};
}


function el(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  parent.appendChild(e); return e;
}
/* The classic board is painted: every piece is a picture from media/board. A board bought in the shop keeps the drawn pieces,
   because those take their colours from the shop's palette. */
const ART_DIR = 'media/board/';
const painted = () => true;   // every board is painted now; the old drawn pieces below stay only as a fallback
/* the frame pictures: size of the cropped picture, where its bed of tiles starts and how big it is (all in picture pixels), and the colour that hides the grid painted into it */
const FRAMES = {
  classic: { src: 'frame', w: 1154, h: 1111, bx: 98, by: 124, bw: 958, bh: 863, bed: '#EDE1F6', edge: '#CDB6E6' },
  forest:  { src: 'frame-forest',  w: 1185, h: 1130, bx: 100, by: 111, bw: 988, bh: 901, bed: '#D1E9DA', edge: '#B4D2C0', tiles: ['k-turquoise', 'k-mint-green', 'k-lavender', 'k-coral-peach'] },
  crystal: { src: 'frame-crystal', w: 1164, h: 1126, bx: 89,  by: 115, bw: 988, bh: 901, bed: '#DBE3FD', edge: '#BFC9F0', tiles: ['k-turquoise', 'k-sky-blue', 'k-lavender', 'k-pearl-white'] },
  flower:  { src: 'frame-flower',  w: 1220, h: 1139, bx: 117, by: 120, bw: 988, bh: 901, bed: '#F0E2F9', edge: '#DCC3EC', tiles: ['k-mint-green', 'k-magenta-pink', 'k-lavender', 'k-orange'] },
  stars: { src: 'frame-stars', w: 1250, h: 1182, bx: 141, by: 162, bw: 967, bh: 877, bed: '#E9DAF4', edge: '#CDBFD6', tiles: ['k-royal-purple', 'k-sky-blue', 'k-lavender', 'k-yellow-gold'] },
  coral: { src: 'frame-coral', w: 1145, h: 1055, bx: 97, by: 97, bw: 951, bh: 861, bed: '#F1D3ED', edge: '#D4B9D0', tiles: ['k-magenta-pink', 'k-coral-peach', 'k-lavender', 'k-orange'] },
  mushroom: { src: 'frame-mushroom', w: 1210, h: 1136, bx: 118, by: 126, bw: 973, bh: 882, bed: '#EADDF6', edge: '#CDC2D8', tiles: ['k-magenta-pink', 'k-lavender', 'k-royal-purple', 'k-mint-green'] },
  candy: { src: 'frame-candy', w: 1197, h: 1130, bx: 102, by: 119, bw: 993, bh: 901, bed: '#EDDEF9', edge: '#D0C3DB', tiles: ['k-sky-blue', 'k-mint-green', 'k-magenta-pink', 'k-yellow-gold'] },
  ocean: { src: 'frame-ocean', w: 1196, h: 1093, bx: 113, by: 126, bw: 971, bh: 868, bed: '#EBDDFA', edge: '#CEC2DC', tiles: ['k-sky-blue', 'k-turquoise', 'k-lavender', 'k-mint-green'] },
  royal: { src: 'frame-royal', w: 1197, h: 1139, bx: 104, by: 152, bw: 990, bh: 883, bed: '#ECDBFA', edge: '#CFC0DC', tiles: ['k-royal-purple', 'k-lavender', 'k-ruby-red', 'k-yellow-gold'] },
};
const frameOf = () => FRAMES[typeof P !== 'undefined' && P ? lookOf('board') : 'classic'] || FRAMES.classic;
function pic(g, name, x, y, w, h, cls) {
  const im = el('image', { href: ART_DIR + name + '.webp', x, y, width: w, height: h, preserveAspectRatio: 'none', ...(cls ? { class: cls } : {}) }, g);
  im.setAttributeNS('http://www.w3.org/1999/xlink', 'href', ART_DIR + name + '.webp');
  return im;
}
/* where the frame picture goes so that its inner lip meets the bed of tiles */
function frameBox(W, H) {
  const F = frameOf(), bed = .1, sx = (W + 2 * bed) / F.bw, sy = (H + 2 * bed) / F.bh;
  return { F, x: -bed - F.bx * sx, y: -bed - F.by * sy, w: F.w * sx, h: F.h * sy, side: bed + F.bx * sx, top: bed + F.by * sy, bed };
}
function tray(g, W, H) {
  const f = frameBox(W, H);
  pic(g, f.F.src, f.x, f.y, f.w, f.h, 'frame');
  el('rect', { x: -f.bed, y: -f.bed, width: W + 2 * f.bed, height: H + 2 * f.bed, rx: .3, fill: f.F.bed }, g);          // the frames were painted with a grid of their own; the bed hides it for every size
  el('rect', { x: -f.bed, y: -f.bed, width: W + 2 * f.bed, height: H + 2 * f.bed, rx: .3, fill: 'none', stroke: f.F.edge, 'stroke-width': .03 }, g);
}
const TILE_FACE = ['var(--t-blue)', 'var(--t-green)', 'var(--t-purple)', 'var(--t-orange)'], TILE_BASE = ['t-blue', 't-green', 't-purple', 't-orange'];
const tileArt = face => { const i = TILE_FACE.indexOf(face); return i < 0 ? null : (frameOf().tiles || TILE_BASE)[i]; };   // each board brings its own four colours
function tile(g, x, y, face) {
  if (painted() && tileArt(face)) return pic(g, tileArt(face), x + .035, y + .035, .93, .93, 'tl');
  el('rect', { x: x + .05, y: y + .05, width: .9, height: .9, rx: .17, fill: 'var(--t-shade)' }, g);
  el('rect', { x: x + .05, y: y + .05, width: .9, height: .82, rx: .17, fill: face }, g);
  el('rect', { x: x + .14, y: y + .11, width: .3, height: .09, rx: .045, fill: '#fff', opacity: .55 }, g);
}
function wallTile(g, x, y) {
  if (painted()) return pic(g, 'wall', x + .02, y + .01, .96, .98, 'tl');
  el('rect', { x: x + .05, y: y + .05, width: .9, height: .9, rx: .17, fill: 'var(--purple-d)' }, g);
  el('rect', { x: x + .05, y: y + .05, width: .9, height: .82, rx: .17, fill: 'var(--purple)' }, g);
  el('path', { d: `M${x + .32} ${y + .3}L${x + .68} ${y + .66}M${x + .68} ${y + .3}L${x + .32} ${y + .66}`, stroke: '#fff', 'stroke-width': .11, 'stroke-linecap': 'round' }, g);
}
function starPath(cx, cy, R, r) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r : R;
    d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rad).toFixed(3) + ' ' + (cy + Math.sin(a) * rad).toFixed(3);
  }
  return d + 'Z';
}
function star(g, cx, cy, on, fid) {
  if (painted()) {
    if (on) el('circle', { cx, cy, r: .42, fill: '#FFD23F', opacity: .8, class: 'starglow', filter: fid ? `url(#${fid})` : '' }, g);
    return on ? pic(g, 'star', cx - .52, cy - .52, 1.04, 1.04, 'st on') : pic(g, 'star-off', cx - .38, cy - .38, .76, .76, 'st');
  }
  if (on) el('circle', { cx, cy, r: .36, fill: 'var(--star)', opacity: .7, class: 'starglow', filter: fid ? `url(#${fid})` : '' }, g);
  el('path', { d: starPath(cx, cy + .02, .3, .13), fill: on ? 'var(--star-d)' : 'rgba(45,27,78,.25)', 'stroke-linejoin': 'round' }, g);
  el('path', { d: starPath(cx, cy - .02, .3, .13), fill: on ? 'var(--star)' : '#fff', stroke: on ? '#fff' : 'rgba(45,27,78,.25)', 'stroke-width': .03, 'stroke-linejoin': 'round' }, g);
}
function bomb(g, cx, cy, hit) {
  const b = el('g', { class: hit ? 'shake' : '' }, g);
  if (painted()) return pic(b, 'bomb', cx - .33, cy - .4, .7, .78);
  el('circle', { cx, cy: cy + .05, r: .21, fill: 'var(--bomb)' }, b);
  el('circle', { cx: cx - .07, cy: cy - .02, r: .055, fill: '#fff', opacity: .5 }, b);
  el('path', { d: `M${cx + .1} ${cy - .12}Q${cx + .2} ${cy - .3} ${cx + .3} ${cy - .25}`, stroke: 'var(--bomb)', 'stroke-width': .05, fill: 'none', 'stroke-linecap': 'round' }, b);
  el('circle', { cx: cx + .31, cy: cy - .26, r: .07, fill: 'var(--orange)' }, b);
}
function mirror(g, x, y, m, locked) {
  const [a, b, c, d] = m === '/' ? [x + .2, y + .8, x + .8, y + .2] : [x + .2, y + .2, x + .8, y + .8];
  if (painted()) {
    if (locked) el('line', { x1: a, y1: b, x2: c, y2: d, stroke: '#FF8A1F', 'stroke-width': .38, 'stroke-linecap': 'round', opacity: .75 }, g);       // a mirror placed by a hint glows orange and stays put
    return pic(g, m === '/' ? 'mir-a' : 'mir-b', x + .08, y + .08, .84, .84, 'mr');
  }
  el('line', { x1: a, y1: b, x2: c, y2: d, stroke: locked ? 'var(--star-d)' : 'var(--blue-d)', 'stroke-width': .22, 'stroke-linecap': 'round' }, g);
  el('line', { x1: a, y1: b, x2: c, y2: d, stroke: '#fff', 'stroke-width': .12, 'stroke-linecap': 'round' }, g);
}
/* original mascot: a round firefly with a glowing tail */
/* on the board the firefly turns so her glowing belly faces the tiles, and the beam leaves from it */
const BOARD_BUG_SRC = 'media/board/fly.webp';
const BELLY = [0.589, 0.811]; // where the glowing belly sits inside the board artwork (0..1)
const BUG_SIZE = 1.25;
/* how far the picture reaches beyond the tiles: the frame, and the firefly standing on its edge */
function boardPad(W, H) { if (!painted()) return 1.45; const f = frameBox(W, H); return Math.max(f.side, f.top) + BELLY[0] * BUG_SIZE + .1; }
function bugPlace(dx, dy, sx, sy, S, W, H) {
  // four poses: upright on the left, mirrored on the right, turned a quarter above and below the board,
  // so the beam always leaves her belly the same way and she stays just outside the tray
  const f = painted() ? frameBox(W, H) : null;
  const back = f ? (dx ? f.side : f.top) + .02 : .16 + (1 - BELLY[0]) * S;
  const bx = dx > 0 ? -back : dx < 0 ? W + back : sx + .5;
  const by = dy > 0 ? -back : dy < 0 ? H + back : sy + .5;
  return { bx, by, rot: dy > 0 ? 90 : dy < 0 ? -90 : 0, flip: dx < 0 };
}
function emitterBug(g, e, S) {
  const img = el('image', { href: BOARD_BUG_SRC, x: 0, y: 0, width: S, height: S,
    transform: `translate(${e.bx} ${e.by}) rotate(${e.rot}) scale(${e.flip ? -1 : 1} 1) translate(${-BELLY[0] * S} ${-BELLY[1] * S})` }, g);
  img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', BOARD_BUG_SRC);
  return img;
}

/* the mascot: the firefly artwork, embedded so the game stays a single file */
const BUG_SRC = 'media/inline/bug.webp';
function firefly(g, cx, cy, dx, dy, s, fid) {
  const size = 1.15 * s;
  const img = el('image', { href: BUG_SRC, x: cx - size / 2, y: cy - size / 2, width: size, height: size, preserveAspectRatio: 'xMidYMid meet' }, g);
  img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', BUG_SRC);
  // on the left edge she faces right, toward the board
  if (dx > 0) img.setAttribute('transform', `translate(${2 * cx} 0) scale(-1 1)`);
  return img;
}
function addBlur(svg, sd) {
  const fid = 'blur-' + svg.id;
  const f = el('filter', { id: fid, x: '-60%', y: '-60%', width: '220%', height: '220%' }, el('defs', {}, svg));
  el('feGaussianBlur', { stdDeviation: sd }, f);
  return fid;
}


const key = (x, y) => x + ',' + y;
const TINTS = ['var(--t-blue)','var(--t-green)','var(--t-purple)','var(--t-orange)'];
const CH_COLORS = [
  { solid:'var(--orange)', tint:'var(--t-orange)' }, { solid:'var(--blue)', tint:'var(--t-blue)' },
  { solid:'var(--purple)', tint:'var(--t-purple)' }, { solid:'var(--green)', tint:'var(--t-green)' },
];
const ALL = [];
CHAPTERS.forEach((c, ci) => c.levels.forEach(l => ALL.push({ ...l, ch: ci })));
const $ = id => document.getElementById(id);
const NS = "http://www.w3.org/2000/svg";

/* ================= drawing ================= */
function ends(x, y, m) { return m === '/' ? [x + .2, y + .8, x + .8, y + .2] : [x + .2, y + .2, x + .8, y + .8]; }
function fixedMirror(g, x, y, m) {
  const [a, b, c, d] = ends(x, y, m);
  el('line', { x1: a, y1: b, x2: c, y2: d, stroke: '#3B2A6B', 'stroke-width': .26, 'stroke-linecap': 'round' }, g);
  el('line', { x1: a, y1: b, x2: c, y2: d, stroke: '#A99BD6', 'stroke-width': .1, 'stroke-linecap': 'round' }, g);
  for (const [px, py] of [[a, b], [c, d]]) el('circle', { cx: px, cy: py, r: .06, fill: '#FFE45C' }, g);
}
function splitter(g, x, y, m) {
  const [a, b, c, d] = ends(x, y, m);
  el('line', { x1: a, y1: b, x2: c, y2: d, stroke: 'rgba(255,255,255,.75)', 'stroke-width': .26, 'stroke-linecap': 'round' }, g);
  el('line', { x1: a, y1: b, x2: c, y2: d, stroke: 'var(--blue)', 'stroke-width': .07, 'stroke-dasharray': '.09 .07', 'stroke-linecap': 'round' }, g);
}

function draw(svg, lv, mir, onTap, won, locked, hammer) {
  const H = lv.rows.length, W = lv.rows[0].length;
  const pad = boardPad(W, H);
  svg.setAttribute("viewBox", `${-pad} ${-pad} ${W + 2 * pad} ${H + 2 * pad}`);
  svg.innerHTML = '';
  const fid = addBlur(svg, .09);
  const root = el('g', {}, svg);
  const res = traceAll(lv, mir);
  if (res.bomb) root.classList.add('bad');
  if (won) root.classList.add('won');

  tray(root, W, H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const c = lv.rows[y][x];
    if (c === '#') {
      wallTile(root, x, y);
      if (hammer && hammer.has(key(x, y))) el('rect', { x: x + .05, y: y + .05, width: .9, height: .9, rx: .17, fill: 'none', stroke: 'var(--orange)', 'stroke-width': .08, class: 'breakable' }, root);
    } else tile(root, x, y, TINTS[(x * 3 + y * 5 + (x * y)) % 4]);
  }
  // each beam starts exactly at the glowing belly of its firefly
  const emitters = lasersOf(lv).map((l, li) => {
    const [sx, sy, dx, dy] = startBeam(l, W, H);
    const e = bugPlace(dx, dy, sx, sy, BUG_SIZE, W, H);
    if (res.paths[li]) res.paths[li][0] = [e.bx, e.by];
    return e;
  });
  for (const p of res.paths) {
    const pts = p.map(q => q.join(',')).join(' ');
    el('polyline', { points: pts, class: 'glow', filter: `url(#${fid})` }, root);
  }
  for (const p of res.paths) el('polyline', { points: p.map(q => q.join(',')).join(' '), class: 'beamline' }, root);
  for (const p of res.paths) el('polyline', { points: p.map(q => q.join(',')).join(' '), class: 'core' }, root);

  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const c = lv.rows[y][x], k = key(x, y);
    if (c === 'T') star(root, x + .5, y + .47, res.lit.has(k), fid);
    else if (c === 'X') bomb(root, x + .5, y + .47, res.bomb === k);
    else if (c === 'f' || c === 'g') fixedMirror(root, x, y, c === 'f' ? '/' : '\\');
    else if (c === 'p' || c === 'q') splitter(root, x, y, c === 'p' ? '/' : '\\');
    if (mir[k]) mirror(root, x, y, mir[k], locked && locked.has(k));
  }
  for (const e of emitters) emitterBug(root, e, BUG_SIZE);
  if (onTap) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const c = lv.rows[y][x];
    if (hammer ? !hammer.has(key(x, y)) : c !== '.') continue;
    const h = el('rect', { x, y, width: 1, height: 1, class: 'hit', role: 'button', 'aria-label': `${hammer ? T('חסימה') : T('משבצת')} ${x + 1}, ${y + 1}`, style: 'cursor:pointer' }, root);
    h.addEventListener('click', () => onTap(x, y));
  }
  return { lit: res.lit.size, total: res.total, bomb: !!res.bomb, bombKey: res.bomb || null, allLit: res.allLit };
}

/* ================= vibration: a short buzz with the moments that matter, alongside their sound ================= */
const Haptic = (() => {
  // milliseconds: a number is one buzz, a list is buzz, pause, buzz…  Small taps stay silent on purpose.
  const PATTERN = {
    place: 12, rotate: 8, remove: 10, star: 18, defuse: 12, hint: [15, 40, 25], purchase: [15, 40, 15],
    error: [30, 50, 30], bomb: [90, 40, 180], hammer: [25, 30, 70],
    jackpot: [60, 40, 30, 40, 30, 40, 30, 40, 30, 40, 30, 40, 120], tada: [120], win: [40, 60, 40, 60, 140], perfect: [30, 40, 30, 40, 30, 40, 200], achievement: [20, 50, 60], bonus: [20, 50, 20, 50, 60],
  };
  const supported = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
  let on = true;
  return {
    supported,
    set(v) { on = v; if (!v && supported) { try { navigator.vibrate(0); } catch (e) { /* nothing to stop */ } } },
    play(name) { if (!on || !supported || !PATTERN[name]) return; try { navigator.vibrate(PATTERN[name]); } catch (e) { /* blocked until the first touch */ } },
  };
})();

/* ================= sound: everything is synthesized live with Web Audio, no files ================= */
const Sound = (() => {
  let ctx = null, master, sfxBus, musicBus, verb, noiseBuf;
  let sfxOn = true, musicOn = true, musicWanted = false, sched = null;

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createDynamicsCompressor(); master.connect(ctx.destination);
    sfxBus = ctx.createGain(); sfxBus.gain.value = sfxOn ? .9 : 0; sfxBus.connect(master);
    musicBus = ctx.createGain(); musicBus.gain.value = 0; musicBus.connect(master);
    // small synthetic reverb for sparkle and pads
    verb = ctx.createConvolver();
    const len = ctx.sampleRate * 1.6, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    verb.buffer = ir;
    const wet = ctx.createGain(); wet.gain.value = .28; verb.connect(wet); wet.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    if (musicWanted) startMusic();
    return true;
  }
  const now = () => ctx.currentTime;

  let tapStep = 0;
  function tone({ f = 440, f2 = null, type = 'sine', dur = .15, vol = .25, at = .005, delay = 0, bus = sfxBus, wet = 0, detune = 0, lp = 0 }) {
    const t = now() + delay;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); o.detune.value = detune;
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + at);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    if (lp) { const fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = lp; fl.Q.value = .3; o.connect(fl); fl.connect(g); } else o.connect(g);
    g.connect(bus);
    if (wet) { const w = ctx.createGain(); w.gain.value = wet; g.connect(w); w.connect(verb); }
    o.start(t); o.stop(t + dur + .05);
  }
  function noise({ dur = .2, vol = .3, type = 'lowpass', f = 1200, f2 = null, q = 1, delay = 0, bus = sfxBus }) {
    const t = now() + delay;
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f, t); fl.Q.value = q;
    if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(fl); fl.connect(g); g.connect(bus);
    s.start(t); s.stop(t + dur + .05);
  }
  let clipBus = null;
  const PENTA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.5, 1568, 1760];

  const fx = {
    /* a button press: a small bubble pop with a glass ring on top. The ring walks a five-note scale, so pressing around the menus sounds like a tune and never the same click twice. */
    tap() {
      const scale = [1046.5, 1174.7, 1318.5, 1568, 1760, 2093], f = scale[tapStep = (tapStep + 1 + Math.floor(Math.random() * 2)) % scale.length];
      tone({ f: 420, f2: 900, type: 'sine', dur: .055, vol: .13, at: .003 });                    // the pop
      tone({ f, type: 'sine', dur: .22, vol: .075, at: .004, wet: .5, delay: .012 });             // the ring
      tone({ f: f * 2.01, type: 'triangle', dur: .09, vol: .025, delay: .012 });                  // a glint above it
      noise({ dur: .018, vol: .035, type: 'highpass', f: 5200 });                                  // the touch itself
    },
    place()  { tone({ f: 880, f2: 1320, type: 'triangle', dur: .09, vol: .18 }); noise({ dur: .03, vol: .08, type: 'highpass', f: 4000 }); },
    rotate() { tone({ f: 1320, f2: 990, type: 'triangle', dur: .08, vol: .15 }); noise({ dur: .03, vol: .06, type: 'highpass', f: 5000 }); },
    remove() { tone({ f: 600, f2: 260, type: 'sine', dur: .12, vol: .15 }); },
    error()  { tone({ f: 170, type: 'square', dur: .09, vol: .06 }); tone({ f: 150, type: 'square', dur: .12, vol: .06, delay: .11 }); },
    star(n)  {
      const f = PENTA[Math.min(n, PENTA.length - 1)];
      tone({ f, type: 'sine', dur: .9, vol: .2, wet: .9 });
      tone({ f: f * 2, type: 'sine', dur: .5, vol: .06, wet: .9, delay: .01 });
      tone({ f: f * 3.01, type: 'sine', dur: .3, vol: .03, wet: .9, delay: .02 });
    },
    unlit()  { tone({ f: 700, f2: 350, type: 'sine', dur: .2, vol: .08 }); },
    explode() {           // a bomb really going off: the crack, the body of the blast, a long low tail and falling debris
      noise({ dur: .09, vol: .9, type: 'highpass', f: 1800 });
      noise({ dur: 1.3, vol: .85, type: 'lowpass', f: 2600, f2: 60 });
      tone({ f: 170, f2: 28, type: 'sine', dur: 1.1, vol: .75 });
      tone({ f: 95, f2: 24, type: 'triangle', dur: .9, vol: .45, delay: .02 });
      tone({ f: 60, f2: 30, type: 'sine', dur: 1.6, vol: .4, delay: .08, wet: .7 });
      for (let k = 0; k < 10; k++) noise({ dur: .05 + Math.random() * .06, vol: .1 + Math.random() * .12, type: 'bandpass', f: 500 + Math.random() * 2500, q: 2, delay: .25 + Math.random() * .9 });
    },
    spin()   {            // the firefly's victory whirl: three sweeps of air that grow, a rising trail of bells, and a bright landing
      const bus = clipBus = ctx.createGain(); bus.connect(sfxBus);        // its own line, so leaving the win screen can cut it short
      [[.25, .07, 500, 2200], [1.35, .1, 600, 2800], [2.5, .13, 700, 3400]].forEach(([d, v, a, b]) => noise({ dur: 1.05, vol: v, type: 'bandpass', f: a, f2: b, q: 1.4, delay: d, bus }));
      for (let k = 0; k < 34; k++) {
        const t = .3 + k * .115, n = Math.min(PENTA.length - 1, Math.floor(k / 3.5));
        tone({ f: PENTA[n] * (k % 2 ? 4 : 2), type: 'sine', dur: .22, vol: .03 + k * .0007, wet: 1, delay: t + Math.random() * .04, bus });
      }
      [0, 2, 4, 7, 9].forEach((n, k) => { tone({ f: PENTA[n], type: 'triangle', dur: .7, vol: .12, wet: .8, delay: 4.25 + k * .06, bus }); tone({ f: PENTA[n] * 2, type: 'sine', dur: .9, vol: .05, wet: 1, delay: 4.26 + k * .06, bus }); });
      for (let k = 0; k < 12; k++) tone({ f: PENTA[Math.floor(Math.random() * PENTA.length)] * 4, type: 'sine', dur: .3, vol: .028, wet: 1, delay: 4.5 + k * .05, bus });
    },
    // ---- the map: everything there glitters ----
    pop(n)   {            // a stop bouncing in: a round pluck that climbs the scale from stop to stop, with a glint on top
      const f = PENTA[(n || 0) % PENTA.length];
      tone({ f: f * .5, f2: f, type: 'triangle', dur: .17, vol: .17, wet: .45 });
      tone({ f: f * 4, type: 'sine', dur: .16, vol: .035, wet: 1, delay: .035 });
      noise({ dur: .025, vol: .05, type: 'highpass', f: 6500 });
    },
    sparkle(n) {          // a handful of tiny bells scattered high up
      for (let k = 0; k < (n || 7); k++) {
        const f = PENTA[Math.floor(Math.random() * PENTA.length)] * (Math.random() < .5 ? 2 : 4);
        tone({ f, type: 'sine', dur: .16 + Math.random() * .22, vol: .03 + Math.random() * .02, wet: 1, delay: k * .045 + Math.random() * .03 });
      }
    },
    chime()  { const a = Math.floor(Math.random() * 6); tone({ f: PENTA[a] * 2, type: 'sine', dur: 1.1, vol: .028, wet: 1 }); tone({ f: PENTA[a + 2] * 2, type: 'sine', dur: 1.3, vol: .022, wet: 1, delay: .22 }); },
    flyby()  {            // the firefly crossing the map: a breath of air with a trail of glints
      noise({ dur: .7, vol: .09, type: 'bandpass', f: 700, f2: 2600, q: 1.2 });
      for (let k = 0; k < 8; k++) tone({ f: PENTA[k] * 2, type: 'sine', dur: .2, vol: .035, wet: 1, delay: .08 + k * .085 });
    },
    unlock() {            // the next stop lighting up
      [0, 2, 4, 7].forEach((n, k) => { tone({ f: PENTA[n], type: 'triangle', dur: .35, vol: .14, wet: .7, delay: k * .07 }); tone({ f: PENTA[n] * 2, type: 'sine', dur: .5, vol: .05, wet: 1, delay: k * .07 + .01 }); });
      for (let k = 0; k < 9; k++) tone({ f: PENTA[Math.floor(Math.random() * PENTA.length)] * 4, type: 'sine', dur: .25, vol: .028, wet: 1, delay: .3 + k * .04 });
    },
    gate()   {            // the chapter gate opening
      tone({ f: 130.8, f2: 261.6, type: 'sine', dur: 1.4, vol: .22, wet: .6 });
      [0, 2, 4, 5, 7, 9].forEach((n, k) => { tone({ f: PENTA[n], type: 'triangle', dur: .6, vol: .13, wet: .8, delay: .12 + k * .09 }); tone({ f: PENTA[n] * 2, type: 'sine', dur: .8, vol: .05, wet: 1, delay: .13 + k * .09 }); });
      for (let k = 0; k < 16; k++) tone({ f: PENTA[Math.floor(Math.random() * PENTA.length)] * 4, type: 'sine', dur: .3, vol: .028, wet: 1, delay: .7 + k * .05 });
    },
    bomb()   {
      noise({ dur: .7, vol: .55, type: 'lowpass', f: 1400, f2: 80 });
      tone({ f: 140, f2: 35, type: 'sine', dur: .6, vol: .5 });
      tone({ f: 90, f2: 30, type: 'triangle', dur: .4, vol: .3, delay: .03 });
    },
    defuse() { tone({ f: 300, f2: 600, type: 'sine', dur: .15, vol: .08 }); },
    hammerArm() { tone({ f: 1800, type: 'square', dur: .04, vol: .05 }); tone({ f: 2400, type: 'square', dur: .05, vol: .04, delay: .05 }); },
    hammer() {
      tone({ f: 160, f2: 50, type: 'sine', dur: .25, vol: .5 });
      noise({ dur: .35, vol: .45, type: 'bandpass', f: 1800, f2: 400, q: .8 });
      for (let i = 0; i < 6; i++) noise({ dur: .05, vol: .12, type: 'highpass', f: 2500 + Math.random() * 3000, delay: .08 + i * .05 + Math.random() * .03 });
    },
    /* the win shower: a rising sweep, a brass-like fanfare, a burst and a rain of coin ticks */
    jackpot() {
      tone({ f: 220, f2: 1760, type: 'sawtooth', dur: .45, vol: .07, lp: 2400 });
      noise({ dur: .5, vol: .12, type: 'bandpass', f: 400, f2: 6000, q: 1.2 });
      noise({ dur: .9, vol: .13, type: 'highpass', f: 6500, delay: .08 });                    // the crash
      tone({ f: 82, f2: 41, type: 'sine', dur: .5, vol: .3, delay: .06 });                      // a thump under it
      [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568].forEach((f, i) => { tone({ f, type: 'square', dur: .16, vol: .055, delay: .1 + i * .085, lp: 3200 }); tone({ f: f * 2, type: 'triangle', dur: .2, vol: .06, wet: .5, delay: .1 + i * .085 }); });
      [1046.5, 1318.5, 1568, 2093].forEach(f => tone({ f, type: 'triangle', dur: 1.2, vol: .07, wet: .8, delay: .62 }));
      for (let i = 0; i < 46; i++) tone({ f: [1568, 1760, 2093, 2349, 2637, 3136][Math.floor(Math.random() * 6)], type: 'triangle', dur: .07, vol: .035 + Math.random() * .03, wet: .35, delay: .2 + i * .034 + Math.random() * .02 });
    },
    clink(k = 0) { const f = 1319 * Math.pow(2, k); tone({ f, type: 'square', dur: .05, vol: .05, lp: 5000 }); tone({ f: f * 1.5, type: 'triangle', dur: .16, vol: .07, wet: .4, delay: .04 }); },   // coins landing in the counter, climbing an octave
    tada() { [1046.5, 1318.5, 1568, 2093, 2637].forEach((f, i) => tone({ f, type: 'triangle', dur: .9, vol: .09, wet: .9, delay: i * .03 })); noise({ dur: .6, vol: .08, type: 'highpass', f: 7000 }); tone({ f: 130.8, type: 'sine', dur: .5, vol: .22 }); },
    coins(n = 10) { for (let i = 0; i < n; i++) tone({ f: [1319, 1568, 1760, 2093][i % 4], type: 'triangle', dur: .09, vol: .06, wet: .3, delay: i * .07 }); },   // a purse emptying into the counter
    coin()   { tone({ f: 988, type: 'square', dur: .08, vol: .07 }); tone({ f: 1319, type: 'square', dur: .25, vol: .07, delay: .08 }); },
    hint()   {
      tone({ f: 500, f2: 1600, type: 'sine', dur: .45, vol: .12, wet: .8 });
      [1568, 2093, 2637, 3136].forEach((f, i) => tone({ f, type: 'sine', dur: .25, vol: .06, wet: 1, delay: .12 + i * .07 }));
    },
    reset()  { noise({ dur: .3, vol: .12, type: 'bandpass', f: 3000, f2: 300, q: 2 }); },
    whoosh() { noise({ dur: .35, vol: .1, type: 'bandpass', f: 300, f2: 2500, q: 1.5 }); },
    win(stars) {
      const seq = [523.25, 659.25, 783.99, 1046.5];
      seq.forEach((f, i) => { tone({ f, type: 'triangle', dur: .35, vol: .16, wet: .5, delay: i * .1 }); tone({ f: f / 2, type: 'sine', dur: .35, vol: .1, delay: i * .1 }); });
      tone({ f: 1046.5, type: 'triangle', dur: 1.1, vol: .14, wet: .7, delay: .42 });
      tone({ f: 1318.5, type: 'triangle', dur: 1.1, vol: .1, wet: .7, delay: .42 });
      tone({ f: 1568, type: 'triangle', dur: 1.1, vol: .08, wet: .7, delay: .42 });
      if (stars) for (let i = 0; i < stars; i++) fx.pop(.75 + i * .15, i);
    },
    pop(delay = 0, i = 0) { tone({ f: 1200 + i * 300, f2: 2400 + i * 400, type: 'sine', dur: .12, vol: .14, wet: .6, delay }); },
    perfect() { [2093, 2349, 2637, 3136, 3520, 4186].forEach((f, i) => tone({ f, type: 'sine', dur: .3, vol: .05, wet: 1, delay: 1.2 + i * .05 })); },
    achievement() {
      [783.99, 987.77, 1174.66, 1567.98].forEach((f, i) => tone({ f, type: 'square', dur: .16, vol: .05, delay: i * .08 }));
      tone({ f: 1567.98, type: 'triangle', dur: .8, vol: .1, wet: .8, delay: .32 });
    },
    bonus()  { [1046.5, 1318.5, 1568, 2093].forEach((f, i) => { tone({ f, type: 'square', dur: .1, vol: .05, delay: i * .07 }); }); tone({ f: 2093, type: 'sine', dur: .6, vol: .08, wet: 1, delay: .3 }); },
    purchase() { fx.coin(); [1568, 1976, 2349].forEach((f, i) => tone({ f, type: 'sine', dur: .4, vol: .07, wet: 1, delay: .3 + i * .08 })); },
  };

  /* ---- generative background music: soft pentatonic arpeggio over a I-vi-IV-V loop ---- */
  const CHORDS = [[261.63, 329.63, 392], [220, 261.63, 329.63], [174.61, 220, 261.63], [196, 246.94, 293.66]];
  const BPM = 84, STEP = 60 / BPM / 2; // eighth notes
  let step = 0, nextT = 0;
  function playStep(t) {
    const bar = Math.floor(step / 8) % 4, chord = CHORDS[bar], s = step % 8;
    const d = Math.max(0, t - now());
    if (s === 0) {
      // pad and bass at the start of each bar
      for (const f of chord) tone({ f, type: 'sine', dur: STEP * 8.5, vol: .035, at: .6, delay: d, bus: musicBus, wet: .6, detune: (Math.random() - .5) * 8 });
      tone({ f: chord[0] / 2, type: 'triangle', dur: STEP * 4, vol: .07, at: .02, delay: d, bus: musicBus });
    }
    if (s === 4) tone({ f: chord[0] / 2, type: 'triangle', dur: STEP * 3, vol: .05, at: .02, delay: d, bus: musicBus });
    // arpeggio: mostly chord tones, sometimes a rest, sometimes an octave up
    const pattern = [0, 1, 2, 1, 2, 0, 1, 2];
    if (Math.random() < .86) {
      let f = chord[pattern[s]] * 2;
      if (Math.random() < .2) f *= 2;
      tone({ f, type: 'triangle', dur: STEP * 1.6, vol: .045, at: .01, delay: d, bus: musicBus, wet: .5 });
    }
    if (s === 7 && Math.random() < .5) tone({ f: chord[2] * 4, type: 'sine', dur: .6, vol: .02, delay: d + STEP * .5, bus: musicBus, wet: 1 });
    step++;
  }
  /* ---- calm style: gentle pulse at 76 BPM, soft plucked arpeggio, light shaker and warm pads ---- */
  const CALM_CHORDS = [
    [130.81, 196, 246.94, 329.63],  // Cmaj7
    [110, 164.81, 196, 261.63],     // Am7
    [87.31, 174.61, 220, 329.63],   // Fmaj7
    [98, 146.83, 220, 293.66],      // Gsus2
  ];
  const CALM_SCALE = [392, 440, 523.25, 587.33, 659.25, 783.99, 880, 1046.5];
  const CALM_STEP = 60 / 76 / 2, CALM_BAR = 8; // eighth notes, one chord per bar
  const ARP = [1, 2, 3, 2, 1, 2, 3, 2];
  let calmStep = 0, mel = 3;
  function playCalm(t) {
    const bar = Math.floor(calmStep / CALM_BAR), chord = CALM_CHORDS[bar % 4], s = calmStep % CALM_BAR;
    const d = Math.max(0, t - now());
    const breath = bar % 8 === 7; // every eighth bar the arpeggio steps back
    if (s === 0) {
      for (const f of chord.slice(1)) tone({ f, type: 'sine', dur: CALM_STEP * CALM_BAR + .8, vol: .014, at: .8, delay: d, bus: musicBus, wet: .8, lp: 1200, detune: (Math.random() - .5) * 8 });
      tone({ f: chord[0], type: 'sine', dur: CALM_STEP * 3.5, vol: .055, at: .02, delay: d, bus: musicBus, lp: 500 });
      tone({ f: 95, f2: 48, type: 'sine', dur: .22, vol: .07, at: .005, delay: d, bus: musicBus });
    }
    if (s === 4) {
      tone({ f: chord[0], type: 'sine', dur: CALM_STEP * 3.5, vol: .04, at: .02, delay: d, bus: musicBus, lp: 500 });
      tone({ f: 90, f2: 50, type: 'sine', dur: .18, vol: .04, at: .005, delay: d, bus: musicBus });
    }
    // light shaker on the off-beats keeps things moving without getting busy
    if (s % 2 === 1) noise({ dur: .05, vol: .016, type: 'highpass', f: 6500, delay: d, bus: musicBus });
    if (s === 2 || s === 6) noise({ dur: .08, vol: .02, type: 'bandpass', f: 3500, q: 1.2, delay: d, bus: musicBus });
    if (!breath && Math.random() < .82) {
      const f = chord[ARP[s]] * 2;
      tone({ f, type: 'triangle', dur: .9, vol: .026, at: .008, delay: d, bus: musicBus, wet: .45, lp: 2400 });
      tone({ f: f * 2, type: 'sine', dur: .4, vol: .006, at: .005, delay: d, bus: musicBus, wet: .6 });
    }
    if (s % 2 === 0 && Math.random() < .14) {
      mel = Math.max(0, Math.min(CALM_SCALE.length - 1, mel + [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)]));
      tone({ f: CALM_SCALE[mel] * 2, type: 'sine', dur: 1.6, vol: .022, at: .02, delay: d + CALM_STEP * .02, bus: musicBus, wet: 1, lp: 3200 });
    }
    calmStep++;
  }
  /* ---- gentle style: the calm one's sister. Same unhurried pace, but played on a thumb piano: short round plucks,
     a warmer key (D), no shaker, and a soft bell answering every few bars ---- */
  const DREAM_CHORDS = [[146.83, 220, 293.66, 369.99], [123.47, 220, 293.66, 369.99], [98, 196, 246.94, 293.66], [110, 220, 277.18, 329.63]];
  const DREAM_BELLS = [587.33, 659.25, 739.99, 880, 987.77, 1174.66];
  const DREAM_STEP = 60 / 72 / 2, DREAM_BAR = 8, DREAM_ARP = [1, 3, 2, 3, 1, 2, 3, 2];
  let dreamStep = 0, dreamMel = 2;
  const pluck = (f, vol, d) => {
    tone({ f, type: 'sine', dur: .6, vol, at: .004, delay: d, bus: musicBus, wet: .35 });
    tone({ f: f * 2, type: 'sine', dur: .16, vol: vol * .35, at: .003, delay: d, bus: musicBus });
    tone({ f: f * 3.01, type: 'sine', dur: .07, vol: vol * .12, at: .002, delay: d, bus: musicBus });
  };
  function playDream(t) {
    const bar = Math.floor(dreamStep / DREAM_BAR), chord = DREAM_CHORDS[bar % 4], s = dreamStep % DREAM_BAR, d = Math.max(0, t - now());
    if (s === 0) {
      for (const f of chord.slice(1)) tone({ f, type: 'sine', dur: DREAM_STEP * DREAM_BAR + 1, vol: .01, at: 1, delay: d, bus: musicBus, wet: .8, lp: 1000, detune: (Math.random() - .5) * 8 });
      tone({ f: chord[0], type: 'sine', dur: DREAM_STEP * 5, vol: .05, at: .03, delay: d, bus: musicBus, lp: 420 });
    }
    if (s === 5) tone({ f: chord[0] * 1.5, type: 'sine', dur: DREAM_STEP * 2.5, vol: .028, at: .03, delay: d, bus: musicBus, lp: 420 });
    if (bar % 8 !== 7 && Math.random() < .88) pluck(chord[DREAM_ARP[s]] * 2, s % 4 === 0 ? .034 : .024, d);
    if (s === 4 && bar % 2 === 1 && Math.random() < .7) {
      dreamMel = Math.max(0, Math.min(DREAM_BELLS.length - 1, dreamMel + [-2, -1, 1, 1, 2][Math.floor(Math.random() * 5)]));
      tone({ f: DREAM_BELLS[dreamMel] * 2, type: 'sine', dur: 1.8, vol: .016, at: .01, delay: d, bus: musicBus, wet: 1, lp: 3600 });
    }
    dreamStep++;
  }
  /* ---- music-box style: a small lullaby waltz, high and soft, like a wind-up box on a shelf ---- */
  const BOX_BASS = [130.81, 110, 87.31, 98, 130.81, 110, 87.31, 98];
  const BOX_MID = [[196, 261.63], [164.81, 220], [174.61, 220], [196, 246.94], [196, 261.63], [164.81, 220], [174.61, 220], [196, 246.94]];
  const BOX_TUNE = [[659.25, 783.99, 1046.5], [880, 0, 659.25], [698.46, 880, 1046.5], [1174.66, 987.77, 783.99], [1046.5, 0, 783.99], [880, 1046.5, 1318.5], [1174.66, 1046.5, 880], [783.99, 0, 0]];
  const BOX_STEP = .58;
  let boxStep = 0;
  function playBox(t) {
    const bar = Math.floor(boxStep / 3) % 8, s = boxStep % 3, d = Math.max(0, t - now());
    if (s === 0) tone({ f: BOX_BASS[bar], type: 'sine', dur: BOX_STEP * 2.6, vol: .04, at: .02, delay: d, bus: musicBus, lp: 600 });
    else tone({ f: BOX_MID[bar][s - 1] * 2, type: 'sine', dur: BOX_STEP * 1.2, vol: .012, at: .01, delay: d, bus: musicBus, wet: .5 });
    const f = BOX_TUNE[bar][s];
    if (f) { tone({ f, type: 'sine', dur: 1.5, vol: .03, at: .004, delay: d, bus: musicBus, wet: .7 }); tone({ f: f * 3, type: 'sine', dur: .25, vol: .004, at: .003, delay: d, bus: musicBus, wet: .5 }); }
    boxStep++;
  }
  let style = 'calm';
  const stepLen = () => style === 'calm' ? CALM_STEP : style === 'dream' ? DREAM_STEP : style === 'box' ? BOX_STEP : STEP;
  function tick(t) { if (style === 'calm') playCalm(t); else if (style === 'dream') playDream(t); else if (style === 'box') playBox(t); else playStep(t); }

  function startMusic() {
    musicWanted = true;
    if (!ctx || !musicOn) return;
    musicBus.gain.cancelScheduledValues(now());
    musicBus.gain.setTargetAtTime(1, now(), .8);
    if (sched) return;
    nextT = now() + .1;
    sched = setInterval(() => { while (nextT < now() + .25) { tick(nextT); nextT += stepLen(); } }, 50);
  }
  function stopMusic() {
    musicWanted = false;
    if (!ctx) return;
    musicBus.gain.cancelScheduledValues(now());
    musicBus.gain.setTargetAtTime(0, now(), .4);
    setTimeout(() => { if ((!musicWanted || !musicOn) && sched) { clearInterval(sched); sched = null; } }, 1500);
  }

  return {
    init,
    play(name, ...a) { Haptic.play(name); if (!sfxOn || !init()) return; try { fx[name](...a); } catch (e) { console.error(e); } },
    music(on) { if (on) { musicWanted = true; if (init()) startMusic(); } else stopMusic(); },
    hush() { if (ctx && clipBus) { try { clipBus.gain.setTargetAtTime(0, now(), .04); } catch (e) { /* already gone */ } } },
    setSfx(on) { sfxOn = on; if (ctx) sfxBus.gain.setTargetAtTime(on ? .9 : 0, now(), .02); },
    setMusic(on) { const was = musicWanted; musicOn = on; if (!on) { stopMusic(); musicWanted = was; } else if (musicWanted && init()) startMusic(); },
    setStyle(st) {
      if (st === style) return;
      style = st; step = 0; calmStep = 0; dreamStep = 0; boxStep = 0;
      if (ctx && sched) {
        // short fade so the switch is smooth
        musicBus.gain.cancelScheduledValues(now());
        musicBus.gain.setTargetAtTime(0, now(), .15);
        musicBus.gain.setTargetAtTime(1, now() + .6, .6);
        nextT = now() + .6;
      }
    },
    get sfx() { return sfxOn; }, get musicOn() { return musicOn; },
  };
})();

/* ================= economy ================= */
/* help is priced by the level it is bought in: a hint costs what the level pays when solved with help, so buying never beats thinking */
const price = kind => { const k = G && G.lv ? G.lv.max : 3; return kind === 'hint' ? Math.max(300, 100 * k) : Math.max(200, 75 * k); };
const LIMIT = { mirror: 2, hammer: 3 };
/* hints can place at most half of a level's mirrors (at least one), so no level can be bought outright */
const hintLimit = lv => Math.max(1, Math.floor(lv.max / 2));
const START_POINTS = 500;
const REMOVE_ADS = { id: 'remove_ads', price: '14.90 ₪', bonus: 5000 };
const AD_EVERY = 3;
const ADS_LIVE = false;   // no ad network yet: the empty ad space between levels and on the home screen stays hidden until one is connected
const RANKS = [
  { at: 0, name: T('ניצוץ') }, { at: 2000, name: T('גחלילית') }, { at: 6000, name: T('פנס') }, { at: 12000, name: T('מגדלור') },
  { at: 20000, name: T('ירח') }, { at: 32000, name: T('שמש') }, { at: 50000, name: T('גלקסיה') },
];
const par = lv => lv.max * 2 + 2;
/* one star only ever comes from using help, and it pays a quarter of a perfect solve */
const levelPoints = (lv, stars) => Math.round(lv.max * 100 * [0, .5, 1.5, 2][stars]);

let P = null;
function todayStr(d = new Date()) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function weekStr(d = new Date()) { const m = new Date(d); m.setDate(m.getDate() - (m.getDay() + 6) % 7); return todayStr(m); }   // the Monday this week started on
function yesterdayStr() { const d = new Date(); d.setDate(d.getDate() - 1); return todayStr(d); }
function newProfile() {
  return { v2: true, id: 'p' + Math.random().toString(36).slice(2, 10), name: '', balance: START_POINTS, earned: 0, levels: {}, daily: {}, streak: { last: '', count: 0 }, ach: [] };
}
/* earned = lifetime points from play (ranks + leaderboard); balance = what you can spend */
function gain(n, counts = true) { P.balance += n; if (counts) P.earned += n; }
const totalStars = () => ALL.reduce((s, l) => s + (P.levels[l.id] ? P.levels[l.id].stars : 0), 0);
const recOf = i => P.levels[ALL[i].id];
const isSolved = i => !!recOf(i);
const unlocked = i => i === 0 || isSolved(i) || isSolved(i - 1);
function rankOf(pts) { let i = 0; while (i + 1 < RANKS.length && pts >= RANKS[i + 1].at) i++; return { i, ...RANKS[i], next: RANKS[i + 1] }; }

/* ================= storage ================= */
/* Outside Claude there is no window.storage, so keep everything in this browser instead and progress survives a reload.
   Shared entries (the leaderboard) then hold only this player, until a real backend is connected. */
if (!window.storage) {
  try {
    const LS = window.localStorage; LS.setItem('beam:test', '1'); LS.removeItem('beam:test');
    const k = (key, sh) => 'beam:' + (sh ? 's:' : 'p:') + key;
    window.storage = {
      async get(key, sh) { const v = LS.getItem(k(key, sh)); if (v === null) throw new Error('not found'); return { key, value: v, shared: !!sh }; },
      async set(key, value, sh) { LS.setItem(k(key, sh), value); return { key, value, shared: !!sh }; },
      async delete(key, sh) { LS.removeItem(k(key, sh)); return { key, deleted: true }; },
      async list(prefix, sh) {
        const pre = k(prefix || '', sh), base = k('', sh), keys = [];
        for (let i = 0; i < LS.length; i++) { const n = LS.key(i); if (n.startsWith(pre)) keys.push(n.slice(base.length)); }
        return { keys, shared: !!sh };
      },
    };
  } catch (e) { /* private mode or blocked storage: the game still runs, it just starts fresh each time */ }
}
async function loadProfile() {
  try { if (window.storage) { const r = await window.storage.get('beam-profile', false); if (r && r.value) P = JSON.parse(r.value); } }
  catch (e) { /* first visit */ }
  if (!P) {
    P = newProfile();
    try {
      if (window.storage) {
        const old = await window.storage.get('beam-progress', false);
        if (old && old.value) for (const i of JSON.parse(old.value).solved || []) if (OLD_IDS[i]) P.levels[OLD_IDS[i]] = { stars: 1, pts: levelPoints(ALL.find(l => l.id === OLD_IDS[i]), 1) };
      }
    } catch (e) { /* nothing to migrate */ }
  }
  P.levels = P.levels || {};
  if (!P.byId) { // progress used to be stored by position; move it to stable level ids
    const moved = {};
    for (const [k, v] of Object.entries(P.levels)) { const id = /^\d+$/.test(k) ? OLD_IDS[+k] : k; if (id) moved[id] = v; }
    P.levels = moved; P.byId = true;
  }
  P.daily = P.daily || {}; P.ach = P.ach || []; P.streak = P.streak || { last: '', count: 0 };
  if (P.earned === undefined) { // older version had separate sparks
    P.earned = Object.values(P.levels).reduce((s, l) => s + l.pts, 0) + Object.values(P.daily).reduce((s, d) => s + d.score, 0);
    P.balance = START_POINTS + P.earned + (P.sparks || 0) * 10;
    delete P.sparks;
  }
  if (!P.v2) {
    for (const [id, rec] of Object.entries(P.levels)) {
      const lv = ALL.find(l => l.id === id);
      if (lv && rec.stars === 1) { const now = levelPoints(lv, 1); if (rec.pts > now) { P.earned = Math.max(0, P.earned - (rec.pts - now)); rec.pts = now; } }
    }
    P.v2 = true;
  }
}
/* saving is batched, one request at a time, with retries; a failed save never interrupts play */
let saveTimer = null, saving = false, publishPending = false, saveWarned = false;
function save(publish = true) {
  publishPending = publishPending || publish;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => flushSave(0), 1200);
}
async function flushSave(attempt) {
  if (!window.storage) return;
  if (saving) { clearTimeout(saveTimer); saveTimer = setTimeout(() => flushSave(attempt), 600); return; }
  saving = true;
  const publish = publishPending; publishPending = false;
  let ok = true;
  try { await window.storage.set('beam-profile', JSON.stringify(P), false); }
  catch (e) {
    ok = false;
    if (attempt < 3) { publishPending = publishPending || publish; saving = false; clearTimeout(saveTimer); saveTimer = setTimeout(() => flushSave(attempt + 1), 1500 * (attempt + 1)); return; }
    if (!saveWarned) { saveWarned = true; console.warn('Progress could not be saved right now; will try again on the next change.'); }
  }
  saving = false;
  if (ok && publish && P.name) publishScore();
  cloudSoon();
}
/* replace the whole profile (a restored backup, an account's save, a fresh guest) and start the page again on it */
async function switchProfile(next) {
  clearTimeout(saveTimer); clearTimeout(cloudTimer); cloudTimer = null;
  P = next;
  try { await window.storage.set('beam-profile', JSON.stringify(next), false); } catch (e) { /* the reload shows whatever was stored */ }
  location.replace(location.pathname);
}
/* every player, guest or signed in, is backed up on the server a few seconds after a change */
let cloudTimer = null;
const hasProgress = () => !!(P && (P.name || Object.keys(P.levels || {}).length || Object.keys(P.daily || {}).length));
function cloudSoon() { if (!cloudTimer && hasProgress()) cloudTimer = setTimeout(cloudSave, 4000); }
async function cloudSave() {
  clearTimeout(cloudTimer); cloudTimer = null;
  if (!hasProgress() || !/^https?:$/.test(location.protocol)) return false;
  const data = { ...P }; delete data.key;                     // the device key never leaves the device
  try { return !!(await rpc('beam_save', { p_id: P.id, p_secret: playerKey(), p_data: data })); } catch (e) { return false; }
}
document.addEventListener('visibilitychange', () => { if (document.hidden && cloudTimer) cloudSave(); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && saveTimer) { clearTimeout(saveTimer); flushSave(0); } });
/* ---- online leaderboard ----
   Shared scores live in a small database. Players stay anonymous: this device keeps a random id and a secret key,
   and the key is what lets it update or delete its own row. The publishable key below is meant to be public.
   When the server cannot be reached, the table falls back to what this device knows (just this player). */
const BACKEND = { url: 'https://lwtimaunczpjfvppmudd.supabase.co', key: 'sb_publishable_ll8ay08mufmaqKP1NHBnVQ_Xtn2EXBW' };
/* the signed-in session, if any: kept in this browser, refreshed shortly before it runs out */
const Session = (() => {
  let s = null, refreshing = null;
  try { s = JSON.parse(localStorage.getItem('beam:session') || 'null'); } catch (e) { /* storage blocked: guests only */ }
  const store = v => { s = v; try { if (v) localStorage.setItem('beam:session', JSON.stringify(v)); else localStorage.removeItem('beam:session'); } catch (e) { /* stays in memory */ } };
  async function token() {
    if (!s) return null;
    if (Date.now() < s.expires_at - 60000) return s.access_token;
    if (!refreshing) refreshing = (async () => {
      try {
        const r = await fetch(`${BACKEND.url}/auth/v1/token?grant_type=refresh_token`, { method: 'POST',
          headers: { apikey: BACKEND.key, 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: s.refresh_token }) });
        if (r.status === 400 || r.status === 401) { store(null); return null; }       // the sign-in was revoked or expired for good
        if (!r.ok) return null;
        const j = await r.json();
        store({ ...s, access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Date.now() + j.expires_in * 1000 });
        return j.access_token;
      } catch (e) { return null; } finally { refreshing = null; }
    })();
    return refreshing;
  }
  return { get: () => s, store, token };
})();
async function rpc(fn, args) {
  const call = async tk => {
    const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 8000);
    try {
      const headers = { apikey: BACKEND.key, 'Content-Type': 'application/json' };
      if (tk) headers.Authorization = 'Bearer ' + tk;
      return await fetch(`${BACKEND.url}/rest/v1/rpc/${fn}`, { method: 'POST', signal: ctl.signal, headers, body: JSON.stringify(args) });
    } finally { clearTimeout(timer); }
  };
  const tk = await Session.token();
  let r = await call(tk);
  if (r.status === 401 && tk) r = await call(null);          // a stale session must not lock a player out of their own device
  if (!r.ok) throw new Error(fn + ' ' + r.status);
  return await r.json();
}
/* anonymous play statistics: which level was started or finished and how it went. No player id is sent,
   and nothing is sent at all when the browser asks not to be tracked. */
function track(kind, extra) {
  if (!G || navigator.doNotTrack === '1' || !/^https?:$/.test(location.protocol)) return;
  rpc('beam_event', { p_kind: kind, p_level: G.mode === 'daily' || G.mode === 'weekly' ? G.mode : G.mode === 'duel' ? 'duel' : G.lv.id, ...extra }).catch(() => {});
}
function playerKey() {
  if (!P.key) {
    const a = new Uint8Array(16); (window.crypto || window.msCrypto).getRandomValues(a);
    P.key = [...a].map(b => b.toString(16).padStart(2, '0')).join(''); save(false);
  }
  return P.key;
}
const WEEKLY_BONUS = 1500;
async function publishWeekly() {
  const w = weekStr(), d = P.weekly && P.weekly[w];
  if (!d || !P.name) return;
  try { await rpc('beam_submit_weekly', { p_id: P.id, p_secret: playerKey(), p_week: w, p_score: d.score, p_moves: d.moves, p_time: d.time }); } catch (e) { /* tried again with the next solve */ }
}
async function publishScore() {
  if (!P.name) return;
  const t = todayStr(), d = P.daily[t];
  try {   // this device's own copy, so the table still shows you when offline
    if (window.storage) {
      await window.storage.set('lb:' + P.id, JSON.stringify({ name: P.name, total: P.earned, stars: totalStars(), levels: Object.keys(P.levels).length, clean: Object.values(P.levels).filter(l => l.stars > 1).length }), true);
      if (d) await window.storage.set(`day:${t}:${P.id}`, JSON.stringify({ name: P.name, score: d.score, moves: d.moves, time: d.time }), true);
    }
  } catch (e) { /* local copy is optional */ }
  try {
    const ok = await rpc('beam_submit_score', { p_id: P.id, p_secret: playerKey(), p_name: P.name, p_total: P.earned, p_stars: totalStars(), p_levels: Object.keys(P.levels).length, p_clean: Object.values(P.levels).filter(l => l.stars > 1).length, p_avatar: lookOf('char') });
    if (ok && d) await rpc('beam_submit_daily', { p_id: P.id, p_secret: playerKey(), p_day: t, p_score: d.score, p_moves: d.moves, p_time: d.time });
  } catch (e) { if (!saveWarned) console.warn('Leaderboard update skipped for now.'); }
}
async function readLocalBoard(prefix) {
  if (!window.storage) return [];
  try {
    const res = await window.storage.list(prefix, true);
    const keys = (res && res.keys || []).slice(0, 60);
    const rows = await Promise.all(keys.map(async k => {
      try { const r = await window.storage.get(k, true); return r ? { id: k.split(':').pop(), ...JSON.parse(r.value) } : null; }
      catch (e) { return null; }
    }));
    return rows.filter(Boolean);
  } catch (e) { return []; }
}
/* rows come back ranked by the server, with your own row included wherever it stands */
async function readBoard(tab) {
  try {
    const rows = tab === 'all' ? await rpc('beam_leaderboard', { p_id: P.id, p_limit: 25 })
      : tab === 'week' ? await rpc('beam_leaderboard_week', { p_week: weekStr(), p_id: P.id, p_limit: 25 })
      : await rpc('beam_leaderboard_day', { p_day: todayStr(), p_id: P.id, p_limit: 25 });
    return { online: true, rows: rows.map(r => ({ ...r, time: r.time_s })) };
  } catch (e) {
    const val = r => tab === 'all' ? r.total : r.score;
    if (tab === 'week') { const w = P.weekly && P.weekly[weekStr()]; return { online: false, rows: w && P.name ? [{ id: P.id, name: P.name, ...w, rank: 1 }] : [] }; }
    const rows = (await readLocalBoard(tab === 'all' ? 'lb:' : `day:${todayStr()}:`)).sort((a, b) => val(b) - val(a)).map((r, n) => ({ ...r, rank: n + 1 }));
    return { online: false, rows };
  }
}
async function leaveLeaderboard() {
  try { await rpc('beam_delete_me', { p_id: P.id, p_secret: playerKey() }); }
  catch (e) { toast(T('אין חיבור כרגע. נסו שוב מאוחר יותר.')); return; }
  try { if (window.storage) { await window.storage.delete('lb:' + P.id, true); await window.storage.delete(`day:${todayStr()}:${P.id}`, true); } } catch (e) { /* nothing stored */ }
  P.name = ''; save(false); renderHome(); openSettings(); toast(T('השם והניקוד הוסרו מהטבלה'));
}

/* ================= achievements ================= */
const chapterRange = ci => { let s = 0; for (let c = 0; c < ci; c++) s += CHAPTERS[c].levels.length; return [s, s + CHAPTERS[ci].levels.length]; };
const chapterDone = ci => { const [a, b] = chapterRange(ci); for (let i = a; i < b; i++) if (!isSolved(i)) return false; return true; };
const ACH = [
  { id: 'first', name: T('אור ראשון'), desc: T('פתרו את השלב הראשון'), reward: 200, test: () => isSolved(0) },
  { id: 'three', name: T('מושלם'), desc: T('קבלו שלושה כוכבים בשלב'), reward: 300, test: () => Object.values(P.levels).some(l => l.stars === 3) },
  ...CHAPTERS.map((c, ci) => ({ id: 'ch' + ci, name: T`פרק ${c.name}`, desc: T`השלימו את כל שלבי פרק ${ci + 1}`, reward: 500 + ci * 250, test: () => chapterDone(ci) })),
  { id: 'hard3', name: T('בלי עזרה'), desc: T('שלושה כוכבים בשלב מהפרק האחרון'), reward: 1500, test: () => { const [a, b] = chapterRange(CHAPTERS.length - 1); for (let i = a; i < b; i++) if (recOf(i) && recOf(i).stars === 3) return true; return false; } },
  { id: 'stars60', name: T('אספן כוכבים'), desc: T('צברו 60 כוכבים'), reward: 1000, test: () => totalStars() >= 60 },
  { id: 'starsAll', name: T('שמיים זרועי כוכבים'), desc: T`צברו את כל ${ALL.length * 3} הכוכבים`, reward: 5000, test: () => totalStars() >= ALL.length * 3 },
  { id: 'daily1', name: T('אתגר ראשון'), desc: T('סיימו אתגר יומי'), reward: 300, test: () => Object.keys(P.daily).length >= 1 },
  { id: 'daily7', name: T('שבוע של אתגרים'), desc: T('סיימו 7 אתגרים יומיים'), reward: 1500, test: () => Object.keys(P.daily).length >= 7 },
  { id: 'streak3', name: T('חוזרים לאור'), desc: T('היכנסו שלושה ימים ברצף'), reward: 500, test: () => P.streak.count >= 3 },
  { id: 'streak7', name: T('שבוע זוהר'), desc: T('היכנסו שבעה ימים ברצף'), reward: 1500, test: () => P.streak.count >= 7 },
];
function checkAchievements() {
  const fresh = ACH.filter(a => !P.ach.includes(a.id) && a.test());
  fresh.forEach((a, n) => {
    P.ach.push(a.id); gain(a.reward);
    setTimeout(() => { Sound.play('achievement'); toast(T`הישג חדש: ${a.name}`, `+${fmt(a.reward)}`); }, 1800 + n * 2600);
  });
  if (fresh.length) save();
}

/* ================= icons ================= */
const ICON_POINTS = `<svg viewBox="0 0 1 1"><circle cx=".5" cy=".5" r=".42" fill="var(--orange)" stroke="var(--orange-d)" stroke-width=".07"/><path d="${starPath(.5, .52, .24, .1)}" fill="#fff"/></svg>`;
const ICON_STAR = `<svg viewBox="0 0 1 1"><path d="${starPath(.5, .52, .45, .2)}" fill="var(--star)" stroke="var(--star-d)" stroke-width=".06" stroke-linejoin="round"/></svg>`;
const ICON_STAR_OFF = `<svg viewBox="0 0 1 1"><path d="${starPath(.5, .52, .45, .2)}" fill="var(--rule)" stroke="var(--rule)" stroke-width=".06" stroke-linejoin="round"/></svg>`;
const ICON_MIRROR = `<svg viewBox="0 0 1 1"><line x1=".2" y1=".8" x2=".8" y2=".2" stroke="var(--blue-d)" stroke-width=".26" stroke-linecap="round"/><line x1=".2" y1=".8" x2=".8" y2=".2" stroke="#fff" stroke-width=".13" stroke-linecap="round"/></svg>`;
const PIC_MIRROR = '<img class="pwi" src="media/ui/t-mirror.webp" alt="">', PIC_HINT = '<img class="pwi" src="media/ui/t-hint.webp" alt="">', PIC_HAMMER = '<img class="pwi" src="media/ui/t-hammer.webp" alt="">';   // painted tool icons for the level screen
const ICON_HAMMER = `<svg viewBox="0 0 1 1"><rect x=".44" y=".38" width=".12" height=".55" rx=".05" fill="#C98A4B" transform="rotate(35 .5 .5)"/><rect x=".18" y=".1" width=".5" height=".26" rx=".07" fill="#E9ECF8" stroke="#5A4D86" stroke-width=".05" transform="rotate(35 .5 .5)"/></svg>`;
const ICON_HINT = `<svg viewBox="0 0 1 1"><path d="M.5 .1A.28 .28 0 0 1 .66 .62V.72H.34V.62A.28 .28 0 0 1 .5 .1Z" fill="#FFE45C" stroke="#E5A800" stroke-width=".04"/><rect x=".36" y=".76" width=".28" height=".1" rx=".04" fill="#A99BD6"/></svg>`;
const ICON_MOVES = `<svg viewBox="0 0 1 1"><circle cx=".5" cy=".5" r=".36" fill="none" stroke="var(--purple)" stroke-width=".12"/><circle cx=".5" cy=".5" r=".1" fill="var(--purple)"/></svg>`;
const ICON_CLOCK = `<svg viewBox="0 0 1 1"><circle cx=".5" cy=".54" r=".38" fill="var(--green)"/><path d="M.5 .32V.54L.65 .64" stroke="#fff" stroke-width=".09" stroke-linecap="round" fill="none"/></svg>`;
const ICON_LOCK = `<svg viewBox="0 0 1 1"><rect x=".22" y=".45" width=".56" height=".42" rx=".08" fill="var(--muted)"/><path d="M.33 .45V.33A.17 .17 0 0 1 .67 .33V.45" fill="none" stroke="var(--muted)" stroke-width=".09"/></svg>`;
const fmt = n => n.toLocaleString(LANG === 'en' ? 'en-US' : 'he-IL');
const movesText = n => n === 1 ? T('מהלך אחד') : T`${n} מהלכים`;
const coinHTML = (icon, n) => `${icon}<span>${fmt(n)}</span>`;

/* ================= ui helpers ================= */
const SCREENS = ['allch', 'home', 'game', 'leader', 'achievements', 'help', 'settings', 'login', 'duel', 'watch', 'friends', 'pals', 'shop', 'garden', 'map'];
/* the firefly on the entry page: a looping clip with its mask stacked underneath, painted onto a canvas so the forest shows through */
let flyTarget = null;
const GFLY = Object.assign(document.createElement('canvas'), { width: 320, height: 320, id: 'gardenFly', className: 'gbug' });       // the same clip inside the garden and the room; it survives every redraw of the scene
function flyShow(c) {
  if (c === flyTarget) return;
  const was = flyTarget; flyTarget = c;
  let v = flyShow.v;
  if (!c) { if (v) v.pause(); return; }
  if (!v) { v = flyShow.v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('muted', ''); v.preload = 'auto'; v.src = 'media/fly.mp4'; }
  const N = 320, work = flyShow.work || (flyShow.work = document.createElement('canvas')); work.width = N; work.height = 2 * N;
  const wctx = work.getContext('2d', { willReadFrequently: true });
  const tick = () => {
    const to = flyTarget; if (!to) { flyShow.run = false; return; }
    if (v.readyState >= 2) try {
      wctx.drawImage(v, 0, 0, N, 2 * N);
      const img = wctx.getImageData(0, 0, N, 2 * N), d = img.data, half = N * N * 4;
      for (let i = 0; i < half; i += 4) d[i + 3] = d[half + i];
      to.getContext('2d').putImageData(img, 0, 0, 0, 0, N, N);
      if (!to.classList.contains('live')) to.classList.add('live');
    } catch (e) { flyTarget = null; flyShow.run = false; return; }
    if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(tick); else requestAnimationFrame(tick);
  };
  const go = v.play(); if (go && go.catch) go.catch(() => {});
  if (!flyShow.run) { flyShow.run = true; tick(); requestAnimationFrame(tick); }
}
const TAB_OF = { allch: 'home', shop: 'shop', leader: 'leader', home: 'home', pals: 'home', friends: 'duel', garden: 'garden' };       // the screens that carry the two bars
function show(id) {
  if (id !== 'game') liveStop(); if (id !== 'watch') watchStop();
  if (id !== 'game' && id !== 'login') setTimeout(claimGifts, 300);          // coming out of a board, or into the game: anything waiting is collected right away
  for (const s of SCREENS) $(s).hidden = s !== id; window.scrollTo(0, 0); Sound.music(id === 'game');
  const tab = TAB_OF[id];
  $('hud').hidden = $('tabbar').hidden = !tab; document.body.classList.toggle('tabbed', !!tab); document.body.classList.toggle('playing', id === 'game'); document.body.classList.toggle('onhome', id === 'home'); document.body.classList.toggle('onleader', id === 'leader');
  for (const b of $('tabbar').children) b.classList.toggle('on', b.dataset.tab === tab);
  if (tab) hudSync();
  flyShow(id === 'home' ? $('homeFly') : id === 'garden' ? GFLY : null);
}
/* the level's tip sits halfway between the clock and the top of the board picture (or the firefly, when she stands above it) */
function placeTip() {
  const tip = $('tip'); tip.style.transform = '';
  if (!tip.textContent) return;
  requestAnimationFrame(() => {
    if ($('game').hidden) return;
    tip.style.transform = '';
    const clock = $('timeBar').hidden ? document.querySelector('.gstats') : $('timeBar');
    let top = Infinity;
    for (const im of $('board').querySelectorAll('image.frame, image:not([class])')) top = Math.min(top, im.getBoundingClientRect().top);
    if (!isFinite(top)) top = $('board').getBoundingClientRect().top;
    const from = clock.getBoundingClientRect().bottom, r = tip.getBoundingClientRect();
    if (top - from < r.height) return;
    tip.style.transform = `translateY(${Math.round((from + top) / 2 - (r.top + r.bottom) / 2)}px)`;
  });
}
addEventListener('resize', () => { if (typeof G !== 'undefined' && G && !$('game').hidden) placeTip(); });
function hudSync() {
  $('meName').textContent = P.name || T('שחקן חדש');
  $('meRank').textContent = rankOf(P.earned).name;
  $('meBug').src = avatarSrc(lookOf('char'));
  $('homePoints').innerHTML = `<img alt="" src="media/ui/star.webp"><span>${fmt(P.balance)}</span><u>+</u>`;
}
let toastTimer;
function toast(text, amount) {
  const t = $('toast');
  t.innerHTML = `${ICON_POINTS}<span></span>`;
  t.querySelector('span').textContent = amount ? `${text}  ${amount}` : text;
  t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2300);
}
function modal(html, onReady, locked) {
  $('modal').innerHTML = html; $('modal').dataset.locked = locked ? '1' : ''; $('overlay').hidden = false;
  if (!locked) {            // every window that may simply be dismissed gets the same close button
    const x = document.createElement('button'); x.className = 'mclose'; x.setAttribute('aria-label', T('סגירה'));
    x.innerHTML = '<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M4 4l10 10M14 4L4 14" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/></svg>';
    x.onclick = () => { Sound.play('tap'); closeModal(); };
    $('modal').appendChild(x);
  }
  if (onReady) onReady($('modal'));
}
function closeModal() { $('overlay').hidden = true; document.body.classList.remove('paused'); }
function bugInto(svg) { firefly(svg, 0, 0, 0, 1, 1.7, null); }

function askName(after) {
  const def = P.name || T`גחלילית ${Math.floor(100 + Math.random() * 900)}`;
  modal(`<img class="bug" alt="" src="${POSE.welcome}">
    <h3>${T`איך לקרוא לכם?`}</h3>
    <p>${T`השם יופיע בטבלת המובילים, וכל השחקנים יוכלו לראות אותו.`}</p>
    <input id="nameInput" maxlength="16" aria-label="${T`שם`}">
    <button class="btn orange" id="nameSave">${T`שמירה`}</button>`, m => {
      const inp = m.querySelector('#nameInput'); inp.value = P.name || ''; inp.placeholder = def;
      const done = () => {
        const v = (inp.value.trim() || def).replace(/[<>]/g, '').trim().slice(0, 16);
        if (!v) { inp.focus(); return; }
        P.name = v; closeModal(); save(); renderHome(); if (after) after();
      };
      m.querySelector('#nameSave').onclick = done;
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') done(); });
    });
}

/* ================= daily bonus ================= */
function dailyBonus() {
  const t = todayStr();
  if (P.streak.last === t) return;
  P.streak.count = P.streak.last === yesterdayStr() ? P.streak.count + 1 : 1;
  P.streak.last = t;
  const reward = Math.min(P.streak.count, 7) * 100;
  gain(reward, false); save();
  let days = '';
  for (let i = 1; i <= 7; i++) days += `<i class="${i <= Math.min(P.streak.count, 7) ? 'on' : ''}">${i * 100}</i>`;
  modal(`<img class="bug" alt="" src="${POSE.hero}">
    <h3>${P.streak.count > 1 ? T`${P.streak.count} ימים ברצף!` : T('ברוכים השבים!')}</h3>
    <p>${T`קיבלתם ${reward} נקודות לקניות. חזרו מחר כדי להגדיל את הבונוס.`}</p>
    <div class="streak">${days}</div>
    <button class="btn green" id="bonusOk">${T`איסוף`}</button>`, m => {
            m.querySelector('#bonusOk').onclick = () => { Sound.play('bonus'); closeModal(); renderHome(); checkAchievements(); };
    }, true);
}

/* ================= the level map =================
   Each chapter is one picture with a glowing path. The ten stops sit on the path (x%, y% of the dish), the gate at the
   top leads to the next chapter, and the firefly waits beside the level to play next. */
const M_DIR = 'media/map/';
const MAP_PADS = [[66, 78.5], [36, 73.5], [23, 65.5], [49, 60], [75, 54.5], [50, 48], [27, 43], [43, 37.2], [64, 33.2], [50, 29]], MAP_GATE = [50, 19.5];
/* the path runs away from the viewer, so every stop is drawn smaller than the one before it */
const padScale = j => 1 - .42 * j / (MAP_PADS.length - 1);
const MAP_STARS = {       // where the three rim stars sit on each button drawing: x%, y%, width%
  done: [[26, 80, 15], [49.5, 83, 19], [73, 80, 15]], cur: [[33.5, 76, 11], [49.5, 77.5, 14.5], [64.5, 76, 11]], check: [[34.5, 80, 10.5], [49.5, 82, 13.5], [64.5, 80, 10.5]] };
const chBase = ci => CHAPTERS.slice(0, ci).reduce((n, c) => n + c.levels.length, 0);
let mapCh = 0, mapSeq = 0;
function openMap(ch, justSolved) {
  $('mapWarp').classList.remove('on'); $('mScene').classList.remove('warp');
  if (ch === undefined) { const n = ALL.findIndex((_, i) => !isSolved(i)); ch = n === -1 ? CHAPTERS.length - 1 : ALL[n].ch; }
  mapCh = ch; show('map'); renderMap(true, justSolved);
  if (justSolved) setTimeout(milestonePrompts, 2600);
}
/* the firefly waits beside the stop, on the side that has room; she faces right, so she is turned round when she stands on its right */
const flyAt = j => { const [x, y] = MAP_PADS[j], k = padScale(j), left = x < 50, off = 13 + 15 * k, want = left ? x - off : x + off, fx = Math.max(13, Math.min(87, want)), squeezed = Math.abs(want - fx); return [fx, y - (5.5 + squeezed * .75) * k, left]; };   // on the outer side of the road, where no other stop stands; near the edge she rises above the stop instead
/* the road: one smooth line through the entry at the bottom, every stop and the gate; it is gold as far as the player has come */
const MAP_ROAD = (() => {
  const c = [[90, 85], ...MAP_PADS, [MAP_GATE[0], MAP_GATE[1] + 3]], segs = [];
  for (let a = 0; a < c.length - 1; a++) {
    const p0 = c[Math.max(a - 1, 0)], p1 = c[a], p2 = c[a + 1], p3 = c[Math.min(a + 2, c.length - 1)], pts = [];
    for (let n = 0; n <= 14; n++) { const t = n / 14; pts.push([0, 1].map(d => .5 * (2 * p1[d] + (p2[d] - p0[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t * t + (3 * p1[d] - p0[d] - 3 * p2[d] + p3[d]) * t * t * t).toFixed(2)).join(',')); }
    segs.push(pts);
  }
  return segs;           // segs[a] runs into stop a (segs[0] comes from the entry); the last one runs into the gate
})();
function roadHTML(upTo, u) {         // upTo: how many segments are gold
  const lit = MAP_ROAD.slice(0, upTo).flat().join(' '), rest = MAP_ROAD.slice(Math.max(upTo - 1, 0)).flat().slice(upTo ? 14 : 0).join(' ');
  const line = (pts, stroke, w, extra = '') => pts ? `<polyline points="${pts}" stroke="${stroke}" stroke-width="${(w * u).toFixed(1)}"${extra}/>` : '';
  return line(rest, 'rgba(20,5,70,.55)', 5.2) + line(rest, 'rgba(170,140,255,.45)', 3.6) + line(rest, 'rgba(240,230,255,.7)', .8, ` stroke-dasharray="${(.3 * u).toFixed(1)} ${(2.8 * u).toFixed(1)}"`) +
    line(lit, 'rgba(255,197,48,.28)', 9) + line(lit, '#B26A00', 4.9) + line(lit, '#FFD75E', 3.6) + line(lit, '#FFF8DC', .8, ` stroke-dasharray="${(.5 * u).toFixed(1)} ${(3.3 * u).toFixed(1)}"`);
}
const CH_PRIZE = 500;
/* finishing a chapter pays once, into the wallet; chapters finished before the prize existed pay the first time their page is opened */
function chapterPrize(ci) {
  if (!chapterDone(ci) || (P.chPrize || []).includes(ci)) return;
  P.chPrize = [...(P.chPrize || []), ci]; gain(CH_PRIZE, false); save(false); hudSync();
  Sound.play('purchase'); toast(T('פרס הפרק!'), `+${fmt(CH_PRIZE)}`);
}
function mapBurst(x, y, n = 12) {
  const scene = $('mScene'), w = scene.clientWidth;
  for (let k = 0; k < n; k++) {
    const a = k / n * Math.PI * 2, d = w * (.1 + Math.random() * .1), i = document.createElement('i');
    i.className = 'spark'; i.style.cssText = `left:${x}%;top:${y}%;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px`;
    scene.appendChild(i); setTimeout(() => i.remove(), 950);
  }
}
/* justSolved: the level just finished. Its stars pop on one by one, then the firefly flies on and the next stop lights up. */
function renderMap(scroll, justSolved) {
  const scene = $('mScene'), ch = CHAPTERS[mapCh], base = chBase(mapCh), done = chapterDone(mapCh), seq = ++mapSeq;
  const cel = justSolved !== undefined && justSolved >= base && justSolved < base + MAP_PADS.length ? justSolved - base : -1;
  $('mapTitle').textContent = T(ch.name); $('mapSub').textContent = T`פרק ${mapCh + 1} מתוך ${CHAPTERS.length}`;
  const u = Math.min(scene.clientWidth, scene.clientHeight * .47) / 100 || 3.9, left = ch.levels.slice(0, MAP_PADS.length).filter((_, j) => !isSolved(base + j)).length;
  $('mapStars').textContent = `${ch.levels.reduce((n, _, j) => n + (recOf(base + j) ? recOf(base + j).stars : 0), 0)} / ${ch.levels.length * 3}`;
  if (cel < 0) chapterPrize(mapCh);
  $('mapPrev').disabled = mapCh === 0; $('mapNext').disabled = mapCh >= CHAPTERS.length - 1 || !unlocked(chBase(mapCh + 1));
  scene.style.backgroundImage = `url(${M_DIR}bg.webp)`;
  const firstOpen = ch.levels.slice(0, MAP_PADS.length).findIndex((_, j) => !isSolved(base + j));
  const litTo = cel >= 0 ? cel + 1 : firstOpen < 0 ? MAP_ROAD.length : firstOpen + 1;
  let html = `<svg class="mroad" id="mapRoad" viewBox="0 0 100 100" preserveAspectRatio="none">${roadHTML(litTo, u)}</svg>`, curJ = -1;
  for (let k = 0; k < 18; k++) html += `<i class="mote" style="left:${5 + Math.random() * 90}%;top:${4 + Math.random() * 92}%;--mx:${(Math.random() * 30 - 15).toFixed(0)}px;--my:${(-10 - Math.random() * 30).toFixed(0)}px;animation-delay:${(-Math.random() * 7).toFixed(1)}s;animation-duration:${(5 + Math.random() * 5).toFixed(1)}s"></i>`;
  html += `<button class="mcot" id="mapCot" style="left:10%;top:88%" aria-label="${T('הגן של הגחלילית')}"><img alt="" src="${M_DIR}cottage.webp"></button>`;
  html += `<button class="mportal ${done && cel < 0 ? 'open' : 'shut'}" id="mapGate" style="left:${MAP_GATE[0]}%;top:${MAP_GATE[1]}%" aria-label="${T('השער לפרק הבא')}"><img class="pt" alt="" src="${M_DIR}portal.webp"></button>` +
    `<div class="mprize${done ? ' got' : ''}" id="mapPrize" style="left:${MAP_GATE[0]}%;top:${MAP_GATE[1] + 2.6}%">${done ? (mapCh < CHAPTERS.length - 1 ? T('הפרק הושלם · לפרק הבא') : T('הפרק הושלם')) : `<img alt="" src="media/ui/gift.webp">` + (left === 1 ? T('פרס הפרק · עוד שלב אחד') : T`פרס הפרק · עוד ${left} שלבים`)}</div>`;
  ch.levels.slice(0, MAP_PADS.length).forEach((lv, j) => {
    const i = base + j, [x, y] = MAP_PADS[j], rec = recOf(i), open = unlocked(i), big = j === 4, k = padScale(j);
    const art = !open ? 'locked' : !rec ? 'cur' : big ? 'check' : 'done', w = (art === 'cur' ? 35 : art === 'check' ? 31 : art === 'locked' ? 22 : 24.5) * k;
    if (art === 'cur' && curJ < 0) curJ = j;
    const stars = art === 'locked' ? '' : MAP_STARS[art].map(([sx, sy, sw], k) => `<img class="st${rec && rec.stars > k && j !== cel ? '' : ' off'}" alt="" src="${M_DIR}star.webp" style="left:${sx}%;top:${sy}%;width:${sw}%">`).join('');
    html += `<button class="mpad s-${art}${cel >= 0 && art === 'cur' ? ' pre' : ''}" data-i="${i}" data-j="${j}" style="left:${x}%;top:${y}%;width:calc(var(--u) * ${w.toFixed(1)});--j:${j};--k:${k.toFixed(2)};z-index:${art === 'cur' ? 24 : 20 - j}" aria-label="${T`שלב ${i + 1}`}${rec ? T`, ${rec.stars} כוכבים` : ''}"><img class="art" alt="" src="${M_DIR}${art}.webp">` +
      `<b class="num">${i + 1}</b>${stars}</button>`;
  });
  const at = cel >= 0 ? flyAt(cel) : curJ >= 0 ? flyAt(curJ) : [MAP_GATE[0] - 30, MAP_GATE[1] - 2, true];
  html += `<img class="mfly${at[2] ? '' : ' flip'}" id="mapFly" alt="" src="${M_DIR}fly.webp" style="left:${at[0]}%;top:${at[1]}%">`;
  scene.innerHTML = html;
  scene.style.setProperty('--u', u + 'px');
  // the big button carries on from where the player is: the next unsolved level here, or the gate once the chapter is done
  const nextI = firstOpen, play = $('mapPlay');
  play.hidden = (firstOpen < 0 && mapCh >= CHAPTERS.length - 1) || (firstOpen >= 0 && !unlocked(base + firstOpen));
  if (!play.hidden) {
    const lv = nextI >= 0 ? ch.levels[nextI] : null, secs = lv ? timeLimit(lv) : 0;
    $('mapPlayMain').textContent = lv ? T`שלב ${base + nextI + 1}` : T('לפרק הבא');
    $('mapPlaySub').textContent = lv ? (lv.max === 1 ? T('מראה אחת') : T`${lv.max} מראות`) + (secs ? ` · ${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}` : '') : '';
    play.onclick = () => { if (lv) { Sound.play('whoosh'); openLevel(base + nextI); } else $('mapGate').click(); };
  }
  scene.classList.toggle('intro', cel < 0 && !!scroll);
  if (cel < 0 && scroll) {
    setTimeout(() => { if (seq === mapSeq) scene.classList.remove('intro'); }, 1500);
    // each stop lands with its own note, climbing as they go up the path, and the gate answers with a glitter
    for (let j = 0; j < Math.min(ch.levels.length, MAP_PADS.length); j++) setTimeout(() => { if (seq === mapSeq && !$('map').hidden) Sound.play('pop', j); }, 120 + j * 60);
    setTimeout(() => { if (seq === mapSeq && !$('map').hidden) Sound.play('sparkle', 9); }, 120 + 11 * 60);
  }
  for (const b of scene.querySelectorAll('.mpad')) b.onclick = () => {
    const i = +b.dataset.i;
    if (!unlocked(i)) { Sound.play('error'); Haptic.play('error'); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); toast(T('קודם פותרים את השלב שלפניו')); return; }
    Sound.play('whoosh'); Sound.play('sparkle', 6); mapBurst(MAP_PADS[+b.dataset.j][0], MAP_PADS[+b.dataset.j][1] - 2, 10);
    setTimeout(() => { if (seq === mapSeq && !$('map').hidden) openLevel(i); }, 260);
  };
  const gate = $('mapGate');
  gate.onclick = () => {
    if (!chapterDone(mapCh)) { Sound.play('error'); gate.classList.remove('shake'); void gate.offsetWidth; gate.classList.add('shake'); toast(T('השער נפתח כשפותרים את כל שלבי הפרק')); return; }
    if (mapCh >= CHAPTERS.length - 1) { winFx('fireworks'); toast(T('סיימתם את כל הפרקים!')); return; }
    Sound.play('flyby'); mapBurst(MAP_GATE[0], MAP_GATE[1] - 6, 16); setTimeout(() => { if (seq === mapSeq) { mapCh++; renderMap(true); } }, 350);
  };
  $('mapCot').onclick = () => { Sound.play('sparkle', 5); openGarden(); };
  const centre = (el, smooth) => { if (el) el.scrollIntoView({ block: 'center', behavior: smooth ? 'smooth' : 'auto' }); };
  if (cel < 0) { if (scroll) requestAnimationFrame(() => centre(scene.querySelector('.mpad.s-cur') || gate)); return; }
  // ---- the little celebration after a level ----
  const pad = scene.querySelector(`.mpad[data-j="${cel}"]`), rec = recOf(base + cel), fly = $('mapFly'), next = scene.querySelector('.mpad.pre');
  const later = (ms, fn) => setTimeout(() => { if (seq === mapSeq && !$('map').hidden) fn(); }, ms);
  requestAnimationFrame(() => centre(pad));
  [...pad.querySelectorAll('img.st')].slice(0, rec ? rec.stars : 0).forEach((st, k) => later(450 + k * 300, () => { st.classList.remove('off'); st.classList.add('pop'); Sound.play('star', 4 + k * 2); Sound.play('sparkle', 4); Haptic.play('star'); }));
  const t = 450 + (rec ? rec.stars : 0) * 300 + 250;
  later(t, () => {
    const to = next ? flyAt(+next.dataset.j) : [MAP_GATE[0] - 30, MAP_GATE[1] - 2, true];
    fly.classList.toggle('flip', !to[2]); fly.style.left = to[0] + '%'; fly.style.top = to[1] + '%';
    Sound.play('flyby'); centre(next || gate, true);
  });
  later(t + 950, () => {
    $('mapRoad').innerHTML = roadHTML(next ? +next.dataset.j + 1 : MAP_ROAD.length, u);
    if (next) { later(900, () => renderMap(false)); const j = +next.dataset.j; next.classList.remove('pre'); next.classList.add('reveal'); mapBurst(MAP_PADS[j][0], MAP_PADS[j][1] - 2, 14); Sound.play('unlock'); Haptic.play('win'); later(750, () => next.classList.remove('reveal')); }
    else if (done) {
      chapterPrize(mapCh);
      gate.classList.remove('shut'); gate.classList.add('open'); mapBurst(MAP_GATE[0], MAP_GATE[1] - 6, 20); Sound.play('gate'); Haptic.play('win'); winFx('stars');
      if (mapCh >= CHAPTERS.length - 1) { toast(T('סיימתם את כל הפרקים!')); return; }
      toast(T('השער נפתח!'));
      // the map carries on by itself: the firefly dives into the gate, the picture rushes into its light, and the next chapter unrolls
      later(1500, () => { fly.style.left = MAP_GATE[0] + '%'; fly.style.top = MAP_GATE[1] - 6 + '%'; fly.classList.add('dive'); Sound.play('flyby'); });
      later(2300, () => { scene.style.transformOrigin = `${MAP_GATE[0]}% ${MAP_GATE[1] - 6}%`; scene.classList.add('warp'); $('mapWarp').classList.add('on'); Sound.play('whoosh'); Sound.play('sparkle', 12); });
      later(3150, () => { scene.classList.remove('warp'); mapCh++; renderMap(true); Sound.play('unlock'); setTimeout(() => $('mapWarp').classList.remove('on'), 60); toast(T`פרק ${mapCh + 1}: ${CHAPTERS[mapCh].name}`); });
    }
  });
}
setInterval(() => { if (!$('map').hidden && !document.hidden && $('overlay').hidden && Math.random() < .55) Sound.play('chime'); }, 4200);
window.addEventListener('resize', () => { if (!$('map').hidden) renderMap(false); });

/* ================= the firefly's garden =================
   A place to spend points that has nothing to do with solving levels: a house that grows in three steps, and plants,
   lamps and mushrooms that each have their own spots in the picture. Every spot is (x%, y% of the item's foot, width%). */
const G_DIR = 'media/garden/';
const GARDEN = {
  house: { at: [61, 64], levels: [{ img: 'house1', price: 2000, w: 44, name: 'בית קטן' }, { img: 'house2', price: 5000, w: 54, name: 'בית משפחתי' }, { img: 'house3', price: 12000, w: 47, name: 'ארמון' }] },
  items: [
    { id: 'flower', name: 'פרח', price: 250, slots: [[27, 76, 10], [80, 78, 10], [9, 82, 9], [92, 71, 8], [44, 72, 8]] },
    { id: 'stone', name: 'אבן', price: 200, slots: [[33, 86, 14], [70, 93, 15, 1]] },
    { id: 'mush', name: 'פטריה זוהרת', price: 400, slots: [[17, 73, 13], [88, 84, 12], [38, 97, 12]] },
    { id: 'lamp', name: 'פנס', price: 700, slots: [[36, 68, 12], [87, 66, 12, 1]] },
    { id: 'bush', name: 'שיח פרחים', price: 600, slots: [[21, 99, 30], [82, 100, 30]] },
    { id: 'orb', name: 'צמח אורות', price: 800, slots: [[7, 70, 14], [96, 93, 14]] },
    { id: 'mushes', name: 'משפחת פטריות', price: 900, slots: [[13, 91, 24], [76, 75, 16]] },
    { id: 'box', name: 'אדנית פרחים', price: 1000, slots: [[46, 67, 17]] },
  ],
};
const ROOM = [
  { id: 'rug', name: 'שטיח פרח', price: 1500, flat: 1, slots: [[50, 86, 64]] },
  { id: 'plant', name: 'עציץ זוהר', price: 800, slots: [[90, 75, 19]] },
  { id: 'wbox', name: 'אדנית לחלון', price: 600, slots: [[34, 43.5, 17], [69, 43.5, 17]] },
  { id: 'walllamp', name: 'מנורת קיר', price: 700, slots: [[8, 30, 11], [92, 30, 11, 1]] },
  { id: 'shelf', name: 'מדף שיקויים', price: 1000, slots: [[16, 41, 19]] },
  { id: 'floorlamp', name: 'מנורת פרח', price: 1200, slots: [[8, 74, 19]] },
  { id: 'chair', name: 'כורסה', price: 2500, slots: [[27, 77, 34]] },
  { id: 'scope', name: 'טלסקופ', price: 4000, slots: [[73, 67, 21]] },
];
let gView = 'out';
const gState = () => { const g = (P.garden = P.garden || { house: 0, items: {} }); g.room = g.room || {}; return g; };
const gCount = () => { const g = gState(); return g.house + Object.values(g.items).reduce((a, b) => a + b, 0) + Object.values(g.room).reduce((a, b) => a + b, 0); };
const gTotal = GARDEN.house.levels.length + GARDEN.items.concat(ROOM).reduce((n, it) => n + it.slots.length, 0);
function openGarden() { gView = 'out'; show('garden'); renderGarden(); }
function gGo(view) {
  if (view === 'in' && !gState().house) { toast(T('קודם בונים בית, ואז אפשר להיכנס')); return; }
  gView = view; Sound.play('whoosh'); renderGarden();
}
function renderGarden(fresh) {
  const g = gState(), scene = $('gScene'), inside = gView === 'in' && g.house > 0;
  const dir = inside ? 'media/room/' : G_DIR, list = inside ? ROOM : GARDEN.items, have = inside ? g.room : g.items;
  $('gardenPoints').innerHTML = coinHTML(ICON_POINTS, P.balance); hudSync();
  $('gTabOut').setAttribute('aria-selected', !inside); $('gTabIn').setAttribute('aria-selected', inside);
  $('gShopTitle').textContent = inside ? T('מה מוסיפים לבית?') : T('מה מוסיפים לגן?');
  scene.style.backgroundImage = `url(${dir}bg.webp)`;
  const put = (img, x, y, w, flip, key, z, cls = '') => `<img class="gi${flip ? ' flip' : ''}${fresh === key ? ' new' : ''}${cls}" alt="" src="${img}.webp" style="left:${x}%;top:${y}%;width:${w}%;z-index:${z || Math.round(y)}">`;
  let html = '';
  if (!inside && g.house) { const h = GARDEN.house.levels[g.house - 1]; html += put(G_DIR + h.img, GARDEN.house.at[0], GARDEN.house.at[1], h.w, 0, 'house', 0, ' door'); }
  for (const it of list) for (let i = 0; i < (have[it.id] || 0) && i < it.slots.length; i++) { const [x, y, w, f] = it.slots[i]; html += put(dir + it.id, x, y, w, f, it.id + ':' + i, it.flat ? 1 : 0); }
  if (inside) html += `<button class="gdoor" id="gDoor" aria-label="${T('יציאה לגן')}"></button>`;
  html += `<img class="gbug" alt="" src="${OLD_POSES.includes(P.avatar) ? avatarSrc(P.avatar) : BUG_SRC}">`;
  if (!inside && !g.house) {             // an empty garden says plainly what to do: the plot where the house will stand, and the button to build it right here
    const h = GARDEN.house.levels[0], [hx, hy] = GARDEN.house.at, can = P.balance >= h.price;
    html += `<div class="gplot" style="left:${hx}%;top:${hy}%;width:${h.w}%"><img alt="" src="${G_DIR + h.img}.webp"><i></i><b>✨</b><b>✨</b><b>✨</b></div>`;
    html += `<div class="gcta"><img alt="" src="${G_DIR + h.img}.webp"><div><strong>${T('הגחלילית צריכה בית!')}</strong><span>${T('בונים לה בית, ואז ממלאים את הגן ואת הבית בקישוטים.')}</span></div>
      ${can ? `<button class="btn green" id="gBuild">${T`בנו בית · ${fmt(h.price)}`}</button>`
            : `<button class="btn orange" id="gEarn">${T('לשחק ולצבור נקודות')}</button><small class="gneed">${T`הבית עולה ${fmt(h.price)}. חסרות עוד ${fmt(h.price - P.balance)} נקודות.`}</small>`}</div>`;
  }
  if (!inside && g.house && !Object.keys(g.room).length) html += `<p class="ghint low">${T('הקישו על הבית כדי להיכנס')}</p>`;
  scene.innerHTML = html; scene.appendChild(GFLY);
  for (const im of scene.querySelectorAll('img.gi')) im.onclick = () => {
    if (im.classList.contains('door')) return gGo('in');
    im.classList.remove('new', 'hop'); void im.offsetWidth; im.classList.add('hop'); Sound.play('tap');
  };
  if (inside) $('gDoor').onclick = () => gGo('out');
  if ($('gBuild')) $('gBuild').onclick = () => buyGarden('house');
  if ($('gEarn')) $('gEarn').onclick = () => { Sound.play('whoosh'); openMap(); };
  // the list of things to add: the next step of the house first, then whatever still has a free spot
  const card = (key, img, name, sub, price, done) => `<div class="shopitem"><img class="thumb" alt="" src="${img}.webp"><b>${T(name)}</b><small>${sub}</small>` +
    (done ? `<button class="act on" disabled>${T('הושלם')}</button>` : `<button class="act" data-g="${key}"${P.balance < price ? ' disabled' : ''}>${ICON_POINTS}${fmt(price)}</button>`) + '</div>';
  const next = GARDEN.house.levels[g.house], last = GARDEN.house.levels[GARDEN.house.levels.length - 1];
  $('gShop').innerHTML = (inside ? '' : next ? card('house', G_DIR + next.img, next.name, g.house ? T('שדרוג הבית') : T('הבית הראשון'), next.price) : card('house', G_DIR + last.img, last.name, T('הבית הכי גדול'), 0, true)) +
    list.map(it => { const n = have[it.id] || 0; return card((inside ? 'in:' : 'out:') + it.id, dir + it.id, it.name, `${n}/${it.slots.length}`, it.price, n >= it.slots.length); }).join('');
  for (const b of $('gShop').querySelectorAll('[data-g]')) b.onclick = () => buyGarden(b.dataset.g);
}
function buyGarden(key) {
  const g = gState(), [where, id] = key.split(':'), inside = where === 'in';
  const it = (inside ? ROOM : GARDEN.items).find(x => x.id === id), have = inside ? g.room : g.items;
  const price = key === 'house' ? GARDEN.house.levels[g.house].price : it.price;
  if (P.balance < price) return;
  let fresh;
  if (key === 'house') { g.house++; fresh = 'house'; } else { fresh = id + ':' + (have[id] || 0); have[id] = (have[id] || 0) + 1; }
  P.balance -= price; save(false);
  logPurchase(key === 'house' ? 'garden:house' + g.house : (inside ? 'room:' : 'garden:') + id, price, false);
  Sound.play('purchase'); Haptic.play('win');
  renderGarden(fresh); renderHome();
  $('gScene').scrollIntoView({ behavior: 'smooth', block: 'center' });
  toast(key === 'house' ? T('הבית מוכן!') : inside ? T('נוסף לבית') : T('נוסף לגן'), `-${fmt(price)}`);
  if (gCount() === gTotal) setTimeout(() => { winFx('fireworks'); toast(T('הגן והבית מושלמים!')); }, 900);
}

/* ================= shop =================
   Points buy looks, never an advantage: the beam's colour, the board's theme and the win effect today; characters
   and the firefly's garden next. Buying comes out of the spending balance only, so it never costs a leaderboard place. */
const SHOP = {
  beam: { title: 'צבע הקרן', items: [
    { id: 'classic', name: 'קלאסית', price: 0 }, { id: 'gold', name: 'זהב', price: 2000 }, { id: 'ice', name: 'קרח', price: 2000 }, { id: 'lime', name: 'ליים', price: 2000 },
    { id: 'violet', name: 'סגול לילה', price: 3000 }, { id: 'fire', name: 'אש', price: 6000 }, { id: 'rainbow', name: 'קשת', price: 9000 }, { id: 'star', name: 'אבק כוכבים', price: 12000 }] },
  board: { title: 'עיצוב הלוח', items: [
    { id: 'classic', name: 'קלאסי', price: 0 }, { id: 'candy', name: 'ממתקים', price: 4000 }, { id: 'forest', name: 'יער קסום', price: 5000 }, { id: 'flower', name: 'גן פרחים', price: 6000 }, { id: 'coral', name: 'פריחת שקיעה', price: 6000 },
    { id: 'ocean', name: 'אוקיינוס', price: 8000 }, { id: 'crystal', name: 'קריסטל ירח', price: 8000 }, { id: 'mushroom', name: 'פטריות קסם', price: 10000 }, { id: 'stars', name: 'שמש וירח', price: 12000 }, { id: 'royal', name: 'מלכותי', price: 15000 }] },
  fx: { title: 'אפקט ניצחון', items: [
    { id: 'classic', name: 'בלי אפקט', price: 0, icon: '✨' }, { id: 'confetti', name: 'קונפטי', price: 4000, icon: '🎊' }, { id: 'bubbles', name: 'בועות', price: 5000, icon: '🫧' },
    { id: 'stars', name: 'גשם כוכבים', price: 6000, icon: '🌟' }, { id: 'hearts', name: 'לבבות', price: 6000, icon: '💜' }, { id: 'dust', name: 'אבקת קסם', price: 7000, icon: '✨' }, { id: 'snow', name: 'שלג קריסטל', price: 7000, icon: '❄️' },
    { id: 'rainbow', name: 'שובל קשת', price: 8000, icon: '🌈' }, { id: 'fireworks', name: 'זיקוקים', price: 10000, icon: '🎆' }, { id: 'lightning', name: 'ברק', price: 11000, icon: '⚡' }, { id: 'swarm', name: 'נחיל גחליליות', price: 14000, icon: '✨' }] },
  // the face a player shows in the top bar, to friends and on the podium; the firefly herself stays the guide of the game
  char: { title: 'דמויות', items: [
    { id: 'bug', name: 'גחלילית', price: 0 }, { id: 'fox', name: 'שועל הצללים', price: 0 }, { id: 'bunny', name: 'ארנבת הכוכבים', price: 0 },
    { id: 'owl', name: 'ינשוף הלילה', price: 4000 }, { id: 'cat', name: 'חתול הירח', price: 4000 }, { id: 'hedgehog', name: 'קיפוד הברקים', price: 5000 }, { id: 'frog', name: 'צפרדע הרעל', price: 5000 },
    { id: 'raccoon', name: 'דביבון התעלומות', price: 6000 }, { id: 'deer', name: 'איילת הזוהר', price: 8000 }, { id: 'moth', name: 'פרפר הקסם', price: 10000 }, { id: 'dragon', name: 'דרקון האש', price: 12000 }, { id: 'unicorn', name: 'חד-קרן', price: 18000 }] },
};
const CHAR_IDS = new Set(SHOP.char.items.map(x => x.id).filter(x => x !== 'bug'));
const PREFIX = { beam: 'bm-', board: 'bd-', fx: 'fx-', char: 'ch-' };
const P_KEY = cat => cat === 'char' ? 'avatar' : cat, BASE = cat => cat === 'char' ? 'bug' : 'classic';
const SHOP_TAB = { beam: 'קרן', board: 'לוח', fx: 'אפקט', char: 'דמויות', emo: 'אימוג׳ים', coins: 'נקודות' };
/* reaction sets for duels: five faces of each character. Bought once, every owned set shows up in the duel picker.
   Priced at about a third of the character itself (the firefly's set is free). */
const EMO_FACES = ['happy', 'angry', 'think', 'cry', 'love'];
const EMO_SETS = [
  { id: 'fox', name: 'שועל הצללים', price: 1500 }, { id: 'bunny', name: 'ארנבת הכוכבים', price: 1500 },
  { id: 'owl', name: 'ינשוף הלילה', price: 2000 }, { id: 'cat', name: 'חתול הירח', price: 2000 },
  { id: 'hedgehog', name: 'קיפוד הברקים', price: 2500 }, { id: 'frog', name: 'צפרדע הרעל', price: 2500 },
  { id: 'raccoon', name: 'דביבון התעלומות', price: 3000 }, { id: 'deer', name: 'איילת הזוהר', price: 3500 },
  { id: 'moth', name: 'פרפר הקסם', price: 4000 }, { id: 'dragon', name: 'דרקון האש', price: 4500 }, { id: 'unicorn', name: 'חד-קרן', price: 6000 },
];
const emoSrc = (c, f) => `media/emo/${c}/${f}.webp`;
const ownsEmo = id => !!(P.own && P.own['emo:' + id]);
function renderEmoSets() {
  return `<p class="emohint">${T('סטים של 5 פרצופים לשליחה ליריב בדו-קרב. כל סט שקונים נוסף לבחירה במשחק.')}</p><div class="emosets">` + EMO_SETS.map(it => {
    const have = ownsEmo(it.id);
    return `<div class="shopitem emoset${have ? ' have' : ''}"><b>${T(it.name)}</b><div class="faces">${EMO_FACES.map(f => `<img alt="" src="${emoSrc(it.id, f)}">`).join('')}</div>
      ${have ? `<button class="act on" disabled>${T('יש לכם')}</button>` : `<button class="act" data-emo="${it.id}"${P.balance < it.price ? ' disabled' : ''}>${ICON_POINTS}${fmt(it.price)}</button>`}</div>`;
  }).join('') + '</div>';
}
function buyEmoSet(it) {
  modal(`<div class="faces big">${EMO_FACES.map(f => `<img alt="" src="${emoSrc(it.id, f)}">`).join('')}</div>
    <h3>${T`אימוג׳ים: ${T(it.name)}`}</h3>
    <p>${T`המחיר: ${fmt(it.price)} נקודות. יישארו לכם ${fmt(P.balance - it.price)}.`}</p>
    <button class="btn orange" id="buyGo">${T('קנייה')}</button>
    <button class="btn ghosty" id="buyNo" style="margin-top:12px">${T('ביטול')}</button>`, m => {
      m.querySelector('#buyNo').onclick = closeModal;
      m.querySelector('#buyGo').onclick = () => {
        if (P.balance < it.price || ownsEmo(it.id)) { closeModal(); return; }
        P.balance -= it.price; P.own = P.own || {}; P.own['emo:' + it.id] = 1;
        save(true); Sound.play('purchase'); Haptic.play('win'); closeModal(); renderShop();
        toast(T('הסט נוסף לדו-קרב'), `-${fmt(it.price)}`);
        logPurchase('emo:' + it.id, it.price, false);
        const pk = $('emoPick'); if (pk) { pk.remove(); $('emoBtn').remove(); }   // the picker is rebuilt with the new set next time
      };
    });
}
const owns = (cat, id) => (SHOP[cat].items.find(x => x.id === id) || {}).price === 0 || !!(P.own && P.own[cat + ':' + id]);
const lookOf = cat => SHOP[cat].items.some(x => x.id === P[P_KEY(cat)]) && owns(cat, P[P_KEY(cat)]) ? P[P_KEY(cat)] : BASE(cat);
const OLD_BOARDS = { night: 'stars' };   // the drawn boards were replaced by painted ones; a purchase carries over
function migrateBoards() {
  let ch = false;
  for (const [o, n] of Object.entries(OLD_BOARDS)) {
    if (P.own && P.own['board:' + o]) { delete P.own['board:' + o]; P.own['board:' + n] = 1; ch = true; }
    if (P.board === o) { P.board = n; ch = true; }
  }
  if (ch) save();
}
function applyLook() {
  migrateBoards();
  fxPreload(lookOf('fx'));
  for (const el of [$('game'), $('help')]) {          // only where a board is drawn, so the shop's samples keep their own look
    for (const c of [...el.classList]) if (/^b[md]-/.test(c)) el.classList.remove(c);
    for (const cat of ['beam', 'board']) if (lookOf(cat) !== 'classic') el.classList.add(PREFIX[cat] + lookOf(cat));
  }
}
const BEAM_SAMPLE = '<svg viewBox="0 0 3 1.2"><path class="glow" d="M.2 .9H1.5V.3H2.8"/><path class="beamline" d="M.2 .9H1.5V.3H2.8"/></svg>';
const BOARD_SAMPLE = '<svg class="bsample" viewBox="0 0 3 1.2"><rect width="3" height="1.2" fill="var(--tray)"/>' +
  [0, 1, 2, 3, 4, 5].map(i => `<rect x="${.27 + i * .42}" y=".12" width=".36" height=".4" rx=".08" fill="var(--t-${['blue', 'green', 'purple', 'orange'][i % 4]})"/><rect x="${.27 + i * .42}" y=".66" width=".36" height=".4" rx=".08" fill="var(--t-${['purple', 'orange', 'blue', 'green'][i % 4]})"/>`).join('') + '</svg>';
const sampleOf = (cat, it) => cat === 'char' ? `<img class="thumb char" alt="" src="${avatarSrc(it.id)}">` : cat === 'beam' ? BEAM_SAMPLE : cat === 'board' ? `<img class="thumb brd" alt="" src="media/board/thumb-${it.id}.webp">` : `<button class="fxtry" data-try="${it.id}" aria-label="${T('תצוגה מקדימה')}"><img alt="" src="media/fx/${it.id}.webp?v=2"></button>`;
function openShop() { show('shop'); renderShop(); }
let shopCat = 'beam';
/* points for money. The amounts climb faster than the prices, so a bigger pack is a better deal. */
const COIN_PACKS = [
  { id: 'coins_500', coins: 500, price: '3.90 ₪', n: 1 }, { id: 'coins_1000', coins: 1000, price: '6.90 ₪', n: 2 }, { id: 'coins_2000', coins: 2000, price: '11.90 ₪', n: 3 },
  { id: 'coins_5000', coins: 5000, price: '24.90 ₪', n: 4 }, { id: 'coins_12000', coins: 12000, price: '49.90 ₪', n: 5, tag: 'הכי משתלם' }, { id: 'coins_30000', coins: 30000, price: '99.90 ₪', n: 6, tag: 'אוצר' },
];
const coinPile = n => `<span class="pile p${n}">` + Array.from({ length: [1, 2, 3, 5, 7, 9][n - 1] }, (_, i) => `<img alt="" src="media/ui/coin${1 + i % 3}.webp">`).join('') + '</span>';
function renderCoins() {
  return `<p class="coinlead">${T('חסרות נקודות ללוח או לדמות? אפשר להשלים כאן.')}</p><div class="shopgrid">` + COIN_PACKS.map(k =>
    `<div class="shopitem coinpack">${k.tag ? `<i class="tag">${T(k.tag)}</i>` : ''}${coinPile(k.n)}<b>${fmt(k.coins)}</b><button class="act money" data-pack="${k.id}">${k.price}</button></div>`).join('') + '</div>';
}
function soonModal() {
    return modal(`<img class="bug" alt="" src="${POSE.thumbs}"><h3>${T('בקרוב')}</h3>
      <p>${T('התשלום ייפתח בקרוב. בינתיים אפשר לצבור נקודות בשלבים, באתגר היומי ובדו-קרב.')}</p>
      <button class="btn green" id="soonOk">${T('הבנתי')}</button>`, m => { m.querySelector('#soonOk').onclick = closeModal; });
}
async function buyCoins(k) {
  if (!PAYMENTS.live) return soonModal();             // no checkout is connected yet, and points must never be handed out for a tap
  if (!await PAYMENTS.buy(k)) return;
  logPurchase(k.id, agorot(k.price), true); gain(k.coins, false); save(); renderShop(); renderHome(); Sound.play('purchase'); Haptic.play('win');
  toast(T('הנקודות נוספו'), `+${fmt(k.coins)}`);
}
function renderShop() {
  $('shopPoints').innerHTML = coinHTML(ICON_POINTS, P.balance); hudSync();
  $('shopBody').innerHTML = `<div class="tabs five" role="tablist">` + [...Object.keys(SHOP), 'emo', 'coins'].map(c => `<button role="tab" data-cat="${c}" aria-selected="${c === shopCat}">${T(SHOP_TAB[c])}</button>`).join('') + '</div>' +
    (shopCat === 'coins' ? [renderCoins()] : shopCat === 'emo' ? [renderEmoSets()] : [shopCat].map(cat => `<div class="shopgrid">` + SHOP[cat].items.map(it => {
    const btn = it.id === lookOf(cat) ? `<button class="act on" disabled>${T('בשימוש')}</button>`
      : owns(cat, it.id) ? `<button class="act have" data-use="${cat}:${it.id}">${T('בחירה')}</button>`
      : `<button class="act" data-buy="${cat}:${it.id}"${P.balance < it.price ? ' disabled' : ''}>${ICON_POINTS}${fmt(it.price)}</button>`;
    return `<div class="shopitem ${PREFIX[cat]}${it.id}">${sampleOf(cat, it)}<b>${T(it.name)}</b>${btn}</div>`;
  }).join('') + '</div>')).join('');
  for (const el of $('shopBody').querySelectorAll('[data-pack]')) el.onclick = () => buyCoins(COIN_PACKS.find(k => k.id === el.dataset.pack));
  for (const el of $('shopBody').querySelectorAll('[data-cat]')) el.onclick = () => { shopCat = el.dataset.cat; Sound.play('tap'); renderShop(); };
  const find = key => { const [cat, id] = key.split(':'); return [cat, SHOP[cat].items.find(x => x.id === id)]; };
  for (const el of $('shopBody').querySelectorAll('[data-use]')) el.onclick = () => { const [cat, it] = find(el.dataset.use); P[P_KEY(cat)] = it.id; save(cat === 'char'); applyLook(); if (cat === 'char' && P.name) publishScore(); Sound.play('tap'); renderShop(); if (cat === 'fx') winFx(it.id); if (cat === 'char') pulse(); };
  for (const el of $('shopBody').querySelectorAll('[data-buy]')) el.onclick = () => buyLook(...find(el.dataset.buy));
  for (const el of $('shopBody').querySelectorAll('[data-try]')) el.onclick = () => winFx(el.dataset.try);
  for (const el of $('shopBody').querySelectorAll('[data-emo]')) el.onclick = () => buyEmoSet(EMO_SETS.find(x => x.id === el.dataset.emo));
}
function buyLook(cat, it) {
  modal(`<div class="shopitem ${PREFIX[cat]}${it.id}" style="box-shadow:none;padding:0;background:none">${cat === 'fx' ? `<img alt="" src="media/fx/${it.id}.webp?v=2" style="height:150px;width:150px;max-width:100%;object-fit:contain;display:block;margin:0 auto">` : sampleOf(cat, it)}</div>
    <h3>${T(it.name)}</h3>
    <p>${T`המחיר: ${fmt(it.price)} נקודות. יישארו לכם ${fmt(P.balance - it.price)}.`}</p>
    <button class="btn orange" id="buyGo">${T('קנייה')}</button>
    <button class="btn ghosty" id="buyNo" style="margin-top:12px">${T('ביטול')}</button>`, m => {
      m.querySelector('#buyNo').onclick = closeModal;
      m.querySelector('#buyGo').onclick = () => {
        if (P.balance < it.price) { closeModal(); return; }
        P.balance -= it.price; P.own = P.own || {}; P.own[cat + ':' + it.id] = 1; P[P_KEY(cat)] = it.id;
        save(cat === 'char'); applyLook(); if (cat === 'char' && P.name) publishScore(); Sound.play('purchase'); Haptic.play('win'); closeModal(); renderShop(); renderHome();
        toast(T('נוסף לאוסף שלכם'), `-${fmt(it.price)}`);
        if (cat === 'fx') winFx(it.id);
        logPurchase(cat + ':' + it.id, it.price, false);
      };
    });
}
/* the win effect: a short shower of the painted pieces (media/fx/p) over the screen; plain images, so it costs nothing when idle */
const FX_N = { swarm: 0, bubbles: 10, stars: 9, dust: 6, hearts: 6, rainbow: 7, snow: 8, lightning: 7, fireworks: 7, portal: 10, confetti: 10 };
const fxSrc = (kind, i) => `media/fx/p/${kind}-${i}.webp?v=${kind === 'confetti' || kind === 'hearts' || kind === 'dust' ? 2 : 1}`;
function fxPreload(kind) { if (FX_N[kind] === undefined) return; for (const k of kind === 'swarm' ? ['portal', 'dust'] : [kind, 'dust']) for (let i = 0; i < FX_N[k]; i++) new Image().src = fxSrc(k, i); }
/* ---- the win effects: each one is a small scene made of the painted pieces, moved by the Web Animations API ---- */
function fxKit(box, kind) {
  const W = innerWidth, H = innerHeight, rnd = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.floor(Math.random() * a.length)];
  const tf = (x, y, s = 1, r = 0) => `translate(${x}px,${y}px) translate(-50%,-50%) rotate(${r}deg) scale(${s})`;
  const sprite = (i, size, k = kind) => { const im = document.createElement('img'); im.alt = ''; im.src = fxSrc(k, i); im.className = 'fxd'; im.style.width = size + 'px'; box.appendChild(im); return im; };
  const dot = (size, color) => { const d = document.createElement('i'); d.className = 'fxdot'; d.style.width = d.style.height = size + 'px'; if (color) d.style.background = `radial-gradient(circle,#fff 0%,${color} 45%,transparent 72%)`; box.appendChild(d); return d; };
  // sample a path t -> [x, y, scale, rotate, opacity] into keyframes
  const path = (el, fn, dur, delay = 0, n = 26, easing = 'linear') => {
    const k = []; for (let i = 0; i <= n; i++) { const [x, y, s, r, o] = fn(i / n); k.push({ transform: tf(x, y, s, r), opacity: o }); }
    return el.animate(k, { duration: dur, delay, easing, fill: 'both' });
  };
  const fade = t => t < .08 ? t / .08 : t > .85 ? (1 - t) / .15 : 1;
  // one grain of glitter: pops, twinkles, drifts down and fades
  const speck = (x, y, big, color) => {
    const r = Math.random(), sz = big ? rnd(24, 40) : rnd(8, 20);
    const el = r < .5 && !big ? dot(sz * .6, color) : sprite(r < .8 ? pick([1, 3]) : 5, sz, 'dust');
    const dx = rnd(-26, 26), dy = rnd(30, 110), sp = rnd(-120, 120);
    el.animate([{ transform: tf(x, y, 0), opacity: 0 }, { transform: tf(x, y, 1.3, sp * .2), opacity: 1, offset: .12 },
      { transform: tf(x + dx * .5, y + dy * .4, .7, sp * .6), opacity: .9, offset: .45 }, { transform: tf(x + dx * .7, y + dy * .65, 1.05, sp * .8), opacity: 1, offset: .6 },
      { transform: tf(x + dx, y + dy, .2, sp), opacity: 0 }], { duration: rnd(900, 1600), easing: 'ease-out', fill: 'both' });
  };
  // something that flies along fn(t) -> [x, y] for dur ms, shedding glitter as it goes
  const comet = (el, fn, dur, delay, every = 22, spin = 0, onEnd, color) => {
    const t0 = performance.now() + delay; let last = 0;
    const step = now => {
      const t = Math.min(1, (now - t0) / dur);
      if (t >= 0) {
        const [x, y, s = 1] = fn(t); el.style.opacity = 1; el.style.transform = tf(x, y, s, spin * t);
        if (now - last > every) { last = now; speck(x + rnd(-8, 8), y + rnd(-8, 8), Math.random() < .1, color); }
      }
      if (t < 1) return requestAnimationFrame(step);
      el.style.opacity = 0; if (onEnd) onEnd(...fn(1));
    };
    requestAnimationFrame(step);
  };
  const burst = (x, y, n, dist, opts = {}) => {     // pieces thrown out from a point, then pulled down a little
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + rnd(-.2, .2), d = rnd(dist * .5, dist), el = opts.make ? opts.make(k) : dot(rnd(6, 12), opts.color && pick(opts.color));
      const g = opts.gravity ?? 60, sp = rnd(-200, 200);
      path(el, t => [x + Math.cos(a) * d * (1 - (1 - t) ** 2), y + Math.sin(a) * d * (1 - (1 - t) ** 2) + g * t * t, 1 - t * .5, sp * t, t < .7 ? 1 : (1 - t) / .3], rnd(800, 1300), opts.delay || 0, 16);
    }
  };
  const flash = (color = '#FFF6D6', peak = .55, delay = 0) => { const f = document.createElement('i'); f.className = 'fxflash'; f.style.background = color; box.appendChild(f); f.animate([{ opacity: 0 }, { opacity: peak, offset: .1 }, { opacity: 0 }], { duration: 420, delay, fill: 'both' }); };
  return { W, H, box, rnd, pick, tf, sprite, dot, path, fade, speck, comet, burst, flash };
}
const FX_SCENES = {
  dust(k) {          // two wand-sparks write looping trails across the screen
    const { W, H, rnd, sprite, comet, speck } = k;
    const paths = [t => [W * (-.1 + 1.2 * t), H * (.62 - .3 * t) + Math.sin(t * Math.PI * 3) * H * .1],
                   t => [W * (1.1 - 1.2 * t), H * (.2 + .32 * t) + Math.sin(t * Math.PI * 2.4 + 1) * H * .09]];
    paths.forEach((p, n) => comet(sprite(1, 76), p, 1700, n * 380, 28, 540, (x, y) => { for (let j = 0; j < 14; j++) { const a = Math.random() * 6.3, d = rnd(30, 110); speck(x + Math.cos(a) * d, y + Math.sin(a) * d, Math.random() < .3); } }));
    for (let j = 0; j < 16; j++) setTimeout(() => speck(rnd(10, W - 10), rnd(-10, H * .4)), 600 + j * 90);
  },
  confetti(k) {      // two cannons in the bottom corners blast ribbons up; they flutter down
    const { W, H, rnd, sprite, path, fade, flash } = k;
    [0, 1].forEach(side => {
      for (let j = 0; j < 26; j++) {
        const x0 = side ? W + 10 : -10, y0 = H * .9, vx = (side ? -1 : 1) * rnd(W * .25, W * .95), vy = rnd(H * .45, H * .8), sw = rnd(15, 40), ph = rnd(0, 6), r0 = rnd(0, 360), spin = rnd(-900, 900);
        path(sprite(j % 10, rnd(30, 56)), t => [x0 + vx * (1 - (1 - t) ** 2.4) + Math.sin(t * 9 + ph) * sw * t, y0 - vy * Math.sin(Math.min(1, t * 1.6) * Math.PI / 2) + H * .55 * Math.max(0, t - .45) ** 1.6, 1, r0 + spin * t, fade(t)],
          rnd(2600, 3300), side * 140 + rnd(0, 260), 30, 'linear');
      }
    });
  },
  bubbles(k) {       // bubbles wobble up from the bottom and pop into sparkles
    const { W, H, rnd, sprite, path, burst } = k;
    for (let j = 0; j < 22; j++) {
      const x0 = rnd(20, W - 20), top = rnd(H * .12, H * .6), sw = rnd(14, 34), ph = rnd(0, 6), size = rnd(28, 84), dur = rnd(1800, 2800), dl = rnd(0, 1200);
      path(sprite(j % 10, size), t => [x0 + Math.sin(t * 7 + ph) * sw, H + 60 - (H + 60 - top) * (1 - (1 - t) ** 1.6), t > .93 ? 1 + (t - .93) * 8 : 1 + Math.sin(t * 22) * .04, 0, t < .06 ? t / .06 : t > .93 ? 1 - (t - .93) / .07 : 1], dur, dl, 30);
      setTimeout(() => burst(x0 + Math.sin(7 + ph) * sw, top, 7, size * .9, { gravity: 30, make: () => sprite(3, rnd(10, 18), 'dust') }), dl + dur * .93);
    }
  },
  stars(k) {         // a meteor shower falls across the sky, then the stars settle into a glowing constellation
    const { W, H, rnd, sprite, path } = k, box = k.box;
    for (let j = 0; j < 20; j++) {   // the painted shooting stars fly up-right, so turned round they fall down-left
      const x0 = rnd(W * .2, W * 1.25), y0 = rnd(-H * .15, H * .35), dist = rnd(W * .8, W * 1.2), size = rnd(52, 96);
      path(sprite(j % 9, size), t => [x0 - dist * t, y0 + dist * .75 * t, 1, 180, t < .08 ? t / .08 : t > .85 ? (1 - t) / .15 : 1], rnd(650, 950), rnd(0, 1300), 12, 'ease-in');
    }
    // the constellation: points on a gentle wave, joined one by one by a thin line of light
    const n = 6, pts = Array.from({ length: n }, (_, i) => [W * (.12 + .76 * i / (n - 1)), H * (.36 + Math.sin(i * 1.3) * .07 + (i % 2 ? .05 : -.03))]);
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'fxsky'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); box.appendChild(svg);
    pts.slice(1).forEach((q, i) => {
      const p0 = pts[i], len = Math.hypot(q[0] - p0[0], q[1] - p0[1]);
      const ln = el('line', { x1: p0[0], y1: p0[1], x2: q[0], y2: q[1], 'stroke-dasharray': len, 'stroke-dashoffset': len }, svg);
      ln.animate([{ strokeDashoffset: len, opacity: 1 }, { strokeDashoffset: 0, opacity: 1, offset: .3 }, { strokeDashoffset: 0, opacity: 1, offset: .8 }, { strokeDashoffset: 0, opacity: 0 }], { duration: 2600, delay: 1500 + i * 160, fill: 'both' });
    });
    pts.forEach(([x, y], i) => {
      const st = document.createElement('img'); st.alt = ''; st.src = 'media/board/star.webp'; st.className = 'fxd'; st.style.width = (i === 2 || i === 4 ? 46 : 34) + 'px'; box.appendChild(st);
      st.animate([{ transform: k.tf(x, y, 0, -90), opacity: 0 }, { transform: k.tf(x, y, 1.4, 10), opacity: 1, offset: .12 }, { transform: k.tf(x, y, 1, 0), opacity: 1, offset: .22 },
        { transform: k.tf(x, y, 1.15, 0), opacity: 1, offset: .5 }, { transform: k.tf(x, y, 1, 0), opacity: 1, offset: .78 }, { transform: k.tf(x, y, .4, 40), opacity: 0 }], { duration: 2700, delay: 1350 + i * 160, fill: 'both', easing: 'ease-out' });
    });
  },
  hearts(k) {        // a big heart beats twice and bursts; a fountain of hearts floats up
    const { W, H, rnd, sprite, path, burst } = k;
    const cx = W / 2, cy = H * .42, big = sprite(1, Math.min(W * .45, 190));
    path(big, t => [cx, cy, t < .1 ? t * 10 : 1 + .22 * Math.abs(Math.sin(t * Math.PI * 4)) * (t < .55 ? 1 : 0) + (t > .6 ? (t - .6) * 3 : 0), 0, t > .6 ? Math.max(0, 1 - (t - .6) * 4) : 1], 1500, 0, 30);
    setTimeout(() => burst(cx, cy, 16, 170, { gravity: -60, make: j => sprite(j % 6, rnd(26, 46)) }), 900);
    for (let j = 0; j < 22; j++) {
      const x0 = cx + rnd(-W * .4, W * .4), sw = rnd(20, 45), ph = rnd(0, 6), size = rnd(26, 52);
      path(sprite(j % 6, size), t => [x0 + Math.sin(t * 6 + ph) * sw, H + 40 - (H + 80) * t, 1 + Math.sin(t * 30) * .08, Math.sin(t * 6 + ph) * 14, t < .08 ? t / .08 : t > .8 ? (1 - t) / .2 : 1], rnd(2400, 3200), 900 + rnd(0, 1200), 30);
    }
  },
  rainbow(k) {       // a rainbow sweeps in, clouds puff at its feet, stars and small rainbows rain from it
    const { W, H, rnd, sprite, path, fade } = k;
    const cx = W / 2, cy = H * .36, rb = sprite(0, Math.min(W * .78, 300));
    path(rb, t => [cx - (1 - Math.min(1, t * 5)) * 80, cy + (1 - Math.min(1, t * 5)) * 40, Math.min(1, t * 5) * (1 + Math.sin(t * 8) * .03), -20 * (1 - Math.min(1, t * 5)), t > .8 ? (1 - t) / .2 : Math.min(1, t * 6)], 3200, 0, 30);
    [[-1, 3], [1, 4]].forEach(([s, i], n) => path(sprite(i, rnd(90, 120)), t => [cx + s * W * .3, cy + 70, t < .12 ? t / .12 * 1.15 : 1 + Math.sin(t * 12) * .04, 0, t > .8 ? (1 - t) / .2 : 1], 3000, 300 + n * 120, 30));
    for (let j = 0; j < 22; j++) {
      const a = rnd(-Math.PI * .9, -Math.PI * .1), x0 = cx + Math.cos(a) * W * .3, y0 = cy + Math.sin(a) * 60, vx = rnd(-W * .4, W * .4), vy = rnd(80, 200), r = rnd(-300, 300);
      path(sprite(j % 5 === 0 ? [1, 2][j % 2] : [5, 6][j % 2], j % 5 === 0 ? rnd(60, 80) : rnd(22, 40)), t => [x0 + vx * t, y0 - vy * t + H * .9 * t * t, 1, r * t, fade(t)], rnd(1800, 2400), 500 + rnd(0, 1300), 24);
    }
  },
  snow(k) {          // crystal flakes drift down in a gust of wind, twinkling as they turn
    const { W, H, rnd, sprite, path, speck } = k;
    for (let j = 0; j < 30; j++) {
      const x0 = rnd(-W * .2, W), sw = rnd(20, 50), ph = rnd(0, 6), r0 = rnd(0, 360), spin = rnd(-160, 160), size = rnd(24, 60);
      path(sprite(j % 8, size), t => {
        const gust = Math.max(0, Math.min(1, (t - .25) * 2.5));
        return [x0 + Math.sin(t * 5 + ph) * sw + gust * W * .25, -60 + (H + 120) * t, 1 + .15 * Math.max(0, Math.sin(t * 25 + ph)) ** 8, r0 + spin * t, t < .06 ? t / .06 : t > .9 ? (1 - t) / .1 : 1];
      }, rnd(3000, 4000), rnd(0, 900), 36);
    }
    for (let j = 0; j < 18; j++) setTimeout(() => speck(rnd(10, W - 10), rnd(20, H * .8), false, '#BFE8FF'), 300 + j * 140);
  },
  lightning(k) {     // three strikes: the screen flashes, a bolt slams down, sparks spray from where it lands
    const { W, H, rnd, sprite, path, burst, flash } = k;
    [0, 520, 1050, 1500].forEach((t0, n) => {
      const x = rnd(W * .2, W * .8), y = rnd(H * .25, H * .55), size = rnd(110, 170);
      flash('#FFF6D6', .35, t0);
      path(sprite(n % 4, size), t => [x, y, t < .1 ? .6 + t * 5 : 1, rnd(-10, 10) * 0, t < .06 ? 1 : t < .12 ? .25 : t < .18 ? 1 : t > .75 ? (1 - t) / .25 : 1], 900, t0, 20);
      setTimeout(() => burst(x, y + size * .4, 14, 120, { gravity: 140, color: ['#FFE23F', '#FFF6B0', '#7FE7FF'] }), t0 + 60);
      setTimeout(() => burst(x, y, 6, 90, { gravity: 40, make: () => sprite(4 + (n % 3), rnd(24, 40)) }), t0 + 40);
      setTimeout(() => { const m = document.querySelector('main'); if (m && m.animate) m.animate([{ transform: 'translate(0,0)' }, { transform: 'translate(-6px,3px)' }, { transform: 'translate(5px,-3px)' }, { transform: 'translate(-3px,2px)' }, { transform: 'translate(0,0)' }], { duration: 260 }); }, t0);
    });
  },
  fireworks(k) {     // rockets climb with a spark trail and explode into painted bursts
    const { W, H, rnd, sprite, path, dot, comet, burst } = k;
    for (let j = 0; j < 7; j++) {
      const x = rnd(W * .15, W * .85), top = rnd(H * .14, H * .45), t0 = j * 330 + rnd(0, 100);
      comet(dot(12, '#FFD95A'), t => [x + Math.sin(t * 3) * 8, H + 20 - (H + 20 - top) * (1 - (1 - t) ** 2)], 650, t0, 20, 0, (bx, by) => {
        path(sprite(j % 5, rnd(140, 210)), t => [bx, by + t * 30, t < .25 ? t * 4 : 1 + (t - .25) * .3, rnd(0, 360) * 0 + t * 40, t < .1 ? 1 : t > .6 ? (1 - t) / .4 : 1], 1400, 0, 24);
        burst(bx, by, 18, 130, { gravity: 120, color: ['#FFD23F', '#FF6FE0', '#B36BFF', '#7FE7FF'] });
        burst(bx, by, 5, 90, { gravity: 60, make: () => sprite(5 + (j % 2), rnd(22, 34)) });
      }, '#FFC83A');
    }
  },
  swarm(k) {         // a swarm of fireflies flies in from every side, gathers into a big glowing star, holds, then bursts into light
    const { W, H, rnd, tf, burst, flash } = k, box = k.box, cx = W / 2, cy = H * .42;
    const R = Math.min(W, H) * .34, n = 40, pts = [];
    for (let i = 0; i < n; i++) {           // points along the outline of a five-pointed star
      const t = i / n * 10, seg = Math.floor(t), f = t - seg;
      const r0 = seg % 2 ? R * .45 : R, r1 = seg % 2 ? R : R * .45, a0 = -Math.PI / 2 + seg * Math.PI / 5, a1 = a0 + Math.PI / 5;
      const x0 = cx + Math.cos(a0) * r0, y0 = cy + Math.sin(a0) * r0, x1 = cx + Math.cos(a1) * r1, y1 = cy + Math.sin(a1) * r1;
      pts.push([x0 + (x1 - x0) * f, y0 + (y1 - y0) * f]);
    }
    const dim = document.createElement('i'); dim.className = 'fxdim'; box.appendChild(dim);
    dim.animate([{ opacity: 0 }, { opacity: .8, offset: .12 }, { opacity: .8, offset: .75 }, { opacity: 0 }], { duration: 3600, fill: 'both' });
    pts.forEach(([x, y], i) => {
      const fly = document.createElement('i'); fly.className = 'fxfly'; box.appendChild(fly);
      const side = Math.random() * Math.PI * 2, sx = cx + Math.cos(side) * Math.max(W, H) * .8, sy = cy + Math.sin(side) * Math.max(W, H) * .8;
      const mx = (sx + x) / 2 + rnd(-120, 120), my = (sy + y) / 2 + rnd(-120, 120), d = 1400 + rnd(-200, 200);
      const kf = []; for (let s = 0; s <= 20; s++) { const t = s / 20, u = 1 - t; kf.push({ transform: tf(u * u * sx + 2 * u * t * mx + t * t * x, u * u * sy + 2 * u * t * my + t * t * y, .7 + .3 * t), opacity: t < .1 ? t * 10 : 1, offset: t * .55 }); }
      kf.push({ transform: tf(x, y, 1.3), opacity: 1, offset: .7 }); kf.push({ transform: tf(x, y, 1), opacity: 1, offset: .8 });
      kf.push({ transform: tf(cx + (x - cx) * 2.6, cy + (y - cy) * 2.6, .3), opacity: 0 });
      fly.animate(kf, { duration: d / .55 * 1, delay: rnd(0, 250), fill: 'both', easing: 'ease-in-out' });
    });
    const core = document.createElement('i'); core.className = 'fxcore'; core.style.cssText = `left:${cx}px;top:${cy}px`; box.appendChild(core);
    core.animate([{ transform: 'translate(-50%,-50%) scale(0)', opacity: 0, offset: 0 }, { transform: 'translate(-50%,-50%) scale(0)', opacity: 0, offset: .45 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 1, offset: .62 }, { transform: 'translate(-50%,-50%) scale(1.15)', opacity: 1, offset: .74 }, { transform: 'translate(-50%,-50%) scale(3)', opacity: 0 }], { duration: 3000, fill: 'both' });
    setTimeout(() => { flash('#FFF3C4', .4); burst(cx, cy, 30, Math.max(W, H) * .55, { gravity: 60, make: j => k.sprite(1 + (j % 9), rnd(26, 50), 'portal') }); }, 2250);
  },
  portal(k) {        // the gate of light: the screen dims, a door of light opens, rays turn behind it, and it bursts into stars
    const { W, H, rnd, sprite, path, burst, flash } = k, box = k.box, cx = W / 2, cy = H * .42;
    const part = (cls, css) => { const d = document.createElement('i'); d.className = cls; if (css) d.style.cssText = css; box.appendChild(d); return d; };
    part('fxdim').animate([{ opacity: 0 }, { opacity: 1, offset: .1 }, { opacity: 1, offset: .75 }, { opacity: 0 }], { duration: 3600, fill: 'both' });
    const R = Math.max(W, H) * 1.1;
    part('fxrays', `left:${cx}px;top:${cy}px;width:${R}px;height:${R}px`).animate([
      { transform: 'translate(-50%,-50%) rotate(0) scale(.2)', opacity: 0 }, { transform: 'translate(-50%,-50%) rotate(40deg) scale(1)', opacity: .9, offset: .3 },
      { transform: 'translate(-50%,-50%) rotate(110deg) scale(1.1)', opacity: .9, offset: .75 }, { transform: 'translate(-50%,-50%) rotate(150deg) scale(1.2)', opacity: 0 }], { duration: 3400, delay: 250, fill: 'both' });
    const gw = Math.min(W * .5, 220), gh = Math.min(H * .62, 460);
    part('fxgate', `left:${cx}px;top:${cy}px;width:${gw}px;height:${gh}px`).animate([
      { transform: 'translate(-50%,-50%) scaleX(0) scaleY(.6)', opacity: 0 }, { transform: 'translate(-50%,-50%) scaleX(.04) scaleY(1)', opacity: 1, offset: .12 },
      { transform: 'translate(-50%,-50%) scaleX(1) scaleY(1)', opacity: 1, offset: .38 }, { transform: 'translate(-50%,-50%) scaleX(1.05) scaleY(1.02)', opacity: 1, offset: .62 },
      { transform: 'translate(-50%,-50%) scaleX(1.6) scaleY(1.2)', opacity: 0 }], { duration: 3000, delay: 300, fill: 'both', easing: 'cubic-bezier(.3,.7,.3,1)' });
    path(sprite(0, gw * 1.05), t => [cx, cy, t < .3 ? t / .3 * .9 : .9 + (t - .3) * .5, -360 * t, t < .15 ? t / .15 : t > .7 ? (1 - t) / .3 : 1], 2500, 900, 30);
    for (let r = 0; r < 3; r++) part('fxring', `left:${cx}px;top:${cy}px`).animate([{ transform: 'translate(-50%,-50%) scale(.2)', opacity: 1 }, { transform: 'translate(-50%,-50%) scale(9)', opacity: 0 }], { duration: 1200, delay: 1750 + r * 180, fill: 'both', easing: 'ease-out' });
    flash('#FFF3C4', .45, 1700);
    setTimeout(() => {
      burst(cx, cy, 26, Math.max(W, H) * .6, { gravity: 80, make: j => sprite(1 + (j % 9), rnd(30, 58)) });
      burst(cx, cy, 30, Math.max(W, H) * .45, { gravity: 120, color: ['#FFE27A', '#FFFFFF', '#E3C2FF'] });
    }, 1750);
  },
};
function winFx(kind) {
  if (!FX_SCENES[kind] || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
  const box = document.createElement('div'); box.className = 'fxbox fx-' + kind; document.body.appendChild(box);
  FX_SCENES[kind](fxKit(box, kind));
  setTimeout(() => box.remove(), 5200);
}

/* ================= one-time nudges on the map after a win: back up progress (level 5), put the game on the home screen (level 8) ================= */
let installEvt = null;
addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; syncInstallCard(); });
addEventListener('appinstalled', () => { installEvt = null; P.installed = true; save(false); syncInstallCard(); });
const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isInstalled = () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
const canInstall = () => !isInstalled() && (!!installEvt || isIOS());
function syncInstallCard() { const c = $('installCard'); if (c) c.hidden = !canInstall(); }
function openInstall() {
  if (installEvt) { const e = installEvt; e.prompt(); e.userChoice.then(r => { if (r.outcome === 'accepted') { installEvt = null; toast(T('המשחק נוסף למסך הבית')); } syncInstallCard(); }).catch(() => {}); return; }
  modal(`<img class="bug" alt="" src="${POSE.point}"><h3>${T('BEAM במסך הבית')}</h3>
    <p>${T('ככה המשחק נפתח במסך מלא, כמו אפליקציה, בלגיעה אחת.')}</p>
    <ol class="steps">${isIOS() ? `<li>${T('לוחצים על כפתור השיתוף בתחתית הדפדפן (ריבוע עם חץ למעלה).')}</li><li>${T('גוללים ובוחרים "הוספה למסך הבית".')}</li><li>${T('לוחצים "הוסף", והגחלילית מחכה לכם במסך הבית.')}</li>`
      : `<li>${T('פותחים את התפריט של הדפדפן (שלוש הנקודות).')}</li><li>${T('בוחרים "הוספה למסך הבית" או "התקנת אפליקציה".')}</li>`}</ol>
    <button class="btn green" id="instOk">${T('הבנתי')}</button>`, m => { m.querySelector('#instOk').onclick = closeModal; });
}
function milestonePrompts() {
  if (!$('overlay').hidden || $('map').hidden) return;
  const solved = Object.keys(P.levels).length;
  if (solved >= 5 && !P.askedBackup && !Session.get() && Object.values(AUTH.enabled).some(Boolean)) {
    P.askedBackup = true; save(false);
    const on = Object.keys(AUTH.enabled).filter(p => AUTH.enabled[p]);
    modal(`<img class="bug" alt="" src="${POSE.thumbs}"><h3>${T('שומרים את ההתקדמות?')}</h3>
      <p>${T`כבר פתרתם ${solved} שלבים! חברו חשבון, וההתקדמות, הנקודות והקניות יישמרו גם אם תחליפו טלפון או תמחקו את הדפדפן.`}</p>
      ${on.map(p => `<button class="sso ${p}" data-p="${p}" style="margin-bottom:12px">${T`חיבור עם ${PROVIDERS[p]}`}</button>`).join('')}
      <button class="btn ghosty" id="bkLater">${T('אולי אחר כך')}</button>`, m => {
        for (const b of m.querySelectorAll('[data-p]')) b.onclick = () => AUTH.signIn(b.dataset.p);
        m.querySelector('#bkLater').onclick = closeModal;
      });
    return;
  }
  if (solved >= 8 && !P.askedInstall && canInstall()) { P.askedInstall = true; save(false); openInstall(); }
}

/* ================= WhatsApp stickers: the firefly faces as 512px files to save or share ================= */
const STICKERS = ['happy', 'laugh', 'love', 'wow', 'think', 'wink', 'thumbs', 'luck', 'angry', 'sad', 'cry', 'win'];
async function stickerFile(k) { const r = await fetch(`media/stickers/${k}.webp`); return new File([await r.blob()], `beam-${k}.webp`, { type: 'image/webp' }); }   // WhatsApp's own sticker format
async function shareStickers(keys) {
  try {
    const files = await Promise.all(keys.map(stickerFile));
    if (navigator.canShare && navigator.canShare({ files })) { await navigator.share({ files }); return; }
  } catch (e) { if (e && e.name === 'AbortError') return; }
  // no share sheet (most computers): download instead
  const a = document.createElement('a');
  if (keys.length === 1) { a.href = `media/stickers/${keys[0]}.webp`; a.download = `beam-${keys[0]}.webp`; }
  else { a.href = 'media/stickers/beam-stickers.zip'; a.download = 'beam-stickers.zip'; }
  document.body.appendChild(a); a.click(); a.remove();
}
function openStickers() {
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  modal(`<h3>${T('מדבקות לוואטסאפ')}</h3>
    <p style="margin:0 0 10px">${T('הקישו על גחלילית כדי לשמור אותה, או שמרו את כולן יחד.')}</p>
    <div class="stkgrid">${STICKERS.map(k => `<button data-stk="${k}"><img alt="" src="media/emo/${k}.webp"></button>`).join('')}</div>
    <button class="btn green" id="stkAll">${T('שמירת כל ה-12')}</button>
    <div class="stkhow"><b>${T('איך מוסיפים לוואטסאפ?')}</b>
      ${ios ? `<ol><li>${T('לוחצים "שמירת כל ה-12" ובוחרים "שמירת תמונות".')}</li><li>${T('בוואטסאפ פותחים צ׳אט, נוגעים בסמל המדבקות ואז ב-+ (יצירת מדבקה).')}</li><li>${T('בוחרים גחלילית מהתמונות, והיא נשמרת אצלכם כמדבקה.')}</li></ol>`
            : `<ol><li>${T('לוחצים "שמירת כל ה-12" ושומרים את הקבצים בטלפון.')}</li><li>${T('פותחים אפליקציית מדבקות (למשל Sticker.ly) ויוצרים חבילה חדשה מהתמונות.')}</li><li>${T('לוחצים "הוספה לוואטסאפ", והחבילה מופיעה אצלכם במדבקות.')}</li></ol>`}
    </div>
    <button class="btn ghosty" id="stkClose" style="margin-top:12px">${T('סגירה')}</button>`, m => {
      for (const b of m.querySelectorAll('[data-stk]')) b.onclick = () => { Sound.play('tap'); shareStickers([b.dataset.stk]); };
      m.querySelector('#stkAll').onclick = () => { Sound.play('tap'); shareStickers(STICKERS); };
      m.querySelector('#stkClose').onclick = closeModal;
    });
}

/* ================= my profile ================= */
const AVATARS = SHOP.char.items.map(x => x.id), OLD_POSES = ['welcome', 'hero', 'power', 'cheer', 'thumbs', 'think', 'point', 'shrug', 'sleep'];
function avatarSrc(k) { if (CHAR_IDS.has(k)) return `media/chars/${k}.webp`; return k === 'cheer' || k === 'think' || k === 'shrug' ? WIN_BUG[k] : POSE[k] || BUG_SRC; }
function openProfile(after) {
  let pick = lookOf('char');
  const r = rankOf(P.earned), def = P.name || T`גחלילית ${Math.floor(100 + Math.random() * 900)}`;
  modal(`<img class="bug me" id="profMe" alt="" src="${avatarSrc(pick)}">
    <h3>${T('הפרופיל שלי')}</h3>
    <div class="profstats"><span>${esc(r.name)}</span><span>★ ${totalStars()}</span>${P.duel ? `<span>${T`דו-קרב: ${P.duel.w} ניצחונות`}</span>` : ''}</div>
    <input id="nameInput" maxlength="16" aria-label="${T`שם`}">
    <p style="margin:14px 0 0">${T('בחרו דמות')}</p>
    <div class="avgrid">${SHOP.char.items.map(c => `<button data-a="${c.id}" class="${owns('char', c.id) ? '' : 'lock'}" aria-pressed="${c.id === pick}" aria-label="${T(c.name)}"><img alt="" src="${avatarSrc(c.id)}"></button>`).join('')}</div>
    <button class="btn orange" id="nameSave">${T`שמירה`}</button>`, m => {
      const inp = m.querySelector('#nameInput'); inp.value = P.name || ''; inp.placeholder = def;
      for (const b of m.querySelectorAll('.avgrid button')) b.onclick = () => {
        if (b.classList.contains('lock')) { Sound.play('tap'); return toast(T('הדמות הזאת מחכה לכם בחנות')); }
        pick = b.dataset.a; Sound.play('tap');
        for (const o of m.querySelectorAll('.avgrid button')) o.setAttribute('aria-pressed', o === b);
        m.querySelector('#profMe').src = avatarSrc(pick);
      };
      const done = () => {
        const v = (inp.value.trim() || def).replace(/[<>]/g, '').trim().slice(0, 16);
        if (!v) { inp.focus(); return; }
        P.name = v; P.avatar = pick; closeModal(); save(); renderHome(); pulse(); publishScore(); if (after) after();
      };
      m.querySelector('#nameSave').onclick = done;
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') done(); });
    });
}

/* ================= home ================= */
function renderHome() {
  const r = rankOf(P.earned);
  hudSync(); homeScene();
  $('gardenText').textContent = gCount() ? T`${gCount()} מתוך ${gTotal} פריטים בגן` : T('בנו לה בית וקשטו את הגן');
  if (r.next) {
    $('rankFill').style.width = Math.max(3, (P.earned - r.at) / (r.next.at - r.at) * 100) + '%';
    $('rankNow').textContent = T`${r.name}, ${fmt(P.earned)} נקודות שנצברו`;
    $('rankNext').textContent = T`עוד ${fmt(r.next.at - P.earned)} ל${r.next.name}`;
  } else { $('rankFill').style.width = '100%'; $('rankNow').textContent = r.name; $('rankNext').textContent = T('הדרגה הגבוהה ביותר'); }

  const d = P.daily[todayStr()];
  $('dailyText').textContent = d ? T`השיא שלכם היום: ${fmt(d.score)} נקודות` : T('שלב חדש היום, אותו שלב לכולם');
    $('achLabel').textContent = `${P.ach.length}/${ACH.length}`;
  $('dailyDot').hidden = !!d; $('weeklyDot').hidden = !!(P.weekly && P.weekly[weekStr()]); $('bonusDot').hidden = P.streak.last === todayStr();
  $('adBanner').hidden = !!P.adFree || !ADS_LIVE;

  const box = $('chapters'); box.innerHTML = ''; let idx = 0;
  CHAPTERS.forEach((ch, ci) => {
    const col = CH_COLORS[ci % 4];
    const [a, b] = chapterRange(ci);
    let got = 0; for (let i = a; i < b; i++) got += recOf(i) ? recOf(i).stars : 0;
    const open = unlocked(a);
    const div = document.createElement('div'); div.className = 'chapter' + (open ? '' : ' locked'); div.dataset.ci = ci;
    div.innerHTML = `<div class="banner" style="background:${col.solid}"><h2>${T`פרק ${ci + 1}: ${ch.name}`}</h2><p>${ch.desc}</p><span class="chstars">★ ${got}/${(b - a) * 3}</span></div>${open ? '' : `<div class="lockmsg">${ICON_LOCK}<span>${T`ייפתח אחרי פרק ${ci}`}</span></div>`}`;
    const grid = document.createElement('div'); grid.className = 'levels';
    grid.style.setProperty('--tint', col.tint); grid.style.setProperty('--solid', col.solid);
    ch.levels.forEach(() => {
      const i = idx++, rec = recOf(i);
      const btn = document.createElement('button');
      btn.innerHTML = `${i + 1}${rec ? `<span class="st">${'★'.repeat(rec.stars)}</span>` : ''}`;
      if (rec) btn.className = 'done';
      btn.setAttribute('aria-label', T`שלב ${i + 1}${rec ? T`, ${rec.stars} כוכבים` : ''}`);
      btn.disabled = !unlocked(i);
      btn.onclick = () => openLevel(i);
      grid.appendChild(btn);
    });
    div.appendChild(grid); box.appendChild(div);
  });
  // dots + jump to the chapter you're playing now
  const dots = $('chDots'); dots.innerHTML = '';
  const cards = [...box.children];
  cards.forEach((card, ci) => {
    const d = document.createElement('button');
    d.setAttribute('role', 'tab'); d.setAttribute('aria-label', T`פרק ${ci + 1}: ${CHAPTERS[ci].name}`);
    d.onclick = () => centerCard(card, true);
    dots.appendChild(d);
  });
  if (chObserver) chObserver.disconnect();
  chObserver = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) {
      const ci = +e.target.dataset.ci;
      [...dots.children].forEach((d, j) => { d.classList.toggle('on', j === ci); d.setAttribute('aria-selected', j === ci); });
      $('chCount').textContent = T`פרק ${ci + 1} מתוך ${CHAPTERS.length}`;
    }
  }, { root: box, threshold: .6 });
  cards.forEach(c => chObserver.observe(c));
  const nextLv = ALL.findIndex((_, i) => !isSolved(i));
  const curCh = nextLv === -1 ? 0 : ALL[nextLv].ch;
  requestAnimationFrame(() => centerCard(cards[curCh], false));
  const solvedN = ALL.filter(l => P.levels[l.id]).length;
  $('progress').textContent = T`${solvedN} מתוך ${ALL.length} שלבים, ${totalStars()} מתוך ${ALL.length * 3} כוכבים`;
  const next = ALL.findIndex((_, i) => !isSolved(i));
  $('playTag').textContent = solvedN === 0 ? T('מתחילים') : next === -1 ? T('סיימתם הכול!') : T('ממשיכים');
  $('playMain').textContent = next === -1 ? T('שפרו כוכבים') : T`שלב ${next + 1}`;
  const nl = ALL[next], secs = nl ? timeLimit(nl) : 0;
  $('playSub').textContent = nl ? `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')} · ` + (nl.max === 1 ? T('מראה אחת') : T`${nl.max} מראות`) : '';
  const [ca, cb] = chapterRange(curCh); let cs = 0; for (let i = ca; i < cb; i++) if (isSolved(i)) cs++;
  $('chapName').textContent = T`פרק ${curCh + 1}: ${CHAPTERS[curCh].name}`;
  $('chapCount').textContent = `${cs}/${cb - ca}`; $('chapFill').style.width = cs / (cb - ca) * 100 + '%';
}

/* the garden as the player built it, behind the home screen */
function homeScene() {
  const g = gState(), scene = $('hScene');
  scene.style.backgroundImage = `url(${G_DIR}bg.webp)`;
  const put = (img, x, y, w, flip, z, cls = '') => `<img class="gi${flip ? ' flip' : ''}${cls}" alt="" src="${img}.webp" style="left:${x}%;top:${y}%;width:${w}%;z-index:${z || Math.round(y)}">`;
  let html = '';
  if (g.house) { const h = GARDEN.house.levels[g.house - 1]; html += put(G_DIR + h.img, GARDEN.house.at[0], GARDEN.house.at[1], h.w, 0, 0, ' door'); }
  for (const it of GARDEN.items) for (let i = 0; i < (g.items[it.id] || 0) && i < it.slots.length; i++) { const [x, y, w, f] = it.slots[i]; html += put(G_DIR + it.id, x, y, w, f, it.flat ? 1 : 0); }
  html += `<img class="gbug" alt="" src="${BUG_SRC}">`;
  if (scene.dataset.sig === html) return;
  scene.dataset.sig = html; scene.innerHTML = html;
  for (const im of scene.querySelectorAll('img.gi')) im.onclick = () => {
    if (im.classList.contains('door')) { gView = 'in'; Sound.play('whoosh'); show('garden'); return renderGarden(); }
    im.classList.remove('hop'); void im.offsetWidth; im.classList.add('hop'); Sound.play('tap');
  };
}
const CH_ICON = ['💡', '💣', '🌀', '🌘', '📌', '🔀', '♊', '👑'];
function openChapters() {
  const nextLv = ALL.findIndex((_, i) => !isSolved(i)), cur = nextLv === -1 ? -1 : ALL[nextLv].ch;
  $('allchSub').textContent = T`${totalStars()} מתוך ${ALL.length * 3} כוכבים`;
  $('chGrid').innerHTML = CHAPTERS.map((ch, ci) => {
    const [a, b] = chapterRange(ci), max = (b - a) * 3; let got = 0, solved = 0; for (let i = a; i < b; i++) { got += recOf(i) ? recOf(i).stars : 0; if (isSolved(i)) solved++; }
    const open = unlocked(a), done = solved === b - a, now = ci === cur;
    return `<button class="chc ${!open ? 'lock' : now ? 'cur' : 'done'}" data-ci="${ci}"><span class="em">${open ? CH_ICON[ci % CH_ICON.length] : '🔒'}</span>
      <span><span class="n">${T`פרק ${ci + 1}`}</span><b class="h">${esc(T(ch.name))}</b></span>
      ${now ? `<span class="tag">${T`ממשיכים כאן · שלב ${nextLv + 1}`}</span>` : ''}
      <span><span class="st"><img alt="" src="media/ui/star.webp">${got}/${max}${done ? ` · ${T('הושלם')} ✓` : ''}</span><span class="pb"><i style="width:calc(${got / max * 100}% - 4px)"></i></span></span></button>`;
  }).join('');
  for (const c of $('chGrid').children) c.onclick = () => {
    const ci = +c.dataset.ci;
    if (!unlocked(chapterRange(ci)[0])) { Sound.play('tap'); return toast(T`ייפתח אחרי פרק ${ci}`); }
    openMap(ci);
  };
  show('allch');
}
let chObserver = null;
function centerCard(card, smooth) {
  if (!card) return;
  const y = window.scrollY;
  card.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', inline: 'center', block: 'nearest' });
  window.scrollTo(0, y);
}

/* ================= game ================= */
let G = null, timerInt = null, DAILY_CACHE = null, WEEK_CACHE = null;
const timedMode = () => !!G && (G.mode === 'daily' || G.mode === 'weekly');   // score by time and moves, no stars, no help
function session(mode, lv, extra) {
  return { mode, lv: { ...lv, rows: [...lv.rows] }, mirrors: {}, locked: new Set(), extra: 0, hammers: 0, hints: 0, hammerMode: false, helped: false, moves: 0, done: false, ...extra };
}
/* Every level is played against the clock, so a level always ends: solved, or out of time and started again.
   The allowance grows with the level: half a minute per mirror, and never under a minute. The clock stops while a
   window is open or the game is in the background, and the guided lesson has none. */
const timeLimit = lv => Math.max(60, lv.max * 30) + (lv.rows.length >= 9 ? 30 : 0);
const clockOn = () => !!G && G.mode === 'level' && !G.coach && !G.done;
function clockStart() {
  $('timeBar').hidden = !clockOn();
  if (!clockOn()) return;
  G.limit = timeLimit(G.lv); G.left = G.limit * 1000; G.tick = Date.now();
  clearInterval(timerInt); timerInt = setInterval(clockTick, 250); clockDraw();
}
function clockTick() {
  if (!clockOn() || $('game').hidden) return;
  const now = Date.now(), dt = now - G.tick; G.tick = now;
  if (document.hidden || !$('overlay').hidden || dt > 2000) return;         // paused: a window is open, or the phone was put down
  const before = Math.ceil(G.left / 1000);
  G.left -= dt;
  const after = Math.ceil(G.left / 1000);
  if (after !== before && after <= 10 && after > 0) Sound.play('tap');
  if (G.left <= 0) { G.left = 0; clockDraw(); return timeOut(); }
  clockDraw();
}
function clockDraw() {
  const bar = $('timeBar'), s = Math.max(0, Math.ceil(G.left / 1000)), share = G.left / (G.limit * 1000);
  bar.style.setProperty('--p', Math.max(0, Math.min(1, share)));
  bar.querySelector('span').textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  bar.className = 'gclock' + (s <= 30 ? ' low' : share <= .4 ? ' mid' : '');
}
function timeOut() {
  const g = G, more = price('mirror');
  G.done = true; Sound.play('error'); Haptic.play('win');
  $('status').className = 'status bad'; $('status').textContent = T('נגמר הזמן!');
  track('done', { p_stars: 0, p_moves: G.moves, p_time: G.limit, p_helped: !!G.helped });
  modal(`<img class="bug" alt="" src="${WIN_BUG.shrug}">
    <h3>${T('נגמר הזמן!')}</h3>
    <p>${T('לא נורא. מתחילים את השלב מחדש, או ממשיכים מאותה נקודה עם עוד דקה.')}</p>
    <button class="btn orange" id="toAgain">${T('נסו שוב')}</button>
    <button class="btn blue" id="toMore" style="margin-top:12px"${P.balance < more ? ' disabled' : ''}>${T`עוד דקה · ${fmt(more)} נקודות`}</button>
    <button class="btn ghosty" id="toHome" style="margin-top:12px">${T('חזרה לבית')}</button>`, m => {
      m.querySelector('#toAgain').onclick = () => { closeModal(); openLevel(g.idx); };
      m.querySelector('#toHome').onclick = () => { closeModal(); G = null; goHome(); };
      m.querySelector('#toMore').onclick = () => {
        if (P.balance < more) return;
        closeModal(); P.balance -= more; save(false); logPurchase('power:time', more, false);
        g.done = false; g.helped = true; g.left = 60000; g.limit = Math.max(g.limit, 60); g.tick = Date.now();     // bought time is help, like a bought mirror
        Sound.play('purchase'); renderGame(T('קיבלתם עוד דקה. עזרה מגבילה את השלב לכוכב אחד.'));
      };
    }, true);
}
/* the blast itself, drawn over the page at the bomb's cell: flash, fireball, two shock rings, flying bits, smoke, and the board shakes */
function explodeAt(k) {
  const svg = $('board'), [cx, cy] = (k || '0,0').split(',').map(Number);
  let x = innerWidth / 2, y = innerHeight / 2, cell = 50;
  try { const m = svg.getScreenCTM(), p = svg.createSVGPoint(); p.x = cx + .5; p.y = cy + .5; const q = p.matrixTransform(m); x = q.x; y = q.y; cell = Math.abs(m.a) || 50; } catch (e) { /* centre of the screen will do */ }
  const box = document.createElement('div'); box.className = 'boom'; box.style.setProperty('--c', cell * 1.3 + 'px');
  let html = `<div class="flash"></div><div class="fire" style="left:${x}px;top:${y}px"></div><div class="ring" style="left:${x}px;top:${y}px"></div><div class="ring r2" style="left:${x}px;top:${y}px"></div>`;
  const COL = ['#FFE66B', '#FF9A1F', '#E8380D', '#2D1B4E', '#fff', '#6B5A8C'];
  for (let i = 0; i < 34; i++) {
    const a = Math.random() * Math.PI * 2, d = cell * (1.5 + Math.random() * 4.5), size = 4 + Math.random() * 9;
    html += `<i style="left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${COL[i % COL.length]};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d + cell * 1.2}px;--t:${(.6 + Math.random() * .7).toFixed(2)}s"></i>`;
  }
  for (let i = 0; i < 7; i++) html += `<div class="smoke" style="left:${x + (Math.random() - .5) * cell * 1.6}px;top:${y + (Math.random() - .5) * cell}px;width:${cell * 1.6}px;height:${cell * 1.6}px;--sx:${((Math.random() - .5) * 60).toFixed(0)}px;animation-delay:${(.1 + Math.random() * .3).toFixed(2)}s"></div>`;
  box.innerHTML = html; document.body.appendChild(box); setTimeout(() => box.remove(), 2200);
  // what is left of the bomb: a scorch mark where it sat
  const NS = 'http://www.w3.org/2000/svg', burn = document.createElementNS(NS, 'g');
  burn.innerHTML = `<circle cx="${cx + .5}" cy="${cy + .5}" r=".5" fill="#1B1030" opacity=".9"/><circle cx="${cx + .5}" cy="${cy + .5}" r=".7" fill="#1B1030" opacity=".35"/><circle cx="${cx + .42}" cy="${cy + .44}" r=".16" fill="#FF9A1F" opacity=".7"/>`;
  svg.appendChild(burn);
  const wrap = svg.closest('.boardwrap'); if (wrap) { wrap.classList.remove('quake'); void wrap.offsetWidth; wrap.classList.add('quake'); }
}
function bombOut() {
  Sound.play('explode'); Haptic.play('bomb'); explodeAt(G.lastSt && G.lastSt.bombKey);
  if (G.mode === 'duel') {          // in a race a bomb that blows up hands the round to the other side
    G.done = true; G.boom = true;
    $('status').className = 'status bad'; $('status').textContent = T('בום! הפצצה התפוצצה, והסיבוב עובר ליריב.');
    duelSync();
    return;
  }
  const g = G; G.done = true; track('done', { p_stars: 0, p_moves: G.moves, p_helped: !!G.helped });
  $('status').className = 'status bad'; $('status').textContent = T('בום! הפצצה התפוצצה.');
  setTimeout(() => {
    if (G !== g || $('game').hidden) return;
    modal(`<img class="bug" alt="" src="${WIN_BUG.shrug}">
      <h3>${T('בום! הפצצה התפוצצה.')}</h3>
      <p>${T('הקרן נגעה בפצצה שלוש פעמים. מתחילים את השלב מחדש.')}</p>
      <button class="btn orange" id="boomAgain">${T('נסו שוב')}</button>
      <button class="btn ghosty" id="boomHome" style="margin-top:12px">${T('חזרה לבית')}</button>`, m => {
        m.querySelector('#boomAgain').onclick = () => { closeModal(); if (g.mode === 'daily') openDaily(); else if (g.mode === 'weekly') openWeekly(); else openLevel(g.idx); };
        m.querySelector('#boomHome').onclick = () => { closeModal(); G = null; goHome(); };
      }, true);
  }, 1500);
}
function openLevel(i) { G = session('level', ALL[i], { idx: i, coach: P.tut === 1 && i < 3 && !P.levels[ALL[i].id] }); startGame(); }      // the lesson covers the first three levels
function openDaily() {
  const t = todayStr();
  if (!DAILY_CACHE || DAILY_CACHE.date !== t) DAILY_CACHE = { date: t, lv: dailyLevel(t) };
  G = session('daily', { ...DAILY_CACHE.lv, tip: '' }, { start: Date.now() });
  startGame();
}
function openWeekly() {
  const w = weekStr();
  if (!WEEK_CACHE || WEEK_CACHE.week !== w) {
    let kept = null; try { kept = JSON.parse(localStorage.getItem('beam:week') || 'null'); } catch (e) { /* storage blocked */ }
    if (kept && kept.week === w && kept.lv) { WEEK_CACHE = kept; return openWeekly(); }   // built once per week on this device
    toast(T('בונים את הלוח של השבוע…'));
    return setTimeout(() => {
      WEEK_CACHE = { week: w, lv: weeklyLevel(w) };
      try { localStorage.setItem('beam:week', JSON.stringify(WEEK_CACHE)); } catch (e) { /* storage blocked */ }
      openWeekly();
    }, 60);   // let the toast paint before the solver runs
  }
  G = session('weekly', { ...WEEK_CACHE.lv, tip: '' }, { start: Date.now() });
  startGame();
}
function startGame() {
  clearInterval(timerInt);
  Sound.play('whoosh');
  if (timedMode()) timerInt = setInterval(() => { if (!G.done) renderPills(); }, 1000);
  G.t0 = Date.now(); track('start');
  renderGame(); show('game');
  clockStart(); if (CHEERS_ON) cheerPreload();
  pieceIntro();
  requestAnimationFrame(placeSay);
}
/* the firefly's speech bubble sits halfway between what you can see of the board and the buttons below.
   The board's box is taller than its painted frame, so the gap is measured from the frame itself. */
function placeSay() {
  const say = document.querySelector('#game .say'), sv = $('board'), dock = document.querySelector('#game .gdock');
  if (!say || $('game').hidden || !sv.getBBox) return;
  say.style.marginTop = '0px'; say.style.marginBottom = 'auto';
  let bb, m; try { bb = sv.getBBox(); m = sv.getScreenCTM(); } catch (e) { return; }
  if (!m || !bb.height) return;
  const seen = m.f + (bb.y + bb.height) * m.d, r = say.getBoundingClientRect(), top = dock.getBoundingClientRect().top;
  const want = seen + (top - seen - r.height) / 2;
  say.style.marginTop = Math.round(Math.max(seen + 4, want) - r.top) + 'px';
}
addEventListener('resize', () => { if (G && !$('game').hidden) placeSay(); });
/* the first time a kind of piece shows up on a board, a short card explains it (the clock waits while a window is open) */
const PIECES = [
  { id: 'wall', ic: 'icWall', has: lv => lv.rows.some(r => r.includes('#')) },
  { id: 'hammer', ic: 'icHammer', has: lv => !!(lv.hammer && lv.hammer.length) },
  { id: 'bomb', ic: 'icBomb', has: lv => lv.rows.some(r => r.includes('X')) },
  { id: 'fixed', ic: 'icFixed', has: lv => lv.rows.some(r => /[fg]/.test(r)) },
  { id: 'split', ic: 'icSplit', has: lv => lv.rows.some(r => /[pq]/.test(r)) },
  { id: 'twin', ic: 'icTwin', has: lv => lasersOf(lv).length > 1 },
];
function pieceIntro() {
  if (!G || G.mode === 'duel' || G.coach) return;
  P.seenPieces = P.seenPieces || {};
  // a player who already solved a level with this piece has met it, even before this card existed
  const met = pc => P.seenPieces[pc.id] || ALL.some(lv => P.levels[lv.id] && pc.has(lv));
  const pc = PIECES.find(pc => pc.has(G.lv) && !met(pc));
  for (const x of PIECES) if (met(x)) P.seenPieces[x.id] = 1;
  if (!pc) return;
  P.seenPieces[pc.id] = 1; save(false);
  if (!$(pc.ic).childNodes.length) renderIcons();
  const rule = $(pc.ic).closest('.rule');
  setTimeout(() => {
    if (!G || $('game').hidden || !$('overlay').hidden) return;
    Sound.play('sparkle', 5);
    modal(`<div class="newpiece"><span class="tag">${T('חדש בלוח!')}</span>${rule.innerHTML}</div>
      <button class="btn green" id="pieceOk">${T('הבנתי, בואו נשחק')}</button>`, m => { m.querySelector('#pieceOk').onclick = () => { Sound.play('tap'); closeModal(); }; });
  }, 450);
}
const elapsed = () => Math.floor((Date.now() - G.start) / 1000);
const maxMirrors = () => G.lv.max + G.extra;

function renderPills(st) {
  st = st || G.lastSt;
  const used = Object.keys(G.mirrors).length;
  $('starPill').innerHTML = `${ICON_STAR}<span>${st.lit}/${st.total}</span>`;
  $('starPill').setAttribute('aria-label', T`${st.lit} מתוך ${st.total} כוכבים דולקים`);
  $('mirrorPill').innerHTML = `${PIC_MIRROR}<span>${maxMirrors() - used}</span>`;
  $('mirrorPill').setAttribute('aria-label', T`נותרו ${maxMirrors() - used} מראות`);
  const mp = $('movesPill');
  if (G.mode === 'duel') {
    const s = duelTimeLeft();
    mp.innerHTML = `${ICON_CLOCK}<span class="timer">${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}</span>`;
    mp.classList.toggle('over', s <= 20); mp.setAttribute('aria-label', T('זמן'));
  } else if (timedMode() && !G.done) {
    const s = elapsed();
    mp.innerHTML = `${ICON_CLOCK}<span class="timer">${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}</span>`;
    mp.classList.remove('over'); mp.setAttribute('aria-label', T('זמן'));
  } else {
    mp.innerHTML = `${ICON_MOVES}<span>${G.moves}/${par(G.lv)}</span>`;
    mp.classList.toggle('over', G.moves > par(G.lv));
    mp.setAttribute('aria-label', T`${G.moves} מהלכים, יעד ${par(G.lv)}`);
  }
}

/* cheering: a painted phrase pops over the board when a move lights a new star (the last star belongs to the win screen) */
const CHEERS = LANG === 'en'   // width / height of each picture; the English set says the same things
  ? { meula: 5.37, yafe: 1.44, kavod: 1.69, mushlam: 4.47, gaon: 4.02, mutzlach: 1.7, od: 2.59 }
  : { meula: 3.13, yafe: 1.59, kavod: 1.68, mushlam: 3.27, gaon: 2.11, mutzlach: 1.6, od: 2.2 };
const cheerSrc = k => `media/cheer/${LANG === 'en' ? 'en-' : ''}${k}.webp`;
let cheerLast = '', cheerAt = 0;
const CHEERS_ON = false;   // phrases are switched off for now; set to true to bring them back
function cheer(st, gained) {
  if (!CHEERS_ON) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (const old of document.querySelectorAll('.cheerbox')) old.remove();   // a quick second right move replaces the phrase
  let pool = st.total - st.lit === 1 ? ['od'] : gained > 1 ? ['gaon', 'mutzlach', 'mushlam'] : st.lit === 1 ? ['meula', 'yafe', 'kavod', 'mutzlach'] : ['kavod', 'gaon', 'mushlam', 'meula', 'yafe', 'mutzlach'];
  if (pool.length > 1) pool = pool.filter(k => k !== cheerLast);
  const k = pool[Math.floor(Math.random() * pool.length)]; cheerLast = k; cheerAt = Date.now();
  const r = $('board').getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const w = Math.min(r.width * (CHEERS[k] > 3.5 ? .72 : .82), 230 * Math.sqrt(CHEERS[k] / 2.11));   // leaves room for the pop-up overshoot
  const box = document.createElement('div'); box.className = 'cheerbox'; document.body.appendChild(box);
  const im = document.createElement('img'); im.alt = ''; im.src = cheerSrc(k); im.className = 'cheerw'; im.style.width = w + 'px'; im.style.left = cx + 'px'; im.style.top = cy + 'px'; box.appendChild(im);
  im.animate([
    { transform: 'translate(-50%,-50%) scale(0) rotate(-12deg)', opacity: 0 },
    { transform: 'translate(-50%,-50%) scale(1.25) rotate(4deg)', opacity: 1, offset: .14 },
    { transform: 'translate(-50%,-50%) scale(.94) rotate(-2deg)', opacity: 1, offset: .24 },
    { transform: 'translate(-50%,-50%) scale(1.04) rotate(0)', opacity: 1, offset: .32 },
    { transform: 'translate(-50%,-50%) scale(1) rotate(0)', opacity: 1, offset: .72 },
    { transform: 'translate(-50%,-90%) scale(1.08)', opacity: 0 }], { duration: 1700, delay: 120, fill: 'both' });
  for (let n = 0; n < 20; n++) {
    const sp = document.createElement('img'); sp.alt = ''; sp.src = fxSrc('dust', [1, 3, 5][n % 3]); sp.className = 'cheersp'; sp.style.width = 10 + Math.random() * 22 + 'px'; box.appendChild(sp);
    const a = Math.random() * Math.PI * 2, d = w * .45 + Math.random() * 80;
    sp.animate([{ transform: `translate(${cx}px,${cy}px) translate(-50%,-50%) scale(0)`, opacity: 1 },
      { transform: `translate(${cx + Math.cos(a) * d}px,${cy + Math.sin(a) * d * .6}px) translate(-50%,-50%) scale(1.2) rotate(180deg)`, opacity: 1, offset: .6 },
      { transform: `translate(${cx + Math.cos(a) * d * 1.1}px,${cy + Math.sin(a) * d * .6 + 40}px) translate(-50%,-50%) scale(0) rotate(260deg)`, opacity: 0 }], { duration: 1100, delay: 190, fill: 'both', easing: 'ease-out' });
  }
  setTimeout(() => Sound.play('sparkle', 3), 160);
  setTimeout(() => box.remove(), 2100);
}
/* A move counts as right only when it is a real step toward the answer:
   the tile just tapped now holds the mirror the solution has there, every mirror on the board matches the solution,
   and every lit star is reached by light that has stayed on the finished solution's route all the way (no lucky detours). */
function beamCells(paths, each) {
  const cells = new Set();
  for (const p of paths) {
    let off = false;
    for (let i = 1; i < p.length && !off; i++) {
      const [ax, ay] = p[i - 1], [bx, by] = p[i];
      for (let t = .02; t < .99; t += .04) {
        const c = Math.floor(ax + (bx - ax) * t) + ',' + Math.floor(ay + (by - ay) * t);
        if (each && each(c) === false) { off = true; break; }
        cells.add(c);
      }
    }
  }
  return cells;
}
// how many stars are lit the honest way right now, or -1 when the board is off the solution
function onTrack() {
  const lv = G.lv; if (!lv.sol || !G.lastTap) return -1;
  const want = new Map(lv.sol);
  if (G.mirrors[G.lastTap] === undefined || want.get(G.lastTap) !== G.mirrors[G.lastTap]) return -1;
  if (!Object.entries(G.mirrors).every(([k, m]) => want.get(k) === m)) return -1;
  if (!lv._solCells) lv._solCells = beamCells(traceAll(lv, Object.fromEntries(lv.sol)).paths);
  const now = traceAll(lv, G.mirrors), honest = new Set();
  beamCells(now.paths, c => { if (!lv._solCells.has(c)) return false; const [x, y] = c.split(',').map(Number); if (lv.rows[y] && lv.rows[y][x] === 'T') honest.add(c); });
  return [...now.lit].every(k => honest.has(k)) ? now.lit.size : -1;
}
function cheerPreload() { for (const k in CHEERS) new Image().src = cheerSrc(k); for (const i of [1, 3, 5]) new Image().src = fxSrc('dust', i); }

const BOMB_HITS = 3;   // how many times the beam may rest on a bomb in one level before it blows up
function renderGame(flash) {
  const lv = G.lv;
  const st = draw($('board'), lv, G.mirrors, G.done ? null : tap, false, G.locked, G.hammerMode ? breakable() : null);
  // sound reacts to what the beam did: new stars chime up the scale, a fresh bomb hit explodes
  if (G.prevSt) {
    if (st.bomb && !G.prevSt.bomb) Sound.play('bomb');
    else if (!st.bomb && G.prevSt.bomb) Sound.play('defuse');
    if (st.lit > G.prevSt.lit) for (let n = G.prevSt.lit; n < st.lit; n++) setTimeout(() => Sound.play('star', n), (n - G.prevSt.lit) * 90);
    else if (st.lit < G.prevSt.lit && !st.bomb) Sound.play('unlit');
  }
  /* A bomb forgives two touches per level; the third blows up and the level starts over. A touch only counts when the
     beam is left on the bomb for a moment, so passing over one while turning a mirror is safe, and so is the opening
     position of a level that starts with the beam on a bomb. */
  const onBomb = st.bomb && !G.done && Object.keys(G.mirrors).some(k => !G.locked.has(k));
  if (!onBomb) { clearTimeout(G.bombT); G.bombT = null; G.bombHeld = false; }
  else if (!G.bombT && !G.bombHeld) {
    const g = G;
    G.bombT = setTimeout(() => {
      g.bombT = null;
      if (G !== g || g.done || $('game').hidden) return;
      g.bombHeld = true; g.bombs = (g.bombs || 0) + 1;
      if (g.bombs >= BOMB_HITS) bombOut(); else { Haptic.play('win'); renderGame(); }
    }, 1500);
  }
  if (G.lastTap) {                                         // cheer only a real step forward: more stars lit the honest way than before
    const hon = onTrack();   // a bomb the light only reaches past the end of the right route is not the player's mistake
    // after a reset, redoing the same stars does not cheer again until the player gets further than before (G.honFloor)
    if (hon > (G.hon || 0) && hon > (G.honFloor || 0) && st.lit < st.total) cheer(st, hon - (G.hon || 0));
    G.hon = Math.max(0, hon); G.honBest = Math.max(G.honBest || 0, G.hon);
  }
  G.prevSt = st;
  G.lastSt = st;
  liveSoon();
  $('duelBar').hidden = G.mode !== 'duel';
  if (G.mode === 'duel') { $('lvTitle').textContent = T`סיבוב ${G.round} · עד 3 ניצחונות`; $('lvChapter').textContent = T('הראשון שמדליק את כל הכוכבים מנצח'); renderDuelBar(); }
  else if (G.mode === 'weekly') { $('lvTitle').textContent = T('אתגר השבוע'); $('lvChapter').textContent = T`יעד מהלכים: ${par(lv)}`; }
  else if (G.mode === 'daily') { $('lvTitle').textContent = T('אתגר יומי'); $('lvChapter').textContent = T`יעד מהלכים: ${par(lv)}`; }
  else { $('lvTitle').textContent = T`שלב ${G.idx + 1}`; $('lvChapter').textContent = T`פרק ${lv.ch + 1}: ${CHAPTERS[lv.ch].name}`; }
  $('tip').textContent = lv.tip || '';
  placeTip();
  $('gamePoints').innerHTML = coinHTML(ICON_POINTS, P.balance);
  renderPills(st);
  $('movesPill').hidden = G.mode === 'level'; $('sayBug').src = BUG_SRC; $('powerNote').hidden = $('resetBtn').hidden = G.done; if (timedMode() || G.mode === 'duel') $('powerNote').hidden = true;   // no help to buy here, so no note about help

  const status = $('status'); status.className = 'status';
  if (flash) { status.className = 'status bad'; status.textContent = flash; }
  else if (G.hammerMode) { status.className = 'status bad'; status.textContent = T('הקישו על חסימה מהבהבת כדי לשבור אותה'); }
  else if (st.bomb) { status.className = 'status bad'; status.textContent = !onBomb ? T('הקרן פוגעת בפצצה. הסיטו אותה עם מראה.') : G.bombHeld ? (G.bombs < BOMB_HITS - 1 ? T('זהירות! עוד שתי פגיעות בפצצה והיא מתפוצצת.') : G.bombs === BOMB_HITS - 1 ? T('זהירות! עוד פגיעה בפצצה והיא מתפוצצת.') : T('בום! הקרן פגעה בפצצה.')) : T('הקרן על פצצה! הזיזו את המראה מהר.'); }
  else status.textContent = G.moves === 0 ? T('הקישו על משבצת כדי להציב מראה') : '';
  const step = G.coach && !G.done && !G.hammerMode ? coachStep() : null;
  if (step) {
    const [cx, cy] = step.k.split(',').map(Number), NS = 'http://www.w3.org/2000/svg';
    const ring = document.createElementNS(NS, 'rect'); ring.setAttribute('class', 'coachring');          // an outline around the very cell to tap
    for (const [n, v] of [['x', cx + .05], ['y', cy + .05], ['width', .9], ['height', .9], ['rx', .17]]) ring.setAttribute(n, v);
    const hand = document.createElementNS(NS, 'text'); hand.setAttribute('class', 'coachhand'); hand.setAttribute('x', cx + .5); hand.setAttribute('y', cy + 1.25); hand.textContent = '👆';
    $('board').appendChild(ring); $('board').appendChild(hand);
    status.className = 'status coach'; status.textContent = step.text;
  }

  $('powerBox').hidden = timedMode() || G.mode === 'duel' || G.done || !!G.coach;
  $('pwMirror').innerHTML = `${PIC_MIRROR}<span>${T`מראה`}</span><span class="price">${fmt(price('mirror'))}</span>`;
  $('pwHammer').innerHTML = `${PIC_HAMMER}<span>${G.hammerMode ? T('ביטול') : T('פטיש')}</span><span class="price">${fmt(price('hammer'))}</span>`;
  const hintsLeft = Math.max(0, hintLimit(lv) - G.hints);
  $('pwHint').innerHTML = `${PIC_HINT}<span>${T`רמז`} ×${hintsLeft}</span><span class="price">${fmt(price('hint'))}</span>`;
  $('pwMirror').disabled = P.balance < price('mirror') || G.extra >= LIMIT.mirror;
  // the hammer only exists where breaking a wall can actually save a mirror
  const hammerHere = !timedMode() && G.mode !== 'duel' && !!(lv.hammer && lv.hammer.length);
  $('pwHammer').hidden = !hammerHere;
  document.querySelector('.powers').classList.toggle('two', !hammerHere);
  $('pwHammer').disabled = !G.hammerMode && (P.balance < price('hammer') || !breakable().size || G.hammers >= LIMIT.hammer);
  $('pwHammer').setAttribute('aria-pressed', G.hammerMode);
  $('pwHint').disabled = P.balance < price('hint') || !nextHint() || hintsLeft === 0;
  if (!G.done) hideWin();

  if (st.allLit && !G.done) finish();
}

function tap(x, y) {
  const k = key(x, y);
  if (G.hammerMode) return breakWall(x, y);
  const m = G.mirrors[k];
  if (G.locked.has(k)) { Sound.play('error'); renderGame(T('את המראה הזו הציב הרמז, והיא נשארת במקום.')); return; }
  if (!m) {
    if (Object.keys(G.mirrors).length >= maxMirrors()) { Sound.play('error'); renderGame(T('נגמרו המראות. הסירו אחת או קנו מראה נוספת.')); return; }
    G.mirrors[k] = '/'; Sound.play('place');
  } else if (m === '/') { G.mirrors[k] = '\\'; Sound.play('rotate'); }
  else { delete G.mirrors[k]; Sound.play('remove'); }
  G.moves++; G.lastTap = k;
  renderGame(); G.lastTap = null;
}

function nextHint() {
  if (!G.lv.sol) return null;
  return G.lv.sol.find(([k, m]) => G.mirrors[k] !== m || !G.locked.has(k)) || null;
}
function spend(n, what) { if (P.balance < n) return false; P.balance -= n; G.helped = true; save(false); if (what) logPurchase('power:' + what, n, false); return true; }
function buyMirror() {
  if (G.extra >= LIMIT.mirror || !spend(price('mirror'), 'mirror')) return;
  G.extra++; Sound.play('purchase'); toast(T('קיבלתם מראה נוספת'), `-${fmt(price('mirror'))}`); renderGame();
}
function breakable() {
  return new Set((G.lv.hammer || []).filter(k => { const [x, y] = k.split(',').map(Number); return G.lv.rows[y][x] === '#'; }));
}
function toggleHammer() {
  if (!G.hammerMode && (P.balance < price('hammer') || G.hammers >= LIMIT.hammer)) return;
  G.hammerMode = !G.hammerMode; Sound.play(G.hammerMode ? 'hammerArm' : 'tap'); renderGame();
}
function breakWall(x, y) {
  if (!breakable().has(key(x, y)) || !spend(price('hammer'), 'hammer')) return;
  const r = G.lv.rows[y]; G.lv.rows[y] = r.slice(0, x) + '.' + r.slice(x + 1);
  G.hammers++; G.hammerMode = false; Sound.play('hammer');
  toast(T('החסימה נשברה'), `-${fmt(price('hammer'))}`); renderGame();
}
function buyHint() {
  const h = nextHint(); if (!h || G.hints >= hintLimit(G.lv) || !spend(price('hint'), 'hint')) return;
  G.hints++;
  const [k, m] = h;
  const solKeys = new Set(G.lv.sol.map(s => s[0]));
  if (!G.mirrors[k] && Object.keys(G.mirrors).length >= maxMirrors()) {
    const wrong = Object.keys(G.mirrors).find(q => !solKeys.has(q) && !G.locked.has(q)) || Object.keys(G.mirrors).find(q => !G.locked.has(q));
    if (wrong) delete G.mirrors[wrong];
  }
  G.mirrors[k] = m; G.locked.add(k); Sound.play('hint');
  toast(T('הרמז הציב מראה במקום הנכון'), `-${fmt(price('hint'))}`); renderGame();
}

const STAR3D = 'media/inline/star3d.webp';
/* the three stars on the win card, in the same glossy 3D style as the map; a star not earned stays as a dark shape */
const starsSVG = n => [1, 2, 3].map(i => `<img alt="" src="${STAR3D}"${i <= n ? '' : ' class="off"'}>`).join('');

/* the three moods she shows when a level is solved */
/* the firefly's poses, used wherever she speaks to the player (stills, until each gets its own clip) */
const POSE = {
  welcome: 'media/inline/bug-welcome.webp',
  point: 'media/inline/bug-point.webp',
  power: 'media/inline/bug-power.webp',
  sleep: 'media/inline/bug-sleep.webp',
  thumbs: 'media/inline/bug-thumbs.webp',
  hero: 'media/inline/bug-hero.webp',
};
const WIN_BUG = {
  cheer: 'media/inline/bug-cheer.webp',
  think: 'media/inline/bug-think.webp',
  shrug: 'media/inline/bug-shrug.webp',
};
/* moving versions of the moods: short clips with her cut out of the background. Each is an ordinary H.264
   video file next to the page, holding the picture in its top half and the transparency mask in its bottom half;
   the two are joined on a canvas while it plays. A mood without a clip, a browser that cannot play it, or the
   page opened straight from disk (where the browser will not let a canvas read a video) shows the still. */
const WIN_VIDEO = {
  cheer: 'media/cheer2.mp4',
};
const WIN_VIDEO_MS = { cheer: 3300 };   // how long she performs alone before the card pops up
const winVids = {}; let winPlay = 0;
function stopWinVideo() { winPlay++; for (const m in winVids) { try { winVids[m].pause(); } catch (e) { /* not started */ } } }
function winVideoEl(mood) {
  if (winVids[mood]) return winVids[mood];
  const v = winVids[mood] = document.createElement('video');
  v.muted = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('muted', ''); v.preload = 'auto';
  v.src = WIN_VIDEO[mood];
  return v;
}
/* fetch the clips quietly after start-up, so the first win does not wait for a download */
function preloadWinVideos() { if (/^https?:$/.test(location.protocol)) for (const m in WIN_VIDEO) { try { winVideoEl(m).load(); } catch (e) { /* the still covers it */ } } }
function playWinVideo(mood, canvas, onFail) {
  const my = ++winPlay, N = canvas.width;
  let v = winVids[mood], got = false, failed = false;
  const fail = () => { if (failed || my !== winPlay) return; failed = true; try { v && v.pause(); } catch (e) { /* fine */ } onFail(); };
  try {
    if (!v) {
      v = winVideoEl(mood);
    }
    // on the graphics card the mask is free; the pixel-by-pixel fallback below made the clip stutter whenever an effect ran next to it
    const gl = winGL(canvas);
    let wctx, ctx;
    if (!gl) {
      const work = playWinVideo.work || (playWinVideo.work = document.createElement('canvas'));
      work.width = N; work.height = 2 * N;
      wctx = work.getContext('2d', { willReadFrequently: true }); ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, N, N);
    } else gl.clear();
    const paint = () => {
      if (v.readyState < 2) return;
      if (gl) { try { gl.draw(v); got = true; } catch (e) { fail(); } return; }
      try {
        wctx.drawImage(v, 0, 0, N, 2 * N);
        const img = wctx.getImageData(0, 0, N, 2 * N), p = img.data, half = N * N * 4;
        for (let i = 0; i < half; i += 4) p[i + 3] = p[half + i];   // the mask below becomes the alpha above
        ctx.putImageData(img, 0, 0, 0, 0, N, N);
        got = true;
      } catch (e) { fail(); }
    };
    let last = 0;
    const tick = () => {
      if (my !== winPlay || failed) return;
      paint(); last = performance.now();
      if (v.ended) return;
      if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(tick); else requestAnimationFrame(tick);
    };
    // frame callbacks pause when the browser decides nothing is on screen; a plain timer keeps the canvas fed
    const guard = setInterval(() => {
      if (my !== winPlay || failed || v.ended) { clearInterval(guard); return; }
      if (performance.now() - last > 250) { paint(); last = performance.now(); }
    }, 60);
    v.onended = () => { if (my === winPlay) paint(); };
    v.onerror = fail;
    try { v.currentTime = 0; } catch (e) { /* not seekable yet: it starts from zero anyway */ }
    const pr = v.play();
    if (pr && pr.catch) pr.catch(fail);
    tick();
    setTimeout(() => { if (!got) fail(); }, 2500);   // a slow connection gets a little longer before the still takes over
  } catch (e) { fail(); }
}
/* WebGL for the win clip: the top half of each frame is the colour, the bottom half is the alpha mask */
function winGL(canvas) {
  if (canvas._gl !== undefined) return canvas._gl;
  canvas._gl = null;
  try {
    const g = canvas.getContext('webgl', { premultipliedAlpha: false, alpha: true, preserveDrawingBuffer: true });
    if (!g) return null;
    const sh = (type, src) => { const o = g.createShader(type); g.shaderSource(o, src); g.compileShader(o); if (!g.getShaderParameter(o, g.COMPILE_STATUS)) throw 0; return o; };
    const pr = g.createProgram();
    g.attachShader(pr, sh(g.VERTEX_SHADER, 'attribute vec2 p; varying vec2 u; void main(){ u = vec2((p.x + 1.0) * .5, (1.0 - p.y) * .5); gl_Position = vec4(p, 0., 1.); }'));
    g.attachShader(pr, sh(g.FRAGMENT_SHADER, 'precision mediump float; uniform sampler2D t; varying vec2 u; void main(){ vec3 c = texture2D(t, vec2(u.x, u.y * .5)).rgb; float a = texture2D(t, vec2(u.x, .5 + u.y * .5)).r; gl_FragColor = vec4(c, a); }'));
    g.linkProgram(pr); if (!g.getProgramParameter(pr, g.LINK_STATUS)) return null;
    g.useProgram(pr);
    const b = g.createBuffer(); g.bindBuffer(g.ARRAY_BUFFER, b); g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), g.STATIC_DRAW);
    const loc = g.getAttribLocation(pr, 'p'); g.enableVertexAttribArray(loc); g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
    const tex = g.createTexture(); g.bindTexture(g.TEXTURE_2D, tex);
    for (const [k, v] of [[g.TEXTURE_MIN_FILTER, g.LINEAR], [g.TEXTURE_MAG_FILTER, g.LINEAR], [g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE], [g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE]]) g.texParameteri(g.TEXTURE_2D, k, v);
    g.enable(g.BLEND); g.blendFunc(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA);
    canvas._gl = {
      clear() { g.viewport(0, 0, canvas.width, canvas.height); g.clearColor(0, 0, 0, 0); g.clear(g.COLOR_BUFFER_BIT); },
      draw(v) { g.viewport(0, 0, canvas.width, canvas.height); g.clearColor(0, 0, 0, 0); g.clear(g.COLOR_BUFFER_BIT); g.texImage2D(g.TEXTURE_2D, 0, g.RGB, g.RGB, g.UNSIGNED_BYTE, v); g.drawArrays(g.TRIANGLE_STRIP, 0, 4); },
    };
  } catch (e) { canvas._gl = null; }
  return canvas._gl;
}
let winTimers = [];
function hideWin() {
  winTimers.forEach(clearTimeout); winTimers = []; stopWinVideo(); Sound.hush();
  $('winLayer').hidden = true; $('winLayer').classList.remove('dim'); $('winbox').hidden = true;
}
/* first she jumps in over the board in the mood the result earned, then the card pops up under her */
function showWin(mood, delay, onCard, coins = 0) {
  hideWin();
  const g = G, layer = $('winLayer'), bug = $('winBug'), film = $('winFilm');
  const still = () => G === g && G.done && !$('game').hidden;
  // the coins come first, over the solved board; the firefly and then the card follow once they have landed in the counter
  if (coins) { const at = delay; winTimers.push(setTimeout(() => { if (still()) coinBurst(coins); }, at)); delay += COIN_MS; }
  winTimers.push(setTimeout(() => {
    if (!still()) return;
    const clip = !!WIN_VIDEO[mood];
    bug.src = WIN_BUG[mood]; bug.className = 'winbug ' + mood + ' jump'; bug.hidden = clip;
    film.className = 'winbug ' + mood + ' jump anim'; film.hidden = !clip;
    // if the clip cannot play here, the still picture takes over in the same spot and pose
    if (clip) playWinVideo(mood, film, () => { film.hidden = true; bug.hidden = false; bug.className = film.className.replace(' anim', ''); });
    layer.hidden = false; void layer.offsetWidth; layer.classList.add('dim');
    Sound.play('whoosh');
    if (clip && mood === 'cheer') Sound.play('spin');       // the whirl has its own soundtrack, starting with the very first frame
  }, delay));
  winTimers.push(setTimeout(() => {
    if (!still()) return;
    bug.className = 'winbug ' + mood + ' perch'; film.className = 'winbug ' + mood + ' perch anim';
    $('winbox').hidden = false;
    if (onCard) onCard();
    // the effect waits until the clip has finished: the two together overloaded the phone and froze the picture
    if (mood !== 'shrug') {
      let fired = false;
      const go = () => { if (fired) return; fired = true; winTimers.push(setTimeout(() => { if (still()) winFx(lookOf('fx')); }, 350)); };
      const v = WIN_VIDEO[mood] && winVids[mood];
      if (v && !v.ended && !v.paused && isFinite(v.duration)) {
        const left = Math.max(0, (v.duration - v.currentTime) * 1000) + 150;
        v.addEventListener('ended', go, { once: true });
        winTimers.push(setTimeout(go, Math.min(left, 3500)));
      } else go();
    }
    $('nextBtn').focus({ preventScroll: true });
  }, delay + (WIN_VIDEO[mood] ? WIN_VIDEO_MS[mood] : 1900)));
}
/* Winning points arrive as coins: they burst out of the middle of the screen, hang for a moment, then fly up into the counter, which counts up as they land. */
const COIN_N = 96, COIN_MS = 2550;   // how many coins, and how long from the first burst until the last ones are landing
/* o.chip: another counter to fill (the duel's prize), which then counts from 0 up to the prize with a plus sign */
function coinBurst(earned, o = {}) {
  const own = !o.chip, chip = o.chip || $('gamePoints'), g = G;
  const from = !own ? 0 : g.coinFrom != null ? g.coinFrom : P.balance - earned;   // achievements may have added to the sum meanwhile, so count from what the counter shows
  const goal = () => own ? P.balance : earned, text = n => (own ? '' : '+') + fmt(n);
  const alive = () => own ? G === g : chip.isConnected;
  const show = n => { const sp = chip.querySelector('span'); if (sp) { sp.textContent = text(n); if (!own) sp.dir = 'ltr'; } };
  const settle = () => { if (!alive()) return; if (own) chip.innerHTML = coinHTML(ICON_POINTS, P.balance); else show(earned); };
  if (!earned || (own && $('game').hidden)) return settle();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !chip.animate) return settle();
  const layer = document.createElement('div'); layer.className = 'coinfly'; document.body.appendChild(layer);
  document.body.classList.add('coining');
  const done = () => { layer.remove(); document.body.classList.remove('coining'); settle(); };
  const W = innerWidth, H = innerHeight, t = chip.getBoundingClientRect(), tx = t.left + t.width / 2, ty = t.top + t.height / 2;
  const br = own ? $('board').getBoundingClientRect() : { left: 0, top: H * .12, width: W, height: H * .6 }, ox = br.left + br.width / 2, oy = br.top + br.height / 2, N = COIN_N, size = 36;
  const add = (cls, css) => { const d = document.createElement('div'); d.className = cls; if (css) d.style.cssText = css; layer.appendChild(d); return d; };

  // the stage: a golden flash, two shock rings and a board that jumps
  add('cf-flash').animate([{ opacity: 0 }, { opacity: .95, offset: .12 }, { opacity: 0 }], { duration: 650, fill: 'both' });
  for (const d of [0, 220]) add('cf-ring', `left:${ox}px; top:${oy}px`).animate([{ transform: 'translate(-50%,-50%) scale(.1)', opacity: 1 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 0 }], { duration: 750, delay: d, easing: 'cubic-bezier(.1,.7,.3,1)', fill: 'both' });
  const wrap = own ? document.querySelector('#game .boardwrap') : chip.closest('.modal, .duelbox, section') || chip;
  wrap.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.07) rotate(-1.2deg)', offset: .18 }, { transform: 'scale(.97) rotate(.8deg)', offset: .4 }, { transform: 'scale(1.03)', offset: .62 }, { transform: 'scale(1)' }], { duration: 700, easing: 'ease-out' });

  // the prize itself, big, in the middle; it shrinks into the counter with the last coins
  const big = add('cf-sum'); big.textContent = '+' + fmt(earned);
  const bigAt = (x, y, k, r = 0) => `translate(-50%,-50%) translate(${x}px, ${y}px) scale(${k}) rotate(${r}deg)`;
  big.animate([
    { transform: bigAt(ox, oy, .1, -12), opacity: 0, offset: 0 },
    { transform: bigAt(ox, oy, 1.25, 4), opacity: 1, offset: .12 },
    { transform: bigAt(ox, oy, .95, -2), opacity: 1, offset: .2 },
    { transform: bigAt(ox, oy, 1.06, 0), opacity: 1, offset: .3 },
    { transform: bigAt(ox, oy - 8, 1, 0), opacity: 1, offset: .72, easing: 'cubic-bezier(.6,-.3,.7,.4)' },
    { transform: bigAt(tx, ty, .15, 0), opacity: 0, offset: 1 },
  ], { duration: COIN_MS - 150, fill: 'both' });

  // glints all over the screen
  for (let i = 0; i < 26; i++) {
    const s = add('cf-glint', `left:${Math.random() * W}px; top:${Math.random() * H * .85}px; font-size:${12 + Math.random() * 22}px`); s.textContent = '✦';
    s.animate([{ transform: 'scale(0) rotate(0deg)', opacity: 0 }, { transform: 'scale(1.2) rotate(90deg)', opacity: 1, offset: .4 }, { transform: 'scale(0) rotate(180deg)', opacity: 0 }], { duration: 500 + Math.random() * 500, delay: Math.random() * 1700, fill: 'both' });
  }

  let landed = 0; if (!own) show(0);
  const at = (x, y, k, rot) => `translate(${x - size / 2}px, ${y - size / 2}px) scale(${k}) rotate(${rot}deg)`;
  for (let i = 0; i < N; i++) {
    const im = document.createElement('img'); im.src = `media/ui/coin${1 + i % 3}.webp`; im.alt = '';
    // three sources: a burst from the board, then a cannon from each lower corner
    const src = i < N * .5 ? 0 : i % 2 ? 1 : 2;
    const sx = src === 0 ? ox : src === 1 ? -20 : W + 20, sy = src === 0 ? oy : H * .8;
    let mx, my;
    if (src === 0) { const a = Math.random() * Math.PI * 2, r = 40 + Math.random() * Math.min(W * .48, 210); mx = ox + Math.cos(a) * r; my = oy + Math.sin(a) * r * .95 - 20; }
    else { mx = W * (.12 + Math.random() * .76); my = H * (.14 + Math.random() * .5); }
    const sc = .65 + Math.random() * .85, spin = (Math.random() - .5) * 900;
    const wait = (src === 0 ? 0 : 260) + Math.random() * 260, out = 380 + Math.random() * 120, hang = 260 + Math.random() * 180 + i * 9, fly = 460 + Math.random() * 140;
    const total = out + hang + fly;
    layer.appendChild(im);
    im.animate([
      { transform: at(sx, sy, .2, 0), opacity: 0, offset: 0, easing: 'cubic-bezier(.15,.85,.3,1)' },
      { transform: at(mx, my - 26, sc * 1.2, spin * .5), opacity: 1, offset: out / total, easing: 'ease-in-out' },
      { transform: at(mx, my + 18, sc, spin * .65), opacity: 1, offset: (out + hang) / total, easing: 'cubic-bezier(.5,-.25,.7,.4)' },
      { transform: at(tx, ty, .42, spin), opacity: 1, offset: 1 },
    ], { duration: total, delay: wait, fill: 'both' }).onfinish = () => {
      im.remove(); landed++;
      if (alive()) {
        show(Math.round(from + (goal() - from) * landed / N));
        if (landed % 3 === 0) chip.animate([{ transform: 'scale(1.3)', filter: 'brightness(1.8)' }, { transform: 'scale(1)', filter: 'brightness(1)' }], { duration: 170 });
        if (landed % 6 === 0) Sound.play('clink', landed / N);
      }
      if (landed === N) { Sound.play('tada'); chip.animate([{ transform: 'scale(1.6)', filter: 'brightness(2.2)' }, { transform: 'scale(1)', filter: 'brightness(1)' }], { duration: 420, easing: 'cubic-bezier(.2,1.8,.4,1)' }); setTimeout(done, 300); }
    };
  }
  Sound.play('jackpot');
  setTimeout(done, COIN_MS + 2200);   // whatever happens to the animations, the sum ends up right
}
function finish() {
  if (G.mode === 'duel') return duelSolved();
  G.done = true; G.hammerMode = false; clearInterval(timerInt);
  const winDelay = (G.lastSt ? G.lastSt.total : 1) * 90 + 250;
  draw($('board'), G.lv, G.mirrors, null, true, G.locked, false);
  $('status').textContent = ''; $('powerBox').hidden = true;
  let earned = 0, mood = 'think', winSound = null;

  if (G.mode === 'weekly') {
    const time = elapsed(), w = weekStr();
    // a harder board, so more room on the clock; the first solve of the week pays a big bonus
    const score = 1000 + Math.max(0, 1000 - time * 2) + Math.max(0, 1000 - Math.max(0, G.moves - par(G.lv)) * 60);
    const clean = G.moves <= par(G.lv);
    track('done', { p_moves: G.moves, p_time: time, p_helped: false });
    mood = clean && time <= 120 ? 'cheer' : clean || time <= 240 ? 'think' : 'shrug';
    P.weekly = P.weekly || {};
    const prev = P.weekly[w];
    if (!prev || score > prev.score) { earned = score - (prev ? prev.score : 0); P.weekly[w] = { score, moves: G.moves, time }; }
    if (!prev) earned += WEEKLY_BONUS;
    gain(earned);
    $('winTitle').textContent = prev && score <= prev.score ? T('פתרתם שוב!') : prev ? T('שיא חדש לשבוע!') : T('אתגר השבוע הושלם!');
    $('bigStars').innerHTML = '';
    winSound = () => Sound.play('win', 0);
    $('winText').textContent = T`${fmt(score)} נקודות בטבלת השבוע. ${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')} דקות, ${movesText(G.moves)}.${prev && score <= prev.score ? T` השיא שלכם: ${fmt(prev.score)}.` : ''}`;
    $('nextBtn').textContent = T('לטבלת השבוע');
    $('nextBtn').onclick = () => openLeaderboard('week');
    $('retryBtn').textContent = T('נסו שוב לשיא'); $('retryBtn').hidden = false;
    $('retryBtn').onclick = () => openWeekly();
    $('shareBtn').hidden = true;
    publishWeekly();
    if (!P.name) setTimeout(() => askName(), winDelay + 4800);
  } else if (G.mode === 'daily') {
    const time = elapsed();
    const score = 500 + Math.max(0, 500 - time * 3) + Math.max(0, 500 - Math.max(0, G.moves - par(G.lv)) * 50);
    // daily has no stars: a fast, clean solve is perfect; slow and wasteful gets the shrug
    const clean = G.moves <= par(G.lv);
    track('done', { p_moves: G.moves, p_time: time, p_helped: !!G.helped });
    mood = clean && time <= 60 ? 'cheer' : clean || time <= 120 ? 'think' : 'shrug';
    const t = todayStr(), prev = P.daily[t];
    if (!prev || score > prev.score) { earned = score - (prev ? prev.score : 0); P.daily[t] = { score, moves: G.moves, time }; }
    if (!prev) earned += 500;
    gain(earned);
    $('winTitle').textContent = prev && score <= prev.score ? T('פתרתם שוב!') : prev ? T('שיא חדש להיום!') : T('האתגר היומי הושלם!');
    $('bigStars').innerHTML = '';
    winSound = () => Sound.play('win', 0);
    $('winText').textContent = T`${fmt(score)} נקודות בטבלה. ${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')} דקות, ${movesText(G.moves)}.${prev && score <= prev.score ? T` השיא שלכם: ${fmt(prev.score)}.` : ''}`;
    $('nextBtn').textContent = T('לטבלת המובילים');
    $('nextBtn').onclick = () => openLeaderboard('day');
    $('retryBtn').textContent = T('נסו שוב לשיא'); $('retryBtn').hidden = false;
    $('retryBtn').onclick = () => openDaily();
    $('shareBtn').hidden = false;
    $('shareBtn').onclick = () => shareDaily(P.daily[t]);
    if (!P.name) setTimeout(() => askName(), winDelay + 4800);
  } else {
    $('shareBtn').hidden = true;
    const lv = G.lv, i = G.idx;
    const stars = G.helped ? 1 : G.moves <= par(lv) ? 3 : 2;
    mood = stars === 3 ? 'cheer' : stars === 2 ? 'think' : 'shrug';
    track('done', { p_stars: stars, p_moves: G.moves, p_time: Math.round((Date.now() - (G.t0 || Date.now())) / 1000), p_helped: !!G.helped });
    const pts = levelPoints(lv, stars), prev = recOf(i);
    if (!prev || stars > prev.stars) { earned = pts - (prev ? prev.pts : 0); P.levels[lv.id] = { stars, pts }; }
    gain(earned);
    const last = i === ALL.length - 1, chEnd = !last && ALL[i + 1].ch !== lv.ch;
    $('winTitle').textContent = stars === 3 ? T('מושלם!') : last ? T('סיימתם את המשחק!') : chEnd ? T('הפרק הושלם!') : T('כל הכבוד!');
    $('bigStars').innerHTML = starsSVG(stars);
    winSound = () => { Sound.play('win', stars); if (stars === 3) Sound.play('perfect'); };
    $('winText').textContent = stars === 3 ? T`פתרתם ב${movesText(G.moves)}, בתוך היעד.` :
      stars === 2 ? T`${movesText(G.moves)}. פתרו ב-${par(lv)} מהלכים או פחות בשביל שלושה כוכבים.` :
      T('השתמשתם בעזרה. פתרו בלי עזרה בשביל עוד כוכבים.');
    const lesson = P.tut === 1 && i < 2;
    $('nextBtn').textContent = lesson ? T('לשלב הבא') : T('המשך');
    $('nextBtn').onclick = () => lesson ? openLevel(i + 1) : maybeInterstitial(() => { hideWin(); clearInterval(timerInt); G = null; openMap(lv.ch, i); });
    $('retryBtn').textContent = T('נסו שוב לשלושה כוכבים'); $('retryBtn').hidden = stars === 3;
    $('retryBtn').onclick = () => openLevel(i);
  }
  $('gains').innerHTML = earned ? `<div class="coin">${ICON_POINTS}<span>+${fmt(earned)}</span></div>` : `<span style="color:var(--muted)">${T`כבר השגתם את התוצאה הזו`}</span>`;
  // the counter keeps the old sum until the coins fly into it
  G.coinFrom = P.balance - earned; $('gamePoints').innerHTML = coinHTML(ICON_POINTS, G.coinFrom);
  showWin(mood, winDelay, winSound, earned);
  save(); checkAchievements();
}
let bonusPending = false;   // a newcomer gets the daily bonus when they first reach the home screen, not on top of level one
/* A first visit starts with a half-minute lesson: the first level, with the next cell to tap ringed and explained. */
const isNewcomer = () => !P.tut && !Object.keys(P.levels).length;
function offerTutorial() {
  modal(`<img class="bug" alt="" src="${POSE.welcome}">
    <h3>${T('ברוכים הבאים ל-BEAM!')}</h3>
    <p>${T('הגחלילית צריכה עזרה להדליק את הכוכבים. בואו נלמד איך משחקים, זה לוקח חצי דקה.')}</p>
    <button class="btn orange" id="tutGo">${T('בואו נתחיל')}</button>
    <button class="linkbtn" id="tutSkip">${T('אני כבר יודע לשחק')}</button>`, m => {
      m.querySelector('#tutGo').onclick = () => { closeModal(); P.tut = 1; save(false); bonusPending = true; openLevel(0); };
      m.querySelector('#tutSkip').onclick = () => { closeModal(); P.tut = 2; save(false); dailyBonus(); checkAchievements(); };
    }, true);
}
/* what the lesson asks for next: the first cell of the solution that is not right yet (or a stray mirror to take off) */
function coachStep() {
  const want = new Map(G.lv.sol), stray = Object.keys(G.mirrors).find(k => !want.has(k));
  if (stray) return { k: stray, text: T('המראה הזו לא במקום. הקישו עליה עד שהיא נעלמת.') };
  for (const [k, m] of want) {
    if (!G.mirrors[k]) return { k, text: T('הקישו על המשבצת המסומנת כדי להציב מראה. המראה מפנה את הקרן.') };
    if (G.mirrors[k] !== m) return { k, text: T('יפה! עכשיו הקישו עליה שוב כדי לסובב אותה אל הכוכב.') };
  }
  return null;
}
function goHome() {
  clearInterval(timerInt); renderHome(); show('home');
  if (bonusPending && isNewcomer()) { bonusPending = false; setTimeout(offerTutorial, 450); return; }
  if (bonusPending) { bonusPending = false; setTimeout(() => { dailyBonus(); checkAchievements(); }, 450); }
}

/* ================= duel =================
   Two players, the same generated board, first to light every star takes the round; first to three wins (at most five rounds).
   The server is the referee (clock, who finished first, who went quiet). This side asks it about once a second
   and draws whatever it answers: waiting room, countdown, the race, the result. */
/* The room's number says which boards it plays: 30 easy, 31 medium, 32 hard. Raise the base whenever duelLevel() or the level
   generator changes, so mismatched versions cannot meet. */
const DUEL_BASE = 30, DUEL_NAMES = ['קל', 'בינוני', 'קשה'];
let duelDiff = 1;
const DUEL_SETS = [
  [ { W: 6, H: 6, k: 3, nt: 3, walls: 2, bombs: 2, maxSols: 3, budget: 80000 },
    { W: 7, H: 7, k: 3, nt: 3, walls: 3, bombs: 3, maxSols: 3, budget: 120000 },
    { W: 7, H: 7, k: 4, nt: 3, walls: 3, bombs: 3, maxSols: 3, budget: 150000 } ],
  [ { W: 7, H: 7, k: 4, nt: 3, walls: 3, bombs: 3, maxSols: 2, budget: 150000 },
    { W: 7, H: 7, k: 4, nt: 4, walls: 3, bombs: 4, maxSols: 2, budget: 150000 },
    { W: 7, H: 7, k: 5, nt: 4, walls: 3, bombs: 4, maxSols: 2, budget: 150000 } ],
  [ { W: 7, H: 7, k: 5, nt: 4, walls: 3, bombs: 4, maxSols: 2, budget: 150000 },
    { W: 8, H: 8, k: 5, nt: 4, walls: 4, bombs: 4, maxSols: 2, budget: 200000 },
    { W: 8, H: 8, k: 5, nt: 5, walls: 4, bombs: 5, maxSols: 2, budget: 200000 },
    { W: 8, H: 8, k: 5, nt: 4, walls: 3, bombs: 4, fixed: 1, maxSols: 2, budget: 200000 },
    { W: 8, H: 8, k: 5, nt: 5, walls: 4, bombs: 5, maxSols: 2, budget: 200000 } ],
];
const duelDiffOf = gen => Math.max(0, Math.min(2, (gen || DUEL_BASE + 1) - DUEL_BASE));
const DUEL_REWARD = { win: 300, draw: 150, lose: 100 };
/* both players build the round's board from the room's seed, so it is identical without ever being sent */
function duelLevel(seed, round, gen) {
  const set = DUEL_SETS[duelDiffOf(gen)], R = mulberry32(hashStr('duel-' + seed + '-' + round)), sp = set[(round - 1) % set.length];
  for (let i = 0; i < 1500; i++) { const lv = makeLevel(R, sp); if (lv) return lv; }
  for (let i = 0; i < 1500; i++) { const lv = makeLevel(R, set[0]); if (lv) return lv; }   // a rare seed that finds no board of this size still gets one of this difficulty
  return { rows: ['......', '....T.', '......', '......', '.T....', '......'], lasers: [['L', 1]], max: 2, sol: [['5,1', '\\'], ['5,4', '/']] };
}
/* What this player has put into a pot and which matches were already paid out, kept with the profile: a room entered again
   (the link tapped twice, the page refreshed) must neither take the stake twice nor forget that it was put in. */
const duelMark = (kind, seed) => { P.duelLog = P.duelLog || { paid: [], done: [] }; if (!P.duelLog[kind].includes(seed)) P.duelLog[kind] = [...P.duelLog[kind], seed].slice(-20); };
const duelHas = (kind, seed) => !!(P.duelLog && P.duelLog[kind] && P.duelLog[kind].includes(seed));
let D = null;   // the duel in progress: { code, st: last server answer, offset: server clock minus ours, key, timer, fails }
const duelNow = () => Date.now() + (D ? D.offset || 0 : 0);
function duelTimeLeft() { return D && D.st ? Math.max(0, Math.ceil((D.st.round_start + D.st.round_len * 1000 - duelNow()) / 1000)) : 0; }
function duelLink(code) { return (/^https?:$/.test(location.protocol) ? location.origin + location.pathname : SITE_URL) + '?duel=' + code; }

function openDuelMenu() {
  modal(`<img class="bug" alt="" src="${POSE.power}">
    <h3>${T('דו-קרב')}</h3>
    <p>${T('שני שחקנים, אותו לוח. הראשון שמדליק את כל הכוכבים מנצח בסיבוב. מי שמגיע ל-3 ניצחונות מנצח.')}</p>
    ${P.duel ? `<p><b>${T`ניצחונות: ${P.duel.w} · הפסדים: ${P.duel.l} · תיקו: ${P.duel.d}`}</b></p>` : ''}
    <button class="btn green" id="duelFriends">${T('החברים שלי')}</button>
    <button class="btn orange" id="duelCreate" style="margin-top:10px">${T('הזמנה בקישור')}</button>
    <p style="margin:16px 0 6px">${T('קיבלתם קוד מחבר?')}</p>
    <div class="dueljoin"><input id="duelCodeIn" maxlength="5" autocomplete="off" autocapitalize="characters" aria-label="${T('קוד חדר')}" placeholder="ABCDE"><button class="btn blue" id="duelJoinBtn">${T('הצטרפות')}</button></div>`, m => {
            m.querySelector('#duelCreate').onclick = () => { closeModal(); withName(() => chooseStake(createDuel)); };
      m.querySelector('#duelFriends').onclick = () => { closeModal(); friendsEntry(); };
      const go = () => { const c = m.querySelector('#duelCodeIn').value.trim().toUpperCase(); if (c.length < 5) { m.querySelector('#duelCodeIn').focus(); return; } closeModal(); withName(() => joinDuel(c)); };
      m.querySelector('#duelJoinBtn').onclick = go;
      m.querySelector('#duelCodeIn').addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    });
}
/* a duel shows your name to the other player, so one has to exist first */
function withName(next) { if (P.name) next(); else askName(next); }

/* a duel can be friendly or played for points: both put the stake in, the winner takes the pot */
const STAKES = [0, 200, 500, 1000];
function chooseStake(next) {
  modal(`<img class="bug" alt="" src="${POSE.power}">
    <h3>${T('רמת קושי')}</h3>
    <div class="giftsizes diff">${DUEL_NAMES.map((n, d) => `<button data-d="${d}"${d === duelDiff ? ' class="on"' : ''}>${T(n)}</button>`).join('')}</div>
    <h3>${T('על מה משחקים?')}</h3>
    <p>${T('שני השחקנים שמים את אותו סכום, והמנצח לוקח את הקופה.')}</p>
    ${STAKES.map(v => `<button class="btn ${v ? 'orange' : 'green'}" data-st="${v}" style="margin-top:10px"${P.balance < v ? ' disabled' : ''}>${v ? T`${fmt(v)} נקודות` : T('משחק ידידותי')}</button>`).join('')}`, m => {
      for (const b of m.querySelectorAll('[data-d]')) b.onclick = () => { duelDiff = +b.dataset.d; Sound.play('tap'); for (const x of m.querySelectorAll('[data-d]')) x.classList.toggle('on', x === b); };
      for (const b of m.querySelectorAll('[data-st]')) b.onclick = () => { closeModal(); next(+b.dataset.st); };
    });
}
async function createDuel(stake = 0) {
  show('duel'); $('duelSub').textContent = ' '; $('duelBox').innerHTML = `<p>${T('פותחים חדר…')}</p>`;
  let code = null;
  try { code = await rpc('beam_duel_create', { p_id: P.id, p_secret: playerKey(), p_name: P.name, p_gen: DUEL_BASE + duelDiff, p_stake: stake }); } catch (e) { /* handled below */ }
  if (!code) { toast(T('אין חיבור כרגע. נסו שוב מאוחר יותר.')); goHome(); return; }
  startDuel(code);
}
/* a duel for points that the player cannot afford: say so plainly, with the numbers */
const poorNote = stake => `<div class="poor"><b>${T('אין לכם מספיק נקודות')}</b><span>${T`הדו-קרב על ${fmt(stake)} נקודות ויש לכם ${fmt(P.balance)}. חסרות ${fmt(stake - P.balance)}.`}</span></div>`;
async function joinDuel(code, agreed) {
  if (!agreed) {            // a room played for points says so before anything is taken
    let room = null;
    try { room = await rpc('beam_duel_peek', { p_code: code }); } catch (e) { /* the join itself reports a lost connection */ }
    if (room && room.stake > 0 && room.status === 'waiting') {
      if (P.balance < room.stake) {
        Sound.play('error'); Haptic.play('error');
        modal(`<img class="bug" alt="" src="${POSE.sleep}"><h3>${T`${esc(room.name || '')} מזמין לדו-קרב`}</h3>${poorNote(room.stake)}
          <button class="btn green" id="poorOk">${T('הבנתי')}</button>`, m => { m.querySelector('#poorOk').onclick = () => { closeModal(); goHome(); }; }, true);
        return;
      }
      modal(`<img class="bug" alt="" src="${POSE.power}">
        <h3>${T`דו-קרב על ${fmt(room.stake)} נקודות`}</h3>
        <p>${T`${esc(room.name || '')} מזמין לדו-קרב. המנצח לוקח ${fmt(room.stake * 2)}.`}</p>
        <button class="btn green" id="stYes">${T('הצטרפות')}</button>
        <button class="btn ghosty" id="stNo" style="margin-top:12px">${T('ביטול')}</button>`, m => {
          m.querySelector('#stYes').onclick = () => { closeModal(); joinDuel(code, true); };
          m.querySelector('#stNo').onclick = () => { closeModal(); goHome(); };
        }, true);
      return;
    }
  }
  show('duel'); $('duelSub').textContent = ' '; $('duelBox').innerHTML = `<p>${T('מצטרפים לחדר…')}</p>`;
  let res = null;
  // the room knows its difficulty and only lets in a caller who names it, so ask with each in turn
  try { for (const d of [1, 0, 2]) { res = await rpc('beam_duel_join', { p_code: code, p_id: P.id, p_secret: playerKey(), p_name: P.name, p_gen: DUEL_BASE + d }); if (res !== 'version') break; } } catch (e) { /* handled below */ }
  if (res !== 'ok') {
    toast(res === 'full' ? T('החדר הזה כבר מלא') : res === 'version' ? T('צריך לרענן את הדף כדי לשחק מול החבר') : res === 'missing' ? T('לא מצאנו חדר עם הקוד הזה') : T('אין חיבור כרגע. נסו שוב מאוחר יותר.'));
    goHome(); return;
  }
  startDuel(code);
}
function startDuel(code) {
  stopDuel();
  D = { code, st: null, offset: 0, key: '', fails: 0, rewarded: '', rematch: false, lastCount: null, view: '', invited: '', friendAsked: false, paid: '' };
  duelSync();
  D.timer = setInterval(duelSync, 900);
}
function stopDuel() { if (D) { clearInterval(D.timer); D = null; } clearInterval(timerInt); emoteBar(false); }
/* ---- reactions in a duel: a little face sent to the other side, shown big over their screen ---- */
const EMOTES = { laugh: '😂', wow: '😮', cool: '😎', angry: '😡', cry: '😭', love: '😍', clap: '👏', fire: '🔥', think: '🤔', gg: '🤝' };
// the firefly pack: painted faces, sent the same way as the emoji
for (const k of ['happy', 'laugh', 'love', 'wow', 'think', 'wink', 'thumbs', 'luck', 'angry', 'sad', 'cry', 'win']) EMOTES['b-' + k] = `<img alt="" src="media/emo/${k}.webp">`;
// every character set is known here so a face the opponent sends always shows, even from a set this player has not bought
for (const it of EMO_SETS) for (const f of EMO_FACES) EMOTES[`c-${it.id}-${f}`] = `<img alt="" src="${emoSrc(it.id, f)}">`;
function emoteBar(on) {
  let b = $('emoBtn');
  if (!on) { if (b) b.hidden = true; const pk = $('emoPick'); if (pk) pk.hidden = true; return; }
  if (!b) {
    b = document.createElement('button'); b.id = 'emoBtn'; b.className = 'emobtn'; b.setAttribute('aria-label', T('שליחת אימוג׳י')); b.textContent = '😊';
    const pk = document.createElement('div'); pk.id = 'emoPick'; pk.className = 'emopick'; pk.hidden = true;
    const btns = list => list.map(([k, e]) => `<button data-emo="${k}"${/^[bc]-/.test(k) ? ' class="bug"' : ''}>${e}</button>`).join('');
    const all = Object.entries(EMOTES);
    const sets = EMO_SETS.filter(it => ownsEmo(it.id)).map(it => `<div class="emogrid bugs five">${btns(EMO_FACES.map(f => [`c-${it.id}-${f}`, EMOTES[`c-${it.id}-${f}`]]))}</div>`).join('');
    pk.innerHTML = `<div class="emogrid bugs">${btns(all.filter(([k]) => k.startsWith('b-')))}</div>${sets}<div class="emogrid">${btns(all.filter(([k]) => !/^[bc]-/.test(k)))}</div>`;
    document.body.append(b, pk);
    b.onclick = () => { pk.hidden = !pk.hidden; Sound.play('tap'); };
    pk.onclick = e => { const k = e.target.closest('[data-emo]'); if (k) sendEmote(k.dataset.emo); };
    document.addEventListener('pointerdown', e => { if (!pk.hidden && !pk.contains(e.target) && e.target !== b) pk.hidden = true; });
  }
  b.hidden = false;
}
let emoLast = 0;
function sendEmote(k) {
  $('emoPick').hidden = true;
  if (!D || Date.now() - emoLast < 1500) return;          // one face at a time, so nobody floods the other screen
  emoLast = Date.now();
  rpc('beam_duel_emote', { p_code: D.code, p_id: P.id, p_secret: playerKey(), p_emo: k }).catch(() => {});
  emoteFly(EMOTES[k], T('שלחתם'), true);
}
function emoteFly(face, who, mine) {
  const el = document.createElement('div'); el.className = 'emofly' + (mine ? ' mine' : '');
  el.innerHTML = `<b>${face}</b>${who ? `<span>${esc(who)}</span>` : ''}`;
  document.body.appendChild(el);
  if (!mine) { Sound.play('pop'); Haptic.play('tap'); }
  setTimeout(() => el.remove(), 2600);
}
function leaveDuel() {
  if (D) rpc('beam_duel_sync', { p_code: D.code, p_id: P.id, p_secret: playerKey(), p_leave: true }).catch(() => {});
  stopDuel(); G = null; hideWin(); goHome();
}
async function duelSync() {
  const d = D; if (!d || d.busy) return;
  d.busy = true;
  const mine = G && G.mode === 'duel' && G.key === d.key;
  let st;
  try {
    st = await rpc('beam_duel_sync', { p_code: d.code, p_id: P.id, p_secret: playerKey(), p_round: mine ? G.round : 0,
      p_lit: mine && G.boom ? -1 : mine && G.lastSt ? G.lastSt.lit : 0, p_done: !!(mine && G.done && !G.boom), p_rematch: d.rematch });
  } catch (e) { d.busy = false; if (D === d && ++d.fails === 4) toast(T('החיבור נקטע. מנסים להתחבר מחדש…')); return; }
  d.busy = false;
  if (D !== d) return;                                    // the player left while we were asking
  if (!st) { toast(T('החדר נסגר')); stopDuel(); G = null; goHome(); return; }
  d.fails = 0; d.offset = st.now - Date.now(); d.st = st;
  if (st.emo_n) {                                          // the other side sent a face since we last looked
    const opp = 2 - st.me, n = st.emo_n[opp];
    if (d.emoSeen != null && n > d.emoSeen && st.emo[opp] && EMOTES[st.emo[opp]]) emoteFly(EMOTES[st.emo[opp]], st.names[opp] || '');
    d.emoSeen = n;
  }
  emoteBar(st.status !== 'waiting' && st.left_by == null);
  duelRender();
}
function duelRender() {
  const st = D.st, me = st.me - 1, opp = 1 - me, box = $('duelBox');
  // each score sits inside its own player's block, so no text direction can ever pair it with the other name
  const vs = `<div class="duelvs"><div class="side"><b>${esc(st.names[me] || '')}</b><i>${st.wins[me]}</i></div><span class="colon">:</span><div class="side"><b>${esc(st.names[opp] || '…')}</b><i>${st.wins[opp]}</i></div></div>`;
  if (st.status === 'waiting') {
    if (D.view === 'waiting') return;
    D.view = 'waiting'; show('duel'); $('duelSub').textContent = D.invited ? T('ההזמנה נשלחה') : T('שלחו את הקישור או את הקוד לחבר');
    box.innerHTML = `<img class="dbug" alt="" src="${WIN_BUG.think}"><h3>${D.invited ? T`ממתינים ל-${D.invited}…` : T('ממתינים ליריב…')}</h3><div class="duelcode">${st.code}</div>
      <button class="btn orange" id="duelShare">${T('שליחת הקישור')}</button>
      <p style="margin-top:14px">${T('החדר נשאר פתוח כל עוד המסך הזה פתוח.')}</p>`;
    box.querySelector('#duelShare').onclick = () => shareSheet(T('שליחת הקישור'), T`בואו לדו-קרב ב-BEAM! מי פותר ראשון?`, duelLink(st.code));
    return;
  }
  if (st.status === 'countdown') {
    const left = Math.max(0, Math.ceil((st.round_start - duelNow()) / 1000));
    const key = st.seed + ':' + st.round;
    if (D.key !== key) { D.key = key; D.lv = duelLevel(st.seed, st.round, st.gen); D.rematch = false; D.view = ''; }   // build the board while the clock runs
    const head = st.round > 1 && st.last_winner != null
      ? (st.last_winner === 0 ? T('הסיבוב נגמר בתיקו') : st.last_winner - 1 === me ? T('ניצחתם בסיבוב!') : T('היריב היה מהיר יותר'))
      : T('יריב נמצא!');
    if (D.view !== 'countdown') {
      D.view = 'countdown'; hideWin(); show('duel'); $('duelSub').textContent = T(DUEL_NAMES[duelDiffOf(st.gen)]) + ' · ' + (st.stake ? T`סיבוב ${st.round} · הקופה: ${fmt(st.stake * 2)}` : T`סיבוב ${st.round} · עד 3 ניצחונות`);
      if (st.stake && st.round === 1 && !duelHas('paid', st.seed)) { duelMark('paid', st.seed); P.balance = Math.max(0, P.balance - st.stake); save(false); toast(T('שמתם בקופה'), `-${fmt(st.stake)}`); }
      box.innerHTML = `<img class="dbug" alt="" src="${POSE.power}"><h3>${head}</h3>${vs}<div class="duelcount" id="duelCount"></div><p>${T('הלוח ייחשף לשניכם באותו רגע.')}</p>`;
      if (st.round > 1 && st.last_winner != null) Sound.play(st.last_winner - 1 === me ? 'win' : 'unlit', 1);
      D.lastCount = null;
    }
    const shown = left > 3 ? '' : String(Math.max(left, 1));
    if (shown !== D.lastCount) {
      D.lastCount = shown; const c = $('duelCount'); c.textContent = shown; c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop');
      if (shown) Sound.play('tap');
    }
    return;
  }
  if (st.status === 'playing') {
    const key = st.seed + ':' + st.round;
    if (D.key !== key) { D.key = key; D.lv = duelLevel(st.seed, st.round, st.gen); }
    if (!G || G.mode !== 'duel' || G.key !== key) {
      D.view = 'playing';
      G = session('duel', { ...D.lv, tip: '' }, { round: st.round, key });
      G.t0 = Date.now(); track('start'); $('timeBar').hidden = true;
      clearInterval(timerInt); timerInt = setInterval(() => { if (G && G.mode === 'duel' && !$('game').hidden) { renderPills(); } }, 500);
      Sound.play('whoosh'); renderGame(); show('game');
    } else { renderDuelBar(); if (G.done && !G.boom) $('status').textContent = T('פתרתם! בודקים מי היה ראשון…'); }
    return;
  }
  // done
  const sig = 'done:' + st.seed + ':' + st.rematch + ':' + D.rematch + ':' + st.left_by + ':' + D.friendAsked;
  if (D.view.indexOf('done:') !== 0) socialStart();        // from here on the two can find each other as friends
  if (D.view === sig) return;
  D.view = sig;
  clearInterval(timerInt); hideWin();
  const won = st.winner - 1 === me, draw_ = st.winner === 0, gone = st.left_by != null && st.left_by - 1 === opp;
  const played = st.wins[0] + st.wins[1] > 0 || st.round > 1;          // walking out before a single round earns nobody anything
  const pot = st.stake && duelHas('paid', st.seed) ? (!played || draw_ ? st.stake : won ? st.stake * 2 : 0) : 0;      // an unplayed or drawn match gives the stake back
  const reward = (!played ? 0 : draw_ ? DUEL_REWARD.draw : won ? DUEL_REWARD.win : DUEL_REWARD.lose) + pot;
  if (!duelHas('done', st.seed)) {                        // once per match, into the spending balance only
    duelMark('done', st.seed); gain(reward, false);
    if (played) { P.duel = P.duel || { w: 0, l: 0, d: 0 }; P.duel[draw_ ? 'd' : won ? 'w' : 'l']++; }
    save(false);
    Sound.play(won ? 'win' : 'unlit', 3); if (won) Sound.play('perfect');
    D.burst = won && reward > 0;
    if (played) rememberOpponent(st.code);
    track('done', { p_stars: won ? 3 : draw_ ? 2 : 1, p_helped: false });
  }
  if (gone && D.rematch) { D.rematch = false; toast(T('היריב כבר יצא מהמשחק')); }
  show('duel'); $('duelSub').textContent = gone ? T('היריב עזב את המשחק') : ' ';
  box.innerHTML = `<img class="dbug" alt="" src="${WIN_BUG[won ? 'cheer' : draw_ ? 'think' : 'shrug']}">
    <h3>${draw_ ? T('תיקו!') : won ? T('ניצחתם בדו-קרב!') : T('הפעם היריב ניצח')}</h3>${vs}
    ${reward ? `<div class="gains"><div class="coin">${ICON_POINTS}<span>+${fmt(reward)}</span></div></div>` : ''}
    ${st.stake && played && !draw_ ? `<p>${won ? T`כולל הקופה: ${fmt(st.stake * 2)}` : T`הקופה של ${fmt(st.stake * 2)} הלכה ליריב`}</p>` : ''}
    ${gone ? `<p><b>${T('היריב יצא, אי אפשר לשחק שוב באותו חדר.')}</b></p>` : `<button class="btn green" id="duelAgain"${D.rematch || P.balance < (st.stake || 0) ? ' disabled' : ''}>${D.rematch ? T('ממתינים ליריב…') : P.balance < (st.stake || 0) ? T('אין מספיק נקודות למשחק חוזר') : st.rematch[opp] ? T('היריב רוצה משחק חוזר. לשחק!') : T('משחק חוזר')}</button>`}
    <button class="btn blue" id="duelHome">${T('חזרה לבית')}</button>
    ${D.friendAsked || isFriend(st.names[opp]) ? '' : `<button class="linkbtn" id="duelFriend">${T`הוספת ${st.names[opp] || ''} לחברים`}</button>`}`;
  if (D.burst) { D.burst = false; const chip = box.querySelector('.gains .coin'); if (chip) requestAnimationFrame(() => coinBurst(reward, { chip })); }   // a won duel pays out in flying coins too
  const fr = box.querySelector('#duelFriend');
  if (fr) fr.onclick = async () => {
    D.friendAsked = true; duelRender();
    let res = null;
    try { res = await rpc('beam_friend_duel', { p_id: P.id, p_secret: playerKey(), p_name: P.name, p_code: st.code }); } catch (e) { /* told below */ }
    toast(res === 'friends' ? T('אתם חברים עכשיו') : res === 'sent' ? T('בקשת החברות נשלחה') : T('אין חיבור כרגע. נסו שוב מאוחר יותר.'));
    pulse();
  };
  const again = box.querySelector('#duelAgain');
  if (again) again.onclick = () => { D.rematch = true; duelRender(); duelSync(); };
  box.querySelector('#duelHome').onclick = leaveDuel;
}
function renderDuelBar() {
  if (!D || !D.st) return;
  const st = D.st, me = st.me - 1, opp = 1 - me, total = G && G.lastSt ? G.lastSt.total : 3;
  $('duelBar').innerHTML = `<div class="dp"><div><b>${esc(st.names[me] || '')}</b><span>★ ${G && G.lastSt ? G.lastSt.lit : 0}/${total}</span></div><i>${st.wins[me]}</i></div>
    <div class="mid"><b>:</b></div>
    <div class="dp opp"><div><b>${esc(st.names[opp] || '')}</b><span class="${st.done[opp] ? 'fin' : ''}">★ ${Math.min(st.lit[opp], total)}/${total}</span></div><i>${st.wins[opp]}</i></div>`;
}
/* you lit every star: freeze the board and tell the referee straight away, without waiting for the next tick */
function duelSolved() {
  G.done = true;
  draw($('board'), G.lv, G.mirrors, null, true, G.locked, false);
  $('status').className = 'status'; $('status').textContent = T('פתרתם! בודקים מי היה ראשון…');
  Sound.play('win', 1);
  if (D) { D.busy = false; duelSync(); }
}
const esc = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/* a small sheet with the ways to send a link to a friend: WhatsApp, the phone's own share menu, or copy */
function shareSheet(title, text, link) {
  const wa = 'https://wa.me/?text=' + encodeURIComponent(text + '\n' + link);
  modal(`<h3>${title}</h3>
    <a class="btn green" id="shWa" href="${wa}" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;text-decoration:none">${T('שליחה בוואטסאפ')}</a>
    ${navigator.share ? `<button class="btn blue" id="shMore" style="margin-top:12px">${T('שיתוף באפליקציה אחרת')}</button>` : ''}
    <button class="btn ghosty" id="shCopy" style="margin-top:12px">${T('העתקת הקישור')}</button>
    <button class="linkbtn" id="shClose">${T('סגירה')}</button>`, m => {
      m.querySelector('#shWa').onclick = () => setTimeout(closeModal, 300);
      const more = m.querySelector('#shMore');
      if (more) more.onclick = () => navigator.share({ text, url: link }).then(closeModal, () => {});
      m.querySelector('#shCopy').onclick = () => {
        const done = () => { closeModal(); toast(T('הקישור הועתק, אפשר להדביק ולשלוח')); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(done, () => toast(link));
        else toast(link);
      };
      m.querySelector('#shClose').onclick = closeModal;
    });
}
function shareText(text, link, copiedMsg) {
  const copy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text + '\n' + link).then(() => toast(copiedMsg), () => toast(T('לא הצלחנו להעתיק את התוצאה')));
    else toast(link);
  };
  if (navigator.share) navigator.share({ text, url: link }).catch(e => { if (!e || e.name !== 'AbortError') copy(); });
  else copy();
}

const SITE_URL = 'https://beam-game.co.il/';
/* ================= friends =================
   Friends see each other while the game is open and can call each other into a duel. Everything goes through one
   light "pulse" request every few seconds, and only for players who have used friends or played a duel. */
const Social = { data: null, timer: null, busy: false, invite: null };
const socialOn = () => !!(P && P.social && P.name) && /^https?:$/.test(location.protocol);
const isFriend = name => !!(name && Social.data && Social.data.friends.some(f => f.rel === 'ok' && f.name === name));
function socialStart() { if (!P.social) { P.social = true; save(false); } pulse(); }
async function pulse() {
  clearTimeout(Social.timer);
  if (!socialOn()) return;
  Social.timer = setTimeout(pulse, !$('friends').hidden || (D && D.invited) ? 3000 : 7000);
  if (document.hidden || Social.busy) return;
  Social.busy = true;
  let r = null;
  try {
    r = await rpc('beam_pulse', { p_id: P.id, p_secret: playerKey(), p_name: P.name,
      p_state: D ? 'duel' : !$('game').hidden ? 'level' : 'home', p_visible: P.hidePresence !== true, p_avatar: lookOf('char') });
  } catch (e) { /* quiet: the next pulse tries again */ }
  Social.busy = false;
  if (!r || !Array.isArray(r.friends) || !Array.isArray(r.invites)) return;
  Social.data = r; socialRender();
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) pulse(); });
/* points the game's owner sent this player wait on the server; collect them whenever the game is opened or brought back to the front */
let giftBusy = false;
async function claimGifts() {
  if (giftBusy || !P || !P.id || isNewcomer()) return;
  giftBusy = true;
  let n = 0;
  let who = [];
  try { const r = await rpc('beam_gifts_take', { p_id: P.id, p_secret: playerKey() }); n = +(r && r.sum) || 0; who = (r && r.from) || []; } catch (e) { /* next time */ }
  giftBusy = false;
  if (n <= 0) return;
  gain(n, false); save(false); cloudSoon(); renderHome(); hudSync();
  if (!$('shop').hidden) renderShop();
  giftShow(n, who);
}
/* the gift arrives in the middle of the screen, with its sum and a burst of coins; while a board or another window is open it waits its turn */
function giftShow(n, who) {
  if (!$('overlay').hidden || !$('game').hidden || !$('duel').hidden || !$('watch').hidden || !$('login').hidden) return void setTimeout(() => giftShow(n, who), 900);
  modal(`<img class="bug giftpic" alt="" src="media/ui/gift.webp">
    <h3>${who.length ? T`מתנה מ-${who.slice(0, 2).map(esc).join(', ')}!` : T('קיבלתם מתנה!')}</h3>
    <div class="gains big"><div class="coin">${ICON_POINTS}<span dir="ltr">+${fmt(n)}</span></div></div>
    <p>${T('הנקודות כבר בארנק שלכם.')}</p>
    <button class="btn green" id="giftOk">${T('תודה!')}</button>`, m => {
      m.querySelector('#giftOk').onclick = closeModal;
      requestAnimationFrame(() => coinBurst(n, { chip: m.querySelector('.gains .coin') }));
    });
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) claimGifts(); });
/* "still playing": once a minute while the game is on screen, so the owner can see when each visit began and ended */
const sessionPing = () => { if (P && P.id && !document.hidden && !isNewcomer()) rpc('beam_session_ping', { p_id: P.id, p_secret: playerKey() }).catch(() => {}); };
setInterval(sessionPing, 60 * 1000);
document.addEventListener('visibilitychange', sessionPing);
setInterval(() => { if (!document.hidden) claimGifts(); }, 20 * 1000);   // a gift sent now shows up within seconds, not at the next visit
function socialRender() {
  const d = Social.data, online = d.friends.filter(f => f.online).length, asks = d.friends.filter(f => f.rel === 'in').length;
  if (asks || online) $('duelText').textContent = asks ? T('יש לכם בקשת חברות חדשה') : online === 1 ? T('חבר אחד מחובר עכשיו') : T`${online} חברים מחוברים עכשיו`;
  else $('duelText').innerHTML = T('מי פותר ראשון?') + '<br>' + T('שחקו מול חברים');
  if (!$('friends').hidden || !$('pals').hidden) renderFriends();
  $('palsDot').hidden = !asks; $('palsDot').textContent = asks || '';
  $('duelDot').hidden = !(asks || online); $('duelDot').textContent = asks || online;
  // someone is calling us into a duel
  const inv = d.invites[0];
  if (Social.invite && (!inv || inv.id !== Social.invite)) { Social.invite = null; closeModal(); toast(T('ההזמנה כבר לא בתוקף')); }
  if (inv && !Social.invite && !D && $('overlay').hidden) {
    Social.invite = inv.id; Sound.play('whoosh'); Haptic.play('win');
    modal(`<img class="bug" alt="" src="${inv.avatar && inv.avatar !== 'bug' ? avatarSrc(inv.avatar) : POSE.power}">
      <h3>${T`הזמנה לדו-קרב מ-${esc(inv.name)}`}</h3>
      ${inv.stake ? (P.balance < inv.stake ? poorNote(inv.stake) : `<p>${T`משחקים על ${fmt(inv.stake)} נקודות. המנצח לוקח ${fmt(inv.stake * 2)}.`}</p>`) : ''}
      ${inv.stake && P.balance < inv.stake ? `<button class="btn green" id="invNo">${T('הבנתי')}</button><button id="invYes" hidden></button>`
        : `<button class="btn green" id="invYes">${T('קבל')}</button><button class="btn ghosty" id="invNo" style="margin-top:12px">${T('לא עכשיו')}</button>`}`, m => {
        if (inv.stake && P.balance < inv.stake) { Sound.play('error'); Haptic.play('error'); }
                const answer = async yes => {
          Social.invite = null; closeModal();
          let code = null;
          try { code = await rpc('beam_invite_answer', { p_id: P.id, p_secret: playerKey(), p_invite: inv.id, p_accept: yes }); } catch (e) { /* the room tells */ }
          if (yes) { G = null; hideWin(); clearInterval(timerInt); joinDuel(code || inv.code, true); }
        };
        m.querySelector('#invYes').onclick = () => answer(true);
        m.querySelector('#invNo').onclick = () => answer(false);
      }, true);
  }
  // the friend we called said no, or never answered
  if (D && D.invited && D.st && D.st.status === 'waiting' && d.sent && d.sent.code === D.code && (d.sent.status === 'declined' || d.sent.status === 'expired')) {
    toast(d.sent.status === 'declined' ? T`${D.invited}: לא עכשיו` : T`אין תשובה מ-${D.invited}`);
    leaveDuel(); openFriends();
  }
}
/* the way in from the home screen; someone who has just picked a name for this is offered the link to send straight away */
function friendsEntry() {
  const fresh = !P.name;
  withName(() => { openFriends(); if (fresh) shareFriendLink(); });
}
/* the friends screen: find, approve, list, remove. The duel tab keeps only the friends who are online right now. */
function openPals() { show('pals'); $('optPresence').checked = P.hidePresence !== true; renderFriends(); socialStart(); }
function openFriends() {
  show('friends');
  const w = P.duel || { w: 0, l: 0, d: 0 };
  $('duelRec').innerHTML = `<div>${w.w}<small>${T('ניצחונות')}</small></div><div>${w.l}<small>${T('הפסדים')}</small></div><div>${w.d}<small>${T('תיקו')}</small></div>`;
  renderFriends(); socialStart();
}
/* adding a friend without a link: by searching a player's name, or from the last few duel opponents. The other side approves the request. */
const personRow = (f, i, kind) => {
  const known = f.rel === 'ok' || isFriend(f.name) ? T('כבר חברים') : f.rel === 'out' ? T('ממתין לאישור') : '';
  return `<li><span class="av"><img alt="" src="${avatarSrc(f.avatar)}"></span><span class="who"><b>${esc(f.name || '…')}</b>${known ? `<small>${known}</small>` : ''}</span>${known ? '' : `<button class="go" data-${kind}="${i}">${f.rel === 'in' ? T('אישור') : T('הוספה')}</button>`}</li>`;
};
async function askFriend(f, again) {
  let res = null;
  try { res = await rpc('beam_friend_request', { p_id: P.id, p_secret: playerKey(), p_name: P.name, p_friend: f.id }); } catch (e) { /* told below */ }
  toast(res === 'friends' ? T('אתם חברים עכשיו') : res === 'sent' ? T('בקשת החברות נשלחה') : res === 'full' ? T('יש יותר מדי בקשות פתוחות') : T('אין חיבור כרגע. נסו שוב מאוחר יותר.'));
  if (res === 'sent') f.rel = 'out'; if (res === 'friends') f.rel = 'ok';
  again(); pulse();
}
let frHits = null;
function renderFound() {
  const box = $('frFound');
  if (!frHits) { box.innerHTML = ''; return; }
  box.innerHTML = frHits.length ? frHits.map((f, i) => personRow(f, i, 'hit')).join('') : `<p class="frnote">${T('לא נמצא שחקן בשם הזה')}</p>`;
  for (const b of box.querySelectorAll('[data-hit]')) b.onclick = () => { b.disabled = true; askFriend(frHits[+b.dataset.hit], renderFound); };
}
async function findFriends() {
  const q = $('frQ').value.trim();
  if (q.length < 2) { frHits = null; renderFound(); toast(T('כתבו לפחות שתי אותיות')); return; }
  $('frFound').innerHTML = `<p class="frnote">${T('מחפשים…')}</p>`;
  try { frHits = await rpc('beam_friend_search', { p_id: P.id, p_secret: playerKey(), p_name: P.name, p_q: q }) || []; }
  catch (e) { frHits = null; $('frFound').innerHTML = ''; toast(T('אין חיבור כרגע. נסו שוב מאוחר יותר.')); return; }
  renderFound();
}
function renderRecent() {
  const rec = (P.recent || []).filter(f => f.id && f.name && !isFriend(f.name));
  $('frRecentBox').hidden = !rec.length;
  $('frRecent').innerHTML = rec.map((f, i) => personRow(f, i, 'rec')).join('');
  for (const b of $('frRecent').querySelectorAll('[data-rec]')) b.onclick = () => { b.disabled = true; askFriend(rec[+b.dataset.rec], () => { save(false); renderRecent(); }); };
}
/* remember who we just played, so they can be added later from the duel tab */
async function rememberOpponent(code) {
  let o = null;
  try { o = await rpc('beam_duel_opponent', { p_id: P.id, p_secret: playerKey(), p_code: code }); } catch (e) { return; }
  if (!o || !o.id || !o.name) return;
  P.recent = [{ id: o.id, name: o.name, avatar: o.avatar || '' }, ...(P.recent || []).filter(f => f.id !== o.id)].slice(0, 5);
  save(false);
}
/* ---- watching a friend play ----
   While a board is open, the game tells the server what is on it: the grid, the mirrors, the score so far. A friend who opens
   the watch screen reads that every second and draws it. The daily challenge is never shown, because it is a contest for the
   same board; the server also refuses to show a board to the opponent of a duel in progress. */
let liveT = null, liveBeat = null, liveOn = false;
function livePack() {
  if (!G || timedMode() || P.hidePresence === true || $('game').hidden) return null;
  const st = G.lastSt || {};
  return { mode: G.mode, n: G.mode === 'level' ? G.idx + 1 : G.round || 1, rows: G.lv.rows, lasers: G.lv.lasers, max: G.lv.max, mirrors: G.mirrors, locked: [...G.locked], lit: st.lit || 0, total: st.total || 0, moves: G.moves, done: !!G.done };
}
function liveSend() {
  clearTimeout(liveT); liveT = null;
  const pack = livePack();
  if (!pack) return liveStop();
  liveOn = true; rpc('beam_live_set', { p_id: P.id, p_secret: playerKey(), p_live: pack }).catch(() => {});
  if (!liveBeat) liveBeat = setInterval(() => { if (!document.hidden) liveSend(); }, 6000);       // keeps the board marked as live while the player thinks
}
function liveSoon() { if (!liveT && Social.data && Social.data.friends.some(f => f.rel === 'ok')) liveT = setTimeout(liveSend, 350); }   // nobody to watch, nothing to send
function liveStop() {
  clearTimeout(liveT); liveT = null; clearInterval(liveBeat); liveBeat = null;
  if (liveOn) { liveOn = false; rpc('beam_live_set', { p_id: P.id, p_secret: playerKey(), p_live: null }).catch(() => {}); }
}
let W = null;   // the friend being watched: { f, timer, sig, misses }
function watchStop() { if (W) { clearInterval(W.timer); W = null; } }
function watchFriend(f) {
  watchStop(); W = { f, sig: '', misses: 0 };
  show('watch'); $('watchTitle').textContent = f.name || ''; $('watchSub').textContent = ' '; $('watchStars').textContent = $('watchMoves').textContent = ''; $('watchBoard').innerHTML = ''; $('watchNote').textContent = T('מתחברים…');
  const tick = async () => {
    const w = W; let r = null;
    try { r = await rpc('beam_watch', { p_id: P.id, p_secret: playerKey(), p_friend: f.id }); } catch (e) { r = undefined; }
    if (W !== w) return;
    if (!r || r.gone) {
      if (r && r.gone === 'rival') { toast(T('אי אפשר לצפות ביריב באמצע דו-קרב')); return openFriends(); }
      if (r === undefined && ++w.misses < 5) return;                 // a dropped answer or two is not the end of the show
      $('watchNote').textContent = T`${f.name} לא משחק כרגע`; document.querySelector('.wlive').hidden = true; w.sig = '';
      return;
    }
    w.misses = 0; document.querySelector('.wlive').hidden = false;
    const sig = JSON.stringify(r);
    if (sig === w.sig) return;
    w.sig = sig;
    const lv = { rows: r.rows, lasers: r.lasers, max: r.max };
    draw($('watchBoard'), lv, r.mirrors || {}, null, !!r.done, new Set(r.locked || []), null);
    $('watchSub').textContent = r.mode === 'duel' ? T`דו-קרב · סיבוב ${r.n}` : T`שלב ${r.n}`;
    $('watchStars').textContent = `★ ${r.lit}/${r.total}`; $('watchMoves').textContent = T`מהלכים: ${r.moves}`;
    $('watchNote').textContent = r.done ? T`${f.name} פתר את הלוח!` : '';
    if (r.done) Sound.play('win', 1);
  };
  tick(); W.timer = setInterval(tick, 1000);
}
function renderFriends() {
  renderRecent();
  const d = Social.data, list = $('frList'), duel = $('duelList'), asksBox = $('frAsksBox');
  if (!d) { $('frSub').textContent = $('palsSub').textContent = T('טוען…'); list.innerHTML = duel.innerHTML = ''; asksBox.hidden = true; list.dataset.sig = ''; return; }
  const ok = d.friends.filter(f => f.rel === 'ok'), asks = d.friends.filter(f => f.rel !== 'ok'), on = ok.filter(f => f.online);
  $('frSub').textContent = ok.length ? T`מחוברים עכשיו: ${on.length}` : ' '; $('palsSub').textContent = ok.length ? T`מחוברים עכשיו: ${on.length}` : ' ';
  const sig = JSON.stringify(d.friends);
  if (list.dataset.sig === sig) return;
  list.dataset.sig = sig;
  const row = (f, gift) => {
    const i = d.friends.indexOf(f);
    const sub = f.rel === 'in' ? T('בקשת חברות') : f.rel === 'out' ? T('ממתין לאישור') : !f.online ? T('לא מחובר') : f.state === 'duel' ? T('בדו-קרב') : f.state === 'level' ? T('משחק כרגע') : T('מחובר');
    const act = f.rel === 'in' ? `<button class="go" data-a="yes" data-i="${i}">${T('אישור')}</button><button data-a="no" data-i="${i}">${T('דחייה')}</button>`
      : f.rel === 'ok' ? `<button class="go" data-a="invite" data-i="${i}"${f.online && f.state !== 'duel' ? '' : ' disabled'}>${T('הזמן לדו-קרב')}</button><button class="more" data-a="menu" data-i="${i}" aria-label="${T('עוד פעולות')}">⋯</button>`
      : `<button class="x" data-a="remove" data-i="${i}" aria-label="${T('ביטול הבקשה')}">✕</button>`;
    return `<li><span class="av"><img alt="" src="${avatarSrc(f.avatar)}"><span class="dot${f.online ? ' on' : ''}"></span></span><span class="who"><b>${esc(f.name || '…')}</b><small>${sub}</small></span>${act}</li>`;
  };
  asksBox.hidden = !asks.length; $('frAsks').innerHTML = asks.map(f => row(f)).join('');
  list.innerHTML = ok.length ? ok.map(f => row(f, true)).join('') : `<p class="frempty"><img alt="" src="${POSE.sleep}">${T('עוד אין לכם חברים כאן. שלחו קישור לחבר, או חפשו שחקן לפי שם.')}</p>`;
  duel.innerHTML = ok.length ? [...on, ...ok.filter(f => !f.online)].map(f => row(f)).join('') : `<p class="frnote">${T('עוד אין לכם חברים כאן. מוסיפים חברים מהכפתור "חברים" במסך הבית.')}</p>`;   // the duel tab only lists friends, online ones first; adding lives on the friends screen
  for (const b of document.querySelectorAll('#frList button, #frAsks button, #duelList button')) b.onclick = () => friendAction(b.dataset.a, d.friends[+b.dataset.i]);
}
/* points from one friend to another: taken from the sender's wallet, and waiting on the server until the friend's game collects them */
const GIFT_SIZES = [100, 250, 500, 1000];
function giftFriend(f) {
  let pick = GIFT_SIZES.find(n => n <= P.balance) ? Math.max(...GIFT_SIZES.filter(n => n <= P.balance && n <= 250)) : 0;
  if (!isFinite(pick) || pick < 0) pick = GIFT_SIZES[0];
  modal(`<img class="bug" alt="" src="media/ui/gift.webp" style="width:110px;height:110px">
    <h3>${T`מתנה ל-${esc(f.name)}`}</h3>
    <p>${T`הנקודות יורדות מהארנק שלכם. יש לכם ${fmt(P.balance)}.`}</p>
    <div class="giftsizes">${GIFT_SIZES.map(n => `<button data-n="${n}"${n > P.balance ? ' disabled' : ''}${n === pick ? ' class="on"' : ''}>${fmt(n)}</button>`).join('')}</div>
    <button class="btn green" id="giftGo"${pick > P.balance || !pick ? ' disabled' : ''}>${T('שליחה')}</button>
    <button class="btn ghosty" id="giftNo" style="margin-top:12px">${T('ביטול')}</button>`, m => {
      for (const b of m.querySelectorAll('.giftsizes button')) b.onclick = () => { pick = +b.dataset.n; for (const x of m.querySelectorAll('.giftsizes button')) x.classList.toggle('on', x === b); m.querySelector('#giftGo').disabled = false; Sound.play('tap'); };
      m.querySelector('#giftNo').onclick = closeModal;
      m.querySelector('#giftGo').onclick = async () => {
        if (!pick || pick > P.balance) return;
        m.querySelector('#giftGo').disabled = true;
        let res = null;
        try { res = await rpc('beam_gift_send', { p_id: P.id, p_secret: playerKey(), p_name: P.name, p_friend: f.id, p_amount: pick }); } catch (e) { /* told below */ }
        closeModal();
        if (res === 'ok') { P.balance -= pick; save(false); cloudSoon(); renderHome(); hudSync(); Sound.play('purchase'); Haptic.play('win'); toast(T`המתנה נשלחה ל-${f.name}`, `-${fmt(pick)}`); }
        else toast(res === 'limit' ? T('הגעתם למכסת המתנות להיום. נסו שוב מחר.') : res === 'nofriend' ? T('אפשר לשלוח מתנות רק לחברים') : T('אין חיבור כרגע. נסו שוב מאוחר יותר.'));
      };
    });
}
/* everything else one can do with a friend sits behind the three dots, so the row keeps room for the name */
function friendMenu(f) {
  const playing = f.online && (f.state === 'level' || f.state === 'duel');
  const sub = !f.online ? T('לא מחובר') : f.state === 'duel' ? T('בדו-קרב') : f.state === 'level' ? T('משחק כרגע') : T('מחובר');
  const item = (a, ic, bg, title, note, off) => `<button class="fact${a === 'remove' ? ' red' : ''}" data-m="${a}"${off ? ' disabled' : ''}><span class="ic" style="background:${bg}">${ic}</span><span><b>${title}</b>${note ? `<small>${note}</small>` : ''}</span></button>`;
  modal(`<div class="fhead"><span class="av"><img alt="" src="${avatarSrc(f.avatar)}"><span class="dot${f.online ? ' on' : ''}"></span></span><div><b>${esc(f.name || '')}</b><small>${sub}</small></div></div>` +
    (playing ? item('watch', '<img alt="" src="media/ui/eye.webp">', '#EFE6FF', T('צפייה במשחק'), T('לראות את הלוח בזמן אמת')) : '') +
    item('gift', '<img alt="" src="media/ui/gift.webp">', '#FFE7C2', T('שליחת מתנה'), T('נקודות מהארנק שלכם')) +
    item('invite', '<img alt="" src="media/ui/duel.webp">', '#FFE3B8', T('הזמנה לדו-קרב'), f.online && f.state !== 'duel' ? T('בוחרים רמת קושי וסכום') : T('אפשר כשהחבר מחובר ופנוי'), !(f.online && f.state !== 'duel')) +
    item('remove', '<img alt="" src="media/ui/unfriend.webp">', '#FFE1E5', T('הסרה מהחברים')), m => {
      for (const b of m.querySelectorAll('[data-m]')) b.onclick = () => { closeModal(); friendAction(b.dataset.m, f); };
    });
}
async function friendAction(a, f) {
  const base = { p_id: P.id, p_secret: playerKey() };
  if (a === 'invite') return chooseStake(stake => inviteFriend(f, stake));
  if (a === 'gift') return giftFriend(f);
  if (a === 'watch') return watchFriend(f);
  if (a === 'menu') return friendMenu(f);
  if (a === 'remove') {
    modal(`<h3>${T`להסיר את ${esc(f.name)} מהחברים?`}</h3>
      <button class="btn danger" id="rmGo">${T('הסרה')}</button>
      <button class="btn ghosty" id="rmNo" style="margin-top:12px">${T('ביטול')}</button>`, m => {
        m.querySelector('#rmNo').onclick = closeModal;
        m.querySelector('#rmGo').onclick = async () => { closeModal(); try { await rpc('beam_friend_remove', { ...base, p_friend: f.id }); } catch (e) { toast(T('אין חיבור כרגע. נסו שוב מאוחר יותר.')); } pulse(); };
      });
    return;
  }
  try { await rpc('beam_friend_answer', { ...base, p_friend: f.id, p_accept: a === 'yes' }); if (a === 'yes') toast(T('אתם חברים עכשיו')); }
  catch (e) { toast(T('אין חיבור כרגע. נסו שוב מאוחר יותר.')); }
  pulse();
}
/* open a room and ring the friend; they get a pop-up wherever they are in the game */
async function inviteFriend(f, stake = 0) {
  show('duel'); $('duelSub').textContent = ' '; $('duelBox').innerHTML = `<p>${T('פותחים חדר…')}</p>`;
  let code = null, res = null;
  try {
    code = await rpc('beam_duel_create', { p_id: P.id, p_secret: playerKey(), p_name: P.name, p_gen: DUEL_BASE + duelDiff, p_stake: stake });
    if (code) res = await rpc('beam_invite_send', { p_id: P.id, p_secret: playerKey(), p_friend: f.id, p_code: code });
  } catch (e) { /* handled below */ }
  if (res !== 'ok') {
    if (code) rpc('beam_duel_sync', { p_code: code, p_id: P.id, p_secret: playerKey(), p_leave: true }).catch(() => {});
    toast(res === 'offline' ? T`${f.name} כבר לא מחובר` : T('אין חיבור כרגע. נסו שוב מאוחר יותר.'));
    openFriends(); return;
  }
  startDuel(code); D.invited = f.name; pulse();
}
const friendLink = () => (/^https?:$/.test(location.protocol) ? location.origin + location.pathname : SITE_URL) + '#friend=' + Social.data.fcode;
async function shareFriendLink() {
  if (!Social.data) pulse();
  for (let i = 0; i < 40 && !Social.data; i++) await wait(100);        // the first answer from the server is on its way
  if (!Social.data) { toast(T('אין חיבור כרגע. נסו שוב מאוחר יותר.')); return; }
  shareSheet(T('שליחת קישור לחבר'), T('בואו נהיה חברים ב-BEAM ונשחק דו-קרב!'), friendLink());
}
/* a friend link was opened: sharing it was the consent, so the two become friends straight away */
async function acceptFriendLink(fcode) {
  let res = null;
  try { res = await rpc('beam_friend_link', { p_id: P.id, p_secret: playerKey(), p_name: P.name, p_fcode: fcode }); } catch (e) { /* told below */ }
  toast(res === 'ok' ? T('אתם חברים עכשיו') : res === 'self' ? T('זה הקישור שלכם. שלחו אותו לחבר.') : res === 'missing' ? T('הקישור הזה כבר לא פעיל') : T('אין חיבור כרגע. נסו שוב מאוחר יותר.'));
  openPals();
}
$('frBack').onclick = goHome; $('watchBack').onclick = () => { watchStop(); openPals(); };
$('frGo').onclick = () => withName(findFriends); $('frQ').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('frQ').blur(); withName(findFriends); } });
$('gardenBack').onclick = goHome; $('gTabOut').onclick = () => gGo('out'); $('gTabIn').onclick = () => gGo('in'); $('gardenBtn').onclick = openGarden;
$('shopBack').onclick = goHome; $('shopBtn').onclick = openShop; $('homePoints').onclick = openShop;
$('helpBug').src = POSE.point;
$('friendsBtn').onclick = () => withName(openPals); $('palsBack').onclick = goHome;
$('duelLink').onclick = () => withName(() => chooseStake(createDuel));
$('duelCode').onclick = () => modal(`<img class="bug" alt="" src="${POSE.power}"><h3>${T('קיבלתם קוד מחבר?')}</h3>
  <div class="dueljoin"><input id="duelCodeIn" maxlength="5" autocomplete="off" autocapitalize="characters" aria-label="${T('קוד חדר')}" placeholder="ABCDE"><button class="btn blue" id="duelJoinBtn">${T('הצטרפות')}</button></div>`, m => {
    const go = () => { const c = m.querySelector('#duelCodeIn').value.trim().toUpperCase(); if (c.length < 5) { m.querySelector('#duelCodeIn').focus(); return; } closeModal(); withName(() => joinDuel(c)); };
    m.querySelector('#duelJoinBtn').onclick = go;
    m.querySelector('#duelCodeIn').addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  });
$('chapBtn').onclick = () => { Sound.play('tap'); openChapters(); };
$('allchBack').onclick = goHome;
$('bonusBtn').onclick = () => { if (P.streak.last !== todayStr()) return dailyBonus(); Sound.play('tap'); toast(T('הבונוס של היום כבר נאסף. חזרו מחר!')); };
for (const b of $('tabbar').children) b.onclick = () => {
  if (b.classList.contains('on') && !(b.dataset.tab === 'home' && $('home').hidden)) return;
  Sound.play('tap');
  ({ shop: openShop, leader: () => openLeaderboard('all'), home: goHome, duel: openFriends, garden: openGarden })[b.dataset.tab]();
};
$('frAdd').onclick = shareFriendLink;
$('optPresence').onchange = e => { P.hidePresence = !e.target.checked; save(false); pulse(); };

/* ================= sharing ================= */
function shareDaily(d) {
  if (!d) return;
  const t = todayStr().split('-').reverse().join('.');
  const link = /^https?:$/.test(location.protocol) ? location.origin + location.pathname : SITE_URL;
  const text = T`BEAM · האתגר היומי ${t}\n${fmt(d.score)} נקודות · ${movesText(d.moves)} · ${Math.floor(d.time / 60)}:${String(d.time % 60).padStart(2, '0')}\nמצליחים לעקוף אותי?`;
  const copied = () => toast(T('התוצאה הועתקה, אפשר להדביק ולשלוח'));
  const copy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text + '\n' + link).then(copied, () => toast(T('לא הצלחנו להעתיק את התוצאה')));
    else {
      const ta = document.createElement('textarea'); ta.value = text + '\n' + link; ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); copied(); } catch (e) { toast(T('לא הצלחנו להעתיק את התוצאה')); }
      ta.remove();
    }
  };
  // phones open their own share sheet; everywhere else the result goes to the clipboard
  if (navigator.share) navigator.share({ text, url: link }).catch(e => { if (!e || e.name !== 'AbortError') copy(); });
  else copy();
}

/* ================= leaderboard ================= */
/* podium geometry on the 804-unit canvas (top of the podium = 0); measured from the design */
const POD_GEO = [
  { pod: [250, 245, 304, 300], fr: [314, 118, 180, 198.9], who: [324, 128, 160, 160], medal: [345, 16.7, 120, 124], nm: [404, 345, 268, 52], pl: [315, 382.5, 180, 47, 35, 34], cast: [336, 270, 136, 40], sh: [235, 522, 340, 50] },
  { pod: [495, 303, 275, 226], fr: [570, 190.4, 148, 167.6], who: [582, 202.4, 124, 124], medal: [609, 93.9, 73, 104], nm: [636, 409, 190, 39], pl: [556, 437, 160, 42, 32, 31], cast: [592, 320.4, 106, 36], sh: [505, 514, 275, 46] },
  { pod: [18, 332.6, 291, 207.4], fr: [87, 218, 146, 154.7], who: [99, 231, 122, 122], medal: [123, 126, 73, 106], nm: [163.5, 425, 170, 39], pl: [83.5, 453, 160, 42, 33, 32], cast: [102, 335, 106, 36], sh: [10, 514, 300, 46] },
];
const POD_SPARKS = [[276, 121, 28], [490, 128, 14], [58, 292, 20], [292, 192, 12]];
/* the header and podium scale as single pictures: one unit = width / 804 */
const lbRO = typeof ResizeObserver === 'function' ? new ResizeObserver(es => es.forEach(e => e.target.style.setProperty('--u', (e.target.clientWidth / 804) + 'px'))) : null;
function lbScale(el) { if (!el || el.dataset.ro) return; el.dataset.ro = 1; el.style.setProperty('--u', ((el.clientWidth || 393) / 804) + 'px'); if (lbRO) lbRO.observe(el); }

let lbTab = 'all';
async function openLeaderboard(tab) {
  if (tab) lbTab = tab;
  show('leader');
  $('leader').classList.toggle('he', LANG === 'he'); lbScale(document.querySelector('#leader .lbh'));
  if (!P.name) askName(() => openLeaderboard());
  $('tabAll').setAttribute('aria-selected', lbTab === 'all');
  $('tabDay').setAttribute('aria-selected', lbTab === 'day'); $('tabWeek').setAttribute('aria-selected', lbTab === 'week');
  const list = $('lbList');
  list.innerHTML = T('<li class="empty">טוען…</li>');
  $('lbSub').textContent = lbTab === 'all' ? T('כל הנקודות שנצברו במשחק') : lbTab === 'week' ? T('לוח אחד קשה לכל השבוע. כולם מקבלים את אותו לוח') : T`האתגר של ${todayStr().split('-').reverse().join('.')}`;
  $('lbSub').classList.toggle('long', $('lbSub').textContent.length > 30);
  if (P.name) { await publishScore(); if (lbTab === 'week') await publishWeekly(); }
  const asked = lbTab, { online, rows } = await readBoard(lbTab);
  if (asked !== lbTab || $('leader').hidden) return;   // the player moved on while the table was loading
  const val = r => lbTab === 'all' ? r.total : r.score;
  $('lbOffline').hidden = online;
  list.innerHTML = '';
  if (!rows.length) { list.innerHTML = `<li class="empty">${lbTab === 'all' ? T('עוד אין שחקנים בטבלה. היו הראשונים!') : (lbTab === 'week' ? T('אף אחד עוד לא פתר את אתגר השבוע.') : T('אף אחד עוד לא פתר את האתגר של היום.'))}</li>`; return; }
  const row = (r, n) => {
    const li = document.createElement('li');
    if (r.id === P.id) li.className = 'mine';
    const rk = r.rank || n + 1, me = r.id === P.id;
    li.innerHTML = `${rk <= 3 ? `<img class="badge" alt="${rk}" src="media/lb/badge${rk}.webp">` : `<span class="pos">${rk}</span>`}<span class="nm"><span></span><small></small></span><span class="sc"><span></span><small class="st"><img alt="" src="media/lb/star.webp"><i></i></small></span><span class="av"><img alt="" src="${avatarSrc(me ? lookOf('char') : r.avatar)}"></span>`;
    li.querySelector('.nm span').textContent = r.name + (r.id === P.id ? T(' (אתם)') : '');
    li.querySelector('.nm small').textContent = lbTab === 'all' ? (r.levels != null ? T`★ ${r.stars || 0} · ${r.levels} שלבים · ${r.clean || 0} בלי עזרה`.replace(/^★ \d+ · /, '') : T`${r.stars || 0} כוכבים, ${rankOf(r.total).name}`) : `${movesText(r.moves)}, ${Math.floor(r.time / 60)}:${String(r.time % 60).padStart(2, '0')}`;
    li.querySelector('.sc > span').textContent = fmt(val(r));
    if (lbTab === 'all' && r.stars != null) li.querySelector('.st i').textContent = r.stars; else li.querySelector('.st').remove();
    return li;
  };
  const top = rows.length >= 3 && rows.slice(0, 3).every((r, n) => (r.rank || n + 1) === n + 1) ? rows.slice(0, 3) : [];
  if (top.length) {
    const pod = document.createElement('li'); pod.className = 'pod lbc';
    const at = (x, y, w, h) => `style="--x:${x};--y:${y};--w:${w};--h:${h}"`;
    const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    let h = `<div class="glow" ${at(0, 60, 804, 420)}></div><img class="stage" alt="" ${at(4, 464, 800, 158)} src="media/lb/stage.webp">`;
    h += POD_SPARKS.map(([x, y, w]) => `<i class="sp" ${at(x, y, w, w)}></i>`).join('');
    [0, 1, 2].forEach(k => {
      const g = POD_GEO[k], r = top[k], me = r.id === P.id;
      const nmH = Math.round(g.nm[3] * 1.3);
      h += `<i class="sh" ${at(...g.sh)}></i>`
        + `<img class="pd${k ? '' : ' g'}" alt="" ${at(...g.pod)} src="media/lb/pod${k + 1}.webp">`
        + (g.orn ? `<img class="orn" alt="" ${at(g.orn[0] - g.orn[2] / 2, g.orn[1] - g.orn[2] / g.orn[3] / 2, g.orn[2], g.orn[2] / g.orn[3])} src="media/lb/${g.orn[4]}.webp">` : '')
        + `<i class="cast" ${at(...g.cast)}></i>`
        + `<img class="who${me ? ' mine' : ''}" alt="" ${at(...g.who)} src="${avatarSrc(me ? lookOf('char') : r.avatar)}">`
        + `<img class="fr" alt="" ${at(...g.fr)} src="media/lb/frame${k + 1}.webp">`
        + `<img class="medal" alt="" ${at(...g.medal)} src="media/lb/medal${k + 1}.webp">`
        + `<span class="nm" style="--x:${g.nm[0] - g.nm[2] / 2};--y:${g.nm[1] - nmH / 2};--w:${g.nm[2]};--h:${nmH};font-size:calc(${g.nm[3]} * var(--u));line-height:calc(${nmH} * var(--u))">${esc(r.name)}</span>`
        + `<span class="pl" style="--x:${g.pl[0]};--y:${g.pl[1]};--w:${g.pl[2]};--h:${g.pl[3]};--s:${g.pl[5]};font-size:calc(${g.pl[4]} * var(--u))"><img alt="" src="media/lb/star.webp"><span>${fmt(val(r))}</span></span>`;
    });
    pod.innerHTML = h;
    list.appendChild(pod); lbScale(pod);
  }
  rows.filter((r, n) => (r.rank || n + 1) <= 25 || r.id === P.id).forEach((r, n) => { if (n >= top.length || r.id === P.id) list.appendChild(row(r, n)); });
}

/* ================= achievements screen ================= */
function openAchievements() {
  $('achSub').textContent = T`${P.ach.length} מתוך ${ACH.length} הושגו`;
  const box = $('achList'); box.innerHTML = '';
  for (const a of ACH) {
    const got = P.ach.includes(a.id);
    const d = document.createElement('div'); d.className = 'ach' + (got ? ' got' : '');
    d.innerHTML = `<div class="ic">${got ? `<svg viewBox="0 0 1 1"><path d="${starPath(.5, .52, .45, .2)}" fill="#fff"/></svg>` : ICON_LOCK}</div>
      <div><h3></h3><p></p></div><div class="rw">${ICON_POINTS}<span>${fmt(a.reward)}</span></div>`;
    d.querySelector('h3').textContent = a.name; d.querySelector('p').textContent = a.desc;
    box.appendChild(d);
  }
  show('achievements');
}

/* ================= ads & purchases ================= */
/* PAYMENTS: replace with the real store SDK (App Store / Google Play / web checkout) when publishing. */
const PAYMENTS = {
  live: false,                                            // true once a real checkout stands behind buy()
  buy(product) {
    return new Promise(resolve => {
      modal(`<h3>${T`אישור רכישה`}</h3>
        <p>${T`הסרת פרסומות לתמיד בתשלום חד-פעמי של ${product.price}.`}</p>
        <p class="demo-note">${T`גרסת הדגמה: לא יבוצע חיוב. במשחק המפורסם כאן ייפתח מסך התשלום של החנות.`}</p>
        <button class="btn orange" id="buyOk" style="margin-top:12px">${T`רכישה ב-${product.price}`}</button>
        <button class="btn ghosty" id="buyCancel" style="margin-top:12px">${T`ביטול`}</button>`, m => {
          m.querySelector('#buyOk').onclick = () => { closeModal(); resolve(true); };
          m.querySelector('#buyCancel').onclick = () => { closeModal(); resolve(false); };
        }, true);
    });
  },
  async restore() { return !!P.purchases && P.purchases.includes(REMOVE_ADS.id); },
};
/* every purchase is reported to the server, so the owner can see who bought what and when */
const agorot = price => Math.round(parseFloat(String(price).replace(/[^\d.]/g, '')) * 100) || 0;   // '14.90 ₪' -> 1490
const logPurchase = (item, price, money) => { rpc('beam_purchase_log', { p_id: P.id, p_secret: playerKey(), p_item: item, p_price: price, p_money: money }).catch(() => {}); };
async function buyRemoveAds() {
  if (P.adFree) return;
  if (!PAYMENTS.live) return soonModal();
  if (!await PAYMENTS.buy(REMOVE_ADS)) return;
  P.adFree = true; P.purchases = [...new Set([...(P.purchases || []), REMOVE_ADS.id])]; logPurchase('remove_ads', agorot(REMOVE_ADS.price), true);
  gain(REMOVE_ADS.bonus, false); save(); openSettings(); Sound.play('purchase'); setTimeout(() => Sound.play('win', 0), 400);
  modal(`<img class="bug" alt="" src="${POSE.thumbs}">
    <h3>${T`תודה על התמיכה!`}</h3>
    <p>${T`הפרסומות הוסרו, וקיבלתם ${fmt(REMOVE_ADS.bonus)} נקודות לקניות במתנה.`}</p>
    <button class="btn green" id="thanksOk">${T`יופי`}</button>`, m => { m.querySelector('#thanksOk').onclick = closeModal; });
}
async function restorePurchases() {
  if (await PAYMENTS.restore()) { P.adFree = true; save(false); openSettings(); toast(T('הרכישה שוחזרה')); }
  else toast(T('לא נמצאו רכישות קודמות'));
}
function maybeInterstitial(next) {
  if (P.adFree || !ADS_LIVE) return next();
  P.adCount = (P.adCount || 0) + 1; save(false);
  if (P.adCount % AD_EVERY !== 0) return next();
  let left = 5, iv;
  modal(`<h3>${T`פרסומת`}</h3>
    <div class="adbox">${T`מקום לפרסומת בין שלבים`}</div>
    <button class="btn ghosty" id="adClose" disabled>${T`אפשר לסגור בעוד`} <span id="adLeft">5</span></button>
    <button class="linkbtn" id="adRemove" style="color:var(--purple)">${T`הסרת פרסומות ב-${REMOVE_ADS.price}`}</button>`, m => {
      const close = m.querySelector('#adClose');
      iv = setInterval(() => {
        left--;
        if (left > 0) m.querySelector('#adLeft').textContent = left;
        else { clearInterval(iv); close.disabled = false; close.textContent = T('המשך למשחק'); close.className = 'btn green'; }
      }, 1000);
      close.onclick = () => { clearInterval(iv); closeModal(); next(); };
      m.querySelector('#adRemove').onclick = () => { clearInterval(iv); closeModal(); openSettings(); };
    }, true);
}

/* ================= settings ================= */
function openSettings() {
  const card = $('premiumCard');
  if (P.adFree) {
    card.innerHTML = `<div class="owned">${ICON_STAR}<span>${T`המשחק בלי פרסומות`}</span></div><p style="margin:8px 0 0">${T`תודה שתמכתם בגחלילית!`}</p>`;
  } else {
    card.innerHTML = `<h3>${T`הסרת פרסומות`}</h3><p>${T`תשלום חד-פעמי, לתמיד.`}</p>
      <ul class="perks"><li>${T`בלי באנרים במסך הבית`}</li><li>${T`בלי פרסומות בין שלבים`}</li><li>${T`מתנה: ${fmt(REMOVE_ADS.bonus)} נקודות לקניות`}</li></ul>
      <button class="btn white" id="buyAds">${T`הסרת פרסומות ב-${REMOVE_ADS.price}`}</button>
      <div style="text-align:center"><button class="linkbtn" id="restoreBtn">${T`שחזור רכישות`}</button></div>`;
    card.querySelector('#buyAds').onclick = buyRemoveAds;
    card.querySelector('#restoreBtn').onclick = restorePurchases;
  }
  $('setName').textContent = P.name ? T`כרגע: ${P.name}` : T('עוד לא בחרתם שם.'); $('setLeave').hidden = !P.name;
  renderAccount();
  show('settings');
}
function confirmReset() {
  modal(`<h3>${T`לאפס את ההתקדמות?`}</h3>
    <p>${T`כל השלבים, הכוכבים, הנקודות וההישגים יימחקו. אי אפשר לבטל את זה.`}</p>
    <button class="btn danger" id="resetYes">${T`כן, לאפס`}</button>
    <button class="btn ghosty" id="resetNo" style="margin-top:12px">${T`ביטול`}</button>`, m => {
      m.querySelector('#resetNo').onclick = closeModal;
      m.querySelector('#resetYes').onclick = () => {
        const keep = { byId: true, v2: true, tut: 2, auth: P.auth, id: P.id, key: P.key, viaAccount: P.viaAccount, avatar: P.avatar, own: P.own, garden: P.garden, beam: P.beam, board: P.board, fx: P.fx, social: P.social, hidePresence: P.hidePresence, name: P.name, adFree: P.adFree, purchases: P.purchases, streak: P.streak, sfx: P.sfx, music: P.music, musicStyle: P.musicStyle, haptic: P.haptic };
        P = { ...newProfile(), ...keep };
        save(); closeModal(); goHome(); toast(T('ההתקדמות אופסה'));
      };
    });
}

/* ================= help ================= */
const DEMO = { rows: [".T.", "...", "..."], lasers: [['L', 2]], max: 1 };
let demoMir = {};
function renderDemo() {
  const st = draw($('demoBoard'), DEMO, demoMir, (x, y) => {
    const k = key(x, y), m = demoMir[k];
    if (!m) demoMir = { [k]: '/' }; else if (m === '/') demoMir[k] = '\\'; else delete demoMir[k];
    renderDemo();
  }, false);
  if (st.allLit) draw($('demoBoard'), DEMO, demoMir, null, true);
  $('demoStatus').textContent = st.allLit ? T('בדיוק ככה!') : Object.keys(demoMir).length ? T('כמעט. נסו לסובב או להזיז.') : T('הקישו על משבצת.');
}
function renderIcons() {
  const one = (id, fn) => { const s = $(id); s.innerHTML = ''; fn(el('g', {}, s)); };
  one('icMirror', g => { tile(g, 0, 0, 'var(--t-blue)'); mirror(g, 0, 0, '/'); });
  one('icStar', g => { tile(g, 0, 0, 'var(--t-green)'); star(g, .5, .47, true); });
  one('icWall', g => wallTile(g, 0, 0));
  one('icBomb', g => { tile(g, 0, 0, 'var(--t-orange)'); bomb(g, .47, .5, false); });
  one('icFixed', g => { tile(g, 0, 0, 'var(--t-purple)'); fixedMirror(g, 0, 0, '\\'); });
  one('icSplit', g => { tile(g, 0, 0, 'var(--t-blue)'); splitter(g, 0, 0, '/'); });
  one('icTwin', g => { tile(g, 0, 0, 'var(--t-green)'); firefly(g, .28, .55, 1, 0, .48, null); firefly(g, .72, .45, -1, 0, .48, null); });
  one('icCount', g => { tile(g, 0, 0, 'var(--t-purple)'); for (const [cx, s] of [[.22, .1], [.5, .14], [.78, .1]]) el('path', { d: starPath(cx, .47, s, s * .45), fill: 'var(--star)', stroke: 'var(--star-d)', 'stroke-width': .02 }, g); });
  $('icShop').innerHTML = ICON_POINTS.replace(/<\/?svg[^>]*>/g, '');
  $('icHammer').innerHTML = '<image href="media/ui/t-hammer.webp" x=".04" y=".04" width=".92" height=".92"/>';
  $('icDaily').innerHTML = `<rect x=".08" y=".14" width=".84" height=".76" rx=".14" fill="var(--green)"/><rect x=".08" y=".14" width=".84" height=".2" rx=".1" fill="var(--green-d)"/><text x=".5" y=".78" text-anchor="middle" font-size=".38" font-weight="700" fill="#fff" font-family="Fredoka">${new Date().getDate()}</text>`;
}

/* ================= wiring ================= */
$('playBtn').onclick = () => {
  if (isNewcomer() || (P.tut === 1 && !isSolved(2))) { const n = ALL.findIndex((_, i) => !isSolved(i)); return openLevel(n === -1 ? 0 : n); }     // the lesson goes straight to the board
  openMap();
};
$('mapBack').onclick = () => { mapSeq++; $('mapWarp').classList.remove('on'); $('mScene').classList.remove('warp'); goHome(); };
$('mapPrev').onclick = () => { if (mapCh > 0) { mapCh--; Sound.play('tap'); renderMap(true); } };
$('mapNext').onclick = () => { if (mapCh < CHAPTERS.length - 1 && unlocked(chBase(mapCh + 1))) { mapCh++; Sound.play('tap'); renderMap(true); } };
$('dailyBtn').onclick = openDaily;
$('weeklyBtn').onclick = () => { Sound.play('tap'); openWeekly(); };
$('tabWeek').onclick = () => openLeaderboard('week');
$('helpBtn').onclick = () => { demoMir = {}; renderDemo(); renderIcons(); show('help'); $('helpTabs').children[0].onclick(); };
$('helpBack').onclick = goHome;
for (const t of $('helpTabs').children) t.onclick = () => {
  Sound.play('tap');
  for (const o of $('helpTabs').children) o.setAttribute('aria-selected', o === t);
  for (const pane of document.querySelectorAll('.hpane')) pane.hidden = pane.dataset.p !== t.dataset.p;
  window.scrollTo(0, 0);
};
$('helpPlay').onclick = () => $('playBtn').onclick();
$('backBtn').onclick = () => { if (G && G.mode === 'duel') return leaveDuel(); if (G && G.mode === 'level' && !G.coach) { const ch = G.lv.ch; clearInterval(timerInt); hideWin(); G = null; return openMap(ch); } goHome(); };
$('duelBack').onclick = () => leaveDuel();
$('duelBtn').onclick = openDuelMenu;
$('resetBtn').onclick = () => {
  if (G.done) return;
  for (const k of Object.keys(G.mirrors)) if (!G.locked.has(k)) delete G.mirrors[k];
  G.moves = 0; G.hammerMode = false; G.hon = 0; G.honFloor = G.honBest || 0; Sound.play('reset'); for (const c of document.querySelectorAll('.cheerbox')) c.remove(); renderGame();
};
$('pauseBtn').onclick = () => {
  if (!G || G.done) return;
  const muted = () => P.sfx === false && P.music === false;
  if (clockOn()) document.body.classList.add('paused');                    // the board is covered, so a pause is a rest and not thinking time
  modal(`<img class="bug" alt="" src="${POSE.sleep}"><h3>${T('הפסקה')}</h3>
    <button class="btn green" id="paGo">${T('ממשיכים')}</button>
    <button class="btn blue" id="paSnd" style="margin-top:12px"></button>
    <button class="btn ghosty" id="paOut" style="margin-top:12px">${G.mode === 'level' && !G.coach ? T('חזרה למפה') : T('יציאה')}</button>`, m => {
      const label = () => { m.querySelector('#paSnd').textContent = muted() ? T('הפעלת צלילים') : T('השתקה'); };
      label();
      m.querySelector('#paGo').onclick = closeModal;
      m.querySelector('#paSnd').onclick = () => { $('muteBtn').onclick(); label(); };
      m.querySelector('#paOut').onclick = () => { closeModal(); $('backBtn').onclick(); };
    });
};
$('pwMirror').onclick = buyMirror;
$('pwHammer').onclick = toggleHammer;
$('pwHint').onclick = buyHint;
$('lbBtn').onclick = () => openLeaderboard('all');
$('lbBack').onclick = goHome;
$('tabAll').onclick = () => openLeaderboard('all');
$('tabDay').onclick = () => openLeaderboard('day');
$('achBtn').onclick = openAchievements;
$('achBack').onclick = goHome;
$('meBtn').onclick = () => openProfile();
$('gearBtn').onclick = openSettings;
$('adBannerRemove').onclick = openSettings;
$('setBack').onclick = goHome;
$('setRename').onclick = () => openProfile(openSettings);
$('setStickers').onclick = () => { Sound.play('tap'); openStickers(); };
$('setInstall').onclick = () => { Sound.play('tap'); openInstall(); }; syncInstallCard();
$('setReset').onclick = confirmReset;
function applySoundPrefs() {
  const sfx = P.sfx !== false, mus = P.music !== false;
  const style = ['upbeat', 'dream', 'box'].includes(P.musicStyle) ? P.musicStyle : 'calm';
  Sound.setStyle(style); Sound.setSfx(sfx); Sound.setMusic(mus);
  Haptic.set(P.haptic !== false);
  $('optHaptic').checked = Haptic.supported && P.haptic !== false; $('optHaptic').disabled = !Haptic.supported; $('hapticNote').hidden = Haptic.supported;
  $('optSfx').checked = sfx; $('optMusic').checked = mus;
  $('styleCalm').setAttribute('aria-pressed', style === 'calm');
  $('styleUp').setAttribute('aria-pressed', style === 'upbeat'); $('styleDream').setAttribute('aria-pressed', style === 'dream'); $('styleBox').setAttribute('aria-pressed', style === 'box');
  $('styleRow').classList.toggle('off', !mus);
  const muted = !sfx && !mus;
  $('spkWaves').toggleAttribute('hidden', muted); $('spkX').toggleAttribute('hidden', !muted);
  $('muteBtn').setAttribute('aria-label', muted ? T('הפעלת צלילים') : T('השתקה'));
}
$('optSfx').onchange = e => { P.sfx = e.target.checked; applySoundPrefs(); save(false); if (P.sfx) Sound.play('tap'); };
if (/^https?:$/.test(location.protocol)) { $('legalPrivacy').href = 'privacy/'; $('legalSupport').href = 'support/'; }   // on the web the pages sit next to the game
$('setLeave').onclick = leaveLeaderboard;
$('langHe').setAttribute('aria-pressed', LANG === 'he'); $('langEn').setAttribute('aria-pressed', LANG === 'en');
for (const [id, v] of [['themeLight', 'light'], ['themeDark', 'dark'], ['themeAuto', 'auto']]) $(id).onclick = () => { Sound.play('tap'); setTheme(v); };
applyTheme(getTheme());
addEventListener('scroll', () => { const h = $('hud'); if (h) h.classList.toggle('stuck', scrollY > 4); }, { passive: true });
$('langHe').onclick = () => LANG !== 'he' && setLang('he'); $('langEn').onclick = () => LANG !== 'en' && setLang('en');
$('optHaptic').onchange = e => { P.haptic = e.target.checked; applySoundPrefs(); save(false); if (P.haptic) Haptic.play('win'); };
$('optMusic').onchange = e => { P.music = e.target.checked; applySoundPrefs(); save(false); if (P.music) previewMusic(); };
// choosing a style in settings plays a short preview
let previewTimer = null;
function previewMusic() {
  if (P.music === false) return;
  Sound.music(true);
  clearTimeout(previewTimer);
  previewTimer = setTimeout(() => { if ($('game').hidden) Sound.music(false); }, 12000);
}
function pickStyle(st) { P.musicStyle = st; applySoundPrefs(); save(false); previewMusic(); }
$('styleCalm').onclick = () => pickStyle('calm');
$('styleUp').onclick = () => pickStyle('upbeat'); $('styleDream').onclick = () => pickStyle('dream'); $('styleBox').onclick = () => pickStyle('box');
$('muteBtn').onclick = () => {
  const muted = P.sfx === false && P.music === false;
  P.sfx = muted; P.music = muted; applySoundPrefs(); save(false);
  if (muted) Sound.play('tap');
};
// unlock audio on the first touch, and give every plain button a soft click
document.addEventListener('pointerdown', () => Sound.init(), { once: true });
/* where the browser allows it (an installed app, full screen), hold the screen upright; elsewhere the curtain above takes over */
const holdUpright = () => { try { const o = screen.orientation; if (o && o.lock) o.lock('portrait').catch(() => {}); } catch (e) { /* not supported */ } };
holdUpright(); document.addEventListener('pointerdown', holdUpright, { once: true });
document.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (b && !b.disabled && !b.closest('.powers') && b.id !== 'muteBtn') Sound.play('tap');
});
$('overlay').addEventListener('click', e => { if (e.target === $('overlay') && $('modal').dataset.locked !== '1') closeModal(); });


/* ================= sign-in ================= */
/* AUTH: replace with a real provider (e.g. Firebase Authentication with Google and Facebook)
   when publishing; the official buttons and sign-in windows come from those SDKs. */
const PROVIDERS = { google: 'Google', facebook: 'Facebook' };
/* ================= account =================
   Guests are backed up through their device key. Signing in with Google or Facebook (Supabase Auth) ties the same
   save to an account, so another device can pick it up. A provider's button only appears once it is switched on
   in the Supabase project, so nothing here pretends to work before it does. */
const AUTH = {
  enabled: {},
  async detect() {
    try {
      const r = await fetch(`${BACKEND.url}/auth/v1/settings`, { headers: { apikey: BACKEND.key } });
      const ext = (await r.json()).external || {};
      AUTH.enabled = { google: !!ext.google, facebook: !!ext.facebook };
    } catch (e) { AUTH.enabled = {}; }
    $('loginGoogle').hidden = !AUTH.enabled.google; $('loginFacebook').hidden = !AUTH.enabled.facebook; $('loginOr').hidden = !AUTH.enabled.google && !AUTH.enabled.facebook;
    if (!$('settings').hidden) renderAccount();
  },
  async signIn(provider) {
    await cloudSave();                                        // whatever was played as a guest is safe before we leave the page
    location.href = `${BACKEND.url}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(location.origin + location.pathname)}`;
  },
  async signOut() {
    const tk = await Session.token();
    if (tk) { try { await fetch(`${BACKEND.url}/auth/v1/logout`, { method: 'POST', headers: { apikey: BACKEND.key, Authorization: 'Bearer ' + tk } }); } catch (e) { /* signed out locally anyway */ } }
    Session.store(null);
  },
};
/* coming back from Google / Facebook: the address carries the new session after the # */
async function finishSignIn() {
  const h = new URLSearchParams(location.hash.replace(/^#/, ''));
  if (!h.get('access_token') && !h.get('error')) return false;
  try { history.replaceState(null, '', location.pathname); } catch (e) { /* address stays */ }
  if (!h.get('access_token')) { toast(T('ההתחברות לא הושלמה')); return false; }
  const sess = { access_token: h.get('access_token'), refresh_token: h.get('refresh_token'), expires_at: Date.now() + (+h.get('expires_in') || 3600) * 1000, provider: 'google', email: '' };
  try {
    const u = await (await fetch(`${BACKEND.url}/auth/v1/user`, { headers: { apikey: BACKEND.key, Authorization: 'Bearer ' + sess.access_token } })).json();
    sess.provider = (u.app_metadata && u.app_metadata.provider) || 'google'; sess.email = u.email || '';
  } catch (e) { /* the name of the provider is a nicety */ }
  Session.store(sess);
  await accountSync();
  return true;
}
/* after signing in: either this account already has a save (continue it here) or this device's save becomes the account's */
async function accountSync() {
  const sess = Session.get(); if (!sess) return;
  let acct = null;
  try { acct = await rpc('beam_account', {}); } catch (e) { toast(T('אין חיבור כרגע. נסו שוב מאוחר יותר.')); return; }
  const stars = d => Object.values((d && d.levels) || {}).reduce((n, l) => n + (l.stars || 0), 0);
  if (acct && acct.id !== P.id) {
    const adopt = async () => {
      const next = { ...acct.data, id: acct.id, key: playerKey(), viaAccount: true, auth: { provider: sess.provider, email: sess.email, since: Date.now() } };
      await switchProfile(next);
    };
    if (!hasProgress()) return adopt();
    modal(`<img class="bug" alt="" src="${WIN_BUG.think}">
      <h3>${T('בחשבון הזה כבר יש התקדמות')}</h3>
      <p>${T`בחשבון: ${stars(acct.data)} כוכבים. במכשיר הזה: ${stars(P)} כוכבים. אם תמשיכו עם החשבון, ההתקדמות שבמכשיר הזה תוחלף.`}</p>
      <button class="btn orange" id="acctUse">${T('המשך עם החשבון')}</button>
      <button class="btn ghosty" id="acctCancel" style="margin-top:12px">${T('ביטול והתנתקות')}</button>`, m => {
                m.querySelector('#acctUse').onclick = adopt;
        m.querySelector('#acctCancel').onclick = async () => { closeModal(); await AUTH.signOut(); renderAccount(); };
      }, true);
    return;
  }
  P.auth = { provider: sess.provider, email: sess.email, since: Date.now() }; save(false);
  if (!acct) { await cloudSave(); try { await rpc('beam_account_link', { p_id: P.id, p_secret: playerKey() }); } catch (e) { /* linked on the next visit */ } }
  toast(T`התחברתם עם ${PROVIDERS[sess.provider] || sess.provider}`);
  if (!$('settings').hidden) renderAccount();
}
function restoreLink() { return (/^https?:$/.test(location.protocol) ? location.origin + location.pathname : SITE_URL) + '#restore=' + P.id + '.' + playerKey(); }
/* a personal link opened on another device: bring the whole save over, device key included */
async function restoreFrom(code) {
  const [id, key] = code.split('.');
  if (!id || !key || id === P.id) return;
  let data = null;
  try { data = await rpc('beam_load', { p_id: id, p_secret: key }); } catch (e) { toast(T('אין חיבור כרגע. נסו שוב מאוחר יותר.')); return; }
  if (!data) { toast(T('לא מצאנו גיבוי לקישור הזה')); return; }
  const go = () => switchProfile({ ...data, id, key });
  if (!hasProgress()) return go();
  modal(`<h3>${T('לשחזר את ההתקדמות?')}</h3>
    <p>${T('ההתקדמות שבמכשיר הזה תוחלף בהתקדמות מהקישור.')}</p>
    <button class="btn orange" id="resGo">${T('שחזור')}</button>
    <button class="btn ghosty" id="resNo" style="margin-top:12px">${T('ביטול')}</button>`, m => {
      m.querySelector('#resGo').onclick = go; m.querySelector('#resNo').onclick = closeModal;
    });
}
function renderAccount() {
  const card = $('accountCard'), sess = Session.get();
  const on = Object.keys(AUTH.enabled).filter(p => AUTH.enabled[p]);
  card.hidden = false;
  if (sess) {
    card.innerHTML = `<h3>${T`חשבון`}</h3><p>${T`מחוברים עם ${PROVIDERS[sess.provider] || sess.provider}.`}${sess.email ? ' ' + esc(sess.email) : ''}</p>
      <p>${T('ההתקדמות נשמרת בחשבון, ואפשר להמשיך אותה מכל מכשיר.')}</p>
      <button class="btn ghosty" id="signOutBtn">${T`התנתקות`}</button>
      <button class="linkbtn" id="forgetBtn">${T('מחיקת כל המידע שלי מהשרת')}</button>`;
    card.querySelector('#signOutBtn').onclick = signOut;
    card.querySelector('#forgetBtn').onclick = forgetMe;
    return;
  }
  card.innerHTML = `<h3>${T('גיבוי והמשך במכשיר אחר')}</h3>
    <p>${T('ההתקדמות שלכם נשמרת במכשיר הזה ומגובה בשרת.')}</p>
    ${on.map(p => `<button class="sso ${p} small" data-p="${p}" style="margin-bottom:12px">${T`חיבור עם ${PROVIDERS[p]}`}</button>`).join('')}
    <button class="btn blue" id="restoreBtn2">${T('קישור אישי להמשך במכשיר אחר')}</button>
    <p class="powernote" style="margin-top:10px">${T('הקישור אישי: מי שמחזיק בו יכול לשחק בשמכם. אל תשתפו אותו.')}</p>
    <button class="linkbtn" id="forgetBtn">${T('מחיקת כל המידע שלי מהשרת')}</button>`;
  card.querySelector('#forgetBtn').onclick = forgetMe;
  for (const btn of card.querySelectorAll('[data-p]')) btn.onclick = () => AUTH.signIn(btn.dataset.p);
  card.querySelector('#restoreBtn2').onclick = async () => {
    if (!hasProgress()) { toast(T('עוד אין מה לגבות. שחקו שלב אחד קודם.')); return; }
    if (!(await cloudSave())) { toast(T('אין חיבור כרגע. נסו שוב מאוחר יותר.')); return; }
    shareText(T('הקישור האישי שלי ל-BEAM'), restoreLink(), T('הקישור הועתק. פתחו אותו במכשיר השני.'));
  };
}
/* the player's right to be forgotten: backup, leaderboard row and daily results go, and the device starts over */
function forgetMe() {
  modal(`<h3>${T('למחוק את כל המידע?')}</h3>
    <p>${T('הגיבוי, השם והניקוד יימחקו מהשרת, וההתקדמות תימחק גם מהמכשיר הזה. אי אפשר לבטל את זה.')}</p>
    <button class="btn danger" id="fgGo">${T('מחיקה')}</button>
    <button class="btn ghosty" id="fgNo" style="margin-top:12px">${T('ביטול')}</button>`, m => {
      m.querySelector('#fgNo').onclick = closeModal;
      m.querySelector('#fgGo').onclick = async () => {
        clearTimeout(saveTimer); clearTimeout(cloudTimer); cloudTimer = null;
        try { await rpc('beam_forget_me', { p_id: P.id, p_secret: playerKey() }); } catch (e) { closeModal(); toast(T('אין חיבור כרגע. נסו שוב מאוחר יותר.')); return; }
        await AUTH.signOut();
        await switchProfile({ ...newProfile(), auth: { provider: 'guest', since: Date.now() } });
      };
    });
}
async function signOut() {
  await cloudSave();
  await AUTH.signOut();
  if (P.viaAccount) {       // this device only had the save through the account: without it, it starts as a new guest
    await switchProfile({ ...newProfile(), auth: { provider: 'guest', since: Date.now() } }); return;
  }
  P.auth = { provider: 'guest', since: Date.now() }; save(false);
  renderAccount(); toast(T('התנתקתם. ההתקדמות נשארת במכשיר הזה.'));
}
$('loginGoogle').onclick = () => AUTH.signIn('google');
$('loginFacebook').onclick = () => AUTH.signIn('facebook');
$('loginGuest').onclick = () => goHome();

/* ---- boot: splash with a real loader, then into the game ---- */
const wait = ms => new Promise(r => setTimeout(r, ms));
let spGoal = 0, spNow = 0;
function setProgress(p, text) { spGoal = p; if (text) $('spText').textContent = text; }
(function spDraw() {
  const fill = $('spFill'); if (!fill) return;                       // the splash has been taken away
  spNow += Math.max(.25, (spGoal - spNow) * .07); if (spNow > spGoal) spNow = spGoal;
  fill.style.width = (spNow * .94) + '%';
  document.querySelectorAll('.sp-star').forEach((st, i) => { if (spNow >= [22.5, 48, 73.5][i]) st.classList.add('on'); });
  $('spPct').textContent = Math.round(spNow) + '%';
  requestAnimationFrame(spDraw);
})();
(async () => {
  const t0 = Date.now();
  await wait(50); setProgress(12);
  try { await Promise.race([document.fonts.ready, wait(1500)]); } catch (e) { /* fonts are optional */ }
  setProgress(32);
  await loadProfile();
  applyLook();
  applySoundPrefs();
  setProgress(55, T('מכינים את השלבים…'));
  await wait(80);
  await Promise.all([...document.images].map(i => i.decode ? i.decode().catch(() => {}) : null));
  setProgress(72, T('מדליקים את הכוכבים…'));
  await wait(80);
  setProgress(92);
  // a new player comes in as a guest with no sign-in wall, and starts on the home screen like everyone else
  if (!P.auth) { P.auth = { provider: 'guest', since: Date.now() }; save(false); }
  renderHome(); show(isNewcomer() && location.hash.length < 2 && location.search.length < 2 ? 'login' : 'home');          // a first visit opens on the entry page; everyone else lands at home with its bars
  const rest = 1900 - (Date.now() - t0);
  if (rest > 0) await wait(rest);
  setProgress(100, T('מוכן!'));
  await wait(650);
  $('splash').classList.add('gone');
  document.body.classList.remove('splashing');
  setTimeout(() => $('splash').remove(), 700);
  // today's challenge takes a moment to build, so it is prepared quietly once the screen is up
  const idle = window.requestIdleCallback || (f => setTimeout(f, 1200));
  idle(() => { preloadWinVideos(); const t = todayStr(); if (!DAILY_CACHE || DAILY_CACHE.date !== t) { try { DAILY_CACHE = { date: t, lv: dailyLevel(t) }; } catch (e) { /* built on demand instead */ } } });
  // on the web the game installs to the home screen and keeps working offline
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => {});
  AUTH.detect();
  // the personal link keeps its key after the #, which browsers never send to any server
  const restore = new URLSearchParams(location.hash.replace(/^#/, '')).get('restore');
  if (await finishSignIn()) { bonusPending = true; return; }
  const friend = new URLSearchParams(location.hash.replace(/^#/, '')).get('friend');
  if (friend && /^[a-f0-9]{8,32}$/.test(friend)) {
    try { history.replaceState(null, '', location.pathname); } catch (e) { /* address stays */ }
    bonusPending = true; withName(() => acceptFriendLink(friend)); return;
  }
  pulse();
  if (restore && /^[A-Za-z0-9]{6,64}\.[a-f0-9]{16,128}$/.test(restore)) {
    try { history.replaceState(null, '', location.pathname); } catch (e) { /* address stays */ }
    bonusPending = true; restoreFrom(restore); return;
  }
  const invite = (new URLSearchParams(location.search).get('duel') || '').trim().toUpperCase();
  if (/^[A-Z0-9]{5}$/.test(invite)) {
    try { history.replaceState(null, '', location.pathname); } catch (e) { /* address stays as it was */ }
    bonusPending = true;                      // the daily bonus waits until they are back on the home screen
    withName(() => joinDuel(invite));
    return;
  }
  await wait(500);
  if (isNewcomer()) { bonusPending = true; show('login'); return; }       // first visit: the way in, then the lesson
  dailyBonus();
  checkAchievements();
  setTimeout(claimGifts, 2500);
  setTimeout(sessionPing, 1500);
})();

