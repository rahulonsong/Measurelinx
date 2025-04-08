# Database Migration Instructions

This document explains how to copy essential helper collections from your development database to your test and production databases.

## Prerequisites

- MongoDB Atlas cluster with `papiloomdev`, `papiloomtest`, and `papiloomprod` databases
- Node.js installed on your machine
- Valid MongoDB connection credentials in your `.env` file

## Available Migration Scripts

There are two migration scripts available:

1. **copyHelperCollections.js** - Copies only essential helper collections needed for app initialization
2. **copyCollections.js** - Copies all collections (more comprehensive)

## How to Run the Migration

### Step 1: Ensure your environment variables are set up

The scripts will use the MongoDB credentials from your `.env` file. Make sure these are correctly set:

```
MONGO_USER=your_username
MONGO_PASS=your_password
MONGO_CLUSTER_URL=your_cluster_url
```

### Step 2: Run the migration script

For most cases, you'll want to use the helper collections script:

```bash
cd server
node scripts/copyHelperCollections.js
```

This will copy only the essential collections needed for app initialization:

- alpharesources
- appenvs
- categories
- categorylists
- itemmodels
- menus
- pairedstringlists
- pagecreators
- taglists
- unitmatrices

### Alternative: Copy all collections

If you need to copy all collections:

```bash
cd server
node scripts/copyCollections.js
```

## What to Expect

The script will:

1. Connect to your development database (`papiloomdev`)
2. For each target database (`papiloomtest` and `papiloomprod`):
   - Connect to the target database
   - Copy each helper collection
   - Report how many documents were copied
3. Show a summary of the migration process

## Troubleshooting

If you encounter any issues:

1. **Connection errors**: Verify your MongoDB credentials in the `.env` file
2. **Permission errors**: Ensure your MongoDB user has read access to the source database and write access to the target databases
3. **Timeout errors**: For large collections, you might need to increase the timeout in the script

## Important Notes

- These scripts will **drop existing collections** in the target databases before copying
- Always back up important data before running migration scripts
- Consider running in a test environment first if you're concerned about data loss
