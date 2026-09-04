const fs = require('fs');

const files = ['app/page.tsx', 'app/share/[id]/page.tsx'];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let txt = fs.readFileSync(file, 'utf8');

    // Badges that failed
    txt = txt.replace(/Ã°Å¸â€œÂ /g, "📍");
    txt = txt.replace(/Ã°.*? {destination}/g, "📍 {destination}");

    fs.writeFileSync(file, txt, 'utf8');
}