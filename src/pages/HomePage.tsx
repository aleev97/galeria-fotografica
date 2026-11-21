import { Camera } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'

import { buttonStyles } from '@/components/buttonStyles'
import { Container } from '@/components/Container'

export default function HomePage() {
  return (
    <Container className="flex flex-col items-center gap-6 py-32 text-center">
      <Camera size={48} className="text-aurora-400" aria-hidden="true" />
      <motion.h1
        className="text-5xl md:text-7xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Galería fotográfica
      </motion.h1>
      <p className="max-w-xl text-lg text-moon-300">
        Fotografías del cielo, la Tierra y los detalles que casi nadie mira.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <Link to="/colecciones" className={buttonStyles('primary')}>
          Ver colecciones
        </Link>
        <Link to="/explorador" className={buttonStyles('ghost')}>
          Explorar fotos
        </Link>
      </div>
    </Container>
  )
}