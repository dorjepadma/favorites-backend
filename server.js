require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// Database Client
const client = require('./lib/client');
const request = require('superagent');
// Services

// Application Setup
const app = express();
app.use(morgan('dev')); // http logging
app.use(cors()); // enable CORS request
app.use(express.static('public')); // server files from /public folder
app.use(express.json()); // enable reading incoming json data
app.use(express.urlencoded({ extended: true }));
// Auth
const ensureAuth = require('./lib/auth/ensure-auth');
const createAuthRoutes = require('./lib/auth/create-auth-routes');
const authRoutes = createAuthRoutes({
    async selectUser(email) {
        const result = await client.query(`
            SELECT id, email, hash,
            FROM users
            WHERE email = $1;
        `, [email]);
        return result.rows[0];
    },
    async insertUser(user, hash) {
        console.log(user);
        const result = await client.query(`
            INSERT into users (email, hash,)
            VALUES ($1, $2,)
            RETURNING id, email;
        `, [user.email, hash, user.displayName]);
        return result.rows[0];
    }
});
app.post('/api/swapi', async (req, res) => {
    try {
        const data = await request.get(`https://swapi.com/api/people/?search=$(req.query.search)`);

        res.json(data.body);
    } catch (e) {
        console.error(e);
    }
});

// setup authentication routes
app.use('/api/auth', authRoutes);
// everything that starts with "/api" below here requires an auth token!
app.use('/api/my', ensureAuth);

app.get('api/my/favorites', async (req, res) => {
    try {
        const myQuery = `
    SELECT * FROM favorites
    WHERE user_id=$1
    `;
        const favorites = await client.query(myQuery, [req.userId]);
    
        res.json(favorites.rows);
    } catch (e) {
        console.error(e);
    }
});
app.post('/api/my/favorites', async (req, res) => {
    try {
        const {
            name,
            weight,
            homeworld,
        } = req.body;

        const newFavorites = await client.query(`
        INSERT INTO favorites (name, weight, homeworld, user_id)
        values ($1, $2, $3, $4)
        returning *
        `, [
            name,
            weight,
            homeworld,
            req.userId,
        ]);

        res.json(newFavorites.rows[0]);
    } catch (e) {
        console.error(e);
    }
});

// *** API Routes ***
app.get('/api/swapi', async (req, res) => {
    try {
        const data = await request.get(`https://swapi.co/api/people/?search=${req.query.search}`);

        res.json(data.body);
    } catch (e) {
        console.error(e);
    }
});

app.listen(process.env.PORT, () => {
    console.log('listening at ', process.env.PORT);
});