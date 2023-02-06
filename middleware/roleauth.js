
const role_auth = (check_role)=>{
    
    return (req,res,next)=>{
        let userrole = req.body.userrole;
        console.log(userrole,'i am from role_auth..')
        if(check_role.includes(userrole)){
            next();
        }else{
            res.send({msg:'You have not access of this route...only manager can access..'})
            console.log('Unauthorized...access..')
        }
    }
}

     module.exports = {role_auth}