import React from "react";
import { useLoadScript } from "@react-google-maps/api";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { MapPin } from "lucide-react";

interface Coordinates {
  lat: number;
  lng: number;
}

interface GoogleAddressSearchProps {
  selectedAddress: (value: any) => void;
  setCoordinates: (value: any) => void;
}

const GoogleAddressSearch: React.FC<GoogleAddressSearchProps> = ({
  selectedAddress,
  setCoordinates,
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY as string,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex items-center w-full">
      <MapPin className="h-10 w-10 p-2 rounded-l-lg text-primary bg-purple-200" />
      <GooglePlacesAutocomplete
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
        selectProps={{
          placeholder: "Search Property Address",
          isClearable: true,
          className: "w-full",
          onChange: (place) => {
            if (place) {
              console.log(place);
              selectedAddress(place);
              geocodeByAddress(place.label)
                .then((result) => getLatLng(result[0]))
                .then(({ lat, lng }) => {
                  setCoordinates({ lat, lng });
                });
            }
          },
        }}
      />
    </div>
  );
};

export default GoogleAddressSearch;
