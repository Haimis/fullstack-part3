const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')




app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] :response-time ms :content'))


let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },

    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },

    {
        name: "Dan Abramov",
        number: "12-43-234335",
        id: 3
    },

    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]

app.get('/api/persons', (request, response) => {
    response.send(persons)
    morgan.token('content', () => {return JSON.stringify(request.body)})
})

app.get('/info', (request, response) => {
    const contacts = persons.length
    const date = Date()
    morgan.token('content', () => {return JSON.stringify(request.body)})
    response.send(`Phonebook has ${contacts} contacts<br>
    ${date}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    morgan.token('content', () => {return JSON.stringify(person)})
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const randomId = Math.floor(Math.random() * Math.floor(1000000))
    const body = request.body
    morgan.token('content', () => {return (JSON.stringify(body))})
   if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    } else {


        const person = {
            name: body.name,
            number: body.number,
            id: randomId
        }
        persons = persons.concat(person)

        response.json(person)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})