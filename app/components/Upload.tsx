import React, { useRef } from "react";
import Utils from "../lib/Utils";
import Editor from "@monaco-editor/react";

// Monaco Editor Options
const MONACO_OPTIONS: any = {
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

// Upload Component
export default class Upload extends React.Component {
  props: any = {};
  state: any = {
    status: "",
    component_name: "",
    component_content: "",
  };
  constructor(props: any) {
    super(props);
    this.props = props || {
      data: {
        access_token: null,
        refresh_token: null,
        expires_at: null,
        refresh_token_expires_at: null,
      },
    };
  }

  // Upload the component
  private readonly uploadComponent = (): void => {
    if (!this.state.component_name || !this.state.component_content) {
      this.setState({ status: "Component Name or Content is Empty" });
      return;
    }
    this.setState({ status: "Uploading Component" });

    fetch(
      `https://api.github.com/repos/realTristan/tailwindcomponents/contents/tailwindcomponents/${this.state.component_name}/.html`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.props.data.access_token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
          message: `Uploaded Component: ${this.state.component_name}`,
          content: btoa(this.state.component_content),
        }),
      }
    )
      .then((res) => res.status)
      .then((status) => {
        if (status === 201) {
          this.setState({ status: "Component Uploaded" });
        } else {
          this.setState({ status: "Component Upload Failed" });
        }
      });
  };

  // Render the component
  render() {
    return (
      <div className="my-6">
        <div className="mx-5 py-4 px-4 flex flex-row justify-start rounded-lg rounded-b-none bg-white border-[1px] border-b-0 border-gray-200">
          <input
            onChange={(e) => this.setState({ component_name: e.target.value })}
            type="text"
            placeholder="Component Name"
            className="mx-1 p-3 text-slate-900 text-sm hover:bg-gray-50 rounded-lg border-[1px] border-gray-200"
          />
          <button
            onClick={() => this.uploadComponent()}
            className="mx-2 p-3 text-slate-900 text-sm hover:bg-gray-50 rounded-lg border-[1px] border-gray-200"
          >
            Upload
          </button>
          <p className="text-slate-900 text-sm mt-3 ml-4">
            {this.state.status}
          </p>
        </div>
        <Editor
          height={150}
          width={1000}
          onChange={(e) => this.setState({ component_content: e })}
          className={`mx-5 pr-10 rounded-lg rounded-t-none border-[1px] border-gray-200 ${
            this.state.component_content ? "border-b-0 rounded-b-none" : ""
          }`}
          defaultLanguage="html"
          options={MONACO_OPTIONS}
        />
        <iframe
          srcDoc={Utils.wrapHtml(this.state.component_content)}
          className={`w-[60rem] h-96 p-8 mx-5 rounded-lg rounded-t-none bg-gray-100 border-[1px] border-gray-200 ${
            this.state.component_content ? "" : "hidden"
          }`}
          title={this.state.component_name}
        />
      </div>
    );
  }
}
