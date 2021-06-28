// jsinht esvesion : 6

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();
const port = 3000 || process.env.PORT;
const staticDirectory = "public";
require('dotenv').config()
app.use(express.static(staticDirectory));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.post("/submit", function (req, res) {
  const fname = req.body.fName;
  const lname = req.body.lName;
  const email = req.body.email;

  const user = {
    members: [{
      "email_address": email,
      "status": "subscribed",
      "merge_fields": {
        "FNAME": fname,
        "LNAME": lname
      }
    }]
  }

  const stringifiedJSON = JSON.stringify(user);
  const url = "https://us2.api.mailchimp.com/3.0/lists/50e1fca5ff";
  console.log(process.env.MAILCHIMP_KEY)
  const options = {
    method: "POST",
    auth: process.env.MAILCHIMP_KEY
  }
  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      console.log(JSON.parse(data));
      const parsedData = JSON.parse(data);

      if (response.statusCode == 200) {
        res.send("Successful");
      } else {
        // if (parsedData.errors[0].error_code == 'ERROR_CONTACT_EXISTS') {
        //   res.send('Contact already subscribed');
        // }
        res.send("Try again later");
      }
    })
  })
  request.write(stringifiedJSON);
  request.end();
})

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signin.html");
})

app.listen(port, function () {
  console.log("Server is live on port " + port);
})