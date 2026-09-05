const fs = require('fs');
let txt = fs.readFileSync('app/page.tsx', 'utf8');

// Remove all instances of "use client"; at the beginning (including weird spacing)
txt = txt.replace(/import \{ TripMapDynamic \} from "@\/components\/TripMapDynamic";\n/, '');
txt = txt.replace(/"use client";\n*/g, '');
txt = txt.replace(/"use client";\n*/g, ''); // Sometimes PowerShell leaves a weird character

// Prepend correctly
txt = '"use client";\n\nimport { TripMapDynamic } from "@/components/TripMapDynamic";\n' + txt;

fs.writeFileSync('app/page.tsx', txt, 'utf8');