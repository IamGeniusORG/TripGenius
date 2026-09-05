const fs = require('fs');
let layout = fs.readFileSync('app/layout.tsx', 'utf8');

layout = layout.replace('{children}', '{children}\n            <Toaster position="bottom-right" richColors theme="system" />');

fs.writeFileSync('app/layout.tsx', layout, 'utf8');