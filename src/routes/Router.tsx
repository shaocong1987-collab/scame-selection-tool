import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import QuickSelectPage from '../pages/QuickSelectPage';
import ForwardSelectionPage from '../pages/ForwardSelectionPage';
import ReverseSelectionPage from '../pages/ReverseSelectionPage';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import KnowledgePage from '../pages/KnowledgePage';
import DocumentManagementPage from '../pages/DocumentManagementPage';
import HelpPage from '../pages/HelpPage';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import PlugsPage from '../pages/PlugsPage';
import SocketsPage from '../pages/SocketsPage';

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/quick-select" element={<QuickSelectPage />} />
      <Route path="/forward-selection" element={<ForwardSelectionPage />} />
      <Route path="/reverse-selection" element={<ReverseSelectionPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:partNumber" element={<ProductDetailPage />} />
      <Route path="/plugs" element={<PlugsPage />} />
      <Route path="/sockets" element={<SocketsPage />} />
      <Route path="/knowledge" element={<KnowledgePage />} />
      <Route path="/knowledge/management" element={<DocumentManagementPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Router;