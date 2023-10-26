import express, { Request, Response, Application, NextFunction } from 'express';
import bodyParser from 'body-parser';

const app:Application=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
import db from './models';
import{books}from "./seeders/books_seed"
import passport from 'passport';
import createError from 'http-errors'

const createBooks=()=>{
    books.map(book=>{
        db.book.create(book);
    })
}
//createBooks();
db.sequelize.sync().then(()=>{
    console.log("Table synced successfully");
    }).catch((err:any)=>{
    console.log(`Error syncing the table !${err}`);
    });
// app.use(passport.initialize());
// require('./passport');
    app.get('/',(req:Request,res:Response)=>{
        res.send("hello,,,,");
    });
    //app.get("/protected",passport.authenticate('jwt',{session:false}))

    require("./routes/book.routes")(app);
    require("./routes/user.routes")(app);
    app.use(function(req, res, next) {
        next(createError(404));
      });
      // error handler
      app.use(function(err:any, req:Request, res:Response, next:NextFunction) {
        res.status(err.status || 500);
        res.send({error:err.message});
      });
    app.listen(3000,()=>{
        console.log('connected on port 3000!');
    })




