import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

import HomePage from '@/pages/public/HomePage';
import AboutPage from '@/pages/public/AboutPage';
import CatalogPage from '@/pages/public/CatalogPage';
import PlantDetailsPage from '@/pages/public/PlantDetailsPage';
import GalleryPage from '@/pages/public/GalleryPage';
import ServicesPage from '@/pages/public/ServicesPage';
import ContactPage from '@/pages/public/ContactPage';
import NotFoundPage from '@/pages/public/NotFoundPage';

import LoginPage from '@/pages/admin/LoginPage';
import DashboardPage from '@/pages/admin/DashboardPage';
import PlantsListPage from '@/pages/admin/PlantsListPage';
import PlantEditorPage from '@/pages/admin/PlantEditorPage';
import CategoriesPage from '@/pages/admin/CategoriesPage';
import GalleryManagerPage from '@/pages/admin/GalleryManagerPage';
import MessagesPage from '@/pages/admin/MessagesPage';
import ContentManagerPage from '@/pages/admin/ContentManagerPage';

export function AppRouter() {
  return (
    <Routes>
      {/* --- Public site --- */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/plants" element={<CatalogPage />} />
      <Route path="/plants/:slug" element={<PlantDetailsPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* --- Admin: public login --- */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* --- Admin: protected --- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/plants" element={<PlantsListPage />} />
        <Route path="/admin/plants/new" element={<PlantEditorPage />} />
        <Route path="/admin/plants/:id/edit" element={<PlantEditorPage />} />
        <Route path="/admin/categories" element={<CategoriesPage />} />
        <Route path="/admin/gallery" element={<GalleryManagerPage />} />
        <Route path="/admin/content" element={<ContentManagerPage />} />
        <Route path="/admin/messages" element={<MessagesPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
