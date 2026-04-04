@php($title = 'Nouveau message de contact')
@php($subtitle = 'Un visiteur vous a contacté depuis le site')

@component('emails.partials.layout', ['title' => $title, 'subtitle' => $subtitle])
  <div style="font-size:18px;font-weight:800;color:#1A3A5C;margin:0 0 14px;">
    Nouveau message de contact
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 10px;">
    <tr>
      <td style="width:160px;color:#6b7c93;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Nom</td>
      <td style="color:#1f2a37;font-size:14px;font-weight:700;">{{ $contact->full_name }}</td>
    </tr>
    <tr>
      <td style="width:160px;color:#6b7c93;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Email</td>
      <td style="color:#1f2a37;font-size:14px;font-weight:700;">{{ $contact->email }}</td>
    </tr>
    <tr>
      <td style="width:160px;color:#6b7c93;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Téléphone</td>
      <td style="color:#1f2a37;font-size:14px;font-weight:700;">{{ $contact->phone ?: '—' }}</td>
    </tr>
    <tr>
      <td style="width:160px;color:#6b7c93;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Secteur</td>
      <td style="color:#1f2a37;font-size:14px;font-weight:700;">{{ $contact->sector ?: '—' }}</td>
    </tr>
    <tr>
      <td style="width:160px;color:#6b7c93;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Type de projet</td>
      <td style="color:#1f2a37;font-size:14px;font-weight:700;">{{ $contact->project_type ?: '—' }}</td>
    </tr>
  </table>

  <div style="margin-top:16px;padding:16px;border:1px solid #e6edf6;border-radius:14px;background:#f8fbff;">
    <div style="color:#6b7c93;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Message</div>
    <div style="color:#1f2a37;font-size:14px;line-height:22px;white-space:pre-wrap;">{{ $contact->message }}</div>
  </div>

  <div style="margin-top:18px;color:#6b7c93;font-size:12px;line-height:18px;">
    Répondez à cet email pour contacter directement le visiteur.
  </div>
@endcomponent

