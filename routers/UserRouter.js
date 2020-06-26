const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const Portfolio = require('../models/Portfolio')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')





router.post('/register', async (req,res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        res.send(user)
    }catch(e){
        res.status(400).send()
    }
})

router.post('/login', async (req, res)=>{
    try{
        let user = await User.authenticatePassword(req.body.email, req.body.password)
        let token = await user.accessToken()
        await user.save()
        res.status(200).send({user,token})
    }catch(e){
         res.status(400).send('User cannot be authenticated')
    }
})

router.post('/autologin', async (req, res) =>{

    const decoded = jwt.verify(req.body.token, "thisisnotasecuresecret")
    console.log(decoded)
    try{
        const user = await User.findOne({_id: decoded._id, 'tokens.token': req.body.token})
        res.send(user)
    }catch(e){
        res.status(400).send()
    }
})


router.post('/logout', async (req, res)=>{
    const decoded = jwt.verify(req.body.token, "thisisnotasecuresecret")
    let user = await User.findById(decoded._id)
    let userTokens = user.tokens 
    userTokens = userTokens.filter(token =>{
        return token.token !== req.body.token 
    })
    user.tokens = userTokens
    await user.save()
    res.send(user)
})


router.post('/portfolio', async (req, res)=>{

    let data = await req.body

    

    let user = await User.findById(data.user._id)

    const portfolio = new Portfolio({
        ticker: data.stock,
        user: data.user._id
    })
    
    await portfolio.save()

    user.stocks = user.stocks.concat(portfolio)

    await user.save()

    let test = await user.populate('stocks')
    console.log(test)
    
    res.send(portfolio)
})

router.get('/portfolio', async (req, res)=>{
    let _id = await req.query._id
    console.log(_id)

    
    let user = await User.findById(_id).populate({
        path: 'stocks',
        model: 'Portfolio'
    })
    res.send(user.stocks)
})


router.delete('/delete', async (req, res)=>{

    let data = await req.body
    let user = await User.findById({_id: req.body.user._id})
    let found = await Portfolio.findOneAndDelete({ticker: req.body.stocks, user: req.body.user._id})

    let stocks = user.stocks.filter(stock =>{
        let help = new mongoose.Types.ObjectId(stock)
        return  !found._id.equals(help)
    })


    user.stocks = stocks 
    await user.save()
    res.send('hi')
})
















module.exports = router
