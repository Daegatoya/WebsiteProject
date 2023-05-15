const adminPannel = document.getElementById("adminPannel");

fetch(`../api/isAccess`, {
    method: "POST"
}).then((response) => response.json())
.then(response => {
    console.log(response);
    if(!response) window.location.href = "./";
})

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

 fetch("./api/isAdmin", {
  method: "POST"
}).then((response) => response.json())
.then(response => {
  if(response){
      adminPannel.style.display="inline-block";
      $(document).ready(function(){
          $('a[href^="SECURED_ACCESS"]').each(function(){ 
              var oldUrl = $(this).attr("href"); // Get current url
              oldUrl.replace("http://", "https://"); // Create 
              $(this).attr("href", "./admin.html"); // Set herf value
          });
      });
  }
});