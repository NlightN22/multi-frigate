import {JSX} from "react";
import Test from "../pages/Test"
import MainBody from "../pages/MainBody";
import {routesPath} from "./routes.path";
import RetryError from "../pages/RetryError";
import Forbidden from "../pages/403";
import NotFound from "../pages/404";
import SettingsPage from "../pages/SettingsPage";
import FrigateHostsPage from "../pages/FrigateHostsPage";
import HostConfigPage from "../pages/HostConfigPage";
import HostSystemPage from "../pages/HostSystemPage";
import HostStoragePage from "../pages/HostStoragePage";

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
        path: routesPath.MAIN_PATH,
        component: <MainBody />,
    },
    {
        path: routesPath.RETRY_ERROR_PATH,
        component: <RetryError />,
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