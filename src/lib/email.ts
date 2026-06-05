import { Resend } from 'resend';

// Use a placeholder if not set, but sending will fail if it's not a real key
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function sendVerificationEmail(email: string, token: string) {
  const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

  try {
    // Note: If using Resend without a verified domain, you can only send to the email address
    // associated with the Resend account (testing mode).
    const { data, error } = await resend.emails.send({
      from: 'Family Finance <onboarding@resend.dev>',
      to: email,
      subject: 'Verify your email address - Family Finance',
      html: `
        <h1>Welcome to Family Finance!</h1>
        <p>Please click the link below to verify your email address and activate your account:</p>
        <a href="${verifyLink}" style="display:inline-block;padding:10px 20px;background:#0071e3;color:white;text-decoration:none;border-radius:5px;">Verify Email</a>
        <br/><br/>
        <p>Or copy and paste this URL into your browser:</p>
        <p>${verifyLink}</p>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return false;
  }
}

export async function sendAlertEmail(email: string, subject: string, message: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Family Finance Alerts <onboarding@resend.dev>',
      to: email,
      subject: subject,
      html: `
        <h2>Family Finance Alert</h2>
        <p>${message}</p>
        <hr/>
        <small>You can change your alert preferences in your Dashboard Settings.</small>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send alert email:", error);
    return false;
  }
}
