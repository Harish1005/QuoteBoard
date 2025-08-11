

import express from "express"
import cors from "cors"
import mongoose, { mongo } from "mongoose"
import dotenv from "dotenv"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // CORS() -> This is use to prevent the malicious websites from accessing sensitive data
app.use(express.json());

//define the model

const  quoteSchema = new mongoose.Schema({
  text:{
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
}, {timestamps:true});

const Quote = mongoose.model("Quote", quoteSchema);

//Get all quotes

app.get("/api/quotes", async(req, res) => {
  try{
    const quotes = await Quote.find().sort({createdAt:-1});

    res.json(quotes)
  } catch(err) {
    res.status(500).json({error: "Failed to fetch"})
  }
})


//post a new quotes


app.post("/api/quotes", async(req, res) => {

  try{
    const { text } = req.body;
    
    if(!text || !text.trim()){
      return res.status(400).json({error: "Text is required"})
    }

    const created = await Quote.create({text: text.trim()});

    res.status(201).json(created);
  } catch(err) {
    res.status(500).json({error: "Failed to create quotes"})
  }
})

//put for update a quotes

app.put("/api/quotes/:id", async(req, res) => {

  try{

    console.log(req.params)

    const { id } = req.params;
    const { text } = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({error: "Invalid quote ID"})
    }
    
    if(!text || !text.trim()){
      return res.status(400).json({error: "Text is required"})
    }

    const updated = await Quote.findByIdAndUpdate(id, {text: text.trim()},
      {new:true})

    if(!updated) return res.status(404).json({error:"QuoteID not found"})


    res.json(updated);
  } catch(err) {
    res.status(500).json({error: "Failed to update quote"})
  }
})


//Delete Quote

app.delete("/api/quotes/:id", async(req, res) => {

  try{

    console.log(req.params)

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(400).json({error: "Invalid quote ID"})
    }

    const deleted = await Quote.findByIdAndDelete(id)

    if(!deleted) return res.status(404).json({error:"QuoteID note found"})


    res.status(204).end();

  } catch(err) {
    res.status(500).json({error: "Failed to delete quote"})
  }
})


//Test api

app.get("/", (req, res) => {
  res.send('Server Ready')
})


//connect to MONGODB

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected Successfully"))
.catch((err) => {
  console.error(`MongoDB Connection failed: ${err.message}`);
  process.exit(1);
})


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})