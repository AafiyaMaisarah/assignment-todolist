// const express =require('express')
// const bodyParser = require ('body-parser')
// const cors = require('cors')
// const  path = require ('path');
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import Todo from "./model/todos.model.js"
import sequelize from "./db-connection.js"
// import { Op } from "parse/lib/browser/Parse"
import {Op} from 'sequelize'
const app = express();



app.use(cors());

function logger(req, res, next) {
    console.log(`${req.method} ${req.path} `);
    next();
}

app.use(logger);
app.use(bodyParser.json());
function responseBuilder(sucess,error,data)
{
    return{
        sucess,error,data
    }
}

app.get("/", (req, res, next) => {
    res.json({ message: "Hello World" })
});

app.get("/api/todos", (req, res) => {
    if(req.query.search){
        return Todo.findAll({
            where:{
                [Op.or]:{
                    title:{
                        [Op.substring]:req.query.search
                    },
                    description:{
                        [Op.substring]:req.query.search
                    }
                }
            }
        })
        .then(todos =>{
            return res.status(200).json(responseBuilder(true,null,{todos}))
            
        })
       
           .catch(e=>{
               console.log(e);
               return  res.status(500).json(responseBuilder(false,'something went wrong',null))
           })   
            
    }
Todo.findAll()
.then(todos =>{
    return res.status(200).json(responseBuilder(true,null,{todos}))
})
   .catch(e=>{
       console.log(e);
       return  res.status(500).json(responseBuilder(false,'something went wrong',null))
   })   
    
 });
 app.get("/api/todos",(req,res)=>{
    const search = req.query.search
    
    if(search){
        let filteredTodos = todos.filter(todo=>(todo.text.toLowerCase().includes(search.toLowerCase())));
    return res.status(200).json(responseBuilder(true,null,{todos : filteredTodos}))
    }
    return res.status(200).json(responseBuilder(true,null,{todos}))
    
})
 app.post("/api/todos", (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    if(!title) {
        return res.status(400).json(responseBuilder(false,'title is required',null))
        
    
    }
    const newTodo = {
      title,
      description,
    };

  Todo.create(newTodo)
  .then((todos)=>res.status(201).json(responseBuilder(true,null,{todo:newTodo}))
  )
  .catch((e)=>res.status(500).json(responseBuilder(false,"something went wrong",null)
  ));
  
     
  
});
 
app.get("/api/todos/:id", (req, res) => {
    console.log({ params: req.params, query:req.query, body:req.body})
    const id = req.params.id;
 Todo.findByPk(id)
 .then(todo=>{
     if(todo){
         return res.status(200).json(responseBuilder(true,null,{todo}))
     }
     return res.status(400).json(responseBuilder(true,'requested todo by id is not found',{todo:null}))
 })
 .catch((e)=>res.status(500).json(responseBuilder(false,'something went wrong',null)))
       
});

app.delete("/api/todos/:id", (req, res) => {
    const id = req.params.id;
    Todo.destroy({
        where:{
            id:id,
        },
    })
    .then((deletedTodo)=>{
        console.log(deletedTodo);
        if(deletedTodo){
            return res.status(200).json(responseBuilder(true,null,{}))
        }
        return res.status(400).json(responseBuilder(false,'todo with id not found',{}))
    
    })
     .catch((e)=>res.status(500).json(responseBuilder(false,'something went wrong',null)))
    })

app.patch("/api/todos/:id", (req, res) => {
    const id =req.params.id;
    const data = req.body
    Todo.update(data,{
        where:{
            id:id,
        }
    })
    .then((todo)=>{
        console.log(todo[0])
        if(todo[0])
        {
     return res.status(200).json(responseBuilder(true,null,{}))
        }
        return res.status(200).json(responseBuilder(false,"id not found",{}))
    })
    .catch((e)=>res.status(500).json(responseBuilder(false,"something went wrong",null)))
});

const startSever = () => {
    sequelize.sync()
    sequelize.authenticate()
    .then(() => {
        console.log("database connected")
        app.listen(4000,()=>console.log("port 4000 is listening"));
    }).catch(e=>console.log(e))
}
startSever();
