import {Navigate, Outlet, useLocation} from "react-router-dom";
import {getUser} from "@/auth";

export default function RequireAuth() {
    const user = getUser();
    const loc = useLocation();
console.log(loc);
    if (!user) {
        return <Navigate to="/login" replace state={{ from: loc.pathname + loc.search }} />;
    }
        return <Outlet/>;
    }