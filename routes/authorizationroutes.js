

const express = require('express');
const { authenticator } = require('../middleware/authenticator');
const { UserModel } = require('../model/usermodel');
const mongoose = require('mongoose')
const userRoter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');


userRoter.post('/signup',async(req,res)=>{
    console.log(req.body)
    const {name,email,password,role} = req.body;
    try {
        bcrypt.hash(password, 5, async function(err, hash_pass) {
            // Store hash in your password DB.
            if(err){
                res.send({msg:'error in signup'})
                console.log(err);
            }else{
                const user = new UserModel({name,email,password:hash_pass,role});
                await user.save();
                res.send({msg:'user signup successfully',user});
            }
        });
    } catch (error) {
        res.send({msg:'errror in sighnup'})
        console.log(error,'erorr in signup..')
    }
})

userRoter.post('/login',async(req,res)=>{
    const {email,password} =req.body;
    let find = await UserModel.findOne({email});
    try {
        if(find){
            let userpassword = find.password;
            bcrypt.compare(password, userpassword, function(err, result) {
                // result == true
                if(err){
                    res.send({msg:'errror in login...'})
                    console.log('error in user login passcompare')
                }else{
                    const token = jwt.sign({ userID: find._id , role:find.role }, 'normal',{expiresIn:'1m'});
                    const refresh_token = jwt.sign({ userID: find._id , role:find.role }, 'refresh',{expiresIn:'5m'});
                    res.send({msg:'user has been logged in ',token,refresh_token});
                }
            });
        }
    } catch (error) {
     res.send({msg:'errror in user login..'})   
     console.log('error in user login..',error)
    }
})

userRoter.get('/logout',(req,res)=>{
    const token = req.headers.authorization;

    const blacklisteddata = JSON.parse(fs.readFileSync('./blacklist.json','utf-8'))
    blacklisteddata.push(token);

    const againread = fs.writeFileSync('./blacklist.json',JSON.stringify(blacklisteddata))
    res.send({msg:'this userr with token logout',token});
})

userRoter.get('/refreshtoken',(req,res)=>{
      const refresh_token = req.headers.authorization;
      
      if(!refresh_token){
        res.send({msg:'login again..'})
      }

      jwt.verify(refresh_token, 'refresh', function(err, decoded) {
      
         if(err){
            res.send({msg:'error in deccoding..'})
            console.log(err);
         }else{
            const refreshtoken = jwt.sign({ userID: decoded.userID , role:decoded.role }, 'normal',{expiresIn:'5m'});
            console.log(decoded.userID,decoded.role)
            res.send({msg:'this is your refersh token...',refreshtoken})
         }
      });
})


module.exports ={
    userRoter
}