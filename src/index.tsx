import { MyReact } from "./myreact";

/** @jsx MyReact.createElement */
function App(props) {
	return <h1>Hi {props.name}</h1>;
}
const element = <App name="foo" />;

const root = document.getElementById("root")!;
MyReact.render(element, root);
