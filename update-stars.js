const fs = require('fs');
let content = fs.readFileSync('components/CursorBackground.tsx', 'utf8');

// Add constant slow rotation to the stars
content = content.replace(
  'groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.03;',
  'groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.03;\n    // Add constant drift so stars are always moving beautifully\n    groupRef.current.rotation.z += 0.0005;\n    groupRef.current.rotation.y += 0.0005;'
);

fs.writeFileSync('components/CursorBackground.tsx', content, 'utf8');
console.log('CursorBackground updated');