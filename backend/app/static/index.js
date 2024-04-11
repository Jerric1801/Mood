function userRefresh() {
    setInterval( function() {
        $("#userContainer").load("/ #userContainer > div")
    }, 3000)
}

function getuser(e) {
    console.log(e)
    const email = e.children[1].children[0].innerHTML
    console.log(email)
    $.ajax({
        type: "POST",
        url: "/getuser",
        data: JSON.stringify({"email": email}), 
        contentType: "application/json",
        dataType: 'json',

        success: function(data){
            $("#userOutContainer").css("display", "flex")
            $("#locationContainer").css("display", "flex")
            $('#outData').text("👤 Username: " + data["user"]) 
            $('#outEmail').text(email) 
            $('#outSleep').text("💤 Sleep Time: " + data["sleep"] + ":00") 
            $('#outLocation').text("📍 Location: " + data["location"]) 
            $('#outInSchool').text("🏫 In SMU?: " + data["inSchool"]) 

        }

    });
}

//navigation to pages
function navToHome() {
    window.location.replace("/")
}

function navToLoc() {
    window.location.replace("/location")
}


//location

function getLocation(e) {
     const location = $("#location").val()
    $.ajax({

        type: "POST",
        url: "/getlocation",
        data: JSON.stringify({"location": location}), 
        contentType: "application/json",
        dataType: 'json',

        success: function(data){
            $('#locResults').text(data["location"]) 
            $('#coordsResults').text(data["coords"]) 
            $('#addLocation').css('display', 'flex')
        }

    });
}

function addLocation(){
    let location = $("#locResults").text()
    let coords = $("#coordsResults").text()

    $.ajax({

        type: "POST",
        url: "/addlocation",
        data: JSON.stringify({"location": location, "coords": coords}), 
        contentType: "application/json",
        dataType: 'json',

        success: function(data){
            $('#listContainer').load("/location #listContainer > p");
            //receive location text from db after its stored & display in list
        }

    });
}


function simLocation(){
    let selection = $("#locationSelect").val()
    let email = $("#outEmail").text()

    $.ajax({

        type: "POST",
        url: "/simulatelocation",
        data: JSON.stringify({"location": selection, "email": email}), 
        contentType: "application/json",
        dataType: 'json',

        success: function(data){
            try {
                console.log(data["success"])
                //receive location text from db after its stored & display in list
                $("#simulateResult").text(data["success"])
                $("#outLocation").text("📍 Location: " + data["location"])
                $("#outInSchool").text("🏫 In SMU?: "+ data["inSchool"])
            }
            catch {
                console.log(data["error"])
            }
            
        }

    });
}