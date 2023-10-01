const express = require('express');
const cors = require('cors');
const Dotenv = require("dotenv").config();
const mongoose = require('mongoose');
const axios = require('axios');
const connection = "mongodb+srv://kevintang01:" + process.env.M_PASSWORD + "@lahacks.gihcnf6.mongodb.net/"

const connectDB = async () => {
    mongoose.set('strictQuery', false);

    await mongoose
        .connect (connection, 
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => console.log("Connected to DB"))
            .catch(console.error);
}

const app = express();
app.use(express.json());
app.use(cors());

connectDB().then(() => {
    app.listen(8080, () => {console.log("Server listening on port 8080");});
})

const Users = require("./models/users");
const Updates = require("./models/updates");

const dangerList = ['Salted', 'Grian', 'Jumla', 'Crunkle', 'HeyZeer0', 'Nepmia', 'Naraka00', 'Viridian', '____________birb', '_purplegiraffe_', 'Aerrihn', 'AmbassadorDazz', 'BTK2000', 'Chigo_', 'ditsario', 'Fiery_Mystery', 'Ichikaaa', 'ItzAzura', 'Lysmod', 'Julinho', 'Magicmakerman', 'MigatteNoGokuii', 'MilkeeW', 'PraetorianWolf', 'ShadowShift', 'Slime1480'];

app.get('/startup', async (req, res) => {
    res.json(0);
})

app.get('/get/friends', async (req, res) => {
    const users = await Users.find({}, {_id: 0});
    const updates = await Updates.find({}, {_id: 0, update: 1});
    users.push(updates[0]);
    res.json(users);
})

app.post('/check', async (req, res) => {
    let status = " online";
    await axios.get("https://api.wynncraft.com/v2/player/" + req.body.username + "/stats")
    .then((response) => {
        if (!response.data.data[0].meta.location.online)
        {
            status = " offline";
        }
    })
    .catch((error) => {
        status = " error";
    })
    res.json(req.body.username + status);
})