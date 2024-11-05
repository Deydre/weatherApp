const express = require('express');
// Importar el middleware body-parser
// Sirve para hacer uso del req.body
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

// Importar .env
require('dotenv').config();


// Para que se vea la carpeta public
app.use(express.static('public'));
// Para habilitar el middleware body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    // Aquí se une con la vista y busca index.ejs
    // Se una res.render en vez de res.send porque es un lenguaje de plantilla
    res.render('index')
})

// app.post('/', function (req, res) {
//     res.render('index');
//     console.log(req.body.city);
// })


app.post('/', function (req, res) {
    // Recibimos la ciudad por body (formulario)
    let city = req.body.city;
    // Definimos el endpoint
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${process.env.API_KEY}`

  request(url, function (err, response, body) {
    // Checkeamos errores
      if(err){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        let weather = JSON.parse(body)
        // Checkeamos si el user ha puesto cosas erróneas
        if(weather.main == undefined){
          res.render('index', {weather: null, error: 'Error, please try again'});
        } else {
            // Si está ok, damos la info
          let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
          res.render('index', {weather: weatherText, error: null});
        }
      }
    });
  })

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})