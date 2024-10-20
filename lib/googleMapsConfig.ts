// googleMapsConfig.ts
import { Libraries } from '@react-google-maps/api';

export const libraries: Libraries = ['places'];

export const mapContainerStyle: React.CSSProperties = {
  width: "100%",
  height: "80vh",
  borderRadius: 10,
};

export const defaultCenter: google.maps.LatLngLiteral = {
  lat: 4.142,
  lng: -73.626,
};