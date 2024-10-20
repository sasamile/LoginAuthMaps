import { MarkerF, OverlayView } from '@react-google-maps/api';
import React, { useState } from 'react';
import MarkerListingItem from './MarkerListingItem';

interface ListingImage {
  url: string;
  listing_id: number;
}

interface ListingItem {
  id: number;
  address: string;
  bedroom: number;
  bathroom: number;
  price: number;
  coordinates: { lat: number; lng: number };
  listingImages: ListingImage[];
}

interface MarkerItemProps {
  item: ListingItem;
}

const MarkerItem: React.FC<MarkerItemProps> = ({ item }) => {
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);

  return (
    <div>
      <MarkerF
        position={item.coordinates}
        onClick={() => setSelectedListing(item)}
        icon={{
          url: '/ping.png',
          scaledSize: new google.maps.Size(60, 60), // Asegúrate de usar el escalado correcto
        }}
      />
      
      {/* Solo muestra el OverlayView si el listado está seleccionado */}
      {selectedListing && selectedListing.coordinates && (
        <OverlayView
          position={selectedListing.coordinates} // Asegúrate de que las coordenadas existan
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div>
            <MarkerListingItem 
              closeHandler={() => setSelectedListing(null)}
              item={selectedListing} 
            />
          </div>
        </OverlayView>
      )}
    </div>
  );
};

export default MarkerItem;
