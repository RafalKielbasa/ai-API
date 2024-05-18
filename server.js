import e from 'express'

const app = e()

app.use(e.json())

app.get('/', (req, res) => {
  console.log('here I am')
  res.send('Hi')
})

app.post('/', (req, res) => {
  const { question } = req.body
  const reply = `Otrzymano pytanie: ${question}`
  console.log(question)

  // Wyślij odpowiedź w formacie JSON
  res.json({ reply })
})

app.listen(3000)
