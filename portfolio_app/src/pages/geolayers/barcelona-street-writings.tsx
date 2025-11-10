'use client';

import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Overlay from 'ol/Overlay';
import { defaults as defaultControls } from 'ol/control';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';
import { transform } from 'ol/proj';
import type { Extent } from 'ol/extent';

type XY = [number, number];

// Minimal stick font (A-Z, 0-9, space)
const LETTERS: Record<string, XY[][]> = {
  ' ': [],
  A: [[[0,0],[0.5,1],[1,0]],[[0.2,0.5],[0.8,0.5]]],
  B: [[[0,0],[0,1]],[[0,1],[0.8,0.8],[0,0.55]],[[0,0.55],[0.8,0.3],[0,0]]],
  C: [[[1,0.85],[0.2,1],[0,0.5],[0.2,0],[1,0.15]]],
  D: [[[0,0],[0,1]],[[0,1],[0.9,0.75],[0.9,0.25],[0,0]]],
  E: [[[1,1],[0,1],[0,0],[1,0]],[[0,0.5],[0.7,0.5]]],
  F: [[[0,0],[0,1]],[[0,1],[1,1]],[[0,0.5],[0.7,0.5]]],
  G: [[[1,0.85],[0.2,1],[0,0.5],[0.2,0],[1,0.15],[1,0.45],[0.6,0.45]]],
  H: [[[0,0],[0,1]],[[1,0],[1,1]],[[0,0.5],[1,0.5]]],
  I: [[[0.1,1],[0.9,1]],[[0.5,1],[0.5,0]],[[0.1,0],[0.9,0]]],
  J: [[[0.1,1],[0.9,1]],[[0.5,1],[0.5,0.1],[0.3,0],[0.1,0.1]]],
  K: [[[0,0],[0,1]],[[1,1],[0,0.5],[1,0]]],
  L: [[[0,1],[0,0],[1,0]]],
  M: [[[0,0],[0,1],[0.5,0.5],[1,1],[1,0]]],
  N: [[[0,0],[0,1],[1,0],[1,1]]],
  O: [[[0.2,0],[0,0.5],[0.2,1],[0.8,1],[1,0.5],[0.8,0],[0.2,0]]],
  P: [[[0,0],[0,1]],[[0,1],[0.9,0.8],[0,0.55]]],
  R: [[[0,0],[0,1]],[[0,1],[0.9,0.8],[0,0.55]],[[0,0.55],[1,0]]],
  S: [[[1,0.85],[0.2,1],[0,0.8],[0.8,0.6],[1,0.4],[0.2,0.2],[0,0],[0.8,0.15]]],
  T: [[[0,1],[1,1]],[[0.5,1],[0.5,0]]],
  U: [[[0,1],[0,0.2],[0.2,0],[0.8,0],[1,0.2],[1,1]]],
  V: [[[0,1],[0.5,0],[1,1]]],
  W: [[[0,1],[0.25,0],[0.5,0.5],[0.75,0],[1,1]]],
  X: [[[0,1],[1,0]],[[1,1],[0,0]]],
  Y: [[[0,1],[0.5,0.5],[1,1]],[[0.5,0.5],[0.5,0]]],
  Z: [[[0,1],[1,1],[0,0],[1,0]]],
  '0': [[[0.2,0],[0,0.5],[0.2,1],[0.8,1],[1,0.5],[0.8,0],[0.2,0]]],
  '1': [[[0.5,1],[0.5,0]]],
};

const Home: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapObj, setMapObj] = useState<Map | null>(null);
  const [streetLayer, setStreetLayer] = useState<VectorLayer<VectorSource> | null>(null);
  const [wordLayer, setWordLayer] = useState<VectorLayer<VectorSource> | null>(null);
  const [word, setWord] = useState<string>(' BARCELONA ');

  const densifyMeters = (pts: XY[], step = 35) => {
    const out: XY[] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[i + 1];
      const len = Math.hypot(x2 - x1, y2 - y1);
      const n = Math.max(1, Math.ceil(len / step));
      for (let k = 0; k < n; k++) {
        const t = k / n;
        out.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]);
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  };

  const snapToStreet = (map: Map, source: VectorSource, coords: XY[]) => {
    const snapped: XY[] = [];
    for (const c of coords) {
      const f = source.getClosestFeatureToCoordinate(c);
      if (!f) { snapped.push(c); continue; }
      const g = f.getGeometry();
      if (!g) { snapped.push(c); continue; }
      snapped.push(g.getClosestPoint(c) as XY);
    }
    return snapped;
  };

  const buildWordPolylines = (wordStr: string, extent: Extent) => {
    const [minx, miny, maxx, maxy] = extent as [number, number, number, number];
    const chars = wordStr.toUpperCase().split('');
    const W = maxx - minx;
    const H = maxy - miny;

    const letterSize = Math.min(W, H) / (chars.length * 1.2);

    const stepX = letterSize * Math.cos(Math.PI / 4) * 1.5;
    const stepY = letterSize * Math.sin(Math.PI / 4) * 1.5;
    const totalDx = stepX * chars.length;
    const totalDy = stepY * chars.length;

    const centerX = minx + W / 2 - totalDx / 2;
    const centerY = miny + H / 2 - totalDy / 2;

    const polylines: XY[][] = [];
    let cursorX = centerX;
    let cursorY = centerY;

    for (const ch of chars) {
      const shapes = LETTERS[ch] || [];
      for (const poly of shapes) {
        const transformed: XY[] = poly.map(([nx, ny]) => {
          const px = nx * letterSize;
          const py = ny * letterSize;
          const angle = Math.PI / 4;
          const x = px * Math.cos(angle) - py * Math.sin(angle) + cursorX;
          const y = px * Math.sin(angle) + py * Math.cos(angle) + cursorY;
          return [x, y];
        });
        polylines.push(transformed);
      }
      cursorX += stepX;
      cursorY += stepY;
    }
    return polylines;
  };

  useEffect(() => {
    const streetSource = new VectorSource({
      url: '/data/barcelona_streets.geojson',
      format: new GeoJSON({ dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' }),
    });

    const streetLayerObj = new VectorLayer({
      source: streetSource,
      style: null
    });

    const wordLayerObj = new VectorLayer({
      source: new VectorSource(),
      style: new Style({ stroke: new Stroke({ color: '#2563eb', width: 6, lineCap: 'round', lineJoin: 'round' }) }),
    });

    const map = new Map({
      target: mapRef.current!,
      layers: [
        new TileLayer({ source: new OSM(), opacity: 0.9 }),
        streetLayerObj,
        wordLayerObj,
      ],
      controls: defaultControls({ zoom: false, attribution: false, rotate: false }),
      view: new View({ center: [0, 0], zoom: 2 }),
    });

    const overlay = new Overlay({ element: popupRef.current!, autoPan: { animation: { duration: 300 }, margin: 20 }, positioning: 'bottom-center', offset: [0, -10] });
    overlayRef.current = overlay;
    map.addOverlay(overlay);

    const bounds4326: [number, number][] = [
      [2.156591, 41.353763],
      [2.112464, 41.386023],
      [2.189841, 41.440013],
      [2.226716, 41.415626],
    ];
    const bounds3857 = bounds4326.map(([lon, lat]) => transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));
    const areaPolygon = new Polygon([bounds3857.concat([bounds3857[0]])]);

    streetSource.once('change', () => {
      if (streetSource.getState() !== 'ready') return;
      const filtered = streetSource.getFeatures().filter(f => {
        const geom = f.getGeometry();
        if (!geom) return false;
        const coords = (geom as LineString).getCoordinates();
        return coords.some(c => areaPolygon.intersectsCoordinate(c));
      });
      streetSource.clear();
      streetSource.addFeatures(filtered);
      map.getView().fit(areaPolygon.getExtent(), { padding: [50, 50, 50, 50] });
      setIsLoading(false);
    });

    setMapObj(map);
    setStreetLayer(streetLayerObj);
    setWordLayer(wordLayerObj);

    return () => map.setTarget(undefined);
  }, []);

  const handleDraw = () => {
    if (!mapObj || !streetLayer || !wordLayer) return;
    const streetSource = streetLayer.getSource() as VectorSource;
    const wordSource = wordLayer.getSource() as VectorSource;

    const extent = streetSource.getExtent();
    const [minx, miny, maxx, maxy] = extent as [number, number, number, number];
    const lineHeight = (maxy - miny) / 5;

    wordSource.clear();

    const lines = word.split('\\n');
    lines.forEach((line, i) => {
      const polylines = buildWordPolylines(line, extent);
      const offsetY = ((lines.length - 1) / 2 - i) * lineHeight;
      for (const poly of polylines) {
        const offsetPoly = poly.map(([x, y]) => [x, y + offsetY] as XY);
        const dense = densifyMeters(offsetPoly, 35);
        const snapped = snapToStreet(mapObj, streetSource, dense);
        if (snapped.length >= 2) wordSource.addFeature(new Feature(new LineString(snapped)));
      }
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-b from-blue-50 to-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex items-center justify-between shadow-md">
        <h1 className="text-2xl font-bold tracking-tight">Streets of Barcelona</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="px-3 py-1 rounded-lg text-black"
          />
          <button
            onClick={handleDraw}
            className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded-lg"
          >
            Write Word
          </button>
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
