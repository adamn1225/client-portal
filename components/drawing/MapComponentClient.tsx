import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import html2canvas from 'html2canvas';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

declare let L: any;

const MapComponentClient = () => {
  const mapRef = useRef<L.Map | null>(null);
  const [activeLayer, setActiveLayer] = useState<'osm' | 'satellite'>('satellite');
  const [tilesLoaded, setTilesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the code is running in the browser
    if (typeof window !== 'undefined' && mapRef.current === null) {
      // Import leaflet dynamically
      const L = require('leaflet');
      require('leaflet-draw');
      require('leaflet-geosearch');

      // Initialize the map
      const map = L.map('map').setView([51.505, -0.09], 13);
      mapRef.current = map;

      // Add a tile layer with OpenStreetMap tiles
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      });

      // Add a tile layer with Mapbox satellite tiles
      const satelliteLayer = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`, {
        maxZoom: 19,
        tileSize: 512,
        zoomOffset: -1,
      }).addTo(map); // Add satelliteLayer to the map by default

      // Add layer control to switch between layers
      const baseLayers = {
        'OpenStreetMap': osmLayer,
        'Satellite': satelliteLayer,
      };

      const layerControl = L.control.layers(baseLayers).addTo(map);

      // Update active layer state when layer is changed
      map.on('baselayerchange', (e: any) => {
        setActiveLayer(e.name === 'Satellite' ? 'satellite' : 'osm');
      });

      // Listen for tile load events to ensure all tiles are loaded
      let tilesToLoad = 0;
      map.on('tileloadstart', () => {
        tilesToLoad++;
        setTilesLoaded(false);
        setLoading(true);
        console.log('Tile load started. Tiles to load:', tilesToLoad);
      });

      map.on('tileload', () => {
        tilesToLoad--;
        console.log('Tile loaded. Tiles to load:', tilesToLoad);
        if (tilesToLoad === 0) {
          setTilesLoaded(true);
          setLoading(false);
          console.log('All tiles loaded.');
        }
      });

      map.on('tileerror', (error: any) => {
        console.error('Tile load error:', error);
      });

      // Initialize the FeatureGroup to store editable layers
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      // Initialize the draw control and pass it the FeatureGroup of editable layers
      const drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItems,
        },
      });
      map.addControl(drawControl);

      // Handle the creation of new shapes
      map.on(L.Draw.Event.CREATED, (event: { layer: any }) => {
        const layer = event.layer;
        drawnItems.addLayer(layer);
      });

      // Initialize the geosearch control
      const provider = new OpenStreetMapProvider();
      const searchControl = GeoSearchControl({
        provider: provider,
        style: 'bar',
        autoComplete: true,
        autoCompleteDelay: 250,
        showMarker: true,
        retainZoomLevel: false,
        animateZoom: true,
        keepResult: true,
        searchLabel: 'Enter address',
      });
      map.addControl(searchControl);
    }
  }, []);

  const handleDownload = async () => {
    if (mapRef.current && tilesLoaded) {
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        // Wait for a short delay to ensure the map is fully rendered
        setTimeout(async () => {
          const canvas = await html2canvas(mapContainer, {
            useCORS: true, // Enable cross-origin resource sharing
            allowTaint: false, // Allow tainted canvas
          });
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = 'map-drawing.png';
          link.click();
        }, 500); // Adjust the delay as needed
      }
    } else {
      alert('Please wait for the map tiles to load completely before downloading.');
    }
  };

  return (
    <>
      <div id="map" style={{ height: '500px', width: '100%' }}></div>
      {loading && <p>Loading map tiles...</p>}
      <span className=' mt-2'>
        <button onClick={handleDownload} className="light-dark-btn" disabled={loading}>
          Download Drawing
        </button>
      </span>
    </>
  );
};

export default dynamic(() => Promise.resolve(MapComponentClient), { ssr: false });