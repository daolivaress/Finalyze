import { useState, useEffect, createContext } from "react";

type ContextProps = {
  children: React.ReactNode;
};

export type FinalyzeContextType = {
  fileName: string;
  setFileName: (fileName: string) => void;
  marks: { value: number; label: string }[];
  handleFileSelect: () => void;
  handleDateChange: (event: Event, newValue: number | number[]) => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  formatDate: (date: Date) => string;
  datesArray: Date[];
  dateIndex: number[];
  dateRange: () => string[];
  getDateRangeJson: () => { dates: string[] };
  file: File | null;
  setFile: (file: File) => void;
  handleFileSubmit: () => Promise<void>;
  getLastTwoMonthsData: () => { ingresos: number[]; costos: number[] };
  data: object[];
  calculatePercentageChange: (current: number, previous: number) => number;
  dataIndicators: object[];
  getLastTwoMonthsLIQ: () => { liquidez: number[] };
};

export const FinalyzeContext = createContext<FinalyzeContextType | undefined>(
  undefined
);

export const FinalyzeProvider = ({ children }: ContextProps) => {
  const generateDates = () => {
    const start = new Date(2024, 8); // Septiembre 2024
    const end = new Date(2025, 11); // Diciembre 2025
    const dates = [];

    while (start <= end) {
      dates.push(new Date(start));
      start.setMonth(start.getMonth() + 1);
    }
    return dates;
  };

  const datesArray = generateDates();

  const marks = [
    { value: 0, label: "Sept 2024" },
    { value: 4, label: "Ene 2025" },
    { value: 9, label: "Jun 2025" },
    { value: datesArray.length - 1, label: "Dic 2025" },
  ];

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [dateIndex, setDateIndex] = useState<number[]>([
    0,
    datesArray.length - 1,
  ]);

  const [data, setData] = useState<any[]>([]);
  const [dataIndicators, setDataIndicators] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/data");
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/data-indicators");
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        const result = await response.json();
        setDataIndicators(result);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  const getLastTwoMonthsData = () => {
    const sortedData = [...data].sort((a, b) => new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime());
    const lastTwoMonths = sortedData.slice(0, 2);

    const ingresos = lastTwoMonths.map((item: any) => item["MUB Ingresos totales"] || 0);
    const costos = lastTwoMonths.map((item: any) => item["MUB Costo de productos y servicios"] || 0);

    return { ingresos, costos };
  };

  const getLastTwoMonthsLIQ = () => {
    const sortedData = [...dataIndicators].sort((a, b) => new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime());
    const lastTwoMonths = sortedData.slice(0, 2);

    const liquidez = lastTwoMonths.map((item: any) => item["LIQUIDEZ"] || 0);

    return { liquidez };
  };

  const dateRange = () => {
    const formattedDate = [];
    for (let i = 0; i <= dateIndex[1]; i++) {
      formattedDate.push(datesArray[i].toISOString().split("T")[0]);
    }
    return formattedDate;
  };

  const getDateRangeJson = () => {
    const formattedDates = dateRange().slice(0, 15);
    return { dates: formattedDates };
  };

  const handleFileSelect = () => {
    document.getElementById("file")?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFile(file);
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      setFile(file);
    }
  };

  const handleDateChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setDateIndex([0, newValue[1]]);
    }
  };

  const formatDate = (date: Date) => {
    const formattedDate = date.toLocaleDateString("es-ES", {
      month: "short",
      year: "numeric",
    });
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };

  const handleFileSubmit = async () => {
    if (!file) {
      alert("Por favor, selecciona un archivo primero.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("dates", JSON.stringify(getDateRangeJson()));

    try {
      const response = await fetch("http://localhost:8000/upload-excel", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al enviar el archivo.");
      }

      const Dataresult = await response.json();
      console.log("Respuesta del servidor(datos pronosticos sin calcular indicador):", Dataresult);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al enviar el archivo.");
    }
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };
  

  return (
    <FinalyzeContext.Provider
      value={{
        fileName,
        setFileName,
        marks,
        handleFileSelect,
        handleDateChange,
        handleFileChange,
        handleFileDrop,
        formatDate,
        datesArray,
        dateIndex,
        dateRange,
        getDateRangeJson,
        file,
        setFile,
        handleFileSubmit,
        getLastTwoMonthsData,
        data,
        calculatePercentageChange,
        dataIndicators,
        getLastTwoMonthsLIQ
      }}
    >
      {children}
    </FinalyzeContext.Provider>
  );
};
