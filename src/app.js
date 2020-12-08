const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const marioModel = require('./models/marioChar');

// Middlewares
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// your code goes here

app.get("/mario", async(req,res) => (
    res.send(await marioModel.find())
));

app.get("/mario/:id", async (req,res) => {
    const id=req.params.id;
    try {
        const mario=await marioModel.findById(id);
        if(mario) {
            res.send(mario);
        } else {
            res.status(400).send({error: "Id not found"});
        }
    } catch(err) {
        res.status(400).send({error: err.message});
    }
});

app.post("/mario", async (req,res) => {
    if((req.body.name) && (req.body.weight)) {
        const new_mario=new marioModel(req.body);
        await new_mario.save();
        res.status(201).send(new_mario);
    } else {
        res.status(400).send({message: 'either name or weight is missing'});
    }
});

app.patch("/mario/:id", async (req,res) => {
    const id=req.params.id;
    try {
        const mario=await marioModel.findById(id);
        if(mario===null) {
            res.status(400).send({message: "Id not found"});
        } else {
            await marioModel.updateOne({_id : id}, req.body);
            res.send(await marioModel.findById(id));
        }
    } catch(error) {
        res.status(400).send({message: error.message});
    }
});

app.delete("/mario/:id", async (req,res) => {
    const id=req.params.id;
    try {
        const mario=await marioModel.findById(id);
        if(mario===null) {
            res.status(400).send({message: "Id not found"});
        } else {
            await marioModel.deleteOne({_id: id});
            res.send({message: 'character deleted'});
        }
    } catch(error) {
        res.status(400).send({message: error.message});
    }
});

module.exports = app;