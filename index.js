require('dotenv').config()
const express=require("express");
const fs=require("fs");
const app=express();
app.use(express.urlencoded({extended:false})); 
const PORT=8000
const mongoose=require("mongoose");

const users=require("./MOCK_DATA (1).json");
const { type } = require("os");

//Connect

mongoose
    .connect("mongodb://127.0.0.1:27017/app1")
    .then(()=>console.log("Mongodb is connected"))
    .catch((err)=>console.log("Mongo Error ",err));


//Schema

const userSchema=new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
    },
    last_name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    job_title:{
        type:String,
    }
},{timestamps:true});

const User = mongoose.model("user",userSchema);
app.get("/users",(req,res)=>{
    res.setHeader("myName","Backend_Dev");
    return res.json(users);
})

app.get("/api/users", async(req, res) => {
    const alldbusers=await User.find({});
    const html = `
        <ul>
            ${alldbusers.map((user) => `<li>${user.first_name}-${user.email}</li>`).join('')}
        </ul>
    `;
    return res.send(html);
});

app.route("/api/users/:id")
    .get(async(req,res)=>{
        const id=await User.findById(req.params.id);
        
        return res.json(user);
    })
    .patch((req,res)=>{
        const id=Number(req.params.id);
        const user=users.find((user)=>user.id===id);
        const body=req.body;
        const updated_user=body;
        users[id-1]=updated_user;
        fs.writeFile("./MOCK_DATA (1).json",JSON.stringify(users),(err,data)=>{
            return res.json({status: "Done"});
        });
    })
    .delete((req,res)=>{{
        const id=Number(req.params.id);
        const user=users.find((user)=>user.id===id);
        users[id-1]=null;
        fs.writeFile("./MOCK_DATA (1).json",JSON.stringify(users),(err,data)=>{
            return res.json({status: "Done"});
        });
    }});

app.post("/api/users",async(req,res)=>{
    const body=req.body;
    if(
        !body||
        !body.first_name||
        !body.last_name||
        !body.email||
        !body.job_title
    ){
        return res.status(401).json({msg:"all fields required"});
    }
    console.log(body); 
    const result = await User.create({
        first_name:body.first_name,
        last_name:body.last_name,
        email:body.email,
        job_title:body.job_title,
    });
    console.log("result",result);
    return res.status(201).json({msg:"success"});
});

app.listen(process.env.PORT,console.log('Server is listening, ${PORT} ' ));
