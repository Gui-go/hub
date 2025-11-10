import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3-geo';
import * as topojson from 'topojson-client';
import * as GeoJSON from 'geojson';
import { century, equationOfTime, declination } from 'solar-calculator';

// ---
// Debounce utility
const debounce = (func: () => void, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(), wait);
  };
};

// ---
// Global Canvas Element Interface Augmentation
declare global {
  interface HTMLCanvasElement {
    projection?: d3.GeoProjection;
    nightPath?: GeoJSON.Geometry; // Corrected to GeoJSON.Geometry for consistency
  }
}

// ---
// Define TopoJSON structure for world-atlas
interface WorldTopology extends TopoJSON.Topology {
  objects: {
    land: TopoJSON.GeometryObject;
  };
}

// ---
// SolarTerminator Component
const SolarTerminator = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(500);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAnimating, setIsAnimating] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });

  // ---
  // Renders the geographical map and solar terminator
  const renderMap = useCallback(async () => {
    if (!canvasRef.current) return;

    try {
      const response = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json");
      const world: WorldTopology = await response.json();

      const projection = d3.geoNaturalEarth1();
      const sphere: d3.GeoSphere = { type: "Sphere" };
      const graticule = d3.geoGraticule10();

      // Fit projection to the width and calculate height
      const pathGenerator = d3.geoPath(projection.fitWidth(width, sphere));
      const [[x0, y0], [x1, y1]] = pathGenerator.bounds(sphere);
      const dy = Math.ceil(y1 - y0);
      const l = Math.min(Math.ceil(x1 - x0), dy);
      projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
      if (dy !== height) setHeight(dy);

      // Get land features from TopoJSON
      const land = topojson.feature(world, world.objects.land) as GeoJSON.Feature<
        GeoJSON.MultiPolygon | GeoJSON.Polygon
      >;

      // Ensure antipode returns a [number, number] tuple
      const antipode = ([lon, lat]: [number, number]): [number, number] => {
        return [lon + 180, -lat];
      };

      // Calculate sun position and night terminator
      const dayStart = new Date(currentTime).setUTCHours(0, 0, 0, 0);
      const t = century(currentTime);
      const longitude = (dayStart - +currentTime) / 864e5 * 360 - 180;
      const sun: [number, number] = [longitude - equationOfTime(t) / 4, declination(t)];

      const night = d3.geoCircle().radius(90).center(antipode(sun))() as GeoJSON.Geometry;

      // Get 2D rendering context and create D3 geoPath
      const context = canvasRef.current.getContext('2d');
      if (!context) {
        console.error("Could not get 2D rendering context from canvas.");
        return;
      }
      const path = d3.geoPath(projection, context);

      // Clear canvas before drawing
      context.clearRect(0, 0, width, height);

      // Draw graticule
      context.beginPath();
      path(graticule);
      context.strokeStyle = "#ccc";
      context.stroke();
      // Draw land
      context.beginPath();
      path(land);
      context.fillStyle = "#000";
      context.fill();
      // Draw night region
      context.beginPath();
      path(night);
      context.fillStyle = "rgba(0,0,255,0.3)";
      context.fill();
      // Draw sphere outline
      context.beginPath();
      path(sphere);
      context.strokeStyle = "#000";
      context.stroke();

      // Store projection and nightPath on canvas for mouse events
      canvasRef.current.projection = projection;
      canvasRef.current.nightPath = night;
    } catch (err) {
      console.error("Failed to render solar map:", err);
    }
  }, [width, height, currentTime]);

  // ---
  // Handles mouse movement over the canvas for tooltip display
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !canvasRef.current.projection || !canvasRef.current.nightPath) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const coords = canvasRef.current.projection.invert([x, y]);
    if (!coords) {
      setTooltip({ visible: false, x: 0, y: 0, content: '' });
      return;
    }
    const [lon, lat] = coords;

    const isNight = d3.geoContains(canvasRef.current.nightPath, [lon, lat]);

    setTooltip({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      content: `Lat: ${lat.toFixed(2)}°, Lon: ${lon.toFixed(2)}°<br>${isNight ? 'Night' : 'Day'}`
    });
  }, []);

  // ---
  // Handles mouse leaving the canvas to hide tooltip
  const handleMouseLeave = useCallback(() => {
    setTooltip({ visible: false, x: 0, y: 0, content: '' });
  }, []);

  // ---
  // Debounced handler for window resizing
  const handleResize = useCallback(debounce(() => {
    const newWidth = Math.min(800, window.innerWidth - 40);
    setWidth(newWidth);
  }, 100), []);

  // ---
  // Effect for animation interval control
  useEffect(() => {
    let mapInterval: ReturnType<typeof setInterval> | undefined;
    let clockInterval: ReturnType<typeof setInterval> | undefined;

    if (isAnimating) {
      mapInterval = setInterval(() => setCurrentTime(new Date()), 60000);
      clockInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    }

    return () => {
      if (mapInterval) clearInterval(mapInterval);
      if (clockInterval) clearInterval(clockInterval);
    };
  }, [isAnimating]);

  // ---
  // Effect for initial map rendering and window resize listener
  useEffect(() => {
    renderMap();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [renderMap, handleResize]);

  // ---
  // Component JSX
  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition duration-300 hover:shadow-2xl">
        <div className="p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            Solar Terminator Map
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-4">
            The blue region indicates areas currently experiencing night. Time: <strong>{currentTime.toUTCString()}</strong>
          </p>
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <div className="text-sm text-gray-700">
              <strong>Legend:</strong><br />
              <span className="inline-block w-4 h-4 bg-black mr-2"></span>Land<br />
              <span className="inline-block w-4 h-4 bg-blue-500 opacity-30 mr-2"></span>Night
            </div>
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`px-4 py-2 rounded-lg text-white font-semibold ${
                isAnimating ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              } transition-colors duration-200`}
            >
              {isAnimating ? 'Stop Live Animation' : 'Start Live Animation'}
            </button>
          </div>
          <div className="relative flex justify-center">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="border border-gray-200 rounded"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
            {tooltip.visible && (
              <div
                className="absolute bg-gray-800 text-white text-sm p-2 rounded shadow-lg pointer-events-none z-10"
                style={{ left: tooltip.x - 600, top: tooltip.y - 240, transform: 'translateY(-100%)' }}
                dangerouslySetInnerHTML={{ __html: tooltip.content }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarTerminator;