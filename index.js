const express = require('express');
const { connection } = require('./config/connection');
const { UserModel } = require('./model/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { authenticator } = require('./middleware/authenticator');
const { role_auth } = require('./middleware/roleauth');
const { userRoter } = require('./routes/authorizationroutes');
const cors = require('cors') 
const app = express();

app.use(cors())



app.use(express.json());
app.get('/',(req,res)=>{
    res.send({msg:'okk'})
})

app.use('/',userRoter)


app.get('/goldrate',authenticator,role_auth(["customer","manager"]),(req,res)=>{
    res.send({msg:'user has acccess to see goldratess..'})
})

app.get('/userstats',authenticator,role_auth(["manager"]),(req,res)=>{
    res.send({msg:'user has acccess to see userstats..'})
})


app.listen(5000,async()=>{
 try {
    await connection;
    console.log('server is runing on 5000')
 } catch (error) {
    console.log(error,'error in server')
 }
})