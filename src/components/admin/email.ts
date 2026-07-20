import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;
const ADMIN_EMAIL = import.meta.env.PUBLIC_ADMIN_EMAIL || 'azulia.bacalar@gmail.com';
const SITE_URL = import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321';

const LOGO_HTML = `<img src="${SITE_URL}/src/assets/Designer.png" alt="Azulia" style="height:60px;width:auto;display:block;margin:0 auto 16px" />`;

const isConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

export function isEmailConfigured(): boolean {
  return isConfigured;
}

export async function sendConfirmationEmail(
  name: string,
  email: string,
  confirmLink: string
): Promise<{ success: boolean; error?: string }> {
  if (!isConfigured) {
    console.warn(
      '[EmailJS] No configurado. Establece PUBLIC_EMAILJS_SERVICE_ID, ' +
      'PUBLIC_EMAILJS_TEMPLATE_ID y PUBLIC_EMAILJS_PUBLIC_KEY en .env'
    );
    return { success: false, error: 'EmailJS no configurado' };
  }

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: ADMIN_EMAIL,
        from_name: 'Azulia Admin',
        logo: LOGO_HTML,
        admin_name: name,
        admin_email: email,
        confirm_link: confirmLink,
        subject: `Confirmar registro administrador - ${name}`
      },
      PUBLIC_KEY
    );
    return { success: true };
  } catch (err: any) {
    console.error('[EmailJS] Error al enviar:', err);
    return { success: false, error: err?.text || err?.message || 'Error desconocido' };
  }
}
