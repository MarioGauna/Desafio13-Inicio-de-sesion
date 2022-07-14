import passport from 'passport';
import {Strategy} from 'passport-local';
import usuarioSchema from '../models/usuarios.js';

const localStrategy = Strategy;

passport.use('registro', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
    }, async (req, username, password, done) => {
    const usuarioDB = await usuarioSchema.findOne({username})
    if (usuarioDB){
        return done(null,false)
    }
    const newUsuario = new usuarioSchema();
    newUsuario.username = username;
    newUsuario.contraseña = newUsuario.encrypt(password);
    await newUsuario.save();
    return done(null, newUsuario);
}));

passport.use('login', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
    }, async (req, username, password, done) => {
    const usuarioDB = await usuarioSchema.findOne({username})
    const pass = usuarioDB.contraseña;
    const match = usuarioDB.comparar(password,pass)
    if (usuarioDB && match){
        return done(null, usuarioDB)
    }else{
        return done(null,false)
    }
}));

passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
    const usuario = await usuarioSchema.findById(id);
    done(null, usuario);
});