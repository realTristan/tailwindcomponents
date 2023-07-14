"use client";
import React, { useEffect, useState } from "react";
import Spinner from "./components/Spinner";
import CodeBlock from "./components/CodeBlock";
import GithubAuth from "./lib/GithubAuth";

// Read the component from the url
function readComponent(url: string): Promise<string> {
  return fetch(url).then((res: any) => res.text());
}

/* Get the image url from the dir name
function getImageFromDirName(dir_name: string): string {
  return `https://raw.githubusercontent.com/realTristan/tailwindcomponents/main/tailwindcomponents/${dir_name}/.png`;
}
*/

// Get the html url from the dir name
function getHtmlFromDirName(dir_name: string): string {
  return `https://raw.githubusercontent.com/realTristan/tailwindcomponents/main/tailwindcomponents/${dir_name}/.html`;
}

// Check if the dir is valid
function isValidDir(dir: any): boolean {
  return dir.type === "dir";
}

// Generate a random key
function randomKey(): string {
  return Math.random().toString(36).substring(7);
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
      name: dir.name,
      key: randomKey(),
      html_url: `${dir.html_url}/${dir.name}.html`,
      raw_url: getHtmlFromDirName(dir.name),
      // image: getImageFromDirName(dir.name),
    };

    // Read the component
    await readComponent(comp.raw_url).then((code: string) => {
      components.push({
        ...comp,
        code: code.toString(),
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

// Wrap the code so that tailwind will render
function wrapCode(code: string): string {
  return `<!doctype html><html><head><meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    </head><body>${code}</body></html>`;
}

// The main app
export default function Home() {
  // The github auth
  const auth: GithubAuth = new GithubAuth();

  // States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [comps, setComps] = useState([]);

  // Login with github
  useEffect(() => {
    auth.login();
    setIsLoggedIn(true);
    getComponents(setComps);
  }, []);

  // Check if the user is logged in or if there are no components
  if (!isLoggedIn || comps.length === 0) return <Spinner />;

  // Return the components
  // <img src={comp.image} alt={comp.name} />
  return (
    <div className="flex flex-col justify-center items-center">
      {comps.map((comp: any) => (
        <div key={comp.key} className="w-1/2 my-5 mx-5 ">
          <div className="p-4 border-2 border-slate-950 border-b-0 bg-gray-800">
            <a
              href={comp.html_url}
              className="text-2xl font-black uppercase tracking-widest text-white"
            >
              {comp.name}
            </a>
          </div>
          <div className="relative w-full h-full">
            <iframe
              srcDoc={wrapCode(comp.code)}
              className="w-full h-96 border-2 p-4 border-slate-950 overflow-auto"
              title={comp.name}
            />
          </div>
          <CodeBlock code={comp.code} />
        </div>
      ))}
    </div>
  );
}
