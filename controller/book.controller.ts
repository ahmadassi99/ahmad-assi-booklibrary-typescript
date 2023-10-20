import { where } from 'sequelize';
import db from'../models';
import express, { Request, Response, Application } from 'express';
import {body,validationResult} from 'express-validator';

const Book=db.book;


exports.create=async (req:Request,res:Response)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array().map(error=>{
            return error.msg
        })});
    }
    var isbn=req.body.isbn;
    const X= await Book.findOne({where:{isbn:isbn}});
    if(X!==null){
        return res.send({message:"this isbn is already used, try another one"});
    }
const book={
    name: req.body.name,
    author:req.body.author,
    isbn:req.body.isbn,
    description:req.body.description
}
Book.create(book).then((data: any)=>{
    res.send(data);
})
.catch((err: { message: string; })=>{
    res.status(500).send({
        message:err.message ||"some error happend while creating book"
    })
})
};
exports.findAll=(req:Request,res:Response)=>{
    Book.findAll().then((data:any)=>{
       if(data.length!==0) return res.send(data);
       else return res.send("books libary is current empty!, you can add to it.");
    })
    .catch((err: { message: string; })=>{
        res.status(500).send({
          message:err.message ||"error while retriving books"
        })
    })
};
exports.findBook=(req:Request,res:Response)=>{
    let bookid=req.params.id;
    Book.findByPk(bookid).then((data:any)=>{
        if(data!==null){
           return res.send(data);
        }
        else{
            return res.send(`There is no book with id=${bookid}`);
        }
        
    })
    .catch((err: { message: string; })=>{
        res.status(500).send({
          message:err.message ||"error while retriving books"
        })
    })
};
exports.update=(req:Request,res:Response)=>{
    let id=req.params.id;
    Book.update(req.body,{
        where: {id:id}
    })
    .then((num:any)=>{
     if(num==1){
        res.send({message:"book updated!"});
     }
     else{
        res.send({message:`cann't update book with id ${id}`});
     }
    })
    .catch((err: any)=>{
        res.status(500).send({message:"Error during updating"});
    })

}

exports.delete=(req:Request,res:Response)=>{
    let id=req.params.id;
    Book.destroy({where:{id:id}})
    .then((num:any)=>{
        if(num==1){
            res.send({message:`book with id=${id} has been deleted!`});
        }
        else{
            res.send({message:`cann't delete book with id= ${id}.`});
        }
    })
    .catch((err: any)=>{
        res.status(500).send({message:"error happend during deleting"});
    })
}
exports.invalid=(req:Request,res:Response)=>{
    res.status(404).send("invalid endpoint");
}



