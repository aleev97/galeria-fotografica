import { ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'

import { buttonStyles } from '@/components/buttonStyles'
import { Container } from '@/components/Container'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.2 } } }
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9 } },
}

export function Hero() {
  return (
    <section className="flex min-h-[80svh] items-center">
      <Container>
        <motion.div
          className="flex flex-col items-center gap-6 text-center"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.p
            variants={item}
            className="text-sm uppercase tracking-[0.3em] text-aurora-400"
          >
            Fotografía personal
          </motion.p>
          <motion.h1 variants={item} className="text-5xl md:text-7xl lg:text-8xl">
            AstroGaia
          </motion.h1>
          <motion.p variants={item} className="max-w-xl text-lg text-moon-300">
            Fotografías del cielo, la Tierra y los detalles que casi nadie mira.
          </motion.p>
          <motion.div variants={item} className="mt-4 flex flex-wrap justify-center gap-4">
            <Link to="/colecciones" className={buttonStyles('primary')}>
              Ver colecciones
            </Link>
            <Link to="/explorador" className={buttonStyles('ghost')}>
              Explorar fotos
            </Link>
          </motion.div>
          <motion.div variants={item}>
            <ChevronDown
              className="mt-8 text-moon-300 motion-safe:animate-bounce"
              aria-hidden="true"
            />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}