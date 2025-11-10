import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Range, getTrackBackground } from 'react-range';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Indicator { id: string; label: string; }
interface Country { id: string; label: string; }

const MIN_YEAR = 2000;
const MAX_YEAR = 2024;

const InflationPage: React.FC = () => {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedIndicator, setSelectedIndicator] = useState<string>('PCPIPCH@WEO');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['USA', 'DEU', 'BRA']);
  const [yearRange, setYearRange] = useState<[number, number]>([2019, 2024]);
  const [years, setYears] = useState<string[]>([]);
  const [dataSeries, setDataSeries] = useState<any>(null);

  // Build years from (sorted) slider range
  useEffect(() => {
    const start = Math.max(MIN_YEAR, Math.min(yearRange[0], yearRange[1]));
    const end = Math.min(MAX_YEAR, Math.max(yearRange[0], yearRange[1]));
    const arr = Array.from({ length: end - start + 1 }, (_, i) => String(start + i));
    setYears(arr);
  }, [yearRange]);

  // Color palette generator — spaced hues for distinct lines
  const getColorPalette = (count: number) =>
    Array.from({ length: count }, (_, i) => {
      const hue = Math.round((360 / Math.max(count, 1)) * i);
      return `hsl(${hue}, 70%, 50%)`;
    });

  // Fetch indicators & countries (sorted alphabetically)
  useEffect(() => {
    axios.get(`/api/imf?endpoint=indicators`)
      .then(res => {
        const list = Object.entries(res.data.indicators)
          .map(([id, v]: any) => ({ id, label: v.label }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setIndicators(list);
      })
      .catch(console.error);

    axios.get(`/api/imf?endpoint=countries`)
      .then(res => {
        const list = Object.entries(res.data.countries)
          .map(([id, v]: any) => ({ id, label: v.label }))
          .sort((a, b) => a.label.localeCompare(b.label));
        setCountries(list);
      })
      .catch(console.error);
  }, []);

  // Fetch and prepare dataset
  useEffect(() => {
    if (!selectedIndicator || selectedCountries.length === 0 || years.length === 0) return;

    const endpoint = `${selectedIndicator}/${selectedCountries.join(',')}?periods=${years.join(',')}`;
    axios.get(`/api/imf?endpoint=${encodeURIComponent(endpoint)}`)
      .then(res => {
        const valuesForIndicator = res?.data?.values?.[selectedIndicator] ?? {};
        const colors = getColorPalette(selectedCountries.length);

        const datasets = selectedCountries.map((countryCode, idx) => {
          const countryValues = valuesForIndicator?.[countryCode] ?? {};
          return {
            label: countries.find(c => c.id === countryCode)?.label || countryCode,
            data: years.map(y => {
              const v = countryValues?.[y];
              return (typeof v === 'number' ? v : v != null ? Number(v) : null);
            }),
            borderColor: colors[idx],
            backgroundColor: colors[idx].replace('50%', '75%'),
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
            fill: false,
          };
        });

        setDataSeries({ labels: years, datasets });
      })
      .catch(err => {
        console.error(err);
        // Fallback to avoid blank UI
        setDataSeries({ labels: years, datasets: [] });
      });
  }, [selectedIndicator, selectedCountries, years, countries]);

  // Chart options
  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { usePointStyle: true, pointStyle: 'circle', padding: 15 },
        onClick: (e: any, legendItem: any, legend: any) => {
          const ci = legend.chart;
          ci.toggleDataVisibility(legendItem.datasetIndex);
          ci.update();
        }
      },
      title: {
        display: true,
        text: 'IMF Inflation Comparison (%)',
        font: { size: 18 }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: (context: any) => {
            const value = context.parsed?.y;
            return `${context.dataset.label}: ${value !== null && value !== undefined ? value.toFixed(2) + '%' : 'No data'}`;
          }
        }
      }
    },
    interaction: { mode: 'nearest' as const, axis: 'x', intersect: false },
    scales: {
      y: {
        title: { display: true, text: '%' },
        ticks: { callback: (val: number) => `${val}%` }
      }
    }
  }), []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6">IMF Inflation Trends — Country Comparison</h1>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Indicator Selector */}
          <div>
            <label className="block text-sm font-medium mb-1">Indicator</label>
            <select
              className="border rounded p-2 w-full"
              value={selectedIndicator}
              onChange={e => setSelectedIndicator(e.target.value)}
            >
              {indicators.map(i => (
                <option key={i.id} value={i.id}>{i.label}</option>
              ))}
            </select>
          </div>

          {/* Countries Selector */}
          <div>
            <label className="block text-sm font-medium mb-1">Countries (multi-select)</label>
            <select
              multiple
              className="border rounded p-2 w-full h-40"
              value={selectedCountries}
              onChange={e =>
                setSelectedCountries(Array.from(e.target.selectedOptions, opt => opt.value))
              }
            >
              {countries.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Year Range Slider (dual thumb) */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Years: {Math.min(...yearRange)} – {Math.max(...yearRange)}
            </label>
            <Range
              step={1}
              min={MIN_YEAR}
              max={MAX_YEAR}
              values={yearRange}
              onChange={(vals) => {
                // keep values sorted & clamped
                const a = Math.max(MIN_YEAR, Math.min(MAX_YEAR, vals[0]));
                const b = Math.max(MIN_YEAR, Math.min(MAX_YEAR, vals[1]));
                const next: [number, number] = [Math.min(a, b), Math.max(a, b)];
                setYearRange(next);
              }}
              renderTrack={({ props, children }) => (
                <div
                  onMouseDown={props.onMouseDown}
                  onTouchStart={props.onTouchStart}
                  className="w-full h-4 flex items-center"
                  style={{ ...props.style }}
                >
                  <div
                    ref={props.ref}
                    style={{
                      height: '8px',
                      width: '100%',
                      borderRadius: '9999px',
                      background: getTrackBackground({
                        values: yearRange,
                        colors: ['#e5e7eb', '#3b82f6', '#e5e7eb'],
                        min: MIN_YEAR,
                        max: MAX_YEAR,
                      }),
                    }}
                  >
                    {children}
                  </div>
                </div>
              )}
              renderThumb={({ props, isDragged, value }) => (
                <div
                  {...props}
                  className="w-5 h-5 rounded-full shadow flex items-center justify-center"
                  style={{
                    ...props.style,
                    backgroundColor: isDragged ? '#2563eb' : '#3b82f6',
                    outline: 'none',
                  }}
                  aria-label="Year Thumb"
                >
                  <div className="text-[10px] text-white font-semibold select-none">
                    {value}
                  </div>
                </div>
              )}
            />
          </div>
        </div>

        {/* Chart */}
        {dataSeries && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <Line data={dataSeries} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default InflationPage;
