import { model, Schema, ObjectId } from 'mongoose'
import IFinalDoc from '../interfaces/IFinalDoc'
import Statistics_fields from '../interfaces/IStatistics'
import College from './College'

const FinalDoc = new Schema({
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

},{
    methods:{
        setFromStats(stat: Statistics_fields):Promise<string|Error> {
            return new Promise((res,rej)=>{
                College.find({ country: stat.country }).lean().then(colleges => {
                    this._id = stat.country
                    this.count = colleges.length
                    var allDiffs: Array<{
                        collegeId: string
                        difference: number
                    }> = []
                    var longitudes: Array<{
                        collegeId: string
                        longitude: number
                    }> = []
                    var latitudes: Array<{
                        collegeId: string
                        latitude: number
                    }> = []
                    colleges.forEach(college => {
                        /// data have only 2018 year so we imagine that we are in 2018
                        var currStudents: number | undefined = college.students.find(el => el.year === 2018)?.number
                        var collegeId: string = college._id.toString()
                        allDiffs.push({
                            collegeId,
                            difference: currStudents ? stat.overallStudents - currStudents : stat.overallStudents
                        })
                        longitudes.push({
                            collegeId,
                            longitude: college.location.ll[0]
                        })
                        latitudes.push({
                            collegeId,
                            latitude: college.location.ll[1]
                        })
                    })
                    this.allDiffs = allDiffs
                    this.latitude = latitudes
                    this.longitude = longitudes
                    this.save().then(()=>{
                        res('success')
                    })
                    
                },err=>{
                    rej(err)
                })
            })
        }
    }
})


export default model<IFinalDoc>('FinalDocs', FinalDoc)