const express = require('express');
const app = express();
const hbrs = require('express-handlebars');
const publicIP = require('public-ip');
const iplocation = require('iplocation').default;

app.engine('handlebars', hbrs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: false }));

app.use(express.static('./views/assets'))

app.get('/', async (req,res) => {
    await publicIP.v4()
    .then((ip) => {
        iplocation(ip)
        .then((location) => {
            res.render('index', 
            {
                scripts: [
                    'homepage.js'
                ],
                ip: {
                    ip: location.ip,
                    city: location.city,
                    link: `${location.country === "IE" ? "WELCOME TO THE GREATEST COUNTRY" : ''}`
                },
                style: 'home.css',
                notice: `${location.country} is your country initials`
            })
        })
        .catch(err => {
            console.log(err)
            res.render('404', {
                style: 'error.css'
            })
        })
    })
    
    .catch(err => console.log(err))
    
    res.locals.metaTags = {
        title : 'Homepage'
    }
})

app.get('/ireland', (req,res) => {
    res.locals.metaTags = {
        title : "WELCOME TO IRELAND"
    }
    res.render('secret', {
        style: 'secret.css'
    })
})

app.get('*', (req, res) => {
    res.locals.metaTags = {
        title: 'Error'
    }
    res.render('404', {
        scripts: [
            'error.js'
        ],
        style: 'error.css'
    })
})


const port = (process.env.PORT || 3000);
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})