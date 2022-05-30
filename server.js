const express = require('express')
const app = express()
const https = require('https')
const cors = require('cors')
const path = require('path')
const bcrypt = require('bcrypt')
app.use(cors())
app.set('view engine', 'ejs')
const bodyparser = require("body-parser")
const mongoose = require('mongoose')
var session = require('express-session')
const {
    runInNewContext
} = require('vm')

app.use(session({
    secret: 'ljkdghfoh',
    saveUninitialized: true,
    resave: true
}))

app.use(bodyparser.urlencoded({
    extended: true
}))

mongoose.connect("mongodb+srv://andyhplau:comp1537@cluster-comp1537-assign.679wm.mongodb.net/2537-assignments?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const timeeventSchema = new mongoose.Schema({
    text: String,
    time: String,
    hits: Number
});

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    password: String,
    admin: Boolean
})

const orderSchema = new mongoose.Schema({
    userId: String,
    pokemonId: Number,
    pokemonName: String,
    price: Number,
    quantity: Number,
    total: Number,
    status: String,
    checkoutTime: String,
    orderId: String
})

const timeeventModel = mongoose.model("timeevents", timeeventSchema);
const userModel = mongoose.model("users", userSchema)
const orderModel = mongoose.model("orders", orderSchema)

app.listen(process.env.PORT || 5002, (err) => {
    if (err)
        console.log(err)
})

app.get('/', auth, function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'))
})

app.use(express.static('./public'))

// Middleware

function auth(req, res, next) {
    if (req.session.authenticated) {
        next()
    } else {
        res.redirect('/login')
    }
}

function authAdmin(req, res, next) {
    if (req.session.admin) {
        next()
    } else {
        res.redirect('/login')
    }
}

// Sign up

app.get('/signup', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/signup.html'))
})

app.put('/signup/create', function (req, res) {
    userModel.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        admin: req.body.admin
    }, function (err, data) {
        if (err) {
            console.log('Error' + err)
        } else {
            console.log('Data' + data)
        }
        res.sendFile(path.join(__dirname + '/public/login.html'))
    })
})

// login

app.get('/login', function (req, res) {
    console.log(req.session.authenticated)
    if (req.session.authenticated && req.session.admin) {
        res.redirect('/admin')
    } else if (req.session.authenticated && !req.session.admin) {
        res.redirect('/profile')
    } else {
        res.sendFile(path.join(__dirname + '/public/login.html'))
    }
})

app.post('/login/authentication', function (req, res) {
    userModel.find({}, function (err, users) {
        if (err) {
            console.log('Error' + err)
        } else {
            console.log('Data' + users)
        }

        user = users.filter((userObj) => {
            return userObj.username == req.body.username
        })

        if (user[0].password == req.body.password && user[0].admin) {
            req.session.authenticated = true
            req.session.admin = user[0].admin
            req.session.userObj = {
                userId: user[0]._id,
                username: user[0].username,
                firstname: user[0].firstname,
                lastname: user[0].lastname,
                email: user[0].email
            }
            res.send('admin')
        } else if (user[0].password == req.body.password && !user[0].admin) {
            req.session.authenticated = true
            req.session.admin = user[0].admin
            req.session.userObj = {
                userId: user[0]._id,
                username: user[0].username,
                firstname: user[0].firstname,
                lastname: user[0].lastname,
                email: user[0].email
            }
            res.send('user')
        } else {
            req.session.authenticated = false
            res.send('fail')
        }
    })
})

// Admin

app.get('/admin', authAdmin, function (req, res) {
    res.sendFile(path.join(__dirname + '/public/admin.html'))
})

app.post('/admin/newUser', function (req, res) {
    console.log(req.body)
    userModel.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        admin: req.body.admin
    }, function (err, data) {
        if (err) {
            console.log('Error' + err)
        } else {
            console.log('Data' + data)
        }
        if (req.body.admin == 'true') {
            res.send('New admin user created!')
        } else {
            res.send('New user created!')
        }
    })
})

app.get('/admin/findUsers', function (req, res) {
    userModel.find({}, function (err, users) {
        if (err) {
            console.log('Error' + err)
        } else {
            console.log('Users' + users)
        }

        resUsers = users.filter((userObj) => {
            return userObj._id != req.session.userObj.userId
        })
        res.send(resUsers)
    })
})

app.post('/admin/findUser', function (req, res) {
    userModel.findById(req.body.userId,
        async function (err, user) {
            if (err) {
                console.log('Error' + err)
            } else {
                console.log('Users' + user)
            }
            user.password = await bcrypt.hash(user.password, 12)
            res.send(user)
        })
})

app.post('/admin/updateUser', function (req, res) {
    userModel.updateOne({
        _id: req.body.userId
    }, {
        $set: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            admin: req.body.admin
        }
    }, function (err, user) {
        if (err) {
            console.log('Error' + err)
        } else {
            console.log('Users' + user)
        }
        res.send('User info updated!')
    })
})

// other routes

app.get('/userObj', function (req, res) {
    res.send(req.session.userObj)
})


app.get('/profile', function (req, res) {
    if (req.session.authenticated) {
        res.sendFile(path.join(__dirname + '/public/profile.html'))
    } else {
        res.redirect('/login')
    }
})

app.get('/search', function (req, res) {
    if (req.session.authenticated) {
        res.sendFile(path.join(__dirname + '/public/search.html'))
    } else {
        res.redirect('/login')
    }
})

app.get('/cart', function (req, res) {
    if (req.session.authenticated) {
        res.sendFile(path.join(__dirname + '/public/cart.html'))
    } else {
        res.redirect('/login')
    }
})

app.put('/cart/add', function (req, res) {
    orderModel.create({
        userId: req.session.userObj.userId,
        pokemonId: req.body.pokemonId,
        pokemonName: req.body.pokemonName,
        price: req.body.price,
        quantity: 1,
        total: req.body.price,
        status: 'cart',
        checkoutTime: null,
        orderId: null
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Added to cart!");
    })
})

app.get('/cart/item', function (req, res) {
    orderModel.find({}, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        userItems = data.filter((items) => {
            return (items.userId == req.session.userObj.userId) && (items.status == 'cart')
        })
        res.send(userItems)
    })
})

app.post('/cart/update', function (req, res) {
    orderModel.updateOne({
        _id: req.body.uniqueId,
    }, {
        $set: {
            quantity: req.body.quantity,
            total: req.body.total
        }
    }, function (err, data) {
        if (err) {
            console.log("Error " + err)
        } else {
            console.log("Data " + data)
        }
    })
    orderModel.find({}, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        userItems = data.filter((items) => {
            return (items.userId == req.session.userObj.userId) && (items.status == 'cart')
        })
        res.send(userItems)
    })
})

app.post('/cart/checkout', function (req, res) {
    orderModel.updateOne({
        $and: [{
                userId: req.body.userId
            },
            {
                status: 'cart'
            }
        ]
    }, {
        $set: {
            status: 'ordered',
            checkoutTime: req.body.time,
            orderId: req.body.time
        }
    }, function (err, data) {
        if (err) {
            console.log("Error " + err)
        } else {
            console.log("Data " + data)
        }
        res.send(data)
    })
})

app.post('/cart/remove', function (req, res) {
    orderModel.remove({
        _id: req.body.itemId,
    }, function (err, data) {
        if (err) {
            console.log("Error " + err)
        } else {
            console.log("Data " + data)
        }
    })
    orderModel.find({}, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        userItems = data.filter((items) => {
            return (items.userId == req.session.userObj.userId) && (items.status == 'cart')
        })
        res.send(userItems)
    })
})

app.get('/cart/orders', function (req, res) {
    orderModel.find({}, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        orderedItems = data.filter((items) => {
            return (items.userId == req.session.userObj.userId) && (items.status == 'ordered')
        })
        res.send(orderedItems)
    })
})

app.put('/timeline/insert', function (req, res) {
    console.log(req.body)
    timeeventModel.create({
        text: req.body.text,
        time: req.body.time,
        hits: req.body.hits
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Insertion successful!");
    });
});

app.get('/timeline/read', function (req, res) {
    timeeventModel.find({}, function (err, data) {
        if (err) {
            console.log("Error" + err)
        } else {
            console.log("Data" + data)
        }
        res.send(data)
    })
})

app.get('/timeline/incrementHits/:id', function (req, res) {
    timeeventModel.updateOne({
        _id: req.params.id,
    }, {
        $inc: {
            hits: 1
        }
    }, function (err, data) {
        if (err) {
            console.log("Error " + err)
        } else {
            console.log("Data " + data)
        }
        res.send("Update successful!")
    })
})

app.get('/timeline/delete/:id', function (req, res) {
    timeeventModel.remove({
        _id: req.params.id,
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Delete successful!");
    });
});

app.get('/pokemon/:id', function (req, res) {
    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`
    data = '';

    https.get(url, (https_res) => {
        https_res.on('data', (chunk) => {
            data += chunk
        })

        https_res.on('end', () => {
            data = JSON.parse(data)

            pokemonAbilities = data.abilities.map((abilityObj) => {
                return abilityObj.ability.name
            })

            pokemonType = data.types.map((typeObj) => {
                return typeObj.type.name
            })

            pokemonHp = data.stats.filter((statsObj) => {
                return statsObj.stat.name == 'hp'
            }).map((hpObj) => {
                return hpObj.base_stat
            })

            pokemonAttack = data.stats.filter((statsObj) => {
                return statsObj.stat.name == 'attack'
            }).map((attackObj) => {
                return attackObj.base_stat
            })

            pokemonDefense = data.stats.filter((statsObj) => {
                return statsObj.stat.name == 'defense'
            }).map((defenseObj) => {
                return defenseObj.base_stat
            })

            pokemonSpeed = data.stats.filter((statsObj) => {
                return statsObj.stat.name == 'speed'
            }).map((speedObj) => {
                return speedObj.base_stat
            })

            res.render('pokemon.ejs', {
                'id': data.id,
                'name': data.name.toUpperCase(),
                'img_path': data.sprites.other["official-artwork"]["front_default"],
                'ability': pokemonAbilities,
                'type': pokemonType,
                'hp': pokemonHp,
                'attack': pokemonAttack,
                'defense': pokemonDefense,
                'speed': pokemonSpeed,
                'height': data.height,
                'weight': data.weight,
                'price': data.weight
            })
        })
    })
})

// logout

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
})