// Client side JS
// We will use Fetch for JS requests


// fetch data from JSON http request
// the response is stored in response
fetch("http://puzzle.mead.io/puzzle").then((response)=>{
    // response is parsed to json and stored in data
    response.json().then((data)=>{
        console.log(data.puzzle)
    })
})

// fetch("http://localhost:3000/weather/?address=Boston").then((response)=>{
//     response.json().then((data)=>{
//         if(data.error){
//             console.log(data.error)
//         }
//         else{
//             console.log(data.forecast)
//             console.log(data.address)
//             console.log(data.temperature)
//         }
        
//     })
// })

const weatherform = document.querySelector("form");
const weatherInput = document.querySelector("input")
const pLocation = document.querySelector("#p-location")
const pForecast = document.querySelector("#p-forecast")



weatherform.addEventListener("submit", (e)=>{
    e.preventDefault()
    let address = `http://localhost:3000/weather/?address=${weatherInput.value}`
    pForecast.textContent = "Loading";
    // pForecast.textContent = "Loading";

    fetch(address).then((response)=>{
        response.json().then((data)=>{
            if(data.error){
                pForecast.textContent = data.error
                // console.log(data.error)
            }
            else{
                pLocation.textContent = data.address;
                pForecast.textContent = data.forecast;
                // console.log(data.forecast)
                // console.log(data.address)
                // console.log(data.temperature)
            }
            
        })
    })
})

// console.log(pLocation.value)
