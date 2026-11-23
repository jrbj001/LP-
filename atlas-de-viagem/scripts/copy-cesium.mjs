// Copia o build oficial do Cesium (Cesium.js, workers, widgets, texturas) para public/cesium,
// servido em /cesium tanto no dev quanto no build de produção. O Cesium.js já vem minificado
// e é carregado por <script>, fora do bundle: o minificador do Next corrompe trechos do Cesium.
import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const source = path.join(root, 'node_modules', 'cesium', 'Build', 'Cesium')
const target = path.join(root, 'public', 'cesium')

if (!existsSync(source)) {
  console.warn('[copy-cesium] cesium ainda não instalado; pulei a cópia.')
  process.exit(0)
}

rmSync(target, { recursive: true, force: true })
mkdirSync(target, { recursive: true })
for (const dir of ['Workers', 'ThirdParty', 'Assets', 'Widgets']) {
  cpSync(path.join(source, dir), path.join(target, dir), { recursive: true })
}
copyFileSync(path.join(source, 'Cesium.js'), path.join(target, 'Cesium.js'))
console.log('[copy-cesium] assets copiados para public/cesium')
