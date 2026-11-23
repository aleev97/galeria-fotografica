import { ExternalLink, Mail } from 'lucide-react'
import { buttonStyles } from '@/components/buttonStyles'
import { Container } from '@/components/Container'
import { siteConfig } from '@/config/site'

export default function ContactPage() {
  return (
    <Container className="py-24">
      <title>Contacto | Galería fotográfica</title>

      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl">Contacto</h1>
        <p className="mt-6 text-lg text-moon-300">
          Si querés comentarme algo sobre una foto o proponerme algo, podés escribirme por
          estos medios.
        </p>

        <ul className="mt-10 flex flex-col items-start gap-4">
          <li>
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles('primary')}
            >
              {siteConfig.instagramHandle} en Instagram
              <ExternalLink size={16} aria-hidden="true" />
              <span className="sr-only">(se abre en una pestaña nueva)</span>
            </a>
          </li>
          {siteConfig.contactEmail && (
            <li>
              <a href={`mailto:${siteConfig.contactEmail}`} className={buttonStyles('ghost')}>
                <Mail size={16} aria-hidden="true" />
                {siteConfig.contactEmail}
              </a>
            </li>
          )}
        </ul>
      </div>
    </Container>
  )
}