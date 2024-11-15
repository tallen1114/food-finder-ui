import React, { useState, useEffect } from 'react';
import ExcludeButton from './components/ExcludeButton';

function App() {
  const [maxSugar, setMaxSugar] = useState(''); // Initial max sugar value
  const [cereals, setCereals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0); // State for offset
  const [reloadTrigger, setReloadTrigger] = useState(0); // Add a trigger state
  
  // useEffect triggers automatically when one of the specified values changes
  useEffect(() => {
    if (reloadTrigger > 0) { // Only load if reloadTrigger is greater than 0
      loadCereals();
    }
  }, [reloadTrigger])

  const loadCereals = async () => {
    console.log("loading cereals");
    console.log(offset);

    setIsLoading(true);

    try {
      const queryParams = new URLSearchParams({
        maxSugar: maxSugar ? maxSugar : '', // Only include if it is not empty
        offset,
      });

      const response = await fetch(`http://localhost:8080/search?${queryParams}`);
      const data = await response.json();
      setCereals(data);
    } catch (error) {
      console.error('Error loading cereals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxSugarChange = (event) => {
    setMaxSugar(event.target.value);
    setOffset(0); //reset to first page
  };

  const handleNextPage = () => {
    setOffset(offset + 500);
    setReloadTrigger(reloadTrigger + 1); // Trigger reload
  };

  const handlePreviousPage = () => {
    setOffset(Math.max(0, offset - 500)); // Ensure offset doesn't go below 0
    setReloadTrigger(reloadTrigger + 1); // Trigger reload
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
        <button onClick={() => setReloadTrigger(reloadTrigger + 1)} disabled={isLoading}>
          Load Cereals
        </button>
      </div>

      {isLoading ? (
        <p>Loading cereals...</p>
      ) : (
      <>
        <ul>
          {cereals.map((cereal) => {
            const query = encodeURIComponent(`${cereal.description} ${cereal.brand_owner}`);
            const url = `https://google.com/search?q=${query}`;

            return (
              <li key={cereal.Id}>
                <a href={url} target="_blank">
                  {cereal.description} ({cereal.brand_owner})
                </a> <ExcludeButton upc={cereal.upc}/>
              </li>
            );
          })}
        </ul>
        {offset > 0 && ( 
          <button onClick={handlePreviousPage} disabled={isLoading}>
            Previous Page
          </button>
        )}
        {cereals.length > 0 && (
          <button onClick={handleNextPage} disabled={isLoading}>
          Next Page
        </button>
        )}
      </>
    )}
    </div>
  );
}

export default App;
