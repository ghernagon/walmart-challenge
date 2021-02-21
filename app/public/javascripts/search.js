var spinner = $('#loader');
$(function () {    
    var data = { term: location.search.split('term=')[1] };
    spinner.css('display', 'flex');
    $.ajax({
        url: 'search',
        data: data,
        method: 'post'
    }).done((resp) => {
        $('#results').html(resp.render);
    }).fail((error) => {
        console.log('error', data);
    }).always( () => {
        spinner.fadeOut();
    });
});