import { TransactionalEmailsApi, SendSmtpEmail, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";

// Instanciar API de correos transaccionales
const apiInstance = new TransactionalEmailsApi();

// Establecer la clave de API
apiInstance.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string
);

const smtpEmail = new SendSmtpEmail();

export async function SendEmail(email: string, name: string) {
  smtpEmail.subject = "Confirmacion de la Cuenta";
  smtpEmail.to = [{ email: email, name: name }];
  smtpEmail.htmlContent = `
   <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
                body { font-family: 'Roboto', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333; }
                .container { width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 20px; }
                h1 { text-align: center; color: #007bff; font-size: 28px; font-weight: 700; margin-bottom: 20px; }
                p { line-height: 1.6; color: #555; font-size: 16px; }
                .button { display: inline-block; padding: 12px 24px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; text-align: center; }
                .cta { text-align: center; margin-top: 20px; }
                .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #888; }
                .icon { display: inline-block; margin-bottom: 8px; }
                img { max-width: 100%; border-radius: 8px; margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>¡Bienvenido a CourtMaps!</h1>
                <p>Hola ${name},</p>
                <p>Nos complace informarte que tu cuenta ha sido confirmada con éxito. ¡Ya puedes acceder a CourtMaps y comenzar a reservar canchas o postular tus propios servicios como administrador!</p>
                
                <img src="https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80" />
                
                <div class="cta">
                    <p>Haz clic en el botón de abajo para iniciar tu aventura:</p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/sign-in" class="button">Inicia Tu Aventura</a>
                </div>

                <p>Si no solicitaste este correo, simplemente ignóralo.</p>

                <div class="footer">
                    <p>© 2024 CourtMaps. Todos los derechos reservados.</p>
                    <p>Síguenos en nuestras redes sociales:</p>
                    <p><a href="https://facebook.com/courtmapsoficial">Facebook</a> | <a href="https://instagram.com/courtmapsoficial">Instagram</a></p>
                </div>
            </div>
        </body>
    </html>
  `;
  smtpEmail.sender = { name: "CourtMaps", email: "nspes2020@gmail.com" };

  try {
    // Enviar el correo transaccional
    await apiInstance.sendTransacEmail(smtpEmail);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export async function sendPasswordResetEmail(email: string, token: string,) {
    smtpEmail.subject = "Recuperar Contraseña";
    smtpEmail.to = [{ email: email}];
    smtpEmail.htmlContent = `
     <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 20px; }
            h1 { text-align: center; color: #007bff; font-size: 28px; font-weight: bold; margin-bottom: 20px; }
            p { color: #555; font-size: 16px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; text-align: center; }
            .cta { text-align: center; margin-top: 20px; }
            .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #888; }
            img { max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <img src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Cancha de fútbol" />

            <h1>Restablece tu contraseña</h1>
            <p>Ha solicitado restablecer su contraseña. Haga clic en el botón de abajo para establecer una nueva contraseña:</p>
            <div class="cta">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/api/auth/password-verify?token=${token}" class="button">Reset Password</a>
            </div>
            <p>Si no solicitaste este correo electrónico, puedes ignorarlo sin problemas.</p>
        </div>
        <div class="footer">
            <p>© Mapas de la Corte 2024. Todos los derechos reservados.</p>
            <img src="https://th.bing.com/th/id/OIP.ueQO0zOGzCcAOGGlq73Y0QHaEK?rs=1&pid=ImgDetMain" alt="Canchas deportivas" />
        </div>
    </body>
</html>
    `;
    smtpEmail.sender = { name: "CourtMaps", email: "nspes2020@gmail.com" };
  
    try {
      // Enviar el correo transaccional
      await apiInstance.sendTransacEmail(smtpEmail);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
  

  export async function DeleteEmail(email: string, name: string) {
    smtpEmail.subject = "Registro Fallido - Cuenta No Cumple con los Requisitos";
    smtpEmail.to = [{ email: email, name: name }];
    smtpEmail.htmlContent = `
     <html>
          <head>
              <style>
                  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
                  body { font-family: 'Roboto', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333; }
                  .container { width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 20px; }
                  h1 { text-align: center; color: #dc3545; font-size: 28px; font-weight: 700; margin-bottom: 20px; }
                  p { line-height: 1.6; color: #555; font-size: 16px; }
                  .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; text-align: center; }
                  .cta { text-align: center; margin-top: 20px; }
                  .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #888; }
                  .icon { display: inline-block; margin-bottom: 8px; }
                  img { max-width: 100%; border-radius: 8px; margin-bottom: 20px; }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1>Registro No Válido</h1>
                  <p>Hola ${name},</p>
                  <p>Te informamos que tu registro no cumple con los requisitos necesarios para crear una cuenta en CourtMaps. Por favor, revisa los datos ingresados y vuelve a registrarte.</p>
                  
                  <img src="https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80" />
                  
                  <div class="cta">
                      <p>Haz clic en el botón de abajo para registrarte nuevamente:</p>
                      <a href="${process.env.NEXT_PUBLIC_APP_URL}/sign-up" class="button">Regístrate Nuevamente</a>
                  </div>
  
                  <p>Si no solicitaste este correo, simplemente ignóralo.</p>
  
                  <div class="footer">
                      <p>© 2024 CourtMaps. Todos los derechos reservados.</p>
                      <p>Síguenos en nuestras redes sociales:</p>
                      <p><a href="https://facebook.com/courtmapsoficial">Facebook</a> | <a href="https://instagram.com/courtmapsoficial">Instagram</a></p>
                  </div>
              </div>
          </body>
      </html>
    `;
    smtpEmail.sender = { name: "CourtMaps", email: "nspes2020@gmail.com" };
  
    try {
      // Enviar el correo transaccional
      await apiInstance.sendTransacEmail(smtpEmail);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }