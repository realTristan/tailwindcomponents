import React, { useEffect, useState } from "react";
import Spinner from "./components/Spinner";
import CodeBlock from "./components/CodeBlock";
import "./App.css";

// Use the github api to get the files from the repo
// realTristan/tailwindcomponents/contents/tailwindcomponents
function getFiles(): Promise<any> {
  return fetch(
    "https://api.github.com/repos/realTristan/tailwindcomponents/contents/tailwindcomponents"
  ).then((res: any) => res.json());
}

// Check if the file is valid (ends with .html) (a component)
function isValidComponent(file_name: string): boolean {
  return file_name.endsWith(".html");
}

// Read the component from the url
function readComponent(url: string): Promise<any> {
  return fetch(url).then((res: any) => res.text());
}

// Iterate through the files and check if they are valid
async function getComponentsFromFiles(files: any): Promise<any> {
  const components: any[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    // Check if the file is valid
    if (!isValidComponent(file.name)) {
      continue;
    }

    // State for the component
    const comp: any = {
      name: file.name,
      key: file.sha,
      html_url: file.html_url,
      raw_url: file.download_url,
      code: "",
    };

    // Read the component
    await readComponent(file.download_url).then((code) => {
      components.push({
        ...comp,
        code: code,
      });
    });
  }

  // Return the components
  return components;
}

// Get the components from the files and set the state
function getComponents(setComps: any) {
  getFiles().then((files) =>
    getComponentsFromFiles(files).then((comps) => setComps(comps))
  );
}

// The main app
function App() {
  // State for the components
  const [comps, setComps] = useState([]);

  // Get the components
  useEffect(() => getComponents(setComps), []);

  // Spinner while waiting for the components and the code to load
  if (comps.length === 0) {
    return <Spinner />;
  }

  // Return the components
  return (
    <div className="App">
      <div className="flex flex-col items-center">
        {comps.map((comp: any) => (
          <div key={comp.key}>
            <div className="bg-gray-800 p-4 rounded-lg mt-10 mb-4">
              <a href={comp.html_url} className="text-lg font-normal text-white">
                {comp.name}
              </a>
            </div>
            <CodeBlock code={comp.code} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
