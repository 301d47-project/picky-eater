var request = require("request");
clientID = '0c5aa1f8930d4c4da4d8577c3bb4e6d9'
clientSecret = 'd861e781af6e40cb8cb1ea237b294e65'

var options = { 
   method: 'POST',
   url: 'https://oauth.fatsecret.com/connect/token',
   method : 'POST',
   auth : {
      user : clientID, 
      password : clientSecret
   },
   headers: { 'content-type': 'application/json'},
   form: {
      'grant_type': 'client_credentials',
      'scope' : 'basic'
   },
   json: true 
};

request(options, function (error, response, body) {
   if (error) throw new Error(error);

   console.log(body);
});