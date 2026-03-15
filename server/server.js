const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    number: String,
    email: String
});

const UserModel = mongoose.model("users", userSchema);

// CREATE
app.post("/createUser", (req, res) => {
    UserModel.create(req.body)
        .then(user => res.json(user))
        .catch(err => res.json(err));
});

// READ
app.get("/", (req, res) => {
    UserModel.find({})
        .then(users => res.json(users))
        .catch(err => res.json(err));
});

// UPDATE
app.put("/updateUser/:id", (req, res) => {
    const id = req.params.id;
    UserModel.findByIdAndUpdate({_id: id}, req.body)
        .then(user => res.json(user))
        .catch(err => res.json(err));
});

// DELETE
app.delete("/deleteUser/:id", (req, res) => {
    const id = req.params.id;
    UserModel.findByIdAndDelete({_id: id})
        .then(res => res.json(res))
        .catch(err => res.json(err));
});

app.listen(3001, () => console.log("Server is running on port 3001"));