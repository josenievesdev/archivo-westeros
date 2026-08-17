import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ArbolGenealogicoPage } from '../../features/arbol-genealogico/pages/ArbolGenealogicoPage'
import { CasaDetallePage } from '../../features/casas/pages/CasaDetallePage'
import { CasasPage } from '../../features/casas/pages/CasasPage'
import { CronologiaPage } from '../../features/cronologia/pages/CronologiaPage'
import { InicioPage } from '../../features/inicio/pages/InicioPage'
import { MapaPage } from '../../features/mapa/pages/MapaPage'
import { MesaDeGuerraPage } from '../../features/mesa-de-guerra/pages/MesaDeGuerraPage'
import { PersonajeDetallePage } from '../../features/personajes/pages/PersonajeDetallePage'
import { PersonajesPage } from '../../features/personajes/pages/PersonajesPage'
import { AppLayout } from '../layout/AppLayout'
import { NotFoundPage } from './NotFoundPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<InicioPage />} />
          <Route path="personajes" element={<PersonajesPage />} />
          <Route path="personajes/:id" element={<PersonajeDetallePage />} />
          <Route path="casas" element={<CasasPage />} />
          <Route path="casas/:id" element={<CasaDetallePage />} />
          <Route path="mapa" element={<MapaPage />} />
          <Route path="linajes" element={<ArbolGenealogicoPage />} />
          <Route path="cronologia" element={<CronologiaPage />} />
          <Route path="mesa-de-guerra" element={<MesaDeGuerraPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
