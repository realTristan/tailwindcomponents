import React from "react";

export default class CodeBlock extends React.Component {
  constructor(props: any) {
    super(props);
    this.props = props || {};
  }
  props: any = {
    code: "",
  };
  render() {
    return (
      <code className="text-sm sm:text-base inline-flex text-center items-center space-x-4 bg-gray-800 text-white border-2 border-slate-950 border-t-0 p-4 pl-6 w-[35rem] h-auto">
        <span className="flex gap-4">
          <span className="flex-1">
            <span className="text-white">{this.props.code}</span>
          </span>
        </span>

        <svg
          className="shrink-0 h-7 w-7 transition text-gray-500 hover:text-white cursor-pointer active:text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          onClick={() => navigator.clipboard.writeText(this.props.code)}
        >
          <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z"></path>
          <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z"></path>
        </svg>
      </code>
    );
  }
}
