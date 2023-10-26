"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const models_1 = __importDefault(require("./models"));
const User_model = models_1.default.user;
var JwtStrategy = require('passport-jwt').Strategy, ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'RandomString';
passport_1.default.use(new JwtStrategy(opts, function (jwt_payload, done) {
    User_model.findOne({ where: { id: jwt_payload.id } }).then((user) => {
        // if (err) {
        //     return done(err, false);
        // }
        if (user) {
            return done(null, user.id);
        }
        else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));
