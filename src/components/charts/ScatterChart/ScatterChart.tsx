import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  Point,
} from 'chart.js';

type ScatterChartProps = {
  dataset: ChartData<"scatter", (number | Point | null)[], unknown>;
  title: string;
  ylabel: string;
  xlabel: string;
};

// Registrar componentes de Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const calculateTrendLine = (data: (number | Point | null)[]) => {
  const points = data.filter((point): point is Point => point !== null && typeof point !== 'number');
  const n = points.length;
  const sumX = points.reduce((sum, point) => sum + point.x, 0);
  const sumY = points.reduce((sum, point) => sum + point.y, 0);
  const sumXY = points.reduce((sum, point) => sum + point.x * point.y, 0);
  const sumX2 = points.reduce((sum, point) => sum + point.x * point.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const trendLine = points.map(point => ({
    x: point.x,
    y: slope * point.x + intercept,
  }));

  return trendLine;
};

const ScatterChart = ({dataset, title, ylabel, xlabel}: ScatterChartProps) => {
  const trendLineData = calculateTrendLine(dataset.datasets[0].data as (number | Point | null)[]);

  const trendLineDataset = {
    label: 'Trend Line',
    data: trendLineData,
    borderColor: 'rgba(255, 0, 0, 0.3)',
    borderWidth: 2,
    showLine: true,
    fill: false,
    pointRadius: 0,
  };

  const updatedDataset = {
    ...dataset,
    datasets: [...dataset.datasets, trendLineDataset],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xlabel,
        },
      },
      y: {
        title: {
          display: true,
          text: ylabel,
        },
      },
    },
  };

  return (
    <div className="w-full h-[300px] md:h-[400px]">
      <Scatter data={updatedDataset} options={options} />
    </div>
  );
};

export default ScatterChart;
