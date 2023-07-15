import React from "react";

export default class ComponentsList extends React.Component {
  constructor(props: any) {
    super(props);
    this.props = props || {};
  }
  props: any = {
    access_token: null,
    components: [],
  };
  state: any = {};

  // Wrap the content so that tailwind will render
  private readonly wrap = (content: string): string =>
    `<!doctype html><html><head><meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    </head><body>${content}</body></html>`;

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
            message: "Delete Component",
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

  // Remove a component from the list
  private readonly removeComp = (comp: any): void => {
    let comp_index: number = this.props.components.indexOf(comp);
    this.props.components.splice(comp_index, 1);
    this.setState({ components: this.state.components });
  };

  // Update a component's variable
  private readonly updateComp = (comp: any, data: any): void => {
    for (const k in data) comp[k] = data[k];
    this.setState({ components: this.state.components });
  };

  // When the delete button is pressed
  private readonly onDeleteButtonPressed = (comp: any): void => {
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

  // Copy code button component
  private readonly CopyCodeButton = (comp: any): JSX.Element => {
    const onClick = (): void => {
      navigator.clipboard.writeText(this.wrap(comp.content));
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
      onClick={() => this.onDeleteButtonPressed(comp)}
      className="mx-2 p-3 text-slate-900 text-sm hover:bg-gray-50 rounded-lg border-[1px] border-gray-200"
    >
      {comp.confirm_deletion
        ? `Confirm`
        : `Delete ${comp.name}`}
    </button>
  );

  // Cancel Button Component
  private readonly CancelButton = (comp: any): JSX.Element => {
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
  render() {
    // Set the state components
    this.state.components = this.props.components;

    // Return the html component
    return (
      <div>
        {this.state.components.map((comp: any) => (
          <div key={comp.key} className="my-6">
            <div className="mx-5 py-4 px-4 flex flex-row justify-start rounded-lg rounded-b-none bg-white border-[1px] border-b-0 border-gray-200">
              {this.GithubButton(comp)}
              {this.CopyCodeButton(comp)}
              <div className="w-[1px] h-11 bg-gray-200 mx-4"></div>
              {this.DeleteButton(comp)}
              {this.CancelButton(comp)}
              <p className="text-slate-900 text-sm mt-3 ml-4">{comp.status}</p>
            </div>
            <div className="mx-5 rounded-lg rounded-t-none bg-gray-100 border-[1px] border-gray-200">
              <iframe
                srcDoc={this.wrap(comp.content)}
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
