import {Outlet, NavLink, useLocation, useNavigate} from 'react-router-dom'
import {
    AppBar, Toolbar, Typography, Drawer,
    List, ListSubheader, ListItemButton, Button, ListItemIcon,
    ListItemText, Box, Divider
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import CampaignIcon from '@mui/icons-material/Campaign'
import BuildIcon from '@mui/icons-material/Build'
import HandymanIcon from '@mui/icons-material/Handyman'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import NoteAltIcon from '@mui/icons-material/NoteAlt'
import ExtensionIcon from '@mui/icons-material/Extension'
import GroupIcon from '@mui/icons-material/Group'
import LogoutIcon from '@mui/icons-material/Logout'
import {logout} from '@/auth'
import * as React from 'react'

const drawerWidth = 240

// 내비게이션 설정(섹션 기반)
type NavItem = { to: string; label: string; icon: React.ReactNode }
type NavSection = { title: string; items: NavItem[] }

const navSections: NavSection[] = [
    {
        title: '메인',
        items: [
            {to: '/dashboard', label: '대시보드', icon: <DashboardIcon/>},
        ],
    },
    {
        title: '게시판',
        items: [
            {to: '/boards', label: '공지사항', icon: <CampaignIcon/>},
        ],
    },
    {
        title: '장비 관리',
        items: [
            {to: '/equipment', label: '장비 관리', icon: <BuildIcon/>},
            {to: '/parts', label: '부속 관리', icon: <HandymanIcon/>},
            {to: '/inspection', label: '점검 일지', icon: <FactCheckIcon/>},
        ],
    },
    {
        title: '보고서',
        items: [

            {to: '/operation', label: '운영 일지', icon: <NoteAltIcon/>},

        ],
    },
    {
        title: '코드/사용자',
        items: [
            {to: '/codes', label: '코드 관리', icon: <ExtensionIcon/>},
            {to: '/users', label: '사용자 관리', icon: <GroupIcon/>}
        ],
    },
]

// 개별 아이템 컴포넌트
function NavItemRow({item, active}: { item: NavItem; active: boolean }) {
    return (
        <ListItemButton
            component={NavLink}
            to={item.to}
            sx={{
                '&.Mui-selected': {backgroundColor: 'action.selected'},
                '&:hover': {backgroundColor: 'action.hover'},
            }}
            selected={active}
        >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label}/>
        </ListItemButton>
    )
}

// 섹션(해더 + 아이템 목록)
function NavSectionBlock({section, pathname}: { section: NavSection; pathname?: string }) {
    return (
        <Box>
            <List
                dense
                subheader={
                    <ListSubheader component="div" sx={{backgroundColor: 'background.paper'}}>
                        {section.title}
                    </ListSubheader>
                }
                sx={{py: 0}}
            >
                {section.items.map((item) => {
                    const active = item.to === '/dashboard' ? pathname === item.to : pathname.startsWith(item.to)
                    return <NavItemRow key={item.to} item={item} active={active}/>
                })}
            </List>
        </Box>
    )
}

export default function AppLayout() {
    const {pathname} = useLocation()
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box sx={{display: 'flex', minHeight: '100vh', backgroundColor: 'background.default'}}>
            <AppBar
                position="fixed"
                sx={{zIndex: (t) => t.zIndex.drawer + 1, p: 0.4}}>
                <Toolbar>
                    <Typography variant="h6" sx={{flexGrow: 1, color: '#00d4ff'}}>
                        🧊 데이터 관리 시스템
                    </Typography>
                    <Button
                        color="inherit"
                        startIcon={<LogoutIcon/>}
                        onClick={onLogout}>LogOut</Button>
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
                <List disablePadding>
                    {navSections.map((section, index) => (
                        <React.Fragment key={section.title}>
                            <NavSectionBlock section={section} pathname={pathname}/>
                            {index < navSections.length - 1 && <Divider sx={{pb: 3, my: 0.5}}/>}
                        </React.Fragment>
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