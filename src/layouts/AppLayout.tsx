import {Outlet, NavLink, useLocation, useNavigate} from 'react-router-dom'
import {
    AppBar, Toolbar, Typography, Drawer,
    List, ListItemButton, Button, ListItemIcon, ListItemText,
    Box, Divider, Tooltip, useMediaQuery, Theme
} from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import LogoutIcon from '@mui/icons-material/Logout'
import {logout} from '@/auth'
import * as React from 'react'

const FULL_WIDTH = 240       // 데스크탑 사이드바 너비(텍스트 포함)
const MINI_WIDTH = 72        // 모바일 사이드바 너비(아이콘-only)
const APPBAR_HEIGHT = 56

function EmojiIcon({symbol}: { symbol: string }) {
    return <Box aria-hidden sx={{fontSize: 20, lineHeight: 1, display: 'inline-flex'}}>{symbol}</Box>
}

type NavItem = { to: string; label: string; icon: React.ReactNode }
type NavSection = { title: string; items: NavItem[] }

const navSections: NavSection[] = [
    {title: '메인', items: [{to: '/dashboard', label: '대시보드', icon: <EmojiIcon symbol="📊"/>}]},
    {title: '게시판', items: [{to: '/boards', label: '공지사항', icon: <EmojiIcon symbol="📢"/>}]},
    {
        title: '장비 관리',
        items: [
            {to: '/equipment', label: '장비 관리', icon: <EmojiIcon symbol="⚙️"/>},
            {to: '/parts', label: '부속 관리', icon: <EmojiIcon symbol="🔧"/>},
            {to: '/inspection', label: '점검 일지', icon: <EmojiIcon symbol="📝"/>},
        ],
    },
    {title: '보고서', items: [{to: '/operation', label: '운영 일지', icon: <EmojiIcon symbol="📄"/>}]},
    {
        title: '코드/사용자',
        items: [
            {to: '/codes', label: '코드 관리', icon: <EmojiIcon symbol="🧩"/>},
            {to: '/users', label: '사용자 관리', icon: <GroupIcon sx={{fontSize: 20}}/>},
        ],
    },
]

// 데스크탑 섹션(텍스트 포함)
function DesktopSection({section, pathname}: { section: NavSection; pathname: string }) {
    return (
        <Box sx={{px: 1, py: 1}}>
            <Typography variant="caption" color="text.secondary" sx={{px: 2, opacity: .8}}>
                {section.title}
            </Typography>
            <List dense disablePadding>
                {section.items.map(item => {
                    const active = item.to === '/dashboard' ? pathname === item.to : pathname.startsWith(item.to)
                    return (
                        <ListItemButton
                            key={item.to}
                            component={NavLink}
                            to={item.to}
                            selected={active}
                            sx={{
                                '&.Mui-selected': {backgroundColor: 'action.selected'},
                                '&:hover': {backgroundColor: 'action.hover'},
                                borderRadius: 1, mx: .5, my: .25
                            }}
                        >
                            <ListItemIcon sx={{minWidth: 40}}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label}/>
                        </ListItemButton>
                    )
                })}
            </List>
            <Divider sx={{mt: 1.5, opacity: .5}}/>
        </Box>
    )
}

// 모바일 섹션(아이콘-only + Tooltip)
function MobileSection({section, pathname}: { section: NavSection; pathname: string }) {
    return (
        <Box sx={{px: .5, py: 1}}>
            <List dense disablePadding>
                {section.items.map(item => {
                    const active = item.to === '/dashboard' ? pathname === item.to : pathname.startsWith(item.to)
                    return (
                        <Tooltip key={item.to} title={item.label} placement="right" enterDelay={400}>
                            <ListItemButton
                                component={NavLink}
                                to={item.to}
                                selected={active}
                                sx={{
                                    justifyContent: 'center',
                                    minHeight: 44,
                                    '&.Mui-selected': {backgroundColor: 'action.selected'},
                                    '&:hover': {backgroundColor: 'action.hover'},
                                    borderRadius: 2, mx: 1, my: .5
                                }}
                            >
                                <ListItemIcon sx={{minWidth: 0}}>{item.icon}</ListItemIcon>
                            </ListItemButton>
                        </Tooltip>
                    )
                })}
            </List>
            <Divider sx={{opacity: .4}}/>
        </Box>
    )
}

export default function AppLayout() {
    const {pathname} = useLocation()
    const navigate = useNavigate()
    // 브레이크포인트 분기(md 기준): 데스크탑=텍스트 포함 / 모바일=아이콘-only
    const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

    const onLogout = () => {
        logout();
        navigate('/login');
    }

    // 항상 보이는 Drawer들 (permanent로 고정)
    const DesktopDrawer = (
        <Drawer
            variant="permanent"
            PaperProps={{
                sx: {
                    width: FULL_WIDTH,
                    backgroundColor: 'background.paper',
                    borderRight: '1px solid rgba(0, 212, 255, 0.2)',
                    boxSizing: 'border-box',
                }
            }}
        >
            <Box sx={{height: APPBAR_HEIGHT}}/>
            <Divider/>
            <Box sx={{overflowY: 'auto', flex: 1}}>
                {navSections.map(s => <DesktopSection key={s.title} section={s} pathname={pathname}/>)}
            </Box>
        </Drawer>
    )

    const MobileDrawer = (
        <Drawer
            variant="permanent" // ←★ [포인트] temporary → permanent 로 변경하여 항상 표시
            PaperProps={{
                sx: {
                    width: MINI_WIDTH,
                    backgroundColor: 'background.paper',
                    borderRight: '1px solid rgba(0, 212, 255, 0.2)',
                    boxSizing: 'border-box',
                }
            }}
        >
            {/* 모바일에선 헤더/닫기 버튼 불필요. 상시 표시 */}
            <Box sx={{height: APPBAR_HEIGHT}}/>
            <Divider/>
            <Box sx={{overflowY: 'auto', flex: 1}}>
                {navSections.map(s => <MobileSection key={s.title} section={s} pathname={pathname}/>)}
            </Box>
        </Drawer>
    )

    return (
        <Box sx={{display: 'flex', minHeight: '100vh', backgroundColor: 'background.default'}}>
            {/* 상단 AppBar */}
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (t) => t.zIndex.drawer + 1,
                    height: APPBAR_HEIGHT,
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Toolbar sx={{minHeight: APPBAR_HEIGHT}}>
                    {/* 햄버거 버튼 제거(상시 Drawer이므로 필요 없음) */}

                    {/* 타이틀 (조금 줄인 버전 유지) */}
                    <Box sx={{flexGrow: 1}} display="flex" gap="10px" alignItems="center">
                        <Typography sx={{fontSize: 20}}>🧊</Typography>
                        <Box sx={{lineHeight: 1}}>
                            <Typography
                                component="a"
                                href="https://preeminent-chebakia-1f867d.netlify.app/dashboard?page=1&target=%EC%A0%84%EC%B2%B4"
                                fontWeight={700}
                                sx={{
                                    fontSize: {xs: 13, sm: 14, md: 15},
                                    color: '#00d4ff',
                                    textDecoration: 'none',
                                    '&:hover': {opacity: 0.9},
                                }}
                            >
                                데이터 관리 시스템
                            </Typography>
                            <Typography color="text.secondary" sx={{fontSize: {xs: 10, sm: 11, md: 12}, opacity: 0.8}}>
                                Research-Data Management System
                            </Typography>
                        </Box>
                    </Box>

                    <Button color="inherit" startIcon={<LogoutIcon/>} onClick={onLogout}>LogOut</Button>
                </Toolbar>
            </AppBar>

            {/* 사이드바: 뷰포트에 따라 하나만 보여줌 (둘 다 permanent) */}
            {isDesktop ? DesktopDrawer : MobileDrawer}

            {/* 메인: 사이드바 폭만큼 좌측 여백 적용 */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: {xs: 2, sm: 2.5, md: 3},
                    ml: {xs: `${MINI_WIDTH}px`, md: `${FULL_WIDTH}px`}, // ←★ 모바일/데스크탑 각각 보정
                }}
            >
                {/* AppBar 자리 확보 */}
                <Box sx={{height: APPBAR_HEIGHT}}/>
                <Outlet/>
            </Box>
        </Box>
    )
}