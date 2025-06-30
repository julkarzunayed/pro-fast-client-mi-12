// src/pages/CoveragePage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';  // Don't forget to import Leaflet's CSS!

// Fix for default marker icon issues with Webpack (common with react-leaflet)
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import icon from '../../assets/bookingIcon.png'
import { useLoaderData } from 'react-router';

// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: iconRetinaUrl,
//     iconUrl: iconUrl,
//     shadowUrl: shadowUrl,
// });
const myCustomIcon = new L.icon({
    iconUrl: iconUrl,
    iconSize: [22, 38], // Size of the icon [width, height]
    iconAnchor: [11, 38], // Point of the icon which will correspond to marker's location [half_width, full_height]
    popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
    // If you want a shadow for your custom icon:
    shadowUrl: shadowUrl,
    shadowSize: [32, 32], // Size of the shadow
    shadowAnchor: [10, 30], // Anchor for the shadow
});

const MapFlyToAndPopup = ({ selectedDistrict }) => {
    const map = useMap(); // Get access to the Leaflet map instance

    useEffect(() => {
        if (selectedDistrict) {
            // Fly to the selected district's coordinates
            // Zoom level 10 is a good general level for a district
            map.flyTo([selectedDistrict.latitude, selectedDistrict.longitude], 10, {
                duration: 1.5, // Smooth animation over 1.5 seconds
            });
        }
    }, [selectedDistrict, map]); // Re-run effect when selectedDistrict changes

    return null; // This component doesn't render anything visible
};

// Component to wrap Marker and control popup
const MarkerWithPopupControl = ({ district, selectedDistrictForAction }) => {
    
    // Ref to get direct access to the Leaflet marker instance
    const markerRef = useRef(null);

    useEffect(() => {
        // Check if this marker is the one that needs its popup opened
        if (selectedDistrictForAction && selectedDistrictForAction.district === district.district) {
            if (markerRef.current) {
                markerRef.current.openPopup();
            }
        }
    }, [selectedDistrictForAction, district]);

    // Convert covered_area array to a comma-separated string
    const coveredAreasString = district.covered_area.join(', ');

    return (
        <Marker
            position={[district.latitude, district.longitude]}
            icon={myCustomIcon} // Pass the custom icon (or it defaults to Leaflet's)
            ref={markerRef} // Attach the ref to the Marker
        >
            <Popup>
                <div className="font-bold text-lg">{district.district}</div>
                <div className="text-sm">Region: {district.region}</div>
                <div className="text-sm">Covered Areas: {coveredAreasString}</div>
                {district.flowchart && (
                    <div className="text-sm mt-2">
                        <a href={district.flowchart} target="_blank" rel="noopener noreferrer" className="link link-primary">
                            View Flowchart
                        </a>
                    </div>
                )}
            </Popup>
        </Marker>
    );
};

const CoveragePage = () => {
    const districtsData = useLoaderData();
    



    // Initial map center (e.g., Bangladesh's approximate center) and zoom level
    const position = [23.685, 90.3563]; // Latitude, Longitude for a rough center of Bangladesh
    const initialZoom = 7; // Adjust zoom level as needed

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDistricts, setFilteredDistricts] = useState(districtsData);
    const [selectedDistrictForAction, setSelectedDistrictForAction] = useState(null); // The district to fly to and open popup for

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() === '') {
            // If query is empty, show all districts and clear selected action
            setFilteredDistricts(districtsData);
            setSelectedDistrictForAction(null);
        } else {
            const lowerCaseQuery = query.toLowerCase();
            const newFilteredDistricts = districtsData.filter(district =>
                district.district.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredDistricts(newFilteredDistricts);

            // Determine the best match to fly to and open popup for
            if (newFilteredDistricts.length > 0) {
                // Prefer an exact match if available
                const exactMatch = newFilteredDistricts.find(d => d.district.toLowerCase() === lowerCaseQuery);
                if (exactMatch) {
                    setSelectedDistrictForAction(exactMatch);
                } else {
                    // Otherwise, just take the first partial match
                    setSelectedDistrictForAction(newFilteredDistricts[0]);
                }
            } else {
                setSelectedDistrictForAction(null); // No matches
            }
        }
    };



    return (
        <div className=" mx-auto px-4 py-8">
            {/* Title */}
            <h1 className="text-4xl font-bold text-center mb-6">We are available in 64 districts</h1>

            {/* Search Bar (DaisyUI input example) */}
            <div className="flex justify-center mb-8">
                <label className="input input-bordered flex items-center gap-2 w-full max-w-lg">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Search for a district..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-4 h-4 opacity-70"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.965 11.023A5.004 5.004 0 0 1 1.945 2.059v1.088l.608.62L6 11.292 10.373 7.84c.327.28.718.529 1.143.722L12.7 11.297l-3.003 3.004L9.965 11.023ZM14.992 13.008l-2.008 2.008L11.59 14.59l2.008-2.008 1.4-1.4L14.992 13.008Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </label>
            </div>

            {/* Map Section */}
            <div className="relative z-0 h-[500px]" >
                {/*
          MapContainer: The main component for the map.
          center: Initial geographical center of the map.
          zoom: Initial zoom level.
          scrollWheelZoom: Enables/disables zooming with scroll wheel.
          className: Tailwind CSS for styling.
        */}
                <MapContainer
                    center={position}
                    zoom={initialZoom}
                    scrollWheelZoom={true}
                    className="rounded-lg shadow-lg"
                    style={{ height: '100%', width: '100%' }}
                >
                    {/*
            TileLayer: The base map tiles. This is what makes the map visible.
            attribution: Important for giving credit to the map data provider.
            url: The URL template for the map tiles. OpenStreetMap is free and commonly used.
          */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Markers for each district */}
                    {/* {districtsData.map((district, idx) => (
                        <Marker
                            key={idx}
                            icon={myCustomIcon}
                            position={[district.latitude, district.longitude]}>
                            <Popup>
                                <div className="font-bold text-lg">{district.region}, {district.district}</div>
                                <div>{district.covered_area.join(', ')}</div>
                            </Popup>
                        </Marker>
                    ))} */}

                    {/* Add the MapFlyToAndPopup component inside MapContainer */}
                    <MapFlyToAndPopup selectedDistrict={selectedDistrictForAction} />


                    {/* Markers for filtered districts */}
                    {filteredDistricts.map((district, idx) => (
                        <MarkerWithPopupControl
                            key={idx} // Using district name as key (assuming unique)
                            district={district}
                            selectedDistrictForAction={selectedDistrictForAction}
                        // icon={myCustomIcon} // Uncomment this line if you want to use your custom icon
                        />
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default CoveragePage;