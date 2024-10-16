require('dotenv').config()
const express = require('express');
require('express-async-errors')
const app = express()
// connectDB
const connectDB = require('./DB/connection')
const authenticateUser = require('./middleware/authentication')

// routes
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

// middleware
app.use(express.json());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`server is Listening at port no ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}


start();