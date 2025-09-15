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
    const newNetwork = e.target.value;
    setSelectedNetwork(newNetwork);

    // Save to localStorage
    localStorage.setItem("sui-network", newNetwork);

    // Update URL with new network parameter
    const currentPath = window.location.pathname;
    const newUrl = `${currentPath}?network=${newNetwork}`;
    window.history.replaceState({}, "", newUrl);
  };

  // Initialize network from localStorage or URL on mount
  useEffect(() => {
    // First check localStorage, then URL, then default to mainnet
    const savedNetwork = localStorage.getItem("sui-network");
    const networkFromUrl = searchParams.get("network");
    const initialNetwork = savedNetwork || networkFromUrl || "mainnet";

    setSelectedNetwork(initialNetwork);

    // If we got network from localStorage and URL is different, update URL
    if (savedNetwork && networkFromUrl && savedNetwork !== networkFromUrl) {
      const currentPath = window.location.pathname;
      const newUrl = `${currentPath}?network=${savedNetwork}`;
      window.history.replaceState({}, "", newUrl);
    }
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
