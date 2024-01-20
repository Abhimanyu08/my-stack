import { MyReact } from "./myreact";

/** @jsx MyReact.createElement */
const element = (
	<div id="foo">
		<p>hello</p>
		<span>bye</span>
		<span> </span>
		<span>world</span>
		<div>
			This should work fine I guess
			<li>1</li>
			<li>2</li>
			<li>3</li>
			<li>4</li>
		</div>
	</div>
);

const root = document.getElementById("root")!;
MyReact.render(element, root);
