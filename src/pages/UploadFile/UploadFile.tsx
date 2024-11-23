import { useState, useEffect } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import Slider from "@mui/material/Slider";
import { useNavigate } from "react-router-dom";
import { FinalyzeContext } from "../../context/Context";
import { useContext } from "react";
import { FinalyzeContextType } from "../../context/Context";

const UploadFile = () => {
  const context = useContext(FinalyzeContext) as FinalyzeContextType;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Cargando");

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingText((prev) => {
          if (prev.endsWith("...")) {
            return "Cargando";
          } else {
            return prev + ".";
          }
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const isButtonEnabled = context.fileName !== "" && context.dateIndex;

  let buttonStyle =
    "bg-gray-300 rounded-full text-gray-500 font-medium w-full py-3";

  if (isButtonEnabled) {
    buttonStyle = "bg-black rounded-full text-white font-medium w-full py-3";
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await context.handleFileSubmit();
      navigate("/analisys");
    } catch (error) {
      console.error("Error al subir los datos", error);
      alert("Hubo un problema al enviar el archivo. Por favor, intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[100vh] justify-center items-center">
      <div
        className="bg-white md:w-[500px] md:h-[520px] w-[450px] border border-neutral-200 rounded-2xl p-10"
        id="upload-file"
      >
        <h3 className="font-semibold text-xl">Cargar estado financiero</h3>
        <p className="text-neutral-600 text-sm mb-8">
          Solo se aceptan archivos .xls y .xlsx
        </p>
        <div
          className="border border-dashed border-black p-6 flex flex-col items-center cursor-pointer"
          onClick={context.handleFileSelect}
          onDrop={context.handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            id="file"
            accept=".xls, .xlsx"
            className="hidden"
            onChange={context.handleFileChange}
          />
          <IoCloudUploadOutline className="text-6xl text-gray-500" />
          <p className="text-gray-500 mt-2">Click o arrastra un archivo aquí</p>
          {context.fileName && <span className="text-gray-700 mt-2">{context.fileName}</span>}
        </div>
        <p className="font-semibold text-lg mt-4 -mb-5">
          Rango de fechas a predecir
        </p>
        <div className="mx-3 mb-8">
          <Slider
            value={context.dateIndex}
            min={0}
            max={context.datesArray.length - 1}
            marks={context.marks}
            onChange={context.handleDateChange}
            valueLabelDisplay="auto"
            valueLabelFormat={(index) => context.formatDate(context.datesArray[index])}
            sx={{
              color: "black",
              mt: 4,
              "& .MuiSlider-markLabel": {
                fontSize: "0.75rem", // Ajusta el tamaño de fuente aquí
              },
            }}
          />
        </div>
        <button
          className={buttonStyle}
          disabled={!isButtonEnabled || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? loadingText : "Subir datos"}
        </button>
      </div>
    </div>
  );
};

export default UploadFile;

