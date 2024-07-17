import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import authSchema from '../models/auth.js';

passport.use(new LocalStrategy({
    usernameField: 'email', // Campo de nombre de usuario
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await authSchema.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

export default passport;