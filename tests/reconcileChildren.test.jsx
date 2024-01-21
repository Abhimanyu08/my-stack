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

test("reconciled children correctly", () => {
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

const unitOfWorkWithAlternate = {
	dom: root,
	type: "body",
	props: {
		children: [alternateElement],
	},
	alternate: unitOfWorkWithoutAlternate,
};

reconcileChildren(unitOfWorkWithAlternate, deletions);
test("reconciled children correctly", () => {
	expect(unitOfWorkWithAlternate).toHaveProperty("child", {
		dom: null,
		parent: unitOfWorkWithAlternate,
		props: alternateElement.props,
		type: "div",
		sibling: null,
		child: null,
		operation: "UPDATE",
		alternate: {
			dom: null,
			parent: unitOfWorkWithoutAlternate,
			props: element.props,
			type: "div",
			sibling: null,
			child: null,
			operation: "PLACEMENT",
			alternate: null,
		},
	});
});
