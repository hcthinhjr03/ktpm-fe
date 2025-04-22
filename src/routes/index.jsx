import MainLayout from "../components/MainLayout";
import Homepage from "../pages/Homepage";
import Management from "../pages/Management";
import MainFunction from "../pages/MainFunction";
import Statistic from "../pages/Statistic";
import { Navigate } from "react-router-dom";
import WaterServiceManagement from "../pages/Management/WaterServiceManagement";
import SignContract from "../pages/MainFunction/SignContract";
import WaterServiceStatistic from "../pages/Statistic/WaterServiceStatistic";

export const routes = [
    {
        path: "/",
        element: <MainLayout/>,
        children: [
            {
                index: true,
                element: <Homepage/>
            },
            {
                path: "management",
                element: <Management/>
            },
            {
                path: "management/water-service",
                element: <WaterServiceManagement/>
            },
            {
                path: "mainfunction",
                element: <MainFunction/>
            },
            {
                path: "mainfunction/sign-contract",
                element: <SignContract/>
            },
            {
                path: "statistic",
                element: <Statistic/>
            },
            {
                path: "statistic/water-service",
                element: <WaterServiceStatistic/>
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" />
    }
]