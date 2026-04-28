import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'CyberLingo <noreply@cyberlingo.app>'

Deno.serve(async (_req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })

  // Users whose last_login was yesterday: streak intact but expires tonight at midnight
  const now = new Date()
  const todayStart = new Date(now)
  todayStart.setUTCHours(0, 0, 0, 0)
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setUTCDate(yesterdayStart.getUTCDate() - 1)

  const { data: atRiskUsers, error } = await supabase
    .from('user_stats')
    .select('id, streak, last_login')
    .gte('last_login', yesterdayStart.toISOString())
    .lt('last_login', todayStart.toISOString())
    .gt('streak', 1)

  if (error) {
    console.error('DB query failed:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  if (!atRiskUsers || atRiskUsers.length === 0) {
    return new Response(JSON.stringify({ sent: 0, message: 'No at-risk users found' }), { status: 200 })
  }

  let sent = 0
  const errors: string[] = []

  for (const stat of atRiskUsers) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(stat.id)
      if (userError || !user?.email) continue

      const displayName = user.user_metadata?.display_name || user.email.split('@')[0]
      const hoursLeft = Math.max(0, Math.round((todayStart.getTime() + 86400000 - Date.now()) / 3600000))

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: user.email,
          subject: `🔥 Dein ${stat.streak}-Tage Streak läuft heute ab!`,
          html: buildEmailHtml(displayName, stat.streak, hoursLeft),
        }),
      })

      if (res.ok) {
        sent++
      } else {
        const body = await res.text()
        errors.push(`${user.email}: ${res.status} ${body}`)
      }
    } catch (e) {
      errors.push(`${stat.id}: ${e}`)
    }
  }

  return new Response(JSON.stringify({ sent, total: atRiskUsers.length, errors }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})

function buildEmailHtml(name: string, streak: number, hoursLeft: number): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Streak Erinnerung</title>
</head>
<body style="margin:0;padding:0;background:#0b1220;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b1220;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#0d192c;border:1px solid #243a5c;border-radius:20px;overflow:hidden;max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0d192c,#1a3050);padding:36px 40px 24px;text-align:center;border-bottom:1px solid #243a5c;">
              <div style="font-size:48px;margin-bottom:12px;">🔥</div>
              <h1 style="margin:0;color:#f1f7ff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">
                Dein Streak läuft heute ab!
              </h1>
              <p style="margin:8px 0 0;color:#a6bcdb;font-size:14px;">
                Hey ${name}, melde dich noch heute an!
              </p>
            </td>
          </tr>

          <!-- Streak counter -->
          <tr>
            <td style="padding:32px 40px;text-align:center;">
              <div style="display:inline-block;background:linear-gradient(135deg,rgba(226,88,110,0.15),rgba(226,88,110,0.05));border:1px solid rgba(226,88,110,0.3);border-radius:16px;padding:20px 40px;">
                <div style="font-size:48px;font-weight:800;color:#f77e91;font-family:monospace;line-height:1;">
                  ${streak}
                </div>
                <div style="color:#a6bcdb;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin-top:6px;">
                  Tage in Folge
                </div>
              </div>

              <p style="color:#a6bcdb;font-size:15px;line-height:1.6;margin:24px 0 0;">
                Du hast <strong style="color:#f1f7ff;">${streak} Tage</strong> am Stück gelernt.
                ${hoursLeft > 0
                  ? `Noch <strong style="color:#f5c842;">${hoursLeft} Stunden</strong> bis Mitternacht — log dich ein und halte deinen Streak am Leben!`
                  : 'Heute ist dein letzter Chance — log dich ein, bevor dein Streak abbricht!'}
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 36px;text-align:center;">
              <a
                href="${SUPABASE_URL.replace('https://ldsimtioqcbseyblmwvg.supabase.co', 'https://cyberlingo.vercel.app')}"
                style="display:inline-block;background:linear-gradient(135deg,#1cb8a0,#118f7d);color:#062720;text-decoration:none;font-weight:700;font-size:16px;padding:14px 36px;border-radius:14px;border:1px solid #1fb39c;"
              >
                🔥 Streak retten
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #243a5c;text-align:center;">
              <p style="margin:0;color:#4a6080;font-size:12px;">
                CyberLingo · Du erhältst diese E-Mail weil du einen aktiven Streak hast.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
