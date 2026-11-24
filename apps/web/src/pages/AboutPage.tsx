import { Link } from 'react-router'
import { buttonStyles } from '@/components/buttonStyles'
import { Container } from '@/components/Container'

export default function AboutPage() {
  return (
    <Container className="py-24">
      <title>Sobre mí | AstroGaia</title>
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl">Sobre mí</h1>
        <div className="mt-8 space-y-6 text-lg leading-relaxed text-moon-300">
          <p>
            Soy Alejandro, de San Rafael, Mendoza. Vivo en una finca donde cada noche el cielo
            es distinto, y ahí empezó todo: con el celular en la mano, mirando hacia arriba.
          </p>
          <p>
            No soy fotógrafo profesional. Fotografío porque disfruto explorar y estar presente
            en cada momento. Esta galería captura momentos: la Luna, las estrellas, momentos,
            paisajes, animales y detalles que casi nadie mira.
          </p>
          <p>Todas las fotos están tomadas con un Redmi Note 14 Pro.</p>
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/explorador" className={buttonStyles('primary')}>
            Explorar fotos
          </Link>
          <Link to="/contacto" className={buttonStyles('ghost')}>
            Contacto
          </Link>
        </div>
      </div>
    </Container>
  )
}