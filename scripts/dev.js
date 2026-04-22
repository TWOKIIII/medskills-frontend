import { spawn } from 'child_process'

const nuxt = spawn('node', ['./node_modules/nuxt/bin/nuxt.mjs', 'dev'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  env: {
    ...process.env,
    FORCE_COLOR: '1'
  }
})

nuxt.stdout.on('data', (data) => {
  const line = data.toString('utf8')
  if (!line.includes('Duplicated imports')) {
    process.stdout.write(data)
  }
})

nuxt.stderr.on('data', (data) => {
  const line = data.toString('utf8')
  if (!line.includes('Duplicated imports')) {
    process.stderr.write(data)
  }
})

nuxt.on('close', (code) => {
  process.exit(code)
})

process.on('SIGINT', () => {
  nuxt.kill('SIGINT')
  process.exit()
})