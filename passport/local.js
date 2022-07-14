const passport = require('passport');
const {Strategy} = require('passport-local')
const usuarioSchema = require('../models/usuarios.js');

const localStrategy = Strategy;

passport.use('registro', new localStrategy({
    usernameField: 'userName',
    passwordField: 'passWord',
    passReqToCallback: true
    }, async (req, userName, passWord, done) => {
    const usuarioDB = await usuarioSchema.findOne({userName})
    if (usuarioDB){
        return done(null,false)
    }
    const newUsuario = new usuarioSchema()
    newUsuario.nombre = userName;
    newUsuario.contraseña = passWord;
    await newUsuario.save()
    return done(null, newUsuario)
}));

passport.use('login', new localStrategy({
    usernameField: 'userName',
    passwordField: 'passWord',
    passReqToCallback: true
    }, async (req, userName, passWord, done) => {
    const usuarioDB = await usuarioSchema.findOne({userName})
    if (!usuarioDB){
        return done(null,false)
    }
    return done(null, usuarioDB)
}));

passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
    const usuario = await usuarioSchema.findById(id);
    done(null, usuario);
});

