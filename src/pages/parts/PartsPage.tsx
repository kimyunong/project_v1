import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Paper, Stack, Typography, Button, TextField, MenuItem, Chip, Pagination,
    Dialog, DialogTitle, DialogContent, DialogActions, Grid
} from '@mui/material';
import {
    listPartsPaged, createPart, type Part, type ListPartsInput
} from '@/services/parts.service';

const TARGETS = ['전체', '부속품명', '장비', '유형', '파트번호'] as const;
type Target = typeof TARGETS[number];

export default function PartsPage() {
    const [params, setParams] = useSearchParams();
    const pageFromURL = Number(params.get('page') ?? '1');
    const qFromURL = ''; // 새로고침 시 검색어 초기화 UX
    const targetFromURL = (params.get('target') as Target) ?? '전체';

    const [page, setPage] = useState(pageFromURL);
    const [pageSize] = useState(10);

    // 입력용/실제검색용 분리(한글 합성 시 즉시 검색 방지)
    const [inputQ, setInputQ] = useState(qFromURL);
    const [q, setQ] = useState(qFromURL);
    const [target, setTarget] = useState<Target>(targetFromURL);

    const [data, setData] = useState<Part[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // 최근 파츠(데시보드 하위 테이블 등 필요 시)
    const [recent, setRecent] = useState<Part[]>([]);

    // URL 쿼리 동기화 (q는 저장 안 함: 새로고침 시 비움)
    useEffect(() => {
        const next = new URLSearchParams(params);
        next.set('page', String(page));
        if (target) next.set('target', target); else next.delete('target');
        setParams(next, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, target]);

    // 목록 로드
    const fetch = async () => {
        setLoading(true);
        try {
            const input: ListPartsInput = { page, pageSize, q, target };
            const res = await listPartsPaged(input);
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

    // 최근 파츠 로드 (상단 요약 테이블)
    useEffect(() => {
        listPartsPaged({ page: 1, pageSize: 1000, q: '', target: '전체' }).then(r => setRecent(r.items.slice(0, 6)));
    }, []);

    // 검색 트리거 (버튼/Enter)
    const onSearch = () => {
        setPage(1);
        setQ(inputQ.trim());
    };
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const composing = (e.nativeEvent as any).isComposing || (e as any).isComposing;
        if (e.key === 'Enter' && !composing) onSearch();
    };

    // 수량 상태 칩 색
    const stockChip = (remain: number) => {
        if (remain < 5) return { label: '재고 부족', color: 'error' as const };
        if (remain < 10) return { label: '재고 주의', color: 'warning' as const };
        return { label: '재고 충분', color: 'success' as const };
    };

    // 등록 다이얼로그
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<Omit<Part, 'id' | 'remainQty'>>({
        name: '',
        partNo: '',
        equipment: '',
        type: 'Store',
        unitPrice: 0,
        totalQty: 0,
        usedQty: 0,
        firstShipDate: new Date().toISOString().slice(0, 10),
    });

    const submitCreate = async () => {
        if (!form.name.trim()) return alert('부속품명을 입력하세요.');
        if (!form.partNo.trim()) return alert('파트번호를 입력하세요.');
        if (!form.equipment.trim()) return alert('소유 장비를 입력하세요.');
        if (form.totalQty < 0 || form.usedQty < 0) return alert('수량은 0 이상이어야 합니다.');
        if (form.usedQty > form.totalQty) return alert('사용 수량이 총 수량을 초과할 수 없습니다.');

        await createPart({
            ...form,
            name: form.name.trim(),
            partNo: form.partNo.trim(),
            equipment: form.equipment.trim(),
        });

        setOpen(false);
        setInputQ('');
        setQ('');
        setPage(1);

        const res = await listPartsPaged({ page: 1, pageSize, q: '', target });
        setData(res.items);
        setTotal(res.total);
    };

    return (
        <Stack spacing={2}>
            {/* 헤더 */}
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">부속품 관리</Typography>
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" disabled>엑셀 다운로드</Button>
                    <Button variant="contained" onClick={() => setOpen(true)}>+ 부속품 등록</Button>
                </Stack>
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

            {/* 리스트 카드 + 테이블 중 택1. 여기선 카드 그리드 예시 */}
            <Grid container spacing={2}>
                {data.map(p => {
                    const sc = stockChip(p.remainQty);
                    return (
                        <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Paper sx={{ p: 2 }}>
                                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                    <Typography fontWeight={700}>{p.name}</Typography>
                                    <Chip label={p.type} variant="outlined" size="small" color="info" />
                                </Stack>
                                <Typography variant="body2" color="text.secondary">파트번호: {p.partNo}</Typography>
                                <Typography variant="body2" color="text.secondary">장비: {p.equipment}</Typography>
                                <Typography variant="body2" color="text.secondary">단가: ₩{p.unitPrice.toLocaleString()}</Typography>
                                <Typography variant="body2" color="text.secondary">총/사용/잔여: {p.totalQty}/{p.usedQty}/{p.remainQty}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>최초선적일: {p.firstShipDate}</Typography>
                                <Chip label={sc.label} color={sc.color} size="small" />
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            {/* 페이지네이션 */}
            <Stack alignItems="center" sx={{ mt: 1 }}>
                <Pagination
                    count={Math.max(1, Math.ceil(total / pageSize))}
                    page={page}
                    onChange={(_, p) => setPage(p)}
                    color="primary"
                />
            </Stack>

            {/* 등록 다이얼로그 */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>+ 부속품 등록</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Stack spacing={2}>
                        <TextField
                            label="부속품명"
                            value={form.name}
                            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                            size="small"
                            fullWidth
                        />
                        <TextField
                            label="파트번호"
                            value={form.partNo}
                            onChange={(e) => setForm(f => ({ ...f, partNo: e.target.value }))}
                            size="small"
                            fullWidth
                        />
                        <TextField
                            label="소유 장비"
                            value={form.equipment}
                            onChange={(e) => setForm(f => ({ ...f, equipment: e.target.value }))}
                            size="small"
                            fullWidth
                        />
                        <TextField
                            select label="유형" value={form.type}
                            onChange={(e) => setForm(f => ({ ...f, type: e.target.value as Part['type'] }))}
                            size="small"
                            fullWidth
                        >
                            <MenuItem value="SparePart">SparePart</MenuItem>
                            <MenuItem value="Store">Store</MenuItem>
                        </TextField>
                        <TextField
                            label="단가 (₩)" type="number" sx={{ min: 0 }}
                            value={form.unitPrice}
                            onChange={(e) => setForm(f => ({ ...f, unitPrice: Number(e.target.value) }))}
                            size="small" fullWidth
                        />
                        <Stack direction="row" spacing={1}>
                            <TextField
                                label="총수량" type="number" sx={{ min: 0 }}
                                value={form.totalQty}
                                onChange={(e) => setForm(f => ({ ...f, totalQty: Number(e.target.value) }))}
                                size="small" fullWidth
                            />
                            <TextField
                                label="사용" type="number" sx={{ min: 0 }}
                                value={form.usedQty}
                                onChange={(e) => setForm(f => ({ ...f, usedQty: Number(e.target.value) }))}
                                size="small" fullWidth
                            />
                        </Stack>
                        <TextField
                            label="최초선적일 (YYYY-MM-DD)"
                            value={form.firstShipDate}
                            onChange={(e) => setForm(f => ({ ...f, firstShipDate: e.target.value }))}
                            size="small" fullWidth
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