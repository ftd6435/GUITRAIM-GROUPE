@php($title = 'Nouvelle candidature')
@php($subtitle = 'Candidature reçue depuis le site')

@component('emails.partials.layout', ['title' => $title, 'subtitle' => $subtitle])
  <div style="font-size:18px;font-weight:800;color:#1A3A5C;margin:0 0 14px;">
    Nouvelle candidature
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 10px;">
    <tr>
      <td style="width:160px;color:#6b7c93;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Candidat</td>
      <td style="color:#1f2a37;font-size:14px;font-weight:700;">{{ $application->first_name }} {{ $application->last_name }}</td>
    </tr>
    <tr>
      <td style="width:160px;color:#6b7c93;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Email</td>
      <td style="color:#1f2a37;font-size:14px;font-weight:700;">{{ $application->email }}</td>
    </tr>
    <tr>
      <td style="width:160px;color:#6b7c93;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Téléphone</td>
      <td style="color:#1f2a37;font-size:14px;font-weight:700;">{{ $application->phone ?: '—' }}</td>
    </tr>
    <tr>
      <td style="width:160px;color:#6b7c93;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Offre</td>
      <td style="color:#1f2a37;font-size:14px;font-weight:700;">{{ $application->job?->title ?: 'Candidature spontanée' }}</td>
    </tr>
    <tr>
      <td style="width:160px;color:#6b7c93;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Secteur</td>
      <td style="color:#1f2a37;font-size:14px;font-weight:700;">{{ $application->sector ?: '—' }}</td>
    </tr>
    <tr>
      <td style="width:160px;color:#6b7c93;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Niveau</td>
      <td style="color:#1f2a37;font-size:14px;font-weight:700;">{{ $application->experience_level ?: '—' }}</td>
    </tr>
  </table>

  @if($application->message)
    <div style="margin-top:16px;padding:16px;border:1px solid #e6edf6;border-radius:14px;background:#f8fbff;">
      <div style="color:#6b7c93;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Message</div>
      <div style="color:#1f2a37;font-size:14px;line-height:22px;white-space:pre-wrap;">{{ $application->message }}</div>
    </div>
  @endif

  <div style="margin-top:18px;color:#6b7c93;font-size:12px;line-height:18px;">
    Les fichiers (CV / lettre) sont en pièces jointes si fournis.
  </div>
@endcomponent

