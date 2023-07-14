"use client";
import React, { useEffect, useState } from "react";
import Spinner from "./components/Spinner";
import CodeBlock from "./components/CodeBlock";
import GithubAuth from "./lib/GithubAuth";

// Github Login and Authentication
const GITHUB_AUTH: GithubAuth = new GithubAuth();

// Read the component from the url
const readComponent = (url: string): Promise<string> =>
  fetch(url).then((res: any) => res.text());

// Get the raw url from the dir name
const toRawUrl = (dirName: string): string =>
  `https://raw.githubusercontent.com/realTristan/tailwindcomponents/main/tailwindcomponents//${dirName}/.html`;

// Check if the dir is valid
const isValidDir = (dir: any): boolean => dir.type === "dir";

// Generate a random key
const randomKey = (): string => Math.random().toString(36).substring(7);

// Get the components from the dirs
const getComponentsFromDirs = async (dirs: any[]): Promise<any[]> => {
  // The components
  let components: any[] = [];

  // Loop through the dirs
  for (let i = 0; i < dirs.length; i++) {
    // Check if the dir is valid
    const dir: any = dirs[i];
    if (!isValidDir(dir)) continue;

    // Create a new component
    const comp: any = {
      name: dir.name,
      key: randomKey(),
      html_url: `${dir.html_url}/${dir.name}.html`,
      raw_url: toRawUrl(dir.name),
    };

    // Read the component
    await readComponent(comp.raw_url).then((code: string) => {
      comp.code = code;
      components.push(comp);
    });
  }

  // Return the components
  return components;
};

// Use the github api to get the dirs from the repo
// realTristan/tailwindcomponents
const getDirs = (): Promise<any> =>
  fetch(
    "https://api.github.com/repos/realTristan/tailwindcomponents/contents/tailwindcomponents"
  ).then((res: any) => res.json());

// Get and then set the components
const getComponents = () =>
  getDirs().then((dirs) => getComponentsFromDirs(dirs).then((comps) => comps));

// Wrap the code so that tailwind will render
const wrap = (code: string): string =>
  `<!doctype html><html><head><meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    </head><body>${code}</body></html>`;

// The main app
export default function Home() {
  // States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [comps, setComps] = useState<any[]>([]);

  // Use effect for access to window
  useEffect(() => {
    // Check if the user is logged in or if there was an error
    if (isLoggedIn || GITHUB_AUTH.errorOccurred()) return;

    // Login to github
    GITHUB_AUTH.login();

    // Check if the user is logged in
    if (GITHUB_AUTH.isLoggedIn()) {
      setIsLoggedIn(true);
      getComponents().then((comps) => setComps(comps));
    }
  }, [isLoggedIn]);

  // Check if the user is logged in or if there are no components
  if (!isLoggedIn || comps.length === 0) return <Spinner />;

  // Return the components
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
              srcDoc={wrap(comp.code)}
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
