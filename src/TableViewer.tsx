import React, { useState, useEffect } from "react";
import { getTableData } from "./sui/client";
import ReactJson from "react-json-view";
import "./TableViewer.css";

const TABLE_ID = "0xc94f863bddb48d0770874c3feff39b913437cfa54c8c0f4b07d546c41b8f07ef";

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
  const [customTableId, setCustomTableId] = useState(TABLE_ID);
  const [useCustomId, setUseCustomId] = useState(false);

  const fetchTableData = async (tableId?: string) => {
    setLoading(true);
    setError(null);

    const targetTableId = tableId || customTableId;

    try {
      // Fetch metadata
      // const meta = await getTableMetadata(targetTableId);
      // setMetadata(meta);

      // Fetch table data
      const data = await getTableData(targetTableId, { limit: 100 });
      setTableData(data);
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
    fetchTableData();
  }, []);

  const formatValue = (value: any) => {
    if (typeof value === "object" && value !== null) {
      return (
        <div className='pretty-json-container'>
          <div className='object-container'>
            <ReactJson
              src={value}
              theme='monokai'
              collapsed={1}
              displayDataTypes={false}
              displayObjectSize={false}
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
        <p>Table ID: {TABLE_ID}</p>
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
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div className='main-container'>
      <h1>🔍 Sui Table Viewer</h1>

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
        <h2>Table Data ({tableData.length} entries)</h2>
        {tableData.length === 0 ? (
          <p>No data found in table</p>
        ) : (
          <div className='table-container'>
            <table className='data-table'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Object ID</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((entry, index) => (
                  <tr key={entry.objectId}>
                    <td>{index + 1}</td>
                    <td className='object-id'>{entry.objectId}</td>
                    <td className='value-cell'>{formatValue(entry.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
