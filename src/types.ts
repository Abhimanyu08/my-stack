export type JSXElement = {
    type: keyof HTMLElementTagNameMap | "TEXT_NODE" | ((props: Record<string, any>) => JSXElement);
    props: {
        [k: string]: any;
        children: JSXElement[];
    };
};

export type Fiber = {
    dom: HTMLElement | Text | null;
    type: JSXElement["type"] | "root";
    props: JSXElement["props"];
    parent: Fiber | null;
    sibling: Fiber | null;
    child: Fiber | null;
    alternate: Fiber | null;
    operation: "UPDATE" | "PLACEMENT"
};