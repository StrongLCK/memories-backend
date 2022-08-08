//can use import ... due to adding  "type": "module", below "main"
import express from "express";
//import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import postRoute from "./routes/posts.js"; //const postRoute = require("./routes/posts.js");
import userRoute from "./routes/user.js";

const app = express();


app.use(express.json(({ limit: "30mb", extended: true })));
app.use(express.urlencoded(({ limit: "30mb", extended: true })));
//bodyParser was replaced by express
//app.use(bodyParser.json({ limit: "30mb", extended: true }));
//app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/posts", postRoute);
app.use("/user", userRoute);
app.get('/', (req, res) => { res.send("App is Running") })

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server is running on ${PORT}`)))
    .catch((error) => console.log(error.message));


