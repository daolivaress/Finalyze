import { IoInformationCircleOutline } from "react-icons/io5";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type HelpButtonProps = {
  children: React.ReactNode;
};

const HelpButton = ({ children }: HelpButtonProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="bg-black text-white rounded-full px-4 py-2 flex gap-2 items-center fixed bottom-4 right-6 transition hover:scale-105 hover:font-semibold hover:bg-neutral-900">
          <IoInformationCircleOutline className="size-6" />
          <span className="max-lg:block hidden">Info</span>
          <span className="lg:block hidden">Información</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="bg-neutral-200 py-2 px-4 rounded-md">
            <AlertDialogTitle>Bienvenido a Finalyze!</AlertDialogTitle>
          </div>
          <AlertDialogDescription>{children}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* <AlertDialogCancel>
            Cancel
          </AlertDialogCancel> */}
          <AlertDialogAction>
            Ok
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default HelpButton;
