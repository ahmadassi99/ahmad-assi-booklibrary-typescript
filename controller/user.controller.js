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
const bcrypt_1 = require("bcrypt");
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const book_module = models_1.default.book;
const rent_module = models_1.default.rent_book;
const User_model = models_1.default.user;
exports.signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array().map(error => {
                return error.msg;
            }) });
    }
    var email = req.body.email;
    const existing_email = yield User_model.findOne({ where: { email: email } });
    if (existing_email !== null) {
        return res.send({ message: "this email is already used, try another one" });
    }
    const user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: (0, bcrypt_1.hashSync)(req.body.password, 10)
    };
    User_model.create(user).then((data) => {
        res.send(data);
    })
        .catch((err) => {
        res.status(500).send({ message: "some error happend while creating user" });
    });
});
exports.login = (req, res) => {
    User_model.findOne({ where: { email: req.body.email } }).then((valid_user) => {
        if (valid_user === null) {
            return res.status(401).send({ message: "there is no user with this Email" });
        }
        if (!(0, bcrypt_1.compareSync)(req.body.password, valid_user.password)) {
            return res.status(401).send({ message: "Wrong Password!" });
        }
        const payload = {
            email: valid_user.email,
            id: valid_user.id
        };
        const token = jsonwebtoken_1.default.sign(payload, "RandomString", { expiresIn: "1d" });
        return res.status(200).send({
            messgae: "logged in successfully",
            token: "Bearer " + token
        });
    });
};
exports.auth = (req, res) => {
    return res.status(200).send({
        user_id: req.user
    });
};
