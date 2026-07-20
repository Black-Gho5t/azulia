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
    const msg = 'EmailJS no configurado — faltan SERVICE_ID, TEMPLATE_ID o PUBLIC_KEY en .env';
    console.warn('[EmailJS]', msg);
    return { success: false, error: msg };
  }

  const payload = {
    service_id: SERVICE_ID,
    template_id: TEMPLATE_ID,
    user_id: PUBLIC_KEY,
    template_params: {
      to_email: ADMIN_EMAIL,
      from_name: 'Azulia Admin',
      logo: LOGO_HTML,
      admin_name: name,
      admin_email: email,
      confirm_link: confirmLink,
      subject: `Confirmar registro administrador - ${name}`,
      site_name: 'Azulia Servicios Náuticos',
      year: String(new Date().getFullYear()),
    },
  };

  console.log('[EmailJS] Enviando a', ADMIN_EMAIL);

  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log('[EmailJS] Enviado OK');
      return { success: true };
    }

    const text = await res.text();
    const msg = `HTTP ${res.status}: ${text}`;
    console.error('[EmailJS] Error:', msg);
    return { success: false, error: msg };
  } catch (err: any) {
    console.error('[EmailJS] Error de red:', err);
    return { success: false, error: err?.message || 'Error de conexión' };
  }
}
