import { BrowserRouter, Route, Routes } from 'react-router'
import RootLayout from '@/layouts/RootLayout'
import AboutPage from '@/pages/AboutPage'
import BehindTheLensPage from '@/pages/BehindTheLensPage'
import CollectionsPage from '@/pages/CollectionsPage'
import ContactPage from '@/pages/ContactPage'
import ExplorerPage from '@/pages/ExplorerPage'
import FavoritesPage from '@/pages/FavoritesPage'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
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
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}