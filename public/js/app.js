// var myDoughnutChart = new Chart(ctx, {
//     type: 'doughnut',
//     data = {
//         datasets: [{
//             data: [10, 20, 30]
//         }],
    
//         // These labels appear in the legend and in the tooltips when hovering different arcs
//         labels: [
//             'Red',
//             'Yellow',
//             'Blue'
//         ]
//     },
//     options: options
// });
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