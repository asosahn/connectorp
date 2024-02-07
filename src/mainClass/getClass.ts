import { Model, QueryOptions, FlattenMaps, AggregateOptions } from "mongoose";
import { convertToQuery } from "../utils/convert";
import { orderByOrderObject } from "../utils/orderObject";
import {isEmpty, isObject, merge} from "lodash";
import cleanDeep from "clean-deep";

type QueryConnector = {
  query: Record<string, any> | any;
  projection?: string | Record<string, number>;
  sort?: Record<string, number> | Record<string, number>[];
  skip?: number;
  limit?: number;
  orderAttributes?: Record<string, number>;
};

type QueryConnectorFindOne = Pick<
  QueryConnector,
  "query" | "projection" | "sort" | "orderAttributes"
>;
export interface ModelExt<T> extends Model<T> {
  getDocuments: (
    props: QueryConnector,
    options?: QueryOptions,
  ) => Promise<FlattenMaps<any>[]>;
  getDocument: (
    props: QueryConnectorFindOne,
    options?: QueryOptions,
  ) => Promise<FlattenMaps<any>>;
  orderFields: () => Record<string, number>;
  getDocumentsWithCount: (
    props: QueryConnector,
    options?: AggregateOptions,
  ) => Promise<FlattenMaps<any>[]>;
}

export default class CommonSchemaClass extends Model implements ModelExt<any> {
  static getDocuments(
    props: QueryConnector,
    options?: QueryOptions,
  ): Promise<FlattenMaps<any>[] | null> {
    const {
      query,
      projection = "",
      sort = [],
      skip = 0,
      limit = 0,
      orderAttributes = undefined,
    } = props;
    convertToQuery(query);
    const getOrderFields = (this as any).orderFields();
    const queryOrdered: Record<string, any> = orderByOrderObject(
      orderAttributes ?? getOrderFields,
      query,
    );
    return this.find(queryOrdered, options)
      .read("secondaryPreferred")
      .select(projection)
      .sort(<any>sort)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  }

  static getDocument(
    props: QueryConnectorFindOne,
    options?: QueryOptions,
  ): Promise<FlattenMaps<any> | null> {
    const {
      query,
      projection = "",
      sort = [],
      orderAttributes = undefined,
    } = props;
    convertToQuery(query);
    const getOrderFields = (this as any).orderFields() ?? undefined;
    const queryOrdered: Record<string, any> = orderByOrderObject(
      orderAttributes ?? getOrderFields,
      query,
    );
    return this.findOne(queryOrdered, options)
      .read("secondaryPreferred")
      .select(projection)
      .sort(<any>sort)
      .lean()
      .exec();
  }

  static getDocumentsWithCount(
    props: QueryConnector,
    options?: AggregateOptions,
  ): Promise<FlattenMaps<any>[]> {
    const {
      query = {},
      projection = "",
      limit = undefined,
      sort = [],
      skip = 0,
      orderAttributes = undefined
    } = props;
    function getArr(...args: any) {
      return args;
    }
    convertToQuery(query);
    const getOrderFields = (this as any).orderFields() ?? undefined;
    const queryOrdered: Record<string, any> = orderByOrderObject(
        orderAttributes ?? getOrderFields,
        query,
    );
    let determineProjection = undefined;
    if(!isEmpty(projection)) {
      if(isObject(projection)) {
        determineProjection = projection;
      } else {
        determineProjection = merge(
            getArr(
                ...(projection as any)
                    .split(" ")
                    .map((item: string) => ({
                      [item.replace(/-/g, "")]: item.includes("-") ? 0 : 1,
                    }))
                    .flat(Infinity),
            ),
        )
      }
    }
    const aggregate = cleanDeep(
      [
        {
          $match: queryOrdered,
        },
        {
          $project: determineProjection,
        },
        {
          $facet: {
            data: [{ $sort: sort }, { $skip: skip }, { $limit: limit }],
            pageInfo: [{ $group: { _id: null, total: { $sum: 1 } } }],
          },
        },
      ],
      { nullValues: false },
    );
    return this.aggregate(<any>aggregate, options)
      .allowDiskUse(true)
      .read("secondaryPreferred")
      .exec();
  }
}
// export default class CommonSchemaClass extends Model implements ModelExt<any> {
//   static getDocuments = GetDocuments.getDocuments;
//   static getDocument = GetDocuments.getDocument;
//   static orderFields = noop();
// }
