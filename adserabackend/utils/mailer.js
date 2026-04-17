const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const emailWrapper = (title, subtitle, bodyHTML) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <style>
    @media (max-width:600px){
      .container{width:100%!important}
      .content{padding:20px!important}
    }
  </style>
</head>

<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:30px 10px;">
        <table class="container" width="600" cellpadding="0" cellspacing="0" style="
          background:#ffffff;
          border-radius:14px;
          overflow:hidden;
          box-shadow:0 10px 40px rgba(0,0,0,0.1);
        ">

          <!-- HEADER -->
          <tr>
            <td style="
              background:linear-gradient(135deg,#22d3ee,#0ea5e9);
              padding:30px;
              text-align:center;
            ">
              <h1 style="margin:0;color:#ffffff;font-size:26px;">${title}</h1>
              <p style="margin-top:8px;color:#e0f2fe;font-size:14px;">
                ${subtitle}
              </p>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td class="content" style="padding:30px;color:#334155;">
              ${bodyHTML}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="
              text-align:center;
              padding:18px;
              font-size:12px;
              color:#94a3b8;
              border-top:1px solid #e5e7eb;
            ">
              If you did not sign up for this account, you can safely ignore this email.<br/><br/>
              © 2025 MaxifyAcademy. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/* ============================================================
   1️⃣ ACCOUNT VERIFICATION OTP
   ============================================================ */
exports.sendAccountVerificationOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"Maxify Academy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Maxify Academy Account",
      html: emailWrapper(
        "Verify Your Account",
        "Complete your signup to get instant access 🚀",
        `
        <p>Hi there,</p>
        <p>Use the OTP below to verify your account:</p>

        <div style="
          margin:24px 0;
          padding:16px;
          background:#f8fafc;
          border-radius:10px;
          border:1px dashed #22d3ee;
          text-align:center;
        ">
          <h2 style="
            margin:0;
            font-size:28px;
            letter-spacing:6px;
            color:#0284c7;
          ">${otp}</h2>
        </div>

        <p style="font-size:13px;color:#64748b;">
          ⏱ OTP valid for 5 minutes
        </p>
        `
      ),
    });
    return true;
  } catch (err) {
    console.log("Verification OTP Error:", err);
    return false;
  }
};

exports.sendWithdrawalOTP = async (email, otp, amount) => {
  try {
    await transporter.sendMail({
      from: `"Maxify Academy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Withdrawal OTP Verification",
      html: emailWrapper(
        "Withdrawal Verification",
        "Confirm your withdrawal request 💸",
        `
        <p>Hi there,</p>
        <p>You requested a withdrawal of <b>₹${amount}</b>.</p>
        <p>Please use the OTP below to confirm your request:</p>

        <div style="
          margin:24px 0;
          padding:16px;
          background:#f8fafc;
          border-radius:10px;
          border:1px dashed #22d3ee;
          text-align:center;
        ">
          <h2 style="
            margin:0;
            font-size:28px;
            letter-spacing:6px;
            color:#0284c7;
          ">${otp}</h2>
        </div>

        <p style="font-size:13px;color:#64748b;">
          ⏱ OTP valid for 5 minutes
        </p>

        <p style="font-size:13px;color:#ef4444;">
          ⚠️ If you did not request this withdrawal, please ignore this email or contact support immediately.
        </p>
        `
      ),
    });

    return true;

  } catch (err) {
    console.log("Withdrawal OTP Error:", err);
    return false;
  }
};