import React from "react";
import Utils from "../lib/Utils";
import Editor from "@monaco-editor/react";

export default class ComponentsList extends React.Component {
  props: any = {};
  constructor(props: any) {
    super(props);
    this.props = props || {
      access_token: null,
      components: [],
    };
  }

  // Delete the component
  private readonly deleteComponent = (comp: any): void => {
    for (let i = 0; i < comp.files.length; i++) {
      let file: any = comp.files[i];
      fetch(
        `https://api.github.com/repos/realTristan/tailwindcomponents/contents/tailwindcomponents/${comp.name}/${file.name}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.props.access_token}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
          body: JSON.stringify({
            message: `Deleted Component: ${comp.name}`,
            sha: file.sha,
          }),
        }
      )
        .then((res) => res.status)
        .then((status) => {
          if (status === 200) this.removeComp(comp);
          else
            this.updateComp(comp, { status: "Failed to delete the component" });
        });
    }
  };

  // Update Component Content
  private readonly updateComponentContent = (comp: any) => {
    let file: any | undefined;
    for (let i = 0; i < comp.files.length; i++) {
      if (comp.files[i].name.endsWith(".html")) {
        file = comp.files[i];
        break;
      }
    }

    // If the file is undefined, then we can't update the component
    if (!file) {
      this.updateComp(comp, { status: "Failed to update component" });
      return;
    }

    // Update the component
    fetch(
      `https://api.github.com/repos/realTristan/tailwindcomponents/contents/tailwindcomponents/${comp.name}/.html`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.props.access_token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
          message: `Updated Component: ${comp.name}`,
          content: btoa(comp.content),
          sha: file.sha,
        }),
      }
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.content.sha) {
          file.sha = json.content.sha;
          this.updateComp(comp, {
            status: "Component Updated",
            editing: false,
            files: comp.files,
          });
        } else {
          this.updateComp(comp, { status: "Failed to update component" });
        }
      });
  };

  // Remove a component from the list
  private readonly removeComp = (comp: any): void => {
    let comp_index: number = this.props.components.indexOf(comp);
    this.props.components.splice(comp_index, 1);
    this.setState({ components: this.props.components });
  };

  // Update a component's variable
  private readonly updateComp = (comp: any, data: any): void => {
    for (const k in data) comp[k] = data[k];
    this.setState({ components: this.props.components });
  };

  // When the delete button is clicked
  private readonly onDeleteButtonClicked = (comp: any): void => {
    if (comp.confirm_deletion && comp.confirm_deletion !== null) {
      this.deleteComponent(comp);
      this.updateComp(comp, {
        confirm_deletion: false,
        status: "Deleting component",
      });
    } else {
      this.updateComp(comp, { confirm_deletion: true });
    }
  };

  // Github button component
  private readonly GithubButton = (comp: any): JSX.Element => (
    <a
      href={comp.html_url}
      target="_blank"
      rel="noreferrer"
      className="mx-2 p-3 text-slate-900 text-sm hover:bg-gray-50 rounded-lg border-[1px] border-gray-200"
    >
      Github
    </a>
  );

  // On edit button clicked
  private readonly onEditButtonClicked = (comp: any): void => {
    if (comp.editing) {
      this.updateComp(comp, { status: "Saving changes to component" });
      this.updateComponentContent(comp);
    } else {
      this.updateComp(comp, { editing: true });
    }
  };

  // Edit button component
  private readonly EditButton = (comp: any): JSX.Element => (
    <button
      onClick={() => this.onEditButtonClicked(comp)}
      className="mx-2 p-3 text-slate-900 text-sm hover:bg-gray-50 rounded-lg border-[1px] border-gray-200"
    >
      {comp.editing ? `Save Changes` : `Edit ${comp.name}`}
    </button>
  );

  // Cancel Edit Button Component
  private readonly CancelEditButton = (comp: any): JSX.Element => {
    const state: string = comp.editing ? "block" : "hidden";
    return (
      <button
        onClick={() => this.updateComp(comp, { editing: false })}
        className={`mx-2 p-3 text-slate-900 text-sm hover:bg-gray-50 rounded-lg border-[1px] border-gray-200 ${state}`}
      >
        Cancel
      </button>
    );
  };

  // Monaco Editor component
  private readonly MonacoEditor = (comp: any): JSX.Element => (
    <Editor
      height={comp.editing ? 200 : 0}
      width={1000}
      onChange={(e) => {
        comp.content = e;
        this.setState({ components: this.props.components });
      }}
      className={`mx-5 pr-10 border-[1px] border-gray-200 ${
        comp.editing ? "block border-b-0" : "hidden"
      }`}
      value={comp.content}
      defaultLanguage="html"
      options={Utils.MONACO_CONFIG}
    />
  );

  // Copy code button component
  private readonly CopyCodeButton = (comp: any): JSX.Element => {
    const onClick = (): void => {
      navigator.clipboard.writeText(comp.content);
      this.updateComp(comp, { status: "Copied the code to clipboard" });
    };
    return (
      <button
        onClick={() => onClick()}
        className="mx-2 p-3 text-slate-900 text-sm hover:bg-gray-50 rounded-lg border-[1px] border-gray-200"
      >
        Copy Code
      </button>
    );
  };

  // Delete button component
  private readonly DeleteButton = (comp: any): JSX.Element => (
    <button
      onClick={() => this.onDeleteButtonClicked(comp)}
      className="mx-2 p-3 text-slate-900 text-sm hover:bg-gray-50 rounded-lg border-[1px] border-gray-200"
    >
      {comp.confirm_deletion ? `Confirm` : `Delete ${comp.name}`}
    </button>
  );

  // Cancel Deletion Button Component
  private readonly CancelDeletionButton = (comp: any): JSX.Element => {
    const state: string = comp.confirm_deletion ? "block" : "hidden";
    return (
      <button
        onClick={() => this.updateComp(comp, { confirm_deletion: false })}
        className={`mx-2 p-3 text-slate-900 text-sm hover:bg-gray-50 rounded-lg border-[1px] border-gray-200 ${state}`}
      >
        Cancel
      </button>
    );
  };

  // Render the component
  render = () => (
    <div>
      {this.props.components.map((comp: any) => (
        <div key={comp.key} className="mt-6 mb-10">
          <div className="mx-5 py-4 px-4 flex flex-row justify-start rounded-lg rounded-b-none bg-white border-[1px] border-b-0 border-gray-200">
            {this.GithubButton(comp)}
            {this.CopyCodeButton(comp)}
            <div className="w-[1px] h-11 bg-gray-200 mx-4"></div>
            {this.EditButton(comp)}
            {this.CancelEditButton(comp)}
            <div className="w-[1px] h-11 bg-gray-200 mx-4"></div>
            {this.DeleteButton(comp)}
            {this.CancelDeletionButton(comp)}
            <p className="text-slate-900 text-sm mt-3 ml-4">{comp.status}</p>
          </div>
          {this.MonacoEditor(comp)}
          <iframe
            srcDoc={Utils.wrapHtml(comp.content)}
            className="w-[60rem] h-96 pt-10 mx-5 rounded-lg rounded-t-none bg-gray-100 border-[1px] border-gray-200"
            title={comp.name}
          />
        </div>
      ))}
    </div>
  );
}
