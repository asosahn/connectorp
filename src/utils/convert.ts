import {isArray, isObject} from 'lodash';
import {ObjectId} from "mongodb";
import moment from 'moment-timezone';


export type QueryToConvert = Record<string, any> | Record<string, any>[];
export type QueryObject = Record<string, any>;

export function evaluateCondition({ condition }: { condition: QueryObject }) {
    if(!isObject(condition)) return;
    Object.keys(condition).forEach((key: string)  => {
        if (condition[key].hasOwnProperty('_toObjectId')) {
            condition[key] = new ObjectId(condition[key]['_toObjectId'])
        } else if (condition[key].hasOwnProperty('_toDate')) {
            condition[key] = moment(condition[key]['_toDate']).utc().toDate()
        } else if(isObject(condition[key])) {
            evaluateCondition({ condition: condition[key] });
        }
    });
}

export function convertToQuery(input: QueryToConvert) {
    if(isArray(input)) {
        input.forEach((condition: QueryObject) => {
            evaluateCondition({condition});
        });
    } else {
        evaluateCondition({condition: input});
    }
}

