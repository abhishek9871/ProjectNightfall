import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { WatchPage } from './src/pages/WatchPage';
import CategoryPage from './src/pages/CategoryPage';

export function AppRouter() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/watch/:id" element={<WatchPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}