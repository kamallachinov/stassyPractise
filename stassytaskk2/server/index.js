const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const bodyParser = require('body-parser')

dotenv.config()

const app = express()
const { Schema } = mongoose



const productSchema = new Schema({
    imgUrl: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true }
})

const Products = mongoose.model("stassy_task", productSchema)

app.use(cors())
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.send("<h1>Admin Panel</h1>")
})


// const PER_PAGE = 4;
//GET ALL DATA

app.get("/products", (req, res) => {

    Products.find({}, (err, docs) => {
        if (!err) {
            res.send(docs)
        } else {
            res.status(404).json({ message: err })
        }
    })
})

//GET PRODUCT BY ID

app.get("/products/:id", (req, res) => {
    const { id } = req.params
    Products.findById(id, (err, docs) => {
        if (!err) {
            res.send(docs)
        } else {
            res.status(404).json({ message: err })
        }
    })
})

//POST DATA TO API

app.post("/products", (req, res) => {
    const myProduct = new Products({
        imgUrl: req.body.imgUrl,
        name: req.body.name,
        price: req.body.price
    })
    myProduct.save()
    res.send("Data created")
})

//DELETE DATA FROM API


app.delete("/products/:id", (req, res) => {
    const { id } = req.params
    Products.findByIdAndDelete(id, (err) => {
        if (!err) {
            res.send("Deleted data")
        } else {
            res.status(404).json({ message: err })
        }
    })
})

const url = process.env.CONNECTION_URL.replace("<password>", process.env.PASSWORD)
const PORT = process.env.PORT
mongoose.set('strictQuery', false);
mongoose.connect(url, (err) => {
    if (!err) {
        console.log("Database Connected");
        app.listen(PORT, () => {
            console.log("Server started at:" + PORT);
        })
    } else {
        console.log(err);
    }
})
