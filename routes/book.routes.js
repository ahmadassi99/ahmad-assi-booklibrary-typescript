"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
module.exports = (app) => {
    const books = require("../controller/book.controller");
    var router = require('express').Router();
    var validationSchemaForBooks = [
        (0, express_validator_1.body)('name').exists().withMessage("name is Required").isString().withMessage("name should be String"),
        (0, express_validator_1.body)('author').exists().withMessage("author is Required").isString().withMessage("author should be String"),
        (0, express_validator_1.body)('isbn').exists().withMessage("isbn is Required").isString().withMessage("isbn should be string"),
        (0, express_validator_1.body)('description', 'Invalid isbn').exists().withMessage("description is Requierd").isString().withMessage("description should be String")
    ];
    //create new book
    router.post("/", validationSchemaForBooks, books.create);
    //get All books
    router.get("/", books.findAll);
    //get book By Id
    router.get("/:id", books.findBook);
    //Update book By Id
    router.put("/:id", books.update);
    //Delete book By Id
    router.delete("/:id", books.delete);
    //the basic route
    app.use('/api/books', router);
    //for the invalid routes
    app.get('*', books.invalid);
    app.post('*', books.invalid);
    app.put('*', books.invalid);
    app.delete('*', books.invalid);
};
