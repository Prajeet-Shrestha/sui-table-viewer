import { testObject, getObject } from "./sui/client";

const OBJECT_ID = "0xc94f863bddb48d0770874c3feff39b913437cfa54c8c0f4b07d546c41b8f07ef";

async function testObjectExistence() {
  console.log("🧪 Testing object existence...");
  console.log(`Object ID: ${OBJECT_ID}`);
  
  try {
    // Test if object exists
    const testResult = await testObject(OBJECT_ID);
    console.log("Test result:", testResult);
    
    if (testResult.exists) {
      console.log("✅ Object exists!");
      console.log(`Type: ${testResult.type}`);
      
      // Try to get full object data
      console.log("\n📦 Fetching full object data...");
      const fullObject = await getObject(OBJECT_ID);
      
      if (fullObject) {
        console.log("✅ Full object data retrieved:");
        console.log("Object ID:", fullObject.objectId);
        console.log("Type:", fullObject.type);
        console.log("Version:", fullObject.version);
        console.log("Owner:", fullObject.owner);
        console.log("Content:", JSON.stringify(fullObject.content, null, 2));
      } else {
        console.log("❌ Failed to get full object data");
      }
    } else {
      console.log("❌ Object does not exist or is not accessible");
      console.log("Error:", testResult.error);
    }
    
  } catch (error) {
    console.error("❌ Error during test:", error);
  }
}

// Run the test
testObjectExistence();
