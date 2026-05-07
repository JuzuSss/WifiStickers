export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mentions légales &amp; Politique de confidentialité</h1>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">1. Éditeur du service</h2>
          <p className="text-gray-600 text-sm">
            WifiStickers est un service permettant aux commerces de proposer un accès WiFi à leurs clients via un QR code.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">2. Données collectées</h2>
          <p className="text-gray-600 text-sm">
            Lors de votre connexion, nous enregistrons : l'adresse IP (anonymisée), la date et l'heure du scan,
            et votre choix de consentement. Ces données sont conservées pendant 12 mois conformément à la
            loi LCEN et sont utilisées uniquement à des fins statistiques et de sécurité.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">3. Publicité</h2>
          <p className="text-gray-600 text-sm">
            En acceptant nos conditions, vous consentez à voir une courte publicité (5 secondes) avant d'accéder
            aux identifiants WiFi. Aucune donnée personnelle n'est transmise à des annonceurs tiers.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">4. Vos droits (RGPD)</h2>
          <p className="text-gray-600 text-sm">
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit
            d'accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous.
          </p>
        </section>

        <a href="javascript:history.back()" className="text-blue-600 hover:underline text-sm">
          ← Retour
        </a>
      </div>
    </div>
  );
}
