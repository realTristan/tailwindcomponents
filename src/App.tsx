import React, { useEffect, useState } from "react";
import "./App.css";

// Use the github api to get the files from the repo
// realTristan/tailwindcomponents/contents/tailwindcomponents
function getFiles(): Promise<any> {
  let response: any = fetch(
    "https://api.github.com/repos/realTristan/tailwindcomponents/contents/tailwindcomponents"
  );
  return response.then((res: any) => res.json());
}

// Check if the file is valid (ends with .html) (a component)
function isValidComponent(file_name: string): boolean {
  return file_name.endsWith(".html");
}

// Iterate through the files and check if they are valid
function getComponentsFromFiles(files: any): string[] {
  const components: any[] = [];
  files.forEach((file: any) => {
    if (isValidComponent(file.name)) {
      components.push({
        name: file.name,
        url: file.download_url,
        html_url: file.html_url,
      });
    }
  });
  return components;
}

// Get the components from the files and set the state
function getComponents(setComps: any) {
  getFiles().then((files) => {
    const components: string[] = getComponentsFromFiles(files);
    setComps(components);
  });
}

// The main app
function App() {
  // State for the components
  const [comps, setComps] = useState([]);

  // Get the components
  useEffect(() => getComponents(setComps), []);

  // Render the components
  return (
    <div>
      {comps.map((comp: any) => {
        return (
          <div>
            <a href={comp.html_url}>{comp.name}</a>
          </div>
        );
      })}
    </div>
  );
}

export default App;
