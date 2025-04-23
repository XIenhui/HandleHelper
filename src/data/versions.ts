import { config as config0 } from "../components/ver0dot1/versionConfig"
import { config as config1 } from "../components/ver0dot2/versionConfig"
export interface Version {
    value: number,
    name: string,
    style: object,
    component: any,
}
export const versions: Array<Version> = [config0, config1]