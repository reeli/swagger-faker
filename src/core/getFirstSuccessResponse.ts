import {getRef} from "./putBackRefs";
import {IReference, IResponse, IComponents} from "../__types__/OpenAPI";
import { Dictionary,first, values,keys} from "lodash";

const getFirstValue = (data?: Dictionary<any>) => first(values(data));
const getFirstKey = (data?: Dictionary<any>) => first(keys(data));

export const getFirstSuccessResponse = (responses: IComponents["responses"])=>{
    if (!responses) {
        return;
    }

    let firstSuccessResp:  IReference | IResponse | undefined = undefined;

    keys(responses).forEach((code) => {
        const httpCode = Number(code);
        const resp = responses[code];
        const hasContent = getRef(resp) || getFirstValue(resp?.content)?.schema;

        if (httpCode >= 200 && httpCode < 300 && hasContent && !firstSuccessResp) {
            firstSuccessResp = resp;
        }
    });

    return {
        contentType: getFirstKey((firstSuccessResp as any)?.content) || "application/json",
        data: (firstSuccessResp as any)?.$ref || getFirstValue((firstSuccessResp as any)?.content)?.schema,
        description:(firstSuccessResp as any)?.description
    };
}
