#!/bin/bash

# D1 Database Initialization Script
# This script creates and initializes the D1 database for Next.js ISR caching

set -e

DB_NAME="isr-cache-upload-opennext_cache_d1"
SCHEMA_FILE="$(dirname "$0")/schema.sql"
WRANGLER_CONFIG="$(dirname "$0")/../wrangler.jsonc"

echo "🚀 Initializing D1 Database: $DB_NAME"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Error: wrangler is not installed. Please install it first:"
    echo "   npm install -g wrangler"
    exit 1
fi

# Check if schema file exists
if [ ! -f "$SCHEMA_FILE" ]; then
    echo "❌ Error: Schema file not found at $SCHEMA_FILE"
    exit 1
fi

echo "📦 Creating D1 database..."
# Create the database (will fail if it already exists, which is fine)
wrangler d1 create "$DB_NAME" 2>&1 | tee /tmp/d1_create.log || true

# Extract the database ID from the output
DB_ID=$(grep -o "database_id = \"[^\"]*\"" /tmp/d1_create.log | cut -d'"' -f2 || echo "")

if [ -n "$DB_ID" ]; then
    echo "✅ Database created with ID: $DB_ID"
    echo ""
    
    # Update wrangler.jsonc with the database ID
    if [ -f "$WRANGLER_CONFIG" ]; then
        echo "📝 Updating wrangler.jsonc with database_id..."
        
        # Use sed to replace <DATABASE_ID> with the actual ID
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/\"<DATABASE_ID>\"/\"$DB_ID\"/g" "$WRANGLER_CONFIG"
        else
            # Linux
            sed -i "s/\"<DATABASE_ID>\"/\"$DB_ID\"/g" "$WRANGLER_CONFIG"
        fi
        
        echo "✅ wrangler.jsonc updated successfully!"
    else
        echo "⚠️  Warning: wrangler.jsonc not found at $WRANGLER_CONFIG"
        echo "   Please manually update your wrangler.jsonc with this database_id:"
        echo "   \"database_id\": \"$DB_ID\""
    fi
    echo ""
else
    echo "ℹ️  Database may already exist. Checking for existing database ID..."
    
    # Try to get the database ID from wrangler d1 list
    EXISTING_DB_ID=$(wrangler d1 list --json 2>/dev/null | grep -A 10 "\"name\": \"$DB_NAME\"" | grep "\"uuid\":" | head -1 | sed 's/.*"uuid": "\([^"]*\)".*/\1/' || echo "")
    
    if [ -n "$EXISTING_DB_ID" ]; then
        echo "✅ Found existing database with ID: $EXISTING_DB_ID"
        
        # Update wrangler.jsonc with the existing database ID
        if [ -f "$WRANGLER_CONFIG" ]; then
            echo "📝 Updating wrangler.jsonc with database_id..."
            
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                sed -i '' "s/\"<DATABASE_ID>\"/\"$EXISTING_DB_ID\"/g" "$WRANGLER_CONFIG"
            else
                # Linux
                sed -i "s/\"<DATABASE_ID>\"/\"$EXISTING_DB_ID\"/g" "$WRANGLER_CONFIG"
            fi
            
            echo "✅ wrangler.jsonc updated successfully!"
        fi
    else
        echo "⚠️  Could not determine database ID. Please check wrangler d1 list and update manually."
    fi
fi

echo "📋 Applying database schema..."
wrangler d1 execute "$DB_NAME" --file="$SCHEMA_FILE" --remote

echo ""
echo "✅ D1 Database initialized successfully!"
echo ""
echo "📊 To verify the database, run:"
echo "   wrangler d1 execute $DB_NAME --command=\"SELECT name FROM sqlite_master WHERE type='table';\" --remote"
