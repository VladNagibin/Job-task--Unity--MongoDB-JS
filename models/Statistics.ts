import {model,Schema} from 'mongoose'
import Statistics_fields from '../interfaces/IStatistics'

const Statistics = new Schema({
    country:{
        type:String,
        required: true
    },
    overallStudents:{
        type:String,
        required:true
        
    }  
})
export default model<Statistics_fields>('Statistic',Statistics)

