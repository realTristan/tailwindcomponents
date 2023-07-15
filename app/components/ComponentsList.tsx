import React from "react";

export default class ComponentsList extends React.Component {
  constructor(props: any) {
    super(props);
    this.props = props || {};
  }
  props: any = {
    components: [],
  };

  // Wrap the code so that tailwind will render
  private readonly wrap = (code: string): string =>
    `<!doctype html><html><head><meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    </head><body>${code}</body></html>`;

  render() {
    return (
      <div>
        {this.props.components.map((comp: any) => (
          <div key={comp.key} className="my-6">
            <div className="mx-5 py-4 px-4 flex flex-row justify-start rounded-lg rounded-b-none bg-white border-[1px] border-b-0 border-gray-200">
              <a
                href={comp.html_url}
                target="_blank"
                rel="noreferrer"
                className="mx-2 p-3 text-slate-900 text-sm hover:bg-gray-50 rounded-lg border-[1px] border-gray-200"
              >
                Github
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(comp.code)}
                className="mx-2 p-3 text-slate-900 text-sm hover:bg-gray-50 rounded-lg border-[1px] border-gray-200"
              >
                Copy Code
              </button>
              <button
                onClick={() => {}}
                className="mx-2 p-3 text-slate-900 text-sm hover:bg-gray-50 rounded-lg border-[1px] border-gray-200"
              >
                Delete
              </button>
            </div>
            <div className="mx-5 rounded-lg rounded-t-none bg-gray-100 border-[1px] border-gray-200">
              <iframe
                srcDoc={this.wrap(comp.code)}
                className="w-[60rem] h-96 my-10 p-4"
                title={comp.name}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
}
