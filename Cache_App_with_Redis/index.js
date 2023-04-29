import express from "express";
import { createClient } from "redis";
import request from "request";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const client = createClient();

(async () => {
    client.on("error", (error) => {
        console.log(error);
    });

    client.connect();
})();

app.get("/fish/:species", (req, res) => {

    const species = req.params.species;

        client.get(species)
        .then((data) => {

            if (data != null) {
                res.send(JSON.stringify(data));
            } else {
                const url = `${ process.env.FISH_SPECIES_API }${species}`;

                request(url, (error, response, body) => {
                    if (error) {
                        res.status(500).send("Server Error");
                    } else if (response.statusCode !== 200 ) {
                        res.status(response.statusCode).send("Request Failed");
                    } else if (JSON.parse(body).length) {
                        client.set(species, JSON.stringify(body));
                        res.send(JSON.stringify(body));
                    } else {
                        res.status(404).send("Not found");
                    }
                });
            }
        })
        .catch ((error) => {
            res.status(500).send(error);
        });
});

app.delete('/fish/:species', (req, res) => {
    const species = req.params.species;
        client.del(species)
        .then(response => {
            if (response == 1) {
                res.status(200).send("Deleted");
            } else {
                res.status(404).send("Not Found");
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

app.listen(port);
