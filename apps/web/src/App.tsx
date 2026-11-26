import { MotionConfig } from 'motion/react'
import { BrowserRouter, Route, Routes } from 'react-router'

import { AdminGate } from '@/features/admin/AdminGate'
import RootLayout from '@/layouts/RootLayout'
import AboutPage from '@/pages/AboutPage'
import AdminPhotoEditPage from '@/pages/AdminPhotoEditPage'
import AdminPhotosPage from '@/pages/AdminPhotosPage'
import BehindTheLensPage from '@/pages/BehindTheLensPage'
import CollectionsPage from '@/pages/CollectionsPage'
import ContactPage from '@/pages/ContactPage'
import ExplorerPage from '@/pages/ExplorerPage'
import FavoritesPage from '@/pages/FavoritesPage'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import PhotoPage from '@/pages/PhotoPage'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="colecciones" element={<CollectionsPage />} />
            <Route path="explorador" element={<ExplorerPage />} />
            <Route path="behind-the-lens" element={<BehindTheLensPage />} />
            <Route path="sobre-mi" element={<AboutPage />} />
            <Route path="favoritos" element={<FavoritesPage />} />
            <Route path="contacto" element={<ContactPage />} />
            <Route path="foto/:id" element={<PhotoPage />} />

            <Route path="admin" element={<AdminGate />}>
              <Route index element={<AdminPhotosPage />} />
              <Route path="fotos/:id" element={<AdminPhotoEditPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}