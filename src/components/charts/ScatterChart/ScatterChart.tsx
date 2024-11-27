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

const ScatterChart = ({dataset, title, ylabel, xlabel}: ScatterChartProps) => {
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
      <Scatter data={dataset} options={options} />
    </div>
  );
};

export default ScatterChart;
