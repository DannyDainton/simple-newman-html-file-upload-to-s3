const newman = require('newman')
const AWS    = require('aws-sdk')
const fs     = require('fs')

const fileDate = new Date(Date.now()).toISOString()

const s3 = new AWS.S3({
    accessKeyId: "<Enter Access Key Id>", 
    secretAccessKey: "<Enter Secret Access Key>", 
    region: "<Enter Region>"
})

newman.run({
    collection: 'https://www.getpostman.com/collections/631643-f695cab7-6878-eb55-7943-ad88e1ccfd65-JsLv',
    reporters: ['htmlextra'],
    reporter: {
        htmlextra: {
            export: './reports/Postman_Echo_Test_Run.html'
        }
    }
}, (err) => {
    if (err) { throw err; }

    fs.readFile('./reports/Postman_Echo_Test_Run.html', (err, data) => {
        if (err) { throw err }
    
        var reportData = new Buffer.from(data);
    
        const params = {
            Bucket: '<Enter S3 Bucket Name>',
            Key: `${fileDate}_Postman_Echo_Report.html`,
            ContentType: 'text/html',
            Body: reportData,
            ACL:'public-read'
        }
        
        s3.putObject(params, (err) => {
            if (err) { throw err; }
            console.log("Report uploaded to S3")                                     
        })
    })
})
