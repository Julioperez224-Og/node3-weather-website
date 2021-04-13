// path module
const path = require("path")
// path.join combines the director and you can search through the director with the dot notation

const express = require("express");
const app = express();
const hbs = require("hbs")
const request = require("request");
const geocode = require("../src/utils/geocode");
const forecast = require("../src/utils/forecast");
// ------------------------------ Advanced Templating ---------------------------------------------
    // Use hbs / create two new folders in templates. 
    // Fire template folder call views and second partials
        // views folder will holder the hbs links
        // 
// console.log(path.join(__dirname, "../public"))

// if you are attempting to create a template folder, you need to create a new path
// ---------------------------------Define Paths for Express Configs -------------------------------------------------
const publicDirectorPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname,"../templates/partials");


// You then need to tell node to look for the path
// set to view engine allows hbs modules be stored in the view folder
// -----------------------------------Setup Handlebars Engine and Views Locations--------------------------------------
app.set("view engine", "hbs")
app.set("views", viewsPath)
hbs.registerPartials(partialPath);

// Express.static will load the html file found in the public folder 
// index.html does not have to be specified as it has a special meaning
// -----------------------------------Setup static directory to serve ------------------------------------------------
app.use(express.static(publicDirectorPath))



app.get("/", (req,res) => {
    // render the index.hbs page stored in view
    res.render("index", {
        title: "Weather App",
        name: "Julio Perez"
    })
    // 
})

app.get("/about", (req,res)=>{
    res.render("about", {
        title:"About",
        name:"Julio Perez"
    })
})

app.get("/help", (req,res)=>{
    res.render("help",{
        title: "Help",
        message: "If you need help you came to the right place.",
        name:"Julio Perez"
    })
})
app.get("/weather", (req,res)=>{
    // checks to see if a query was sent to address if not return the json error
    if(!req.query.address){
        // Used a return to stop the code from running
        return res.send({
            "error":"please enter an address"
        })
    }
    // Run geocode to get the lat,long and location
    //  ={} will set the default param to an object. fixes the error of missing params
    geocode(req.query.address, (error, {latitude,longitude,location} = {})=>{
       
        // check if there is an error trying to retrieve data
        if(error){
            return res.send({
                error
            })
        } 
        else{
            // Callback chaining 
            // Add a function and use the data provided by the previous callback in order to obtain a new callback return
            
            // location and current are objects called from the callback function
            forecast(latitude,longitude, (error, {location, current}) => {
                if(error){
                    return res.send({
                        error
                    })
                }
                else{
                    // data object is the data returned from geocode
                    // console.log(data.location)
                    // forecastData object is the data returned from the forecast function
                    // console.log(forecastData.region)
                    // console.log(forecastData.country)
                    // console.log(forecastData.temp)
                    // console.log(forecastData.precip)

                    const {name, country,region,localtime} = location;
                    const {weather_descriptions,temperature,precip} = current;

                    res.send({
                        forecast: `Today is ${weather_descriptions[0]} in ${name}, ${region}. The temperature is ${temperature} degrees with a ${precip}% chance of rain.`,
                        name,
                        region,
                        country,
                        weather_descriptions,
                        temperature,
                        precip,
                        address:req.query.address
                    })

                    
                    
                    // console.log(`In ${name}, ${region}, ${country}`)
                    // console.log(`The weather is ${weather_descriptions[0]} out. It is currently ${temperature} degrees with ${precip}% chance of rain.`)
    
                }
            })
        }
    })

    // res.send(geocode(req.query.address, ()=>{}));
})



app.get("/help/*", (req,res)=>{
    res.render("404",{
        title: "article",
        message: "article not found",
        name: "Julio Perez"
    })
    
})

app.get("*", (req,res)=>{
    res.render("404",{
        title:"Error",
        message:"Page not found",
        name: "Julio Perez"
    })
})




app.listen(3000, (error)=>{
    if(!error){
        console.log("Server connected");
    }
    else{
        console.log("Connection Error", error);
    }
})