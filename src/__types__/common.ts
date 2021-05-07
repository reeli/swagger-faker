import { ISchema } from "./OpenAPI";

export interface SchemaWithoutRef extends ISchema {
  not?: ISchema;
  allOf?: Array<ISchema>;
  oneOf?: Array<ISchema>;
  anyOf?: Array<ISchema>;
  items?: ISchema;
  properties?: {
    [k: string]: ISchema;
  };
  propertyNames?: ISchema;
  additionalProperties?: ISchema | boolean;
}
