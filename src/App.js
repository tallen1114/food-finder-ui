import React, { useState, useEffect } from 'react';
import ExcludeButton from './components/ExcludeButton';

function App() {
  const [maxSugar, setMaxSugar] = useState(''); // Initial max sugar value
  const [minProtein, setMinProtein] = useState('');
  const [minFiber, setMinFiber] = useState('');
  const [maxSodium, setMaxSodium] = useState('');
  const [maxCalories, setMaxCalories] = useState('');
  const [cereals, setCereals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0); // State for offset
  const [reloadTrigger, setReloadTrigger] = useState(0); // Add a trigger state
  const NUM_PER_PAGE = 500;

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
        minProtein: minProtein ? minProtein : '',
        minFiber: minFiber ? minFiber : '',
        maxSodium: maxSodium ? maxSodium : '',
        maxCalories: maxCalories ? maxCalories: '',
        offset,
      });

      const response = await fetch(`https://food-finder-api-um63.onrender.com/search?${queryParams}`);
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

  const handleMinProteinChange = (event) => {
    setMinProtein(event.target.value);
    setOffset(0); //reset to first page
  };

  const handleMinFiberChange = (event) => {
    setMinFiber(event.target.value);
    setOffset(0); //reset to first page
  };

  const handleMaxSodiumChange = (event) => {
    setMaxSodium(event.target.value);
    setOffset(0); //reset to first page
  };

  const handleMaxCaloriesChange = (event) => {
    setMaxCalories(event.target.value);
    setOffset(0); //reset to first page
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    setReloadTrigger(reloadTrigger + 1); // Trigger reload
  };

  const handleNextPage = () => {
    setOffset(offset + NUM_PER_PAGE);
    setReloadTrigger(reloadTrigger + 1); // Trigger reload
  };

  const handlePreviousPage = () => {
    setOffset(Math.max(0, offset - NUM_PER_PAGE)); // Ensure offset doesn't go below 0
    setReloadTrigger(reloadTrigger + 1); // Trigger reload
  };

  return (
    <div className="grid-container">
      <div className="header">
        <h1>Cereal Finder</h1>
      </div>
      <div className="filters">
          <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="maxSugar">Max Sugar (g): </label><br></br>
            <input
              type="number"
              id="maxSugar"
              value={maxSugar}
              onChange={handleMaxSugarChange}
            />
          </div>
          <br></br>
          <div>
            <label htmlFor="maxSodium">Max Sodium (mg): </label><br></br>
            <input
              type="number"
              id="maxSodium"
              value={maxSodium}
              onChange={handleMaxSodiumChange}
            />
          </div><br></br>
          <div>
            <label htmlFor="maxCalories">Max Calories: </label><br></br>
            <input
              type="number"
              id="maxCalories"
              value={maxCalories}
              onChange={handleMaxCaloriesChange}
            />
          </div><br></br>
          <div>
            <label htmlFor="minFiber">Min Fiber (g): </label><br></br>
            <input
              type="number"
              id="minFiber"
              value={minFiber}
              onChange={handleMinFiberChange}
            />
          </div><br></br>
          <div>
            <label htmlFor="minProtein">Min Protein (g): </label><br></br>
            <input
              type="number"
              id="minProtein"
              value={minProtein}
              onChange={handleMinProteinChange}
            />
          </div><br></br>
          <button type="submit" disabled={isLoading}>
              Load Cereals
            </button>
        </form>
      </div>
      <div className="main">
        {isLoading ? (
            <p>Loading cereals...</p>
          ) : (
          <>
            {reloadTrigger > 0 && (
              <p>
              {cereals.length}{cereals.length == NUM_PER_PAGE ? '+' : ''} Results
            </p>
            )}
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
          </>
        )}
      </div>

      <div className="footer">
      {offset > 0 && ( 
              <button onClick={handlePreviousPage} disabled={isLoading}>
                Previous Page
              </button>
            )}
            {cereals.length == NUM_PER_PAGE && (
              <button onClick={handleNextPage} disabled={isLoading}>
              Next Page
            </button>
            )}
      </div>
    </div>
  );
}

export default App;
