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
exports.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array().map(error => {
                return error.msg;
            }) });
    }
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
    Book.findAll().then((data) => {
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
