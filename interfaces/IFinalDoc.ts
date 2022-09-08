import {Document,ObjectId} from 'mongoose'
import Statistics_fields from './IStatistics'

export default interface IFinalDoc{
    _id:string
    allDiffs?:Array<{
        collegeId:string
        difference:number
    }>
    count:number
    longitude?:Array<{
        collegeId:string
        longitude:number
    }>
    latitude?:Array<{
        collegeId:string
        latitude:number
    }>
    setFromStats(stat:Statistics_fields):Promise<string|Error>
}