"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Filter, Calendar, AlertTriangle, ShieldCheck, MapPin } from "lucide-react";
import L from "leaflet";
import Link from "next/link";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function CrimeMapClient() {
  const [cases, setCases] = useState<any[]>([]);
  const [filterCategory, setFilterCategory] = useState("All");
  
  useEffect(() => {
     fetch("/api/cases").then(res => res.json()).then(data => setCases(data)).catch(() => {});
  }, []);

  const filteredCases = filterCategory === "All" ? cases : cases.filter(c => c.category === filterCategory);

  const center: [number, number] = [40.7128, -74.0060]; // NY Base Default
  
  const getSimulatedCoords = (id: string, base: [number, number]) => {
     const hash = id.split("").reduce((a,b) => a + b.charCodeAt(0), 0);
     const latOffset = (hash % 100) / 1000 - 0.05;
     const lngOffset = ((hash * 7) % 100) / 1000 - 0.05;
     return [base[0] + latOffset, base[1] + lngOffset] as [number, number];
  };

  return (
    <div className="relative w-full h-full">
      {/* Floating Filter UI */}
      <div className="absolute top-6 left-6 z-[400] w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50">
         <h2 className="font-bold text-gray-900 dark:text-white flex items-center mb-5 text-base">
           <Filter className="w-4 h-4 mr-2 text-blue-500" /> Advanced Map Filters
         </h2>
         
         <div className="space-y-5">
           <div>
             <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Category Filter</label>
             <select 
               value={filterCategory} 
               onChange={e => setFilterCategory(e.target.value)}
               className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white shadow-sm cursor-pointer"
             >
                <option value="All">All Incidents</option>
                <option value="Theft">Theft</option>
                <option value="Assault">Assault</option>
                <option value="Vandalism">Vandalism</option>
             </select>
           </div>
           
           <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Live Threat Legend</p>
              <div className="space-y-3">
                <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)] mr-3 border-2 border-white dark:border-slate-900"></span> High Risk Zones
                </div>
                <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)] mr-3 border-2 border-white dark:border-slate-900"></span> Medium Priority
                </div>
                <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="w-3.5 h-3.5 rounded-full bg-green-500 mr-3 border-2 border-white dark:border-slate-900"></span> Low Priority / Resolved
                </div>
              </div>
           </div>
         </div>
      </div>

      <MapContainer center={center} zoom={12} className="w-full h-full z-0 font-sans" zoomControl={false}>
         <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution="&copy; OpenStreetMap contributors &copy; CARTO" />
         
         {filteredCases.map(c => {
           const coords = getSimulatedCoords(c._id, center);
           const isHigh = c.priorityScore === 'High';
           const isResolved = c.status === 'Resolved';
           const color = isResolved ? '#22c55e' : (isHigh ? '#ef4444' : '#f59e0b');
           
           return (
             <CircleMarker 
               key={c._id} 
               center={coords} 
               radius={isHigh && !isResolved ? 14 : 9}
               pathOptions={{ fillColor: color, color: '#ffffff', weight: 2, fillOpacity: 0.8 }}
             >
               <Popup className="custom-popup border-0 p-0 shadow-2xl rounded-2xl overflow-hidden min-w-[240px]">
                  <div className="bg-white p-5 m-[-1px]">
                    <div className="flex items-center gap-2 mb-3">
                       {isResolved ? <ShieldCheck className="w-4 h-4 text-green-500" /> : <AlertTriangle className={`w-4 h-4 ${isHigh ? 'text-red-500' : 'text-amber-500'}`} />}
                       <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-100 px-2 py-0.5 rounded-sm">{c.category}</span>
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-sm leading-tight mb-2 pr-4">{c.title}</h3>
                    <p className="text-xs text-gray-500 mb-4 flex items-center font-medium"><MapPin className="w-3 h-3 mr-1" />{c.location}</p>
                    
                    <Link href={`/cases/${c._id}`} className="block w-full py-2.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-center text-xs font-bold rounded-xl transition-all">
                      Review Case Evidence
                    </Link>
                  </div>
               </Popup>
             </CircleMarker>
           )
         })}
      </MapContainer>
    </div>
  )
}
