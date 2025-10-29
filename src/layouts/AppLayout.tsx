import {Outlet, NavLink, useLocation, useNavigate} from 'react-router-dom'
import {
    AppBar, Toolbar, Typography, Drawer,
    List, ListItemButton, Button, ListItemIcon,
    ListItemText, Box, Divider
} from '@mui/material'

import DashboardIcon from '@mui/icons-material/Dashboard'
import CampaignIcon from '@mui/icons-material/Campaign'
import BuildIcon from '@mui/icons-material/Build'
import HandymanIcon from '@mui/icons-material/Handyman'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import NoteAltIcon from '@mui/icons-material/NoteAlt'
import GroupIcon from '@mui/icons-material/Group'
import ExtensionIcon from '@mui/icons-material/Extension'
import LogoutIcon from '@mui/icons-material/Logout'
import {logout} from '@/auth'

const drawerWidth = 240

const nav = [
    {to: '/dashboard', label: '대시보드', icon: <DashboardIcon/>},
    {to: '/boards', label: '공지사항', icon: <CampaignIcon/>},
    {to: '/equipment', label: '장비 관리', icon: <BuildIcon/>},
    {to: '/parts', label: '부속 관리', icon: <HandymanIcon/>},
    {to: '/codes', label: '코드 관리', icon: <ExtensionIcon/>},
    {to: '/operation', label: '운영 일지', icon: <NoteAltIcon/>},
    {to: '/inspection', label: '점검 일지', icon: <FactCheckIcon/>},
    {to: '/users', label: '사용자 관리', icon: <GroupIcon/>}
]

export default function AppLayout() {
    const {pathname} = useLocation()
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box sx={{display: 'flex', minHeight: '100vh', backgroundColor: 'background.default'}}>
            <AppBar position="fixed" sx={{zIndex: (t) => t.zIndex.drawer + 1}}>
                <Toolbar>
                    <Typography variant="h6" sx={{flexGrow: 1, color: '#00d4ff'}}>
                        🧊 쇄빙연구선 통합 관리 시스템
                    </Typography>
                    <Button
                        color="inherit"
                        startIcon={<LogoutIcon/>}
                        onClick={onLogout}>
                        로그아웃
                    </Button>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: 'background.paper'
                    }
                }}
            >
                <Toolbar/>
                <Divider/>
                <List>
                    {nav.map((n) => (
                        <NavLink key={n.to} to={n.to} style={{textDecoration: 'none', color: 'inherit'}}>
                            <ListItemButton selected={pathname === n.to}>
                                <ListItemIcon>{n.icon}</ListItemIcon>
                                <ListItemText primary={n.label}/>
                            </ListItemButton>
                        </NavLink>
                    ))}
                </List>
            </Drawer>

            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <Toolbar/>
                <Outlet/>
            </Box>
        </Box>
    )
}