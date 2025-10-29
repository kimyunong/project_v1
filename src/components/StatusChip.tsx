import { Chip } from '@mui/material'


export default function StatusChip({ status }: { status: 'active'|'standby'|'inactive' }) {
    const map = {
        active: { label: 'active', color: 'success' as const },
        standby: { label: 'standby', color: 'warning' as const },
        inactive:{ label: 'inactive', color: 'error' as const }
    }
    const s = map[status]
    return <Chip label={s.label} color={s.color} size="small" variant="outlined" />
}