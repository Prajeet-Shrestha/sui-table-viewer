import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import Home from "./home/Home";
import TableViewer from "./TableViewer";
import "./App.css";

// Global Header Component
const GlobalHeader = () => {
  const [selectedNetwork, setSelectedNetwork] = useState("mainnet");
  const [searchParams] = useSearchParams();

  const networks = [
    { value: "mainnet", label: "Mainnet", rpcUrl: "https://fullnode.mainnet.sui.io:443" },
    { value: "testnet", label: "Testnet", rpcUrl: "https://fullnode.testnet.sui.io:443" },
    { value: "devnet", label: "Devnet", rpcUrl: "https://fullnode.devnet.sui.io:443" },
  ];

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNetwork(e.target.value);
    // Update URL with new network parameter
    const currentPath = window.location.pathname;
    const newUrl = `${currentPath}?network=${e.target.value}`;
    window.history.replaceState({}, "", newUrl);
  };

  // Initialize network from URL on mount
  useEffect(() => {
    const networkFromUrl = searchParams.get("network") || "mainnet";
    setSelectedNetwork(networkFromUrl);
  }, [searchParams]);

  return (
    <header className='global-header'>
      <div className='header-content'>
        <div className='header-logo'>
          <h1 className='logo'>Sui Table Explorer</h1>
        </div>

        <div className='network-selector'>
          <label htmlFor='network-select' className='network-label'>
            Network:
          </label>
          <select id='network-select' value={selectedNetwork} onChange={handleNetworkChange} className='network-dropdown'>
            {networks.map((network) => (
              <option key={network.value} value={network.value}>
                {network.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};

function App() {
  return (
    <Router>
      <div className='App'>
        <GlobalHeader />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/table/:tableId' element={<TableViewer />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
