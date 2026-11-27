import { MotionConfig } from 'motion/react'
import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'

import { AdminGate } from '@/features/admin/AdminGate'
import { AdminProvider } from '@/features/admin/AdminProvider'
import RootLayout from '@/layouts/RootLayout'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'

// Estas páginas se descargan solo cuando alguien las visita
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const AdminPhotoEditPage = lazy(() => import('@/pages/AdminPhotoEditPage'))
const AdminPhotosPage = lazy(() => import('@/pages/AdminPhotosPage'))
const BehindTheLensPage = lazy(() => import('@/pages/BehindTheLensPage'))
const CollectionsPage = lazy(() => import('@/pages/CollectionsPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const ExplorerPage = lazy(() => import('@/pages/ExplorerPage'))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'))
const PhotoPage = lazy(() => import('@/pages/PhotoPage'))

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AdminProvider>
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
        </AdminProvider>
      </BrowserRouter>
    </MotionConfig>
  )
}