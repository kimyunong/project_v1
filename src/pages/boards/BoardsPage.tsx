import {useEffect, useState} from 'react';
import {Link, useSearchParams} from "react-router-dom";
import {createNotice, listNotices, type Notice, type ListNoticesInput} from '@/services/boards.service';
import DataTable from '@/components/DataTable';

import {
    Paper, Typography, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, MenuItem, Stack, Chip, Pagination, Box
} from '@mui/material'

type SearchTarget = '전체' | '제목' | '내용' | '작성자';

export default function BoardsPage() {
    const [params, setParams] = useSearchParams();
    const pageFromURL = Number(params.get('page') ?? '1');
    const qFromURL = '';
    const targetFromURL = (params.get('target') as SearchTarget) ?? '전체';

    const [page, setPage] = useState<number>(pageFromURL);
    const [pageSize] = useState(5);
    const [q, setQ] = useState(qFromURL);
    const [inputQ, setInputQ] = useState(qFromURL);
    const [target, setTarget] = useState<SearchTarget>(targetFromURL);

    const [data, setData] = useState<Notice[]>([]);
    const [total, setTotal] = useState(0);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<Partial<Notice>>({category: '공지'});

    const onSearch = () => {
        setPage(1);
        setQ(inputQ.trim());
    }

    // 엔터키 검색
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const composing = (e.nativeEvent as any).isComposing || (e as any).isComposing;
        if (e.key === 'Enter' && !composing) onSearch();
    }

    // URL 쿼리 동기화
    useEffect(() => {
        const next = new URLSearchParams(params);
        next.set('page', String(page));
        if (target) next.set('target', target);
        setParams(next, {replace: true});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, q, target]);

    //목록 로드
    useEffect(() => {
        (async () => {
            const input: ListNoticesInput = {page, pageSize, q, target};
            const res = await listNotices(input);
            setData(res.items);
            setTotal(res.total);
        })();
    }, [page, pageSize, q, target]);

    // 등록
    const submit = async () => {
        if (!form.title?.trim()) return alert('제목을 입력하세요');

        await createNotice({
            title: form.title.trim(),
            author: '관리자',
            date: new Date().toISOString().slice(0, 10),
            category: (form.category ?? '공지') as Notice['category'],
            content: form.content ?? '',
        });
        setOpen(false);
        setPage(1);
        setQ('');
        setInputQ('');

        const res = await listNotices({page: 1, pageSize, q: '', target});
        setData(res.items);
        setTotal(res.total);
    }

    // 카테고리 칩 색상
    const colorOf = (c: Notice['category']) =>
        c === '공지' ? 'info' : c === '자료' ? 'success' : 'warning';

    return (
        <Paper sx={{p: 2}}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{mb: 2}}>
                <Typography variant="h6">공지사항</Typography>
                <Button variant="contained" onClick={() => setOpen(true)}>+ 새 공지사항</Button>
            </Stack>

            <Box sx={{pb: 2}}>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    <TextField select size="small" label="검색 대상" value={target}
                               onChange={(e) => setTarget(e.target.value as SearchTarget)}
                               sx={{width: 140}}
                    >
                        {(['전체', '제목', '내용', '작성자'] as SearchTarget[]).map(v => (
                            <MenuItem key={v} value={v}>{v}</MenuItem>
                        ))}
                    </TextField>
                    <TextField size="small" fullWidth label="검색어"
                               value={inputQ} onChange={(e) => setInputQ(e.target.value)} onKeyDown={onKeyDown}
                               sx={{minWidth: 260, flex: 1}}
                    />
                    <Button variant="outlined" onClick={onSearch}>검색</Button>
                </Stack>
            </Box>

            <DataTable<Notice>
                data={data}
                getRowKey={(n) => n.id}
                columns={[
                    {id: 'id', header: '번호', width: 80, getValue: (n) => n.id},
                    {
                        id: 'title', header: '제목',
                        renderCell: (n) => (
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Chip sx={{p:1.5}} label={n.category} size="small" color={colorOf(n.category)}
                                      variant="outlined"/>
                                <Link to={`/boards/${n.id}`}
                                      style={{textDecoration: 'none', color: 'inherit', fontWeight: 450}}>
                                    {n.title}
                                </Link>
                            </Stack>
                        )
                    },
                    {id: 'author', header: '작성자', width: 120, getValue: (n) => n.author},
                    {id: 'date', header: '등록일', width: 120, getValue: (n) => n.date},
                    {id: 'views', header: '조회수', width: 80, getValue: (n) => n.views},
                ]}
            />

            <Stack alignItems="center" sx={{mt: 2}}>
                <Pagination
                    count={Math.max(1, Math.ceil(total / pageSize))}
                    page={page}
                    onChange={(_, p) => setPage(p)}
                    color="primary"/>
            </Stack>

            {/*작성 다이얼로그 */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>공지사항 작성</DialogTitle>
                <DialogContent sx={{pt: 2}}>
                    <Stack spacing={2}>
                        <TextField select label="카테고리" value={form.category}
                                   onChange={(e) => setForm(f => ({
                                       ...f, category: e.target.value as Notice['category']
                                   }))}>
                            <MenuItem value="공지">공지</MenuItem>
                            <MenuItem value="자료">자료</MenuItem>
                            <MenuItem value="보고서">보고서</MenuItem>
                        </TextField>
                        <TextField label="제목" value={form.title || ''}
                                   onChange={(e) => setForm(f => ({...f, title: e.target.value}))}/>
                        <TextField label="내용" multiline minRows={4} value={form.content || ''}
                                   onChange={(e) => setForm(f => ({...f, content: e.target.value}))}/>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>취소</Button>
                    <Button variant="contained" onClick={submit}>등록</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    )
}