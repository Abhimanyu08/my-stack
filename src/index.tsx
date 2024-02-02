import { MyReact, useState } from "./myreact";

/** @jsx MyReact.createElement */
function App() {
	const [status, setStatus] = useState<"show" | "hide">("show");
	return (
		<div>
			<Counter />
			{status === "show" ? <p>peekaboo</p> : <span></span>}
			<button
				onClick={
					status === "show"
						? () => setStatus("hide")
						: () => setStatus("show")
				}
			>
				{status === "show" ? "hide" : "show"}
			</button>
		</div>
	);
}

function Counter() {
	const [count, setCount] = useState(0);
	return (
		<div className="">
			<p>{count}</p>
			<button onClick={() => setCount((p) => p + 1)}>Increment</button>
		</div>
	);
}

const element = <App />;

const root = document.getElementById("root")!;
MyReact.render(element, root);
