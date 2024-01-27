import { MyReact, useState } from "./myreact";

/** @jsx MyReact.createElement */
function Counter() {
	const [status, setStatus] = useState<"show" | "hide">("show");
	const [count, setCount] = useState(0);
	return (
		<div>
			{status === "show" ? <p>peekaboo</p> : <p></p>}
			<button
				onClick={
					status === "show"
						? () => setStatus("hide")
						: () => setStatus("show")
				}
			>
				{status === "show" ? "hide" : "show"}
			</button>
			<p>{count}</p>
			<button onClick={() => setCount(count + 1)}>Increment</button>
		</div>
	);
}
/** @jsx MyReact.createElement */
const element = <Counter />;

const root = document.getElementById("root")!;
MyReact.render(element, root);
