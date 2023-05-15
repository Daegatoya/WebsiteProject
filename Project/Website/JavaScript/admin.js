var text;
var adminFail = document.getElementById("ErrAdmin");

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
    else window.location.href = "./home.html";
});

function Search(){
    text = document.getElementById("submission").value;
    $.get(`./${text}`)
    .done(function() { 
        window.location.href = `./${text}`;
    }).fail(function() { 
        adminFail.style.display = "block";
    })
}

function HideAdmin(){
    adminFail.style.display = "none";
}