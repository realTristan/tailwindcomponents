"use client";
import React, { useEffect, useState } from "react";
import Spinner from "./components/Spinner";
import GithubAuth from "./lib/GithubAuth";
import GithubAuthError from "./components/GithubAuthError";
import ComponentsList from "./components/ComponentsList";

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

// The main app
export default function Home() {
  // Error, is logged in, and components states
  const [error, setError] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [comps, setComps] = useState<any[]>([]);

  // Use effect for access to window
  useEffect(() => {
    // Check if there was an error
    if (GITHUB_AUTH.errorOccurred())
      setError({
        message: GITHUB_AUTH.error(),
        description: GITHUB_AUTH.errorDescription(),
        uri: GITHUB_AUTH.errorUri(),
      });

    // If the user is logged in or there was an error
    if (isLoggedIn || error) return;

    // Login to github
    GITHUB_AUTH.login();

    // Check if the user is logged in
    if (GITHUB_AUTH.isLoggedIn()) {
      setIsLoggedIn(true);
      getComponents().then((comps) => setComps(comps));
    }
  }, [isLoggedIn]);

  // If there was an error
  if (error) return <GithubAuthError error={error} />;

  // Check if the user is logged in or if there are no components
  if (!isLoggedIn || comps.length === 0) return <Spinner />;

  // Return the components
  return <ComponentsList components={comps} />;
}
