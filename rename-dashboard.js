const fs = require('fs');

// Fix Navbar
let nav = fs.readFileSync('components/Navbar.tsx', 'utf8');
nav = nav.replace('<span className="hidden sm:inline">Dashboard</span>', '<span className="hidden sm:inline">My Trips</span>');
fs.writeFileSync('components/Navbar.tsx', nav, 'utf8');

// Fix Footer
let footer = fs.readFileSync('components/Footer.tsx', 'utf8');
footer = footer.replace('My Dashboard</Link>', 'My Trips</Link>');
fs.writeFileSync('components/Footer.tsx', footer, 'utf8');