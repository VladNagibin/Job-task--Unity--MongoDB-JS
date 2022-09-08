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
        doc.setFromStats(stat).then(data => {
            res({
                    success: true,
                    data
                })
            }, error => {
                rej(error)
            })
    })
}


const manipulations = (): Promise<number | Error> => {
    return new Promise((res, rej) => {
        Statistics.find().lean().then(statistics => {
            var APstats: Array<Promise<answer | Error>> = []
            statistics.forEach(stat => {
                var Pstat: Promise<answer | Error> = handleStat(stat)
                APstats.push(Pstat)
            })
            Promise.all(APstats).then(result => {
                res(result.length)
            }, err => {
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
        var nDocs: number | Error = await manipulations()
        if (typeof nDocs === 'number') {
            console.log(`Docs created: ${nDocs}`)
        } else {
            throw nDocs
        }
        mongoose.disconnect()

    })
}
start()