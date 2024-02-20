import { Navigate, Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import { v4 as uuidv4 } from 'uuid'
import { routesPath } from "./routes.path";

const AppRouter = () => {
    return (
        <Routes>
            {routes.map(({ path, component }) =>
                <Route key={uuidv4()} path={path} element={component} />
            )}
            <Route key={uuidv4()} path="*" element={<Navigate to={routesPath.MAIN_PATH} replace />} />
        </Routes>
    )
}

export default AppRouter