import {Navigate, Outlet, useLocation} from "react-router-dom";
import {getUser} from "@/auth";

export default function RequireAuth() {
    const user = getUser(); // 로컬스토리지에서 로그인 정보 확인
    const loc = useLocation(); // 사용자가 접근하려던 경로(리다이렉트)

    // 미로그인 -> /login 으로 보냄
    if (!user) {
        return <Navigate to="/login" replace state={{ from: loc.pathname + loc.search }} />;
    }
    // 로그인 통과 -> 하위 라우트 렌더링
        return <Outlet/>;
    }