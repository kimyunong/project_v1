import {
    Table, TableBody, TableCell, TableHead, TableRow,
    Skeleton, TableContainer, Typography, useMediaQuery,
    Theme
} from '@mui/material';
import {ReactNode, memo, useMemo} from 'react';

export type Accessor<T> = (row: T, rowIndex: number) => ReactNode;

export type Column<T> = {
    id: string;
    header: string;
    width?: number | string;
    align?: 'left' | 'center' | 'right';
    getValue?: Accessor<T>;
    renderCell?: Accessor<T>;
    hideBelow?: 'sm' | 'md' | 'lg' | 'xl';
    alwaysShow?: boolean;
    ellipsis?: boolean;
    maxWidth?: number | string;
};

type Props<T> = {
    columns: Column<T>[];
    data?: T[];
    loading?: boolean;
    emptyText?: string;
    getRowKey?: (row: T, index: number) => string | number;
    variant?: 'elevation' | 'outlined';
    size?: 'small' | 'medium';
};

const breakpointOrder: Record<NonNullable<Column<any>['hideBelow']>, number> = {sm: 0, md: 1, lg: 2, xl: 3};

function RawDataTable<T>({
                             columns,
                             data,
                             loading,
                             emptyText = '데이터가 없습니다.',
                             getRowKey,
                         }: Props<T>) {
    const rows = data ?? [];

    // 브레이크포인트 상태(정자 사용)
    const isUpSm = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm')); // >=600
    const isUpMd = useMediaQuery((theme: Theme) => theme.breakpoints.up('md')); // >=900
    const isUpLg = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg')); // >=1200
    const isUpXl = useMediaQuery((theme: Theme) => theme.breakpoints.up('xl')); // >=1536

    const visibleColumns = useMemo(() => {
        // 1) hideBelow 규칙 적용
        const filteredByRule = columns.filter((column) => {
            if (!column.hideBelow) return true;
            const minLevel = breakpointOrder[column.hideBelow];
            const isVisible =
                (minLevel <= 0 && isUpSm) ||
                (minLevel <= 1 && isUpMd) ||
                (minLevel <= 2 && isUpLg) ||
                (minLevel <= 3 && isUpXl);
            return isVisible;
        });

        // 2) xs 기본 규칙: "앞의 2개" + "alwaysShow=true"
        const isXs = !isUpSm;
        if (isXs) {
            const headTwo = filteredByRule.slice(0, 2);
            const pinned = filteredByRule.filter((column) => column.alwaysShow && !headTwo.includes(column));
            const selected = new Set([...headTwo, ...pinned]);
            return filteredByRule.filter((column) => selected.has(column));
        }
        return filteredByRule;
    }, [columns, isUpSm, isUpMd, isUpLg, isUpXl]);

    return (
        <TableContainer sx={{width: 1, overflowX: 'auto'}}>
            <Table aria-label="data table" size="small">
                <TableHead>
                    <TableRow>
                        {visibleColumns.map((column) => (
                            <TableCell
                                key={column.id}
                                align={column.align ?? 'center'}
                                sx={{width: column.width, p: {xs: 1, sm: 1.25, md: 1.5, lg: 2}}}
                            >
                                {column.header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {/* 로딩 스켈레톤 */}
                    {loading &&
                        Array.from({length: 5}).map((_, index) => (
                            <TableRow key={`skeleton-row-${index}`}>
                                {visibleColumns.map((column) => (
                                    <TableCell key={`skeleton-cell-${column.id}`}>
                                        <Skeleton height={18}/>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}

                    {/* 데이터 렌더 */}
                    {!loading &&
                        rows.length > 0 &&
                        rows.map((row, index) => {
                            const rowKey = getRowKey?.(row, index) ?? index;
                            return (
                                <TableRow key={rowKey} hover tabIndex={0}>
                                    {visibleColumns.map((column) => {
                                        const base = (row as unknown as Record<string, unknown>)[column.id];
                                        const content = column.renderCell
                                            ? column.renderCell(row, index)
                                            : column.getValue
                                                ? column.getValue(row, index)
                                                : String(base ?? '');

                                        // 말줄임/최대폭 처리
                                        if (column.ellipsis || column.maxWidth) {
                                            return (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align ?? 'center'}
                                                    sx={{p: {xs: 1, sm: 1.25, md: 1.5}}}
                                                >
                                                    <Typography
                                                        noWrap
                                                        sx={{
                                                            maxWidth: column.maxWidth ?? 160,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            mx: 'auto',
                                                        }}
                                                    >
                                                        {content}
                                                    </Typography>
                                                </TableCell>
                                            );
                                        }

                                        return (
                                            <TableCell
                                                key={column.id}
                                                align={column.align ?? 'center'}
                                                sx={{p: {xs: 1, sm: 1.25, md: 1.5}}}
                                            >
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
                            <TableCell colSpan={visibleColumns.length} align="center"
                                       sx={{py: 6, color: 'text.secondary'}}>
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