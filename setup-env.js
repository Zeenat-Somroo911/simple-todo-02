#!/usr/bin/env node

/**
 * Setup script to create .env.local file
 * Run: node setup-env.js
 */

const fs = require('fs');
const path = require('path');

const envContent = `# Database Configuration
# Replace the DATABASE_URL below with your actual database connection string

# Option 1: Neon Database (Free - Recommended)
# Get connection string from: https://console.neon.tech
# Sign up for free at: https://console.neon.tech
# After creating a project, copy the connection string and paste it below
# DATABASE_URL=postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require

# Option 2: Local PostgreSQL
# If you have PostgreSQL installed locally:
# DATABASE_URL=postgresql://postgres:your_password@localhost:5432/todo_db

# Option 3: Supabase (Free - Alternative)
# Get connection string from: https://supabase.com
# DATABASE_URL=postgresql://postgres.xxx.supabase.co:5432/postgres

# IMPORTANT: Uncomment and update ONE of the DATABASE_URL lines above
# Remove the # and replace with your actual connection string
DATABASE_URL=

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
`;

const envPath = path.join(__dirname, '.env.local');

try {
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local already exists!');
    console.log('   If you want to recreate it, delete it first and run this script again.');
    process.exit(0);
  }

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file!');
  console.log('');
  console.log('📝 Next steps:');
  console.log('   1. Open .env.local in your editor');
  console.log('   2. Get a database connection string:');
  console.log('      - Neon (recommended): https://console.neon.tech');
  console.log('      - Supabase: https://supabase.com');
  console.log('      - Or use local PostgreSQL');
  console.log('   3. Paste your DATABASE_URL in the file');
  console.log('   4. Remove the # from the DATABASE_URL line');
  console.log('   5. Restart your dev server (npm run dev)');
  console.log('');
} catch (error) {
  console.error('❌ Error creating .env.local:', error.message);
  process.exit(1);
}

