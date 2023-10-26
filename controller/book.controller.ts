import { where } from 'sequelize';
import db from'../models';
import express, { Request, Response, Application } from 'express';
import {body,validationResult} from 'express-validator';

const Book=db.book;
const rent_module=db.rent_book;
const User=db.user;
exports.create=async (req:Request,res:Response)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array().map(error=>{
            return error.msg
        })});
    }
    //check uniqueness of isbn
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
    Book.findAll()
    .then((data:any)=>{
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
};
exports.rent=async (req:Request,res:Response)=>{
   const book_id=req.params.id;
   const user_id=req.user;
   const renter_book={
    bookId:book_id,
    userId:user_id
   }
   //check if book is rented already
   const selected_book= await Book.findOne({where:{id:book_id}});
   //check if book-id is not available in book list
   if(!selected_book){
     return res.send({message:`there is no book with: ${book_id} id`})
   }
   if(selected_book.onLoan==true){
    return res.send({message:"This book is already Loaned,Try later!"})
   }
   let {bookId,userId}=renter_book;
   rent_module.create({bookId,userId}).then((data:any)=>{
    res.send({message:"you have rented the book Successfully,Enjoy it:)",data});
   })
   .catch((err: any)=>{
    res.status(500).send({
        message:"there is an error while renting a book"
    })
   })
   selected_book.update({onLoan:true});

};
exports.returnBook=async (req:Request,res:Response)=>{
   const book_id=req.params.id;
   const user_id=req.user;
   const renter_book={
    bookId:book_id,
    userId:user_id
   }
   let{bookId,userId}=renter_book;
   //check if book is already available
   const selected_book= await Book.findOne({where:{id:book_id}});
   if(selected_book.onLoan==false){
    return res.send({message:"This book was not rented!"})
   }
   //check if the book is rented to another user
   else{
    var rentCheck=await rent_module.findOne({where:{
        userId:userId,
        bookId:bookId,
    }})
   };
   if(!rentCheck){
    return res.status(500).send({
        message:"you are not allowed to return a book that is not rented to you!"
    })
   }
   else{
    selected_book.update({onLoan:false});
    rentCheck.destroy();
   }
}



