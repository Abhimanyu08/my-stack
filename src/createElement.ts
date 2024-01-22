import { JSXElement } from "./types";

export default function createElement(
    type: keyof HTMLElementTagNameMap | ((props) => JSXElement),
    props: Record<string, any>,
    ...children: JSXElement[]
): JSXElement {

    return {
        type,
        props: {
            ...props,
            children: children.map((c) => {
                return typeof c === "string"
                    ? { type: "TEXT_NODE", props: { nodeValue: c, children: [] } }
                    : c;
            }),
        },
    };
}