import express from "express";
import request from "request";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/current/:city', (req, res) => {

    const url = `${ process.env.CURRENT_WEATHER_API }?q=${ req.params.city }&appid=${ process.env.API_KEY }&units=metric`;

    request(url, (err, response, body) => {
        if (err) {
            res.send(err);
        } else {
            const data = JSON.parse(body);
            const current = {
              temperature: data.main.temp,
            };
            res.send(current);
        }
    });
});

app.get('/daily/:city', (req, res) => {
  
    const url = `${ process.env.DAILY_WETAHER_API }?q=${ req.params.city }&appid=${ process.env.API_KEY }&units=metric`;
  
    request(url, (err, response, body) => {
      if (err) {
        res.send(err);
      } else {
        const data = JSON.parse(body);
        const dailyForecasts = data.list.map(daily => {
          return {
            date: daily.dt_txt,
            temperature: daily.main.temp,
          }
        });
        res.send(dailyForecasts);
      }
    });
  });
  
app.listen(port);