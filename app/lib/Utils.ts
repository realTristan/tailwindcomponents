export default class Utils {
  // Monaco Editor Config
  public static readonly MONACO_CONFIG: any = {
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
  };

  // Wrap the content so that tailwind will render
  public static readonly wrapHtml = (content: string): string =>
    `<!doctype html><html><head><meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    </head><body>${content}</body></html>`;
}
