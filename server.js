import express from "express";
import {Server} from'socket.io';
import http from 'http';
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
import './passport/local.js'
import './database/database.js'
import isAuth from './utils/isAuth.js';

import options from './configDB.js';
import contenedorProd from'./contenedorProd.js';
const content = new contenedorProd(options.mariaDB,'productos');

import contMsj from './newChatCont.js';
import esqMsj from './dao/msjShema.js';
const chat = new contMsj('mensajes', esqMsj);
import ProdMock from './mocks/prodMock.js';

import MongoStore from "connect-mongo";
import passport from "passport";
import session from "express-session";
import usuario from './routes/usuario.js';


app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('views','./views');
app.set('view engine', 'ejs');

app.use(
    session({
        secret:'key',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl:'mongodb+srv://gauna_mario:D8GuMWgPoTICAKPv@cluster0.1vxmmjy.mongodb.net/desafio13session?retryWrites=true&w=majority'}),
        cookie:{maxAge:60000},
        })
)
app.use(passport.initialize());
app.use(passport.session());
app.use('/',usuario);

app.get('/productos',isAuth,async(req,res)=>{
    let products = await content.getAll();
    res.render('index.ejs',{persona:req.user.username,products})
})

app.post('/productos',async(req,res)=>{
    res.redirect('/productos')
})

app.get('/api/productos-test',async(req,res)=>{
    let persona = req.session.user;
    const pMocker = new ProdMock(5);
    const productos = pMocker.randomProducts();
    res.render('test.ejs',{productos,persona:req.user.username}) 
})

io.on('connection',async(socket)=>{
    console.log('Cliente conectado',socket.id);
    
    const mensajes = await chat.getAll();
    socket.emit('messages', mensajes)

    socket.on('newMessage', async(message)=>{
        await chat.save(message);
        const mensajes = await chat.getAll();
        io.sockets.emit('newMessages', mensajes)
    })
    socket.on('product', async(data)=>{
        await content.save(data);
        const products = await content.getAll();
        io.sockets.emit('newProduct', products)
    })
})

const PORT=8080;
httpServer.listen(PORT,()=>{
    console.log(`Servidor escuchando puerto ${PORT}`);
});

