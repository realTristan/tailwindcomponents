import React from "react";

export default class Upload extends React.Component {
  constructor(props: any) {
    super(props);
    this.props = props || {};
  }
  props: any = {
    data: {
      access_token: null,
      refresh_token: null,
      expires_at: null,
      refresh_token_expires_at: null,
    },
  };
  state: any = {
    status: "",
    component_name: "",
    component_content: "",
  };

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
          message: "Upload Component",
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
        <textarea
          placeholder="Component Content"
          onChange={(e) => this.setState({ component_content: e.target.value })}
          className="p-6 mx-5 w-[60rem] min-h-[7rem] rounded-lg rounded-t-none bg-gray-100 border-[1px] border-gray-200 text-slate-900 text-sm outline-none"
        />
      </div>
    );
  }
}
