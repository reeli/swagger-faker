import { Schema, Spec } from "swagger-schema-official";
import { pickRefKey } from "./utils";
import { mapValues, isArray, map } from "lodash";

const store: { [key: string]: any } = {};

export const handleDefinitions = (spec: Spec) => {
  const resolveSchema = (v1: Schema): any => {
    function resolveRef(v: Schema) {
      const refKey = pickRefKey(v.$ref);
      if (store[refKey]) {
        return store[refKey];
      }

      const resolvedRef = handleRef(refKey, spec.definitions);
      store[refKey] = resolvedRef;
      return resolvedRef;
    }

    // handle object
    if (v1.type === "object" || v1.properties) {
      return {
        ...v1,
        properties: mapValues(v1.properties, (v3) => resolveSchema(v3)),
      };
    }

    // handle array
    if (v1.items) {
      if (isArray(v1.items)) {
        return {
          ...v1,
          items: map(v1.items, (v) => resolveSchema(v)),
        };
      }
      return {
        ...v1,
        items: resolveSchema(v1.items),
      };
    }

    // handle ref
    if (v1.$ref) {
      return resolveRef(v1);
    }

    // handle oneOf

    if ((v1 as any).oneOf) {
      return map((v1 as any).oneOf, (v) => resolveSchema(v));
    }

    // handle allOf

    if (v1.allOf) {
      return map((v1 as any).allOf, (v) => resolveSchema(v)).reduce((res, item) => {
        return {
          ...res,
          properties: {
            ...res.properties,
            ...item.properties,
          },
        };
      }, {});
    }

    return v1;
  };

  const handleRef = (refKey: string, definitions: Spec["definitions"]) => {
    return resolveSchema((definitions || {})[refKey]);
  };

  mapValues(spec.definitions, (v1, k) => {
    if (store[k]) {
      return store[k];
    }

    const v = resolveSchema(v1);
    store[k] = v;
    return v;
  });

  return store;
};
