//Three constantce displayed

const API_KEY = "eaH51Ygb_ZV12jgnisfxv7bgaDI";
const API_URL = "http://ci-jshint.herokuapp.com/api"; //So we don't have to recall the url all the time.
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));// reference modal ryta som tar over skarmen

//wire up buttons, two more function- fetch data and display data.
//standard eventlistener= get element with the ID of status wich is our button - add a click eventlistener- call getStatus function, passing in a (e) wich is a reference to event.
    
document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

//1.Iterate through the options
//2.Push each value into a temporary array
//3.Convert the array back to a string
function processOptions(form) {
    //create a temporary array
    let optArray = [];
    //Use the same code as earlier 
    for (let entry of form.entries()) {
        //first entry is the keyname, if that's equal to options then we are going to push the second value in each entry into my temporary array. opt array dot push and then entry index 1
        if (entry[0] === "options") {
            optArray.push(entry[1]);
        }
    }
    //cool methods of form data to delete all of the existing options and to delete the new ones.
    form.delete("options");
    //append our new options key= options value=optArray join()=convert it back to strings, by default seperated by comas
    form.append("options", optArray.join());

    return form;
}
//async function to await the results of our promise
async function postForm(e) {
    //to get the form data, formData interface =captures all of the fields in a HTML form and return it as an object. =give the object a fetch() and no other promise.
    const form = processOptions(new FormData(document.getElementById("checksform")));

    //from the api key
    //need to await fetch() because it returns a promise. So I need to add in a weight.
    //SECOND ARGUMENT = METHOD
    //How to send the form data to the API? Thanks to formData object = add it into the request just after the headers.
    //That will make a POST request to the API, authorize it with the API key, and attach the form as the body of the request.
    const response = await fetch(API_URL, {
                                method: "POST",
                                headers: {
                                        "Authorization": API_KEY,
        },
                                body: form,
    })
    //convert our respons to JSON and display it
    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }
}    

function displayErrors(data) {

    let results = "";

    let heading = `JSHint Results for ${data.file}`;
    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}:</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    //Display the modal
    resultsModal.show();
}
    //((The formData object has several default methods that allows us to manipulate the data
    //one is entries method = iterate through to see the form entries.
    //for (let e of form.entries())
    //this will iterate through each of the form entries putting it in 'e'.
        //console.log(e);)) =TEST


//GET status function tasks
//1.Make a GET request to the API URL with the API key
//2.Pass the data to a display function (that will display it)

//asynchronous function = Two differant ways of handling a promise -chain ".then"s -wrap the promises in an async function and the await the promise coming true 
async function getStatus(e) {
    //build a query string = URL and the parameters that we need to send over to the API
    //use js templates litteral for easyer to read
    //two variables URL + KEY
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    //Await our response
    const response = await fetch(queryString);
    //when the response comes back we'll need to convert it to json
    //The json() returns a promise, wait for that
    const data = await response.json();

    //Create an if statement to see if our response.pk property is set to True.
    //If it is true = console.log our response.
    //last thing we do is to display data in our modal, instead of consol.log data we'll call the display status function with it instead.
    if (response.ok) {
        displayStatus(data)

        //To only display the date = console.log(data.expiry)
        //console.log(data.expiry);

        //throw a else statement if the response is not okay
    } else  {
        //using the built in js error handler to throw a new error // data.error=descriptive message from the json that's been returned.
        throw new Error(data.error);

    }

    //Create a displayStatus function that takes the parameter of data.
    function displayStatus(data) {

        let heading = "API Key Status";
        let results = `<div>Your key is valid until</div>`;
        results += `<div class="key-status">${data.expiry}</div>`;

        document.getElementById('resultsModalTitle').innerText = heading;
        document.getElementById('results-content').innerHTML = results;

        resultsModal.show();
    }
}

    //HTTP Status code 200 = our request has been successful and the "ok" property will be set to True.
    //Error code = the ok property will be set to false. 
    //1. A function to make the request
    //2. A function to display the data







