import * as fields from "./fields";
import * as defaults from "./defaults";

export interface General extends fields.CommonTypes {
    size?: number;
    alias?: string;
}

export interface Timestamp extends General {
    default?: defaults.Timestamp;
}