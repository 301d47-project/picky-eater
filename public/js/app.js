function createChart(id) {

    if (document.getElementById(id)) {

        const foodDescription = document.getElementById(id).dataset.info;
        const foodData = foodDescription.match(/\d+\.?\d/g).slice(1);
        console.log(foodData);

        new Chart(document.getElementById(id), {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        backgroundColor: [ "crimson", "crimson", "#8e5ea2", "green"],
                        data: foodData
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                }
            }
        });
    }
}

for(chartNum = 0; chartNum < 10; chartNum++) {
    createChart('chart-' + chartNum);
}

$("#search").focus().keydown(function() {
    console.log('keydown');
    if ($('#search').val().length > 3) {
        // console.log($('#search').val().length);
        // console.log('String of val: ', $('#search').val())
        // searchSuggestion();
        $.post('/suggestion', {expression: $('#search').val() })
        .then(results => {
            console.log('Results: ', results);
            return results;
        })
        .catch(error => {
            console.error(error);
        })
    }
})

    



$(document).ready(function() {
    console.log('Doc is ready');    
 });