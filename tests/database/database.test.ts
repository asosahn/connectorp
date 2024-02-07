import mongoose, {FlattenMaps} from "mongoose";
import Store from "../../src/schemas/test/test.schema";
import {StoresAttributes} from "../../src/schemas/test/stores.attributes";
import { first } from 'lodash';
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })





describe('database - test', () => {
    beforeAll( async() => {
        try {
            await mongoose.connect(process.env.MONGO_URL);
            console.info(`Connected to ${process.env.MONGO_URL}`)
        } catch (err: any){
            console.error(err);
            throw new Error(err);
        };
    })

    afterAll(async () => {
        try {
            await mongoose.disconnect();
        } catch (err: any) {
            console.error(err);
        }
    })


    test('getDocuments - find', async() => {
        const query = <StoresAttributes>{
            _id: { _toObjectId: "65bc8b67e69b90fce7ffb9d1" }
        };
        const project = { store_name: 1 };
        const data: FlattenMaps<Partial<StoresAttributes>[]> = await Store.getDocuments({ query, projection: project });
        const firstObject = first(data);
        expect(firstObject).toEqual(expect.objectContaining({
            store_name: expect.anything()
        }));
    });

    test('getDocument - findOne', async() => {
        const query = <StoresAttributes>{
            _id: { _toObjectId: "65bc8b67e69b90fce7ffb9d1" },
            created_at: { $gte: { _toDate: "2023-02-02T06:27:51.229Z" } }
        };
        const project = { store_name: 1 };
        const data: FlattenMaps<Partial<StoresAttributes>> | null = await Store.getDocument({ query, projection: project });
        expect(data).toEqual(expect.objectContaining({
            store_name: expect.anything()
        }));
    });

    test('getDocumentWithCount - aggregate with count and projection', async() => {
        const query = <StoresAttributes>{
            _id: { _toObjectId: "65bc8b67e69b90fce7ffb9d1" },
            created_at: { $gte: { _toDate: "2023-02-02T06:27:51.229Z" } }
        };
        const project = { store_name: 1 };
        const data: FlattenMaps<Partial<StoresAttributes>>[] = await Store.getDocumentsWithCount({ query, projection: project });
        const firstObject = first(data);
        expect(firstObject).toEqual(expect.objectContaining({
            data: expect.anything(),
            pageInfo: expect.anything(),
        }));
    });

    test('getDocumentWithCount - aggregate with count and without projection', async() => {
        const query = <StoresAttributes>{
            _id: { _toObjectId: "65bc8b67e69b90fce7ffb9d1" },
            created_at: { $gte: { _toDate: "2023-02-02T06:27:51.229Z" } }
        };
        const data: FlattenMaps<Partial<StoresAttributes>>[] = await Store.getDocumentsWithCount({ query });
        const firstObject = first(data);
        expect(firstObject).toEqual(expect.objectContaining({
            data: expect.anything(),
            pageInfo: expect.anything(),
        }));
    });
})
