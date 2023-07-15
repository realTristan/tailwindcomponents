export default class Utils {
  // Wrap the content so that tailwind will render
  public static readonly wrapHtml = (content: string): string =>
    `<!doctype html><html><head><meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    </head><body>${content}</body></html>`;
}
