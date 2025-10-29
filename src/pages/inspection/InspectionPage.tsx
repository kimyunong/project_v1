import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Paper, Stack, Typography, Button, TextField, MenuItem, Pagination,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import DataTable from '@/components/DataTable';
import {
    listInspectionLogsPaged,
    createInspectionLog,
    type InspectionLog,
    type ListInspectionInput
} from '@/services/inspection.service';

const TARGETS = ['전체','장비','기관','사용자','등록자','목적','연구시작일','사용시작일','사용종료일'] as const;
type Target = typeof TARGETS[number];

export default function InspectionPage() {
    const [params, setParams] = useSearchParams();
    const pageFromURL = Number(params.get('page') ?? '1');
    const targetFromURL = (params.get('target') as Target) ?? '전체';

    const [page, setPage] = useState(pageFromURL);
    const [pageSize] = useState(10);

    // 검색 q는 URL에 저장하지 않음(새로고침 시 초기화)
    const [inputQ, setInputQ] = useState('');
    const [q, setQ] = useState('');
    const [target, setTarget] = useState<Target>(targetFromURL);

    const [data, setData] = useState<InspectionLog[]>([]);
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
        const input: ListInspectionInput = { page, pageSize, q, target };
        const res = await listInspectionLogsPaged(input);
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
    const [form, setForm] = useState<Omit<InspectionLog, 'id'>>({
        equipment: '',
        startDate: new Date().toISOString().slice(0,10),
        institution: '',
        user: '',
        useStartDate: new Date().toISOString().slice(0,10),
        useEndDate: new Date().toISOString().slice(0,10),
        registrant: '',
        purpose: '',
    });

    const submitCreate = async () => {
        if (!form.equipment.trim()) return alert('장비명을 입력하세요.');
        if (!form.institution.trim()) return alert('기관을 입력하세요.');
        if (!form.user.trim()) return alert('사용자를 입력하세요.');

        await createInspectionLog({
            ...form,
            equipment: form.equipment.trim(),
            institution: form.institution.trim(),
            user: form.user.trim(),
            registrant: form.registrant.trim(),
            purpose: form.purpose.trim(),
        });

        setOpen(false);
        setInputQ('');
        setQ('');
        setPage(1);
        const res = await listInspectionLogsPaged({ page: 1, pageSize, q: '', target });
        setData(res.items);
        setTotal(res.total);
    };

    return (
        <Stack spacing={2}>
            {/* 헤더 */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">점검 일지</Typography>
                <Button variant="contained" onClick={() => setOpen(true)}>+ 점검 일지 등록</Button>
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
                <DataTable<InspectionLog>
                    data={data}
                    getRowKey={(r) => r.id}
                    columns={[
                        { id: 'id', header: '번호', width: 60 },
                        { id: 'equipment', header: '장비명', width: 160 },
                        { id: 'startDate', header: '연구시작일', width: 120 },
                        { id: 'institution', header: '기관', width: 140 },
                        { id: 'user', header: '사용자', width: 110 },
                        { id: 'useStartDate', header: '사용시작일', width: 120 },
                        { id: 'useEndDate', header: '사용종료일', width: 120 },
                        { id: 'registrant', header: '등록자', width: 110 },
                        { id: 'purpose', header: '목적' },
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
                <DialogTitle>+ 점검 일지 등록</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Stack spacing={2}>
                        <TextField label="장비명" value={form.equipment} onChange={(e)=>setForm(f=>({...f, equipment: e.target.value}))} size="small" />
                        <TextField label="연구시작일 (YYYY-MM-DD)" value={form.startDate} onChange={(e)=>setForm(f=>({...f, startDate: e.target.value}))} size="small" />
                        <TextField label="기관" value={form.institution} onChange={(e)=>setForm(f=>({...f, institution: e.target.value}))} size="small" />
                        <TextField label="사용자" value={form.user} onChange={(e)=>setForm(f=>({...f, user: e.target.value}))} size="small" />
                        <TextField label="사용시작일 (YYYY-MM-DD)" value={form.useStartDate} onChange={(e)=>setForm(f=>({...f, useStartDate: e.target.value}))} size="small" />
                        <TextField label="사용종료일 (YYYY-MM-DD)" value={form.useEndDate} onChange={(e)=>setForm(f=>({...f, useEndDate: e.target.value}))} size="small" />
                        <TextField label="등록자" value={form.registrant} onChange={(e)=>setForm(f=>({...f, registrant: e.target.value}))} size="small" />
                        <TextField label="목적" value={form.purpose} onChange={(e)=>setForm(f=>({...f, purpose: e.target.value}))} size="small" multiline minRows={2} />
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