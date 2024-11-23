import { FinalyzeContext, FinalyzeContextType } from "@/context/Context";
import { FiDollarSign } from "react-icons/fi";
import { useSpring, animated } from "react-spring";
import { useContext } from "react";

const abbreviateNumber = (value: number) => {
  if (value >= 1e9) return (value / 1e9).toFixed(1) + "B";
  if (value >= 1e6) return (value / 1e6).toFixed(1) + "M";
  if (value >= 1e3) return (value / 1e3).toFixed(1) + "K";
  return value.toFixed(2);
};

type KPICardProps = {
  value: number[];
  title: string;
};

const KPICard = ({ value, title }: KPICardProps) => {
  const context = useContext(FinalyzeContext) as FinalyzeContextType;
  const props = useSpring({
    to: { number: value[0] },
    from: { number: 0 },
    config: {
      duration: 1200,
      easing: (t) =>
        t < 0.5 ? 2 * Math.pow(t, 2) : 1 - Math.pow(-2 * t + 2, 2) / 2, // Ease-in-out
    },
  });

  const valueChange =
    value.length >= 2
      ? context.calculatePercentageChange(value[0], value[1])
      : 0;

  return (
    <div className="flex flex-col bg-white border max-lg:mt-4 border-gray-300 lg:w-[320px] w-full lg:px-8 px-4 lg:py-4 py-3 rounded-lg shadow-sm antialiased">
      <div className="flex justify-between items-center mb-2.5">
        <p
          className="text-sm font-semibold antialiased"
          title={title} // Tooltip con el texto completo
        >
          <span className="block sm:hidden">
            {title.length > 16 ? `${title.slice(0, 16)}...` : title}
          </span>
          <span className="hidden sm:block">{title}</span>
        </p>

        <FiDollarSign className="text-neutral-500" />
      </div>
      <div className="text-2xl max-lg:text-[22px] font-extrabold antialiased">
        {/* Mostrar número completo en pantallas medianas o mayores */}
        <span className="hidden md:flex">
          $
          <animated.p>
            {props.number.to((n) => new Intl.NumberFormat("en-US").format(n))}
          </animated.p>
        </span>
        {/* Mostrar número abreviado en pantallas pequeñas */}
        <span className="flex md:hidden">
          $
          <animated.p>{props.number.to((n) => abbreviateNumber(n))}</animated.p>
        </span>
      </div>
      <div>
        <p className="text-xs text-neutral-600 antialiased">
          {valueChange >= 0
            ? `+${valueChange.toFixed(1)}`
            : valueChange.toFixed(1)}
          % respecto al mes pasado
        </p>
      </div>
    </div>
  );
};

export default KPICard;
