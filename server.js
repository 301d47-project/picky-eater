'use strict'

// Environmnet variables
require('dotenv').config();

// Application Dependencies
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const request = require('request')
const fixieRequest = request.defaults({'proxy': process.env.FIXIE_URL});

fixieRequest('http://www.example.com', (err, res, body) => {
  console.log(`Got response: ${res.statusCode}`);
});



// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));


// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// View engine for server-side rendering template (EJS)
app.set('view engine', 'ejs');

// Listen for request to the server 
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// API Routes
app.get('/', loadHomePage);
app.get('/about', loadAboutPage);
app.post('/results', performSearch);
app.get('/cooking', loadInfoPage);
app.post('/get-suggestions', searchSuggestionNew);
app.post('/recipes', getRecipe);
app.get('/saved-recipe', saveRecipe);

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
    response.render('pages/cooking')
}
let suggestions = [];
function searchSuggestionNew(request, response) {
    if (suggestions.length === 0) {
        const query = request.body.expression
        const SQL = `SELECT * FROM food`;

        client.query(SQL)
            .then(result => {
                console.log(query);
                let foods = result.rows[0].item.split(",")
                foods.forEach(food => {
                    suggestions.push(food);
                })
                response.send({ 'suggestions': { 'suggestion': suggestions }})
            })
    } else {
        response.send({ 'suggestions': { 'suggestion': suggestions } })
    }
}

function searchSuggestionOld(request, response) {
    const apiSuggestion = require("request");
    const querySuggestion = request.body.expression;

    const suggestion = {
        method: 'POST',
        url: `https://platform.fatsecret.com/rest/server.api?method="foods.autocomplete"&expression=${querySuggestion}&format=json`,
        headers: { 'content-type': 'application/json' },
        auth: {
            bearer: process.env.BEARER_TOKEN

        }
    }

    apiSuggestion(suggestion, function (error, suggestionApi, body) {
        const data = JSON.parse(body);
        const foods = data;
        console.log(foods);
        response.send({ 'suggestions': { 'suggestion': foods } })
        if (error) throw new Error(error);

    })
};



function loadInfoPage(request, response) {
    response.render('pages/cooking')
}

function performSearch(request, response) {

    const apiRequest = require("request");
    const query = request.body.expression;

    const options = {
        method: 'POST',
        url: `https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=${query}&format=json`,
        headers: { 'content-type': 'application/json' },
        auth: {
            bearer: process.env.BEARER_TOKEN

        }
    }

    apiRequest(options, function (error, responseApi, body) {
        if (error) throw new Error(error);
        const data = JSON.parse(body);
        const foods = data.foods.food.slice(0, 10);
        response.render('pages/results', { searchResults: foods })
    })
};


function getRecipe(request, response) {

    const apiRequest = require("request");
    const query = request.body.expression;
    // console.log('query', query);


    const options = {
        method: 'GET',
        url: `https://platform.fatsecret.com/rest/server.api?method=recipes.search&search_expression=${query}&format=json`,
        headers: { 'content-type': 'application/json' },
        auth: {
            bearer: process.env.BEARER_TOKEN

        }
    }
    // response.send(options.url);

    apiRequest(options, function (error, responseApi, body) {
        if (error) throw new Error(error);
        // console.log(body);
        const data = JSON.parse(body);
        //response.send(data);
        const recipes = data.recipes.recipe.slice(0, 10);
        //response.send(recipes);
        response.render('pages/recipes', { recipeResults: recipes });
    })
};

function saveRecipe(request, response) {
    response.render('pages/saved-recipes');
}
