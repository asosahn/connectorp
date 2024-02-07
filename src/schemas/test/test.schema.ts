import {Document, model, Schema} from "mongoose";
import { StoresAttributes } from "./stores.attributes";
import CommonSchemaClass, {ModelExt} from "../../mainClass/getClass";
;

export type StoresDocument = Document & StoresAttributes;

export const StoreSchema: Schema = new Schema<StoresDocument, unknown>(
  {
    store_name: String,
    username: String,
      created_at: Date,
      updated_at: Date
  }, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

StoreSchema.static('getDocuments', CommonSchemaClass.getDocuments)
StoreSchema.static('getDocument', CommonSchemaClass.getDocument)
StoreSchema.static('getDocumentsWithCount', CommonSchemaClass.getDocumentsWithCount)
StoreSchema.static('orderFields', (): Record<string, number> => {
    return {
        _id: 1,
        store_name: 2,
        username: 3,
        created_at: 4,
        updated_at: 5
    }
})

const Store = model<StoresDocument, ModelExt<StoresDocument>>("Store", StoreSchema, "stores");

export default Store;



