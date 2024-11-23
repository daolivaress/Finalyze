import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Analisys from "./pages/Analisys/Analisys";
import Forecast from "./pages/Forecast/Forecast";
import Advices from "./pages/Advices/Advices";
import NotFound from "./components/NotFound/NotFound";
import UploadFile from "./pages/UploadFile/UploadFile";
import { FinalyzeProvider } from "./context/Context";

const router = createBrowserRouter([
    {
        path: "/",
        element: <UploadFile/>
    },
    {
        path: "/analisys",
        element: <Analisys title="Análisis"/>
    },
    {   
        path: "/forecasts",
        element: <Forecast title="Pronósticos"/>
    },
    {
        path: "/advices",
        element: <Advices title="Consejos"/>
    },
    {
        path: "*",
        element: <NotFound/>
    }
]);

export const AppRouter = () => {
    return (
        <FinalyzeProvider>
            <RouterProvider router={router}/>
        </FinalyzeProvider>
    );
}

export default AppRouter;