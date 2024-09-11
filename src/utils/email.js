import { createTransport } from 'nodemailer'
import config, { logger } from '../config/config.js'

const { gmailPassword, gmailUser} = config

const transport = createTransport({
    service: 'gmail',
    port: 578,
    auth: {
        user: gmailUser,
        pass: gmailPassword
    }
})

export const sendEmail = async ({from, to, subject, html }) => {
    // logger().http('Sending email to ' + to + ' ' + subject + ' ' + html)
    return await transport.sendMail({ from: `${from} <${gmailUser}>`, to, subject, html})
}