function createChart(id) {

    if (document.getElementById(id)) {

        const foodDescription = document.getElementById(id).dataset.info;
        const foodData = foodDescription.match(/\d+\.?\d/g).slice(2);
        console.log(foodData);

        new Chart(document.getElementById(id), {
            type: 'doughnut',
            data: {
                // labels: ['calories', 'fat', 'carbs', 'protein'],

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
                animateScale: true
            }
        });
    }
}

for(chartNum = 0; chartNum < 10; chartNum++) {
    createChart('chart-' + chartNum);
}

$('#search').focus().keydown(function() {
    console.log('keydown');
    if ($('#search').val().length > 3) {
        console.log($('#search').val().length);
        console.log('String of val: ', $('#search').val())
        $.post('/suggestion', {expression: $('#search').val() })
        .then(results => {
            console.log('Results: ', results);
            return results;
        })
        .catch(error => {
            console.error(error);
        })
    }
});

$('.recipesave').click(function() {
    console.log('Save clicked');
    // $.post('/compare', {expression: food_name, food_description})

});



$(document).ready(function(){
    $(this).scrollTop(0);
});