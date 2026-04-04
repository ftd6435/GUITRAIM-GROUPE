@php($title = 'Merci pour votre candidature')
@php($subtitle = 'Nous reviendrons vers vous après étude')

@component('emails.partials.layout', ['title' => $title, 'subtitle' => $subtitle])
  <div style="font-size:18px;font-weight:800;color:#1A3A5C;margin:0 0 10px;">
    Bonjour {{ $application->first_name }} {{ $application->last_name }},
  </div>

  <div style="color:#1f2a37;font-size:14px;line-height:22px;">
    Nous avons bien reçu votre candidature{{ $application->job?->title ? ' pour le poste « '.$application->job->title.' »' : '' }}.
    Notre équipe la traitera et vous recontactera si votre profil correspond à nos besoins.
  </div>

  <div style="margin-top:16px;padding:16px;border:1px solid #e6edf6;border-radius:14px;background:#f8fbff;">
    <div style="color:#6b7c93;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Récapitulatif</div>
    <div style="color:#1f2a37;font-size:14px;line-height:22px;">
      <div><strong>Email :</strong> {{ $application->email }}</div>
      <div><strong>Téléphone :</strong> {{ $application->phone ?: '—' }}</div>
      <div><strong>Offre :</strong> {{ $application->job?->title ?: 'Candidature spontanée' }}</div>
    </div>
  </div>

  <div style="margin-top:18px;color:#6b7c93;font-size:12px;line-height:18px;">
    Merci de votre confiance.
  </div>
@endcomponent

