'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import dayjs from 'dayjs';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface Currency {
  code: string;
  name: string;
}



// Expanded currency list
const ALL_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'NZD', name: 'New Zealand Dollar' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'MXN', name: 'Mexican Peso' },
  { code: 'ZAR', name: 'South African Rand' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'KRW', name: 'South Korean Won' },
  { code: 'TRY', name: 'Turkish Lira' },
  { code: 'ILS', name: 'Israeli Shekel' },
  { code: 'SEK', name: 'Swedish Krona' },
  { code: 'NOK', name: 'Norwegian Krone' },
  { code: 'DKK', name: 'Danish Krone' },
  { code: 'HKD', name: 'Hong Kong Dollar' },
  { code: 'PLN', name: 'Polish Zloty' },
  { code: 'BGN', name: 'Bulgarian Lev' },
  { code: 'CZK', name: 'Czech Koruna' },
  { code: 'HUF', name: 'Hungarian Forint' },
  { code: 'IDR', name: 'Indonesian Rupiah' },
  { code: 'MYR', name: 'Malaysian Ringgit' },
  { code: 'PHP', name: 'Philippine Peso' },
  { code: 'RON', name: 'Romanian Leu' },
  { code: 'THB', name: 'Thai Baht' }
];

function getColor(idx: number): string {
  const palette = [
    '#3b82f6', '#fbbf24', '#10b981', '#8b5cf6', '#ef4444',
    '#22d3ee', '#f472b6', '#fb7185', '#6366f1', '#4ade80',
    '#facc15', '#2dd4bf', '#a855f7', '#e879f9', '#38bdf8',
  ];
  return palette[idx % palette.length];
}

export default function CurrencyComparison() {
  const [base, setBase] = useState('USD');
  const [selected, setSelected] = useState<string[]>(['EUR', 'BRL']);
  const [startDate, setStartDate] = useState(dayjs().subtract(180, 'day').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRates() {
      setLoading(true);

      const symbols = selected.filter((c) => c !== base).join(',');
      if (!symbols) {
        setChartData(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://api.frankfurter.app/${startDate}..${endDate}?base=${base}&symbols=${symbols}`
        );
        const json = await res.json();
        const dates = Object.keys(json.rates).sort();

        const datasets = selected
          .filter((code) => code !== base)
          .map((code, idx) => ({
            label: `${code} – ${ALL_CURRENCIES.find((c) => c.code === code)?.name}`,
            data: dates.map((date) => json.rates[date]?.[code] ?? null),
            borderColor: getColor(idx),
            backgroundColor: getColor(idx),
            yAxisID: `y-${idx + 1}`,
            tension: 0.2,
            spanGaps: true,
          }));

        setChartData({
          labels: dates,
          datasets,
        });
      } catch (e) {
        console.error('Failed to fetch rates:', e);
        setChartData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
  }, [base, selected, startDate, endDate]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Currency Comparison (relative to base)</h1>

      <div className="flex flex-wrap gap-8 mb-8 items-center">
        {/* Base currency selector */}
        <div>
          <label className="block font-semibold mb-1">Base Currency:</label>
          <select
            value={base}
            onChange={(e) => setBase(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {ALL_CURRENCIES.map(({ code, name }) => (
              <option key={code} value={code}>
                {code} – {name}
              </option>
            ))}
          </select>
        </div>

        {/* Date range selectors */}
        <div>
          <label className="block font-semibold mb-1">Start Date:</label>
          <input
            type="date"
            max={endDate}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">End Date:</label>
          <input
            type="date"
            min={startDate}
            max={dayjs().format('YYYY-MM-DD')}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Multi-select dropdown */}
      <div className="mb-8">
        <label className="block font-semibold mb-2">Select Currencies to Compare:</label>
        <select
          multiple
          size={10}
          value={selected}
          onChange={(e) => {
            const options = Array.from(e.target.selectedOptions).map((opt) => opt.value);
            setSelected(options);
          }}
          className="border rounded w-full p-2"
        >
          {ALL_CURRENCIES.filter((c) => c.code !== base).map(({ code, name }) => (
            <option key={code} value={code}>
              {code} – {name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-gray-500 text-sm">
          Hold Ctrl (Cmd) + Click to select multiple currencies.
        </p>
      </div>

      {/* Chart with date range label */}
      <div>
        {loading && <p>Loading data...</p>}
        {!loading && chartData && (
          <>
            <div className="mb-4 text-gray-700 font-medium">
              Showing data from <span className="font-semibold">{startDate}</span> to{' '}
              <span className="font-semibold">{endDate}</span>
            </div>

            <Line
              data={chartData}
              options={{
                responsive: true,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                  tooltip: { mode: 'index', intersect: false },
                  legend: { position: 'bottom' },
                },
                scales: {
                  x: {
                    title: { display: true, text: 'Date' },
                  },
                  ...chartData.datasets.reduce((acc: any, ds: any, idx: number) => {
                    acc[ds.yAxisID] = {
                      type: 'linear',
                      display: true,
                      position: idx % 2 === 0 ? 'left' : 'right',
                      grid: { drawOnChartArea: idx === 0 },
                      title: {
                        display: true,
                        text: `Value per 1 ${base} – ${ds.label.split(' ')[0]}`,
                      },
                    };
                    return acc;
                  }, {}),
                },
              }}
            />
          </>
        )}
        {!loading && (!chartData || chartData.datasets.length === 0) && (
          <p className="text-gray-600">Please select at least one currency to compare.</p>
        )}
      </div>

      <p className="mt-8 text-gray-500 text-sm">
        Data source:{' '}
        <a
          href="https://www.frankfurter.app"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-600"
        >
          Frankfurter API (European Central Bank)
        </a>
      </p>
    </div>
  );
}
