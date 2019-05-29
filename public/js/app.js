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

$("#search").focus().keyup(function() {
   
    console.log('keydown');
    if ($('#search').val().length > 1) {
        console.log($('#search').val().length);
        console.log('String of val: ', $('#search').val())
        $.post('/get-suggestions', {expression: $('#search').val() })
        .then(results => {
            $( "#search" ).autocomplete({
                source: results.suggestions.suggestion
              });
        })
        .catch(error => {
            console.error(error);
        })
    }
})


    



$(document).ready(function(){
    $(this).scrollTop(0);
});