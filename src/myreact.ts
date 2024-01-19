export const MyReact = {
	createElement: (
		type: string,
		props: Record<string, any>,
		...children: any[]
	) => {
		return { type, props, children };
	},
};
