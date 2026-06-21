import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <PageTransition>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Politique de Confidentialité</h1>
          <div className="prose prose-invert prose-lg max-w-none space-y-6 text-gray-300">
            <p className="text-sm text-gray-400">Dernière mise à jour : 20 juin 2026</p>

            <h2 className="text-xl font-semibold text-white mt-8">1. Introduction</h2>
            <p>
              Bienvenue sur Polis, une plateforme de gouvernance communautaire décentralisée fonctionnant sous Pi Network.
              Nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles.
              Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8">2. Données collectées</h2>
            <p>Nous collectons les informations suivantes :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Informations d'authentification Pi Network :</strong> Votre identifiant Pi (uid), nom d'utilisateur, et jeton d'accès fournis lors de la connexion via Pi SDK.</li>
              <li><strong>Données de gouvernance :</strong> Vos propositions, votes, commentaires et contributions financières sur la plateforme.</li>
              <li><strong>Données d'utilisation :</strong> Informations sur votre interaction avec la plateforme (pages visitées, actions effectuées).</li>
              <li><strong>Données techniques :</strong> Adresse IP, type de navigateur, système d'exploitation, à des fins de sécurité et d'amélioration du service.</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-8">3. Utilisation des données</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Authentifier votre identité via Pi Network</li>
              <li>Permettre votre participation à la gouvernance (votes, propositions, financement)</li>
              <li>Calculer votre score de réputation et vos récompenses</li>
              <li>Améliorer nos services et l'expérience utilisateur</li>
              <li>Assurer la sécurité et prévenir les abus</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-8">4. Partage des données</h2>
            <p>
              Nous ne vendons jamais vos données personnelles. Certaines informations sont visibles publiquement
              sur la plateforme (propositions, votes, commentaires) conformément au principe de transparence
              de la gouvernance décentralisée. Vos données d'authentification Pi restent confidentielles.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8">5. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour
              protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8">6. Conservation des données</h2>
            <p>
              Vos données sont conservées aussi longtemps que votre compte est actif. Vous pouvez demander
              la suppression de votre compte et de vos données à tout moment en nous contactant.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8">7. Vos droits</h2>
            <p>Vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Droit d'accès à vos données personnelles</li>
              <li>Droit de rectification des données inexactes</li>
              <li>Droit à l'effacement de vos données</li>
              <li>Droit à la portabilité de vos données</li>
              <li>Droit d'opposition au traitement</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-8">8. Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits,
              veuillez nous contacter via la plateforme Polis.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8">9. Modifications</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment.
              Les modifications seront publiées sur cette page avec une date de mise à jour.
            </p>
          </div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  );
}