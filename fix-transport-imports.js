const fs = require('fs');

const fixImports = (filepath) => {
  let txt = fs.readFileSync(filepath, 'utf8');
  if (!txt.includes('Train,')) {
    txt = txt.replace(/import \{ (.*?Plane.*?) \} from "lucide-react";/, 'import { Train, Car, $1 } from "lucide-react";');
    txt = txt.replace(/import \{ (.*?MapPin.*?) \} from "lucide-react";/, 'import { Train, Car, $1 } from "lucide-react";'); // Fallback
  }
  fs.writeFileSync(filepath, txt, 'utf8');
}

fixImports('app/page.tsx');
fixImports('app/share/[id]/page.tsx');