import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Paper, Stack, Typography, Button, Box, Divider} from '@mui/material';
import Grid from '@mui/material/Grid';
import BoardsPage from "@/pages/boards/BoardsPage";
import EquipmentPage from "@/pages/equipment/EquipmentPage";
import DataTable from '@/components/DataTable';
import {listPartsPaged, type Part} from '@/services/parts.service';
import * as React from "react";
import PartsPage from "@/pages/parts/PartsPage";

export default function DashboardPage() {

    const stats = [
        {
            label: '전체 장비',
            value: 24,
            change: '+2',
            icon: <span style={{
                padding: '10px',
                fontSize: '1.7rem',
                backgroundColor: 'rgba(40,52,75,0.8)',
                borderRadius: '8px'
            }}>⚙️</span>
        },
        {
            label: '가동 중',
            value: 16,
            change: '+3',
            icon: <span style={{
                padding: '10px',
                fontSize: '1.7rem',
                backgroundColor: 'rgba(40,75,41,0.8)',
                borderRadius: '8px'
            }}>✅</span>
        },
        {
            label: '대기 중',
            value: 6,
            change: '-1',
            icon: <span style={{
                padding: '10px',
                fontSize: '1.7rem',
                backgroundColor: 'rgba(40,62,75,0.8)',
                borderRadius: '8px'
            }}>⏸️</span>
        },
        {
            label: '점검 필요',
            value: 2,
            change: '0',
            icon: <span style={{
                padding: '10px',
                fontSize: '1.7rem',
                backgroundColor: 'rgba(75,68,40,0.8)',
                borderRadius: '8px'
            }}>⚠️</span>
        }
    ]

    const navigate = useNavigate();

    const [recentParts, setRecentParts] = useState<Part[]>([]);

    useEffect(() => {
        (async () => {
            const res = await listPartsPaged({page: 1, pageSize: 1000, q: '', target: '전체'});
            setRecentParts(res.items.slice(0, 5));
        })();
    }, []);

    return (
        <Stack spacing={2}>
            <Grid container spacing={2}>
                {stats.map((s, i) => (
                    <Grid size={{xs: 12, sm: 6, md: 3}} key={i}>
                        <Paper sx={{
                            p: 3,
                            width: 1,
                            display: 'flex',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                border: '1px solid rgb(0, 212, 255, 0.5)'
                            },
                        }}>
                            <Box sx={{width: '50%'}}>
                                {s.icon}
                            </Box>
                            <Box sx={{width: '50%', textAlign: 'end'}}>
                                <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                                <Typography variant="h3" fontWeight={700}>{s.value}</Typography>
                                <Typography variant="caption"
                                            fontWeight={700}
                                            color={s.change.startsWith('+') ? 'success.main' : s.change.startsWith('-') ? 'error.main' : 'text.secondary'}>
                                    {s.change} 지난 주 대비
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <BoardsPage/>
            <EquipmentPage/>

            <Paper sx={{p: 2}}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 1, p: 1}}>
                    <Typography variant="h6" sx={{color: '#00d4ff'}}>최근 부속품</Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate('/parts')}
                        sx={{p: 1, pl: 2, pr: 2}}
                    >
                        전체 보기 →
                    </Button>
                </Stack>
                <Divider sx={{mt: 2, mb: 3}}/>
                <DataTable<Part>
                    columns={[
                        {id: 'id', header: '번호', width: 60},
                        {id: 'name', header: '부속품명'},
                        {id: 'partNo', header: '파트번호', width: 140},
                        {id: 'equipment', header: '장비명'},
                        {id: 'type', header: '유형', width: 110},
                        {id: 'totalQty', header: '총수량', width: 90},
                        {id: 'usedQty', header: '사용', width: 80},
                        {id: 'remainQty', header: '잔여', width: 80},
                        {id: 'firstShipDate', header: '최초선적일', width: 120},
                    ]}
                    data={recentParts}
                />
            </Paper>
            <PartsPage/>
        </Stack>
    )
}