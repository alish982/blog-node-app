const express = require('express')
const app = express()
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/user')
const PostModel = require('./models/Post')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const salt = 10;
const secret = 'adf44afafcfarefgadfvfa'
const cookeParser = require('cookie-parser')
const multer = require('multer')
const uploadFile = multer({ dest: 'uploads/'})
const fs = require('fs')
const Post = require('../client/blog-app/src/data/post')



app.use(cors({ credentials:true, origin: 'http://localhost:3000'}));
app.use(express.json())
app.use(cookeParser())

app.get('/', (req, res) => {

    res.status(200).json({ 'name': 'alish'})

})

app.post('/register', async (req, res) => {
  
    const { username, password } = req.body;

    try{

    const userDoc = await User.create({ username, password:bcrypt.hashSync(password, salt) });
    res.status(200).json(userDoc) 
        
    } catch (error) {
        console.log('Error occureed', error)
        res.status(501).json({ message: error.message})
    }

})

app.post('/login', async (req, res) => {
    try{
        const { username, password } = req.body;

        const userDoc = await User.findOne({ username })
        const test = bcrypt.compareSync(password, userDoc.password)

        if(test) {
            jwt.sign({username, id:userDoc._id}, secret, {}, (err, token) => {
                if (err) throw err; 
                res.cookie('token', token).json({
                    id:userDoc._id,
                    username: username
                })
            })
        } else {
            res.status(404).json("wrong credential")
        }
    }catch(error){
        res.status(404).json({ message: error.message})
    }
})

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if(err) throw err;
        res.json(info)
    })
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok')
})

app.post('/create', uploadFile.single('file'), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.')
    const ext = parts[parts.length - 1 ]
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath)
   
    const { title, description, author, date} = req.body;

    const postDoc = await Post.create({
        title, 
        description, 
        author, 
        date,
        cover: newPath
    })
    res.json(postDoc)

})

app.get('/post', async (req, res) => {
    res.json(await Post.find())
})
 
app.listen(4000, ()=> {
    console.log('server is running on port 4000')
})

 mongoose.connect('mongodb+srv://alishacharya1217:ERIIb1klC5LbRpF2@cluster0.wbf8q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('db connected'))
.catch(() => console.log('failed to connect to db'))

//ERIIb1klC5LbRpF2 mongo password
//mongodb+srv://alishacharya1217:ERIIb1klC5LbRpF2@cluster0.wbf8q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0