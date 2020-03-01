const client = require('../lib/client');

run();

async function run() {

    try {

        await client.query(`
            DROP TABLE IF EXISTS favorites;
            DROP TABLE IF EXISTS users;
        `);

        console.log('drop tables complete');
    }
    catch (err) {
       
        console.log(err);
    }
    finally {
        
        client.end();
    }
    
}