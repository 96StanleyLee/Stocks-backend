const mongoose = require('mongoose')
const Schema = mongoose.Schema


const portfolioSchema = new Schema({
    ticker:{
        type: String,
        required: true
    },
    user: {type: Schema.Types.ObjectId, ref: 'User'}
})



const Portfolio = mongoose.model('Portfolio', portfolioSchema)


module.exports = Portfolio
