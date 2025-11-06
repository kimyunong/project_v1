import {useEffect, useState} from 'react';
import DataTable from '@/components/DataTable';
import {useSearchParams} from "react-router-dom";
import {
    Grid, Paper, Stack, Typography, Button, TextField, MenuItem,
    Chip, Pagination, Select, FormControl, InputLabel, Dialog, DialogTitle,
    DialogContent, DialogActions, Divider, Box
} from '@mui/material';
import {
    listEquipmentPaged,
    createEquipment,
    updateEquipmentStatus,
    type Equipment,
    type ListEquipmentInput
} from '@/services/equipment.service';
import {SelectChangeEvent} from '@mui/material/Select';
import dayjs from 'dayjs';

const TARGETS = ['전체', '장비명', '상태'] as const;
type Target = (typeof TARGETS)[number];

export default function EquipmentPage() {
    const [params, setParams] = useSearchParams();
    const pageFromURL = Number(params.get('page') ?? '1');
    const qFromURL = '';
    const targetFromURL = (params.get('target') as Target) ?? '전체';

    const [page, setPage] = useState(pageFromURL);
    const [pageSize] = useState(9); // 카드 3x3 보기 좋게 9개
    const [q, setQ] = useState(qFromURL);
    const [inputQ, setInputQ] = useState(qFromURL);
    const [target, setTarget] = useState<Target>(targetFromURL);

    const [data, setData] = useState<Equipment[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // 대시보드 '최근 장비' 테이블용
    const [eq, setEq] = useState<Equipment[]>([])
    useEffect(() => {
        listEquipmentPaged({page: 1, pageSize: 1000})
            .then(res => setEq(res.items));
    }, [])

    // URL 쿼리 동기화
    useEffect(() => {
        const next = new URLSearchParams(params);
        next.set('page', String(page));
        if (target) next.set('target', target); else next.delete('target');
        setParams(next, {replace: true});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, target]);

    // 목록 로드
    const fetch = async () => {
        setLoading(true);
        try {
            const input: ListEquipmentInput = {page, pageSize, q, target};
            const res = await listEquipmentPaged(input);
            setData(res.items);
            setTotal(res.total);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, q, target]);

    // 검색
    const onSearch = () => {
        setPage(1);
        setQ(inputQ.trim());
    };
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const composing = (e.nativeEvent as any).isComposing || (e as any).isComposing;
        if (e.key === 'Enter' && !composing) onSearch();
    };

    // 등록 다이얼로그
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<Omit<Equipment, 'id'>>({
        name: '',
        status: 'standby',
        usage: 0,
        remaining: 'h',
        lastCheck: dayjs().format('YYYY-MM-DD'),
    });

    // 등록
    const submitCreate = async () => {
        if (!form.name.trim()) return alert('장비명을 입력하세요.');
        if (form.usage < 0 || form.usage > 100) return alert('사용률은 0~100 사이여야 합니다.');

        await createEquipment({
            name: form.name.trim(),
            status: form.status,
            usage: Math.round(form.usage),
            remaining: form.remaining.trim() || '0h',
            lastCheck: form.lastCheck,
        });
        setOpen(false);
        setPage(1);
        setInputQ('');
        setQ('');

        const res = await listEquipmentPaged({page: 1, pageSize, q: '', target});
        setData(res.items);
        setTotal(res.total);
    };

    // 개별 상태 변경
    const changeStatus = async (id: number, e: SelectChangeEvent) => {
        const next = e.target.value as Equipment['status'];
        setData(cur => cur.map(row => row.id === id ? {...row, status: next} : row));
        try {
            await updateEquipmentStatus(id, next);
        } catch {
            await fetch();
        }
    };

    const colorOf = (s: Equipment['status']) =>
        s === 'active' ? 'success' : s === 'standby' ? 'warning' : 'error';

    return (
        <Stack spacing={2}>
            <Paper sx={{p: 2}}>
                <Typography variant="h6" sx={{mb: 1, color: '#00d4ff'}}>최근 장비</Typography>

                <Divider sx={{mt: 2, mb: 3}}/>

                <DataTable
                    columns={[
                        {id: 'id', header: '번호', width: 60},
                        {id: 'name', header: '장비명'},
                        {id: 'status', header: '장비상태'},
                        {id: 'usage', header: '사용률'},
                        {id: 'remaining', header: '잔여'},
                        {id: 'lastCheck', header: '등록일자'}
                    ]}
                    data={eq.slice(0, 4)}
                />
            </Paper>

            <Divider sx={{mt: 2, mb: 3, border: 'none'}}/>

            {/* 헤더 */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" sx={{flexGrow: 1, color: '#00d4ff'}}>장비 관리</Typography>
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" disabled>엑셀 다운로드</Button>
                    <Button variant="contained" onClick={() => setOpen(true)}>장비 등록</Button>
                </Stack>
            </Stack>

            {/* 검색바 */}
            <Paper sx={{p: 2}}>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    <TextField
                        select size="small"
                        label="검색 대상"
                        value={target}
                        onChange={(e) => setTarget(e.target.value as Target)}
                        sx={{width: 140}}
                    >
                        {TARGETS.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                    </TextField>
                    <TextField
                        size="small"
                        label="검색어"
                        value={inputQ}
                        onChange={(e) => setInputQ(e.target.value)}
                        onKeyDown={onKeyDown}
                        sx={{minWidth: 260, flex: 1}}
                    />
                    <Button variant="outlined" onClick={onSearch}>검색</Button>
                </Stack>
            </Paper>

            {/* 카드 그리드 */}
            <Grid container spacing={2}>
                {data.map((eq) => (
                    <Grid size={{xs: 12, sm: 6, md: 4}} key={eq.id}>
                        <Paper sx={{p: 2}}>
                            <Stack direction="row" alignItems="flex-start" justifyContent="space-between"
                                   sx={{mb: 0.5}}>
                                <Typography fontWeight={700}>{eq.name}</Typography>
                                <Chip label={
                                    eq.status === 'active' ? 'active' :
                                        eq.status === 'standby' ? 'standby' : 'inactive'
                                } color={colorOf(eq.status)} variant="outlined"/>
                            </Stack>

                            <Typography variant="body2" color="text.secondary">사용률: {eq.usage}%</Typography>
                            <Typography variant="body2" color="text.secondary">잔여시간: {eq.remaining}</Typography>
                            <Typography variant="body2" color="text.secondary"
                                        sx={{mb: 1}}>최종점검: {eq.lastCheck}</Typography>

                            {/* 상태 변경 Select */}
                            <Box display='flex' justifyContent='end'>
                                <FormControl size="small" sx={{width: 160}}>
                                    <InputLabel id={`st-${eq.id}`}>상태 수정</InputLabel>
                                    <Select
                                        labelId={`st-${eq.id}`}
                                        label="상태 수정"
                                        value={eq.status}
                                        onChange={(e) => changeStatus(eq.id, e)}
                                    >
                                        <MenuItem value="active">active</MenuItem>
                                        <MenuItem value="standby">standby</MenuItem>
                                        <MenuItem value="inactive">inactive</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* 페이지네이션 */}
            <Stack alignItems="center" sx={{mt: 1}}>
                <Pagination
                    count={Math.max(1, Math.ceil(total / pageSize))}
                    page={page}
                    onChange={(_, p) => setPage(p)}
                    color="primary"
                />
            </Stack>

            {/* 등록 다이얼로그 */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"  // 중앙 너비 (sm=600px)
            >
                <DialogTitle sx={{pt: 3}}>+ 장비 등록</DialogTitle>
                <Box></Box>
                <DialogContent sx={{pt: 2}}>
                    <Stack spacing={3}>
                        <TextField
                            label="장비명"
                            value={form.name}
                            onChange={(e) => setForm(f => ({...f, name: e.target.value}))}
                            size="small"
                            fullWidth
                        />

                        <TextField
                            select
                            label="상태"
                            value={form.status}
                            onChange={(e) =>
                                setForm(f => ({...f, status: e.target.value as Equipment['status']}))
                            }
                            size="small"
                            fullWidth
                        >
                            <MenuItem value="active">active</MenuItem>
                            <MenuItem value="standby">standby</MenuItem>
                            <MenuItem value="inactive">inactive</MenuItem>
                        </TextField>

                        <TextField
                            label="사용률 (0~100)"
                            type="number"
                            sx={{min: 0, max: 100}}
                            value={form.usage}
                            onChange={(e) =>
                                setForm(f => ({...f, usage: Number(e.target.value)}))
                            }
                            size="small"
                            fullWidth
                        />

                        <TextField
                            label="잔여시간 (예: 235h)"
                            value={form.remaining}
                            onChange={(e) => setForm(f => ({...f, remaining: e.target.value}))}
                            size="small"
                            fullWidth
                        />

                        <TextField
                            label="최종점검 (YYYY-MM-DD)"
                            value={form.lastCheck}
                            onChange={(e) => setForm(f => ({...f, lastCheck: e.target.value}))}
                            size="small"
                            fullWidth
                        />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>취소</Button>
                    <Button variant="contained" onClick={submitCreate}>등록</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
