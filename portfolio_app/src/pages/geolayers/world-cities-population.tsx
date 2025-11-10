import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import WebGLVectorLayer from 'ol/layer/WebGLVector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import Papa from 'papaparse';
import XYZ from 'ol/source/XYZ';
import { defaults as defaultInteractions } from 'ol/interaction';
import 'ol/ol.css';

type CityData = {
  city: string;
  lat: number;
  lng: number;
  country: string;
  population: number;
};

const circlesStyle = {
  'circle-radius': [
    'interpolate',
    ['linear'],
    ['get', 'population'],
    40000, 4,
    2000000, 14,
  ],
  'circle-fill-color': ['match', ['get', 'hover'], 1, '#ff3f3f', '#006688'],
  'circle-opacity': [
    'interpolate',
    ['linear'],
    ['get', 'population'],
    40000, 0.6,
    2000000, 0.92,
  ],
};

const tileSources = {
  osm: { name: 'OpenStreetMap', source: new OSM() },
  stamen: {
    name: 'Stamen Terrain',
    source: new XYZ({
      url: 'https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg',
    }),
  },
  esri: {
    name: 'Esri World Imagery',
    source: new XYZ({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    }),
  },
};

const MapPage: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);
  const tileLayerRef = useRef<TileLayer | null>(null);
  const selectedFeature = useRef<Feature | null>(null);
  const [tooltip, setTooltip] = useState<{ content: string; position: [number, number] } | null>(null);
  const [minPopulation, setMinPopulation] = useState(40000);
  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);
  const [selectedTileSource, setSelectedTileSource] = useState<keyof typeof tileSources>('osm');

  useEffect(() => {
    fetch('/data/worldcities.csv')
      .then((res) => res.text())
      .then((csvText) => {
        const parsed = Papa.parse<CityData>(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        });

        const features = parsed.data.map((city) =>
          new Feature({
            geometry: new Point(fromLonLat([city.lng, city.lat])),
            city: city.city,
            country: city.country,
            population: city.population,
            hover: 0,
          })
        );

        setAllFeatures(features);

        const vectorSource = new VectorSource({
          features: features.filter(f => f.get('population') >= minPopulation),
          wrapX: true,
        });
        vectorSourceRef.current = vectorSource;

        const vectorLayer = new WebGLVectorLayer({
          source: vectorSource,
          style: circlesStyle,
        });

        const tileLayer = new TileLayer({ source: tileSources[selectedTileSource].source });
        tileLayerRef.current = tileLayer;

        mapInstance.current = new Map({
          target: mapRef.current!,
          layers: [tileLayer, vectorLayer],
          view: new View({
            center: fromLonLat([0, 0]),
            zoom: 2,
          }),
          interactions: defaultInteractions({
            pinchZoom: true,
            dragPan: true,
          }),
          controls: [],
        });

        // Pointermove throttling
        let lastPointerTime = 0;
        mapInstance.current.on('pointermove', (ev) => {
          const now = Date.now();
          if (now - lastPointerTime < 80) return;
          lastPointerTime = now;

          const map = mapInstance.current!;
          if (selectedFeature.current) {
            selectedFeature.current.set('hover', 0);
            selectedFeature.current = null;
            setTooltip(null);
          }

          map.forEachFeatureAtPixel(
            ev.pixel,
            (feature) => {
              if (!(feature instanceof Feature)) return false;
              feature.set('hover', 1);
              selectedFeature.current = feature;

              const city = feature.get('city');
              const country = feature.get('country');
              const pop = feature.get('population');
              setTooltip({
                content: `${city}, ${country} — Population: ${pop.toLocaleString()}`,
                position: [ev.pixel[0] + 5, ev.pixel[1] + 100],
              });

              return true;
            },
            {
              hitTolerance: 5,
            }
          );
        });
      });

    return () => {
      mapInstance.current?.setTarget(undefined);
    };
  }, []);

  useEffect(() => {
    if (vectorSourceRef.current && allFeatures.length > 0) {
      const filtered = allFeatures.filter(f => f.get('population') >= minPopulation);
      vectorSourceRef.current.clear();
      vectorSourceRef.current.addFeatures(filtered);
    }
  }, [minPopulation, allFeatures]);

  useEffect(() => {
    if (tileLayerRef.current && mapInstance.current) {
      tileLayerRef.current.setSource(tileSources[selectedTileSource].source);
    }
  }, [selectedTileSource]);

  return (
    <div className="relative w-full h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">World Cities Population Map</h1>
        <p className="text-sm">Touch or hover over cities for info</p>
        <div className="mt-2">
          <label htmlFor="popRange" className="mr-2">
            Min Population: <strong>{minPopulation.toLocaleString()}</strong>
          </label>
          <input
            id="popRange"
            type="range"
            min={40000}
            max={2000000}
            step={10000}
            value={minPopulation}
            onChange={(e) => setMinPopulation(Number(e.target.value))}
            className="w-64"
          />
        </div>
        <div className="mt-2">
          <label htmlFor="tileSource" className="mr-2">Map Style:</label>
          <select
            id="tileSource"
            value={selectedTileSource}
            onChange={(e) => setSelectedTileSource(e.target.value as keyof typeof tileSources)}
            className="text-black p-1 rounded"
          >
            {Object.entries(tileSources).map(([key, { name }]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>
      </header>
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ touchAction: 'pan-x pan-y' }} // enable natural touch gestures
      />
      {tooltip && (
        <div
          className="absolute bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs pointer-events-none"
          style={{
            top: tooltip.position[1],
            left: tooltip.position[0],
            whiteSpace: 'nowrap',
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default MapPage;
