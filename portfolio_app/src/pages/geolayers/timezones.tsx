'use client';
import { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import KML from 'ol/format/KML';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Overlay from 'ol/Overlay';
import 'tailwindcss/tailwind.css';

export default function TimezoneMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<Overlay | null>(null);

  useEffect(() => {
    const styleFunction = (feature: any) => {
      const tzOffset = feature.get('tz-offset');
      const local = new Date();
      local.setTime(local.getTime() + (local.getTimezoneOffset() + (tzOffset || 0)) * 60000);
      let delta = Math.abs(12 - (local.getHours() + local.getMinutes() / 60));
      if (delta > 12) delta = 24 - delta;
      const opacity = 0.55 * (1 - delta / 12);
      return new Style({
        fill: new Fill({ color: [255, 255, 51, opacity] }),
        stroke: new Stroke({ color: '#ffffff' }),
      });
    };

    const parseOffsetFromUtc = (name: string): number | null => {
      const match = name.match(/([+-]?)(\d{2}):(\d{2})$/);
      if (!match) return null;
      const sign = match[1] === '-' ? -1 : 1;
      return sign * (60 * parseInt(match[2]) + parseInt(match[3]));
    };

    const vector = new VectorLayer({
      source: new VectorSource({
        url: '/data/timezones.kml',
        format: new KML({ extractStyles: false }),
      }),
      style: styleFunction,
    });

    vector.getSource()?.on('featuresloadend', (evt: any) => {
      evt.features.forEach((feature: any) => {
        const tzOffset = parseOffsetFromUtc(feature.get('name'));
        feature.set('tz-offset', tzOffset, true);
      });
    });

    const raster = new TileLayer({
      source: new XYZ({
        url: 'https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        attributions: '© OpenStreetMap contributors © CARTO',
      }),
    });

    const overlay = new Overlay({
      element: tooltipRef.current!,
      offset: [10, 0],
      positioning: 'center-left',
    });

    overlayRef.current = overlay;

    const map = new Map({
      target: mapRef.current!,
      layers: [raster, vector],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
      overlays: [overlay],
    });

    map.on('pointermove', (evt) => {
      if (evt.dragging) {
        overlay.setPosition(undefined);
        return;
      }

      const feature = map.forEachFeatureAtPixel(evt.pixel, f => f);
      if (feature) {
        const name = feature.get('name');
        tooltipRef.current!.innerHTML = name;
        overlay.setPosition(evt.coordinate);
      } else {
        overlay.setPosition(undefined);
      }
    });

    map.on('click', (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, f => f);
      if (feature) {
        const name = feature.get('name');
        alert(`You clicked on timezone: ${name}`);
      }
    });

    return () => map.setTarget(null);
  }, []);

  return (
    <div className="fixed inset-0 bg-black"> 
      <div className="relative w-full h-full border-gray-800 shadow-xl">
        <div ref={mapRef} className="w-full h-full" />
        <div
          ref={tooltipRef}
          className="absolute z-10 px-2 py-1 text-xs text-white bg-black bg-opacity-75 rounded pointer-events-none"
        ></div>
      </div>
    </div>
  );
}
