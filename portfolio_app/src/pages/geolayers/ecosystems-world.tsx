'use client';

import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { Fill, Stroke, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import Head from 'next/head';

export default function EcosystemsWorldPage() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string | null }>({
    x: 0,
    y: 0,
    content: null,
  });

  useEffect(() => {
    if (mapRef.current && !map) {
      const satelliteSource = new XYZ({
        url:
          'https://server.arcgisonline.com/ArcGIS/rest/services/' +
          'World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maxZoom: 19,
      });

      const baseLayer = new TileLayer({ source: satelliteSource });

      const ecoregionLayer = new VectorLayer({
        source: new VectorSource({
          url: 'https://openlayers.org/data/vector/ecoregions.json',
          format: new GeoJSON(),
        }),
        style: (feature: Feature<Geometry>) => {
          const color = feature.get('COLOR') || feature.get('COLOR_BIO') || '#ccc';
          return new Style({
            fill: new Fill({ color }),
          });
        },
      });

      const highlightLayer = new VectorLayer({
        source: new VectorSource(),
        style: new Style({
          stroke: new Stroke({ color: 'rgba(255,255,255,0.8)', width: 2 }),
        }),
      });

      const olMap = new Map({
        target: mapRef.current,
        layers: [baseLayer, ecoregionLayer, highlightLayer],
        view: new View({ center: fromLonLat([0, 0]), zoom: 2 }),
      });

      let highlight: Feature<Geometry> | null = null;

      const displayFeatureInfo = (pixel: number[], coordinate: number[]) => {
        const feature = olMap.forEachFeatureAtPixel(pixel, f => f as Feature<Geometry>);
        if (feature) {
          const name = feature.get('ECO_NAME') || 'Unknown';
          const biome = feature.get('BIOME_DESC') || feature.get('BIOME_NAME') || '';
          const realm = feature.get('REALM') || '';
          const protection = feature.get('NNH_NAME') || '';

          const tooltipContent = `
            <div class="font-semibold">${name}</div>
            ${realm ? `<div class="text-xs">Realm: ${realm}</div>` : ''}
            ${biome ? `<div class="text-xs">Biome: ${biome}</div>` : ''}
            ${protection ? `<div class="text-xs">Protection: ${protection}</div>` : ''}
          `;
          setTooltip({ x: coordinate[0], y: coordinate[1], content: tooltipContent });
        } else {
          setTooltip({ x: 0, y: 0, content: null });
        }

        if (feature !== highlight) {
          if (highlight) highlightLayer.getSource()?.removeFeature(highlight);
          if (feature) highlightLayer.getSource()?.addFeature(feature);
          highlight = feature;
        }
      };

      olMap.on('pointermove', evt => {
        if (!evt.dragging && evt.originalEvent instanceof PointerEvent) {
          const x = evt.originalEvent.clientX;
          const y = evt.originalEvent.clientY;
          displayFeatureInfo(evt.pixel, [x, y]);
        }
      });

      olMap.on('click', evt => {
        if (evt.originalEvent instanceof PointerEvent) {
          const x = evt.originalEvent.clientX;
          const y = evt.originalEvent.clientY;
          displayFeatureInfo(evt.pixel, [x, y]);
        }
      });

      setMap(olMap);
    }
  }, [map]);

  return (
    <>
      <Head>
        <title>Ecosystems of the World</title>
      </Head>
      <div className="relative w-screen h-screen overflow-hidden">
        <div ref={mapRef} className="w-full h-full" />

        {/* Tooltip */}
        {tooltip.content && (
          <div
            ref={tooltipRef}
            className="absolute z-20 bg-white text-black text-sm p-2 rounded shadow max-w-xs pointer-events-none"
            style={{ top: tooltip.y + 10, left: tooltip.x + 10 }}
            dangerouslySetInnerHTML={{ __html: tooltip.content }}
          />
        )}
      </div>
    </>
  );
}
