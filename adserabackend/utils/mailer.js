const nodemailer = require("nodemailer");

/* ============================================================
   TRANSPORTER
============================================================ */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ============================================================
   EMAIL TEMPLATE
============================================================ */
const emailWrapper = ({
  title,
  subtitle,
  otp,
  icon = "🔒",
  accent = "#5b42ff",
  warningText = "",
}) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

  <title>${title}</title>

  <style>
    body{
      margin:0;
      padding:8px;
      background:#f5f5f7;
      font-family:Arial,Helvetica,sans-serif;
    }

    table{
      border-spacing:0;
    }

    .container{
      width:100%;
      max-width:500px;
      margin:auto;
      background:#ffffff;
      border-radius:16px;
      overflow:hidden;
      box-shadow:0 3px 12px rgba(0,0,0,0.08);
    }

    .header{
      background:#120043;
      padding:14px;
      text-align:center;
    }

    .content{
      padding:18px 16px;
      text-align:center;
    }

    .icon-wrap{
      width:52px;
      height:52px;
      background:#f3efff;
      border-radius:50%;
      margin:auto;
      line-height:52px;
      font-size:24px;
    }

    .title{
      margin:14px 0 6px;
      color:#120043;
      font-size:24px;
      font-weight:800;
      line-height:30px;
    }

    .subtitle{
      color:#666680;
      font-size:14px;
      line-height:22px;
      margin:0 auto;
      max-width:340px;
    }

    .otp-box{
      margin:18px 0 12px;
      padding:14px 10px;
      border:1px solid #ece8ff;
      border-radius:12px;
      background:#fbfaff;
    }

    .otp-label{
      margin:0;
      color:#666680;
      font-size:14px;
      font-weight:600;
    }

    .otp{
      margin:8px 0 0;
      color:${accent};
      font-size:32px;
      letter-spacing:5px;
      font-weight:800;
    }

    .valid{
      color:#666680;
      font-size:13px;
      margin-bottom:14px;
    }

    .divider{
      width:100%;
      height:1px;
      background:#ececf3;
      margin:14px 0;
    }

    .info-icon{
      width:40px;
      height:40px;
      border:1px solid #ececf3;
      border-radius:50%;
      margin:auto;
      line-height:40px;
      font-size:16px;
    }

    .info-title{
      margin:8px 0 5px;
      color:#120043;
      font-size:16px;
      font-weight:700;
    }

    .info-text{
      margin:0;
      color:#666680;
      font-size:12px;
      line-height:20px;
    }

    .warning{
      margin-top:6px;
      color:#ef4444;
      font-size:11px;
      line-height:18px;
    }

    .footer-box{
      margin-top:14px;
      background:#f7f5ff;
      border-radius:10px;
      padding:12px;
      text-align:center;
    }

    .footer-title{
      margin:0 0 4px;
      color:#444466;
      font-size:14px;
    }

    .footer-copy{
      margin:0;
      color:#666680;
      font-size:11px;
    }

    .bottom{
      margin-top:12px;
      text-align:center;
    }

    .bottom span{
      display:inline-block;
      margin:2px 5px;
      color:#555577;
      font-size:11px;
    }

    @media screen and (max-width:600px){

      .otp{
        font-size:26px !important;
        letter-spacing:3px !important;
      }

      .title{
        font-size:22px !important;
      }
    }
  </style>
</head>

<body>

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">

        <table class="container" cellpadding="0" cellspacing="0">

          <!-- HEADER -->
          <tr>
            <td class="header">

              <img
                src="https://i.ibb.co/gbrn443W/Adstorx-logo.png"
                alt="Adstorx"
                width="120"
                style="margin:auto;display:block;"
              />

            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td class="content">

              <div class="icon-wrap">
                ${icon}
              </div>

              <h1 class="title">
                ${title}
              </h1>

              <p class="subtitle">
                ${subtitle}
              </p>

              <!-- OTP -->
              <div class="otp-box">

                <p class="otp-label">
                  Your OTP
                </p>

                <h2 class="otp">
                  ${otp}
                </h2>

              </div>

              <p class="valid">
                ⏰ OTP valid for
                <span style="
                  color:${accent};
                  font-weight:700;
                ">
                  5 minutes
                </span>
              </p>

              <div class="divider"></div>

              <!-- INFO -->
              <div class="info-icon">
                ✅
              </div>

              <h3 class="info-title">
                Didn't request this?
              </h3>

              <p class="info-text">
                If you did not perform this action, safely ignore this email.
              </p>

              ${
                warningText
                  ? `
                <p class="warning">
                  ${warningText}
                </p>
              `
                  : ""
              }

              <!-- FOOTER -->
              <div class="footer-box">

                <p class="footer-title">
                  Thank you for choosing
                  <span style="
                    color:${accent};
                    font-weight:700;
                  ">
                    Adstorx
                  </span>
                </p>

                <p class="footer-copy">
                  © 2025 Adstorx. All rights reserved.
                </p>

              </div>

              <!-- BOTTOM -->
              <div class="bottom">
                <span>🛡️ Secure</span>
                <span>⚡ Fast</span>
                <span>🎧 Support</span>
              </div>

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
   ACCOUNT VERIFICATION OTP
============================================================ */
exports.sendAccountVerificationOTP = async (email, otp) => {
  try {

    await transporter.sendMail({
      from: `"Adstorx" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Account",

      html: emailWrapper({
        title: "Verify Your Account",
        subtitle:
          "Use the OTP below to verify your account and complete signup.",
        otp,
        icon: "🔒",
        accent: "#5b42ff",
      }),
    });

    return true;

  } catch (err) {

    console.log("Verification OTP Error:", err);
    return false;

  }
};

/* ============================================================
   WITHDRAWAL OTP
============================================================ */
exports.sendWithdrawalOTP = async (email, otp, amount) => {
  try {

    await transporter.sendMail({
      from: `"Adstorx" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Withdrawal OTP Verification",

      html: emailWrapper({
        title: "Withdrawal Verification",
        subtitle:
          "Confirm your withdrawal request of ₹" + amount,
        otp,
        icon: "💸",
        accent: "#2563eb",
        warningText:
          "⚠️ If you did not request this withdrawal contact support.",
      }),
    });

    return true;

  } catch (err) {

    console.log("Withdrawal OTP Error:", err);
    return false;

  }
};

/* ============================================================
   RESET PASSWORD OTP
============================================================ */
exports.sendResetPasswordOTP = async (email, otp) => {
  try {

    await transporter.sendMail({
      from: `"Adstorx" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Password",

      html: emailWrapper({
        title: "Reset Password",
        subtitle:
          "Use the OTP below to reset your password securely.",
        otp,
        icon: "🔑",
        accent: "#7c3aed",
        warningText:
          "⚠️ If you did not request a password reset ignore this email.",
      }),
    });

    return true;

  } catch (err) {

    console.log("Reset Password OTP Error:", err);
    return false;

  }
};