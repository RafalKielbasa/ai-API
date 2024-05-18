import e from 'express'
import { openai } from './helpers/openai.js'

const systemMessage = `
Take a deep breath and focus.
Your task is to answer the questions.

Rules ###
Stick to the given rules.
Anwer i polish
###
`

const app = e()

app.use(e.json())

app.get('/', (req, res) => {
  console.log('here I am')
  res.send('Hi')
})

app.post('/', async (req, res) => {
  const { question } = req.body
  const reply = await openai.chat.completions
    .create({
      messages: [
        {
          role: 'user',
          content: question,
        },
        {
          role: 'system',
          content: systemMessage,
        },
      ],
      model: 'gpt-4o',
    })
    .then((data) => data.choices[0].message.content)

  // Wyślij odpowiedź w formacie JSON
  res.json({ reply })
})

app.listen(3000)
