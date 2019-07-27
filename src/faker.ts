import { ParameterType, Schema } from "swagger-schema-official";
import { mapValues } from "lodash";
import { booleanGenerator, fileGenerator, numberGenerator, stringGenerator } from "./generators";

type TParameterType = ParameterType & "file";

export const getFaker = (schema: Schema = {}) => {
  if (schema.type === "object") {
    return mapValues(schema.properties, (property) => {
      // TODO: handle number maximal and minimal
      if (property && property.type) {
        return generateFakeDataByType(property.type as TParameterType);
      }
      return {};
    });
  }
};

// TODO: File is not a standard type in swagger v2
export const generateFakeDataByType = (type: TParameterType) => {
  switch (type) {
    case "boolean":
      return booleanGenerator();
    case "string":
      return stringGenerator();
    case "number":
    case "integer":
      return numberGenerator();
    case "file":
      return fileGenerator();
    default:
      return "";
  }
};
