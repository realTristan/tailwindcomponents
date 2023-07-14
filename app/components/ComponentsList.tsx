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
      <div className="flex flex-col items-center justify-center">
        {this.props.components.map((comp: any) => (
          <div key={comp.key} className="group w-1/2 my-5 mx-5 ">
            <div className="p-4 border-b-0 border-2 ring-2 ring-slate-900 rounded-lg">
              <div className="flex flex-row justify-between items-center">
                <a
                  href={comp.html_url}
                  className="text-2xl font-black tracking-widest text-slate-900 hover:underline underline-offset-4"
                >
                  {comp.name}
                </a>
                <button
                  onClick={() => {}}
                  className="text-slate-900 w-auto h-auto p-3 border-2 ring-2 ring-slate-900 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none hover:bg-slate-900 hover:text-white"
                >
                  Delete
                </button>
              </div>
            </div>
            <iframe
              srcDoc={this.wrap(comp.code)}
              className="w-full h-96 pt-4 border-2 ring-2 ring-slate-900 rounded-lg my-2"
              title={comp.name}
            />
            <code className="text-sm inline-flex text-center items-center space-x-4 border-2 rounded-lg ring-2 ring-slate-900 p-4 pl-6 h-auto">
              <span className="flex gap-4">
                <span className="flex-1">
                  <div className="text-slate-900 outline-none" contentEditable>{comp.code}</div>
                </span>
              </span>

              <svg
                className="shrink-0 h-7 w-7 transition text-slate-900 hover:text-blue-600 cursor-pointer active:text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                onClick={() => navigator.clipboard.writeText(comp.code)}
              >
                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z"></path>
                <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z"></path>
              </svg>
            </code>
          </div>
        ))}
      </div>
    );
  }
}
