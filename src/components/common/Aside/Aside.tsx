import { MdAnalytics } from "react-icons/md";
import { FaChartLine } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

const Aside = () => {
  return (
    <aside className="hidden md:flex flex-col w-fit px-2 py-4 gap-4 h-[100vh] items-center ">
      <div id="logo" className="mb-16 mt-1.5">
        <span className="bg-black text-white px-5 py-2 rounded-md font-bold text-4xl text-center">
          F
        </span>
      </div>
      <ul className="flex flex-col text-xl gap-8">
        <li className="bg-white p-3 rounded-full transition-all hover:bg-black hover:text-white">
          <NavLink to="/analisys"><MdAnalytics /></NavLink>
        </li>
        <li className="bg-white p-3 rounded-full transition-all hover:bg-black hover:text-white">
          <NavLink to="/forecasts"><FaChartLine /></NavLink>
        </li>
        <li className="bg-white p-3 rounded-full transition-all hover:bg-black hover:text-white">
          <NavLink to="/advices"><FaLightbulb /></NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Aside;
