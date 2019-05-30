function createChart(id) {

    if (document.getElementById(id)) {

        const foodDescription = document.getElementById(id).dataset.info;
        const foodData = foodDescription.match(/\d+\.?\d/g).slice(2);
        console.log(foodData);

        new Chart(document.getElementById(id), {
            type: 'doughnut',
            data: {
                labels: ['fat', 'carbs', 'protein'],

                datasets: [
                    {
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(75, 192, 192, 0.5)'
                          ],      
                          borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(75, 192, 192, 0.5)'
                          ],                  
                          
                          data: foodData
                    }
                ]
            },
            options:	{
                segmentShowStroke : true,
                segmentStrokeColor : "#fff",
                segmentStrokeWidth : 2,
                percentageInnerCutout : 50,
                animationSteps : 100,
                animationEasing : "easeOutBounce",
                animateRotate : true,
                animateScale : false,
                responsive: true,
                maintainAspectRatio: true,
                showScale: true,
                animateScale: true,
                legend: {
                    display: false
                 }
            },
           
        });
    }
}

for(chartNum = 0; chartNum < 10; chartNum++) {
    createChart('chart-' + chartNum);
}

$("#search").focus().keyup(function() {
   
    if ($('#search').val().length > 1) {
        // console.log($('#search').val().length);
        // console.log('String of val: ', $('#search').val())
        $.post('/get-suggestions', {expression: $('#search').val() })
        .then(results => {
            console.log(results);
            $( "#search" ).autocomplete({
                source: results.suggestions.suggestion
              });
        })
        .catch(error => {
            console.error(error);
        })
    }
});


// Saves recipes to local storage to be shown on Saved Recipes page
$('.recipesave').click(function(event) {
    console.log('Save clicked');
    event.preventDefault();
    recipeObject = JSON.parse(localStorage.getItem('Recipes Saved'));
    if (!recipeObject) {
        recipeObject = {};
    }
    const recipeName = $(event.target).data('name');
    const recipeLink = $(event.target).data('url');
    recipeObject[recipeName] = recipeLink;
    localStorage.setItem('Recipes Saved', JSON.stringify(recipeObject));
});

// Grabs previosly saved recipes from local storage and makes a 2-D array of them when 
// button is clicked. 
const parseRecipes = JSON.parse(localStorage.getItem('Recipes Saved'));
const savedRecipes = Object.entries(parseRecipes);


function toHtml(info) {
    let template = $('#recipe-template').html();
    let templateRender = Handlebars.compile(template);
    return templateRender(info);
}



// function loadRecipes() = {

// } 

$('#show-recipes').click(function(event) {
    event.preventDefault();
    console.log('Button hit');
    console.log(savedRecipes);
    for (let [parseRecipes, url] of savedRecipes) { 
        let recipeInfo = {'name': parseRecipes, url};
        // savedRecipes.forEach(showRecipe => {
            $('#container').append(toHtml(recipeInfo));
        // });
        console.log('Parse: ', parseRecipes);
        console.log('url: ', url);
    }

})

$(document).ready(function(){
    $(this).scrollTop(0);
});