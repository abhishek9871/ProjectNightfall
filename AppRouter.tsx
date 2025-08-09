import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { WatchPage } from './src/pages/WatchPage';

export function AppRouter() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/watch/:id" element={<WatchPage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}