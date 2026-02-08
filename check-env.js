#!/usr/bin/env node

/**
 * Check if .env.local is configured correctly
 * Run: node check-env.js
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');

console.log('🔍 Checking .env.local configuration...\n');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('   Run: node setup-env.js');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

let hasDatabaseUrl = false;
let databaseUrlValue = '';
let isEmpty = false;

for (const line of lines) {
  const trimmed = line.trim();
  
  // Skip comments and empty lines
  if (trimmed.startsWith('#') || trimmed === '') {
    continue;
  }
  
  // Check for DATABASE_URL
  if (trimmed.startsWith('DATABASE_URL=')) {
    hasDatabaseUrl = true;
    databaseUrlValue = trimmed.replace('DATABASE_URL=', '').trim();
    
    if (databaseUrlValue === '' || databaseUrlValue === 'dummy') {
      isEmpty = true;
    }
    break;
  }
}

console.log('📄 File Status:');
console.log(`   File exists: ✅`);
console.log(`   DATABASE_URL found: ${hasDatabaseUrl ? '✅' : '❌'}`);

if (hasDatabaseUrl) {
  if (isEmpty) {
    console.log('\n❌ DATABASE_URL is empty or not set!');
    console.log('\n📝 How to fix:');
    console.log('   1. Open .env.local in your editor');
    console.log('   2. Get a database connection string:');
    console.log('      🌟 Neon (Free): https://console.neon.tech');
    console.log('      🌟 Supabase (Free): https://supabase.com');
    console.log('      💻 Local: postgresql://postgres:password@localhost:5432/todo_db');
    console.log('   3. Add your connection string:');
    console.log('      DATABASE_URL=postgresql://user:pass@host:port/dbname');
    console.log('   4. Restart your dev server');
  } else if (databaseUrlValue.includes('dummy')) {
    console.log('\n❌ DATABASE_URL is set to dummy (not configured)');
    console.log('   Please update it with a real database connection string');
  } else {
    console.log(`\n✅ DATABASE_URL is set`);
    console.log(`   Value: ${databaseUrlValue.substring(0, 50)}...`);
    console.log('\n💡 If you\'re still getting connection errors:');
    console.log('   1. Verify the connection string is correct');
    console.log('   2. Make sure the database is accessible');
    console.log('   3. Restart your dev server after changes');
  }
} else {
  console.log('\n❌ DATABASE_URL not found in .env.local');
  console.log('   Make sure you have a line like: DATABASE_URL=...');
}

console.log('');

