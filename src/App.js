import React, { useEffect, useState } from 'react';
import './App.css';
import Graph from './Graph';
import DataTable from './DataTable';  // Import the new DataTable component

const App = () => {
  const [data, setData] = useState([]);
  const [selectedRoots, setSelectedRoots] = useState([]); // Default root
  const [loading, setLoading] = useState(false);
  const [showTotal, setShowTotal] = useState(true); // State for total checkbox
  const [selectedRoot, setSelectedRoot] = useState('A'); // Default selected root

  // Define a mapping for renaming roots
  const rootNameMapping = {
    'differences_a': 'A',
    'differences_b': 'B',
    'differences_c': 'C',
    'differences_d': 'D',
    'differences_e': 'E',
    'differences_f': 'F',
    'differences_g': 'G',
    'differences_h': 'H',
    'differences_i': 'I',
    'differences_j': 'J',
    'differences_k': 'K',
    'differences_l': 'L',
    'differences_m': 'M'
  };

  useEffect(() => {
    // Function to fetch data for all roots
    const fetchData = async () => {
      setLoading(true);
      try {
        const responses = await Promise.all(
          Object.keys(rootNameMapping).map(rootKey =>
            fetch(`http://localhost:5000/api/timeline/${rootKey}`) // Adjusted to use relative URL
              .then(response => response.json())
              .then(data => data.map(item => ({ ...item, root: rootNameMapping[rootKey] }))) // Map root name
          )
        );
        // Combine data from all roots
        const combinedData = responses.flat();
        console.log('Fetched data:', combinedData);
        setData(combinedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle checkbox change
  const handleCheckboxChange = (event) => {
    const root = event.target.value;
    setSelectedRoots(prevRoots =>
      prevRoots.includes(root)
        ? prevRoots.filter(item => item !== root)
        : [...prevRoots, root]
    );
  };

  // Handle total checkbox change
  const handleTotalCheckboxChange = (event) => {
    setShowTotal(event.target.checked);
  };

  // Handle dropdown change
  const handleDropdownChange = (event) => {
    setSelectedRoot(event.target.value);
  };

  // List of root options
  const rootOptions = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'
  ];

  return (
    <div className="App">
      <h1>Root Server Data</h1>
      <div className="checkbox-container">
        {rootOptions.map(root => (
          <label key={root}>
            <input
              type="checkbox"
              value={root}
              checked={selectedRoots.includes(root)}
              onChange={handleCheckboxChange}
            />
            {root}
          </label>
        ))}
        <label>
          <input
            type="checkbox"
            checked={showTotal}
            onChange={handleTotalCheckboxChange}
          />
          Show Total
        </label>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="graph-container">
            <Graph data={data} showTotal={showTotal} selectedRoots={selectedRoots} />
          </div>
          <div className="data-table-container">
            <DataTable selectedRoot={selectedRoot} onRootChange={handleDropdownChange} />
          </div>
        </>
      )}
    </div>
  );
};

export default App;
