export function createVerificationEmailTemplate(name, verificationUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background:#f5f5f5 ; min-height: 100vh;">
    
    <!-- Email Container -->
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; margin-top: 40px; margin-bottom: 40px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg, #667eea, #764ba2);  padding: 40px 30px; text-align: center; position: relative;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">VibeChat</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">Connect. Chat. Vibe.</p>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="background: linear-gradient(135deg, #667eea10, #764ba210); border-radius: 50px; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 40px;">📧</span>
                </div>
                <h2 style="color: #2d3748; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">Verify Your Email Address</h2>
                <p style="color: #718096; font-size: 16px; line-height: 1.6; margin: 0;">To complete your VibeChat registration and start connecting with amazing people, please verify your email address.</p>
            </div>

            <!-- Verification Info -->
            <div style="background: linear-gradient(135deg, #667eea10, #764ba210); border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #667eea; text-align: center;">
                <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">🔐 Security First</h3>
                <p style="color: #718096; margin: 0; font-size: 14px; line-height: 1.6;">This verification step helps us ensure your account is secure and that you have access to this email address. Click the button below to verify and activate your account.</p>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 35px 0;">
                <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; padding: 15px 35px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 0.5px;">Verify Email Address</a>
            </div>

            <!-- Alternative Method -->
            <div style="background: #f7fafc; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center;">
                <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">Can't click the button?</h3>
                <p style="color: #718096; margin: 0 0 15px 0; font-size: 14px; line-height: 1.6;">Copy and paste this link into your browser:</p>
                <div style="background: #e2e8f0; border-radius: 8px; padding: 15px; font-family: monospace; font-size: 12px; color: #4a5568; word-break: break-all; border: 1px dashed #cbd5e0;">
                   ${verificationUrl}
                </div>
            </div>

            <!-- Security Notice -->
            <div style="background: linear-gradient(135deg, #ff6b6b10, #feca5710); border-radius: 12px; padding: 20px; margin-top: 30px; border-left: 4px solid #ff6b6b;">
                <h3 style="color: #2d3748; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">⚡ Quick Notice</h3>
                <p style="color: #718096; margin: 0; font-size: 14px; line-height: 1.5;">This verification link will expire in 24 hours for security reasons. If you didn't create a VibeChat account, you can safely ignore this email.</p>
            </div>

            <!-- What's Next -->
            <div style="margin: 30px 0;">
                <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; text-align: center;">🚀 What's Next?</h3>
                <div style="background: linear-gradient(135deg, #48dbfb10, #ff9ff310); border-radius: 12px; padding: 20px; border-left: 4px solid #48dbfb;">
                    <ul style="color: #718096; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                        <li style="margin-bottom: 8px;">Complete your profile setup</li>
                        <li style="margin-bottom: 8px;">Discover and join interesting channels</li>
                        <li style="margin-bottom: 8px;">Start chatting with the community</li>
                        <li>Customize your experience with themes</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #f7fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #a0aec0; margin: 0 0 10px 0; font-size: 13px;">Need help? Contact us at <a href="mailto:support@vibechat.com" style="color: #667eea; text-decoration: none;">support@vibechat.com</a></p>
            <p style="color: #cbd5e0; margin: 0; font-size: 12px;">© 2024 VibeChat. Made with for awesome people like you.</p>
        </div>
    </div>

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

 <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background:#f5f5f5 ; min-height: 100vh;">
    
    <!-- Email Container -->
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; margin-top: 40px; margin-bottom: 40px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg, #667eea, #764ba2);  padding: 40px 30px; text-align: center; position: relative;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">VibeChat</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">Connect. Chat. Vibe.</p>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #2d3748; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">Welcome to the Community! 🎉</h2>
                <p style="color: #718096; font-size: 16px; line-height: 1.6; margin: 0;">We're thrilled to have you join VibeChat. Get ready to connect with amazing people and share your vibe with the world.</p>
            </div>

            <!-- Feature Cards -->
            <div style="margin: 30px 0;">
                <div style="background: linear-gradient(135deg, #667eea10, #764ba210); border-radius: 12px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #667eea;">
                    <h3 style="color: #2d3748; margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">💬 Instant Messaging</h3>
                    <p style="color: #718096; margin: 0; font-size: 14px; line-height: 1.5;">Send messages, share media, and connect with friends in real-time.</p>
                </div>
                
                <div style="background: linear-gradient(135deg, #ff6b6b10, #feca5710); border-radius: 12px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #ff6b6b;">
                    <h3 style="color: #2d3748; margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">🎨 Custom Themes</h3>
                    <p style="color: #718096; margin: 0; font-size: 14px; line-height: 1.5;">Personalize your chat experience with beautiful themes and colors.</p>
                </div>
                
                <div style="background: linear-gradient(135deg, #48dbfb10, #ff9ff310); border-radius: 12px; padding: 20px; border-left: 4px solid #48dbfb;">
                    <h3 style="color: #2d3748; margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">🚀 Lightning Fast</h3>
                    <p style="color: #718096; margin: 0; font-size: 14px; line-height: 1.5;">Experience blazing fast performance with our optimized chat engine.</p>
                </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 35px 0;">
                <a href="#" style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; padding: 15px 35px; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 0.5px;">Start Chatting Now</a>
            </div>

            <!-- Tips Section -->
            <div style="background: #f7fafc; border-radius: 12px; padding: 25px; margin-top: 30px;">
                <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; text-align: center;">🎯 Quick Tips</h3>
                <ul style="color: #718096; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                    <li style="margin-bottom: 8px;">Complete your profile to help others connect with you</li>
                    <li style="margin-bottom: 8px;">Join public channels to discover new communities</li>
                    <li style="margin-bottom: 8px;">Use @mentions to get someone's attention in group chats</li>
                    <li>Enable notifications to never miss important messages</li>
                </ul>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #f7fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #a0aec0; margin: 0 0 10px 0; font-size: 13px;">Need help? Contact us at <a href="mailto:support@vibechat.com" style="color: #667eea; text-decoration: none;">support@vibechat.com</a></p>
            <p style="color: #cbd5e0; margin: 0; font-size: 12px;">© 2024 VibeChat. Made with for awesome people like you.</p>
        </div>
    </div>

</body>
</html>`;
}
