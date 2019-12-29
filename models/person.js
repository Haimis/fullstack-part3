const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI

console.log('connectin to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => {
    console.log('connected to ', url)
})
.catch((error) => {
    console.log('error connecting to MongoDB', error.message)
})

const personSchema = new mongoose.Schema({
    name: { type:String, required: true, unique: true/*, minlength: 8*/ },
    number: { type:String, required: true, unique: true/*, minlength: 3*/ }
})
personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
    transform: (document, returnedPerson) => {
        returnedPerson.id = returnedPerson._id.toString()
        delete returnedPerson._id
        delete returnedPerson.__v
    }
})

mongoose.set('useCreateIndex', true);

module.exports = mongoose.model('Person', personSchema)
