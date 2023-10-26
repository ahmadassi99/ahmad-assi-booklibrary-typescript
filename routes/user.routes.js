"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const passport_1 = __importDefault(require("passport"));
module.exports = (app) => {
    const user_controller = require("../controller/user.controller");
    const router = require('express').Router();
    var validationSchemaForSignup = [
        (0, express_validator_1.body)('first_name').exists().withMessage("first_name is required").isString().withMessage("first_name should be a string"),
        (0, express_validator_1.body)('last_name').exists().withMessage("last_name is required").isString().withMessage("last_name should be a string"),
        (0, express_validator_1.body)('email').exists().withMessage("email is required").isString().withMessage("email"),
        (0, express_validator_1.body)('password').exists().withMessage("password is required").isString().withMessage("password should be a stirng")
    ];
    router.post("/signup", validationSchemaForSignup, user_controller.signup);
    router.post("/login", user_controller.login);
    passport_1.default.initialize();
    require('../passport');
    router.get("/protected", passport_1.default.authenticate('jwt', { session: false }), user_controller.auth);
    app.use('/api/user', router);
};
