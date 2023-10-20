import express, { Request, Response, Application } from 'express';
import bodyParser from 'body-parser';

const app:Application=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
import db from './models';
import{books}from "./seeders/books_seed"

const createBooks=()=>{
    books.map(book=>{
        db.book.create(book);
    })
}
//createBooks();
db.sequelize.sync().then(()=>{
    console.log("Table synced successfully");
    }).catch(()=>{
    console.log("Error syncing the table !");
    });

    app.get('/',(req:Request,res:Response)=>{
        res.send("hello,,,,");
    });
    require("./routes/book.routes")(app);
    app.listen(3000,()=>{
        console.log('connected on port 3000!');
    })


