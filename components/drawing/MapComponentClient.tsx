import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import html2canvas from 'html2canvas';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

const MapComponentClient = () => {
  const mapRef = useRef<L.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check if the code is running in the browser
    if (typeof window !== 'undefined' && mapRef.current === null) {
      // Initialize the map
      const map = L.map('map').setView([51.505, -0.09], 13);
      mapRef.current = map;

      // Add a tile layer with Mapbox satellite tiles
      L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`, {
        attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors',
        tileSize: 512,
        zoomOffset: -1,
        maxZoom: 40 // Set the maximum zoom level
      }).addTo(map);

      // Initialize the FeatureGroup to store editable layers
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      // Initialize the draw control and pass it the FeatureGroup of editable layers
      const drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItems
        }
      });
      map.addControl(drawControl);

      // Handle the creation of new shapes
      map.on(L.Draw.Event.CREATED, (event) => {
        const layer = event.layer;
        drawnItems.addLayer(layer);
      });

      // Initialize the geosearch control
      const provider = new OpenStreetMapProvider();
      const searchControl = new GeoSearchControl({
        provider: provider,
        style: 'bar',
        autoComplete: true,
        autoCompleteDelay: 250,
        showMarker: true,
        retainZoomLevel: false,
        animateZoom: true,
        keepResult: true,
        searchLabel: 'Enter address'
      });
      map.addControl(searchControl);
    }
  }, []);

  const handleDownload = async () => {
    if (mapRef.current) {
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        const canvas = await html2canvas(mapContainer);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'map-drawing.png';
        link.click();
      }
    }
  };

  return (
    <>
      <div id="map" style={{ height: '500px', width: '100%' }}></div>
      <button onClick={handleDownload} className="light-dark-btn">
        Download Drawing
      </button>
    </>
  );
};

export default MapComponentClient;