const fs = require('fs');

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Goa', 'Kochi', 'Chandigarh', 'Indore', 'Bhopal', 'Patna', 'Varanasi', 'Amritsar', 'Srinagar', 'Thiruvananthapuram', 'Coimbatore', 'Nagpur', 'Visakhapatnam', 'Guwahati', 'Ranchi'
];
const airlines = ['IndiGo', 'Air India', 'SpiceJet', 'Vistara', 'GoAir', 'AirAsia India', 'Alliance Air', 'Star Air', 'Akasa Air'];

const generateFlights = () => {
  let queries = '';
  let flightId = 1000;
  
  for (let i = 0; i < cities.length; i++) {
    const source = cities[i];
    
    // Create flights for the next 7 days from this source
    for(let day = 0; day <= 6; day++) {
      // Pick random destinations
      let destIndex1 = (i + day + 1) % cities.length;
      let destIndex2 = (i + day + 5) % cities.length;
      
      const destinations = [cities[destIndex1], cities[destIndex2]];
      
      for (const destination of destinations) {
        const airline = airlines[(i + day + flightId) % airlines.length];
        const flightNum = airline.substring(0, 2).toUpperCase().replace(' ', '') + '-' + flightId++;
        
        const price = Math.floor(Math.random() * (8000 - 3000 + 1) + 3000);
        const totalSeats = 180;
        const availSeats = Math.floor(Math.random() * 180);
        
        const depHour = Math.floor(Math.random() * 20 + 2); // between 2 and 22
        const arrHour = depHour + Math.floor(Math.random() * 3 + 1);
        const arrMin = Math.floor(Math.random() * 45 + 15);
        
        queries += `  ('${flightNum}', '${airline}', '${source}', '${destination}', NOW() + INTERVAL '${day} days ${depHour} hours', NOW() + INTERVAL '${day} days ${arrHour} hours ${arrMin} minutes', ${price}.00, ${totalSeats}, ${availSeats}),\n`;
      }
    }
  }
  
  return queries;
};

const output = generateFlights();
fs.writeFileSync('flights-output.txt', output);
console.log('Done');
