const fs = require('fs');

const cleanImports = (filepath) => {
  let txt = fs.readFileSync(filepath, 'utf8');
  txt = txt.replace(/import \{ .*? \} from "lucide-react";/, 'import { MapPin, Sparkles, Navigation, Bed, Compass, Heart, ExternalLink, Sunrise, Sun, Sunset, Moon, Clock, Plane, Train, Car, Loader2, Wallet } from "lucide-react";');
  fs.writeFileSync(filepath, txt, 'utf8');
}

cleanImports('app/page.tsx');
cleanImports('app/share/[id]/page.tsx');