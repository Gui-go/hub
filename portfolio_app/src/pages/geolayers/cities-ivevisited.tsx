'use client';

import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat, get as getProjection } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { Point } from 'ol/geom';
import Feature from 'ol/Feature';
import { Style, Circle, Fill, Stroke, Text } from 'ol/style';
import Overlay from 'ol/Overlay';
import { defaults as defaultControls, FullScreen, ScaleLine } from 'ol/control';
import { boundingExtent } from 'ol/extent';

type City = {
  name: string;
  lon: number;
  lat: number;
};


// 
// 
// 
// 
// 
// 
// 
// 
// 
// 

// 
// 
// 

const cities: City[] = [
  { name: "Florianópolis, Santa Catarina", lon: -48.564151, lat: -27.59355 },
  { name: "São José, Santa Catarina", lon: -48.6367, lat: -27.6136 },
  { name: "Palhoça, Santa Catarina", lon: -48.6691, lat: -27.6458 },
  { name: "Biguaçu, Santa Catarina", lon: -48.659, lat: -27.4956 },
  { name: "Santo Amaro da Imperatriz, Santa Catarina", lon: -48.7817, lat: -27.6858 },
  { name: "Chapecó, Santa Catarina", lon: -52.6152, lat: -27.0964 },
  { name: "Joinville, Santa Catarina", lon: -48.8451, lat: -26.3045 },
  { name: "Blumenau, Santa Catarina", lon: -49.0661, lat: -26.9155 },
  { name: "Jaraguá do Sul, Santa Catarina", lon: -49.0713, lat: -26.4851 },
  { name: "Balneário Camboriú, Santa Catarina", lon: -48.6175, lat: -26.9926 },
  { name: "Lages, Santa Catarina", lon: -50.326, lat: -27.816 },
  { name: "Criciúma, Santa Catarina", lon: -49.3697, lat: -28.6775 },
  { name: "Porto Alegre, Rio Grande do Sul", lon: -51.230, lat: -30.033 },
  { name: "Cananéia, São Paulo", lon: -47.927, lat: -25.015 },
  { name: "Morretes, Paraná", lon: -48.834, lat: -25.477 },
  { name: "São Francisco do Sul, Santa Catarina", lon: -48.638, lat: -26.243 },
  { name: "Brusque, Santa Catarina", lon: -48.911, lat: -27.098 },
  { name: "Imbituba, Santa Catarina", lon: -48.666, lat: -28.229 },
  { name: "Urubici, Santa Catarina", lon: -49.593, lat: -28.015 },
  { name: "Penha, Santa Catarina", lon: -48.646, lat: -26.769 },
  { name: "Guarulhos, São Paulo", lon: -46.533, lat: -23.454 },
  { name: "Piracicaba, São Paulo", lon: -47.649, lat: -22.725 },
  { name: "Curitiba, Paraná", lon: -49.2775, lat: -25.4284 },
  { name: "São Paulo, São Paulo", lon: -46.6333, lat: -23.5505 },
  { name: "Campinas, São Paulo", lon: -47.0626, lat: -22.9056 },
  { name: "Rio Claro, São Paulo", lon: -47.556, lat: -22.3988 },
  { name: "Rio de Janeiro, Rio de Janeiro", lon: -43.1729, lat: -22.9068 },
  { name: "Niterói, Rio de Janeiro", lon: -43.104, lat: -22.883 },
  { name: "Foz do Iguaçu, Paraná", lon: -54.5881, lat: -25.5163 },

  { name: "Puerto Iguazú, Argentina", lon: -54.5736, lat: -25.5991 },

  { name: "Asunción, Paraguay", lon: -57.5759, lat: -25.2637 },
  { name: "Ciudad del Este, Paraguay", lon: -54.6111, lat: -25.5097 },

  { name: "Panama City, Panama", lon: -79.5199, lat: 8.9824 },
  { name: "Colón, Panama", lon: -79.9068, lat: 9.356 },

  { name: "Washington DC, USA", lon: -77.0369, lat: 38.9072 },

  { name: "Lisbon, Portugal", lon: -9.1393, lat: 38.7223 },
  { name: "Porto, Portugal", lon: -8.6102, lat: 41.1496 },
  { name: "Loures, Portugal", lon: -9.1689, lat: 38.8309 },
  { name: "Vila Nova de Gaia, Portugal", lon: -8.6110, lat: 41.1336 },
  { name: "Ericeira, Portugal", lon: -9.4167, lat: 38.9667 },
  { name: "Estoril, Portugal", lon: -9.3977, lat: 38.7057 },
  { name: "Alcabideche, Portugal", lon: -9.4197, lat: 38.7336 },
  { name: "Amadora, Portugal", lon: -9.2308, lat: 38.7597 },
  { name: "Óbidos, Portugal", lon: -9.1567, lat: 39.3600 },
  { name: "Covilhã, Portugal", lon: -7.5000, lat: 40.2833 },
  { name: "Foz do Arelho, Portugal", lon: -9.2167, lat: 39.4333 },
  { name: "Faro, Portugal", lon: -7.9304, lat: 37.0194 },
  { name: "Coimbra, Portugal", lon: -8.4265, lat: 40.2033 },
  { name: "Braga, Portugal", lon: -8.4253, lat: 41.5331 },
  { name: "Aveiro, Portugal", lon: -8.6455, lat: 40.6443 },
  { name: "Setúbal, Portugal", lon: -8.8882, lat: 38.5244 },
  { name: "Vila Real de Santo António, Portugal", lon: -7.4208, lat: 37.199 },
  { name: "Elvas, Portugal", lon: -7.1633, lat: 38.8815 },
  { name: "Évora, Portugal", lon: -7.9065, lat: 38.5714 },
  { name: "Guarda, Portugal", lon: -7.2637, lat: 40.5364 },
  { name: "Fundão, Portugal", lon: -7.5003, lat: 40.141 },
  { name: "Albufeira, Portugal", lon: -8.253, lat: 37.095 },
  { name: "Almada, Portugal", lon: -9.161, lat: 38.679 },
  { name: "Cascais, Portugal", lon: -9.422, lat: 38.697 },
  { name: "Oeiras, Portugal", lon: -9.311, lat: 38.691 },
  { name: "Carcavelos, Portugal", lon: -9.333, lat: 38.683 },
  { name: "Parede, Portugal", lon: -9.354, lat: 38.693 },
  { name: "Cascais, Portugal", lon: -9.422, lat: 38.697 },
  { name: "Sintra, Portugal", lon: -9.381, lat: 38.797 },
  { name: "Peniche, Portugal", lon: -9.381, lat: 39.356 },
  { name: "Odivelas, Portugal", lon: -9.164, lat: 38.793 },
  { name: "Caldas da Rainha, Portugal", lon: -9.134, lat: 39.407 },
  { name: "Manteigas, Portugal", lon: -7.539, lat: 40.402 },
  { name: "Viseu, Portugal", lon: -7.912, lat: 40.661 },

  { name: "Ayamonte, Spain", lon: -7.404, lat: 37.214 },
  { name: "Mérida, Spain", lon: -6.344, lat: 38.916 },
  { name: "Cáceres, Spain", lon: -6.372, lat: 39.476 },
  { name: "Toledo, Spain", lon: -4.023, lat: 39.862 },
  { name: "Tarifa, Spain", lon: -5.606, lat: 36.013 },
  { name: "Cáceres, Spain", lon: -6.372, lat: 39.476 },
  { name: "Algeciras, Spain", lon: -5.441, lat: 36.140 },
  { name: "La Línea de la Concepción, Spain", lon: -5.348, lat: 36.168 },
  { name: "Marbella, Spain", lon: -4.882, lat: 36.515 },
  { name: "Ronda, Spain", lon: -5.167, lat: 36.742 },
  { name: "Marbella, Spain", lon: -4.882, lat: 36.515 },
  { name: "Setenil de las Bodegas, Spain", lon: -5.181, lat: 36.864 },
  { name: "Marbella, Spain", lon: -4.882, lat: 36.515 },
  { name: "Madrid, Spain", lon: -3.7038, lat: 40.4168 },
  { name: "Barcelona, Spain", lon: 2.1734, lat: 41.3851 },
  { name: "Badajoz, Spain", lon: -6.9707, lat: 38.8794 },
  { name: "Salamanca, Spain", lon: -5.6631, lat: 40.9701 },
  { name: "Seville, Spain", lon: -5.9845, lat: 37.3891 },
  { name: "Málaga, Spain", lon: -4.4203, lat: 36.7213 },
  { name: "Granada, Spain", lon: -3.5986, lat: 37.1773 },
  { name: "Córdoba, Spain", lon: -4.7794, lat: 37.8882 },
  { name: "Cádiz, Spain", lon: -6.2946, lat: 36.5297 },
  { name: "Valencia, Spain", lon: -0.3774, lat: 39.4699 },
  { name: "Castellón de la Plana, Spain", lon: -0.0576, lat: 39.9864 },

  { name: "Gibraltar, United Kingdom", lon: -5.3436, lat: 36.1408 },
  
  { name: "London, England", lon: -0.1276, lat: 51.5074 },
  { name: "Manchester, England", lon: -2.2426, lat: 53.4808 },

  { name: "Dublin, Ireland", lon: -6.2603, lat: 53.3498 },
  { name: "Cork, Ireland", lon: -8.4761, lat: 51.8969 },
  { name: "Belfast, Ireland", lon: -5.9301, lat: 54.5973 },
  { name: "Limerick, Ireland", lon: -8.6291, lat: 52.668 },
  { name: "Galway, Ireland", lon: -9.0488, lat: 53.2707 },

  { name: "Edinburgh, Scotland", lon: -3.1883, lat: 55.953 },

  { name: "Münster, Germany", lon: 7.6261, lat: 51.9607 },
  { name: "Dortmund, Germany", lon: 7.4686, lat: 51.5136 },
  { name: "Bonn, Germany", lon: 7.0982, lat: 50.7374 },
  { name: "Wesseling, Germany", lon: 6.975, lat: 50.827 },
  { name: "Wuppertal, Germany", lon: 7.1864, lat: 51.2563 },
  { name: "Essen, Germany", lon: 7.0123, lat: 51.4556 },
  { name: "Duisburg, Germany", lon: 6.7735, lat: 51.4344 },
  { name: "Köln, Germany", lon: 6.9603, lat: 50.9375 },
  { name: "Aachen, Germany", lon: 6.0834, lat: 50.7753 },
  { name: "Hamburg, Germany", lon: 9.9937, lat: 53.5511 },
  { name: "Munich, Germany", lon: 11.581, lat: 48.1351 },
  { name: "Berlin, Germany", lon: 13.405, lat: 52.52 },
  { name: "Leipzig, Germany", lon: 12.3731, lat: 51.3397 },
  { name: "Jena, Germany", lon: 11.5886, lat: 50.9277 },
  { name: "Frankfurt am Main, Germany", lon: 8.6821, lat: 50.1109 },
  { name: "Frankfurt an der Oder, Germany", lon: 14.5501, lat: 52.3411 },
  { name: "Stuttgart, Germany", lon: 9.1829, lat: 48.7758 },
  { name: "Erfurt, Germany", lon: 10.9847, lat: 50.9848 },
  { name: "Hanover, Germany", lon: 9.7332, lat: 52.3759 },
  { name: "Osnabrück, Germany", lon: 8.0476, lat: 52.2799 },
  { name: "Bremen, Germany", lon: 8.8017, lat: 53.0793 },
  { name: "Nuremberg, Germany", lon: 11.0775, lat: 49.4521 },
  { name: "Bielefeld, Germany", lon: 8.5325, lat: 52.0302 },
  { name: "Emden, Germany", lon: 8.212, lat: 53.3667 },
  { name: "Hamm, Germany", lon: 7.199, lat: 51.6739 },
  { name: "Würzburg, Germany", lon: 9.9333, lat: 49.7903 },
  { name: "Leipzig, Germany", lon: 12.3731, lat: 51.3397 },
  { name: "Dresden, Germany", lon: 13.7373, lat: 51.0504 },
  { name: "Chemnitz, Germany", lon: 12.9200, lat: 50.8333 },
  { name: "Zwickau, Germany", lon: 12.5000, lat: 50.7167 },
  { name: "Cottbus, Germany", lon: 14.3333, lat: 51.7667 },
  { name: "Potsdam, Germany", lon: 13.0667, lat: 52.4000 },
  { name: "Göttingen, Germany", lon: 9.9333, lat: 51.5333 },
  { name: "Wünsdorf, Germany", lon: 13.4500, lat: 52.1667 },

  { name: "Salzburg, Austria", lon: 13.0434, lat: 47.8095 },
  { name: "Flachau, Austria", lon: 13.3833, lat: 47.3333 },

  { name: "Słubice, Poland", lon: 14.5667, lat: 52.3500 },

  { name: "Luxembourg City, Luxembourg", lon: 6.1296, lat: 49.6118 },
  { name: "Esch-sur-Alzette, Luxembourg", lon: 6.0369, lat: 49.5 },

  { name: "Rome, Italy", lon: 12.4964, lat: 41.9028 },
  { name: "Florence, Italy", lon: 11.2558, lat: 43.7696 },
  { name: "Pisa, Italy", lon: 10.3966, lat: 43.7228 },

  { name: "Amsterdam, Netherlands", lon: 4.8952, lat: 52.3702 },
  { name: "Enschede, Netherlands", lon: 6.8937, lat: 52.2215 },
  { name: "Eindhoven, Netherlands", lon: 5.4697, lat: 51.4416 },
  
  { name: "Moscow, Russia", lon: 37.6173, lat: 55.7558 }
]

const tileSources = {
  OpenStreetMap: new XYZ({
    url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    crossOrigin: 'anonymous',
  }),
  Satellite: new XYZ({
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    crossOrigin: 'anonymous',
  }),
  Topographic: new XYZ({
    url: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
    crossOrigin: 'anonymous',
  }),
};

const GeoCitiesIveVisited = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [tileLayer, setTileLayer] = useState<TileLayer<XYZ> | null>(null);
  const [showLabels, setShowLabels] = useState(false);
  const markerLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({ source: vectorSource });
    markerLayerRef.current = vectorLayer;

    const baseTileLayer = new TileLayer({ source: tileSources.OpenStreetMap });
    setTileLayer(baseTileLayer);

    const popupOverlay = new Overlay({
      element: popupRef.current!,
      offset: [10, 0],
      positioning: 'bottom-left',
    });

    const mapInstance = new Map({
      target: mapRef.current,
      layers: [baseTileLayer, vectorLayer],
      view: new View({
        center: fromLonLat([0, 15]),
        zoom: 4,
        projection: getProjection('EPSG:3857'),
      }),
      overlays: [popupOverlay],
      controls: defaultControls().extend([new FullScreen(), new ScaleLine()]),
    });

    mapInstance.on('pointermove', (e) => {
      if (mapInstance.hasFeatureAtPixel(e.pixel)) {
        const feature = mapInstance.getFeaturesAtPixel(e.pixel)?.[0];
        if (feature && popupRef.current) {
          popupRef.current.innerHTML = feature.get('name') || '';
          popupOverlay.setPosition(e.coordinate);
        }
      } else {
        popupOverlay.setPosition(undefined);
      }
    });

    setMap(mapInstance);
  }, []);

  useEffect(() => {
    if (!map || !markerLayerRef.current) return;

    const source = new VectorSource();

    const features = cities.map((city) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([city.lon, city.lat])),
        name: city.name,
      });

      feature.setStyle(
        new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({ color: '#FF0000' }),
            stroke: new Stroke({ color: '#fff', width: 1 }),
          }),
          text: showLabels
            ? new Text({
                text: city.name,
                offsetY: -15,
                fill: new Fill({ color: '#222' }),
                stroke: new Stroke({ color: '#fff', width: 2 }),
                font: '12px sans-serif',
              })
            : undefined,
        })
      );
      return feature;
    });

    source.addFeatures(features);
    markerLayerRef.current.setSource(source);
  }, [map, showLabels]);

  const handleTileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (tileLayer) {
      tileLayer.setSource(tileSources[e.target.value as keyof typeof tileSources]);
    }
  };

  return (
    <div className="relative w-full h-[90vh]">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 bg-white p-3 rounded shadow-md space-y-2 w-64">
        <h2 className="font-semibold text-lg">🗺️ Map Options</h2>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Tile Layer</label>
          <select
            onChange={handleTileChange}
            className="w-full border border-gray-300 rounded px-2 py-1"
          >
            {Object.keys(tileSources).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showLabels}
            onChange={() => setShowLabels((prev) => !prev)}
          />
          <label>Show Labels</label>
        </div>


      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="w-full h-full border border-gray-300 rounded"
      />
      {/* Tooltip */}
      <div
        ref={popupRef}
        className="absolute z-10 bg-white px-2 py-1 border border-gray-300 rounded text-sm pointer-events-none"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
};

export default GeoCitiesIveVisited;
