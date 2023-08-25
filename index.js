const express = require("express");
const mongoose=require("mongoose");
const UserModel=require("./models/User")
const DataModel=require("./models/DataModel")
const jwt = require('jsonwebtoken');
const cors=require("cors");
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const dotenv=require("dotenv");

const app=express();
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({origin: true,credentials: true,}));
app.use(express.json({limit: "50mb",extended:true}))
app.use(express.urlencoded({limit: "50mb",extended:true}))

try{
  mongoose.connect(process.env.DB_URL,{useNewUrlParser:true
}).then(()=>{console.log("Database connection is established")});}
catch(err){
console.log(err,"Mongo Db not connected")}




app.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const userCheck=await UserModel.findOne({username:username})
  if(userCheck){
    console.log("User Already Exists");
  return res.status(200).json("User Already exists");
  }
  const user = new UserModel({ username,email, password: hashedPassword });
  await user.save();
  console.log("User created successfully")
  res.json('User created successfully');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username:username });
  console.log(user)
  if (!user) {
    return res.json('Invalid username');
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.json('Invalid password');
  }
  // const token = jwt.sign({ userId: user._id }, 'secret-key', { expiresIn: '1h' });
  res.json({ status:"1",user:username});
});

app.post('/createData', async (req, res) => {
  const { userData } = req.body;
  console.log("UserData",userData)
  const result = await DataModel.updateOne({username: userData.username}, { $set:userData }, { upsert: true })
  .then(() => {
    res.send('UserData upserted successfully');
  })
  .catch(error => {
    console.error('Error creating user', error);
    res.status(500).send('Internal server error');
  });

});

app.post('/getData', async (req,res)=>{
const { username }=req.body;
const user = await DataModel.findOne({ username:username });
if (!user) {
  return res.json('No username');
}

else{
return res.send(user)
}
})



// Protected route
app.get('/Home', authenticateToken, (req, res) => {
  res.send(req.user);
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }
  jwt.verify(token, 'secret-key', (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

app.get("/",async(req,res)=>{
  res.send("Hello World")
})
PORT = process.env.PORT || 3001;
app.listen(PORT,()=>{
    console.log("Server Running on Port"+PORT);});