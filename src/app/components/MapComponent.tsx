import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface MapComponentProps {
  onLocationSelect: (lat: number, lng: number, radius: number) => void;
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

export default function MapComponent({ onLocationSelect }: MapComponentProps) {
  const [radius, setRadius] = useState(500);
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedPosition({ lat, lng });
    onLocationSelect(lat, lng, radius);
  };

  const handleRadiusChange = (value: number[]) => {
    const newRadius = value[0];
    setRadius(newRadius);
    if (selectedPosition) {
      onLocationSelect(selectedPosition.lat, selectedPosition.lng, newRadius);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Location Selector
          {selectedPosition && (
            <Badge variant="outline" className="ml-2">
              {selectedPosition.lat.toFixed(4)}, {selectedPosition.lng.toFixed(4)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="radius-slider">Search radius</Label>
              <Badge>{radius}m</Badge>
            </div>
            <Slider
              id="radius-slider"
              min={100}
              max={2000}
              step={100}
              value={[radius]}
              onValueChange={handleRadiusChange}
              className="w-full"
            />
          </div>
          
          <div className="h-96 w-full rounded-md overflow-hidden border">
            <MapContainer 
              center={[51.505, -0.09]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker onLocationSelect={handleLocationSelect} />
              {selectedPosition && (
                <Circle 
                  center={[selectedPosition.lat, selectedPosition.lng]} 
                  radius={radius} 
                  pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
                />
              )}
            </MapContainer>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Click on the map to select a location and analyze nearby businesses.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}