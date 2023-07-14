import React from "react";
import CodeBlock from "./CodeBlock";

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
      <div className="flex flex-col justify-center items-center">
        {this.props.components.map((comp: any) => (
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
                srcDoc={this.wrap(comp.code)}
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
}
