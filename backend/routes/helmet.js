const router = require('express').Router();
let Authentication = require('../Authentication.js')
const redis = require('redis')
const util = require('util')
const redisUrl = 'redis://127.0.0.1:6379'
const client = redis.createClient(redisUrl)
client.get = util.promisify(client.get)

//IMPORTED MODELS
let Helmet = require('../models/helmet.model');
let User = require('../models/user.model');

//SHOW ALL HELMETS
router.get('/helmets',async(req,res) => {
    
    try { 
        //ROUTE QUERY
        if(req.query.priceSortDescending == 'true'){
            req.query.priceSortDescending = {helmetPrice:-1}
        } else if(req.query.priceSortDescending == 'false'
         || req.query.priceSortDescending == undefined ) {
            req.query.priceSortDescending = {helmetPrice:1}}
        const Helmets = await Helmet.find()
        .where('helmetPrice').gte(req.query.priceGreaterThan).lte(req.query.priceLowerThan)
        .where('helmetName', new RegExp(req.query.filter,"i"))
        .select('_id helmetPhotos helmetName helmetPrice')
        .skip(parseInt(req.query.skip))
        .limit(parseInt(req.query.limit))
        .sort(req.query.priceSortDescending)  

        //CACHING THE ROUTE
        const key = JSON.stringify(req.query)
        const cachedHelmets = await client.get(key)

        if(cachedHelmets) { 
            const currentDataLength = JSON.parse(cachedHelmets).length
            const incomingDataLegth = Helmets.length
            if(currentDataLength != incomingDataLegth){return client.flushall()}
            return res.send(JSON.parse(cachedHelmets)) 
        } 
        client.set(key,JSON.stringify(Helmets),'EX',30)
        res.send(Helmets)
    } catch(err) {throw new Error(err)}   
})

//SHOW ONE HELMET
router.get('/helmet/:id',async(req,res) => {
    try {
        const OneHelmet = await Helmet.findById(req.params.id)
        .populate('helmetComments.commentedBy','username userPhoto')

        const key = JSON.stringify(req.originalUrl)
        const cachedHelmet = await client.get(key)

        if(cachedHelmet) { 
            return res.send(JSON.parse(cachedHelmet))
        } 
        client.set(key,JSON.stringify(OneHelmet),'EX',10)
        res.send(OneHelmet)
    } catch(err) {throw new Error('Product do not exist!')}
})

//ADD NEW HELMET
router.post('/addHelmet',Authentication,async(req,res) => {
    try {
        if(!req.user.admin) throw new Error('You are not authenticated !')
        const newHelmet = new Helmet(req.body)
        newHelmet.save()
        res.send(newHelmet)
    } catch(err) {throw new Error('Product do not exist!')}
})

//DELETE HELMET
router.delete('/helmet/:id',Authentication,async(req,res) => {
    try {
        if(!req.user.admin) throw new Error('You are not authenticated !')
        const deletedHelmet = await Helmet.findByIdAndDelete(req.params.id)
        res.send(deletedHelmet)
    } catch(err) {throw new Error('Product do not exist!')}
})

//UPDATE HELMET
router.patch('/helmet/:id',Authentication,async(req,res) => {
    try {
        if(!req.user.admin) throw new Error('You are not authenticated !')
        const updatedHelmet = await Helmet.findByIdAndUpdate(req.params.id,req.body)
        res.send(updatedHelmet)
    } catch(err) {throw new Error('Product do not exist!')}
})

//COMMENTS ROUTES
router.post('/addComment/:id',Authentication,async(req,res) => {
  try {
    const newComment = [{
        commentText:req.body.commentText,
        commentedBy:req.user.id
    }]
    const helmet = await Helmet.findById(req.params.id)
    helmet.helmetComments = await helmet.helmetComments.concat(newComment)
    await  helmet.save()
    res.send(helmet)
  } catch(err) {throw new Error(err)}     
})

//DELETE COMMENT
router.post('/deleteComment/:id/comment/:comment',Authentication,async(req,res) => {
    try {
        const thisHelmet = await Helmet.findById(req.params.id)
        const thisComment = thisHelmet.helmetComments.find((item) => {return item._id == req.params.comment})
        if(req.user.id == thisComment.commentedBy._id){
            thisHelmet.helmetComments = thisHelmet.helmetComments.filter((item) => {
                return item._id != req.params.comment
            })
            thisHelmet.save()
            res.send(thisHelmet)
        } else {
            res.status(400).send('Nie możesz usunąć tego komentarza!')
            throw new Error('You can not delete this comment!')}
    } catch (err) {throw new Error(err)}
  })

//MYPROFILE ROUTER
router.get('/myProfile',Authentication,async(req,res) => {

    const cachedUsers = await client.get(req.user.id)
    if(cachedUsers) {return res.send(JSON.parse(cachedUsers))} 
    const user = await User.findById(req.user.id)
    client.set(req.user.id,JSON.stringify(user),'EX',5)
    try {
        res.send(user)
    } catch(err) {throw new Error('Product do not exist!')}
})

//REGISTER USER
router.post('/register',async(req,res) => {
    try {
        const newUser = new User(req.body)
        newUser.save()
        res.send(newUser)
    } catch(err) {throw new Error('Product do not exist!')}
})

//LOGIN USER
router.post('/login',async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
          } catch (e) {res.status(400).send('No acces! '+e)}
});


//LOGOUT USER
router.post('/logout',Authentication,async (req, res) => {
    req.user.tokens = []
    res.clearCookie('loggedIn', { path: '/Moto' })
    req.user.save()
    res.send("Log out")
});

module.exports = router;