import {convertToQuery} from "../../src/utils/convert";
import {orderByOrderObject} from "../../src/utils/orderObject";


describe('utils', () => {

    const query =  [
        {
            _id: { _toObjectId: "5f8a89c66482b91f7666cbf3" },
            created_at: {  $gt: { _toDate: "2020-10-17T06:05:58.068Z" }, $lt: { _toDate: "2020-10-17T06:05:58.068Z" } }
        }
    ]

    test('convertQuery', async () => {
        const copyQuery = [...query];
        convertToQuery(copyQuery);
        const jsonQuery = JSON.stringify(copyQuery);
        expect(jsonQuery).toEqual(JSON.stringify([
            {
                _id: "5f8a89c66482b91f7666cbf3",
                created_at: {
                    "$gt": "2020-10-17T06:05:58.068Z",
                    "$lt": "2020-10-17T06:05:58.068Z"
                }
            }
        ]));
    });

    test('orderObject - object must be ordered based on the objectOrder', () => {
        const objectOrder: Record<string, number> = {
            name: 1,
            description: 2,
            createdAt: 3
        };
        const dataObject: Record<string, any> = {
            createdAt: "today",
            name: "test",
            description: "testing order function"
        }

        const orderData = orderByOrderObject(objectOrder, dataObject);
        expect(orderData).toEqual({
            name: "test",
            description: "testing order function",
            createdAt: "today"
        })
    })

    test('orderObject - if a field is missing related to the object disorder, it must put the missing fields to the end', () => {
        const objectOrder: Record<string, number> = {
            name: 1,
            createdAt: 3
        };
        const dataObject: Record<string, any> = {
            createdAt: "today",
            name: "test",
            description: "testing order function"
        }

        const orderData = orderByOrderObject(objectOrder, dataObject);
        expect(orderData).toEqual({
            name: "test",
            createdAt: "today",
            description: "testing order function",
        })
    })

    test('orderObject with objetOrder empty must return the same object', () => {
        const objectOrder: Record<string, number> = {};
        const dataObject: Record<string, any> = {
            createdAt: "today",
            name: "test",
            description: "testing order function"
        }

        const orderData = orderByOrderObject(objectOrder, dataObject);
        expect(orderData).toEqual( {
            createdAt: "today",
            name: "test",
            description: "testing order function"
        })
    })

    test('orderObject with objetOrder null must return the same object', () => {
        const objectOrder: Record<string, number> = {};
        const dataObject: Record<string, any> = {
            createdAt: "today",
            name: "test",
            description: "testing order function"
        }

        const orderData = orderByOrderObject(objectOrder, dataObject);
        expect(orderData).toEqual( {
            createdAt: "today",
            name: "test",
            description: "testing order function"
        })
    })
});
