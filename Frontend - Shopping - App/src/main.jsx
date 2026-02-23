import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.jsx'

const DEFAULT_API_BASE_URL = 'https://my-shopping-app-75s3.onrender.com';
const LEGACY_LOCAL_BASE_URL = 'http://localhost:3900';
const envApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URL || '').trim();
const apiBaseUrl = (envApiBaseUrl || DEFAULT_API_BASE_URL).replace(/\/+$/, '');

if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    const originalFetch = window.fetch.bind(window);

    window.fetch = (input, init) => {
        if (typeof input === 'string' && input.startsWith(LEGACY_LOCAL_BASE_URL)) {
            return originalFetch(input.replace(LEGACY_LOCAL_BASE_URL, apiBaseUrl), init);
        }

        if (input instanceof Request && input.url.startsWith(LEGACY_LOCAL_BASE_URL)) {
            const rewrittenRequest = new Request(
                input.url.replace(LEGACY_LOCAL_BASE_URL, apiBaseUrl),
                input
            );
            return originalFetch(rewrittenRequest, init);
        }

        return originalFetch(input, init);
    };
}

createRoot(document.getElementById('root')).render(
    <App />
)
