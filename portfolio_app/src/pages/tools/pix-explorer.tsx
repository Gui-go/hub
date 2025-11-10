import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bar, Pie, Scatter } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import * as d3 from 'd3';
import { FeatureCollection } from 'geojson';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

interface AggregatedMetrics {
    Estado: string;
    DinheiroMovimentado: number;
    QuantidadeTransacoes: number;
    TicketMedio: number;
    ParticipacaoPF: number;
    ParticipacaoPJ: number;
    PagadoresUnicosPF: number;
    PagadoresUnicosPJ: number;
    RecebedoresUnicosPF: number;
    RecebedoresUnicosPJ: number;
    RelacaoPagadoresRecebedoresPF: number | null;
    RelacaoPagadoresRecebedoresPJ: number | null;
    VolumePagadorPF: number;
    VolumePagadorPJ: number;
    VolumeRecebedorPF: number;
    VolumeRecebedorPJ: number;
}

type MapVariable = 'DinheiroMovimentado' | 'TicketMedio' | 'QuantidadeTransacoes';

const PixExplorer: React.FC = () => {
    const [data, setData] = useState<AggregatedMetrics[]>([]);
    const [geoJson, setGeoJson] = useState<FeatureCollection | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof AggregatedMetrics; direction: 'asc' | 'desc' } | null>(null);
    const [filterState, setFilterState] = useState('');
    const [mapVariable, setMapVariable] = useState<MapVariable>('DinheiroMovimentado');
    const [selectedMonth, setSelectedMonth] = useState('2025-07');
    const [isUpdating, setIsUpdating] = useState(false);
    const mapRef = useRef<SVGSVGElement>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [mapDimensions, setMapDimensions] = useState({ width: 600, height: 600 });

    const normalizeName = (name: string) => {
        const normalized = name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
        const nameMap: { [key: string]: string } = {
            'sao paulo': 'São Paulo',
            'rio de janeiro': 'Rio de Janeiro',
            'minas gerais': 'Minas Gerais',
            'parana': 'Paraná',
            'ceara': 'Ceará',
            'goias': 'Goiás',
            'para': 'Pará',
            'piaui': 'Piauí',
            'roraima': 'Roraima',
            'amapa': 'Amapá',
            'rondonia': 'Rondônia',
            'tocantins': 'Tocantins',
            'maranhao': 'Maranhão',
            'espirito santo': 'Espírito Santo',
            'rio grande do sul': 'Rio Grande do Sul',
            'rio grande do norte': 'Rio Grande do Norte',
            'mato grosso': 'Mato Grosso',
            'mato grosso do sul': 'Mato Grosso do Sul',
            'distrito federal': 'Distrito Federal',
            'acre': 'Acre',
            'alagoas': 'Alagoas',
            'amazonas': 'Amazonas',
            'bahia': 'Bahia',
            'pernambuco': 'Pernambuco',
            'santa catarina': 'Santa Catarina',
            'sergipe': 'Sergipe',
            'paraiba': 'Paraíba'
        };
        return nameMap[normalized] || name;
    };

    const fallbackData: AggregatedMetrics[] = [
        { Estado: 'São Paulo', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Rio de Janeiro', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Minas Gerais', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Paraná', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Ceará', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Goiás', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Pará', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Piauí', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Roraima', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Amapá', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Rondônia', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Tocantins', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Maranhão', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Espírito Santo', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Rio Grande do Sul', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Rio Grande do Norte', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Mato Grosso', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Mato Grosso do Sul', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Distrito Federal', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Acre', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Alagoas', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Amazonas', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Bahia', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Pernambuco', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Santa Catarina', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Sergipe', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 },
        { Estado: 'Paraíba', DinheiroMovimentado: 0, QuantidadeTransacoes: 0, TicketMedio: 0, ParticipacaoPF: 0, ParticipacaoPJ: 0, PagadoresUnicosPF: 0, PagadoresUnicosPJ: 0, RecebedoresUnicosPF: 0, RecebedoresUnicosPJ: 0, RelacaoPagadoresRecebedoresPF: 0, RelacaoPagadoresRecebedoresPJ: 0, VolumePagadorPF: 0, VolumePagadorPJ: 0, VolumeRecebedorPF: 0, VolumeRecebedorPJ: 0 }
    ];

    useEffect(() => {
        const handleResize = () => {
            if (mapContainerRef.current) {
                const parentWidth = mapContainerRef.current.offsetWidth;
                const newWidth = Math.max(parentWidth - 32, 250);
                setMapDimensions({ width: newWidth, height: newWidth });
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsUpdating(true);
            try {
                const [pixResponse, geoJsonResponse] = await Promise.all([
                    axios.get(`/api/fetchPix?month=${selectedMonth}`),
                    fetch('/data/BR_UF_2024.geojson').then((res) => {
                        if (!res.ok) throw new Error('Failed to fetch GeoJSON');
                        return res.json();
                    }),
                ]);
                const pixData = pixResponse.data;
                const validPixData = pixData.filter((d: AggregatedMetrics) =>
                    d.Estado && !isNaN(d.DinheiroMovimentado) && d.DinheiroMovimentado !== null
                );
                if (validPixData.length === 0) {
                    console.warn('No valid Pix data received; using fallback data');
                    setData(fallbackData);
                    setError('No valid Pix data; using fallback data');
                } else {
                    setData(validPixData);
                }
                setGeoJson(geoJsonResponse);
                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err);
                setData(fallbackData);
                setError('Failed to load Pix data; using fallback data');
                setLoading(false);
            } finally {
                setIsUpdating(false);
            }
        };
        fetchData();
    }, [selectedMonth]);

    useEffect(() => {
        if (!loading && data.length > 0 && geoJson && mapRef.current) {
            const { width, height } = mapDimensions;
            const svg = d3.select(mapRef.current);

            svg.selectAll('*').remove();

            const projection = d3.geoMercator().fitSize([width, height], geoJson);
            const path = d3.geoPath().projection(projection);

            const validValues = data
                .map((d) => d[mapVariable])
                .filter((v) => typeof v === 'number' && !isNaN(v) && v !== null) as number[];
            const valueExtent = validValues.length > 0 ? d3.extent(validValues) : [0, 1];
            const colorScale = d3
                .scaleSequential(d3.interpolateBlues)
                .domain(valueExtent as [number, number]);

            svg
                .attr('width', width)
                .attr('height', height)
                .selectAll('path')
                .data(geoJson.features)
                .enter()
                .append('path')
                .attr('d', path)
                .attr('fill', (d) => {
                    const stateData = data.find((item) => normalizeName(item.Estado) === normalizeName(d.properties.NM_UF));
                    if (!stateData) {
                        return '#d3d3d3';
                    }
                    const value = stateData[mapVariable];
                    if (typeof value !== 'number' || isNaN(value) || value === null) {
                        return '#d3d3d3';
                    }
                    return colorScale(value);
                })
                .attr('stroke', '#fff')
                .attr('stroke-width', 1)
                .style('opacity', 1)
                .on('mouseover', function (event, d) {
                    d3.select(this).attr('fill', '#ffcc00').style('opacity', 0.8);
                    const stateData = data.find((item) => normalizeName(item.Estado) === normalizeName(d.properties.NM_UF));
                    const tooltip = d3.select('body').append('div')
                        .attr('class', 'tooltip')
                        .style('position', 'absolute')
                        .style('background', 'rgba(0,0,0,0.8)')
                        .style('color', '#fff')
                        .style('padding', '8px')
                        .style('border-radius', '4px')
                        .style('pointer-events', 'none')
                        .html(
                            `<strong>${d.properties.NM_UF}</strong><br>` +
                            `Volume: ${stateData ? stateData.DinheiroMovimentado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'N/A'}<br>` +
                            `Transactions: ${stateData ? stateData.QuantidadeTransacoes.toLocaleString('pt-BR') : 'N/A'}<br>` +
                            `Avg Ticket: ${stateData ? stateData.TicketMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'N/A'}`
                        )
                        .style('left', `${event.pageX + 10}px`)
                        .style('top', `${event.pageY - 28}px`);
                })
                .on('mouseout', function (event, d) {
                    const stateData = data.find((item) => normalizeName(item.Estado) === normalizeName(d.properties.NM_UF));
                    d3.select(this)
                        .attr('fill', stateData && typeof stateData[mapVariable] === 'number' && !isNaN(stateData[mapVariable]) && stateData[mapVariable] !== null
                            ? colorScale(stateData[mapVariable] as number)
                            : '#d3d3d3')
                        .style('opacity', 1);
                    d3.select('.tooltip').remove();
                });

            const legendWidth = 20;
            const legendHeight = 200;
            const legend = svg.append('g')
                .attr('transform', `translate(${width - 50}, 20)`);

            const legendScale = d3.scaleLinear()
                .domain(valueExtent as [number, number])
                .range([legendHeight, 0]);

            const legendAxis = d3.axisRight(legendScale)
                .ticks(5)
                .tickFormat((d) => d.toLocaleString('pt-BR'));

            legend.append('g')
                .attr('transform', `translate(${legendWidth}, 0)`)
                .call(legendAxis);

            const gradient = svg.append('defs')
                .append('linearGradient')
                .attr('id', 'legend-gradient')
                .attr('x1', '0%')
                .attr('y1', '100%')
                .attr('x2', '0%')
                .attr('y2', '0%');

            gradient.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', d3.interpolateBlues(0));

            gradient.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', d3.interpolateBlues(1));

            legend.append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', legendWidth)
                .attr('height', legendHeight)
                .style('fill', 'url(#legend-gradient)');
        }
    }, [data, geoJson, loading, filterState, mapVariable, mapDimensions]);

    const handleSort = (key: keyof AggregatedMetrics) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        const aValue = a[key];
        const bValue = b[key];

        if (aValue === null || bValue === null) return 0;
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredData = sortedData.filter((item) =>
        normalizeName(item.Estado).includes(normalizeName(filterState))
    );

    const barChartSortedData = [...filteredData].sort((a, b) => b.DinheiroMovimentado - a.DinheiroMovimentado);
    const avgTicketSortedData = [...filteredData].sort((a, b) => b.TicketMedio - a.TicketMedio);

    const barChartData = {
        labels: barChartSortedData.map((item) => item.Estado),
        datasets: [
            {
                label: 'Transaction Volume (BRL)',
                data: barChartSortedData.map((item) => item.DinheiroMovimentado),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const avgTicketChartData = {
        labels: avgTicketSortedData.map((item) => item.Estado),
        datasets: [
            {
                label: 'Average Ticket (BRL)',
                data: avgTicketSortedData.map((item) => item.TicketMedio),
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            },
        ],
    };

    const avgPF = filteredData.reduce((sum, item) => sum + item.ParticipacaoPF, 0) / (filteredData.length || 1);
    const avgPJ = filteredData.reduce((sum, item) => sum + item.ParticipacaoPJ, 0) / (filteredData.length || 1);
    const pieChartData = {
        labels: ['Individual (PF)', 'Business (PJ)'],
        datasets: [
            {
                data: [avgPF, avgPJ],
                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const scatterChartData = {
        datasets: [
            {
                label: 'States',
                data: filteredData.map((item) => ({
                    x: item.DinheiroMovimentado,
                    y: item.TicketMedio,
                    label: item.Estado,
                })),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                pointRadius: 6,
            },
        ],
    };

    const payerReceiverRatioData = {
        labels: filteredData.map((item) => item.Estado),
        datasets: [
            {
                label: 'Payers/Receivers Ratio (PF)',
                data: filteredData.map((item) => item.RelacaoPagadoresRecebedoresPF),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
            {
                label: 'Payers/Receivers Ratio (PJ)',
                data: filteredData.map((item) => item.RelacaoPagadoresRecebedoresPJ),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const totalPagadoresPF = filteredData.reduce((sum, item) => sum + item.PagadoresUnicosPF, 0);
    const totalRecebedoresPF = filteredData.reduce((sum, item) => sum + item.RecebedoresUnicosPF, 0);
    const totalPagadoresPJ = filteredData.reduce((sum, item) => sum + item.PagadoresUnicosPJ, 0);
    const totalRecebedoresPJ = filteredData.reduce((sum, item) => sum + item.RecebedoresUnicosPJ, 0);

    const totalVolume = filteredData.reduce((sum, item) => sum + item.DinheiroMovimentado, 0);
    const totalTransactions = filteredData.reduce((sum, item) => sum + item.QuantidadeTransacoes, 0);
    const totalVolumePagadorPF = filteredData.reduce((sum, item) => sum + item.VolumePagadorPF, 0);
    const totalVolumePagadorPJ = filteredData.reduce((sum, item) => sum + item.VolumePagadorPJ, 0);
    const totalVolumeRecebedorPF = filteredData.reduce((sum, item) => sum + item.VolumeRecebedorPF, 0);
    const totalVolumeRecebedorPJ = filteredData.reduce((sum, item) => sum + item.VolumeRecebedorPJ, 0);
    const topStateVolume = barChartSortedData[0]?.DinheiroMovimentado || 0;
    const topState = barChartSortedData[0]?.Estado || 'N/A';

    const payersPieChartData = {
        labels: ['Payers (PF)', 'Payers (PJ)'],
        datasets: [
            {
                data: [totalPagadoresPF, totalPagadoresPJ],
                backgroundColor: ['rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)'],
                borderColor: ['rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const receiversPieChartData = {
        labels: ['Receivers (PF)', 'Receivers (PJ)'],
        datasets: [
            {
                data: [totalRecebedoresPF, totalRecebedoresPJ],
                backgroundColor: ['rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'],
                borderColor: ['rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const payersVolumePieChartData = {
        labels: ['Payers Volume (PF)', 'Payers Volume (PJ)'],
        datasets: [
            {
                data: [totalVolumePagadorPF, totalVolumePagadorPJ],
                backgroundColor: ['rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)'],
                borderColor: ['rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const receiversVolumePieChartData = {
        labels: ['Receivers Volume (PF)', 'Receivers Volume (PJ)'],
        datasets: [
            {
                data: [totalVolumeRecebedorPF, totalVolumeRecebedorPJ],
                backgroundColor: ['rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'],
                borderColor: ['rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const downloadCSV = () => {
        const headers = [
            'State',
            'Transaction Volume (BRL)',
            'Transaction Count',
            'Average Ticket (BRL)',
            '% Individuals (PF)',
            '% Businesses (PJ)',
            'Unique Payers (PF)',
            'Unique Payers (PJ)',
            'Unique Receivers (PF)',
            'Unique Receivers (PJ)',
            'Payers/Receivers Ratio (PF)',
            'Payers/Receivers Ratio (PJ)',
        ];
        const csvContent = [
            headers.join(','),
            ...filteredData.map((item) => [
                item.Estado,
                item.DinheiroMovimentado,
                item.QuantidadeTransacoes,
                item.TicketMedio,
                item.ParticipacaoPF,
                item.ParticipacaoPJ,
                item.PagadoresUnicosPF,
                item.PagadoresUnicosPJ,
                item.RecebedoresUnicosPF,
                item.RecebedoresUnicosPJ,
                item.RelacaoPagadoresRecebedoresPF || 'N/A',
                item.RelacaoPagadoresRecebedoresPJ || 'N/A',
            ].join(','))
        ].join('');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'pix_data.csv';
        link.click();
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 xs:py-10 sm:py-12 md:py-16 bg-gray-50 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700 animate-pulse">Fetching Pix data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 xs:py-10 sm:py-12 md:py-16 bg-gray-50 flex items-center justify-center min-h-screen">
                <div className="text-center p-4 text-red-500 bg-red-100 rounded">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 xs:py-10 sm:py-12 md:py-16 bg-gray-50 relative">
            {isUpdating && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-lg font-semibold text-gray-700">Updating data...</p>
                    </div>
                </div>
            )}
            <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">Pix Transaction Explorer</h1>
            <p className="text-lg text-gray-600 text-center mb-8">An interactive dashboard to explore Pix usage across Brazil.</p>

            <div className="flex justify-center mb-6">
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {Array.from({ length: 19 }, (_, i) => {
                        const year = 2024 + Math.floor(i / 12);
                        const monthIndex = i % 12;
                        const month = new Date(0, monthIndex).toLocaleString('default', { month: 'long' });
                        const value = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
                        if (year === 2025 && monthIndex > 6) return null; // Exclude months after July 2025
                        return <option key={value} value={value}>{`${month} ${year}`}</option>;
                    }).filter(Boolean)}
                </select>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-semibold mb-4">What is Pix?</h2>
                <p className="text-gray-700">
                    Pix is an instant payment system created by the Central Bank of Brazil. It allows for free, real-time money transfers 24/7, including weekends and holidays.
                    Since its launch in 2020, Pix has revolutionized the way Brazilians handle their finances, promoting financial inclusion and reducing the reliance on cash and traditional banking methods.
                </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-xl font-semibold mb-4">Summary Statistics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 rounded">
                        <p className="text-sm text-gray-600">Total Volume</p>
                        <p className="text-lg font-bold">
                            {totalVolume.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded">
                        <p className="text-sm text-gray-600">Total Transactions</p>
                        <p className="text-lg font-bold">{totalTransactions.toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded">
                        <p className="text-sm text-gray-600">Top State</p>
                        <p className="text-lg font-bold">{topState}</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded">
                        <p className="text-sm text-gray-600">Top State Volume</p>
                        <p className="text-lg font-bold">
                            {topStateVolume.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <input
                    type="text"
                    placeholder="Filter by State"
                    value={filterState}
                    onChange={(e) => setFilterState(e.target.value)}
                    className="p-2 border rounded w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={downloadCSV}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Download CSV
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8">
                <div className="bg-white p-4 rounded shadow" ref={mapContainerRef}>
                    <h2 className="text-xl font-semibold mb-4">Transaction Map by State</h2>
                    <div className="flex justify-center mb-4">
                        <button onClick={() => setMapVariable('DinheiroMovimentado')} className={`px-4 py-2 rounded-l-lg ${mapVariable === 'DinheiroMovimentado' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Volume</button>
                        <button onClick={() => setMapVariable('QuantidadeTransacoes')} className={`px-4 py-2 ${mapVariable === 'QuantidadeTransacoes' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Transactions</button>
                        <button onClick={() => setMapVariable('TicketMedio')} className={`px-4 py-2 rounded-r-lg ${mapVariable === 'TicketMedio' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Average Ticket</button>
                    </div>
                    <div className="flex justify-center">
                        <svg ref={mapRef}></svg>
                    </div>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Transaction Volume by State</h2>
                    <Bar
                        data={barChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'top' },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => {
                                            const state = barChartSortedData[context.dataIndex];
                                            return [
                                                `${context.dataset.label}: ${context.parsed.y.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
                                                `Transactions: ${state.QuantidadeTransacoes.toLocaleString('pt-BR')}`,
                                                `Avg Ticket: ${state.TicketMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
                                            ];
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Average Ticket by State</h2>
                    <Bar
                        data={avgTicketChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'top' },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => {
                                            const state = avgTicketSortedData[context.dataIndex];
                                            return [
                                                `${context.dataset.label}: ${context.parsed.y.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
                                                `Transactions: ${state.QuantidadeTransacoes.toLocaleString('pt-BR')}`,
                                                `Volume: ${state.DinheiroMovimentado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
                                            ];
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Individual vs Business Participation</h2>
                    <Pie
                        data={pieChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'top' },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => `${context.label}: ${context.parsed.toFixed(2)}%`,
                                    },
                                },
                            },
                        }}
                    />
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Volume vs. Average Ticket</h2>
                    <Scatter
                        data={scatterChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'top' },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => {
                                            const state = context.raw as { label: string; x: number; y: number };
                                            return [
                                                `${state.label}`,
                                                `Volume: ${state.x.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
                                                `Avg Ticket: ${state.y.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
                                            ];
                                        },
                                    },
                                },
                            },
                            scales: {
                                x: {
                                    title: { display: true, text: 'Transaction Volume (BRL)' },
                                    ticks: {
                                        callback: (value) => `${Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
                                    },
                                },
                                y: {
                                    title: { display: true, text: 'Average Ticket (BRL)' },
                                    ticks: {
                                        callback: (value) => `${Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
                                    },
                                },
                            },
                        }}
                    />
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Payer/Receiver Ratio by State</h2>
                    <Bar
                        data={payerReceiverRatioData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'top' },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => {
                                            const state = filteredData[context.dataIndex];
                                            return [
                                                `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`,
                                                `PF: ${state.RelacaoPagadoresRecebedoresPF?.toFixed(2) ?? 'N/A'}`,
                                                `PJ: ${state.RelacaoPagadoresRecebedoresPJ?.toFixed(2) ?? 'N/A'}`,
                                            ];
                                        },
                                    },
                                },
                            },
                            scales: {
                                y: {
                                    title: { display: true, text: 'Ratio' },
                                },
                            },
                        }}
                    />
                </div>
                {/* <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Payers (PF vs PJ)</h2>
                    <Pie
                        data={payersPieChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'top' },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => `${context.label}: ${context.parsed.toLocaleString('pt-BR')}`,
                                    },
                                },
                            },
                        }}
                    />
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Receivers (PF vs PJ)</h2>
                    <Pie
                        data={receiversPieChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'top' },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => `${context.label}: ${context.parsed.toLocaleString('pt-BR')}`,
                                    },
                                },
                            },
                        }}
                    />
                </div> */}
            </div>

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            {[
                                'State',
                                'Transaction Volume (BRL)',
                                'Transaction Count',
                                'Average Ticket (BRL)',
                                '% Individuals (PF)',
                                '% Businesses (PJ)',
                                'Unique Payers (PF)',
                                'Unique Payers (PJ)',
                                'Unique Receivers (PF)',
                                'Unique Receivers (PJ)',
                                'Payers/Receivers Ratio (PF)',
                                'Payers/Receivers Ratio (PJ)',
                            ].map((header, index) => (
                                <th
                                    key={index}
                                    className="px-4 py-2 border cursor-pointer hover:bg-gray-200"
                                    onClick={() =>
                                        handleSort(
                                            header === 'State'
                                                ? 'Estado'
                                                : header === 'Transaction Volume (BRL)'
                                                    ? 'DinheiroMovimentado'
                                                    : header === 'Transaction Count'
                                                        ? 'QuantidadeTransacoes'
                                                        : header === 'Average Ticket (BRL)'
                                                            ? 'TicketMedio'
                                                            : header === '% Individuals (PF)'
                                                                ? 'ParticipacaoPF'
                                                                : header === '% Businesses (PJ)'
                                                                    ? 'ParticipacaoPJ'
                                                                    : header === 'Unique Payers (PF)'
                                                                        ? 'PagadoresUnicosPF'
                                                                        : header === 'Unique Payers (PJ)'
                                                                            ? 'PagadoresUnicosPJ'
                                                                            : header === 'Unique Receivers (PF)'
                                                                                ? 'RecebedoresUnicosPF'
                                                                                : header === 'Unique Receivers (PJ)'
                                                                                    ? 'RecebedoresUnicosPJ'
                                                                                    : header === 'Payers/Receivers Ratio (PF)'
                                                                                        ? 'RelacaoPagadoresRecebedoresPF'
                                                                                        : 'RelacaoPagadoresRecebedoresPJ'
                                        )
                                    }
                                >
                                    {header}
                                    {sortConfig?.key ===
                                        (header === 'State'
                                            ? 'Estado'
                                            : header === 'Transaction Volume (BRL)'
                                                ? 'DinheiroMovimentado'
                                                : header === 'Transaction Count'
                                                    ? 'QuantidadeTransacoes'
                                                    : header === 'Average Ticket (BRL)'
                                                        ? 'TicketMedio'
                                                        : header === '% Individuals (PF)'
                                                            ? 'ParticipacaoPF'
                                                            : header === '% Businesses (PJ)'
                                                                ? 'ParticipacaoPJ'
                                                                : header === 'Unique Payers (PF)'
                                                                    ? 'PagadoresUnicosPF'
                                                                    : header === 'Unique Payers (PJ)'
                                                                        ? 'PagadoresUnicosPJ'
                                                                        : header === 'Unique Receivers (PF)'
                                                                            ? 'RecebedoresUnicosPF'
                                                                            : header === 'Unique Receivers (PJ)'
                                                                                ? 'RecebedoresUnicosPJ'
                                                                                : header === 'Payers/Receivers Ratio (PF)'
                                                                                    ? 'RelacaoPagadoresRecebedoresPF'
                                                                                    : 'RelacaoPagadoresRecebedoresPJ') &&
                                        (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border">{item.Estado}</td>
                                <td className="px-4 py-2 border">
                                    {item.DinheiroMovimentado.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })}
                                </td>
                                <td className="px-4 py-2 border">{item.QuantidadeTransacoes.toLocaleString('pt-BR')}</td>
                                <td className="px-4 py-2 border">
                                    {item.TicketMedio.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })}
                                </td>
                                <td className="px-4 py-2 border">{item.ParticipacaoPF.toFixed(2)}%</td>
                                <td className="px-4 py-2 border">{item.ParticipacaoPJ.toFixed(2)}%</td>
                                <td className="px-4 py-2 border">{item.PagadoresUnicosPF.toLocaleString('pt-BR')}</td>
                                <td className="px-4 py-2 border">{item.PagadoresUnicosPJ.toLocaleString('pt-BR')}</td>
                                <td className="px-4 py-2 border">{item.RecebedoresUnicosPF.toLocaleString('pt-BR')}</td>
                                <td className="px-4 py-2 border">{item.RecebedoresUnicosPJ.toLocaleString('pt-BR')}</td>
                                <td className="px-4 py-2 border">
                                    {item.RelacaoPagadoresRecebedoresPF
                                        ? item.RelacaoPagadoresRecebedoresPF.toFixed(2)
                                        : 'N/A'}
                                </td>
                                <td className="px-4 py-2 border">
                                    {item.RelacaoPagadoresRecebedoresPJ
                                        ? item.RelacaoPagadoresRecebedoresPJ.toFixed(2)
                                        : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mt-8">
                <h2 className="text-2xl font-semibold mb-4">Data Source</h2>
                <p className="text-gray-700">
                    The data used in this dashboard is sourced from the Central Bank of Brazil's official statistics on Pix transactions. The data is updated periodically and provides a comprehensive overview of the Pix ecosystem.
                </p>
            </div>

            <style jsx>{`
        .tooltip {
          z-index: 1000;
        }
        svg path {
          fill-opacity: 1 !important;
          transition: fill 0.2s, opacity 0.2s;
        }
      `}</style>
        </div>
    );
};

export default PixExplorer;