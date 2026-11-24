import { mkdir, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const inputDir = process.argv[2]
if (!inputDir) {
  console.error('Uso: node scripts/process-photos.mjs "<carpeta con los originales>"')
  process.exit(1)
}

const OUT_DIR = 'public/sample-photos'
const DATA_FILE = 'src/data/samplePhotos.ts'
const WIDTHS = [640, 1280]
const SUPPORTED = new Set(['.jpg', '.jpeg', '.png'])

const slugify = (name) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const entries = await readdir(inputDir)
const files = entries.filter((f) => SUPPORTED.has(path.extname(f).toLowerCase())).sort()
const skipped = entries.filter((f) => !SUPPORTED.has(path.extname(f).toLowerCase()))

if (skipped.length) console.warn(`Ignorados (formato no soportado): ${skipped.join(', ')}`)
if (files.length === 0) {
  console.error('No encontré fotos JPG o PNG en esa carpeta.')
  process.exit(1)
}

await mkdir(OUT_DIR, { recursive: true })

const photos = []
let withExif = 0

for (const file of files) {
  const input = path.join(inputDir, file)
  const id = slugify(path.parse(file).name)

  // La orientación vive en el EXIF: hay que aplicarla (rotate) antes de descartarlo
  const meta = await sharp(input).metadata()
  const swapped = meta.orientation !== undefined && meta.orientation >= 5
  const width = swapped ? meta.height : meta.width
  const height = swapped ? meta.width : meta.height

  for (const w of WIDTHS) {
    const resized = sharp(input).rotate().resize({ width: w, withoutEnlargement: true })
    const webpPath = path.join(OUT_DIR, `${id}-${w}.webp`)
    const avifPath = path.join(OUT_DIR, `${id}-${w}.avif`)

    await resized.clone().webp({ quality: 80 }).toFile(webpPath)
    await resized.clone().avif({ quality: 55 }).toFile(avifPath)

    // Comprobación: ninguna salida debe conservar EXIF
    for (const out of [webpPath, avifPath]) {
      if ((await sharp(out).metadata()).exif) withExif++
    }
  }

  photos.push({ id, width, height })
  console.log(`✔ ${id} (${width}x${height})`)
}

const rows = photos
  .map(
    (p) =>
      `  { id: '${p.id}', title: '${p.id}', alt: '', collection: 'cosmos', width: ${p.width}, height: ${p.height}, featured: false },`,
  )
  .join('\n')

const content = `import type { Photo } from '@/types/photo'

// Generado por scripts/process-photos.mjs. Editá title, alt, collection y featured a mano.
export const samplePhotos: Photo[] = [
${rows}
]
`

await mkdir(path.dirname(DATA_FILE), { recursive: true })
try {
  await writeFile(DATA_FILE, content, { flag: 'wx' })
  console.log(`\nCreado ${DATA_FILE}`)
} catch (error) {
  if (error.code !== 'EEXIST') throw error
  console.warn(`\n${DATA_FILE} ya existe: no lo pisé para no perder tus ediciones.`)
}

console.log(`\n${photos.length} fotos procesadas. Archivos de salida con EXIF: ${withExif}`)