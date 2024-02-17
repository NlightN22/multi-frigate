import { Navigate, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import { v4 as uuidv4 } from 'uuid'
import { pathRoutes } from "./routes.path";

const AppRouter = () => {
    return (
        <Routes>
            {routes.map(({ path, component }) =>
                <Route key={uuidv4()} path={path} element={component} />
            )}
            <Route key={uuidv4()} path="*" element={<Navigate to={pathRoutes.MAIN_PATH} replace />} />
        </Routes>
    )
}

export default AppRouter