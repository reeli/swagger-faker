import { pickRefKey } from "./utils";
import { mapValues, isArray, map } from "lodash";
import { ISchema, IReference } from "./__types__/OpenAPI";

export const putBackAllRefs = (schemas: { [key: string]: ISchema | IReference }) => {
  const store: { [key: string]: any } = {};

  mapValues(schemas, (s, k) => {
    if (store[k]) {
      return store[k];
    }

    const v = putBackRefs(store, schemas, s);
    store[k] = v;
    return v;
  });

  return store;
};

export const putBackRefs = (
  store: any,
  schemas: { [key: string]: ISchema | IReference },
  resp?: ISchema | IReference,
) => {
  if (!resp) {
    return;
  }

  function pickRefData(s: ISchema | IReference) {
    const refKey = pickRefKey(s.$ref);
    if (store[refKey]) {
      return store[refKey];
    }

    const resolvedRef = putBack(schemas[refKey]);
    store[refKey] = resolvedRef;
    return resolvedRef;
  }

  const putBack = (item: ISchema | IReference = {}): any => {
    // handle ref
    if (item.$ref) {
      return pickRefData(item);
    }

    const schema = item as ISchema;
    // handle object
    if (schema.type === "object" || schema.properties) {
      return {
        ...schema,
        properties: mapValues(schema.properties, (v3) => putBack(v3)),
      };
    }

    // handle array
    if (schema.items) {
      if (isArray(schema.items)) {
        return {
          ...schema,
          items: map(schema.items, (v) => putBack(v)),
        };
      }
      return {
        ...schema,
        items: putBack(schema.items),
      };
    }

    // handle oneOf
    if ((schema as any).oneOf) {
      return map((schema as any).oneOf, (v) => putBack(v));
    }

    // handle allOf
    if (schema.allOf) {
      return map((schema as any).allOf, (v) => putBack(v)).reduce((res, item1) => {
        return {
          ...res,
          properties: {
            ...res.properties,
            ...item1.properties,
          },
        };
      }, {});
    }

    return schema;
  };

  return putBack(resp);
};
