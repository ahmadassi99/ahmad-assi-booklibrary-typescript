import db from '../models';
import express,{Request,Response,Application}from 'express';
import{compareSync, hashSync} from 'bcrypt';
import{body,validationResult} from 'express-validator'
import jwt from 'jsonwebtoken';
import passport from 'passport';

const book_module=db.book;
const rent_module=db.rent_book;

const User_model=db.user;
exports.signup=async (req:Request,res:Response)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array().map(error=>{
            return error.msg
        })});
    }
    var email=req.body.email;
    const existing_email= await User_model.findOne({where:{email:email}});
    if(existing_email!==null){
        return res.send({message:"this email is already used, try another one"});
    }
    const user={
        first_name: req.body.first_name,
        last_name:req.body.last_name,
        email:req.body.email,
        password:hashSync(req.body.password,10)
    }
    User_model.create(user).then((data:any)=>{
        res.send(data);
    })
    .catch((err: any)=>{
        res.status(500).send({message:"some error happend while creating user"});
    })
};
exports.login=(req:Request,res:Response)=>{
    User_model.findOne({where:{email:req.body.email}}).then((valid_user: any) =>{
        if(valid_user===null){
             return res.status(401).send({message:"there is no user with this Email"});
        }
        if(!compareSync(req.body.password,valid_user.password)){
           return res.status(401).send({message:"Wrong Password!"});
        }
        const payload={
            email:valid_user.email,
            id:valid_user.id
        }
       const token= jwt.sign(payload,"RandomString",{expiresIn:"1d"});
       return res.status(200).send({
        messgae:"logged in successfully",
        token: "Bearer " + token 
       })

    })
};

exports.auth=(req:Request,res:Response)=> {
    return res.status(200).send({
       user_id:req.user
    });
};
