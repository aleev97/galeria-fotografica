import { mkdir, writeFile } from 'node:fs/promises'
import { samplePhotos } from '../../web/src/data/samplePhotos.ts'

const q = (value) => `'${String(value).replaceAll("'", "''")}'`

const rows = samplePhotos.map(
  (p, index) =>
    `(${q(p.id)}, ${q(p.title)}, ${q(p.alt)}, ${p.description ? q(p.description) : 'NULL'}, ${q(p.collection)}, ${p.width}, ${p.height}, ${p.featured ? 1 : 0}, 1, ${index})`,
)

const sql = `DELETE FROM photos;
INSERT INTO photos (id, title, alt, description, collection, width, height, featured, published, sort_order) VALUES
${rows.join(',\n')};
`

await mkdir('seeds', { recursive: true })
await writeFile('seeds/dev.sql', sql)
console.log(`Generadas ${rows.length} filas en seeds/dev.sql`)