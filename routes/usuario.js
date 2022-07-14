import {Router} from 'express';
import passport from 'passport'
const router = Router();

router.get('/', async(req, res) => {
    res.render('login.ejs', {status: req.session.login})
})

router.post('/login', passport.authenticate('login',{
    failureRedirect:'/errorLogin',
    successRedirect:'/api/productos-test',
}))

router.post('/registro',passport.authenticate('registro',{
    failureRedirect:'/errorRegistro',
    successRedirect:'/api/productos-test',
}))

router.get('/errorRegistro', async(req, res) => {
    res.render('errorRegistro.ejs')
})

router.get('/errorLogin', async(req, res) => {
    res.render('errorLogin.ejs')
})

router.get("/logout", (req, res) => {
	req.session.destroy( (error) => {
        if (error) {
            res.json(error);
        } else {
            res.render('logout.ejs',{status: false,usuario:req.user.username});
        }
    })
});

export default router;