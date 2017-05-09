const Queue = require('rethinkdb-job-queue')

const qOptions = {
  name: 'RegistrationEmail',
  masterInterval: 310000,
  changeFeed: true,
  concurrency: 100,
  removeFinishedJobs: 2592000000
}

const cxnOptions = {
  host: 'localhost',
  port: 28015,
  db: 'JobQueue'
}

const q = new Queue(cxnOptions, qOptions)

q.jobOptions = {
  priority: 'normal',
  timeout: 300000,
  retryMax: 3,
  retryDelay: 600000
}

const job = q.createJob()
job.recipient = 'batman@batcave.com'

q.addJob(job).then(() => {
  process.exit()
}).catch((err) => {
  console.error(err)
  process.exit()
})

// const nodemailer = require('nodemailer')
// const mailOptions = {
//   from: '"Registration" <support@superheros.com>', // Sender address
//   subject: 'Registration', // Subject line
//   text: 'Click here to complete your registration', // Plaintext body
//   html: '<b>Click here to complete your registration</b>' // HTML body
// }
// const transporter = nodemailer.createTransport({
//   service: 'Mailgun',
//   auth: {
//     user: 'postmaster@superheros.com',
//     pass: 'your-api-key-here'
//   }
// })
//
// q.process((job, next) => {
//   // Send email using job.recipient as the destination address
//   mailOptions.to = job.recipient
//   return transporter.sendMail(mailOptions).then((info) => {
//     console.dir(info)
//     return next(null, info)
//   }).catch((err) => {
//     // This catch is for nodemailer sendMail errors.
//     return next(err)
//   })
// })
