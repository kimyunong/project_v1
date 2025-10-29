import { Box } from '@mui/material'
import { ReactNode } from 'react'
export default function SearchBar({ children }: { children: ReactNode }) {
    return <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>{children}</Box>
}