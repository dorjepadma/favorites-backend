const client = require('../lib/client');

run();

async function run() {

    try {
       
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(256) NOT NULL,
                hash VARCHAR(512) NOT NULL,
                display_name VARCHAR(256) NOT NULL
            );
        
            CREATE TABLE favorites (
                id SERIAL PRIMARY KEY,
                name VARCHAR(256) NOT NULL,
                hair_color VARCHAR(256) NOT NULL,
                eye_color VARCHAR(256) NOT NULL,
                user_id INTEGER NOT NULL REFERENCES users(id)
            );
        `);

        console.log('create tables complete');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }
    
}