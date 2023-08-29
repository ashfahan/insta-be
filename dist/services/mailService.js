"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRecoveryKeyToUser = void 0;
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.MAIL_KEY);
const senderEmailAddress = process.env.SENDER_EMAIL_ADDRESS;
const systemName = process.env.SYSTEM_NAME;
const sendRecoveryKeyToUser = async (user, recoveryKey) => {
    const message = {
        from: senderEmailAddress,
        to: user.email,
        subject: `${systemName} Account Recovery Key`,
        text: "This is your recovery key. Please do not share it with anyone.",
        html: `<div>
        <h3>Dear ${user.email},</h3>
        <p>Here is your recovery key: <strong>${recoveryKey}</strong></p>
        <p>Please use this key to recover your account. Keep it secure and do not share with anyone.</p>
        <p>If you did not request for a recovery key, please ignore this email or contact our support team.</p>
        <p>Best regards,</p>
        <p>${systemName}</p>
    </div>`,
    };
    return sgMail
        .send(message)
        .then((resp) => {
        console.log({ message, resp });
        return resp;
    })
        .catch((err) => {
        console.log({ err: err });
        throw err;
    });
};
exports.sendRecoveryKeyToUser = sendRecoveryKeyToUser;
//# sourceMappingURL=mailService.js.map