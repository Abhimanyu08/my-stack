type JSXElement = {
	type: keyof HTMLElementTagNameMap | "TEXT_NODE";
	props: {
		[k: string]: any;
		children: JSXElement[];
	};
};

type Fiber = {
	dom: HTMLElement | Text | null;
	type: JSXElement["type"] | "root";
	props: JSXElement["props"];
	parent: Fiber | null;
	sibling: Fiber | null;
	child: Fiber | null;
};
export const MyReact = {
	createElement: (
		type: keyof HTMLElementTagNameMap,
		props: Record<string, any>,
		...children: JSXElement[]
	): JSXElement => {
		return {
			type,
			props: {
				...props,
				children: children.map((c) => {
					return typeof c === "string"
						? { type: "TEXT_NODE", props: { nodeValue: c, children: [] } }
						: c;
				}),
			},
		};
	},

	render(element: JSXElement, container: HTMLElement) {
		rootFiber = {
			dom: container,
			type: container.tagName as any,
			props: {
				children: [element],
			},
			parent: null,
			sibling: null,
			child: null
		};

		nextUnitOfWork = rootFiber
		requestIdleCallback(workloop);


		// ---------------------------------Naive way of doing things---------------------------------
		// let htmlNode: Text | HTMLElement;
		// if (element.type === "TEXT_NODE") {
		// 	htmlNode = document.createTextNode(element.props.nodeValue);
		// } else {
		// 	htmlNode = document.createElement(element.type);
		// 	if (element.props) {
		// 		for (let [k, v] of Object.entries(element.props)) {
		// 			if (k === "children") continue;
		// 			htmlNode.setAttribute(k, v);
		// 		}
		// 	}

		// 	for (let child of element.props.children) {
		// 		this.render(child, htmlNode);
		// 	}
		// }

		// container.appendChild(htmlNode);
	},
};

//what we want is to perform the render in idle times of the browser. In future, render will be called everytime the state of a component changes. If the state of root component changes, this will post a problem because everytime state change will block the main event loop while the render function finishes.

//But we can't perform whole of render duing browser's idle time. We need to break render into small steps.

let rootFiber: Fiber | null = null
let nextUnitOfWork: Fiber | null = null;

function performUnitOfWork(unitOfWork: Fiber): Fiber | null {
	//A unit of work consists of
	// 1. Making a DOM element for the Fiber
	// 2. Attach the new DOM element to the parent's DOM - this step is removed from latest implementation because we add stuff to DOM in one go rather than on every performUnitOfWork call.
	// 2. Making a Fiber for all the children
	// 3. Returning back the next unit of work

	// ----------------------------Making a DOM element for the Fiber--------------------------------
	let htmlNode = unitOfWork.dom;
	if (!htmlNode) {
		if (unitOfWork.type === "TEXT_NODE") {

			htmlNode = document.createTextNode(unitOfWork.props.nodeValue)
		}
		else {

			htmlNode = document.createElement(unitOfWork.type);
			if (unitOfWork.props) {
				for (let [k, v] of Object.entries(unitOfWork.props)) {
					if (k === "children") continue;
					htmlNode.setAttribute(k, v);
				}
			}
		}
		unitOfWork.dom = htmlNode

	}

	// ----------------------------Attach the new DOM element to the parent's DOM--------------------------------
	// Now that we've split our work in chunks, the problem lies here. We are adding an HtmlNode to the DOM while performing the work. This work can be interrupted anytime by the browser, which may lead to user seeing an incomplete UI. The solution to this would be to build the whole fiber tree in idle times, and then commit all the dom nodes corresponding to every leaf in the fiber to the actual DOM at once. Let's comment out the "Attach new Dom element to the parent's DOM" part

	// if (unitOfWork.parent) {
	// 		unitOfWork.parent.dom?.appendChild(htmlNode)
	// }

	// -----------------------------Making a fiber for every child---------------------------------------	
	let i = 0
	let prevFiber: Fiber | null = null
	for (let child of unitOfWork.props.children) {
		let fiber: Fiber = {
			dom: null,
			parent: unitOfWork,
			props: child.props,
			type: child.type,
			sibling: null,
			child: null
		}

		if (i === 0) {
			unitOfWork.child = fiber
		} else {
			if (prevFiber) prevFiber.sibling = fiber
		}
		prevFiber = fiber

		i++
	}


	// -----------------------------Returning the new unit of work--------------------------------------	
	if (unitOfWork.child) {
		return unitOfWork.child
	}

	let currentUnitOfWork: Fiber | null = unitOfWork
	while (currentUnitOfWork) {
		if (currentUnitOfWork.sibling) {
			return currentUnitOfWork.sibling
		}
		currentUnitOfWork = currentUnitOfWork.parent
	}

	return currentUnitOfWork
}

const workloop: IdleRequestCallback = (deadline) => {
	let shouldStopThisCallback = false;
	while (nextUnitOfWork && !shouldStopThisCallback) {
		nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
		shouldStopThisCallback = deadline.timeRemaining() < 1;
	}

	if (rootFiber && !nextUnitOfWork) {
		commitRoot()
	}
	rootFiber = null;
	requestIdleCallback(workloop);
};


function commitRoot() {

	if (rootFiber?.dom) {
		let child = rootFiber.child
		if (child) {
			rootFiber.dom.appendChild(child.dom!)
			rootFiber = child
			commitRoot()
		}
		while (child?.sibling) {
			child.parent!.dom!.appendChild(child.sibling.dom!)
			child = child.sibling
			rootFiber = child
			commitRoot()
		}
	}

}



