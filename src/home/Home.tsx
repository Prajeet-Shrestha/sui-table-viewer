import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to table viewer with the search query
      navigate(`/table/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleExampleClick = (exampleId: string) => {
    setSearchQuery(exampleId);
    navigate(`/table/${encodeURIComponent(exampleId)}`);
  };

  return (
    <div className='home-container'>
      <div className='home-content'>
        <div className='logo-section'>
          <h1 className='logo'>Sui Table Explorer</h1>
          <p className='tagline'>Explore Sui blockchain table objects</p>
        </div>

        <div className='search-section'>
          <form onSubmit={handleSearch} className='search-form'>
            <div className='search-input-container'>
              <input type='text' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder='Enter table object ID (0x...)' className='search-input' autoFocus />
              <button type='submit' className='search-button'>
                <svg width='20' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </button>
            </div>
          </form>

          <div className='search-suggestions'>
            <p className='suggestions-title'>Try these examples:</p>
            <div className='example-buttons'>
              <button className='example-button' onClick={() => handleExampleClick("0x8c10e863b2714f1bfc9a0660ec7a7a590b2c5400427f0fa815bc5eff84a27be6")}>
                Sample Table 1
              </button>
              <button className='example-button' onClick={() => handleExampleClick("0xc94f863bddb48d0770874c3feff39b913437cfa54c8c0f4b07d546c41b8f07ef")}>
                Sample Table 2
              </button>
            </div>
          </div>
        </div>

        <div className='info-section'>
          <h2>How to use</h2>
          <ol className='instructions-list'>
            <li>Enter a valid Sui table object ID in the search box above</li>
            <li>Object IDs should start with "0x" and be 66 characters long</li>
            <li>Click "Search" or press Enter to explore the table</li>
            <li>Use pagination to browse through table entries</li>
            <li>Click on object IDs to fetch and view related objects</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Home;
