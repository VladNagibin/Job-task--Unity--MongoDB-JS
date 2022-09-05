import { model, Schema, ObjectId } from 'mongoose'
import IFinalDoc from '../interfaces/IFinalDoc'

export default model<IFinalDoc>('FinalDocs', new Schema({
    _id: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    longitude: {
        type: Array
    },
    latitude: {
        type: Array
    },
    allDiffs: {
        type: Array
    }

}))