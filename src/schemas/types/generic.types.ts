import {ObjectId} from "mongodb";


export type idType = ObjectId | { _toObjectId: string }
export type dateType = string | Date | { _toDate: string } | any
