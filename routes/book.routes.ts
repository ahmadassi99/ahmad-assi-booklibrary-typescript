import {body} from 'express-validator'
import passport from 'passport';
module.exports=(app: any)=>{
    
    const books=require("../controller/book.controller");
    var router= require('express').Router();
    passport.initialize();
    require('../passport');

    var validationSchemaForBooks=[
        body('name').exists().withMessage("name is Required").isString().withMessage("name should be String"),
        body('author').exists().withMessage("author is Required").isString().withMessage("author should be String"),
        body('isbn').exists().withMessage("isbn is Required").isString().withMessage("isbn should be string"),
        body('description','Invalid isbn').exists().withMessage("description is Requierd").isString().withMessage("description should be String")
       

    ]
    //create new book
    router.post("/",validationSchemaForBooks,books.create);
    //get All books
    router.get("/",books.findAll);
    //get book By Id
    router.get("/:id",books.findBook);
    //Update book By Id
    router.put("/:id",books.update);
    //Delete book By Id
    router.delete("/:id",books.delete);
    //rent book Api
    router.post("/rent/:id",passport.authenticate('jwt',{session:false}),books.rent);
    //return book Api
    router.post("/return/:id",passport.authenticate('jwt',{session:false}),books.returnBook);
    //the basic route
    app.use('/api/books',router);
    
    // //for the invalid routes
    // // i have commit here to let the user api work ,,
    // //app.get('*',books.invalid);
    // //app.post('*',books.invalid);
    // app.put('*',books.invalid);
    // app.delete('*',books.invalid);
}