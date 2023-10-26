"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../models"));
const express_validator_1 = require("express-validator");
const Book = models_1.default.book;
const rent_module = models_1.default.rent_book;
const User = models_1.default.user;
exports.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array().map(error => {
                return error.msg;
            }) });
    }
    //check uniqueness of isbn
    var isbn = req.body.isbn;
    const X = yield Book.findOne({ where: { isbn: isbn } });
    if (X !== null) {
        return res.send({ message: "this isbn is already used, try another one" });
    }
    const book = {
        name: req.body.name,
        author: req.body.author,
        isbn: req.body.isbn,
        description: req.body.description
    };
    Book.create(book).then((data) => {
        res.send(data);
    })
        .catch((err) => {
        res.status(500).send({
            message: err.message || "some error happend while creating book"
        });
    });
});
exports.findAll = (req, res) => {
    Book.findAll()
        .then((data) => {
        if (data.length !== 0)
            return res.send(data);
        else
            return res.send("books libary is current empty!, you can add to it.");
    })
        .catch((err) => {
        res.status(500).send({
            message: err.message || "error while retriving books"
        });
    });
};
exports.findBook = (req, res) => {
    let bookid = req.params.id;
    Book.findByPk(bookid).then((data) => {
        if (data !== null) {
            return res.send(data);
        }
        else {
            return res.send(`There is no book with id=${bookid}`);
        }
    })
        .catch((err) => {
        res.status(500).send({
            message: err.message || "error while retriving books"
        });
    });
};
exports.update = (req, res) => {
    let id = req.params.id;
    Book.update(req.body, {
        where: { id: id }
    })
        .then((num) => {
        if (num == 1) {
            res.send({ message: "book updated!" });
        }
        else {
            res.send({ message: `cann't update book with id ${id}` });
        }
    })
        .catch((err) => {
        res.status(500).send({ message: "Error during updating" });
    });
};
exports.delete = (req, res) => {
    let id = req.params.id;
    Book.destroy({ where: { id: id } })
        .then((num) => {
        if (num == 1) {
            res.send({ message: `book with id=${id} has been deleted!` });
        }
        else {
            res.send({ message: `cann't delete book with id= ${id}.` });
        }
    })
        .catch((err) => {
        res.status(500).send({ message: "error happend during deleting" });
    });
};
exports.invalid = (req, res) => {
    res.status(404).send("invalid endpoint");
};
exports.rent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const book_id = req.params.id;
    const user_id = req.user;
    const renter_book = {
        bookId: book_id,
        userId: user_id
    };
    //check if book is rented already
    const selected_book = yield Book.findOne({ where: { id: book_id } });
    if (!selected_book) {
        return res.send({ message: `there is no book with: ${book_id} id` });
    }
    if (selected_book.onLoan == true) {
        return res.send({ message: "This book is already Loaned,Try later!" });
    }
    let { bookId, userId } = renter_book;
    rent_module.create({ bookId, userId }).then((data) => {
        res.send({ message: "you have rented the book Successfully,Enjoy it:)", data });
    })
        .catch((err) => {
        res.status(500).send({
            message: "there is an error while renting a book"
        });
    });
    selected_book.update({ onLoan: true });
});
exports.returnBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const book_id = req.params.id;
    const user_id = req.user;
    const renter_book = {
        bookId: book_id,
        userId: user_id
    };
    let { bookId, userId } = renter_book;
    //check if book is already available
    const selected_book = yield Book.findOne({ where: { id: book_id } });
    if (selected_book.onLoan == false) {
        return res.send({ message: "This book was not rented!" });
    }
    //check if the book is rented to another user
    else {
        var rentCheck = yield rent_module.findOne({ where: {
                userId: userId,
                bookId: bookId,
            } });
    }
    ;
    if (!rentCheck) {
        return res.status(500).send({
            message: "you are not allowed to return a book that is not rented to you!"
        });
    }
    else {
        selected_book.update({ onLoan: false });
        rentCheck.destroy();
    }
});
