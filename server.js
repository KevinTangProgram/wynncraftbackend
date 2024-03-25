const express = require('express');
const cors = require('cors');
const Dotenv = require("dotenv").config();
const mongoose = require('mongoose');
const SHA256 = require("crypto-js/sha256");
const axios = require('axios');
const connection = "mongodb+srv://kevintangdbio:" + process.env.M_PASSWORD + "@wynncraft.draoxqj.mongodb.net/"

const exceptions = ["Zyreon", "Awesome_AA_", "Awesome_AA", "azarashiouo"]

const connectDB = async () => {
    mongoose.set('strictQuery', false);

    await mongoose
        .connect (connection, 
            // {
            //     useNewUrlParser: true,
            //     useUnifiedTopology: true,
            //}
            )
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
const Month = require("./models/month");
const All = require("./models/all");

app.get('/startup', async (req, res) => {
    res.json(0);
})

app.get('/get/all', async (req, res) => {
    const users = await Users.find({}, {_id: 0});
    const updates = await Updates.find({}, {_id: 0, update: 1});
    const dangerList = JSON.stringify(await Updates.find({}, {_id: 0, danger: 1}));
    let returnArray = [];
    let returnArray2 = [];
    for (let i = 0; i < users.length; i++)
    {
        if (dangerList.includes('|' + users[i].user + '|') || exceptions.includes(users[i].user))
        {
            usersMonth = await Month.find({user: users[i].user}, {_id: 0});
            usersAll = await All.find({user: users[i].user}, {_id: 0});
            if (dangerList.includes('|' + users[i].user + '|'))
            {
                returnArray2.push({
                    user: users[i].user,
                    today: users[i].today,
                    world: users[i].world,
                    month: usersMonth[0].month,
                    creation: usersMonth[0].creation,
                    deletion: usersMonth[0].deletion,
                    all: usersAll[0].all
                });
            }
            else
            {
                returnArray.push({
                    user: users[i].user,
                    today: users[i].today,
                    world: users[i].world,
                    month: usersMonth[0].month,
                    creation: usersMonth[0].creation,
                    deletion: usersMonth[0].deletion,
                    all: usersAll[0].all
                });
            
            }
        }
    }
    returnArray.sort(function(a, b){return a.user.toLowerCase().localeCompare(b.user.toLowerCase());})
    returnArray2.sort(function(a, b){return a.user.toLowerCase().localeCompare(b.user.toLowerCase());})
    returnArray = returnArray.concat(returnArray2);
    returnArray.push(updates[0]);
    res.json(returnArray);
})

app.get('/get/friends', async (req, res) => {
    const users = await Users.find({}, {_id: 0});
    const updates = await Updates.find({}, {_id: 0, update: 1});
    const dangerList = JSON.stringify(await Updates.find({}, {_id: 0, danger: 1}));
    for (let i = 0; i < users.length; i++)
    {
        if (dangerList.includes('|$#!%' + users[i].user + '|') && !exceptions.includes(users[i].user))
        {
            users.splice(i, 1);
            i--;
        }
    }
    users.sort(function(a, b){return a.user.toLowerCase().localeCompare(b.user.toLowerCase());})
    users.push(updates[0]);
    res.json(users);
})

app.post('/check', async (req, res) => {
    let status = " error";
    try
    {
        await axios.get("https://api.wynncraft.com/v2/player/" + req.body.username + "/stats?hash=" + SHA256(Date.now().toString() + process.env.HASH_KEY).toString())
        .then((response) => {
            if (response.data.data[0].meta.location.online)
            {
                status = ' ' + response.data.data[0].meta.location.server;
            }
            else
            {
                const lastSeen = new Date(response.data.data[0].meta.lastJoin).getTime();
                if (Date.now() - lastSeen < 60000)
                {
                    status = " vanished";
                }
                else
                {
                    status = " offline";
                }
            }
        })
        .catch((error) => {
            status = " server error";
        })
    }
    catch (error)
    {
        status = " failed error";
    }
    res.json(req.body.username + status);
})