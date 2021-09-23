const express = require("express");
const https = require("https");
const mailchimpApi = require(__dirname + "/mailchimp.js");

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
    };
    const dataJSON = JSON.stringify(data);

    url = mailchimpApi.mailchimpUrl;
    options = {
        method: "POST",
        auth: mailchimpApi.mailchimpApiKey
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
