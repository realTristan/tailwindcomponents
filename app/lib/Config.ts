const config: any = {
  monaco_options: {
    overviewRulerLanes: 0,
    lineHeight: 25,
    padding: {
      top: 20,
      bottom: 20,
    },
    scrollBeyondLastLine: false,
    minimap: { enabled: false },
    wordWrap: "on",
    scrollbar: {
      vertical: "hidden",
      horizontal: "hidden",
    },
  },
  client_id: "Iv1.2a8798736f1f1aa0",
  is_prod: true,
};
config.home_uri = config.is_prod
  ? "https://tailwindcomponents-gules.vercel.app"
  : "http://localhost:3000";

export default config;
