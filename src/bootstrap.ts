import { pickRefKey } from "./utils";
import { mapValues, isArray, map } from "lodash";
import { CustomSchema, CustomReference } from "@ts-tool/ts-codegen-core";

export const putBackAllRefs = (schemas: { [key: string]: CustomSchema | CustomReference }) => {
  const store: { [key: string]: any } = {};

  function pickRefData(s: CustomSchema) {
    const refKey = pickRefKey(s.$ref);
    if (store[refKey]) {
      return store[refKey];
    }

    const resolvedRef = putBackRefs(schemas[refKey]);
    store[refKey] = resolvedRef;
    return resolvedRef;
  }

  const putBackRefs = (schema: CustomSchema = {}): any => {
    // handle object
    if (schema.type === "object" || schema.properties) {
      return {
        ...schema,
        properties: mapValues(schema.properties, (v3) => putBackRefs(v3)),
      };
    }

    // handle array
    if (schema.items) {
      if (isArray(schema.items)) {
        return {
          ...schema,
          items: map(schema.items, (v) => putBackRefs(v)),
        };
      }
      return {
        ...schema,
        items: putBackRefs(schema.items),
      };
    }

    // handle ref
    if (schema.$ref) {
      return pickRefData(schema);
    }

    // handle oneOf
    if ((schema as any).oneOf) {
      return map((schema as any).oneOf, (v) => putBackRefs(v));
    }

    // handle allOf
    if (schema.allOf) {
      return map((schema as any).allOf, (v) => putBackRefs(v)).reduce((res, item) => {
        return {
          ...res,
          properties: {
            ...res.properties,
            ...item.properties,
          },
        };
      }, {});
    }

    return schema;
  };

  mapValues(schemas, (s, k) => {
    if (store[k]) {
      return store[k];
    }

    const v = putBackRefs(s);
    store[k] = v;
    return v;
  });

  return store;
};
