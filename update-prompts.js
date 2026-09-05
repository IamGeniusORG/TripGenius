const fs = require('fs');

const updateRoute = (filepath) => {
  let txt = fs.readFileSync(filepath, 'utf8');
  
  // Replace the imageKeyword instruction with one that also asks for coordinates
  const oldInstruction = 'For every location, activity, or hotel, provide a single, highly descriptive search term in the "imageKeyword" field (e.g. "shibuya+crossing+tokyo", "luxury+resort+maldives") with no spaces, using plus signs.';
  
  const newInstruction = 'For every location, activity, or hotel, provide a single, highly descriptive search term in the "imageKeyword" field (e.g. "shibuya+crossing+tokyo", "luxury+resort+maldives") with no spaces, using plus signs.\nCRITICAL: You MUST also provide exact GPS coordinates for every location and accommodation in a "coordinates" object containing "lat" and "lng" as numbers (e.g. "coordinates": { "lat": 35.6595, "lng": 139.7005 }).';
  
  txt = txt.replace(oldInstruction, newInstruction);
  fs.writeFileSync(filepath, txt, 'utf8');
};

updateRoute('app/api/plan-trip/route.ts');
updateRoute('app/api/modify-trip/route.ts');