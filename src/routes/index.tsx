import {createBrowserRouter, Navigate} from 'react-router-dom'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import BoardsPage from '@/pages/boards/BoardsPage'
import EquipmentPage from '@/pages/equipment/EquipmentPage'
import PartsPage from '@/pages/parts/PartsPage'
import InspectionPage from '@/pages/inspection/InspectionPage'
import OperationPage from '@/pages/operation/OperationPage'
import UsersPage from '@/pages/users/UsersPage'
import CodesPage from '@/pages/codes/CodesPage'
import LoginPage from "@/pages/auth/LoginPage";
import NoticeDetailPage from "@/pages/boards/NoticeDetailPage";
import RequireAuth from "@/components/RequireAuth";
import AppLayout from "@/layouts/AppLayout";

export const router = createBrowserRouter([

    // login 관련
    {
        path: '/',
        children: [
            {index: true, element: <Navigate to={"/login"}/>},
            {path: 'login', element: <LoginPage/>},
        ]
    },

    // 보호 영역
    {
        path: '/',
        element: <RequireAuth/>, // 인증 가드로 먼저 감싸기
        children: [
            {
                path: '',
                element: <AppLayout/>, // ← 레이아웃 공통
                children: [
                    {index: true, element: <Navigate to="/dashboard"/>},
                    {path: 'dashboard', element: <DashboardPage/>},
                    {path: 'boards', element: <BoardsPage/>},
                    {path: 'boards/:id', element: <NoticeDetailPage/>},
                    {path: 'equipment', element: <EquipmentPage/>},
                    {path: 'parts', element: <PartsPage/>},
                    {path: 'inspection', element: <InspectionPage/>},
                    {path: 'operation', element: <OperationPage/>},
                    {path: 'users', element: <UsersPage/>},
                    {path: 'codes', element: <CodesPage/>},
                ],
            },
        ],
    },
]);