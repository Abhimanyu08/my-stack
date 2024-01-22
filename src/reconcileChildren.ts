import { Fiber } from "./types"

export default function reconcileChildren(unitOfWork: Fiber, deletions: Fiber[]) {

    let i = 0
    let prevFiber: Fiber | null = null
    let alternateFiber = unitOfWork?.alternate ? unitOfWork.alternate.child : null
    //the loop should go on till max(number of children of unitofwork, number of children of unitofwork.alternate)
    const children = typeof unitOfWork.type === "function" ? [unitOfWork.type(unitOfWork.props)] : unitOfWork.props.children
    while (i < children.length || alternateFiber !== null) {
        const child = children.at(i)
        let fiber: Fiber | null = null
        if (child) {

            fiber = {
                dom: null,
                parent: unitOfWork,
                props: child.props,
                type: child.type,
                sibling: null,
                child: null,
                operation: "PLACEMENT",
                alternate: null
            }
        }

        //Now we need to compare the child JSXElement to alternateChild JSXElement to determine the operation tag of the fiber
        if (fiber && alternateFiber && fiber.type === alternateFiber.type) {
            // both are of same type, only needs an update
            fiber.operation = "UPDATE"
            fiber.dom = alternateFiber.dom
            fiber.alternate = alternateFiber
        }
        if (fiber && alternateFiber && (fiber.type !== alternateFiber.type)) {
            fiber.alternate = null
            fiber.operation = "PLACEMENT"
        }
        if (alternateFiber && !fiber) {
            //fiber has to be deleted
            deletions.push(alternateFiber)
        }

        if (i === 0) {
            unitOfWork.child = fiber
        } else if (i < children.length) {
            if (prevFiber) prevFiber.sibling = fiber
        }
        if (fiber) prevFiber = fiber

        if (alternateFiber) {
            alternateFiber = alternateFiber.sibling
        }

        i++
    }

}