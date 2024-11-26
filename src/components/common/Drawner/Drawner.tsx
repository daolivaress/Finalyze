import { useState } from "react";
import { MdOutlineSort } from "react-icons/md";
import { MdAnalytics } from "react-icons/md";
import { FaChartLine } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative max-md:block hidden">
      {/* Botón para abrir/cerrar el Drawer */}
      <button
        onClick={toggleDrawer}
        className="mt-2 ml-2 p-2 transition rounded-md text-gray-500 hover:text-black hover:bg-neutral-300 "
      >
        <MdOutlineSort className="size-10" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleDrawer} // Permite cerrar el Drawer al hacer clic fuera de él
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-100 shadow-lg w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6 border-b border-gray-400 pb-3">
            Finalyze
          </h2>
          <div className="flex flex-col gap-3">
            <NavLink
              to={"/analisys"}
              className="flex items-center gap-2 text-start px-4 py-1 rounded-sm text-gray-500 transition hover:bg-gray-200 hover:text-black hover:font-semibold"
            >
              <MdAnalytics />
              Analisis
            </NavLink>
            <NavLink
              to={"/forecasts"}
              className="flex items-center gap-2 text-start px-4 py-1 rounded-sm text-gray-500 transition hover:bg-gray-200 hover:text-black hover:font-semibold"
            >
              <FaChartLine />
              Pronosticos
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
