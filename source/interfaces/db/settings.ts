import * as fields from "./fields";
import * as defaults from "./defaults";

export interface General extends fields.CommonTypes {
    size?: number;
}

export interface Bool extends fields.CommonTypes {
    default?: defaults.Binary;
}

export interface Timestamp extends fields.CommonTypes {
    default?: defaults.Timestamp;
}