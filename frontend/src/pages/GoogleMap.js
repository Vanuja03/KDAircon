import React from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import '../styles/Map.css';

const containerStyle = {
    width: '400px',
    height: '400px'
};

// Center the map around KD Aircon Pvt Industries
const center = {
    lat: 6.7076738965723735,
    lng: 79.91852926984625
};

// Coordinates for 321/p1, Kalderam Maduwatte Rd, Panadura, Sri Lanka
const markerPosition = {
    lat: 6.713823,
    lng: 79.907585
};

function MyComponent() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyB68_aql3sF0byxacPPuklTmkEznTyxBJM"
    });

    const [map, setMap] = React.useState(null);

    const onLoad = React.useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);

    return isLoaded ? (
        <div className='map-container' style={{ width: '100%', height: '100%' }}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}  // Adjust the zoom level as needed
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                <Marker
                    position={markerPosition}
                    title="321/p1, Kalderam Maduwatte Rd, Panadura, Sri Lanka"
                />
                { /* Other child components, such as markers, info windows, etc. */}
                <></>
            </GoogleMap></div>
    ) : <></>
}

export default React.memo(MyComponent)
