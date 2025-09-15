import { SuiClient, getFullnodeUrl, type SuiObjectData } from "@mysten/sui/client";

// Sui mainnet RPC client
export const suiClient = new SuiClient({
  url: getFullnodeUrl("mainnet"),
});

/**
 * Get a single object by its ID
 * @param objectId - The object ID to fetch
 * @param options - Additional options for the request
 * @returns Promise<SuiObjectData | null>
 */
export async function getObject(
  objectId: string,
  options?: {
    showContent?: boolean;
    showDisplay?: boolean;
    showBcs?: boolean;
    showOwner?: boolean;
    showPreviousTransaction?: boolean;
    showStorageRebate?: boolean;
    showType?: boolean;
  }
): Promise<SuiObjectData | null> {
  try {
    console.log(`🔍 Fetching object: ${objectId}`);
    const result = await suiClient.getObject({
      id: objectId,
      options: {
        showContent: true,
        showDisplay: true,
        showBcs: true,
        showOwner: true,
        showPreviousTransaction: true,
        showStorageRebate: true,
        showType: true,
        ...options,
      },
    });

    if (result.error) {
      console.error("Error fetching object:", result.error);
      console.error("Error details:", JSON.stringify(result.error, null, 2));
      return null;
    }

    console.log(`✅ Object fetched successfully:`, {
      objectId: result.data?.objectId,
      type: result.data?.type,
      version: result.data?.version,
    });

    return result.data ?? null;
  } catch (error) {
    console.error("Failed to get object:", error);
    throw error;
  }
}

/**
 * Get multiple objects by their IDs
 * @param objectIds - Array of object IDs to fetch
 * @param options - Additional options for the request
 * @returns Promise<SuiObjectData[]>
 */
export async function getObjects(
  objectIds: string[],
  options?: {
    showContent?: boolean;
    showDisplay?: boolean;
    showBcs?: boolean;
    showOwner?: boolean;
    showPreviousTransaction?: boolean;
    showStorageRebate?: boolean;
    showType?: boolean;
  }
): Promise<SuiObjectData[]> {
  try {
    const results = await suiClient.multiGetObjects({
      ids: objectIds,
      options: {
        showContent: true,
        showDisplay: true,
        showBcs: true,
        showOwner: true,
        showPreviousTransaction: true,
        showStorageRebate: true,
        showType: true,
        ...options,
      },
    });

    return results.filter((result) => !result.error && result.data).map((result) => result.data!);
  } catch (error) {
    console.error("Failed to get objects:", error);
    throw error;
  }
}

/**
 * Get table data by table ID with pagination support
 * @param tableId - The table ID to fetch data from
 * @param options - Additional options for the request
 * @returns Promise<{data: any[], hasNextPage: boolean, nextCursor?: string}>
 */
export async function getTableData(
  tableId: string,
  options?: {
    limit?: number;
    cursor?: string;
  }
): Promise<{ data: any[]; hasNextPage: boolean; nextCursor?: string }> {
  try {
    console.log(`🔍 Getting table data for: ${tableId}`);
    const result = await suiClient.getDynamicFields({
      parentId: tableId,
      limit: options?.limit || 50,
      cursor: options?.cursor,
    });
    console.log(`✅ Table data fetched successfully:`, {
      result,
    });

    // Get the actual data for each dynamic field
    const fieldIds = result.data.map((field) => field.objectId);
    const fieldObjects = await getObjects(fieldIds);

    const data = fieldObjects.map((obj) => {
      if (obj.content && "fields" in obj.content) {
        const fields = obj.content.fields as any;
        return {
          key: fields.key,
          value: fields.value,
          objectId: obj.objectId,
          version: obj.version,
          digest: obj.digest,
        };
      }
      return obj;
    });

    return {
      data,
      hasNextPage: result.hasNextPage,
      nextCursor: result.nextCursor || undefined,
    };
  } catch (error) {
    console.error("Failed to get table data:", error);
    throw error;
  }
}

/**
 * Test if an object exists and get basic info
 * @param objectId - The object ID to test
 * @returns Promise<{exists: boolean, type?: string, error?: string}>
 */
export async function testObject(objectId: string): Promise<{ exists: boolean; type?: string; error?: string }> {
  try {
    console.log(`🧪 Testing object existence: ${objectId}`);
    const result = await suiClient.getObject({
      id: objectId,
      options: {
        showType: true,
      },
    });

    if (result.error) {
      return {
        exists: false,
        error: result.error.code || "Unknown error",
      };
    }

    return {
      exists: true,
      type: result.data?.type || undefined,
    };
  } catch (error) {
    return {
      exists: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get table metadata
 * @param tableId - The table ID to fetch metadata for
 * @returns Promise<any>
 */
export async function getTableMetadata(tableId: string): Promise<any> {
  try {
    console.log(`📋 Getting table metadata for: ${tableId}`);

    // First test if the object exists
    const testResult = await testObject(tableId);
    if (!testResult.exists) {
      throw new Error(`Object not found: ${testResult.error}`);
    }

    console.log(`📋 Object exists with type: ${testResult.type}`);

    const tableObject = await getObject(tableId);

    if (!tableObject) {
      throw new Error("Table not found");
    }

    return {
      objectId: tableObject.objectId,
      version: tableObject.version,
      digest: tableObject.digest,
      type: tableObject.type,
      owner: tableObject.owner,
      previousTransaction: tableObject.previousTransaction,
      storageRebate: tableObject.storageRebate,
      content: tableObject.content,
    };
  } catch (error) {
    console.error("Failed to get table metadata:", error);
    throw error;
  }
}

// Export the client instance for direct use
export { suiClient as client };
