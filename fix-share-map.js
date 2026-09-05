const fs = require('fs');

let shareTxt = fs.readFileSync('app/share/[id]/page.tsx', 'utf8');

// Remove framer-motion import
shareTxt = shareTxt.replace('import { motion } from "framer-motion";\n', '');

// Remove containerVariants definition
const variants = `
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
`;
shareTxt = shareTxt.replace(variants, '');

// Replace <motion.div variants={containerVariants} initial="hidden" animate="show" with <div
shareTxt = shareTxt.replace('<motion.div variants={containerVariants} initial="hidden" animate="show"', '<div');
shareTxt = shareTxt.replace(/<\/motion\.div>\s*\}\)\}\s*<\/div>/g, '</div>\n                    )}\n                  </div>');

// There might be another </motion.div> closing the map
shareTxt = shareTxt.replace(/<\/motion\.div>\s*\}\)\}/g, '</div>\n                  )}');

fs.writeFileSync('app/share/[id]/page.tsx', shareTxt, 'utf8');