import createElement from "./createElement";
import reconcileChildren from "./reconcileChildren";
import { Fiber, JSXElement } from "./types";
import updateDom from "./updateDom";

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
			operation: "PLACEMENT"
		};

		nextUnitOfWork = wipRoot
		requestIdleCallback(workloop);
	},
};
export function useState<T>(value: T) {

	const fiber = nextUnitOfWork!
	const hookNumber = hookIndex
	if (!fiber.state) {

		fiber.state = []
		fiber.state.push(value)
	}
	function setValue(newValue: T | ((prev: T) => T)) {
		if (!fiber) return
		const newFiber: Fiber = { ...fiber, state: fiber.state! }

		newFiber.alternate = fiber
		newFiber.operation = "UPDATE"
		if (typeof newValue === "function") {

			newFiber.state![hookNumber] = (newValue as (prev: T) => T)(fiber.state![hookNumber])
		} else {
			newFiber.state![hookNumber] = newValue
		}
		nextUnitOfWork = newFiber
		wipFiber = nextUnitOfWork
	}

	hookIndex++
	let currentVal = fiber.state![hookNumber]
	return [currentVal, setValue] as const
}

//what we want is to perform the render in idle times of the browser. In future, render will be called everytime the state of a component changes. If the state of root component changes, this will post a problem because everytime state change will block the main event loop while the render function finishes.

//But we can't perform whole of render during browser's idle time. We need to break render into small steps.


function performUnitOfWork(unitOfWork: Fiber): Fiber | null {

	//---------------------------------Do the work on given fiber---------------------------
	// At this stage, fibers have an operation tag which has the value of "UPDATE" or "PLACEMENT". We have to do the appropriate thing for each one
	updateDom(unitOfWork)
	if (typeof unitOfWork.type === "function") {
		hookIndex = 0;
	}
	// -----------------------------Reconcile children---------------------------------------	
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
		commitWork()
	}
	if (wipFiber) {
		console.log(wipFiber)
		if (wipFiber.child) commitFiber(wipFiber.child)
		wipFiber = null
	}
	requestIdleCallback(workloop);
};


function commitWork() {
	if (wipRoot?.child)
		commitFiber(wipRoot?.child)
	currentRoot = wipRoot
	deletions.forEach((fiber) => {
		if (!fiber.parent || !fiber.dom) return
		fiber.parent.dom!.removeChild(fiber.dom)
	})
	deletions = []
	wipRoot = null;
}


function commitFiber(fiber: Fiber) {

	//committing a fiber is just attaching the fiber's dom to it's parent's dom. The parent of a fiber might be the function which doesn't have a dom when the fiber is child of a function component. In that case we may have to traverse the parent branch till we find one which has 

	if (!fiber.parent) return

	if (!fiber.dom) {
		if (fiber.child)
			commitFiber(fiber.child)
		if (fiber.sibling)
			commitFiber(fiber.sibling)

		return
	}

	let parent: Fiber | null = fiber.parent
	let parentDom = parent.dom
	while (parent && !parentDom) {
		parent = parent.parent
		if (parent) parentDom = parent.dom
	}

	if (!parentDom) return

	(parentDom as HTMLElement).appendChild(fiber.dom)

	if (fiber.child) commitFiber(fiber.child)
	if (fiber.sibling) commitFiber(fiber.sibling)

}

let wipRoot: Fiber | null = null
let wipFiber: Fiber | null = null
let currentRoot: Fiber | null = null
let deletions: Fiber[] = []
let nextUnitOfWork: Fiber | null = null;
let hookIndex = 0;

