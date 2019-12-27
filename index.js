require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
//const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())



app.use(cors())
app.use(express.static('build'))
//app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        response.json(result.map(person => person.toJSON()))
      })
//      morgan.token('content', () => {return JSON.stringify(request.body)})    
})

app.get('/info', (request, response) => {
    const contacts = people.length
    const date = Date()
//    morgan.token('content', () => {return JSON.stringify(request.body)})
    response.send(`Phonebook has ${contacts} contacts<br>
    ${date}`)
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person.toJSON())
        } else {
            response.status(204).end()
        }
        
    })
    .catch(error => next(error))
    
    
//    morgan.token('content', () => {return JSON.stringify(person)})
    
})

app.post('/api/persons', (request, response) => {
    const body = request.body
//    morgan.token('content', () => {return (JSON.stringify(body))})
   if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    } else {
        const person = new Person({
            name: body.name,
            number: body.number
        })
        person.save().then(savedPerson => {
            response.json(savedPerson.json)
        })
    }

})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    
    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedNote => {
        response.json(updatedNote.toJSON())
    })
    .catch(error => next(error))
//    morgan.token('content', () => {return (JSON.stringify(body))})
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
console.error(error.message)

if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
}

next(error)
}


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})