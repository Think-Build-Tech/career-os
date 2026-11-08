const { Client } = require('pg');

async function main() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'careeros_dev',
    password: 'admin',
    port: 5432,
  });

  try {
    await client.connect();
    const cols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'institutions'
      ORDER BY ordinal_position;
    `);
    console.log('Columns in institutions:');
    console.log(cols.rows);

    const rows = await client.query('SELECT * FROM institutions LIMIT 5;');
    console.log('\nRows in institutions:');
    console.log(rows.rows);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

main();

