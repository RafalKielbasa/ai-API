import e from 'express'
import { openai } from './lib/openai.js'
import { prisma } from './lib/prisma.js'

const isQuestionMessage = `
Your task is to determine if the provided sentence is a question.
If it is a question, return the JSON object: {"value": true}.
If it is not a question, return the JSON object: {"value": false}.
Guidelines###
Return valid JSON.
Return only the JSON object.
###
Examples###
"Mam 10 lat" -> {"value": false}
"Ile masz lat?" -> {"value": true}
###
`

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

  const isQuestion = await openai.chat.completions
    .create({
      messages: [
        {
          role: 'user',
          content: question,
        },
        {
          role: 'system',
          content: isQuestionMessage,
        },
      ],
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
    })
    .then((data) => data.choices[0].message.content)

  console.log({ isQuestion })

  const isQuestionObject = JSON.parse(isQuestion)

  if (!isQuestionObject.value) {
    return await prisma.info.create({ data: { info: question } })
  }

  const info = await prisma.info.findMany()

  const dynamicContext = JSON.stringify(info.map(({ info }) => info))

  console.log(dynamicContext)

  const reply = await openai.chat.completions
    .create({
      messages: [
        {
          role: 'user',
          content: question,
        },
        {
          role: 'system',
          content: ` ${systemMessage} context###${dynamicContext}###`,
        },
      ],
      model: 'gpt-4o',
    })
    .then((data) => data.choices[0].message.content)

  // // Wyślij odpowiedź w formacie JSON
  res.json({ reply })
})

app.listen(3000)
