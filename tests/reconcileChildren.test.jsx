const reconcileChildren = require("../src/reconcileChildren").default;
const { MyReact } = require("../src/myreact");

/** @jsx MyReact.createElement */
const element = (
	<div id="foo">
		<p>hello</p>
		<p>world</p>
	</div>
);

const deletions = [];
const root = document.createElement("body");
const unitOfWorkWithoutAlternate = {
	dom: root,
	type: "body",
	props: {
		children: [element],
	},
	alternate: null,
};

reconcileChildren(unitOfWorkWithoutAlternate, deletions);

test("reconciled new children correctly", () => {
	expect(unitOfWorkWithoutAlternate).toHaveProperty("child", {
		dom: null,
		parent: unitOfWorkWithoutAlternate,
		props: element.props,
		type: "div",
		sibling: null,
		child: null,
		operation: "PLACEMENT",
		alternate: null,
	});
});

/** @jsx MyReact.createElement */
const alternateElement = (
	<div id="bar">
		<p>hello</p>
		<p>world</p>
	</div>
);
const divElem = document.createElement("div");

const unitOfWorkWithAlternate = {
	dom: root,
	type: "body",
	props: {
		children: [alternateElement],
	},
	alternate: {
		...unitOfWorkWithoutAlternate,
		child: { ...unitOfWorkWithoutAlternate.child, dom: divElem },
	},
};

reconcileChildren(unitOfWorkWithAlternate, deletions);
test("reconciled updated children correctly", () => {
	expect(unitOfWorkWithAlternate).toHaveProperty("child", {
		dom: divElem,
		parent: unitOfWorkWithAlternate,
		props: alternateElement.props,
		type: "div",
		sibling: null,
		child: null,
		operation: "UPDATE",
		alternate: { ...unitOfWorkWithoutAlternate.child, dom: divElem },
	});
});

/** @jsx MyReact.createElement */
const newElement = <span>hello</span>;

const unitOfWorkWithNewChild = {
	...unitOfWorkWithAlternate,
	props: {
		children: [newElement],
	},
};

reconcileChildren(unitOfWorkWithNewChild, deletions);

test("reconciled replaced children correctly", () => {
	expect(unitOfWorkWithNewChild).toHaveProperty("child", {
		dom: null,
		parent: unitOfWorkWithNewChild,
		props: newElement.props,
		type: "span",
		sibling: null,
		child: null,
		operation: "PLACEMENT",
		alternate: null,
	});
});
