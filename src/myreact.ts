type JSXElement = {
	type: keyof HTMLElementTagNameMap;
	props: Record<string, any>;
	children: JSXElement[];
};
export const MyReact = {
	createElement: (
		type: keyof HTMLElementTagNameMap,
		props: Record<string, any>,
		...children: JSXElement[]
	): JSXElement => {
		return { type, props, children };
	},

	render(element: JSXElement | string, container: HTMLElement) {
		let htmlNode: Text | HTMLElement;
		if (typeof element === "string") {
			htmlNode = document.createTextNode(element);
		} else {
			htmlNode = document.createElement(element.type);
			if (element.props) {
				for (let [k, v] of Object.entries(element.props)) {
					htmlNode.setAttribute(k, v);
				}
			}

			for (let child of element.children) {
				this.render(child, htmlNode);
			}
		}

		container.appendChild(htmlNode);
	},
};
