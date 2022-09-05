import {Document} from 'mongoose'
// interface location 
// interface student 
// interface second 

interface collegeFields {
    country: string
    city: string
    name: string
    location: {
        ll: Array<number>
    }
    students: Array<{
        year: number
        number: number
    }>
    seconds?: Array<{
        difference:number
    }>

}

export default collegeFields