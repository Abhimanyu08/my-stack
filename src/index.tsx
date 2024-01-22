import { MyReact } from "./myreact";

/** @jsx MyReact.createElement */
function App(props) {
	return (
		<div>
			<span>{props.greeting}</span>
			<span> </span>
			<span>{props.name}</span>
		</div>
	);
}
const element = <App greeting="hello" name="world" />;

const root = document.getElementById("root")!;
MyReact.render(element, root);
