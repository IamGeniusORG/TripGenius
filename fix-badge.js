const fs = require('fs');
let txt = fs.readFileSync('app/share/[id]/page.tsx', 'utf8');
txt = txt.replace('import { Badge }\nimport { Button } from "@/components/ui/button"; from "@/components/ui/badge";', 'import { Badge } from "@/components/ui/badge";\nimport { Button } from "@/components/ui/button";');
fs.writeFileSync('app/share/[id]/page.tsx', txt, 'utf8');