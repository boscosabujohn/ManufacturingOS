const { Client } = require('pg');

const client = new Client({
    host: 'ep-sweet-recipe-ailz1ddp-pooler.c-4.us-east-1.aws.neon.tech',
    port: 5432,
    user: 'neondb_owner',
    password: 'npg_WgKoApGEJR54',
    database: 'neondb',
    ssl: true,
});

async function run() {
    try {
        await client.connect();
        console.log('Connected to DB');
        await client.query('DROP TABLE IF EXISTS "boq_items" CASCADE');
        console.log('Table boq_items dropped');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

run();
