const fs = require('fs');
let pageTxt = fs.readFileSync('app/page.tsx', 'utf8');
pageTxt = pageTxt.replace('import { TripMapDynamic } from "@/components/TripMapDynamic";', 'import { TripMapDynamic } from "@/components/TripMapDynamic";\nimport InteractiveGlobe from "@/components/Globe";');
fs.writeFileSync('app/page.tsx', pageTxt, 'utf8');