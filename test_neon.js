
const { Pool } = require('@neondatabase/serverless');

(async () => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("No DATABASE_URL");
        process.exit(1);
    }
    console.log("Connecting with:", connectionString.substring(0, 15) + "...");

    const pool = new Pool({ connectionString });
    try {
        const client = await pool.connect();
        const res = await client.query('SELECT NOW()');
        console.log("Success:", res.rows[0]);
        client.release();
    } catch (err) {
        console.error("Pool connection failed:", err);
    }
    await pool.end();
})();
