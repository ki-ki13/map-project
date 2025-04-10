import { NextRequest, NextResponse } from 'next/server';
import { buildOverpassQuery, OverpassResponse } from '@/lib/overpassQuery';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const lat = url.searchParams.get('lat');
  const lon = url.searchParams.get('lon');
  const radius = url.searchParams.get('radius');

  if (!lat || !lon || !radius) {
    return NextResponse.json(
      { message: 'Missing required parameters' },
      { status: 400 }
    );
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  const searchRadius = parseInt(radius);

  if (isNaN(latitude) || isNaN(longitude) || isNaN(searchRadius)) {
    return NextResponse.json(
      { message: 'Invalid parameters' },
      { status: 400 }
    );
  }

  try {
    const query = buildOverpassQuery(latitude, longitude, searchRadius);
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: query
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: OverpassResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data from Overpass API:', error);
    return NextResponse.json(
      { 
        message: 'Error fetching data from Overpass API',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}