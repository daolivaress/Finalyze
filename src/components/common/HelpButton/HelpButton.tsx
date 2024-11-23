import { IoInformationCircleOutline } from "react-icons/io5";

const HelpButton = () => {
  return (
    <button className="bg-black text-white rounded-full px-4 py-2 flex gap-2 items-center fixed bottom-4 right-6 transition hover:scale-105 hover:font-semibold hover:bg-neutral-900">
      <IoInformationCircleOutline className="size-6"/>
      <span className="max-lg:block hidden">Info</span>
      <span className="lg:block hidden">Informacion</span>
    </button>
  );
};

export default HelpButton;
