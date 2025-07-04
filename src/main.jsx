import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  RouterProvider
} from "react-router";
import { router } from './router/router.jsx';
import 'aos/dist/aos.css';
import Aos from 'aos';
import AuthProvider from './context/AuthContext/AuthProvider.jsx';

import {
  QueryClientProvider,
  QueryClient,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

Aos.init();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className="font-urbanist max-w-[1320px] mx-auto bg-base-300">
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </div>
    </QueryClientProvider>
  </StrictMode>,
)
