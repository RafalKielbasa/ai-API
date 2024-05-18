import e from 'express'

const app = e()

app.use(e.json())

app.get('/', (req, res) => {
  console.log('here I am')
  res.send('Hi')
})

app.post('/', (req, res) => {
  console.log({ res })
  console.log({ req })
})

app.listen(3000)
