import { useContext, useEffect, useState } from "react";
import BaseLayout from "../../layout/BaseLayout/BaseLayout";
import LineChart from "../../components/charts/LineChart/LineChart";
import BarChart from "../../components/charts/BarChart/BarChart";
import ScatterChart from "../../components/charts/ScatterChart/ScatterChart";
import { BsThreeDotsVertical } from "react-icons/bs";
import KPICard from "@/components/KPICard/KPICard";
import { FinalyzeContext, FinalyzeContextType } from "@/context/Context";
import { indicators } from "../Forecast/Forecast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSpring, animated } from "react-spring";
import HelpButton from "@/components/common/HelpButton/HelpButton";
import IAButton from "@/components/IAButton/IAButton";

type AnalysisProps = {
  title: string;
};

const Analysis = ({ title }: AnalysisProps) => {
  const context = useContext(FinalyzeContext) as FinalyzeContextType;

  const { ingresos, costos } = context.getLastTwoMonthsData();

  // Ordenar dataIndicators por Fecha usando cadenas
  const sortedDataIndicators = context.dataIndicators
    .slice()
    .sort((a: any, b: any) => {
      return a["Fecha"].localeCompare(b["Fecha"]);
    });
  // Validar y formatear las etiquetas de fecha usando cadenas
  const labels = sortedDataIndicators.map((item: any) => {
    const [year, month] = item["Fecha"].split("-").map(Number);
    const monthNames = [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ];
    return `${monthNames[month - 1]} ${year}`;
  });

  // Dataset para ROI
  const ROIDataset = {
    labels,
    datasets: [
      {
        label: "ROI (%)",
        data: sortedDataIndicators.map((item: any) => item["ROI (%)"] ?? 0),
        backgroundColor: "rgba(79, 224, 142,0.5)",
        borderColor: "rgba(79, 224, 142,255)",
        borderWidth: 1,
      },
    ],
  };

  // Dataset para ROI
  const RIDataset = {
    labels,
    datasets: [
      {
        label: "Rotacion de Inventario",
        data: sortedDataIndicators.map(
          (item: any) => item["ROTACION INVENTARIO"] ?? 0
        ),
        backgroundColor: "rgba(79, 224, 142,0.5)",
        borderColor: "rgba(79, 224, 142,255)",
        borderWidth: 1,
      },
    ],
  };

  // Dataset para Cobertura de Intereses (CI) vs Margen de Utilidad Neta (MUN)
  const MUBDataset = {
    labels,
    datasets: [
      {
        label: "MARGEN DE UTILIDAD BRUTA (%)",
        data: sortedDataIndicators.map(
          (item: any) => item["MARGEN DE UTILIDAD BRUTA (%)"] ?? 0
        ),
        borderColor: "rgba(56,133,208,255)",
        backgroundColor: "rgba(56,133,208,0.3)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 4,
      },
    ],
  };

  const [selectedChartType, setSelectedChartType] = useState<string>("");
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [dynamicDataset, setDynamicDataset] = useState<any | null>(null);

  const handleGenerateChart = () => {
    const dataset = chartTypeDataset(selectedIndicators, selectedChartType);
    setDynamicDataset(dataset);
  };

  const chartTypeDataset = (dataset: string[], chartType: string) => {
    if (chartType === "scatter") {
      const scatterDataset = {
        datasets: [
          {
            label: `${dataset[0]} vs ${dataset[1] ?? "N/A"}`,
            data: context.dataIndicators.map((item: any) => ({
              x: item[dataset[0]] ?? 0,
              y: item[dataset[1]] ?? 0,
            })),
            backgroundColor: "rgba(56,133,208,255)",
          },
        ],
      };
      return scatterDataset;
    } else if (chartType === "bar") {
      const barChartDataset = {
        labels,
        datasets: [
          {
            label: dataset[0],
            data: sortedDataIndicators.map(
              (item: any) => item[dataset[0]] ?? 0
            ),
            backgroundColor: "rgba(79, 224, 142, 0.5)",
            borderColor: "rgba(79, 224, 142, 1)",
            borderWidth: 1,
          },
          ...(dataset[1]
            ? [
                {
                  label: dataset[1],
                  data: sortedDataIndicators.map(
                    (item: any) => item[dataset[1]] ?? 0
                  ),
                  backgroundColor: "rgba(207, 222, 71, 0.5)",
                  borderColor: "rgba(207, 222, 71, 1)",
                  borderWidth: 1,
                },
              ]
            : []),
        ],
      };
      return barChartDataset;
    } else if (chartType === "line") {
      const lineChartDataset = {
        labels,
        datasets: [
          {
            label: dataset[0],
            data: sortedDataIndicators.map(
              (item: any) => item[dataset[0]] ?? 0
            ),
            borderColor: "rgba(56,133,208,255)",
            backgroundColor: "rgba(56,133,208, 0.3)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 2,
            pointHoverRadius: 4,
          },
          ...(dataset[1]
            ? [
                {
                  label: dataset[1],
                  data: sortedDataIndicators.map(
                    (item: any) => item[dataset[1]] ?? 0
                  ),
                  borderColor: "#FF9800",
                  backgroundColor: "rgba(255, 152, 0, 0.2)",
                  borderWidth: 2,
                  fill: true,
                  tension: 0.4,
                  pointRadius: 2,
                  pointHoverRadius: 4,
                },
              ]
            : []),
        ],
      };
      return lineChartDataset;
    }
  };

  const { liquidez } = context.getLastTwoMonthsLIQ();

  const currentLiquidity = liquidez[0];

  const props = useSpring({
    to: { number: currentLiquidity },
    from: { number: 0 },
    config: {
      duration: 1200,
      easing: (t) =>
        t < 0.5 ? 2 * Math.pow(t, 2) : 1 - Math.pow(-2 * t + 2, 2) / 2, // Ease-in-out
    },
  });

  const liquidezChange =
    liquidez.length >= 2
      ? context.calculatePercentageChange(liquidez[0], liquidez[1])
      : 0;

  const [liquidityClass, setLiquidityClass] = useState("");

  useEffect(() => {
    const newClass =
      currentLiquidity < 1.0
        ? "bg-red-100 border-red-300 animated-bg-red"
        : currentLiquidity >= 1.0 && currentLiquidity <= 1.5
        ? "bg-yellow-100 border-yellow-300 animated-bg-yellow"
        : "bg-green-100 border-green-300 animated-bg-green";
    setLiquidityClass(newClass);
  }, [currentLiquidity]);

  return (
    <BaseLayout>
      <section>
        <div className="flex flex-col lg:flex-row justify-between lg:items-center py-8 px-6">
          <div>
            <h1 className="font-semibold text-6xl mb-1">{title}</h1>
            <p className="text-[var(--font-secondary-color)] font-bold">
              Jan 1 - Oct 29, 2024
            </p>
          </div>
          <div className="flex gap-4 max-lg:mt-4">
            <KPICard title="Ingresos totales" value={ingresos} />
            <KPICard title="Costo de productos y servicios" value={costos} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-2 justify-center gap-4 px-4">
          <div className="bg-white w-full rounded-xl flex flex-col items-center p-6 border border-gray-300 lg:col-span-2 relative">
            <div className="absolute z-50 md:right-6 right-3 max-md:top-3 ">
              <IAButton />
            </div>
            <div className="absolute left-0 top-0 m-4 hidden max-lg:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 bg-gray-100 text-gray-500 shadow border rounded-md hover:bg-gray-200 hover:text-black transition">
                    <BsThreeDotsVertical className="size-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  sideOffset={8}
                  align="start"
                  className="w-56"
                >
                  <DropdownMenuLabel className="px-4 py-2 text-sm font-semibold">
                    Crear gráfica
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1 h-px bg-gray-200" />
                  <DropdownMenuItem
                    className="px-4 py-2 text-sm cursor-pointer"
                    onSelect={(e) => e.preventDefault()} // Evita el cierre del dropdown
                  >
                    <Select
                      onValueChange={(value) => setSelectedChartType(value)}
                      value={selectedChartType}
                    >
                      <SelectTrigger className="bg-white outline-none w-full">
                        <SelectValue placeholder="Selecciona un tipo de gráfico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tipo de Gráfico:</SelectLabel>
                          <SelectItem value="line">Line Chart</SelectItem>
                          <SelectItem value="bar">Bar Chart</SelectItem>
                          <SelectItem value="scatter">Scatter Chart</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-4 py-2 text-sm cursor-pointer"
                    onSelect={(e) => e.preventDefault()} // Evita el cierre del dropdown
                  >
                    <Select
                      onValueChange={(value) =>
                        setSelectedIndicators((prev) => [value, prev[1]])
                      }
                      value={selectedIndicators[0]}
                    >
                      <SelectTrigger className="bg-white outline-none w-full">
                        <SelectValue placeholder="Primer indicador" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Indicadores:</SelectLabel>
                          {indicators.map((indicator, index) => (
                            <SelectItem key={index} value={indicator}>
                              {indicator}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </DropdownMenuItem>
                  {selectedChartType === "scatter" || selectedIndicators[1] ? (
                    <DropdownMenuItem
                      className="px-4 py-2 text-xs cursor-pointer"
                      onSelect={(e) => e.preventDefault()} // Evita el cierre del dropdown
                    >
                      <Select
                        onValueChange={(value) =>
                          setSelectedIndicators((prev) => [prev[0], value])
                        }
                        value={selectedIndicators[1]}
                      >
                        <SelectTrigger className="bg-white outline-none w-full">
                          <SelectValue placeholder="Segundo indicador" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Indicadores:</SelectLabel>
                            {indicators.map((indicator, index) => (
                              <SelectItem key={index} value={indicator}>
                                {indicator}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="px-4 py-2 text-xs"
                      onSelect={(e) => e.preventDefault()} // Evita el cierre del dropdown
                    >
                      <button
                        type="button"
                        className="w-full bg-gray-300 text-black text-xs p-2 rounded-lg"
                        onClick={() =>
                          setSelectedIndicators((prev) => [
                            prev[0],
                            "SOLVENCIA",
                          ])
                        }
                      >
                        Agregar segundo indicador
                      </button>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="px-4 py-2 text-sm"
                    onSelect={() => {
                      // Permite el cierre del dropdown solo al generar la gráfica
                      handleGenerateChart();
                    }}
                  >
                    <button
                      type="button"
                      className="w-full bg-black text-white text-xs px-4 py-2 rounded-lg hover:bg-neutral-800 hover:scale-105 transition-all"
                    >
                      Generar gráfica
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <form
              className="hidden lg:flex flex-col md:flex-row max-lg:gap-2 gap-6 justify-center items-center pt-4 pb-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerateChart();
              }}
            >
              <Select
                onValueChange={(value) => setSelectedChartType(value)}
                value={selectedChartType}
              >
                <SelectTrigger className="bg-white outline-none w-[200px]">
                  <SelectValue placeholder="Selecciona un tipo de gráfico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipo de Gráfico:</SelectLabel>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="scatter">Scatter Chart</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) =>
                  setSelectedIndicators((prev) => [value, prev[1]])
                }
                value={selectedIndicators[0]}
              >
                <SelectTrigger className="bg-white outline-none w-[200px]">
                  <SelectValue placeholder="Primer indicador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Indicadores:</SelectLabel>
                    {indicators.map((indicator, index) => (
                      <SelectItem key={index} value={indicator}>
                        {indicator}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {selectedChartType === "scatter" || selectedIndicators[1] ? (
                <Select
                  onValueChange={(value) =>
                    setSelectedIndicators((prev) => [prev[0], value])
                  }
                  value={selectedIndicators[1]}
                >
                  <SelectTrigger className="bg-white outline-none w-[200px]">
                    <SelectValue placeholder="Segundo indicador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Indicadores:</SelectLabel>
                      {indicators.map((indicator, index) => (
                        <SelectItem key={index} value={indicator}>
                          {indicator}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              ) : (
                <button
                  type="button"
                  className="bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-300 hover:text-black hover:font-semibold transition-all"
                  onClick={() =>
                    setSelectedIndicators((prev) => [prev[0], "SOLVENCIA"])
                  }
                >
                  Agregar segundo indicador
                </button>
              )}

              <button
                type="submit"
                className="bg-black text-white px-4 py-2 text-sm rounded-lg hover:bg-neutral-800 hover:scale-105 transition-all"
              >
                Generar gráfica
              </button>
            </form>

            {!dynamicDataset && (
              <p className="text-gray-500 mx-auto my-auto">
                Seleccione un tipo de gráfico y los indicadores para generar la
                gráfica.
              </p>
            )}

            {dynamicDataset && selectedChartType === "line" && (
              <LineChart
                dataset={dynamicDataset}
                title="Gráfico Personalizado"
                ylabel="Valores"
              />
            )}
            {dynamicDataset && selectedChartType === "bar" && (
              <BarChart
                dataset={dynamicDataset}
                title="Gráfico Personalizado"
                ylabel="Valores"
              />
            )}
            {dynamicDataset && selectedChartType === "scatter" && (
              <ScatterChart
                dataset={dynamicDataset}
                title="Gráfico Personalizado"
                xlabel="Eje X"
                ylabel="Eje Y"
              />
            )}
          </div>

          <div className="bg-white w-full rounded-xl flex items-center p-4 border border-gray-300">
            <BarChart
              dataset={ROIDataset}
              title="ROI (%) desde 2023 a 2024"
              ylabel="ROI (%)"
            />
          </div>
          <div
            className={`relative bg-white border-gray-300 w-full rounded-xl flex flex-col items-end justify-end p-8 border overflow-hidden ${liquidityClass}`}
          >
            <h3 className="text-2xl md:text-4xl font-semibold absolute top-0 left-0 m-8 z-10">
              Liquidez
            </h3>
            <div className="font-extrabold flex text-6xl md:text-8xl z-10">
              <animated.p>
                {props.number.to((n) => `${n.toFixed(2)}`)}
              </animated.p>
            </div>
            <div className="z-10">
              <p className="text-neutral-600 antialiased">
                {liquidezChange >= 0
                  ? `+${liquidezChange.toFixed(1)}`
                  : liquidezChange.toFixed(1)}
                % respecto al mes pasado
              </p>
            </div>
            <div className="absolute inset-0 bg-opacity-20 z-0 pointer-events-none"></div>
          </div>

          <div className="bg-white w-full rounded-xl flex items-center p-4 border border-gray-300">
            <BarChart
              dataset={RIDataset}
              title="Rotacion de Inventario (RI) desde 2023 a 2024"
              ylabel="RI (%)"
            />
          </div>
          <div className="bg-white w-full rounded-xl flex items-center p-4 border border-gray-300">
            <LineChart
              dataset={MUBDataset}
              title="Margen de Utilidad Bruta (%) desde 2023 a 2024"
              ylabel="MUB (%)"
            />
          </div>
        </div>
        <HelpButton>
          <p>
            La seccion de <strong>Analisis</strong> proporciona una descripción
            general instantánea de las métricas financieras clave y el desempeño
            de la empresa
          </p>
        </HelpButton>
      </section>
    </BaseLayout>
  );
};

export default Analysis;
