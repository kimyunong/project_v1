import {PropsWithChildren} from 'react';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {GlobalStyles} from '@mui/material';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {main: '#27c5ff'},   // 네온 블루
        secondary: {main: '#00e5a8'},   // 네온 민트
        background: {
            default: '#0a1929',             // 페이지 배경
            paper: '#0d1f33',             // 카드/페이퍼 배경
        },
        divider: 'rgba(0, 212, 255, 0.2)',
        text: {
            primary: '#E6F1FF',
            secondary: 'rgba(255,255,255,0.64)',
        },
    },
    shape: {borderRadius: 8},
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                // 스크롤바 (웹킷)
                '::-webkit-scrollbar': {width: 8, height: 8},
                '::-webkit-scrollbar-track': {background: 'rgba(255,255,255,0.05)'},
                '::-webkit-scrollbar-thumb': {
                    background: 'rgba(0, 212, 255, 0.3)', borderRadius: 4,
                },
                '::-webkit-scrollbar-thumb:hover': {
                    background: 'rgba(0, 212, 255, 0.5)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                    backdropFilter: 'blur(6px)',
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#0d1f33',
                    borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {textTransform: 'none', borderRadius: 8, boxShadow: 'none'},
                containedPrimary: {
                    background: 'linear-gradient(135deg, #27c5ff, #00e5a8)',
                    color: '#0a1929',
                    fontWeight: 550,
                    ':hover': {
                        boxShadow: '0 5px 20px rgba(0, 212, 255, 0.25)',
                    },
                },
                outlined: {
                    borderColor: 'rgba(0, 212, 255, 0.5)',
                    ':hover': {
                        borderColor: '#27c5ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.08)'
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                outlined: {borderColor: 'rgba(0, 212, 255, 0.3)'},
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        background: 'rgba(255,255,255,0.04)',
                        '& fieldset': {borderColor: 'rgba(0, 212, 255, 0.3)'},
                        '&:hover fieldset': {borderColor: '#27c5ff'},
                        '&.Mui-focused fieldset': {borderColor: '#27c5ff'},
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                outlined: {
                    background: 'rgba(255,255,255,0.04)',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    backgroundColor: '#0d1f33',
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {backgroundColor: 'rgba(0, 212, 255, 0.08)'},
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    color: '#27c5ff',
                    fontWeight: 700,
                    borderBottom: '2px solid rgba(0, 212, 255, 0.3)',
                },
                body: {
                    fontWeight: 500,
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                },
            },
        },
    },
});

export default function ThemeWrapper({children}: PropsWithChildren) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {/* 배경 그라디언트 & 글로시 느낌 */}
            <GlobalStyles styles={{
                body: {
                    backgroundImage: 'linear-gradient(135deg, #0a1929 0%, #1a2332 100%)',
                    backgroundAttachment: 'fixed',
                },
            }}/>
            {children}
        </ThemeProvider>
    );
}