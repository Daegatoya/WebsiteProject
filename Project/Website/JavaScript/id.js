var holder = document.getElementById("avatar");
var holder2 = document.getElementById("username");
var holder3 = document.getElementById("ID");
var holder4 = document.getElementById("pos");
var holder5 = document.getElementById("rank");
const adminPannel = document.getElementById("adminPannel");
var getReq;
var avatar;
var username;
var ID;
var pos;
var rank;

fetch(`../api/isAccess`, {
    method: "POST"
}).then((response) => response.json())
.then(response => {
    console.log(response);
    if(!response) window.location.href = "./";
})

fetch("./api/isAdmin", {
    method: "POST"
 }).then((response) => response.json())
 .then(response => {
    if(response){
        adminPannel.style.display="inline-block";
        $(document).ready(function(){
            $('a[href^="SECURED_ACCESS"]').each(function(){ 
                var oldUrl = $(this).attr("href");
                oldUrl.replace("http://", "https://");
                $(this).attr("href", "./admin.html");
            });
        });
    }
});

fetch(`../api/avatarFetch2`, {
    method: "GET"
}).then((response) => response.json())
.then(response => {
    console.log(JSON.stringify(response));
    avatar = (JSON.stringify(response).split("\"")[11]).split("/")[3];
})

setTimeout(function(){
    holder.style.backgroundImage=`url('https://tr.rbxcdn.com/${avatar}/100/100/AvatarBust/Png')`;
}, 800);

fetch(`../api/usernameFetch`, {
    method: "GET"
}).then((response) => response.json())
.then(response => {
    username = JSON.stringify(response).split("\"")[3];
    console.log(username);
})

setTimeout(function(){
    holder2.innerHTML=username;
}, 800);

fetch(`../api/idFetch`, {
    method: "GET"
}).then((response) => response.json())
.then(response => {
    ID = JSON.stringify(response).split("\"")[3];
    console.log(ID);
})

setTimeout(function(){
    holder3.innerHTML=ID;
}, 800);

fetch(`../api/posFetch`, {
    method: "GET"
}).then((response) => response.json())
.then(response => {
    pos = JSON.stringify(response).split("\"")[3];
    console.log(pos);
})

setTimeout(function(){
    holder4.innerHTML=pos;
}, 800);

fetch(`../api/rankFetch`, {
    method: "GET"
}).then((response) => response.json())
.then(response => {
    rank = JSON.stringify(response).split("\"")[3];
    console.log(rank);
})

setTimeout(function(){
    holder5.innerHTML=rank;
}, 800);
