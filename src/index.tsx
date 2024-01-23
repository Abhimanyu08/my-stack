import { MyReact, useState } from "./myreact";

/** @jsx MyReact.createElement */
function Counter() {
	const [count, setCount] = useState(1);
	return (
		<div>
			<p>{count}</p>
			<button onClick={() => setCount(count + 1)}>increase</button>
		</div>
	);
}
/** @jsx MyReact.createElement */
const element = <Counter />;

const root = document.getElementById("root")!;
MyReact.render(element, root);
