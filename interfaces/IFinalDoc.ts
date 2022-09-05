import {Document,ObjectId} from 'mongoose'

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
}