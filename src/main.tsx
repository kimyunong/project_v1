import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider} from 'react-router-dom'
import {router} from '@/routes'
import ThemeWrapper from "@/ThemeWrapper";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeWrapper>
            <RouterProvider router={router}/>
        </ThemeWrapper>
    </React.StrictMode>
)
