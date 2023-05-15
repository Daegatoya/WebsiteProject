const app = require('express')();
const path = require('path');
const bodyParser = require('body-parser');
var username;
var admin;
const PORT = 8080;
const express = require('express');
var http = require('http').createServer(app);
var data;
var ID;
var newsID;
const low = require('lowdb');
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./Databases/database.json");
const database = low(adapter);
const socketAD = new FileSync("./Databases/socketAccess.json");
const socketDB = low(socketAD);
const specialA = new FileSync("./Databases/specialAccess.json");
const specialDB = low(specialA);
const newsA = new FileSync("./Databases/news.json");
const newsDB = low(newsA);
var psswrd;
var io = require('socket.io')(http);
var IP;
var socketIP;
var avatar;
var position;
var rank;

database.defaults({
    Users: []
  }).write();

socketDB.defaults({
    Access: []    
}).write();

specialDB.defaults({
    Special: []    
}).write();

newsDB.defaults({
    News: []
  }).write();

app.set('trust proxy',true); 
app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/index.html', '/home.html'));
  });

  app.post('/api/fetchUser', (req, res) => {
    psswrd = req.body.password;
    username = req.body.username;
});

     app.get("/api/getUser", (req, res) => {
        data = {"usernames": [ username ], "excludeBannedUsers": true}
        console.log(JSON.stringify(data))
        res.setHeader("Access-Control-Allow-Origin", "*");
        fetch(`https://users.roblox.com/v1/usernames/users`, {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json"
              },
            body: JSON.stringify(data)
        })
        .then((response) => {
            response.json().then((json) => {
                 res.send(json);
                 res.end();
            })
        })
    });

    app.get("/api/getGroups", (req, res) => {
        ID = req.query.id;
        res.setHeader("Access-Control-Allow-Origin", "*");
        fetch(`https://groups.roblox.com/v2/users/${ID}/groups/roles`)
        .then((response) => {
            response.json().then((json) => {
                 res.send(json);
                 res.end();
            })
        })
    })

    app.post("/api/rememberMe", (req, res) => {
        IP = req.ip;
        console.log(IP);

        if(!database.get("Users").find({
            IP: IP
        }).value())
        {
            if(!database.get("Users").find({
                User_ID: ID
            }).value())
            {
                database.get("Users").push({
                Name: username,
                IP: IP,
                User_ID: ID,
                MIC_Rank: req.query.rank,
                USAR_Rank: req.query.usarrank,
                Avatar_URL: `https://tr.rbxcdn.com/${req.query.avatar}/150/150/AvatarBust/Png`,
                Password: psswrd,
                Admin: false
                }).write();
                res.send("1");
            }
            else if(database.get("Users").find({
                User_ID: ID
            }).value()){
                if(database.get("Users").find({
                    User_ID: ID,
                    Password: psswrd
                }).value()){
                    database.get("Users").push({
                        Name: username,
                        IP: IP,
                        User_ID: ID,
                        MIC_Rank: req.query.rank,
                        USAR_Rank: req.query.usarrank,
                        Avatar_URL: `https://tr.rbxcdn.com/${req.query.avatar}/100/100/AvatarBust/Png`,
                        Password: psswrd,
                        Admin: database.get("Users").find({User_ID: ID}).value().Admin
                        }).write();
                        res.send("1");
                }
                else res.send("0");
            }
        }
        else
        {
            if(database.get("Users").find({
                IP: IP,
                User_ID: ID,
                Password: psswrd
            }).value())
            {
                res.send("1");
            }
            else if(database.get("Users").find({
                Name: username,
                Password: psswrd
            }).value()) res.send("1");
            else if(!database.get("Users").find({
                IP: IP,
                User_ID: ID
            }).value()) res.send("5");
            else if(!database.get("Users").find({
                User_ID: ID,
                Password: psswrd
            }).value()) res.send("0");
        }
    })

    app.post("/api/isAccess", (req, res) => {
        IP = req.ip;
        if(!socketDB.get("Access").find({
            IP: IP,
            Status: true
        }).value()) res.send("0");
        else res.send("1");
    })

    app.get("/api/avatarFetch", (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        fetch(`https://thumbnails.roblox.com/v1/users/avatar-bust?userIds=${ID}&size=100x100&format=Png`)
        .then((response) => {
            response.json().then((json) => {
                 res.send(json);
                 res.end();
            })
        })
    });

    app.get("/api/avatarFetch2", (req, res) => {
        IP = req.ip;
        ID = database.get("Users").find({"IP": IP}).value().User_ID;
        res.setHeader("Access-Control-Allow-Origin", "*");
        fetch(`https://thumbnails.roblox.com/v1/users/avatar-bust?userIds=${ID}&size=100x100&format=Png`)
        .then((response) => {
            response.json().then((json) => {
                 res.send(json);
                 res.end();
            })
        })
    });

    app.get("/api/usernameFetch", (req, res) => {
        IP = req.ip;
        username = database.get("Users").find({"IP": IP}).value().Name;
        res.send({"user": username});
    });

    app.get("/api/idFetch", (req, res) => {
        IP = req.ip;
        ID = database.get("Users").find({"IP": IP}).value().User_ID;
        res.send({"id": ID});
    });

    app.get("/api/posFetch", (req, res) => {
        IP = req.ip;
        position = database.get("Users").find({"IP": IP}).value().MIC_Rank;
        res.send({"pos": position});
    });

    app.get("/api/rankFetch", (req, res) => {
        IP = req.ip;
        rank = database.get("Users").find({"IP": IP}).value().USAR_Rank;
        res.send({"rank": rank});
    });

    app.post("/api/isSpecial", (req, res) => {
        ID = req.query.id;
        if(!specialDB.get("Special").find({
            ID: ID
        }).value()) res.send("0");
        else res.send("1");
    })

    app.post("/api/isAdmin", (req, res) => {
        IP = req.ip;
        admin = database.get("Users").find({"IP": IP}).value().Admin;
        if(admin) res.send("1");
        else res.send("0");
    });

    app.post("/api/fetchNews", (req, res) => {
        newsID = req.query.news;
        if(newsDB.get("News").find({
            News_ID: newsID
        }).value()){
            res.send({
                "Title": newsDB.get("News").find({News_ID: newsID}).value().Title,
                "Text": newsDB.get("News").find({News_ID: newsID}).value().Text,
                "Image": newsDB.get("News").find({News_ID: newsID}).value().Image
            });
        }
        else console.log("Error");
    })

    app.post("/api/pushNews", (req, res) => {
        if(newsDB.get("News").find({
            News_ID: req.query.news
        }).value()){
            newsDB.get("News").remove({
                News_ID: req.query.news,
                Title: newsDB.get("News").find({News_ID: req.query.news}).value().Title,
                Text: newsDB.get("News").find({News_ID: req.query.news}).value().Text,
                Image: newsDB.get("News").find({News_ID: req.query.news}).value().Image,
            }).write();
            newsDB.get("News").push({
                News_ID: req.query.news,
                Title: req.query.title,
                Text: req.query.text,
                Image: req.query.image,
            }).write();
            res.send("1");
        }
        res.send("0");
    })

io.on('connection', function(socket){
    console.log("New User");
    socket.on('notification', (msg) => {
        console.log('User IP: ' + msg);
        socketIP = msg;
        if(!socketDB.get("Access").find({
            IP: socketIP,
            Status: true
        }).value()){
        socketDB.get("Access").push({
            IP: socketIP,
            Status: true
        }).write();
    }
    })
    socket.on('disconnect', () => {
    console.log('User Disconnected');
      });
  });

http.listen(PORT, () => {
    console.log('Socket Opened on Port ' + PORT);
  });
