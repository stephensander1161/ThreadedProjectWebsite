// Coded by Chi. Login Test.

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize (passport, getUserByEmail) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email);

        if(user == null) {
            return done(err, false, {message: 'No user with that email' });
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password'});
            }
        } catch (error){
            return done(error);
        };
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, 
    authenticateUser));

    passport.serializeUser((user, done) => done(null, user.email));
    passport.deserializeUser((user, done) => {
        done(null, user.email);
    });
}

module.exports = initialize;