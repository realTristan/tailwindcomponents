import React from 'react';
import './App.css';

// Use the github api to get the files from the repo
// realTristan/tailwindcomponents/tree/master/src/tailwindcomponents
async function getFiles(): Promise<any> {
  const url = 'https://api.github.com/repos/realTristan/tailwindcomponents/contents/src/tailwindcomponents';
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function App() {
  // Get the files from the repo
  getFiles().then((data) => {
    console.log(data);
  });

  return (
    <div className="App">
      
    </div>
  );
}

export default App;
