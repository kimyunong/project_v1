import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton
} from '@mui/material';
import {ReactNode, memo} from 'react';

export type Accessor<T> = (row: T, rowIndex: number) => ReactNode;

export type Column<T> = {
    /* 고유 id (정렬/엑셀/테스트 식별에 사용) */
    id: string;
    /* 헤더 라벨 */
    header: string;
    /* 레이아웃 */
    width?: number | string;
    align?: 'left' | 'center' | 'right';
    /* 기본 값 추출기 (없으면 row[id] 사용) */
    getValue?: Accessor<T>;
    /* 고급 렌더링 (Chip, 링크 등) */
    renderCell?: Accessor<T>;
};

type Props<T> = {
    columns: Column<T>[];
    data?: T[];
    loading?: boolean;
    emptyText?: string;
    /* 고유 row key (id가 없으면 index 사용) */
    getRowKey?: (row: T, index: number) => string | number;
    /* Paper variant 지정 (outlined가 테이블에 잘 어울림) */
    variant?: 'elevation' | 'outlined';
    /* Table size */
    size?: 'small' | 'medium';
};

function RawDataTable<T>({
                             columns,
                             data,
                             loading,
                             emptyText = '데이터가 없습니다.',
                             getRowKey,
                             variant = 'outlined',
                             size = 'small',
                         }: Props<T>) {
    const rows = data ?? [];

    return (
        <TableContainer component={Paper} variant={variant}>
            <Table size={size} aria-label="data table">
                <TableHead>
                    <TableRow>
                        {columns.map((c) => (
                            <TableCell
                                key={c.id}
                                align={c.align ?? 'left'}
                                sx={{width: c.width}}
                            >
                                {c.header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {/* 로딩 스켈레톤 */}
                    {loading && Array.from({length: 5}).map((_, i) => (
                        <TableRow key={`sk-${i}`}>
                            {columns.map((c) => (
                                <TableCell key={`skc-${c.id}`}>
                                    <Skeleton height={20}/>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}

                    {/* 데이터 */}
                    {!loading && rows.length > 0 && rows.map((row, i) => {
                        const rowKey = getRowKey?.(row, i) ?? i;
                        return (
                            <TableRow key={rowKey} hover tabIndex={0}>
                                {columns.map((c) => {
                                    const base = (row as unknown as Record<string, unknown>)[c.id];
                                    const content = c.renderCell
                                        ? c.renderCell(row, i)
                                        : c.getValue
                                            ? c.getValue(row, i)
                                            : String(base ?? '');
                                    return (
                                        <TableCell key={c.id} align={c.align ?? 'left'}>
                                            {content}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}

                    {/* 빈 상태 */}
                    {!loading && rows.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={columns.length} align="center" sx={{py: 6, color: 'text.secondary'}}>
                                {emptyText}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const DataTable = memo(RawDataTable) as typeof RawDataTable;
export default DataTable;