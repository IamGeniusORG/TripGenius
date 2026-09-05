const fs = require('fs');

// Fix app/page.tsx
let pageTxt = fs.readFileSync('app/page.tsx', 'utf8');
// Fix Flights
pageTxt = pageTxt.replace(/encodeURIComponent\('Flights to ' \+ \(itinerary\.title \|\| ''\)\)/g, "encodeURIComponent('Flights to ' + destination)");
// Fix Rome2Rio
pageTxt = pageTxt.replace(/encodeURIComponent\(itinerary\.title \|\| ''\)/g, "encodeURIComponent(destination)");
// Fix Rentalcars
pageTxt = pageTxt.replace(/encodeURIComponent\(itinerary\.title \|\| ''\)/g, "encodeURIComponent(destination)"); // Will catch if previously missed
// Fix Booking.com
pageTxt = pageTxt.replace(/encodeURIComponent\(acc\.name \+ ' ' \+ \(itinerary\.title \|\| ''\)\)/g, "encodeURIComponent(acc.name + ' ' + destination)");
fs.writeFileSync('app/page.tsx', pageTxt, 'utf8');

// Fix app/share/[id]/page.tsx
let shareTxt = fs.readFileSync('app/share/[id]/page.tsx', 'utf8');
// Fix Flights
shareTxt = shareTxt.replace(/encodeURIComponent\('Flights to ' \+ \(itinerary\.title \|\| ''\)\)/g, "encodeURIComponent('Flights to ' + trip.destination)");
// Fix Rome2Rio & RentalCars
shareTxt = shareTxt.replace(/encodeURIComponent\(itinerary\.title \|\| ''\)/g, "encodeURIComponent(trip.destination)");
// Fix Booking.com
shareTxt = shareTxt.replace(/encodeURIComponent\(acc\.name \+ ' ' \+ \(itinerary\.title \|\| ''\)\)/g, "encodeURIComponent(acc.name + ' ' + trip.destination)");
fs.writeFileSync('app/share/[id]/page.tsx', shareTxt, 'utf8');