const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

// Change radial-gradient(250px to radial-gradient(100px
content = content.replace(
  /background: \`radial-gradient\(250px circle at \$\{mousePos\.x\}px \$\{mousePos\.y\}px, \$\{glowColor\}, transparent 80\%\)\`/,
  'background: `radial-gradient(100px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 80%)`'
);

fs.writeFileSync('app/page.tsx', content, 'utf8');
console.log('page.tsx updated');