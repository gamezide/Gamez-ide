const express = require('express')
const cors = require('cors')
const fs = require('fs')
const { exec } = require('child_process')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Backend funcionando')
})

app.post('/run', (req, res) => {
  const { code, input } = req.body

  fs.writeFileSync('main.cpp', code)
  fs.writeFileSync('input.txt', input || '')

  exec('g++ main.cpp -o program && ./program < input.txt', (err, stdout, stderr) => {
    if (err) {
      return res.json({ error: stderr || err.message })
    }

    res.json({ output: stdout })
  })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log('Servidor en puerto ' + PORT)
})