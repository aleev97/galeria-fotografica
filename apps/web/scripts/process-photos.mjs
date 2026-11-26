import { randomBytes } from 'node:crypto'
import { mkdir, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const inputDir = process.argv[2]
if (!inputDir) {
  console.error('Uso: node scripts/process-photos.mjs "<carpeta con los originales>"')
  process.exit(1)
}

const OUT_DIR = 'public/photos'
const IMPORT_DIR = '../api/imports'
const WIDTHS = [640, 1280]
const SUPPORTED = new Set(['.jpg', '.jpeg', '.png'])

const slugify = (name) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Sufijo aleatorio: hace que la dirección de cada imagen no se pueda adivinar
const randomSuffix = () => randomBytes(6).toString('hex')

const q = (value) => `'${String(value).replaceAll("'", "''")}'`

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
  const slug = slugify(path.parse(file).name).slice(0, 40) || 'foto'
  const id = `${slug}-${randomSuffix()}`

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

  photos.push({ id, title: slug.replaceAll('-', ' '), width, height })
  console.log(`✔ ${id} (${width}x${height})`)
}

// Todas entran como borrador (published = 0) y al final del orden actual
const statements = photos.map(
  (p) =>
    `INSERT INTO photos (id, title, alt, collection, width, height, featured, published, sort_order) VALUES (${q(p.id)}, ${q(p.title)}, '', 'cosmos', ${p.width}, ${p.height}, 0, 0, (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM photos));`,
)

const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const importFile = path.join(IMPORT_DIR, `import-${stamp}.sql`)

await mkdir(IMPORT_DIR, { recursive: true })
await writeFile(importFile, `${statements.join('\n')}\n`)

console.log(`\n${photos.length} fotos procesadas. Archivos de salida con EXIF: ${withExif}`)
console.log(`SQL de importación: ${importFile}`)
console.log('Aplicalo con:')
console.log(
  `  npm run db:import:local --workspace apps/api -- --file=imports/${path.basename(importFile)}`,
)