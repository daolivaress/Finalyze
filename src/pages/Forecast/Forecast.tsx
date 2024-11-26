import { useState } from "react";
import BaseLayout from "../../layout/BaseLayout/BaseLayout";
import LineChart from "../../components/charts/LineChart/LineChart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HelpButton from "@/components/common/HelpButton/HelpButton";
import IAButton from "@/components/IAButton/IAButton";

export const indicators = [
  "ROTACION INVENTARIO",
  "LIQUIDEZ",
  "ENDEUDAMIENTO CORTO PLAZO",
  "ENDEUDAMIENTO LARGO PLAZO",
  "COBERTURA DE INTERESES",
  "MARGEN DE UTILIDAD BRUTA (%)",
  "MARGEN DE UTILIDAD NETA (%)",
  "ROA (%)",
  "ROI (%)",
  "SOLVENCIA",
];

const Forecast = ({ title }: { title: string }) => {
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(
    null
  );
  const [indicatorData, setIndicatorData] = useState<any | null>(null);

  const formatIndicator = (indicator: string) => {
    // Excluir ROI y ROA del formato capitalizado
    if (["ROI (%)", "ROA (%)"].includes(indicator)) {
      return indicator;
    }
    return indicator
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitaliza la primera letra de cada palabra
  };

  const handleIndicatorClick = async (indicator: string) => {
    setSelectedIndicator(indicator);

    try {
      const response = await fetch(
        `https://pf-backend-2f6r.onrender.com/prediction-indicators?nombre=${encodeURIComponent(
          indicator
        )}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los datos del indicador");
      }
      const data = await response.json();

      // Transformar los datos al formato esperado por LineChart
      const formattedData = {
        labels: data.map((item: any) => {
          const [_year, month] = item.Fecha.split("-").map(Number);
          const monthNames = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
          ];
          return monthNames[month - 1];
        }),
        datasets: [
          {
            label: indicator,
            data: data.map((item: any) => item[indicator]),
            borderColor: "rgba(56,133,208,255)",
            backgroundColor: "rgba(56,133,208, 0.3)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      };

      setIndicatorData(formattedData);
    } catch (error) {
      console.error("Error al obtener los datos del indicador:", error);
      alert(
        "Hubo un problema al obtener los datos. Por favor, intenta nuevamente."
      );
    }
  };

  return (
    <BaseLayout>
      <section>
        <div className="flex justify-between py-8 px-6">
          <div>
            <h1 className="font-semibold text-6xl mb-1">{title}</h1>
            <p className="text-[var(--font-secondary-color)] font-bold">
              Jan 1 - Oct 29, 2024
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-2 max-xl:items-start items-center px-2">
          <div className="hidden max-xl:flex max-xl:flex-col ml-2">
            <Select onValueChange={(value) => handleIndicatorClick(value)}>
              <SelectTrigger className="bg-white outline-none w-[200px]">
                <SelectValue placeholder="Selecciona un indicador" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Indicadores:</SelectLabel>
                  {indicators.map((indicator, index) => (
                    <SelectItem key={index} value={indicator}>
                      {formatIndicator(indicator)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="hidden xl:flex gap-2 bg-neutral-300 overflow-x-auto hide-scrollbar w-[1110px] p-2 rounded-full mb-2">
            {indicators.map((indicator, index) => (
              <button
                key={index}
                onClick={() => handleIndicatorClick(indicator)}
                aria-label={`Seleccionar indicador: ${indicator}`}
                className={`${
                  selectedIndicator === indicator
                    ? "bg-black text-white font-medium"
                    : "bg-neutral-700 text-white font-light hover:bg-black hover:font-medium"
                } rounded-full w-[300px] text-sm flex-shrink-0 py-1 transition-all duration-75`}
              >
                {formatIndicator(indicator)}
              </button>
            ))}
          </div>
          <div className="bg-white border border-gray-300 w-full rounded-xl max-lg:max-w-[800px] xl:max-w-screen-xl mx-auto flex flex-row-reverse items-center py-8 px-2 md:px-12 gap-4 relative">
            <div
              id="chart-filters" className="absolute top-4 right-4"
            >
              <IAButton/>
            </div>
            {indicatorData ? (
              <LineChart
                dataset={indicatorData}
                title={`Pronóstico de ${formatIndicator(
                  selectedIndicator as string
                )}`}
                ylabel={formatIndicator(selectedIndicator as string)}
              />
            ) : (
              <p className="text-gray-500 mx-auto">
                Selecciona un indicador para ver el gráfico.
              </p>
            )}
          </div>
        </div>
        <HelpButton>
          <p>
            En la seccion de <strong>Pronósticos</strong> encontraras valores
            previstos para métricas clave basadas en datos históricos.
          </p>
        </HelpButton>
      </section>
    </BaseLayout>
  );
};

export default Forecast;
