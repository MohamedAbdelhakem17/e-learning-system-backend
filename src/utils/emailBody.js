const emailBody = (userName, token) => `
<div
    style="font-family: Arial, sans-serif;  line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <h2 style="text-align: center;">Password Reset Request</h2>
    <p>Dear <strong>${userName}</strong>,</p>
    <p>We received a request to reset your password for your account. If you did not request a password reset,
        please
        disregard this email.</p>
    <p>To reset your password, please use the following code:</p>
    <div style="text-align: center; margin: 20px 0;">
        <a style="
                    background-color: #4CAF50;
                    color: white;
                    padding: 14px 20px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    border-radius: 5px;
" href="http://localhost:${process.env.PORT}/auth/resetPassword/${token}">
            Reset Password
        </a>
    </div>
    <p style="color: #d9534f; font-weight: bold; text-align: center;">Please note that this link is valid for only
        5 minutes.</p>
    <p>If you have any questions or need further assistance, feel free to contact our support team.</p>
    <p style="margin-top: 40px;">Best regards</p>
</div>
`;
module.exports = emailBody;