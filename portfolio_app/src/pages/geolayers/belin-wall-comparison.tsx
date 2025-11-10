'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Stroke, Fill } from 'ol/style';
import { GeometryCollection } from 'ol/geom';
import { fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import { Translate } from 'ol/interaction';
import ScaleLine from 'ol/control/ScaleLine';

const tileSources = {
  OpenStreetMap: new XYZ({
    url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    crossOrigin: 'anonymous',
  }),
};

const cities = [
  { name: 'Addis Ababa', coords: [38.7578, 9.0080], zoom: 11 },
  { name: 'Amsterdam', coords: [4.9041, 52.3676], zoom: 11 },
  { name: 'Athens', coords: [23.7275, 37.9838], zoom: 11 },
  { name: 'Bangkok', coords: [100.5018, 13.7563], zoom: 11 },
  { name: 'Barcelona', coords: [2.1734, 41.3851], zoom: 11 },
  { name: 'Beijing', coords: [116.4074, 39.9042], zoom: 11 },
  { name: 'Berlin', coords: [13.4050, 52.5200], zoom: 11 },
  { name: 'Bogotá', coords: [-74.0721, 4.7110], zoom: 11 },
  { name: 'Brasilia', coords: [-47.8825, -15.7942], zoom: 11 },
  { name: 'Buenos Aires', coords: [-58.3816, -34.6037], zoom: 11 },
  { name: 'Cairo', coords: [31.2357, 30.0444], zoom: 11 },
  { name: 'Cape Town', coords: [18.4241, -33.9249], zoom: 11 },
  { name: 'Chicago', coords: [-87.6298, 41.8781], zoom: 11 },
  { name: 'Ciudad de Panama', coords: [-79.5199, 8.9824], zoom: 11 },
  { name: 'Copenhagen', coords: [12.5683, 55.6761], zoom: 11 },
  { name: 'Dakar', coords: [-17.4467, 14.6928], zoom: 11 },
  { name: 'Dubai', coords: [55.2708, 25.2048], zoom: 11 },
  { name: 'Dublin', coords: [-6.2603, 53.3498], zoom: 11 },
  { name: 'Florianopolis', coords: [-48.5492, -27.5954], zoom: 11 },
  { name: 'Hanoi', coords: [105.8544, 21.0285], zoom: 11 },
  { name: 'Hong Kong', coords: [114.1694, 22.3193], zoom: 11 },
  { name: 'Istanbul', coords: [28.9784, 41.0082], zoom: 11 },
  { name: 'Jakarta', coords: [106.8456, -6.2088], zoom: 11 },
  { name: 'Jerusalem', coords: [35.2137, 31.7683], zoom: 11 },
  { name: 'Kuala Lumpur', coords: [101.6869, 3.1390], zoom: 11 },
  { name: 'Lisbon', coords: [-9.1393, 38.7223], zoom: 11 },
  { name: 'London', coords: [-0.1278, 51.5074], zoom: 11 },
  { name: 'Los Angeles', coords: [-118.2437, 34.0522], zoom: 11 },
  { name: 'Madrid', coords: [-3.7038, 40.4168], zoom: 11 },
  { name: 'Malé', coords: [73.5093, 4.1755], zoom: 11 },
  { name: 'Malta', coords: [14.5146, 35.8989], zoom: 11 },
  { name: 'Makkah', coords: [39.8579, 21.3891], zoom: 11 },
  { name: 'Mexico City', coords: [-99.1332, 19.4326], zoom: 11 },
  { name: 'Moscow', coords: [37.6173, 55.7558], zoom: 11 },
  { name: 'Mumbai', coords: [72.8777, 19.0760], zoom: 11 },
  { name: 'Nairobi', coords: [36.8219, -1.2921], zoom: 11 },
  { name: 'New Delhi', coords: [77.2090, 28.6139], zoom: 11 },
  { name: 'New York', coords: [-74.0060, 40.7128], zoom: 11 },
  { name: 'Oslo', coords: [10.7522, 59.9139], zoom: 11 },
  { name: 'Paris', coords: [2.3522, 48.8566], zoom: 11 },
  { name: 'Pyongyang', coords: [125.7547, 39.0392], zoom: 11 },
  { name: 'Rio de Janeiro', coords: [-43.1729, -22.9068], zoom: 11 },
  { name: 'Rome', coords: [12.4964, 41.9028], zoom: 11 },
  { name: 'Santiago', coords: [-70.6693, -33.4489], zoom: 11 },
  { name: 'São Paulo', coords: [-46.6333, -23.5505], zoom: 11 },
  { name: 'Seoul', coords: [126.9751, 37.5665], zoom: 11 },
  { name: 'Shanghai', coords: [121.4737, 31.2304], zoom: 11 },
  { name: 'Shenzhen', coords: [114.0579, 22.5431], zoom: 11 },
  { name: 'Singapore', coords: [103.8198, 1.3521], zoom: 11 },
  { name: 'Stockholm', coords: [18.0686, 59.3293], zoom: 11 },
  { name: 'Sydney', coords: [151.2093, -33.8688], zoom: 11 },
  { name: 'Tokyo', coords: [139.6917, 35.6895], zoom: 11 },
  { name: 'Toronto', coords: [-79.3832, 43.6532], zoom: 11 },
  { name: 'Vienna', coords: [16.3738, 48.2082], zoom: 11 },
  { name: 'Warsaw', coords: [21.0122, 52.2297], zoom: 11 },
  { name: 'Washington DC', coords: [-77.0369, 38.9072], zoom: 11 },
  { name: 'Wuhan', coords: [114.3055, 30.5928], zoom: 11 },
  { name: 'Zurich', coords: [8.5417, 47.3769], zoom: 11 },
].sort((a, b) => a.name.localeCompare(b.name));


const GeoBerlinWall = dynamic(
  () =>
    Promise.resolve(() => {
      const mapRef = useRef(null);
      const combinedSourceRef = useRef(null);
      const originalFeatureRef = useRef(null);
      const [map, setMap] = useState(null);
      const [tileLayer, setTileLayer] = useState(null);
      const [selectedCity, setSelectedCity] = useState('Berlin');
      const [dataError, setDataError] = useState(null);

      // Function to calculate Mercator scale factor based on latitude
      const getMercatorScaleFactor = (targetLat) => {
        const berlinLat = 52.5200 * (Math.PI / 180); // Berlin latitude in radians
        const targetLatRad = targetLat * (Math.PI / 180); // Target latitude in radians
        const scaleFactor = Math.cos(berlinLat) / Math.cos(targetLatRad);
        return isNaN(scaleFactor) || !isFinite(scaleFactor) ? 1 : scaleFactor;
      };

      useEffect(() => {
        if (!mapRef.current) return;

        // Base tile layer
        const baseTileLayer = new TileLayer({ source: tileSources.OpenStreetMap });

        // Vector source & layer for combined Berlin Wall and City
        const combinedSource = new VectorSource();
        combinedSourceRef.current = combinedSource;
        const combinedLayer = new VectorLayer({
          source: combinedSource,
          style: (feature) => {
            const geometry = feature.getGeometry();
            if (geometry instanceof GeometryCollection) {
              const geometries = geometry.getGeometries();
              const styles = geometries.map((geom) => {
                const isWall = geom.get('source') === 'wall';
                return new Style({
                  geometry: geom,
                  stroke: new Stroke({
                    color: isWall ? '#ff0000' : 'rgba(128, 128, 128, 0.5)',
                    width: isWall ? 3 : 2,
                  }),
                  fill: !isWall
                    ? new Fill({
                      color: 'rgba(128, 128, 128, 0.5)', // Gray fill for city polygons
                    })
                    : null,
                });
              });
              return styles;
            }
            return new Style({
              stroke: new Stroke({
                color: '#ff0000',
                width: 3,
              }),
            });
          },
        });

        // Create map
        const mapInstance = new Map({
          target: mapRef.current,
          layers: [baseTileLayer, combinedLayer],
          view: new View({
            center: fromLonLat([13.4050, 52.5200]), // Berlin
            zoom: 11,
            projection: 'EPSG:3857',
          }),
        });

        // Add ScaleLine control
        const scaleLine = new ScaleLine({
          units: 'metric',
          minWidth: 100,
          bar: true,
          steps: 4,
          text: true,
        });
        mapInstance.addControl(scaleLine);
        console.log('ScaleLine initialized with metric units, positioned bottom-right');

        setMap(mapInstance);
        setTileLayer(baseTileLayer);

        // Add Translate interaction for dragging
        const translate = new Translate({
          layers: [combinedLayer],
        });
        translate.on('translateend', (event) => {
          const feature = event.features.getArray()[0];
          if (!feature) return;

          // Get the new center of the feature
          const geometry = feature.getGeometry();
          const extent = geometry.getExtent();
          const center = [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
          const [_, centerLat] = toLonLat(center);
          const scaleFactor = getMercatorScaleFactor(centerLat);

          console.log(`Drag ended at latitude: ${centerLat}, scale factor: ${scaleFactor}`);

          // Reset to original geometry and apply new scale
          combinedSourceRef.current.clear();
          if (originalFeatureRef.current) {
            const newFeature = originalFeatureRef.current.clone();
            const newGeometry = newFeature.getGeometry();
            const originalExtent = newGeometry.getExtent();
            const originalCenter = [(originalExtent[0] + originalExtent[2]) / 2, (originalExtent[1] + originalExtent[3]) / 2];
            const deltaX = center[0] - originalCenter[0];
            const deltaY = center[1] - originalCenter[1];

            newGeometry.translate(deltaX, deltaY);
            newGeometry.scale(scaleFactor, scaleFactor, center);
            combinedSourceRef.current.addFeature(newFeature);
          }
        });
        mapInstance.addInteraction(translate);

        // Load and combine GeoJSONs
        Promise.all([
          fetch('/data/berliner_mauer_fixed.geojson').then((res) => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
          }),
          fetch('/data/berlin_city.geojson').then((res) => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
          }),
        ])
          .then(([wallGeojson, cityGeojson]) => {
            const wallFeatures = new GeoJSON().readFeatures(wallGeojson, {
              dataProjection: 'EPSG:3857',
              featureProjection: 'EPSG:3857',
            });
            wallFeatures.forEach((f) => f.getGeometry().set('source', 'wall'));
            console.log('Berlin Wall features loaded:', wallFeatures.length);

            const cityFeatures = new GeoJSON().readFeatures(cityGeojson, {
              dataProjection: 'EPSG:4326',
              featureProjection: 'EPSG:3857',
            });
            cityFeatures.forEach((f) => f.getGeometry().set('source', 'city'));
            console.log('Berlin City features loaded:', cityFeatures.length, 'First feature:', cityFeatures[0]?.getGeometry()?.getType());

            if (wallFeatures.length === 0 && cityFeatures.length === 0) {
              throw new Error('No features found in both GeoJSON files');
            }

            const allGeometries = [
              ...wallFeatures.map((f) => f.getGeometry()),
              ...cityFeatures.map((f) => f.getGeometry()),
            ];
            const combinedFeature = new Feature({
              geometry: new GeometryCollection(allGeometries),
            });
            combinedSource.addFeature(combinedFeature);
            originalFeatureRef.current = combinedFeature;

            const extent = combinedSource.getExtent();
            mapInstance.getView().fit(extent, { padding: [50, 50, 50, 50] });
            setDataError(null);
          })
          .catch((err) => {
            console.error('Error loading GeoJSONs:', err);
            setDataError(`Failed to load data: ${err.message}`);
          });

        return () => {
          mapInstance.setTarget(undefined);
        };
      }, []);

      const zoomToCity = (cityName) => {
        if (!map || !combinedSourceRef.current) return;
        const city = cities.find((c) => c.name === cityName);
        if (!city) return;
        setSelectedCity(city.name);
        const view = map.getView();
        const [lon, lat] = city.coords;
        const center = fromLonLat([lon, lat]);

        view.animate({
          center,
          zoom: city.zoom,
          duration: 1000,
        });

        const scaleFactor = getMercatorScaleFactor(lat);
        console.log(`Moving to ${city.name} (lat: ${lat}), scale factor: ${scaleFactor}`);

        combinedSourceRef.current.clear();
        if (city.name === 'Berlin') {
          if (originalFeatureRef.current) {
            combinedSourceRef.current.addFeature(originalFeatureRef.current);
          }
        } else {
          const berlinCenter = fromLonLat([13.4050, 52.5200]);
          const cityCenter = fromLonLat([lon, lat]);
          const deltaX = cityCenter[0] - berlinCenter[0];
          const deltaY = cityCenter[1] - berlinCenter[1];

          if (originalFeatureRef.current) {
            const newFeature = originalFeatureRef.current.clone();
            const geometry = newFeature.getGeometry();
            geometry.translate(deltaX, deltaY);
            const centerPoint = geometry.getExtent().slice(0, 2);
            geometry.scale(scaleFactor, scaleFactor, centerPoint);
            combinedSourceRef.current.addFeature(newFeature);
          }
        }
      };

      return (
        <div className="relative w-full h-full" style={{ minHeight: '100vh' }}>
          <style jsx>{`
            .ol-scale-line {
              bottom: 10px;
              right: 10px;
              background: rgba(255, 255, 255, 0.9);
              border: 2px solid #333;
              border-radius: 4px;
              padding: 4px 8px;
              font-size: 14px;
              font-weight: bold;
              color: #333;
              z-index: 1000;
            }
            .ol-scale-line-inner {
              border: 2px solid #333;
              border-top: none;
              color: #333;
            }
          `}</style>
          <div ref={mapRef} className="w-full h-full" />
          <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-10">
            <h2 className="text-lg font-bold mb-2 text-gray-800">Explore Cities</h2>
            {dataError && (
              <p className="text-red-500 text-sm mb-2">{dataError}</p>
            )}
            <select
              value={selectedCity}
              onChange={(e) => zoomToCity(e.target.value)}
              className="w-full px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>

          </div>
        </div>
      );
    }),
  { ssr: false }
);

export default GeoBerlinWall;
