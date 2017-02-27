module.exports = function(express, app, passport){
  var router=express.Router();
  router.get('/',function(req, res, next){
    res.render('index',{title:'Chat App by David Morais'})
  })

  function securePages(req, res, next){
    if(req.isAuthenticated()){
      next();
    }
    else{
      res.redirect('/');
    }
  }
router.get('/auth/facebook',passport.authenticate('facebook'));
router.get ('/auth/facebook/callback', passport.authenticate('facebook',{
  successRedirect: '/chatrooms',
  failureRedirect: '/'
}))

  router.get('/chatrooms', securePages, function(req, res, next){
    res.render('chatrooms',{title:'Chatrooms', user:req.user})
  })

  app.use('/', router);
}
