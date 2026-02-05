const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

// Usage: node scripts/make-icon-transparent.js [threshold]
// threshold: color distance to black (0-441). Default: 16
const argv = process.argv.slice(2)
const threshold = Number(argv[0] ?? 16)
if (isNaN(threshold) || threshold < 0) {
  console.error('Invalid threshold:', argv[0])
  process.exit(1)
}

const input = path.join(__dirname, '../public/logos/mota-icon-v2.png')
const output = path.join(__dirname, `../public/logos/mota-icon-v2-transparent-t${threshold}.png`)

async function makeTransparent() {
  if (!fs.existsSync(input)) {
    console.error('Input file not found:', input)
    process.exit(1)
  }

  try {
    const img = sharp(input)
    const { width, height } = await img.metadata()

    // Ensure we have an RGBA buffer
    const raw = await img.ensureAlpha().raw().toBuffer()

    // raw is a Buffer of length width * height * 4 (r,g,b,a)
    // Use Euclidean distance from black: sqrt(r^2+g^2+b^2) <= threshold
    const thr2 = threshold * threshold
    for (let i = 0; i < raw.length; i += 4) {
      const r = raw[i]
      const g = raw[i + 1]
      const b = raw[i + 2]
      const dist2 = r * r + g * g + b * b
      if (dist2 <= thr2) {
        raw[i + 3] = 0
      }
    }

    await sharp(raw, { raw: { width, height, channels: 4 } })
      .png()
      .toFile(output)

    console.log('Created', output)
  } catch (err) {
    console.error('Error processing image:', err)
    process.exit(1)
  }
}

makeTransparent()
