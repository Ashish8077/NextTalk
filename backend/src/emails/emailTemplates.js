export function createVerificationEmailTemplate(name, verificationUrl) {
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin:0; padding:0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#f5f5f5;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; padding:40px 0;">
    <tr>
      <td align="center">
        <table width="400" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#4a90e2; padding:30px;">
              <h1 style="color:#ffffff; margin:0; font-size:24px;">VibeChat</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333; text-align:center;">
              <h2 style="margin-top:0; font-size:20px;">Verify Your Email</h2>
              <p style="font-size:16px; line-height:1.5;">
                Hello <strong>${name}</strong>,<br>
                Thank you for signing up for VibeChat! Click the button below to verify your email address and start chatting with your friends.
              </p>

              <!-- Verification Button -->
              <a href="${verificationUrl}" 
                 style="display:inline-block; margin:20px 0; padding:14px 28px; background-color:#4a90e2; color:#ffffff; text-decoration:none; font-weight:bold; border-radius:8px; font-size:16px;">
                Verify Email
              </a>
               <p style="font-size:12px; color:#999999;">
                This link will expire in 1 hour. If you did not sign up, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <td style="padding:20px; background-color:#4a90e2; text-align:center; font-size:12px; color:#ffffff;">
              © 2025 VibeChat. All rights reserved.
          </td>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

export function createWelcomeEmailTemplate(name) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to VibeChat</title>
</head>
<body style="margin:0; padding:0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color:#f5f5f5;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; padding:40px 0;">
    <tr>
      <td align="center">
        <table width="400" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
          
          <!-- Header with Logo -->
          <tr>
            <td align="center" style="background-color:#4a90e2; padding:30px;">
              <img src="https://yourcdn.com/logo.png" alt="VibeChat Logo" width="120" style="display:block; margin:0 auto;">
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333; text-align:center;">
              <h2 style="margin-top:0; font-size:22px; color:#4a90e2;">Welcome to VibeChat 🎉</h2>
              <p style="font-size:16px; line-height:1.5;">
                Hi <strong>${name}</strong>,<br>
                We're thrilled to have you join <b>VibeChat</b>! 🚀  
                Start chatting, connecting, and enjoying a new way to communicate.
              </p>

              <!-- Call to Action -->
              <a href="${process.env.FRONTEND_URL}" 
                 style="display:inline-block; margin:20px 0; padding:14px 28px; background-color:#4a90e2; color:#ffffff; text-decoration:none; font-weight:bold; border-radius:8px; font-size:16px;">
                Go to VibeChat
              </a>

              <p style="font-size:12px; color:#999999;">
                If you did not create this account, please ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <td style="padding:20px; background-color:#4a90e2; text-align:center; font-size:12px; color:#ffffff;">
              © 2025 VibeChat. All rights reserved.
          </td>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
