'use client';

import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, XYZ } from 'ol/source';
import VectorSource from 'ol/source/Vector';
import { Circle as CircleGeom, Point } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Fill, Stroke, Text } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';

interface Zone {
  radius: number;
  label: string;
  color: string;
  effect: string;
  casualties: string;
}

interface Bomb {
  name: string;
  city: string;
  coords: number[];
  zones: Zone[];
  yield: string;
  date: string;
}

const bombs: Bomb[] = [
  {
    name: 'Little Boy',
    city: 'Hiroshima',
    coords: [132.454797, 34.394594],
    yield: '15 kilotons',
    date: 'August 6, 1945',
    zones: [
      {
        radius: 1000,
        label: 'Zone A',
        color: 'rgba(255, 0, 0, 0.4)',
        effect: 'Total destruction. All buildings collapsed.',
        casualties: '90% killed instantly',
      },
      {
        radius: 2000,
        label: 'Zone B',
        color: 'rgba(255, 165, 0, 0.3)',
        effect: 'Severe structural damage. Fires everywhere.',
        casualties: '50% mortality rate',
      },
      {
        radius: 3000,
        label: 'Zone C',
        color: 'rgba(255, 255, 0, 0.2)',
        effect: 'Moderate damage. Widespread injuries.',
        casualties: 'Thousands injured',
      },
    ],
  },
  {
    name: 'Fat Man',
    city: 'Nagasaki',
    coords: [129.863333, 32.773611],
    yield: '21 kilotons',
    date: 'August 9, 1945',
    zones: [
      {
        radius: 1200,
        label: 'Zone A',
        color: 'rgba(255, 0, 0, 0.4)',
        effect: 'Complete annihilation. Vaporized everything.',
        casualties: '100% fatalities at ground zero',
      },
      {
        radius: 2200,
        label: 'Zone B',
        color: 'rgba(255, 140, 0, 0.3)',
        effect: 'Concrete buildings destroyed. Fatal burns.',
        casualties: 'Most died within days',
      },
      {
        radius: 3200,
        label: 'Zone C',
        color: 'rgba(255, 255, 0, 0.2)',
        effect: 'Severe burns. Houses collapsed.',
        casualties: 'Thousands with radiation sickness',
      },
    ],
  },
];

const tileLayersSources = {
  'OpenStreetMap': new OSM(),
  'Satellite': new XYZ({
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attributions: 'Tiles © Esri'
  }),
  'Carto Voyager': new XYZ({
    url: 'https://cartodb-basemaps-{a-c}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
  }),
  'Dark': new XYZ({
    url: 'https://{a-d}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
  }),
};

export default function ExplosionMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [zoneLayers, setZoneLayers] = useState<VectorLayer<VectorSource>[]>([]);
  const [selectedTile, setSelectedTile] = useState('Satellite');

  useEffect(() => {
    if (!mapRef.current) return;

    const baseTileLayer = new TileLayer({
      source: tileLayersSources[selectedTile],
    });

    const createdZoneLayers: VectorLayer<VectorSource>[] = [];

    bombs.forEach((bomb) => {
      const center = fromLonLat(bomb.coords);

      const labelSource = new VectorSource();
      const labelFeature = new Feature({ geometry: new Point(center) });
      labelFeature.setStyle(
        new Style({
          text: new Text({
            text: `${bomb.city} (${bomb.name})`,
            font: 'bold 16px sans-serif',
            fill: new Fill({ color: '#fff' }),
            stroke: new Stroke({ color: '#000', width: 3 }),
            offsetY: -20,
          }),
        })
      );
      labelSource.addFeature(labelFeature);
      createdZoneLayers.push(new VectorLayer({ source: labelSource }));

      const zoneSource = new VectorSource();
      bomb.zones.forEach((zone) => {
        const circle = new CircleGeom(center, 0);
        const feature = new Feature({ geometry: circle });

        feature.setProperties({
          label: zone.label,
          radius: zone.radius,
          city: bomb.city,
          bombName: bomb.name,
          effect: zone.effect,
          casualties: zone.casualties,
          maxRadius: zone.radius,
          color: zone.color,
          center,
          yield: bomb.yield,
          date: bomb.date,
        });

        feature.setStyle(
          new Style({
            fill: new Fill({ color: zone.color }),
            stroke: new Stroke({ color: '#000', width: 1 }),
          })
        );

        zoneSource.addFeature(feature);
      });

      createdZoneLayers.push(new VectorLayer({ source: zoneSource }));
    });

    const mapObj = new Map({
      target: mapRef.current,
      layers: [baseTileLayer, ...createdZoneLayers],
      view: new View({
        center: fromLonLat([131, 33.5]),
        zoom: 9,
      }),
    });

    const overlay = new Overlay({
      element: overlayRef.current!,
      positioning: 'bottom-center',
      offset: [0, -25],
      stopEvent: false,
    });
    mapObj.addOverlay(overlay);

    mapObj.on('pointermove', (evt) => {
      if (evt.dragging) {
        overlayRef.current!.style.display = 'none';
        return;
      }

      const pixel = mapObj.getEventPixel(evt.originalEvent);
      const features = mapObj.getFeaturesAtPixel(pixel, { hitTolerance: 5 }) || [];

      const zoneFeatures = features.filter(
        (f) => f.get('label') && f.getGeometry()?.getType() === 'Circle'
      );

      if (zoneFeatures.length > 0) {
        overlay.setPosition(evt.coordinate);
        overlayRef.current!.style.display = 'block';

        const bombFeatures = zoneFeatures.reduce((acc, feature) => {
          const bombKey = `${feature.get('city')}|${feature.get('bombName')}`;
          if (!acc[bombKey]) {
            acc[bombKey] = {
              city: feature.get('city'),
              bombName: feature.get('bombName'),
              yield: feature.get('yield'),
              date: feature.get('date'),
              zones: [],
            };
          }
          acc[bombKey].zones.push({
            label: feature.get('label'),
            radius: feature.get('radius'),
            effect: feature.get('effect'),
            casualties: feature.get('casualties'),
            color: feature.get('color'),
          });
          return acc;
        }, {});

        let html = `<div style="width: 500px; font-family: sans-serif; font-size: 14px; color: #eee; padding: 10px;">`;
        
        Object.values(bombFeatures).forEach((bomb: any) => {
          html += `
            <div style="margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 style="margin: 0; font-size: 18px;">
                  ${bomb.city} (${bomb.bombName})
                </h3>
                <div style="font-size: 13px;">
                  ${bomb.yield} • ${bomb.date}
                </div>
              </div>
              
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                ${bomb.zones
                  .sort((a, b) => a.radius - b.radius)
                  .map(zone => `
                    <div style="padding: 8px; background: rgba(255,255,255,0.05); border-left: 3px solid ${zone.color};">
                      <div style="font-weight: bold; color: ${zone.color}; margin-bottom: 5px;">
                        ${zone.label} (${zone.radius}m)
                      </div>
                      <div style="font-size: 13px; margin-bottom: 4px;">
                        ${zone.effect}
                      </div>
                      <div style="font-size: 12px; color: #ccc;">
                        ${zone.casualties}
                      </div>
                    </div>
                  `).join('')}
              </div>
            </div>
          `;
        });

        html += '</div>';
        overlayRef.current!.innerHTML = html;
      } else {
        overlayRef.current!.style.display = 'none';
      }
    });

    setMap(mapObj);
    setZoneLayers(createdZoneLayers);

    return () => mapObj.setTarget(undefined);
  }, [selectedTile]);

  useEffect(() => {
    if (!map || zoneLayers.length === 0) return;

    const allZoneFeatures: Feature[] = [];
    zoneLayers.forEach((layer) => {
      layer.getSource()?.getFeatures().forEach((feature) => {
        if (feature.getGeometry()?.getType() === 'Circle') {
          allZoneFeatures.push(feature);
          (feature.getGeometry() as CircleGeom).setRadius(0);
        }
      });
    });

    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 5000;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      allZoneFeatures.forEach((feature) => {
        const geom = feature.getGeometry() as CircleGeom;
        const maxRadius = feature.get('maxRadius') as number;
        const easedProgress = Math.min(elapsed / duration, 1);
        geom.setRadius(easedProgress * maxRadius);
      });

      map.render();

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [map, zoneLayers]);

  return (
    <div className="relative w-full h-[100vh]">
      <header className="absolute top-0 left-0 right-0 z-10 bg-gray-900 bg-opacity-80 text-white p-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold mb-2 md:mb-0">
            Atomic Bomb Blast Zones
          </h1>
          <div className="flex items-center">
            <label htmlFor="tile-select" className="mr-2">Map Style:</label>
            <select
              id="tile-select"
              value={selectedTile}
              onChange={(e) => setSelectedTile(e.target.value)}
              className="bg-gray-700 text-white p-2 rounded"
            >
              {Object.keys(tileLayersSources).map((tileName) => (
                <option key={tileName} value={tileName}>{tileName}</option>
              ))}
            </select>
          </div>
        </div>
      </header>
      <div ref={mapRef} className="w-full h-full" />
      <div 
        ref={overlayRef} 
        className="absolute z-50 pointer-events-none bg-black bg-opacity-80 rounded-lg shadow-lg"
        style={{ maxWidth: 'none' }} 
      />
    </div>
  );
}