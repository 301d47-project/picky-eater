'use strict'

// Environmnet variables
require('dotenv').config();

// Application Dependencies
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');


// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));


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
app.get('/cooking', loadInfoPage);
app.post('/get-suggestions', searchSuggestion);
app.post('/recipes', getRecipe);
app.post('/compare', saveFood);

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

function searchSuggestion(request, response) {
    const query = request.body.expression;
    let suggestions = [];

   if (query.startsWith('spam') ) {
        suggestions = ['spam', 'spam sandwich']
    }   else if (query.startsWith('spag') ) {
        suggestions = ['spaghetti', 'spagetti and meatballs']
    }   else if (query.startsWith('span') ) {
        suggestions = ['spanish rice']
    }    else if (query.startsWith('spa') ) {
        suggestions = ['spam', 'spam sandwich', 'spaghetti', 'spanish rice']
    }   
    response.send({'suggestions': { 'suggestion': suggestions}})

}
function searchSuggestionOld(request, response) {
    // response.send({ 'suggestions': { 'suggestion': [ 'chicken', 'chicken breast', 'chicken salad', 'chiken wings' ] }})
    const apiSuggestion = require("request");
    const querySuggestion = request.body.expression;


    const suggestion = {
        method: 'POST',
        url: `https://platform.fatsecret.com/rest/server.api?method=foods.autocomplete&expression=${querySuggestion}&format=json`,
        headers:{'content-type':'application/json'},
        auth: {
            bearer: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ1MjZBMkFCNkQ0MkQ5REIwMjBEMThBRDMxRTE5MTdCMUUzMjg2RTUiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJSU2FpcTIxQzJkc0NEUml0TWVHUmV4NHlodVUifQ.eyJuYmYiOjE1NTkxNTQwMDQsImV4cCI6MTU1OTI0MDQwNCwiaXNzIjoiaHR0cHM6Ly9vYXV0aC5mYXRzZWNyZXQuY29tIiwiYXVkIjpbImh0dHBzOi8vb2F1dGguZmF0c2VjcmV0LmNvbS9yZXNvdXJjZXMiLCJiYXNpYyJdLCJjbGllbnRfaWQiOiJjMDYzNjY1NDkxZmY0MmQ4OWRhNDJkNzcxZTdkZjc3YiIsInNjb3BlIjpbImJhc2ljIl19.L3SkTfqhRwSwli6cxDSPp7ujGZfo7AwI_LEDZRHSmFdSkeRnQsR_fitRK7m1sR1u4Q6PYdTddUiO4OMeXWuZCaHaLAlSDwaQw2f9tE5z0zQcW65hoyATXKMsl5Dq7X4abp1J-S8z2OYxsklJ4c-lIKYztmz2jy9-7wPBQQHV445UnGgZUJLmngEpWIRC-sf5kbzMjKxiQlELzJoKtuZZJDsPe2TtiCiMEO_m7O3Y1O2-RJi6_VM81dApQpJLpHLk-d4k2SPZrMuf_jYoZyrm3nncp3ix67vDp6fZPUK66WxCoo4_hBIHIqEQTFnSDlnF-M6GeN-cchiCfirtaRDvwQ"

        }
    }

    apiSuggestion(suggestion, function(error, suggestionApi, body) {
        if (error) throw new Error(error);
    })
}



function loadInfoPage(request, response) {
    response.render('pages/cooking')
}


function performSearch(request, response) {

    const apiRequest = require("request");
    const query = request.body.expression;

    const options = {
        method: 'POST',
        url: `https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=${query}&format=json`,
        headers:{'content-type':'application/json'},
        auth: {
            bearer: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ1MjZBMkFCNkQ0MkQ5REIwMjBEMThBRDMxRTE5MTdCMUUzMjg2RTUiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJSU2FpcTIxQzJkc0NEUml0TWVHUmV4NHlodVUifQ.eyJuYmYiOjE1NTkyMjA5MzcsImV4cCI6MTU1OTMwNzMzNywiaXNzIjoiaHR0cHM6Ly9vYXV0aC5mYXRzZWNyZXQuY29tIiwiYXVkIjpbImh0dHBzOi8vb2F1dGguZmF0c2VjcmV0LmNvbS9yZXNvdXJjZXMiLCJiYXNpYyJdLCJjbGllbnRfaWQiOiIwYzVhYTFmODkzMGQ0YzRkYTRkODU3N2MzYmI0ZTZkOSIsInNjb3BlIjpbImJhc2ljIl19.FEyZKXAwsqpSVj2uRRbr68iQWWoybK0VXQR45stCoq-41bMb1xBBur4qOh5sQFfZi4g7ohZq3TURO9FACkfuYYZE_OTU32oYPJevfN_TBQOxc8X7lIdMFYc_2Y6MCsOoDoEnFM9LlIyib_CJ2DkuR0Qmb30TcioKvyBPdZLijzd1ueqMTJAsKXNu9KUXBPILQ-ByDCQwYdIjDTzuQ6v_beFkaNZhtT1eyORlDYK7qUqHq_eEyTxIpmUpC65bTWhaUtY4rRyag0HSb5_26Kbm3M9uD8Y9ikmtIzO7JZO6EwEipyyvwSlkJzb-R3F3AO1TAGDtjg4hY3pDve7E1pZ19g"

        }
    }
    
    apiRequest(options, function(error, responseApi, body) {
        if (error) throw new Error(error);
        const data = JSON.parse(body);
        const foods = data.foods.food.slice(0, 10);
        response.render('pages/results', {searchResults: foods})
    })
};


function getRecipe(request, response) {
    
    const apiRequest = require("request");
    const query = request.body.expression;
    // console.log('query', query);
    

    const options = {
    method: 'GET',
    url: `https://platform.fatsecret.com/rest/server.api?method=recipes.search&search_expression=${query}&format=json`,
    headers:{'content-type':'application/json'},
    auth: {
        bearer: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ1MjZBMkFCNkQ0MkQ5REIwMjBEMThBRDMxRTE5MTdCMUUzMjg2RTUiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJSU2FpcTIxQzJkc0NEUml0TWVHUmV4NHlodVUifQ.eyJuYmYiOjE1NTkyMjA5MzcsImV4cCI6MTU1OTMwNzMzNywiaXNzIjoiaHR0cHM6Ly9vYXV0aC5mYXRzZWNyZXQuY29tIiwiYXVkIjpbImh0dHBzOi8vb2F1dGguZmF0c2VjcmV0LmNvbS9yZXNvdXJjZXMiLCJiYXNpYyJdLCJjbGllbnRfaWQiOiIwYzVhYTFmODkzMGQ0YzRkYTRkODU3N2MzYmI0ZTZkOSIsInNjb3BlIjpbImJhc2ljIl19.FEyZKXAwsqpSVj2uRRbr68iQWWoybK0VXQR45stCoq-41bMb1xBBur4qOh5sQFfZi4g7ohZq3TURO9FACkfuYYZE_OTU32oYPJevfN_TBQOxc8X7lIdMFYc_2Y6MCsOoDoEnFM9LlIyib_CJ2DkuR0Qmb30TcioKvyBPdZLijzd1ueqMTJAsKXNu9KUXBPILQ-ByDCQwYdIjDTzuQ6v_beFkaNZhtT1eyORlDYK7qUqHq_eEyTxIpmUpC65bTWhaUtY4rRyag0HSb5_26Kbm3M9uD8Y9ikmtIzO7JZO6EwEipyyvwSlkJzb-R3F3AO1TAGDtjg4hY3pDve7E1pZ19g'
        }
    }
    // response.send(options.url);

    apiRequest(options, function(error, responseApi, body) {
    if (error) throw new Error(error);
    // console.log(body);
    const data = JSON.parse(body);
    //response.send(data);
    const recipes = data.recipes.recipe.slice(0, 10);
    //response.send(recipes);
    response.render('pages/recipes', {recipeResults: recipes});
})};

function saveFood(request, response) {
    console.log('Food Saved');

    let {name, description} = expression.body;

    let SQL = `INSERT INTO food (name, description) VALUES ($1, $2)`;

    let values = [name, description];
    client.query(SQL, values);
    
}
