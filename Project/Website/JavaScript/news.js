var uploadButton = document.getElementById("uploadButton");
var adminMsg = document.getElementById("adminMessage");
const adminPannel = document.getElementById("adminPannel");
var hrefChange;

fetch(`../api/isAccess`, {
    method: "POST"
}).then((response) => response.json())
.then(response => {
    console.log(response);
    if(!response) window.location.href = "./";
});

$(document).ready(function() {
    $(window).on('scroll', function() {
     if($(window).scrollTop() < 1000) {
       $('.hero').css('background-size', 100 + parseInt($(window).scrollTop() / 5) + '%');
       $('.hero h1').css('top', 50 + ($(window).scrollTop() * .1) + '%');
       $('.hero h1').css('opacity', 1 - ($(window).scrollTop() * .003));
     }
      
      if($(window).scrollTop() >= $('.news').offset().top - 300) {
        $('.nav-bg').removeClass('bg-hidden');
        $('.nav-bg').addClass('bg-visible');
      } else {
        $('.nav-bg').removeClass('bg-visible');
        $('.nav-bg').addClass('bg-hidden');
      }
   });
 });

 fetch("./api/isAdmin", {
    method: "POST"
 }).then((response) => response.json())
 .then(response => {
    if(response){
        adminMsg.style.display="block";
        uploadButton.style.display="block";
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

window.onload = async function(){
  for(let i = 0; i < 5; i++)
  {
   await fetch(`./api/fetchNews?news=${i+1}`, {
      method: "POST"
   }).then((response) => response.json())
   .then(response => {
    var stringifyer = JSON.stringify(response);
    console.log(stringifyer.split("\"")[3])
    console.log(stringifyer.split("\"")[7])
    console.log(stringifyer.split("\"")[11])
      document.getElementById(`news${i+1}T`).innerHTML = stringifyer.split("\"")[3];
      document.getElementById(`news${i+1}P`).innerHTML = stringifyer.split("\"")[7];
      document.getElementById(`news${i+1}I`).src = stringifyer.split("\"")[11];
   })
  }
}

function Redirect(){
  window.location.href = "./upload.html";
}
            