@php($title = 'Confirmez votre email')
@php($subtitle = 'Activation de votre inscription à la newsletter')

@component('emails.partials.layout', ['title' => $title, 'subtitle' => $subtitle])
  <div style="font-size:18px;font-weight:800;color:#1A3A5C;margin:0 0 10px;">
    Confirmez votre inscription
  </div>

  <div style="color:#1f2a37;font-size:14px;line-height:22px;">
    Vous venez de demander à vous inscrire à la newsletter de GUITRAIM GROUPE.
    Pour finaliser votre inscription, merci de confirmer votre adresse email en cliquant sur le bouton ci-dessous.
  </div>

  <div style="margin-top:18px;">
    <a href="{{ $verificationUrl }}" style="display:inline-block;background:#1A3A5C;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:12px;font-weight:800;font-size:14px;">
      Confirmer mon inscription
    </a>
  </div>

  <div style="margin-top:16px;color:#6b7c93;font-size:12px;line-height:18px;">
    Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :
    <div style="margin-top:6px;word-break:break-all;">
      {{ $verificationUrl }}
    </div>
  </div>
@endcomponent

