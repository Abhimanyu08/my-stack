import createElement from "./createElement";
import reconcileChildren from "./reconcileChildren";
import { Fiber, JSXElement } from "./types";

export const MyReact = {
	createElement: createElement,

	render(element: JSXElement, container: HTMLElement) {
		wipRoot = {
			dom: container,
			type: container.tagName as any,
			props: {
				children: [element],
			},
			parent: null,
			sibling: null,
			child: null,
			alternate: currentRoot,
			operation: "NOP"
		};

		nextUnitOfWork = wipRoot
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

//But we can't perform whole of render during browser's idle time. We need to break render into small steps.

let wipRoot: Fiber | null = null
let currentRoot: Fiber | null = null
let deletions: Fiber[] = []
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

	// -----------------------------Making a fiber for every child---------------------------------------	

	reconcileChildren(unitOfWork, deletions)


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

	if (wipRoot && !nextUnitOfWork) {
		commitRoot()
		currentRoot = wipRoot
		wipRoot = null;
	}
	requestIdleCallback(workloop);
};


function commitRoot() {

	if (wipRoot?.dom) {
		let child = wipRoot.child
		if (child) {
			wipRoot.dom.appendChild(child.dom!)
			wipRoot = child
			commitRoot()
		}
		while (child?.sibling) {
			child.parent!.dom!.appendChild(child.sibling.dom!)
			child = child.sibling
			wipRoot = child
			commitRoot()
		}
	}

}



