import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MapComponentProps {
  onLocationSelect: (lat: number, lng: number, radius: number) => void;
}

interface GeocodingResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  boundingbox: string[];
}

function LocationMarker({
  onLocationSelect,
  setMapCenter,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
  setMapCenter: (center: [number, number], zoom: number) => void;
}) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      setMapCenter([e.latlng.lat, e.latlng.lng], map.getZoom());
    },
  });

  return position === null ? null : <Marker position={position} />;
}

function ChangeView({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

export default function MapComponent({ onLocationSelect }: MapComponentProps) {
  const [radius, setRadius] = useState(500);
  const [selectedPosition, setSelectedPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]);
  const [mapZoom, setMapZoom] = useState(13);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedPosition({ lat, lng });
    onLocationSelect(lat, lng, radius);
  };

  const updateMapCenter = (center: [number, number], zoom: number) => {
    setMapCenter(center);
    setMapZoom(zoom);
  };

  const handleRadiusChange = (value: number[]) => {
    const newRadius = value[0];
    setRadius(newRadius);
    if (selectedPosition) {
      onLocationSelect(selectedPosition.lat, selectedPosition.lng, newRadius);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/geocode?query=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: GeocodingResult[] = await response.json();
      setSearchResults(data);
      setIsPopoverOpen(true);
    } catch (error) {
      console.error("Error searching for location:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect2 = (result: GeocodingResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    setSelectedPosition({ lat, lng });
    setMapCenter([lat, lng]);
    setMapZoom(15);
    onLocationSelect(lat, lng, radius);
    setIsPopoverOpen(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Location Selector
          {selectedPosition && (
            <Badge variant="outline" className="ml-2">
              {selectedPosition.lat.toFixed(4)},{" "}
              {selectedPosition.lng.toFixed(4)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Search input and results - Positioned with a relative wrapper */}
          <div className="relative z-20">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <div className="flex-1 flex space-x-2">
                  <Input
                    placeholder="Search for a location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} disabled={isSearching}>
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="p-0 w-[320px] max-h-[300px] overflow-auto"
                align="start"
                side="bottom"
                sideOffset={5}
              >
                <Command>
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Locations">
                      {searchResults.map((result) => (
                        <CommandItem
                          key={result.place_id}
                          onSelect={() => handleLocationSelect2(result)}
                          className="cursor-pointer"
                        >
                          <div className="truncate">{result.display_name}</div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

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

          {/* Map container with lower z-index */}
          <div className="h-96 w-full rounded-md overflow-hidden border relative z-10">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: "100%", width: "100%" }}
            >
              <ChangeView center={mapCenter} zoom={mapZoom} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker
                onLocationSelect={handleLocationSelect}
                setMapCenter={updateMapCenter}
              />
              {selectedPosition && (
                <Circle
                  center={[selectedPosition.lat, selectedPosition.lng]}
                  radius={radius}
                  pathOptions={{
                    color: "blue",
                    fillColor: "blue",
                    fillOpacity: 0.2,
                  }}
                />
              )}
            </MapContainer>
          </div>

          <div className="text-sm text-muted-foreground">
            Search for a location or click on the map to analyze nearby
            businesses.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
