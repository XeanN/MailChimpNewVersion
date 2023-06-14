require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
const port = process.env.PORT;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req, res)=> {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
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

    const jsonData = JSON.stringify(data);

    const url = "https://us11.api.mailchimp.com/3.0/lists/03aa53a67e";

    const options = {
        method: "POST",
        auth: "XeanN:22865ebad40077175a6b4052e3c7420f-us11",
    };

    const request =https.request(url, options, (response)=>{

        let responseBody = "";

        response.on("data", function(data){
            responseBody += data;
            console.log(JSON.parse(data));
        });

        response.on("end", () => {
            console.log(JSON.parse(responseBody));
            // Envía una respuesta al cliente si es necesario
            res.sendFile(__dirname + "/success.html");
        });    
    });

    request.on("error", (error) => {
        console.error("Error en la solicitud:", error);
        // Envía una respuesta de error al cliente si es necesario
        res.status(500).sendFile(__dirname + "/failure.html");
    });
    
    request.write(jsonData);
    request.end();

});

app.post("/failure", (req, res)=>{
    res.redirect("/");
});

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
});

// List ID Mailchimp
// 03aa53a67e

// APi Key Mailchimp
// 22865ebad40077175a6b4052e3c7420f-us11



