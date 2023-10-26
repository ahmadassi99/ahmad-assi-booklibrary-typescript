import { body } from "express-validator";
import passport from "passport";

module.exports=(app: any)=>{
    const user_controller=require("../controller/user.controller");
    const router=require('express').Router();
    var validationSchemaForSignup=[
        body('first_name').exists().withMessage("first_name is required").isString().withMessage("first_name should be a string"),
        body('last_name').exists().withMessage("last_name is required").isString().withMessage("last_name should be a string"),
        body('email').exists().withMessage("email is required").isString().withMessage("email"),
        body('password').exists().withMessage("password is required").isString().withMessage("password should be a stirng")
    ]
    
    router.post("/signup",validationSchemaForSignup,user_controller.signup);
    router.post("/login",user_controller.login);
    passport.initialize();
    require('../passport');
    router.get("/protected",passport.authenticate('jwt',{session:false}), user_controller.auth);
    app.use('/api/user',router);
}