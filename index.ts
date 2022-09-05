import College from "./models/College"
import mongoose from 'mongoose'
import answer from "./types/answer"
import error from "./types/error"
import Statistics from "./models/Statistics"
import FinalDoc from "./models/FinalDoc"
import Statistics_fields from "./interfaces/IStatistics"




const handleStat = (stat: Statistics_fields): Promise<answer | Error> => {
    return new Promise((res, rej) => {
        var doc = new FinalDoc()
        College.find({ country: stat.country }).lean().then(colleges => {
            doc._id = stat.country
            doc.count = colleges.length
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
            doc.allDiffs = allDiffs
            doc.latitude = latitudes
            doc.longitude = longitudes
            doc.save().then(result => {
                res({
                    success: true,
                    data: result
                })
            }, error => {
                rej(error)
            })

        })
    })
}


const manipulations = ():Promise<number | Error> => {
    return new Promise((res, rej) => {
        Statistics.find().lean().then(statistics => {
            var APstats:Array<Promise<answer|Error>> = []
            statistics.forEach(stat => {
                var Pstat:Promise<answer|Error> = handleStat(stat)
                APstats.push(Pstat)
            })
            Promise.all(APstats).then(result=>{
                res(result.length)
            },err=>{
                rej(err)
            })
        })

    })
}


// }




async function start() {
    mongoose.connect('mongodb://localhost:27017/test-task-unity-DB', async (err) => {
        console.log('connected')
        //await InsertCollege()
        //await InsertStatistics()
        var nDocs:number | Error = await manipulations()
        if(typeof nDocs ==='number'){
            console.log(`Docs created: ${nDocs}`)
        }else{
            throw nDocs
        }
        mongoose.disconnect()

    })
}
start()