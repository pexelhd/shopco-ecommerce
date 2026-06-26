import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { UserAuthProvider } from './context/UserAuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import App from './App.jsx';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <DarkModeProvider>
          <AuthProvider>
            <UserAuthProvider>
              <App />
              <Toaster position="top-right" richColors />
            </UserAuthProvider>
          </AuthProvider>
        </DarkModeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
