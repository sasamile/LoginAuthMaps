import { Resend } from "resend";

// Definir la variable resend fuera de los condicionales
export const sendEmailVerification = async (email: string, token: string) => {
  let resend;
  
  try {
    // Asignar la clave correcta en función del email
    if (email === "nspes2020@gmail.com") {
      resend = new Resend(process.env.AUTH_RESEND_KEY);
    } else if (email === "dcstiven12@gmail.com") {
      resend = new Resend(process.env.AUTH_RESEND_KEY1);
    }

    // Asegurarse de que resend esté definido
    if (!resend) {
      throw new Error("Resend instance is not defined");
    }

    // Enviar el correo electrónico
    await resend.emails.send({
      from: "CourtMaps <onboarding@resend.dev>",
      to: email,
      subject: "Verify Your Email",
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
              <h1>Verify Your Email</h1>
              <p>Thank you for registering. Please click the button below to verify your email address:</p>
              <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}" class="button">Verify Email</a></p>
              <p>If you didn't request this email, you can safely ignore it.</p>
            </div>
          </body>
        </html>
      `,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
    };
  }
};
