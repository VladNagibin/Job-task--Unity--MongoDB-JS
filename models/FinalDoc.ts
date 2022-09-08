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
                College.aggregate([
                    {
                      '$match': {
                        'country': stat.country
                      }
                    }, {
                      '$addFields': {
                        'latitude': {
                          '$arrayElemAt': [
                            '$location.ll', 0
                          ]
                        }, 
                        'longitute': {
                          '$arrayElemAt': [
                            '$location.ll', 1
                          ]
                        }, 
                        'StudentsThisYear': {
                          '$arrayElemAt': [
                            {
                              '$filter': {
                                'input': '$students', 
                                'as': 'student', 
                                'cond': {
                                  '$eq': [
                                    '$$student.year', 2018
                                  ]
                                }
                              }
                            }, 0
                          ]
                        }
                      }
                    }, {
                      '$addFields': {
                        'numofStudents': '$StudentsThisYear.number', 
                        '_id': '$country'
                      }
                    }, {
                      '$project': {
                        'city': 0, 
                        'name': 0, 
                        'location': 0, 
                        'students': 0, 
                        'StudentsThisYear': 0, 
                        'seconds': 0
                      }
                    }, {
                      '$group': {
                        '_id': '$country', 
                        'AllDiffs': {
                          '$addToSet': {
                            '$add': [
                              '$numofStudents', -stat.overallStudents
                            ]
                          }
                        }, 
                        'count': {
                          '$sum': 1
                        }, 
                        'longitute': {
                          '$addToSet': '$longitute'
                        }, 
                        'latitude': {
                          '$addToSet': '$latitude'
                        }
                      }
                    }, {
                      '$merge': {
                        'into': 'finaldocs'
                      }
                    }
                  ]).then(result=>{
                    res('success')
                  },err=>{
                    rej(err)
                  })
            })
        }
    }
})


export default model<IFinalDoc>('FinalDocs', FinalDoc)