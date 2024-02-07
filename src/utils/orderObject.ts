import {isEmpty} from "lodash";

export function orderByOrderObject(orderObject: Record<string, number>, objectDisorder: Record<string, any>): Record<string, any> {
    if(isEmpty(orderObject)) return objectDisorder;
    // Create a new object to store the ordered key-value pairs
    const orderedObject: Record<string, any> = {};
    const keysOrder = Object.keys(orderObject).sort((a, b) => orderObject[a] - orderObject[b]);
    const extraKeys = Object.keys(objectDisorder).filter(key => !keysOrder.includes(key));

    // First, add keys present in both objects, in the order specified
    keysOrder.forEach(key => {
        if (objectDisorder.hasOwnProperty(key)) {
            orderedObject[key] = objectDisorder[key];
        }
    });

    // Then, add keys present only in objectDisorder, at the end
    extraKeys.forEach(key => {
        if (objectDisorder.hasOwnProperty(key)) {
            orderedObject[key] = objectDisorder[key];
        }
    });

    return orderedObject;
}
