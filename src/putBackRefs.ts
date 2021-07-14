import { ISchema, IOpenAPI, IReference } from "OpenAPI";
import { get, mapValues, isArray, isNumber, map, takeRight } from "lodash";
import { getRef } from "./utils";

interface Ctx {
  parents: string[];
  maxDepth?: number;
  currentDepth?: number;
}

interface PutBackRefParams {
  schema: ISchema | IReference;
  openApi: IOpenAPI;
  ctx: Ctx;
}

const getPathsFromRef = (str?: string): string[] => {
  if (!str) {
    return [];
  }

  const paths = str.replace(/^#\//, "").split("/");
  return takeRight(paths, 3);
};

export const putBackRefs = ({ schema, openApi, ctx }: PutBackRefParams): ReturnType<any> => {
  if (!schema) {
    return;
  }

  if (getRef(schema)) {
    const refKeyPath = getPathsFromRef(schema.$ref).join(".");

    if (ctx.currentDepth === 0) {
      return null;
    }

    if (ctx.parents.includes(refKeyPath)) {
      return putBackRefs({
        schema: get(openApi, refKeyPath),
        openApi,
        ctx: {
          ...ctx,
          currentDepth: isNumber(ctx.currentDepth) ? ctx.currentDepth - 1 : ctx.maxDepth,
        },
      });
    }

    return putBackRefs({
      schema: get(openApi, refKeyPath),
      openApi,
      ctx: {
        ...ctx,
        parents: [...ctx.parents, refKeyPath],
      },
    });
  }

  // handle object
  if (schema?.type === "object" || schema.properties || schema.additionalProperties) {
    const getProps = (properties: IOpenAPI["properties"]) => {
      return mapValues(properties, (item) => putBackRefs({ schema: item, openApi, ctx }));
    };

    return {
      ...schema,
      properties: {
        ...(schema.properties ? getProps(schema.properties) : {}),
        ...(schema.additionalProperties ? getProps({ additionalProp: schema.additionalProperties }) : {}),
      },
    };
  }

  // handle array
  if (schema.items) {
    if (isArray(schema.items)) {
      return {
        ...schema,
        items: map(schema.items, (item) => putBackRefs({ schema: item, openApi, ctx })),
      };
    }
    return {
      ...schema,
      items: putBackRefs({ schema: schema.items, openApi, ctx }),
    };
  }

  // handle oneOf
  if ((schema as any).oneOf) {
    return map((schema as any).oneOf, (item) => putBackRefs({ schema: item, openApi, ctx }));
  }

  // handle allOf
  if (schema.allOf) {
    const allOfList = map((schema as any).allOf, (item) => putBackRefs({ schema: item, openApi, ctx }));
    const hasString = allOfList.some((item) => item.type === "string");

    if (hasString) {
      return allOfList.reduce((res, item) => {
        return {
          ...res,
          ...item,
        };
      }, {});
    }

    return allOfList.reduce((res, item) => {
      if (item.type !== "object" && !item.properties) {
        return res;
      }

      return {
        ...res,
        ...item,
        required: (res.required || []).concat(item.required),
        properties: {
          ...res.properties,
          ...item.properties,
        },
      };
    }, {});
  }

  return schema;
};
