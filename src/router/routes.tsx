import {JSX} from "react";
import Test from "../pages/TestPage"
import MainPage from "../pages/MainPage";
import {routesPath} from "./routes.path";
import RetryErrorPage from "../pages/RetryErrorPage";
import Forbidden from "../pages/403";
import NotFound from "../pages/404";
import SettingsPage from "../pages/SettingsPage";
import FrigateHostsPage from "../pages/FrigateHostsPage";
import HostConfigPage from "../pages/HostConfigPage";
import HostSystemPage from "../pages/HostSystemPage";
import HostStoragePage from "../pages/HostStoragePage";
import LiveCameraPage from "../pages/LiveCameraPage";
import RecordingsPage from "../pages/RecordingsPage";
import AccessSettings from "../pages/AccessSettings";

interface IRoute {
    path: string,
    component: JSX.Element
}

export const routes: IRoute[] = [
    { //todo delete
        path: routesPath.TEST_PATH,
        component: <Test />,
    },
    {
        path: routesPath.SETTINGS_PATH,
        component: <SettingsPage />,
    },
    {
        path: routesPath.HOSTS_PATH,
        component: <FrigateHostsPage />,
    },
    {
        path: routesPath.RECORDINGS_PATH,
        component: <RecordingsPage />,
    },
    {
        path: routesPath.HOST_CONFIG_PATH,
        component: <HostConfigPage />,
    },
    {
        path: routesPath.HOST_SYSTEM_PATH,
        component: <HostSystemPage />,
    },
    {
        path: routesPath.HOST_STORAGE_PATH,
        component: <HostStoragePage />,
    },
    {
        path: routesPath.ACCESS_PATH,
        component: <AccessSettings />,
    },
    {
        path: routesPath.LIVE_PATH,
        component: <LiveCameraPage />,
    },
    {
        path: routesPath.MAIN_PATH,
        component: <MainPage />,
    },
    {
        path: routesPath.RETRY_ERROR_PATH,
        component: <RetryErrorPage />,
    },
    {
        path: routesPath.FORBIDDEN_ERROR_PATH,
        component: <Forbidden />,
    },
    {
        path: routesPath.NOT_FOUND_ERROR_PATH,
        component: <NotFound />,
    },
]