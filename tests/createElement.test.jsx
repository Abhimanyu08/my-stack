const { MyReact } = require("../src/myreact");

/** @jsx MyReact.createElement */
const element = (
	<div id="foo">
		<p>hello</p>
	</div>
);

test("element is parsed correctly", () => {
	expect(element).toEqual({
		type: "div",
		props: {
			id: "foo",
			children: [
				{
					type: "p",
					props: {
						children: [
							{
								type: "TEXT_NODE",
								props: {
									nodeValue: "hello",
									children: [],
								},
							},
						],
					},
				},
			],
		},
	});
});
