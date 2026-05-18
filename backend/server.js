const express = require('express')
const cors = require('cors')
const fs = require('fs')
const { exec } = require('child_process')

const app = express()
app.use(cors())
app.use(express.json())

app.post('/run', (req, res) => {
  const { code, input } = req.body

  fs.writeFileSync('main.cpp', code)
  fs.writeFileSync('input.txt', input)

  exec('g++ main.cpp -o main && ./main < input.txt', (err, stdout, stderr) => {
    if (err) {
      let line = null

      const match = stderr.match(/main\\.cpp:(\\d+):\\d+:/)

      if (match) {
        line = parseInt(match[1])
      }

      return res.json({
        error: stderr,
        errorLine: line
      })
    }

    res.json({ output: stdout })
  })
})

app.listen(3001, () => {
  console.log('Servidor en puerto 3001')
})