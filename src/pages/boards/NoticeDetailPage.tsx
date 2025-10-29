import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {getNotice, increaseViews, type Notice} from '@/services/boards.service';
import {Paper, Stack, Typography, Divider, Button} from '@mui/material';

export default function NoticeDetailPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const nid = Number(id);

    const [data, setData] = useState<Notice | null>(null);

    useEffect(() => {
        if (!Number.isFinite(nid)) {
            navigate("/boards", {replace: true});
            return;
        }

        let mounted = true;

        (
            async () => {
                const n = await getNotice(nid);
                if (!n) {
                    navigate("/boards", {replace: true});
                    return;
                }
                await increaseViews(nid);
                const latest = await getNotice(nid);
                if (mounted) setData(latest ?? n);
            })();

        return () => {
            mounted = false
        };
    }, [nid, navigate]);

    if (!data) return null;

    return (
        <Paper sx={{p: 3}}>

            {/* 헤더 */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 1}}>
                <Typography variant="h5" fontWeight={700}>{data?.title}</Typography>
                <Stack>
                    <Button component={Link} to="/boards" variant="outlined">목록</Button>
                </Stack>
            </Stack>

            {/* 메타 정보 */}
            <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                작성자: {data.author} · 등록일: {data.date} · 조회수: {data.views}
            </Typography>

            <Divider sx={{my: 2}}/>

            {/* 콘텐츠 */}
            <Typography variant="body1" sx={{whiteSpace: 'pre-wrap', lineHeight: 1.7}}>
                {(data.content ?? "").trim() ? data.content : '내용이 없습니다.'}
            </Typography>
        </Paper>
    );
}