import { Fiber } from "./types"

const isEvent = (key: string) => key.startsWith("on")
export default function updateDom(unitOfWork: Fiber) {

    if (typeof unitOfWork.type === "function") return
    if (!unitOfWork.dom) {
        unitOfWork.dom = unitOfWork.type === "TEXT_NODE" ? document.createTextNode(unitOfWork.props.nodeValue) : document.createElement(unitOfWork.type)
    }
    if (unitOfWork.type === "TEXT_NODE") return

    if (unitOfWork.operation === "UPDATE") {
        // remove old attributes
        for (let [key, val] of Object.entries(unitOfWork.alternate!.props)) {
            if (key === "children") continue
            if (isEvent(key)) {
                unitOfWork.dom.removeEventListener(key.toLowerCase().substring(2), val)
            }
            (unitOfWork.dom as HTMLElement).setAttribute(key, "")
        }
    }

    for (let [key, val] of Object.entries(unitOfWork.props)) {
        if (key === "children") continue
        if (isEvent(key)) {
            unitOfWork.dom.addEventListener(key.toLowerCase().substring(2), val)
        }

        (unitOfWork.dom as HTMLElement).setAttribute(key, val)
    }
}
