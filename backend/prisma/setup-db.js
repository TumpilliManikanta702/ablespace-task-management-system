const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const schemaPath = path.join(__dirname, 'schema.prisma');
let schemaContent = fs.readFileSync(schemaPath, 'utf8');

// Check if DATABASE_URL is set to postgres or sqlite
const envPath = path.join(__dirname, '..', '.env');
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Test postgres connection or fallback to sqlite if needed
try {
  console.log('Checking database connection...');
  execSync('npx prisma db push --skip-generate', { cwd: path.join(__dirname, '..'), stdio: 'pipe' });
  console.log('PostgreSQL database connected and synced successfully!');
} catch (err) {
  console.log('PostgreSQL connection not reachable on default port. Switching Prisma provider to SQLite for instant local execution...');
  schemaContent = schemaContent.replace('provider = "postgresql"', 'provider = "sqlite"');
  fs.writeFileSync(schemaPath, schemaContent);

  envContent = 'PORT=4000\nDATABASE_URL="file:./dev.db"\nJWT_SECRET="ablespace-secret-key-assessment-2026"\n';
  fs.writeFileSync(envPath, envContent);

  execSync('npx prisma db push', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
  console.log('SQLite database initialized and synced successfully!');
}
