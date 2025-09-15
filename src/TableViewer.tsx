import React, { useState, useEffect } from "react";
import { getTableData, getObject } from "./sui/client";
import ReactJson from "react-json-view";
import "./TableViewer.css";

const TABLE_ID = "0x8c10e863b2714f1bfc9a0660ec7a7a590b2c5400427f0fa815bc5eff84a27be6";
// const TABLE_ID = "0xc94f863bddb48d0770874c3feff39b913437cfa54c8c0f4b07d546c41b8f07ef";

interface TableEntry {
  key: any;
  value: any;
  objectId: string;
  version: string;
  digest: string;
}

interface TableMetadata {
  objectId: string;
  version: string;
  digest: string;
  type: string;
  owner: any;
  previousTransaction: string;
  storageRebate: string;
  content: any;
}

const TableViewer: React.FC = () => {
  const [metadata] = useState<TableMetadata | null>(null);
  const [tableData, setTableData] = useState<TableEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customTableId] = useState(TABLE_ID);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [previousCursors, setPreviousCursors] = useState<string[]>([]);

  // Object data state
  const [fetchedObjects, setFetchedObjects] = useState<Record<string, any>>({});
  const [loadingObjects, setLoadingObjects] = useState<Set<string>>(new Set());

  const fetchTableData = async (tableId?: string, page: number = 1, cursor?: string) => {
    setLoading(true);
    setError(null);

    const targetTableId = tableId || customTableId;

    try {
      // Fetch metadata
      // const meta = await getTableMetadata(targetTableId);
      // setMetadata(meta);

      // Fetch table data with pagination
      const result = await getTableData(targetTableId, {
        limit: 50,
        cursor: cursor,
      });

      setTableData(result.data);
      setHasNextPage(result.hasNextPage);
      setNextCursor(result.nextCursor);
      setCurrentPage(page);
    } catch (err) {
      let errorMessage = "Unknown error occurred";

      if (err instanceof Error) {
        if (err.message.includes("notExists")) {
          errorMessage = `Object not found: ${targetTableId}\n\nThis could mean:\n• The object ID is invalid\n• The object was deleted\n• The object is on a different network (testnet vs mainnet)\n• The object ID is from a different blockchain`;
        } else if (err.message.includes("Object not found")) {
          errorMessage = `Object not found: ${targetTableId}\n\nPossible reasons:\n• Invalid object ID\n• Object was deleted\n• Wrong network (check if it's testnet vs mainnet)`;
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset pagination when component mounts
    setCurrentPage(1);
    setPreviousCursors([]);
    setNextCursor(undefined);
    setHasNextPage(false);
    fetchTableData();
  }, []);

  const goToNextPage = () => {
    if (hasNextPage && nextCursor) {
      // Save current cursor for back navigation
      setPreviousCursors((prev) => [...prev, nextCursor]);
      fetchTableData(undefined, currentPage + 1, nextCursor);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1 && previousCursors.length > 0) {
      const newCursors = [...previousCursors];
      const previousCursor = newCursors.pop();
      setPreviousCursors(newCursors);
      fetchTableData(undefined, currentPage - 1, previousCursor);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
    setPreviousCursors([]);
    setNextCursor(undefined);
    setHasNextPage(false);
    fetchTableData();
  };

  // Check if a value is an object ID (Sui object IDs start with 0x and are 66 characters long)
  const isObjectId = (value: any): boolean => {
    return typeof value === "string" && value.startsWith("0x") && value.length === 66 && /^[0-9a-fA-F]+$/.test(value.slice(2));
  };

  // Fetch object data by ID
  const fetchObjectData = async (objectId: string) => {
    if (fetchedObjects[objectId] || loadingObjects.has(objectId)) {
      return; // Already fetched or currently loading
    }

    setLoadingObjects((prev) => new Set(prev).add(objectId));

    try {
      const objectData = await getObject(objectId);
      if (objectData) {
        setFetchedObjects((prev) => ({
          ...prev,
          [objectId]: objectData,
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch object ${objectId}:`, error);
      // Store error state
      setFetchedObjects((prev) => ({
        ...prev,
        [objectId]: { error: "Failed to fetch object data" },
      }));
    } finally {
      setLoadingObjects((prev) => {
        const newSet = new Set(prev);
        newSet.delete(objectId);
        return newSet;
      });
    }
  };

  const formatValue = (value: any) => {
    // Check if value is an object ID
    if (isObjectId(value)) {
      const objectId = value as string;
      const isLoading = loadingObjects.has(objectId);
      const fetchedData = fetchedObjects[objectId];

      return (
        <div className='object-id-container'>
          <div className='object-id-header'>
            <span className='object-id-label'>Object ID:</span>
            <span className='object-id-value'>{objectId}</span>
            {!fetchedData && !isLoading && (
              <button onClick={() => fetchObjectData(objectId)} className='fetch-object-button'>
                Fetch Data
              </button>
            )}
          </div>

          {isLoading && <div className='object-loading'>Loading object data...</div>}

          {fetchedData && !fetchedData.error && (
            <div className='pretty-json-container'>
              <div className='object-container'>
                <ReactJson
                  src={fetchedData}
                  collapsed={false}
                  theme={"solarized"}
                  enableClipboard={false}
                  style={{
                    backgroundColor: "transparent",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                />
              </div>
            </div>
          )}

          {fetchedData && fetchedData.error && <div className='object-error'>Error: {fetchedData.error}</div>}
        </div>
      );
    }

    // Handle regular objects
    if (typeof value === "object" && value !== null) {
      return (
        <div className='pretty-json-container'>
          <div className='object-container'>
            <ReactJson
              src={value}
              collapsed={false}
              theme={"solarized"}
              enableClipboard={false}
              style={{
                backgroundColor: "transparent",
                fontSize: "12px",
                fontFamily: "monospace",
              }}
            />
          </div>
        </div>
      );
    }

    return <span>{String(value)}</span>;
  };

  if (loading) {
    return (
      <div className='loading-container'>
        <h2>Loading table data...</h2>
        <p>Table ID: {customTableId}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='error-container'>
        <h2>❌ Error loading table data</h2>
        <div className='error-message'>{error}</div>
        <div className='error-solutions'>
          <h3>💡 Try these solutions:</h3>
          <ul>
            <li>Verify the object ID is correct</li>
            <li>Check if the object exists on Sui mainnet</li>
            <li>Try a different object ID</li>
            <li>Make sure you're connected to the right network</li>
          </ul>
        </div>
        <button onClick={() => fetchTableData()} className='retry-button'>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='main-container'>
      <h1>Sui Table Viewer</h1>

      {metadata && (
        <div className='metadata-section'>
          <h2>Table Metadata</h2>
          <p>
            <strong>Object ID:</strong> {metadata.objectId}
          </p>
          <p>
            <strong>Version:</strong> {metadata.version}
          </p>
          <p>
            <strong>Digest:</strong> {metadata.digest}
          </p>
          <p>
            <strong>Type:</strong> {metadata.type}
          </p>
          <p>
            <strong>Owner:</strong> {JSON.stringify(metadata.owner, null, 2)}
          </p>
          <p>
            <strong>Previous Transaction:</strong> {metadata.previousTransaction}
          </p>
          <p>
            <strong>Storage Rebate:</strong> {metadata.storageRebate}
          </p>
        </div>
      )}

      <div className='table-section'>
        <div className='table-header'>
          <h2>Table Data ({tableData.length} entries)</h2>
          <div className='pagination-info'>
            Page {currentPage} {hasNextPage && `• More pages available`}
          </div>
        </div>

        {/* Top Pagination Controls */}
        {(currentPage > 1 || hasNextPage) && (
          <div className='pagination-controls pagination-top'>
            <button onClick={goToFirstPage} disabled={currentPage === 1} className='pagination-button'>
              First
            </button>
            <button onClick={goToPreviousPage} disabled={currentPage === 1} className='pagination-button'>
              Previous
            </button>
            <span className='pagination-page'>Page {currentPage}</span>
            <button onClick={goToNextPage} disabled={!hasNextPage} className='pagination-button'>
              Next
            </button>
          </div>
        )}

        {tableData.length === 0 ? (
          <p style={{ color: "#6c757d", fontStyle: "italic", textAlign: "center", padding: "2rem" }}>No data found in table</p>
        ) : (
          <div className='table-container'>
            {tableData.map((entry) => (
              <div key={entry.objectId} className='table-entry'>
                <div className='object-id'>{formatValue(entry.objectId)}</div>
                <div className='value-cell'>{formatValue(entry.value)}</div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Pagination Controls */}
        {(currentPage > 1 || hasNextPage) && (
          <div className='pagination-controls pagination-bottom'>
            <button onClick={goToFirstPage} disabled={currentPage === 1} className='pagination-button'>
              First
            </button>
            <button onClick={goToPreviousPage} disabled={currentPage === 1} className='pagination-button'>
              Previous
            </button>
            <span className='pagination-page'>Page {currentPage}</span>
            <button onClick={goToNextPage} disabled={!hasNextPage} className='pagination-button'>
              Next
            </button>
          </div>
        )}
      </div>

      <div className='refresh-section'>
        <button onClick={() => fetchTableData()} className='refresh-button'>
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default TableViewer;
