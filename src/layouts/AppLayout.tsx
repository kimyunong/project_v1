import {Outlet, NavLink, useLocation, useNavigate} from 'react-router-dom'
import {
    AppBar, Toolbar, Typography, Drawer,
    List, ListSubheader, ListItemButton, Button, ListItemIcon,
    ListItemText, Box, Divider
} from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import LogoutIcon from '@mui/icons-material/Logout'
import {logout} from '@/auth'
import * as React from 'react'

const drawerWidth = 240

// 이모지 아이콘을 MUI 아이콘처럼 쓰기
function EmojiIcon({symbol}: { symbol: string }) {
    return (
        <Box aria-hidden sx={{fontSize: 20, lineHeight: 1, display: 'inline-flex'}}>
            {symbol}
        </Box>
    )
}

// 내비게이션 설정(섹션 기반)
type NavItem = { to: string; label: string; icon: React.ReactNode }
type NavSection = { title: string; items: NavItem[] }

const navSections: NavSection[] = [
    {
        title: '메인',
        items: [
            {to: '/dashboard', label: '대시보드', icon: <EmojiIcon symbol="📊"/>},
        ],
    },
    {
        title: '게시판',
        items: [
            {to: '/boards', label: '공지사항', icon: <EmojiIcon symbol="📢"/>},
        ],
    },
    {
        title: '장비 관리',
        items: [
            {to: '/equipment', label: '장비 관리', icon: <EmojiIcon symbol="⚙️"/>},
            {to: '/parts', label: '부속 관리', icon: <EmojiIcon symbol="🔧"/>},
            {to: '/inspection', label: '점검 일지', icon: <EmojiIcon symbol="📝"/>},
        ],
    },
    {
        title: '보고서',
        items: [

            {to: '/operation', label: '운영 일지', icon: <EmojiIcon symbol="📄"/>},

        ],
    },
    {
        title: '코드/사용자',
        items: [
            {to: '/codes', label: '코드 관리', icon: <EmojiIcon symbol="🧩"/>},
            {to: '/users', label: '사용자 관리', icon: <GroupIcon sx={{fontSize: 20}}/>}
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
                    <Box sx={{flexGrow: 1}}>
                        <Typography
                            component='a'
                            href="https://preeminent-chebakia-1f867d.netlify.app/dashboard?page=1&target=%EC%A0%84%EC%B2%B4"
                            variant="h5"
                            fontWeight={700}
                            sx={{color: '#00d4ff'}}>
                            🧊 데이터 관리 시스템
                        </Typography>
                        <Typography
                            color="text.secondary"
                            sx={{mt: 0.25, pl: 5, fontSize: 13}}
                        >
                            연구장비 및 데이터 관리 플랫폼
                        </Typography>
                    </Box>
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