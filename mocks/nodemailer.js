const Queue = require('rethinkdb-job-queue')

// Setup e-mail data with unicode symbols
const mailOptions = {
  from: '"Registration" <support@superheros.com>', // Sender address
  subject: 'Registration', // Subject line
  text: 'Click here to complete your registration', // Plaintext body
  html: '<b>Click here to complete your registration</b>' // HTML body
}

// Queue options have defaults and are not required
const qOptions = {
  name: 'RegistrationEmail', // The queue and table name
  masterInterval: 310000, // Database review period in milliseconds
  changeFeed: true, // Enables events from the database table
  concurrency: 100,
  removeFinishedJobs: 2592000000, // true, false, or number of milliseconds
}

// Connection options have defaults and are not required
// You can replace these options with a rethinkdbdash driver object
const cxnOptions = {
  host: 'localhost',
  port: 28015,
  db: 'JobQueue', // The name of the database in RethinkDB
}

// This is the main queue instantiation call
const q = new Queue(cxnOptions, qOptions)

// Customizing the default job options for new jobs
q.jobOptions = {
  priority: 'normal',
  timeout: 300000,
  retryMax: 3, // Four attempts, first then three retries
  retryDelay: 600000 // Time in milliseconds to delay retries
}

const job = q.createJob()
// The createJob method will only create the job locally.
// It will need to be added to the queue.
// You can decorate the job with any data to be saved for processing
job.recipient = 'batman@batcave.com'


return q.addJob(job).then((savedJobs) => {
  // savedJobs is an array of the jobs added with updated properties
}).catch((err) => {
  console.error(err)
})


//
// // The following is not related to rethinkdb-job-queue.
// // This is the nodemailer configuration
// const nodemailer = require('nodemailer')
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
