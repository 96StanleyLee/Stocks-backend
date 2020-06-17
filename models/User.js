const mongoose = require('mongoose')
const validate = require('validator')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema
const jwt = require('jsonwebtoken')


const userSchema = new Schema ({
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validate.isEmail(value)){
                throw new Error('Email must be valid!')
            }
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 6,
        trim: true,
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    stocks:[{type: Schema.Types.ObjectId, ref: 'Portfolio'}]
})

userSchema.statics.authenticatePassword = async (email , password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to login')
    }
    const validate = await bcrypt.compare(password, user.password)
    if(!validate){
        throw new Error('Bad')
    }
    return user
}

userSchema.methods.accessToken = async function(){
    const user = this 
    const token = await jwt.sign({_id:user.id.toString()}, 'thisisnotasecuresecret', {expiresIn: '7 days'})
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token


}

userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})





const User = mongoose.model('User', userSchema)

module.exports = User