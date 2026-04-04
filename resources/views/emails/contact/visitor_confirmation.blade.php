@php($title = 'Merci pour votre message')
@php($subtitle = 'Nous vous répondrons dans les plus brefs délais')

@component('emails.partials.layout', ['title' => $title, 'subtitle' => $subtitle])
  <div style="font-size:18px;font-weight:800;color:#1A3A5C;margin:0 0 10px;">
    Bonjour {{ $contact->full_name }},
  </div>

  <div style="color:#1f2a37;font-size:14px;line-height:22px;">
    Nous avons bien reçu votre message. Notre équipe vous recontactera rapidement.
  </div>

  <div style="margin-top:16px;padding:16px;border:1px solid #e6edf6;border-radius:14px;background:#f8fbff;">
    <div style="color:#6b7c93;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Récapitulatif</div>
    <div style="color:#1f2a37;font-size:14px;line-height:22px;">
      <div><strong>Email :</strong> {{ $contact->email }}</div>
      <div><strong>Téléphone :</strong> {{ $contact->phone ?: '—' }}</div>
      <div><strong>Type de projet :</strong> {{ $contact->project_type ?: '—' }}</div>
    </div>
  </div>

  <div style="margin-top:18px;color:#6b7c93;font-size:12px;line-height:18px;">
    Merci de votre confiance.
  </div>
@endcomponent

