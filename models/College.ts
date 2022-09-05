import {Schema,model, Document} from 'mongoose'
import ICollege from '../interfaces/ICollege'


const CollegeSchema:Schema = new Schema({
    country:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    location:{
        type:Object({
            ll:Array<Number>
        }),
        required:true
    },
    students:{
        type:Array,
        required:true
    },
    seconds:{
        type:Array
    }
}) 


export default model<ICollege>('College',CollegeSchema)