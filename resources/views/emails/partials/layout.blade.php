<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title ?? 'GUITRAIM GROUPE' }}</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f6fb;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f6fb;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:640px;max-width:92vw;background:#ffffff;border:1px solid #e6edf6;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="background:#1A3A5C;padding:22px 26px;">
                <div style="color:#ffffff;font-size:14px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
                  GUITRAIM GROUPE
                </div>
                <div style="color:rgba(255,255,255,0.85);font-size:13px;margin-top:6px;">
                  {{ $subtitle ?? 'Notification automatique' }}
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:26px;">
                {{ $slot }}
              </td>
            </tr>

            <tr>
              <td style="padding:18px 26px;background:#f8fbff;border-top:1px solid #e6edf6;color:#6b7c93;font-size:12px;line-height:18px;">
                <div style="font-weight:700;color:#1A3A5C;">GUITRAIM GROUPE</div>
                <div style="margin-top:4px;">
                  Cet email a été envoyé automatiquement. Merci de ne pas répondre directement à ce message.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

