import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendTemporaryPassword(
    email: string,
    username: string,
    tempPassword: string,
  ) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Contraseña temporal - Sistema',
      html: `  
        <h2>Bienvenido al sistema</h2>  
        <p>Su usuario: <strong>${username}</strong></p>  
        <p>Su contraseña temporal: <strong>${tempPassword}</strong></p>  
        <p>Por favor cambie su contraseña en el primer inicio de sesión.</p>  
      `,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return await this.transporter.sendMail(mailOptions);
  }
}
