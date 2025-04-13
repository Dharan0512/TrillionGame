import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import { useState, useEffect } from 'react';
import { useMapContext } from '../context/MapContext';
import Navbar from './Navbar'; // assuming you have this component

const LocationMarker = ({ setLat, setLng, setPosition }) => {
  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return null;
};

export default function Navigator() {
  const [vehicleId] = useState('truck_001');
  const { sendLocation, fetchLocation, locationData } = useMapContext();
  const [lat, setLat] = useState(12.9716); // default lat (example: Bangalore)
  const [lng, setLng] = useState(77.5946); // default lng
  const [position, setPosition] = useState(null);

  useEffect(() => {
    fetchLocation(vehicleId);
  }, []);

  const sendCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setLat(lat);
      setLng(lng);

      try {
        sendLocation(vehicleId, lat, lng);
        alert('Location sent successfully!');
        fetchLocation(vehicleId);
      } catch (err) {
        console.error('Error sending location:', err);
      }
    });
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h2>🚚 Vehicle GPS Tracker</h2>

        <button
          onClick={sendCurrentLocation}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          Send Current Location
        </button>

        {locationData ? (
          <div
            style={{
              padding: '15px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              maxWidth: '400px',
            }}
          >
            <h4>📍 Last Known Location</h4>
            <p>
              <strong>Vehicle ID:</strong> {vehicleId}
            </p>
            <p>
              <strong>Latitude:</strong> {locationData.lat}
            </p>
            <p>
              <strong>Longitude:</strong> {locationData.lng}
            </p>
            <p>
              <strong>Time:</strong>{' '}
              {new Date(locationData.timestamp).toLocaleString()}
            </p>
          </div>
        ) : (
          <p>
            No location found for vehicle <b>{vehicleId}</b>.
          </p>
        )}
      </div>

      <div style={{ maxHeight: '500px', width: '500px' }}>
        <MapContainer
          center={[lat, lng]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {position && (
            <Marker position={position}>
              <Popup>You are here</Popup>
            </Marker>
          )}
          <LocationMarker setLat={setLat} setLng={setLng} setPosition={setPosition} />
        </MapContainer>
      </div>
    </>
  );
}