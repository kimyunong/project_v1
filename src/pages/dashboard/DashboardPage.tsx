import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Paper, Stack, Typography, Button} from '@mui/material';
import Grid from '@mui/material/Grid';
import BoardsPage from "@/pages/boards/BoardsPage";
import EquipmentPage from "@/pages/equipment/EquipmentPage";
import DataTable from '@/components/DataTable';
import {listPartsPaged, type Part} from '@/services/parts.service';

export default function DashboardPage() {
    const stats = [
        {label: '전체 장비', value: 24, change: '+2'},
        {label: '가동 중', value: 16, change: '+3'},
        {label: '대기 중', value: 6, change: '-1'},
        {label: '점검 필요', value: 2, change: '0'}
    ]

    const navigate = useNavigate();

    const [recentParts, setRecentParts] = useState<Part[]>([]);
    useEffect(() => {
        (async () => {
            const res = await listPartsPaged({page: 1, pageSize: 1000, q: '', target: '전체'});
            setRecentParts(res.items.slice(0, 6));
        })();
    }, []);

    return (
        <Stack spacing={2}>
            <Grid container spacing={2}>
                {stats.map((s, i) => (
                    <Grid size={{xs: 12, sm: 6, md: 3}} key={i}>
                        <Paper sx={{p: 3, width: 1}}>
                            <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                            <Typography variant="h4" fontWeight={700}>{s.value}</Typography>
                            <Typography variant="caption"
                                        color={s.change.startsWith('+') ? 'success.main' : s.change.startsWith('-') ? 'error.main' : 'text.secondary'}>
                                {s.change} 지난 주 대비
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <BoardsPage/>

            <Paper sx={{p: 2}}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 1}}>
                    <Typography variant="h6">최근 부속품</Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate('/parts')}
                    >
                        전체 보기 →
                    </Button>
                </Stack>

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

            <EquipmentPage/>
        </Stack>
    )
}