import React, { useState, useEffect } from 'react';

function App() {
  const [maxSugar, setMaxSugar] = useState(10); // Initial max sugar value
  const [cereals, setCereals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0); // State for offset


  useEffect(() => {
    const fetchCereals = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/search?maxSugar=${maxSugar}&offset=${offset}`); 
        const data = await response.json();
        setCereals(data);
      } catch (error) {
        console.error('Error fetching cereals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCereals();
  }, [maxSugar, offset]); // Fetch cereals whenever maxSugar of offset changes

  const handleMaxSugarChange = (event) => {
    setMaxSugar(parseInt(event.target.value, 10));
    setOffset(0); // Reset offset when maxSugar changes
  };

  const handleNextPage = () => {
    setOffset(offset + 500);
  };

  const handlePreviousPage = () => {
    setOffset(Math.max(0, offset - 500)); // Ensure offset doesn't go below 0
  };

  return (
    <div>
      <h1>Cereal Finder</h1>
      <div>
        <label htmlFor="maxSugar">Max Sugar (grams): </label>
        <input
          type="number"
          id="maxSugar"
          value={maxSugar}
          onChange={handleMaxSugarChange}
        />
      </div>

      {isLoading ? (
        <p>Loading cereals...</p>
      ) : (
        <>
          <ul>
            {cereals.map((cereal) => (
              <li key={cereal.Id}>{cereal.description} ({cereal.brand_owner})</li>
            ))}
          </ul>
          {offset > 0 && ( // Show "Previous Page" button if offset > 0
            <button onClick={handlePreviousPage} disabled={isLoading}>
              Previous Page
            </button>
          )}
          <button onClick={handleNextPage} disabled={isLoading}>
            Next Page
          </button>
        </>
      )}
    </div>
  );
}

export default App;
