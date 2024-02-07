import {dateType, idType} from "../types/generic.types";
export class StoresAttributes {
    _id?: idType;
    store_name!: string;
    username!: string;
    created_at!: dateType;
    updated_at!: dateType;
}
