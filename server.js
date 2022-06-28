require('dotenv').config();
const express = require('express')

const app = express()
const cors = require('cors')
const connect = require('./connection')
// const userRoutes = require('./routes/users')
// const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
const userRoutes = require('./routes/userRoute')
const orderRoutes = require('./routes/orderRoute')
const cookieParser = require('cookie-parser')


connect()


///middlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())


//routes

//Login-Signup
// app.use('/api/users', userRoutes)
// app.use('/api/auth', authRoutes)
//Products
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/order', orderRoutes)




const port = process.env.PORT || 8080;
app.listen(port, () => {console.log(`Listening to port ${port}...`)})

