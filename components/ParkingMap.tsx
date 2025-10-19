import React, { useEffect, useRef, useState } from 'react';
import type { ParkingLot } from '../types';

interface ParkingMapProps {
  lots: ParkingLot[];
  hoveredLotId: string | null;
  onMarkerClick: (lot: ParkingLot) => void;
  onMarkerHover: (id: string | null) => void;
  panToLot: ParkingLot | null;
}

// FIX: Change google.maps.MapTypeStyle to any as TypeScript doesn't know about the google namespace from the script tag.
const mapStyles: any[] = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
];

export const ParkingMap: React.FC<ParkingMapProps> = ({ lots, hoveredLotId, onMarkerClick, onMarkerHover, panToLot }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  // FIX: Change google.maps.Map to any as TypeScript doesn't know about the google namespace from the script tag.
  const [map, setMap] = useState<any | null>(null);
  // FIX: Change google.maps.marker.AdvancedMarkerElement to any as TypeScript doesn't know about the google namespace from the script tag.
  const [markers, setMarkers] = useState<{ [id: string]: any }>({});

  useEffect(() => {
    if (mapRef.current && !map) {
      // FIX: Cast window to any to access google property which is loaded from an external script.
      const newMap = new (window as any).google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.0060 }, // Default center
        zoom: 13,
        mapId: 'PARKPREDICT_MAP_ID',
        styles: mapStyles
      });
      setMap(newMap);
    }
  }, [mapRef, map]);

  useEffect(() => {
    if (map && lots.length > 0) {
      // FIX: Cast window to any to access google property which is loaded from an external script.
      const bounds = new (window as any).google.maps.LatLngBounds();
      
      // Clear old markers that are not in the new `lots` array
      Object.keys(markers).forEach(markerId => {
        if (!lots.find(lot => lot.id === markerId)) {
          markers[markerId].map = null;
          delete markers[markerId];
        }
      });
      
      const newMarkers = { ...markers };

      lots.forEach((lot) => {
        const position = { lat: lot.lat, lng: lot.lng };
        bounds.extend(position);
        
        if (newMarkers[lot.id]) {
          // Update existing marker position if needed
          newMarkers[lot.id].position = position;
        } else {
          // Create new marker
          const priceTag = document.createElement('div');
          priceTag.className = 'marker-price-tag';
          priceTag.textContent = `$${lot.pricePerHour}`;
          
          // FIX: Cast window to any to access google property which is loaded from an external script.
          const marker = new (window as any).google.maps.marker.AdvancedMarkerElement({
            position,
            map,
            title: lot.name,
            content: priceTag,
          });

          marker.addListener('click', () => onMarkerClick(lot));
          marker.content.addEventListener('mouseenter', () => onMarkerHover(lot.id));
          marker.content.addEventListener('mouseleave', () => onMarkerHover(null));

          newMarkers[lot.id] = marker;
        }
      });

      setMarkers(newMarkers);
      if (lots.length > 1 && !panToLot) { // Only fit bounds on initial load, not on hover
        map.fitBounds(bounds, 100); // 100px padding
      } else if (lots.length === 1) {
        map.setCenter(bounds.getCenter());
        map.setZoom(15);
      }
    }
  }, [map, lots, onMarkerClick, onMarkerHover]);


  useEffect(() => {
    Object.values(markers).forEach(marker => {
      const markerElement = marker.content as HTMLElement;
      if (markerElement) {
        const isHovered = marker.title === lots.find(lot => lot.id === hoveredLotId)?.name;
        if (isHovered) {
          markerElement.classList.add('hovered');
        } else {
          markerElement.classList.remove('hovered');
        }
      }
    });
  }, [hoveredLotId, markers, lots]);

  useEffect(() => {
    if (map && panToLot) {
        map.panTo({ lat: panToLot.lat, lng: panToLot.lng });
        if (map.getZoom()! < 14) {
            map.setZoom(14);
        }
    }
  }, [map, panToLot]);

  return (
    <>
        <style>{`
            .marker-price-tag {
                padding: 4px 8px;
                background-color: #1E293B;
                color: white;
                border-radius: 9999px;
                font-weight: bold;
                font-size: 14px;
                border: 2px solid white;
                transition: all 0.2s ease-in-out;
                transform-origin: center;
            }
            .marker-price-tag.hovered {
                background-color: #0052FF;
                border-color: #FFC107;
                cursor: pointer;
                z-index: 10;
                animation: pulse 1.5s infinite ease-in-out;
            }
            @keyframes pulse {
                0% {
                    transform: scale(1.1);
                    box-shadow: 0 0 0 0px rgba(0, 82, 255, 0.7);
                }
                50% {
                    transform: scale(1.25);
                    box-shadow: 0 0 0 8px rgba(0, 82, 255, 0);
                }
                100% {
                    transform: scale(1.1);
                    box-shadow: 0 0 0 0px rgba(0, 82, 255, 0);
                }
            }
        `}</style>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </>
  );
};