import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FaUtensils, FaCoffee, FaPizzaSlice, FaClock, FaCalendarAlt, FaDirections } from 'react-icons/fa';
import { isOpenNow } from '../utils/timeUtils';

// Function to get emoji based on types
const getSpotIcon = (spot) => {
    const type = spot.foodTypes[0] || "";
    if (type.includes("Coffee") || type.includes("Pastry")) return "☕";
    if (type.includes("Pizza") || type.includes("Burger")) return "🍕";
    return "🍛"; // Generic food
}

const FoodMarker = ({ spot, userLocation }) => {
  const emoji = getSpotIcon(spot);

  const isSpotOpen = isOpenNow(spot.openHours);
  
  const icon = L.divIcon({
    className: 'custom-icon',
    html: `<div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 hover:shadow-2xl relative group">
             <div class="absolute inset-0 rounded-full border-[3px] border-primary opacity-20 group-hover:opacity-100 transition-opacity"></div>
             <span class="text-2xl transform transition-transform group-hover:rotate-12">${emoji}</span>
             <div class="absolute -bottom-1 w-2 h-2 bg-primary rotate-45"></div>
           </div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 52],
    popupAnchor: [0, -52]
  });

  const getDistance = () => {
      if (!userLocation) return null;
      const user = L.latLng(userLocation[0], userLocation[1]);
      const target = L.latLng(spot.lat, spot.lng);
      const distMeters = user.distanceTo(target);
      if (distMeters < 1000) return `${Math.round(distMeters)}m`;
      return `${(distMeters / 1000).toFixed(1)}km`;
  };

  const distance = getDistance();

  return (
    <Marker position={[spot.lat, spot.lng]} icon={icon}>
      <Popup className="food-popup border-0 p-0" closeButton={false}>
        <div className="w-[280px] font-sans">
           {/* Header with image placeholder or color */}
           <div className="bg-gradient-to-br from-orange-50 to-orange-100 h-24 flex items-center justify-center relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-secondary/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                <div className="absolute left-0 bottom-0 w-16 h-16 bg-primary/10 rounded-full -ml-8 -mb-8 blur-lg"></div>
                
                <span className="text-5xl drop-shadow-md z-10 transform hover:scale-110 transition-transform duration-300 cursor-default">{emoji}</span>
                
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-700 shadow-sm border border-white/50">
                    {spot.price}
                </div>
           </div>
           
           <div className="p-5 bg-white relative">
                <div className="absolute -top-6 left-5">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-sm border-2 border-white ${isSpotOpen ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {isSpotOpen ? 'Open Now' : 'Closed'}
                    </span>
                </div>

                <h3 className="font-bold text-lg text-gray-800 leading-tight mb-1 mt-1">{spot.name}</h3>
                
                {distance && (
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-400 mb-3">
                        <svg className="w-3 h-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {distance} away
                    </div>
                )}

                <p className="text-xs text-gray-500 mb-4 leading-relaxed line-clamp-2">{spot.description}</p>
                
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {spot.foodTypes.slice(0, 3).map((food, idx) => (
                    <span key={idx} className="text-[10px] font-semibold bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100">
                        {food}
                    </span>
                    ))}
                    {spot.foodTypes.length > 3 && (
                        <span className="text-[10px] font-semibold bg-gray-50 text-gray-400 px-2 py-1 rounded-md border border-gray-100">+{spot.foodTypes.length - 3}</span>
                    )}
                </div>
                
                <div className="pt-3 border-t border-gray-50 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                             <div className="text-[10px] text-gray-500 font-medium flex items-center gap-1.5">
                                <FaCalendarAlt className="text-secondary/70" />
                                <span>{spot.daysOpen || "Mon - Sat"}</span>
                             </div>
                             <div className="text-[10px] text-gray-500 font-medium flex items-center gap-1.5">
                                <FaClock className="text-secondary/70" />
                                <span>{spot.openHours}</span>
                             </div>
                        </div>
                        <button 
                            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lng}`, '_blank')}
                            className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow hover:bg-black transition-colors self-end mr-2 flex items-center gap-1"
                        >
                            <FaDirections />
                            Directions
                        </button>
                    </div>
                </div>
           </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default FoodMarker;
