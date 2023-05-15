var getReq;
var noUserFound = document.getElementById("Error1");
var noMember = document.getElementById("Error2");
var badPass = document.getElementById("Error3");
var alreadyRegisteredIP = document.getElementById("Error4");
var splitter;
let socket = io();
let apiKey = 'a59f6fc2376e47ad90a77a8d6275f84c';
var IP;

$.getJSON('https://api.ipgeolocation.io/ipgeo?apiKey=' + apiKey, function(data) {
    console.log(JSON.stringify(data, null, 2).split("\"")[3]);
    IP = JSON.stringify(data, null, 2).split("\"")[3];
});

async function GetUserRequest()
{
    getReq = new XMLHttpRequest();
    await new Promise(r => setTimeout(r, 2000));
    getReq.addEventListener("load", UserListener);
    getReq.open("GET", `../api/getUser`, true);
    getReq.send();
}

async function GetGroupsRequest(id)
{
    getReq = new XMLHttpRequest();
    console.log(id);
    await new Promise(r => setTimeout(r, 2000));
    getReq.addEventListener("load", GroupListener);
    getReq.param_ID = id;
    getReq.open("GET", `../api/getGroups?id=${id}`, true);
    getReq.send();
}

function UserListener()
{
    console.log(this.response);
    var id = this.response.match(/"id":(\d+)/i) ? this.response.match(/"id":(\d+)/i)[1] : null;
    if(!id) noUserFound.style.display="block";
    else GetGroupsRequest(id);
}

async function GroupListener(param)
{
    console.log(this.response);
    var isTrue = this.response.match(/15531002/i) ? true : false;
    var rank;
    var usar_rank;
    var avatar;
    await fetch(`../api/isSpecial?id=${param.currentTarget.param_ID}`, {
        method: "POST"
    }).then((res) => res.json())
    .then(res => {
        if(res) isTrue = "5";
        console.log(res);
    })
        console.log(isTrue);
        if(isTrue == false) noMember.style.display="block";
        else if(isTrue == true)
        {
            splitter = this.response.split(/15531002/i);
            console.log(splitter);
            rank = splitter[1].split("\"")[15];
            splitter = this.response.split(/3108077/i);
            usar_rank = splitter[1].split("\"")[15];
            console.log(usar_rank);
            fetch(`../api/avatarFetch`, {
                method: "GET"
            }).then((response) => response.json())
            .then(response => {
                console.log(JSON.stringify(response));
                avatar = (JSON.stringify(response).split("\"")[11]).split("/")[3];
                fetch(`../api/rememberMe?rank=${rank}&avatar=${avatar}&usarrank=${usar_rank}`, {
                    method: "POST"
                }).then((response) => response.json())
                .then(response => {
                    console.log(response);
                    if(response == false) badPass.style.display="block";
                    else if(response == 5) alreadyRegisteredIP.style.display="block";
                    else
                    {
                        socket.emit("notification", IP);
                        window.location.href = "../home.html";
                    }
                })
            })
        }
        else
        {
        rank = "Secret Agent";
        splitter = this.response.split(/3108077/i);
        usar_rank = splitter[1].split("\"")[15];
        console.log(usar_rank);
        fetch(`../api/avatarFetch`, {
            method: "GET"
        }).then((response) => response.json())
        .then(response => {
            console.log(JSON.stringify(response));
            avatar = (JSON.stringify(response).split("\"")[11]).split("/")[3];
            fetch(`../api/rememberMe?rank=${rank}&avatar=${avatar}&usarrank=${usar_rank}`, {
                method: "POST"
            }).then((response) => response.json())
            .then(response => {
                console.log(response);
                if(response == false) badPass.style.display="block";
                else if(response == 5) alreadyRegisteredIP.style.display="block";
                else
                {
                    socket.emit("notification", IP);
                    window.location.href = "../home.html";
                }
            })
        })
    }
}

function Hide()
{
    noUserFound.style.display="none";
    noMember.style.display="none";
    badPass.style.display="none";
    alreadyRegisteredIP.style.display="none";
}