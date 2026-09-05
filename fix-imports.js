const fs = require('fs');

// Fix page.tsx imports
let pageTxt = fs.readFileSync('app/page.tsx', 'utf8');
if (!pageTxt.includes('import { TripMapDynamic } from "@/components/TripMapDynamic";')) {
  pageTxt = `import { TripMapDynamic } from "@/components/TripMapDynamic";\n` + pageTxt;
  // If we broke MapPin import, restore it
  pageTxt = pageTxt.replace('import { import { TripMapDynamic } from "@/components/TripMapDynamic";\nMapPin', 'import { MapPin');
}
fs.writeFileSync('app/page.tsx', pageTxt, 'utf8');

// Fix share page imports and animations
let shareTxt = fs.readFileSync('app/share/[id]/page.tsx', 'utf8');
if (!shareTxt.includes('import { TripMapDynamic } from "@/components/TripMapDynamic";')) {
  shareTxt = `import { TripMapDynamic } from "@/components/TripMapDynamic";\n` + shareTxt;
  shareTxt = shareTxt.replace('import { import { TripMapDynamic } from "@/components/TripMapDynamic";\nMapPin', 'import { MapPin');
}
if (!shareTxt.includes('import { motion } from "framer-motion";')) {
  shareTxt = `import { motion } from "framer-motion";\n` + shareTxt;
}

// Ensure containerVariants exists in share page
const variants = `
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
`;
if (!shareTxt.includes('const containerVariants')) {
  shareTxt = shareTxt.replace('export default async function SharePage({ params }: { params: { id: string } }) {', variants + '\nexport default async function SharePage({ params }: { params: { id: string } }) {');
}

fs.writeFileSync('app/share/[id]/page.tsx', shareTxt, 'utf8');