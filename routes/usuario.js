const {Router} = require('express');
const router = Router();
const passport = require('passport');

router.get('/', async(req, res) => {
    res.render('login.ejs', {status: req.session.login})
})

router.post('/login', passport.authenticate('login',{
    failureRedirect:'/errorLogin',
    successRedirect:'/productos',
}))

router.post('/registro',passport.authenticate('registro',{
    failureRedirect:'/errorRegistro',
    successRedirect:'/productos',
}))

router.get('/errorRegistro', async(req, res) => {
    res.render('errorRegistro.ejs')
})

router.get('/errorLogin', async(req, res) => {
    res.render('errorLogin.ejs')
})

router.get("/logout", (req, res) => {
    let usuario = req.session.user;
	req.session.destroy( (error) => {
        if (error) {
            res.json(error);
        } else {
            res.render('logout.ejs',{status: false,usuario});
        }
    })
});

module.exports = router;