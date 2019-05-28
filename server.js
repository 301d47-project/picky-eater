'use strict'

// Environmnet variables
require('dotenv').config();

// Application Dependencies
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
// Use below if we want user to interact with DB
// const methodOverride = ('method-override');

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));



// Use below if we want user to interact with DB
// app.use(methodOverride((request, response) => {
//     if (request.body && typeof request.body === 'object' && '_method' in request.body) {
//         let method = request.body._method;
//         delete request.body._method;
//         return method;
//     }
// }))

// Database Setup
// const client = new pg.Client(process.env.DATABASE_URL);
// client.connect();
// client.on('error', err => console.error(err));

// View engine for server-side rendering template (EJS)
app.set('view engine', 'ejs');

// Listen for request to the server 
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// API Routes
app.get('/', loadHomePage);
app.get('/about', loadAboutPage);
app.post('/results', performSearch);
app.get('/info', loadInfoPage);
app.post('/recipes', getRecipe);

app.get('*', (request, response) => response.status(404).send('This route does not exist'));

// Constructor for Food Item

function Food(info) {
    const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
    this.image = info.food_url || placeholderImage;
    this.name = info.food_name;
    this.description = info.food_description;
    this.id = info.food_id;
}

// Request Handlers

function loadHomePage(request, response) {
    response.render('pages/index')

}

function loadAboutPage(request, response) {
    response.render('pages/about')

}

function loadInfoPage(request, response) {
    response.render('pages/faqs')

}

function performSearch(request, response) {

    const apiRequest = require("request");
    const query = request.body.expression;
    console.log(query);

    const options = {
        method: 'POST',
        url: `https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=${query}&format=json`,
        headers:{'content-type':'application/json'},
        auth: {
            bearer: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ1MjZBMkFCNkQ0MkQ5REIwMjBEMThBRDMxRTE5MTdCMUUzMjg2RTUiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJSU2FpcTIxQzJkc0NEUml0TWVHUmV4NHlodVUifQ.eyJuYmYiOjE1NTkwMDAyOTgsImV4cCI6MTU1OTA4NjY5OCwiaXNzIjoiaHR0cHM6Ly9vYXV0aC5mYXRzZWNyZXQuY29tIiwiYXVkIjpbImh0dHBzOi8vb2F1dGguZmF0c2VjcmV0LmNvbS9yZXNvdXJjZXMiLCJiYXNpYyJdLCJjbGllbnRfaWQiOiIwYzVhYTFmODkzMGQ0YzRkYTRkODU3N2MzYmI0ZTZkOSIsInNjb3BlIjpbImJhc2ljIl19.qHjgol9X7H8ojLcj3IXfsLCG5Or5e7DeCLjKFOIAEvJRMJ8FG5t23lmDAq8EALVAHaEQ0FffQajlhzkJRjpVgOq5HFNWlYff56wmtkT3LcMKLL_iOCidHVolfzSVHqGdv_QRe-iqVCq4SJx1mp99QL-l1oPLqvR2g5-m5UTYMo1mPmPZUV1BpSuZqfTeriaC_8z3fWzNz9K903gldqHaMpIF7g9DKP1j29__6-NIDadlACbZglqGniICz9T8w66MO35jRj0Wpz5yiHRahXQpP-3qLUByjV0drVXnBcKqcplzNQh9CN_xwzXNt-W3BtTrbiDE0ELX99AFNYgJ1vqW6A'
        }
    }
    console.log(options.url);
    
    apiRequest(options, function(error, responseApi, body) {
        if (error) throw new Error(error);
        const data = JSON.parse(body);
        const foods = data.foods.food.slice(0, 10);
        response.render('pages/results', {searchResults: foods})
    })};

function getRecipe(request, response) {
    
    const apiRequest = require("request");
    const query = request.body.expression;
    console.log('query', query);
    

    const options = {
    method: 'POST',
    url: `https://platform.fatsecret.com/rest/server.api?method=recipes.search&search_expression=${query}&format=json`,
    headers:{'content-type':'application/json'},
    auth: {
        bearer: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ1MjZBMkFCNkQ0MkQ5REIwMjBEMThBRDMxRTE5MTdCMUUzMjg2RTUiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJSU2FpcTIxQzJkc0NEUml0TWVHUmV4NHlodVUifQ.eyJuYmYiOjE1NTkwMDAyOTgsImV4cCI6MTU1OTA4NjY5OCwiaXNzIjoiaHR0cHM6Ly9vYXV0aC5mYXRzZWNyZXQuY29tIiwiYXVkIjpbImh0dHBzOi8vb2F1dGguZmF0c2VjcmV0LmNvbS9yZXNvdXJjZXMiLCJiYXNpYyJdLCJjbGllbnRfaWQiOiIwYzVhYTFmODkzMGQ0YzRkYTRkODU3N2MzYmI0ZTZkOSIsInNjb3BlIjpbImJhc2ljIl19.qHjgol9X7H8ojLcj3IXfsLCG5Or5e7DeCLjKFOIAEvJRMJ8FG5t23lmDAq8EALVAHaEQ0FffQajlhzkJRjpVgOq5HFNWlYff56wmtkT3LcMKLL_iOCidHVolfzSVHqGdv_QRe-iqVCq4SJx1mp99QL-l1oPLqvR2g5-m5UTYMo1mPmPZUV1BpSuZqfTeriaC_8z3fWzNz9K903gldqHaMpIF7g9DKP1j29__6-NIDadlACbZglqGniICz9T8w66MO35jRj0Wpz5yiHRahXQpP-3qLUByjV0drVXnBcKqcplzNQh9CN_xwzXNt-W3BtTrbiDE0ELX99AFNYgJ1vqW6A'
        }
    }
    // response.send(options.url);

    apiRequest(options, function(error, responseApi, body) {
    if (error) throw new Error(error);
    console.log(body);
    const data = JSON.parse(body);
    // response.send(data);
    const recipes = data.recipes.recipe;
    // response.send(recipes);
    response.render('pages/faqs', {recipeResults: recipes});
})};