import { Line } from 'react-chartjs-2';
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

type LineChartProps = {
  dataset: ChartData<"line", (number | Point | null)[], unknown>;
  title: string;
  ylabel: string;
};

// Registrar componentes de Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const LineChart = ({dataset, title, ylabel}: LineChartProps) => {
  // Opciones del gráfico
  const options = {
    responsive: true, // Permite que el gráfico sea responsivo
    maintainAspectRatio: false, // Desactiva la proporción fija para redimensionar correctamente
    plugins: {
      legend: {
        display: true,
        position: 'top' as const, // Posición de la leyenda
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
          text: 'Meses',
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
      <Line data={dataset} options={options} />
    </div>
  );
};

export default LineChart;
