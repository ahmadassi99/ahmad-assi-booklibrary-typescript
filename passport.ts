import passport from "passport";
import db from'./models';
const User_model=db.user;

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts:any = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'RandomString';

passport.use(new JwtStrategy(opts, function(jwt_payload:any, done:any) {
    User_model.findOne({where:{id: jwt_payload.id}}).then((user: any)=> {
        // if (err) {
        //     return done(err, false);
        // }
        if (user) {
            return done(null, user.id);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));