#!/usr/bin/env node

import { getTableData, getTableMetadata } from "../src/sui/client.js";

const TABLE_ID = "0xc94f863bddb48d0770874c3feff39b913437cfa54c8c0f4b07d546c41b8f07ef";

/**
 * Format table data for display
 */
function formatTableData(data) {
  console.log("\n📊 TABLE DATA:");
  console.log("=".repeat(80));

  if (data.length === 0) {
    console.log("No data found in table");
    return;
  }

  data.forEach((item, index) => {
    console.log(`\n🔹 Entry ${index + 1}:`);
    console.log(`   Object ID: ${item.objectId}`);
    console.log(`   Version: ${item.version}`);
    console.log(`   Digest: ${item.digest}`);

    if (item.key !== undefined) {
      console.log(`   Key: ${JSON.stringify(item.key, null, 2)}`);
    }

    if (item.value !== undefined) {
      console.log(`   Value: ${JSON.stringify(item.value, null, 2)}`);
    }

    console.log("-".repeat(60));
  });
}

/**
 * Format table metadata for display
 */
function formatTableMetadata(metadata) {
  console.log("\n📋 TABLE METADATA:");
  console.log("=".repeat(80));
  console.log(`Object ID: ${metadata.objectId}`);
  console.log(`Version: ${metadata.version}`);
  console.log(`Digest: ${metadata.digest}`);
  console.log(`Type: ${metadata.type}`);
  console.log(`Owner: ${JSON.stringify(metadata.owner, null, 2)}`);
  console.log(`Previous Transaction: ${metadata.previousTransaction}`);
  console.log(`Storage Rebate: ${metadata.storageRebate}`);

  if (metadata.content) {
    console.log("\nContent:");
    console.log(JSON.stringify(metadata.content, null, 2));
  }
}

/**
 * Main function to view the table
 */
async function viewTable() {
  try {
    console.log("🔍 Fetching table data...");
    console.log(`Table ID: ${TABLE_ID}`);

    // Get table metadata
    console.log("\n📋 Fetching table metadata...");
    const metadata = await getTableMetadata(TABLE_ID);
    formatTableMetadata(metadata);

    // Get table data
    console.log("\n📊 Fetching table data...");
    const tableData = await getTableData(TABLE_ID, { limit: 100 });
    formatTableData(tableData);

    console.log(`\n✅ Successfully fetched ${tableData.length} entries from table`);
  } catch (error) {
    console.error("❌ Error viewing table:", error);
    process.exit(1);
  }
}

// Run the script
viewTable();
