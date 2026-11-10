import fs from 'fs'
if (!fs.existsSync('.backup-before-animations')) { console.error('No backup found'); process.exit(1) }
fs.rmSync('src', { recursive: true, force: true })
fs.cpSync('.backup-before-animations', 'src', { recursive: true })
console.log('Reverted src/ to the state before the React Bits animations.')
