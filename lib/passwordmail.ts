import { Resend } from "resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const sendPasswordResetEmail = async (
  email: string,
  token: string
) => {
  try {
    await resend.emails.send({
      from: "CourtMaps <onboarding@resend.dev>",
      to: email,
      subject: "Reset Your Password",
      html: `
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; }
                            .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Reset Your Password</h1>
                            <p>You have requested to reset your password. Please click the button below to set a new password:</p>
                            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/api/auth/password-verify?token=${token}" class="button">Reset Password</a></p>
                            <p>If you didn't request this email, you can safely ignore it.</p>
                        </div>
                    </body>
                </html>
            `,
      text: `
                Reset Your Password

                You have requested to reset your password. Use the link below to set a new password:

                ${token}

                If you didn't request this email, you can safely ignore it.
            `,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to send reset email:", error);
    return {
      error: true,
      message: "Failed to send password reset email",
    };
  }
};
