const fs = require('fs');
let content = fs.readFileSync('components/DownloadPdfButton.tsx', 'utf8');

content = content.replace('const opt = {', 'const opt: any = {');

fs.writeFileSync('components/DownloadPdfButton.tsx', content, 'utf8');