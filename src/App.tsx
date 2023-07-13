import React, { useEffect, useState } from "react";
import Spinner from "./components/Spinner";
import CodeBlock from "./components/CodeBlock";
import "./App.css";

// Read the component from the url
function readComponent(url: string): Promise<string> {
  return fetch(url).then((res: any) => res.text());
}

// Get the image url from the dir name
function getImageFromDirName(dir_name: string): string {
  return `https://raw.githubusercontent.com/realTristan/tailwindcomponents/main/tailwindcomponents/${dir_name}/${dir_name}.png`;
}

// Get the html url from the dir name
function getHtmlFromDirName(dir_name: string): string {
  return `https://raw.githubusercontent.com/realTristan/tailwindcomponents/main/tailwindcomponents/${dir_name}/${dir_name}.html`;
}

// Check if the dir is valid
function isValidDir(dir: any): boolean {
  return dir.type === "dir";
}

// Get the components from the dirs
async function getComponentsFromDirs(dirs: any[]): Promise<any[]> {
  // The components
  let components: any[] = [];

  // Loop through the dirs
  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];

    // Check if the dir is valid
    if (!isValidDir(dir)) {
      continue;
    }

    // Create a new component
    const comp: any = {
      path: dir.path,
      key: dir.sha,
      html_url: `${dir.html_url}/${dir.name}.html`,
      raw_url: getHtmlFromDirName(dir.name),
      image: getImageFromDirName(dir.name),
    };

    // Read the component
    await readComponent(comp.raw_url).then((code: string) => {
      components.push({
        ...comp,
        code: code,
      });
    });
  }

  // Return the components
  return components;
}

// Use the github api to get the dirs from the repo
// realTristan/tailwindcomponents/contents/tailwindcomponents
function getDirs(): Promise<any> {
  return fetch(
    "https://api.github.com/repos/realTristan/tailwindcomponents/contents/tailwindcomponents"
  ).then((res: any) => res.json());
}

// Get the components and set the components
function getComponents(setComps: any) {
  getDirs().then((dirs) =>
    getComponentsFromDirs(dirs).then((comps) => setComps(comps))
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
  // <img src={comp.image} alt={comp.path} />
  return (
    <div className="App">
      <div className="flex flex-col items-center">
        {comps.map((comp: any) => (
          <div key={comp.key}>
            <div className="bg-gray-800 p-4 rounded-lg mt-10 mb-4">
              <a href={comp.html_url} className="text-lg font-normal text-white">
                {comp.path}
              </a>
            </div>
            <div className="m-6" dangerouslySetInnerHTML={{ __html: comp.code }} />
            <CodeBlock code={comp.code} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
