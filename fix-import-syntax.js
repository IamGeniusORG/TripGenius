const fs = require('fs');
let pageTxt = fs.readFileSync('app/page.tsx', 'utf8');
pageTxt = pageTxt.replace(/Globe:\s*GlobeIcon/g, 'Globe as GlobeIcon');
fs.writeFileSync('app/page.tsx', pageTxt, 'utf8');