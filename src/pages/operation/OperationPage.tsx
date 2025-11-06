import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Paper, Stack, Typography, Button, TextField, MenuItem, Pagination,
    Dialog, DialogTitle, DialogContent, DialogActions, Box
} from '@mui/material';
import DataTable from '@/components/DataTable';
import {
    listOperationLogsPaged,
    createOperationLog,
    type OperationLog,
    type ListOperationInput
} from '@/services/operation.service';

const TARGETS = ['전체','장비','사용자','활동','연구시작일','연구종료일','시간'] as const;
type Target = typeof TARGETS[number];

export default function OperationPage() {
    const [params, setParams] = useSearchParams();
    const pageFromURL = Number(params.get('page') ?? '1');
    const targetFromURL = (params.get('target') as Target) ?? '전체';

    const [page, setPage] = useState(pageFromURL);
    const [pageSize] = useState(10);

    const [inputQ, setInputQ] = useState('');
    const [q, setQ] = useState('');
    const [target, setTarget] = useState<Target>(targetFromURL);

    const [data, setData] = useState<OperationLog[]>([]);
    const [total, setTotal] = useState(0);
    const [open, setOpen] = useState(false);

    // URL 동기화 (q 제외)
    useEffect(() => {
        const next = new URLSearchParams(params);
        next.set('page', String(page));
        if (target) next.set('target', target); else next.delete('target');
        setParams(next, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, target]);

    const fetch = async () => {
        const input: ListOperationInput = { page, pageSize, q, target };
        const res = await listOperationLogsPaged(input);
        setData(res.items);
        setTotal(res.total);
    };

    useEffect(() => {
        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, q, target]);

    // 검색 트리거
    const onSearch = () => {
        setPage(1);
        setQ(inputQ.trim());
    };
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const composing = (e.nativeEvent as any).isComposing || (e as any).isComposing;
        if (e.key === 'Enter' && !composing) onSearch();
    };

    // 등록 폼
    const [form, setForm] = useState<Omit<OperationLog, 'id'>>({
        equipment: '',
        startDate: new Date().toISOString().slice(0,10),
        endDate: new Date().toISOString().slice(0,10),
        useTime: '0h',
        activity: '',
        actualUser: '',
    });

    const submitCreate = async () => {
        if (!form.equipment.trim()) return alert('장비명을 입력하세요.');
        if (!form.actualUser.trim()) return alert('실사용자를 입력하세요.');

        await createOperationLog({
            ...form,
            equipment: form.equipment.trim(),
            activity: form.activity.trim(),
            actualUser: form.actualUser.trim(),
            useTime: form.useTime.trim() || '0h',
        });

        setOpen(false);
        setInputQ('');
        setQ('');
        setPage(1);
        const res = await listOperationLogsPaged({ page: 1, pageSize, q: '', target });
        setData(res.items);
        setTotal(res.total);
    };

    return (
        <Stack spacing={2}>
            {/* 헤더 */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" sx={{color: '#00d4ff'}}>연구장비 운영 일지</Typography>
                <Button variant="contained" onClick={() => setOpen(true)}>운영일지 작성</Button>
            </Stack>

            {/* 검색바 */}
            <Paper sx={{ p: 2 }}>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    <TextField
                        select size="small" label="검색 대상" value={target}
                        onChange={(e) => setTarget(e.target.value as Target)}
                        sx={{ width: 160 }}
                    >
                        {TARGETS.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
                    </TextField>

                    <TextField
                        size="small" label="검색어" value={inputQ}
                        onChange={(e) => setInputQ(e.target.value)}
                        onKeyDown={onKeyDown}
                        sx={{ minWidth: 260, flex: 1 }}
                    />
                    <Button variant="outlined" onClick={onSearch}>검색</Button>
                </Stack>
            </Paper>

            {/* 테이블 */}
            <Paper sx={{ p: 2 }}>
                <DataTable<OperationLog>
                    data={data}
                    getRowKey={(r) => r.id}
                    columns={[
                        { id: 'id', header: '번호', width: 60 },
                        { id: 'equipment', header: '장비명', width: 160 },
                        { id: 'startDate', header: '연구시작일', width: 120 },
                        { id: 'endDate', header: '연구종료일', width: 120 },
                        { id: 'useTime', header: '시간', width: 90 },
                        { id: 'activity', header: '활동 내역' },
                        { id: 'actualUser', header: '실사용자', width: 120 },
                    ]}
                />
            </Paper>

            {/* 페이지네이션 */}
            <Stack alignItems="center">
                <Pagination
                    count={Math.max(1, Math.ceil(total / pageSize))}
                    page={page}
                    onChange={(_, p) => setPage(p)}
                    color="primary"
                />
            </Stack>

            {/* 등록 다이얼로그 */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{pt:3}}>+ 운영일지 작성</DialogTitle>
                <Box></Box>
                <DialogContent sx={{ pt: 2 }}>
                    <Stack spacing={2}>
                        <TextField label="장비명" value={form.equipment} onChange={(e)=>setForm(f=>({...f, equipment: e.target.value}))} size="small" />
                        <TextField label="연구시작일 (YYYY-MM-DD)" value={form.startDate} onChange={(e)=>setForm(f=>({...f, startDate: e.target.value}))} size="small" />
                        <TextField label="연구종료일 (YYYY-MM-DD)" value={form.endDate} onChange={(e)=>setForm(f=>({...f, endDate: e.target.value}))} size="small" />
                        <TextField label="시간 (예: 45h)" value={form.useTime} onChange={(e)=>setForm(f=>({...f, useTime: e.target.value}))} size="small" />
                        <TextField label="활동 내역" value={form.activity} onChange={(e)=>setForm(f=>({...f, activity: e.target.value}))} size="small" multiline minRows={2} />
                        <TextField label="실사용자" value={form.actualUser} onChange={(e)=>setForm(f=>({...f, actualUser: e.target.value}))} size="small" />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setOpen(false)}>취소</Button>
                    <Button variant="contained" onClick={submitCreate}>등록</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}