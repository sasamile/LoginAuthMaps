import React, { useCallback, useEffect, useState } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "80vh",
  borderRadius: 10,
};

interface GoogleMapSectionProps {
  coordinates: { lat: number; lng: number } | null;
}

const GoogleMapSection: React.FC<GoogleMapSectionProps> = ({ coordinates }) => {
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 4.142,
    lng: -73.626,
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Actualizar el centro del mapa cuando las coordenadas cambian
  useEffect(() => {
    if (coordinates) {
      setCenter(coordinates);
      if (map) {
        map.setCenter(coordinates);
        map.setZoom(14); // Ajustar el zoom cuando cambien las coordenadas
      }
    }
  }, [coordinates, map]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);
      if (coordinates) {
        map.setCenter(coordinates);
        map.setZoom(14);
      } else {
        map.setZoom(14); // Zoom por defecto si no hay coordenadas
      }
    },
    [coordinates]
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <div className="w-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10} // Zoom inicial por defecto
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: true,
          gestureHandling: "none",
          draggable: false,
        }}
      >
        {/* Añadir un marcador si las coordenadas son válidas */}
        {coordinates && coordinates.lat !== 0 && coordinates.lng !== 0 ? ( // Verificación simplificada
          <MarkerF
            position={coordinates}
            icon={{
              url: "/ping.png", // Asegúrate de que esta URL sea correcta
              scaledSize: new google.maps.Size(60, 60), // Escalado del icono
            }}
          />
        ) : (
          <MarkerF
            position={{ lat: 4.142, lng: -73.626 }} // Marcador por defecto si no hay coordenadas
            icon={{
              url: "/ping.png", // Asegúrate de que esta URL sea correcta
              scaledSize: new google.maps.Size(60, 60), // Escalado del icono
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapSection;
