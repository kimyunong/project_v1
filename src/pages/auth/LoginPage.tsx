import {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Box, Paper, Stack, TextField, Button, Typography, Divider} from '@mui/material';
import {login} from '@/auth';

export default function LoginPage() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id.trim() || !password.trim()) return alert('ID 또는 PW 를 입력하세요.');
        login({id: id.trim(), pw: password});
        const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';
        navigate(from, {replace: true});
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            backgroundColor: 'Background.default',
            p: 2,
        }}>
            <Paper sx={{p: 4, width: '380',}}>
                <Stack spacing={2}>
                    <Typography variant="h5" fontWeight={700} sx={{color: '#00d4ff'}}>
                        🧊 데이터 관리 시스템
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        아무 ID/PW 입력 후 로그인하세요.
                    </Typography>
                    <Divider/>
                    <Box component="form" onSubmit={onSubmit}>
                        <Stack spacing={2}>
                            <TextField
                                label="ID"
                                value={id}
                                type="id"
                                onChange={(e) => setId(e.target.value)}/>
                            <TextField
                                label="PW"
                                value={password}
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}/>
                            <Button type="submit" variant="contained" size="large">
                                로그인
                            </Button>
                        </Stack>
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                        데모용으로 인증 절차 없이 로컬에만 저장됩니다.
                    </Typography>
                </Stack>
            </Paper>
        </Box>
    );
}