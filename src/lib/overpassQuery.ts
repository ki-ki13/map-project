export function buildOverpassQuery(lat:number, lon:number, radius: number):string {
    return `
    [out:json][timeout:25];
    (
      node["shop"](around:${radius},${lat},${lon});
      node["amenity"](around:${radius},${lat},${lon});
      node["tourism"](around:${radius},${lat},${lon});
      node["leisure"](around:${radius},${lat},${lon});
      node["office"](around:${radius},${lat},${lon});
      way["shop"](around:${radius},${lat},${lon});
      way["amenity"](around:${radius},${lat},${lon});
      way["tourism"](around:${radius},${lat},${lon});
      way["leisure"](around:${radius},${lat},${lon});
      way["office"](around:${radius},${lat},${lon});
    );
    out body;
    >;
    out skel qt;
  `;
}

export interface OverpassNode {
    id:number;
    lat:number;
    lon:number;
    tags: {
        name?:string;
        shop?:string;
        amenity?:string;
        tourism?:string;
        leisure?:string;
        office?:string;
        [key:string]:string | undefined;
    };
}

export interface OverpassResponse {
    elements: OverpassNode[];
}

export function groupBusinessesByType(data: OverpassResponse): Record<string, number> {
    const businessTypes: Record<string, number> = {};
  
    data.elements.forEach(element => {
      if (element.tags) {
        let type = element.tags.shop || 
                  element.tags.amenity || 
                  element.tags.tourism || 
                  element.tags.leisure || 
                  element.tags.office;
        
        if (type) {
          businessTypes[type] = (businessTypes[type] || 0) + 1;
        }
      }
    });
  
    return businessTypes;
  }