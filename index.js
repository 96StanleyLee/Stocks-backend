const express = require('express')
require('./db/db')
const cors = require('cors')
const userRouter = require('./routers/UserRouter')


const app = express()
const port = process.env.PORT || 4000
app.use(cors())
app.use(express.json())
app.use(userRouter)









app.listen(port, ()=>{
    console.log('Server is up on port ' + port)
})

