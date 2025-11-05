import { Chip } from '@mui/material'

// 장비 상태에 따라 라벨.색상을 일관되게 매핑
export default function StatusChip({ status }: { status: 'active'|'standby'|'inactive' }) {
    const map = {
        active: { label: 'active', color: 'success' as const },
        standby: { label: 'standby', color: 'warning' as const },
        inactive:{ label: 'inactive', color: 'error' as const }
    }
    const s = map[status]
    return <Chip label={s.label} color={s.color} size="small" variant="outlined" />
}