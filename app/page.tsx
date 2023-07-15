"use client";
import React, { useEffect, useState } from "react";
import Spinner from "./components/Spinner";
import GithubAuth from "./lib/GithubAuth";
import GithubAuthError from "./components/GithubAuthError";
import ComponentsList from "./components/ComponentsList";
import Upload from "./components/Upload";
 
// Github Login and Authentication
const GITHUB_AUTH: GithubAuth = new GithubAuth();

// Read the component from the url
const readComponent = (url: string): Promise<string> =>
  fetch(url).then((res: any) => res.text());

// Get the raw url from the dir name
const toRawUrl = (dirName: string): string =>
  `https://raw.githubusercontent.com/realTristan/tailwindcomponents/main/tailwindcomponents/${dirName}/.html`;

// Generate a random key
const randomKey = (): string => Math.random().toString(36).substring(7);

// Get the files from the dir
const getDirFiles = async (url: string): Promise<any[]> => {
  // The files
  let files: any[] = [];

  // Get the files
  await fetch(url)
    .then((res: any) => res.json())
    .then((data: any) => {
      // Loop through the files
      for (let i = 0; i < data.length; i++) {
        // Check if the file is valid
        const file: any = data[i];
        if (file.type !== "file") continue;

        // Add the file
        files.push({
          name: file.name,
          sha: file.sha,
        });
      }
    });

  // Return the files
  return files;
};

// Get the components from the dirs
const getComponentsFromDirs = async (dirs: any[]): Promise<any[]> => {
  // The components
  let components: any[] = [];

  // Loop through the dirs
  for (let i = 0; i < dirs.length; i++) {
    // Check if the dir is valid
    const dir: any = dirs[i];
    if (dir.type !== "dir") continue;

    // Create a new component
    const files: any[] = await getDirFiles(dir.url);
    const comp: any = {
      name: dir.name,
      files: files,
      key: randomKey(),
      html_url: `${dir.html_url}/.html`,
      raw_url: toRawUrl(dir.name),
    };

    // Read the component
    await readComponent(comp.raw_url).then((content: string) => {
      comp.content = content;
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
  const [uploadData, setUploadData] = useState<any>({});
  const [accessToken, setAccessToken] = useState<string>("");

  // Use effect for access to window
  useEffect(() => {
    // Check if there was an error
    if (GITHUB_AUTH.errorOccurred()) {
      setError({
        message: GITHUB_AUTH.error(),
        description: GITHUB_AUTH.errorDescription(),
        uri: GITHUB_AUTH.errorUri(),
      });
      return;
    }

    // If the user is logged in or there was an error
    if (isLoggedIn || error) return;

    // Login to github
    GITHUB_AUTH.login();

    // Check if the user is logged in
    if (GITHUB_AUTH.isLoggedIn()) {
      setIsLoggedIn(true);
      setUploadData(GITHUB_AUTH.uploadData());
      setAccessToken(GITHUB_AUTH.accessToken() || "");
      getComponents().then((comps) => setComps(comps));
    }
  }, [error, isLoggedIn]);

  // If there was an error
  if (error) return <GithubAuthError error={error} />;

  // Check if the user is logged in or if there are no components
  if (!isLoggedIn || comps.length === 0) return <Spinner />;

  // Return the components
  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="mt-10 mb-7 text-6xl text-slate-900 font-black">
        Tailwind Components
      </h2>
      <p className="text-base text-slate-900 w-1/2 text-center mb-7">
        This is a collection of Tailwind CSS components that I have made. Any
        custom components that I make will be uploaded here. This project was
        made with{" "}
        <mark className="bg-transparent text-yellow-400 font-bold tracking-wide">
          Next.js
        </mark>{" "}
        and{" "}
        <mark className="bg-transparent text-blue-400 font-bold tracking-wide">
          Tailwind CSS
        </mark>{" "}
        and is hosted on{" "}
        <mark className="bg-transparent text-black font-bold tracking-wide">
          Vercel
        </mark>
        .
      </p>
      <Upload data={uploadData} />
      <ComponentsList components={comps} access_token={accessToken} />
    </div>
  );
}
