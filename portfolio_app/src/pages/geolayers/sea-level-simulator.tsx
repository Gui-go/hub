'use client';

import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import WMTS from 'ol/source/WMTS';
import XYZ from 'ol/source/XYZ';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { get as getProjection, Projection } from 'ol/proj';
import { getTopLeft, getWidth } from 'ol/extent';

export default function SeaLevelPage() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapObjRef = useRef<Map | null>(null);
  const wmtsSourceRef = useRef<WMTS | null>(null);
  const baseLayerRef = useRef<TileLayer<OSM | XYZ> | null>(null);

  const [threshold, setThreshold] = useState<number>(10);
  const [basemap, setBasemap] = useState<string>('satellite');

  useEffect(() => {
    if (!mapRef.current || mapObjRef.current) return;

    const projection: Projection = getProjection('EPSG:3857')!;
    const tileSizePixels = 256;
    const tileSizeMtrs = getWidth(projection.getExtent()) / tileSizePixels;

    const matrixIds: string[] = [];
    const resolutions: number[] = [];
    for (let i = 0; i <= 14; i++) {
      matrixIds[i] = i.toString();
      resolutions[i] = tileSizeMtrs / Math.pow(2, i);
    }

    const tileGrid = new WMTSTileGrid({
      origin: getTopLeft(projection.getExtent()),
      resolutions,
      matrixIds,
    });

    const wmtsSource = new WMTS({
      url: 'https://ts2.scalgo.com/olpatch/wmts?token=CC5BF28A7D96B320C7DFBFD1236B5BEB',
      layer: 'SRTM_4_1:SRTM_4_1_flooded_sealevels',
      format: 'image/png',
      matrixSet: 'EPSG:3857',
      tileGrid,
      style: 'default',
      dimensions: { threshold: threshold.toString() },
      attributions: [
        '<a href="https://scalgo.com" target="_blank">SCALGO</a>',
        '<a href="https://cgiarcsi.community/data/srtm-90m-digital-elevation-database-v4-1" target="_blank">CGIAR-CSI SRTM</a>',
      ],
    });

    wmtsSourceRef.current = wmtsSource;

    const baseLayer = new TileLayer({
      source: getBasemapSource(basemap),
    });
    baseLayerRef.current = baseLayer;

    const map = new Map({
      target: mapRef.current,
      view: new View({
        projection,
        center: [-9871995, 3566245],
        zoom: 6,
      }),
      layers: [
        baseLayer,
        new TileLayer({
          opacity: 0.5,
          source: wmtsSource,
        }),
      ],
    });

    mapObjRef.current = map;
  }, []);

  useEffect(() => {
    if (wmtsSourceRef.current) {
      wmtsSourceRef.current.updateDimensions({ threshold: threshold.toString() });
    }
  }, [threshold]);

  useEffect(() => {
    if (baseLayerRef.current) {
      baseLayerRef.current.setSource(getBasemapSource(basemap));
    }
  }, [basemap]);

  function getBasemapSource(type: string) {
    switch (type) {
      case 'osm':
        return new OSM();
      case 'satellite':
        return new XYZ({
          url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
          attributions: '© Google Satellite',
        });
      case 'terrain':
        return new XYZ({
          url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
          attributions: '© Google Terrain',
        });
      default:
        return new OSM();
    }
  }

  return (
    <>
      <Head>
        <title>Sea Level Visualization</title>
      </Head>
      <div className="relative w-screen h-screen">
        <div ref={mapRef} className="absolute inset-0 z-0" />

        <div className="absolute top-6 right-6 z-10 bg-white bg-opacity-90 p-4 rounded shadow-lg w-[320px] space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sea-level threshold: <span className="font-semibold">{threshold} m</span>
            </label>
            <input
              type="range"
              min={-1}
              max={100}
              value={threshold}
              onChange={e => setThreshold(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Basemap
            </label>
            <select
              value={basemap}
              onChange={(e) => setBasemap(e.target.value)}
              className="w-full border-gray-300 rounded px-2 py-1"
            >
              <option value="satellite">Satellite</option>
              <option value="osm">OpenStreetMap</option>
              <option value="terrain">Terrain</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
