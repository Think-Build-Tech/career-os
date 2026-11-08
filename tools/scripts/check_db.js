const { Client } = require('pg');

async function checkCounts(dbName) {
  console.log(`\n========================================`);
  console.log(` Database: ${dbName}`);
  console.log(`========================================`);

  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: dbName,
    password: 'admin',
    port: 5432,
  });

  try {
    await client.connect();

    const tables = [
      'tenants',
      'tenant_databases',
      'subscriptions',
      'tenant_provisioning_jobs',
      'platform_admins',
      'global_users',
      'institutions',
      'departments',
      'programs',
      'cohorts',
      'users',
      'student_profiles',
      'companies',
      'job_opportunities',
      'placement_seasons'
    ];

    for (const t of tables) {
      try {
        const res = await client.query(`SELECT count(*)::int as cnt FROM "${t}";`);
        console.log(`  • ${t.padEnd(26)} : ${res.rows[0].cnt} rows`);
      } catch (err) {
        console.log(`  • ${t.padEnd(26)} : [Table not in this DB: ${err.message}]`);
      }
    }
  } finally {
    await client.end();
  }
}

async function main() {
  await checkCounts('careeros_dev');
  await checkCounts('careeros_sitrc');
}

main();