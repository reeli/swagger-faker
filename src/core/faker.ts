import { ISchema, IOpenAPI, IReference } from "../__types__/OpenAPI";
import { getPathsFromRef } from "../utils/commonUtils";
import { get, mapValues, isNumber } from "lodash";

interface Ctx {
  parents: string[];
  maxDepth: number;
  currentDepth?: number;
}

function resolveProperties(
  properties: {
    [k: string]: ISchema | IReference;
  },
  parentRefKeyPath: string,
  openApi: IOpenAPI,
  ctx: Ctx,
) {
  const parents = [...ctx.parents, parentRefKeyPath];

  return mapValues(properties, (val) => {
    if (getRef(val)) {
      const refKeyPath = getPathsFromRef(val.$ref).join(".");
      const refVal = get(openApi, refKeyPath);

      if (ctx.currentDepth === 0) {
        return null;
      }

      // if $ref is circular
      if (parents.includes(refKeyPath)) {
        return putBackRefs(refVal, refKeyPath, openApi, {
          ...ctx,
          parents,
          currentDepth: isNumber(ctx.currentDepth) ? ctx.currentDepth - 1 : ctx.maxDepth,
        });
      }

      return putBackRefs(refVal, refKeyPath, openApi, {
        ...ctx,
        parents,
      });
    }

    return val;
  });
}

export const putBackRefs = (
  schema: ISchema | IReference,
  schemaKeyPath: string,
  openApi: IOpenAPI,
  ctx: Ctx,
): ReturnType<any> => {
  if (getRef(schema)) {
    return null;
  }

  if (schema.properties) {
    return {
      ...schema,
      properties: resolveProperties(schema.properties, schemaKeyPath, openApi, ctx),
    };
  }

  return schema;
};

const getRef = (v: any): v is IReference => v.$ref;

export const resolveResponse = (respSchema: ISchema | IReference, openApi: IOpenAPI, maxDepth = 4) => {
  const refKeyPath = getPathsFromRef(respSchema.$ref).join(".");
  const refValue = get(openApi, refKeyPath);

  return putBackRefs(refValue, refKeyPath, openApi, { parents: [], maxDepth });
};
