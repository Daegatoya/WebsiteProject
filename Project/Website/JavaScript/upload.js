var title;
var text;
var image;
var ID;
const adminPannel = document.getElementById("adminPannel");
const successMsg = document.getElementById("SuccessNews");
const errMsg = document.getElementById("ErrNews");

fetch(`../api/isAccess`, {
    method: "POST"
}).then((response) => response.json())
.then(response => {
    console.log(response);
    if(!response) window.location.href = "./";
});

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
    else window.location.href = "./news.html";
});

$(document).ready(function() {
    $(window).on('scroll', function() {
     if($(window).scrollTop() < 1000) {
       $('.hero').css('background-size', 100 + parseInt($(window).scrollTop() / 5) + '%');
       $('.hero h1').css('top', 50 + ($(window).scrollTop() * .1) + '%');
       $('.hero h1').css('opacity', 1 - ($(window).scrollTop() * .003));
     }
      
      if($(window).scrollTop() >= $('.content-wrapper').offset().top - 300) {
        $('.nav-bg').removeClass('bg-hidden');
        $('.nav-bg').addClass('bg-visible');
      } else {
        $('.nav-bg').removeClass('bg-visible');
        $('.nav-bg').addClass('bg-hidden');
      }
   });
 });

 function Upload(){
    title = document.getElementById("Title").value;
    text = document.getElementById("Text").value;
    image = document.getElementById("Image").value;
    ID = document.getElementById("News_ID").value;
    text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
    
    fetch(`./api/pushNews?title=${title}&text=${text}&image=${image}&news=${ID}`, {
        method: "POST"
     }).then((response) => response.json())
     .then(response => {
        if(response){
            title.innerHTML = "";
            text.innerHTML = "";
            image.innerHTML = "";
            ID.innerHTML = "";
            successMsg.style.display = "block";
        }
        else{
            errMsg.style.display = "block";
        }
    });
 }

 function HideNews(){
    errMsg.style.display = "none";
 }