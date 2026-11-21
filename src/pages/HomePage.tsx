import { Camera } from 'lucide-react'
import { motion } from 'motion/react'

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 px-6 py-32 text-center">
      <Camera size={48} className="text-sky-400" aria-hidden="true" />
      <motion.h1
         className="text-4xl font-bold"
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 1 }}
      >
         Galería Fotográfica
      </motion.h1>     
    </section>
  )
}