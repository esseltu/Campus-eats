import { useState, useEffect } from 'react'
import MapView from './components/MapView'
import { getSpots } from './services/spotService'
import { isOpenNow } from './utils/timeUtils'
import { FaFilter, FaTimes } from 'react-icons/fa'
import SplashScreen from './components/SplashScreen'

function App() {
  const [loading, setLoading] = useState(true);
  const [spots, setSpots] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  useEffect(() => {
    const loadSpots = async () => {
      const data = await getSpots();
      setSpots(data);
      setFilteredSpots(data);
    };
    loadSpots();
  }, []);

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    setIsFilterMenuOpen(false); // Close menu on selection
    if (filter === 'All') {
      setFilteredSpots(spots);
    } else if (filter === 'Open Now') {
      setFilteredSpots(spots.filter(spot => isOpenNow(spot.openHours)));
    } else if (filter === 'Cheap Eats') {
      setFilteredSpots(spots.filter(spot => spot.price === '₵'));
    } else if (filter === 'Ghanaian Food') {
      // Simple heuristic for Ghanaian food based on types
      const localFoods = ['Jollof', 'Banku', 'Waakye', 'Fufu', 'Kenkey', 'Rice Balls', 'Soup', 'Indomie', 'Fried Rice', 'Wele', 'Egg', 'Fish', 'Goat Soup'];
      setFilteredSpots(spots.filter(spot => 
        spot.foodTypes.some(type => localFoods.some(lf => type.toLowerCase().includes(lf.toLowerCase())))
      ));
    }
  };

  const handleFindMe = () => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  const { latitude, longitude } = position.coords;
                  setUserLocation([latitude, longitude]);
              },
              (error) => {
                  console.error("Error getting location", error);
                  // Optional: handle error UI
                  alert("Could not access your location. Please check permissions.");
              },
              { enableHighAccuracy: true }
          );
      } else {
          alert("Geolocation is not supported by your browser.");
      }
  };

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gray-50">
      {loading && <SplashScreen onFinish={() => setLoading(false)} />}
      
      {/* Filter Button & Menu */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col items-end gap-2">
        <button
          onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
          className="bg-white/90 backdrop-blur-md text-gray-800 px-5 py-3 rounded-2xl shadow-lg border border-white/50 flex items-center gap-2.5 font-bold transition-all active:scale-95 hover:bg-white hover:shadow-xl"
        >
          <div className={`p-1.5 rounded-full ${isFilterMenuOpen ? 'bg-red-50 text-red-500' : (activeFilter !== 'All' ? 'bg-secondary/10 text-secondary' : 'bg-gray-100 text-gray-600')}`}>
            {isFilterMenuOpen ? <FaTimes size={14} /> : <FaFilter size={14} />}
          </div>
          <span className="text-sm tracking-wide">
            {isFilterMenuOpen ? 'Close' : (activeFilter === 'All' ? 'Filter Spots' : activeFilter)}
          </span>
        </button>

        {isFilterMenuOpen && (
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden flex flex-col w-56 animate-fade-in-up origin-top-right">
            <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Filter by
            </div>
            {['All', 'Open Now', 'Cheap Eats', 'Ghanaian Food'].map(filter => (
              <button
                key={filter}
                onClick={() => handleFilter(filter)}
                className={`text-left px-4 py-3.5 text-sm font-medium transition-all border-b border-gray-50 last:border-0 flex justify-between items-center group ${
                  activeFilter === filter ? 'text-secondary bg-orange-50/50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{filter}</span>
                {activeFilter === filter && (
                  <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(249,115,22,0.5)]"></span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <MapView 
        spots={filteredSpots} 
        userLocation={userLocation}
        onFindMe={handleFindMe}
      />
    </div>
  )
}

export default App
