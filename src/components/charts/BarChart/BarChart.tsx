import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartData,
  Point,
  BubbleDataPoint,
} from 'chart.js';

  
type BarChartProps = {
  dataset: ChartData<"bar", (number | [number, number] | Point | BubbleDataPoint | null)[], unknown>;
  title: string;
  ylabel: string;
};

// Registrar componentes de Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BarChart = ({dataset, title, ylabel}: BarChartProps) => {

  const options = {
    responsive: true, // Permite que el gráfico sea responsivo
    maintainAspectRatio: false, // Desactiva la proporción fija para redimensionar correctamente
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
          text: "Meses",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: ylabel,
        },
      },
    },
  };

  return (
    <div className="w-full h-[300px] md:h-[400px]">
      <Bar data={dataset} options={options} />
    </div>
  );
};

export default BarChart;
