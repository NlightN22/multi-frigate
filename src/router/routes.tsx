import {JSX} from "react";
import Test from "../pages/Test"
import MainBody from "../pages/MainBody";
import {pathRoutes} from "./routes.path";
import RetryError from "../pages/RetryError";
import Forbidden from "../pages/403";
import NotFound from "../pages/404";
import AdminPage from "../pages/Admin";

interface IRoute {
    path: string,
    component: JSX.Element
}

export const routes: IRoute[] = [
    { //todo delete
        path: pathRoutes.TEST_PATH,
        component: <Test />,
    },
    {
        path: pathRoutes.ADMIN_PATH,
        component: <AdminPage />,
    },
    {
        path: pathRoutes.MAIN_PATH,
        component: <MainBody />,
    },
    {
        path: pathRoutes.RETRY_ERROR_PATH,
        component: <RetryError />,
    },
    {
        path: pathRoutes.FORBIDDEN_ERROR_PATH,
        component: <Forbidden />,
    },
    {
        path: pathRoutes.NOT_FOUND_ERROR_PATH,
        component: <NotFound />,
    },
]