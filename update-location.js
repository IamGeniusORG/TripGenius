const fs = require('fs');
let txt = fs.readFileSync('app/page.tsx', 'utf8');

// 1. Remove the useEffect for on-load location fetching
const useEffectRegex = /useEffect\(\(\) => \{\s*fetch\('\/api\/location'\).*?setIsLocating\(false\)\);\s*\}, \[\]\);/s;
txt = txt.replace(useEffectRegex, '');

// 2. Add the handleGetLocation logic inside the component, right before budget state
const functionToAdd = `
  const handleGetLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(\`https://nominatim.openstreetmap.org/reverse?format=json&lat=\${latitude}&lon=\${longitude}\`);
            const data = await res.json();
            
            const city = data.address.city || data.address.town || data.address.village || data.address.county;
            const country = data.address.country;
            
            if (city && country) {
              setOrigin(\`\${city}, \${country}\`);
            } else {
              fallbackToIp();
            }
            setIsLocating(false);
          } catch (error) {
            console.error("Geocoding failed", error);
            fallbackToIp();
          }
        },
        (error) => {
          console.error("Geolocation denied or failed", error);
          fallbackToIp();
        }
      );
    } else {
      fallbackToIp();
    }
  };

  const fallbackToIp = async () => {
    try {
      const res = await fetch('/api/location');
      const data = await res.json();
      if (data.city && data.country_name) {
        setOrigin(\`\${data.city}, \${data.country_name}\`);
      }
    } catch (e) {
      console.error("IP fallback failed", e);
    } finally {
      setIsLocating(false);
    }
  };
`;

txt = txt.replace('const [budget, setBudget] = useState("");', functionToAdd + '\n  const [budget, setBudget] = useState("");');

// 3. Fix initial state for isLocating (set to false instead of true since it no longer auto-fetches)
txt = txt.replace('const [isLocating, setIsLocating] = useState(true);', 'const [isLocating, setIsLocating] = useState(false);');

// 4. Update the Origin Input UI
const oldOriginBlock = /<Navigation className="absolute left-4 top-4 h-6 w-6 text-emerald-500" \/>\s*<Input\s*id="origin"\s*placeholder=\{isLocating \? "Locating\.\.\." : "e\.g\. New York"\}\s*className="pl-12 h-14 text-lg bg-zinc-50 dark:bg-zinc-900\/50 border-zinc-300 dark:border-zinc-700 focus-visible:ring-blue-500"\s*value=\{origin\}\s*onChange=\{\(e\) => setOrigin\(e\.target\.value\)\}\s*\/>/s;

const newOriginBlock = `<button 
                          type="button"
                          onClick={handleGetLocation}
                          className="absolute left-2.5 top-2.5 p-1.5 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors z-10 group"
                          title="Use my exact location"
                        >
                          {isLocating ? (
                            <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
                          ) : (
                            <Navigation className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                          )}
                        </button>
                        <Input 
                          id="origin" 
                          placeholder={isLocating ? "Detecting location..." : "Add your location"} 
                          className="pl-12 h-14 text-lg bg-zinc-50 dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-700 focus-visible:ring-blue-500" 
                          value={origin}
                          onChange={(e) => setOrigin(e.target.value)}
                        />`;

txt = txt.replace(oldOriginBlock, newOriginBlock);

fs.writeFileSync('app/page.tsx', txt, 'utf8');