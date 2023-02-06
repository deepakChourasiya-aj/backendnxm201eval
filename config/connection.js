const mongoose = require('mongoose')
const connection = mongoose.connect("mongodb+srv://deepak:deepakch@cluster0.prsaltk.mongodb.net/goldapp?retryWrites=true&w=majority")

module.exports = {
    connection
}