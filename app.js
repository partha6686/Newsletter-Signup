const express = require("express");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/",function(req,res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    
    const data = {
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    const dataJSON = JSON.stringify(data);

    url = "https://us5.api.mailchimp.com/3.0/lists/2155685678";
    options = {
        method: "POST",
        auth: "Apik:be0decca03f4063d11e1298bdad1ef65-us5"
    }
    const request = https.request(url, options, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(dataJSON);
    request.end();

})
app.post("/retry",function(req,res){
    res.redirect("/");
})


app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000.");
})
