import { MyReact } from "./myreact";

/** @jsx MyReact.createElement */
const element = (
	<div id="foo">
		<p>hello</p>
	</div>
);

const root = document.getElementById("root")!;
console.log(element);
MyReact.render(element, root);
