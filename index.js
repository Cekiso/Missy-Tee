const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// enable the static folder...
app.use(express.static('public'));

//Token
app.post('/api/login', function(req, res) {
    const user = {
        username: "Nkulie"
    }
    jwt.sign({ user: user }, 'secretkey', (err, token) => {
        res.json({
            token: token
        })
    });
})
app.get('/api/posts', function(req, res) {
    res.json({
        message: 'garments added'

    })
})

//Token

// import the dataset to be used here
const garments = require('./garments.json');
// import the dataset to be used here

app.get('/api/garments', function(req, res) {

    const gender = req.query.gender;
    const season = req.query.season;

    const filteredGarments = garments.filter(garment => {
        // if both gender & season was supplied
        if (gender != 'All' && season != 'All') {
            return garment.gender === gender &&
                garment.season === season;
        } else if (gender != 'All') { // if gender was supplied
            return garment.gender === gender
        } else if (season != 'All') { // if season was supplied
            return garment.season === season
        }
        return true;
    });

    // note that this route just send JSON data to the browser
    // there is no template
    res.json({
        garments: filteredGarments
    });
});
app.get('/api/garments/price/:price', function(req, res) {
    const maxPrice = Number(req.params.price);
    const filteredGarments = garments.filter(garment => {
        // filter only if the maxPrice is bigger than maxPrice
        if (maxPrice > 0) {
            return garment.price <= maxPrice;
        }
        return true;
    });

    res.json({
        garments: filteredGarments
    });
});

app.post('/api/garments', (req, res) => {

    // get the fields send in from req.body
    const {
        description,
        img,
        gender,
        season,
        price
    } = req.body;

    // add some validation to see if all the fields are there.
    // only 3 fields are made mandatory here
    // you can change that


    if (!description) {
        res.json({
            status: 'error',
            message: 'Description required data not supplied',
        });
    } else if (!img) {
        res.json({
            status: 'error',
            message: 'Image is required data not supplied',
        });
    } else if (!gender) {
        res.json({
            status: 'error',
            message: 'Gender required data not supplied',
        });

    } else if (!price) {
        res.json({
            status: 'error',
            message: 'Price required data not supplied',
        });
    } else if (!season) {
        res.json({
            status: 'error',
            message: 'season required data not supplied',
        });
    } else {

        // you can check for duplicates here using garments.find
        const duplicate = garments.find(function(garments) {
            if (garments.img == img && garments.price == price && garments.description == description && garments.season == season) {
                const duplicateItem = JSON.stringify(garments)
                return duplicateItem
            }

        })
        if (duplicate == undefined) {


            // add a new entry into the garments list
            garments.push({
                description,
                img,
                gender,
                season,
                price
            });
        } else {
            res.json({
                status: 'success',
                message: 'The garmet is already added',
            });
        }
    }
    res.json({
        status: 'success',
        message: 'New garment added.',
    });


});



const PORT = process.env.PORT || 4000;

// API routes to be added here

app.listen(PORT, function() {
    console.log(`App started on port ${PORT}`)
});