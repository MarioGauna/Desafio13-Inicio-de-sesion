const express = require('express');
const {Server: ioServer} = require('socket.io');
const http = require('http');
const app = express();
const httpServer = http.createServer(app);
const io = new ioServer(httpServer);

const {options} = require('./configDB.js')
const contenedorProd = require('./contenedorProd.js');
const content = new contenedorProd(options.mariaDB,'productos');

const contMsj = require('./newChatCont.js');
const esqMsj = require('./dao/msjShema.js');
const chat = new contMsj('mensajes', esqMsj);
const ProdMock = require('./mocks/prodMock.js');

const MongoStore = require('connect-mongo');
const passport = require('passport');
const session = require('express-session');
const usuario = require('./routes/usuario.js');


app.use(express.static(__dirname +"/public"))
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
            mongoUrl:'mongodb+srv://gauna_mario:D8GuMWgPoTICAKPv@cluster0.1vxmmjy.mongodb.net/desafio13?retryWrites=true&w=majority'}),
            options: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        cookie:{maxAge:60000},
        })
)
app.use(passport.initialize());
app.use(passport.session());
app.use('/',usuario);
const isAuth = require('./utils/isAuth.js')


app.get('/productos',isAuth,async(req,res)=>{
    let products = await content.getAll();
    res.render('index.ejs',{persona:req.user.userName,products})
})

app.post('/productos',async(req,res)=>{
    res.redirect('/productos')
})

app.get('/api/productos-test',async(req,res)=>{
    const pMocker = new ProdMock(5);
    const productos = pMocker.randomProducts();
    res.render('test.ejs',{productos}) 
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

