const apiKey = 'i5vVuphQQaxHVUkqqxheX3LnyTWvrXjBg38Ma3RM';
const searchUrl = "https://developer.nps.gov/api/v1/parks";

//standard states submission as needed to adjust for human error. To be developed.
function handleStatesSubmission(states) {
    return states;
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function getParks(states, maxResults){
    // talk to mentor on how to change this to use headers instead. Not clear to me.
    // const options = {
    //     headers: new Headers({
    //         "X-Api-Key": apiKey
    //     })
    // };

    const params = {
        limit: maxResults,
        start: 0,
        stateCode: handleStatesSubmission(states),
        fields: 'addresses',
        'api_key': apiKey 
    };
    console.log(params);

    const queryString = formatQueryParams(params)
    const url = searchUrl + '?' + queryString;  

    //confirm the right way to use headers for auth
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            console.log(responseJson);
            displayResults(responseJson);
        })
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayResults(responseObj){
    $('.search-results').empty();

    //work on a way to make the address more dynamic
    for (let i = 0; i < responseObj.data.length; i++) {
        $('.search-results').append(
            `<li><h3>${responseObj.data[i].name}</h3>
            <p>Address: ${responseObj.data[i].addresses[1].line1}</p>
            <p>Description: ${responseObj.data[i].description}</p>
            <p>Website: <a href="${responseObj.data[i].url}">${responseObj.data[i].url}</p>
            </li>`
        );
    };
    $('.search-results').removeClass('hidden');
}

function formSubmit() {
    $('#js-form').on('submit', function(event) {
        event.preventDefault();
        const searchStates = $('#search-states').val();
        const searchNumber = Math.min(parseInt($('#search-numbers').val(),10),10);
        getParks(searchStates, searchNumber)
    });
}

function handlePage() {
    formSubmit();
}

$(handlePage);