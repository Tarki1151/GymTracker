import postgres from 'postgres';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const runMigration = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  const sql = postgres(process.env.DATABASE_URL);

  console.log('Running migrations...');
  
  try {
    // Read the SQL file
    const migrationFile = path.join(process.cwd(), 'drizzle', '0000_initial.sql');
    const migrationSQL = fs.readFileSync(migrationFile, 'utf8');

    // Execute the SQL
    await sql.unsafe(migrationSQL);
    
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await sql.end();
  }
};

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
