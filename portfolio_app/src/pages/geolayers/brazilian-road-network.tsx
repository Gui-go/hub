'use client';

import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import { LineString } from 'ol/geom';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Overlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';

interface RoadSegment {
  geom: string;
  objectid: number;
  codigo: string;
  tipo_pnv: string | null;
  desc_seg: string;
}

const pseudoData: RoadSegment[] = [
  {
    geom: "LINESTRING(-35.1468769978752 -8.8985496994091, -5.1482950084079 -8.89831969689652)",
    objectid: 7353,
    codigo: "AC7353",
    tipo_pnv: null,
    desc_seg: "ACESSO SÃO JOSÉ DA COROA GRANDE",
  },
  {
    geom: "LINESTRING(-48.9587511806225 -22.4626172284024, -48.9883743946626 -22.4700551748065, -48.990123456789 -22.4712345678901)",
    objectid: 16860,
    codigo: "AC16860",
    tipo_pnv: "BR",
    desc_seg: "ACESSO AGUDOS",
  },
  {
    geom: "LINESTRING(-49.9203833608034 -29.2949805363227, -49.9242513062527 -29.2761904890998, -49.9230070222563 -29.2702132323548, -49.9108391383156 -29.2581795002837)",
    objectid: 16142,
    codigo: "494ERS0050",
    tipo_pnv: null,
    desc_seg: "ENTR. BR/453 (P/TORRES) - MAMPITUBA",
  },
  {
    geom: "LINESTRING(-47.1366858681583 -23.5432923161874, -47.1821459338877 -23.5462647077501, -47.190123456789 -23.5487654321098)",
    objectid: 16868,
    codigo: "AC16868",
    tipo_pnv: "SP",
    desc_seg: "ACESSO MAIRINQUE",
  },
  {
    geom: "LINESTRING(-39.1390266611515 -3.46783183237318, -39.1433689387255 -3.45779101594263, -39.1477099626447 -3.44032965139229)",
    objectid: 6799,
    codigo: "AC6799",
    tipo_pnv: null,
    desc_seg: "ACESSO PARAIPABA",
  },
];

const Home: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const [roadData, setRoadData] = useState<RoadSegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://www.guigo.dev.br/api/fetchRoads')
      .then((res) => {
        if (!res.ok) throw new Error('API request failed');
        return res.json();
      })
      .then((data) => {
        setRoadData(data.results);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Failed to fetch data. Using sample data instead.');
        setRoadData(pseudoData);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!mapRef.current || !popupRef.current || roadData.length === 0) return;

    const features = roadData.map((segment) => {
      const coords = segment.geom
        .replace('LINESTRING(', '')
        .replace(')', '')
        .split(', ')
        .map((pair) => {
          const [lon, lat] = pair.split(' ').map(Number);
          return fromLonLat([lon, lat]);
        });

      const feature = new Feature({
        geometry: new LineString(coords),
        objectid: segment.objectid,
        codigo: segment.codigo,
        desc_seg: segment.desc_seg,
        tipo_pnv: segment.tipo_pnv,
      });

      return feature;
    });

    const vectorSource = new VectorSource({ features });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: (feature) =>
        new Style({
          stroke: new Stroke({
            color: feature.get('objectid') === overlayRef.current?.get('selectedId') ? '#FBBF24' : '#2563EB',
            width: feature.get('objectid') === overlayRef.current?.get('selectedId') ? 4 : 2.5,
            lineCap: 'round',
            lineJoin: 'round',
          }),
        }),
    });

    const map = new Map({
      target: mapRef.current,
      controls: defaultControls({ zoom: false, attribution: false, rotate: false }),
      layers: [
        new TileLayer({
          source: new OSM(),
          opacity: 0.9,
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([-40, -15]),
        zoom: 5,
        smoothExtentConstraint: true,
      }),
    });

    const overlay = new Overlay({
      element: popupRef.current,
      autoPan: {
        animation: { duration: 300 },
        margin: 20,
      },
      positioning: 'bottom-center',
      offset: [0, -10],
    });

    overlayRef.current = overlay;
    map.addOverlay(overlay);

    map.on('click', (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f);
      if (feature) {
        const coordinates = event.coordinate;
        const properties = feature.getProperties();
        overlay.set('selectedId', properties.objectid);
        vectorLayer.changed();

        popupRef.current!.innerHTML = `
          <div class="bg-white p-5 rounded-2xl shadow-xl border border-gray-100 max-w-sm transform transition-all duration-200 hover:shadow-2xl">
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-semibold text-xl text-blue-800 tracking-tight">${properties.desc_seg}</h3>
              <button class="text-gray-400 hover:text-gray-600 transition-colors duration-150" onclick="this.closest('.ol-overlay-container').style.display='none'">✕</button>
            </div>
            <div class="space-y-2">
              <p class="text-sm text-gray-700"><span class="font-medium text-gray-900">ID:</span> ${properties.objectid}</p>
              <p class="text-sm text-gray-700"><span class="font-medium text-gray-900">Código:</span> ${properties.codigo}</p>
              <p class="text-sm text-gray-700"><span class="font-medium text-gray-900">Tipo PNV:</span> ${properties.tipo_pnv || 'N/A'}</p>
              <p class="text-xs text-gray-500 truncate"><span class="font-medium text-gray-700">Geom:</span> ${properties.geometry.toString().slice(0, 30)}...</p>
            </div>
          </div>
        `;

        overlay.setPosition(coordinates);
      } else {
        overlay.setPosition(undefined);
        overlay.set('selectedId', null);
        vectorLayer.changed();
      }
    });

    return () => {
      map.setTarget(undefined);
    };
  }, [roadData]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-b from-blue-50 to-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447-2.724A1 1 0 0021 13.382V2.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h1 className="text-2xl font-bold tracking-tight">Brazilian Road Network</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium bg-blue-700 bg-opacity-50 px-3 py-1 rounded-full">
            {isLoading ? 'Loading data...' : error ? error : `${roadData.length} segments loaded`}
          </span>
        </div>
      </header>

      <div className="flex-grow relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-10">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )}
        <div ref={mapRef} className="absolute inset-0" />
        <div ref={popupRef} className="popup pointer-events-auto" />

        {/* Hide OpenLayers UI completely */}
        <style jsx global>{`
          .ol-attribution,
          .ol-zoom,
          .ol-rotate {
            display: none !important;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Home;

