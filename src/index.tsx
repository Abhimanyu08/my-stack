import { MyReact } from "./myreact";

/** @jsx MyReact.createElement */
const element = (
	<div id="foo">
		<p>hello</p>
		<span>bye</span>
		<span> </span>
		<span>world</span>
	</div>
);

const root = document.getElementById("root")!;
MyReact.render(element, root);
