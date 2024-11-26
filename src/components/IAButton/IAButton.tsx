import { RiRobot2Line } from "react-icons/ri";

const IAButton = () => {
  return (
    <button className="bg-black text-white rounded-lg p-2.5 transition hover:scale-105 hover:font-semibold hover:bg-neutral-900">
      <RiRobot2Line className="size-5"/>
    </button>
  );
};

export default IAButton;
