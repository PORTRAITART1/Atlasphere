import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <PageTransition>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Conditions d'Utilisation</h1>
          <div className="prose prose-invert prose-lg max-w-none space-y-6 text-gray-300">
            <p className="text-sm text-gray-400">Dernière mise à jour : 20 juin 2026</p>

            <h2 className="text-xl font-semibold text-white mt-8">1. Acceptation des conditions</h2>
            <p>
              En accédant et en utilisant Polis, vous acceptez d'être lié par ces conditions d'utilisation.
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser la plateforme.
              Polis est une plateforme de gouvernance communautaire décentralisée fonctionnant sous Pi Network.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8">2. Description du service</h2>
            <p>Polis offre les services suivants :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Soumission et consultation de propositions communautaires</li>
              <li>Système de vote pondéré par la réputation</li>
              <li>Financement participatif de projets approuvés en Pi</li>
              <li>Système de quêtes et récompenses pour la participation</li>
              <li>Assistant IA pour la rédaction de propositions</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-8">3. Éligibilité</h2>
            <p>
              Pour utiliser Polis, vous devez disposer d'un compte Pi Network valide et être authentifié
              via le Pi SDK. Vous devez être en conformité avec les conditions d'utilisation de Pi Network.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8">4. Compte utilisateur</h2>
            <p>
              Votre compte Polis est lié à votre identité Pi Network. Vous êtes responsable de la
              sécurité de votre compte et de toutes les activités effectuées sous votre identité.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8">5. Règles de conduite</h2>
            <p>En utilisant Polis, vous vous engagez à :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ne pas soumettre de contenu illégal, offensant ou trompeur</li>
              <li>Ne pas tenter de manipuler les votes ou le système de réputation</li>
              <li>Respecter les autres membres de la communauté</li>
              <li>Ne pas utiliser la plateforme à des fins frauduleuses</li>
              <li>Ne pas tenter de compromettre la sécurité de la plateforme</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-8">6. Propositions et votes</h2>
            <p>
              Les propositions soumises sont soumises à un processus de vote communautaire.
              Le poids des votes est déterminé par le score de réputation de chaque participant.
              Les résultats des votes sont définitifs une fois le quorum atteint et la période de vote terminée.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8">7. Transactions en Pi</h2>
            <p>
              Les contributions financières en Pi effectuées via la plateforme sont traitées par le
              Pi SDK. Polis ne détient pas vos Pi — toutes les transactions passent par le réseau Pi Network.
              Les contributions aux projets sont non remboursables une fois confirmées, sauf en cas
              d'échec du projet selon les règles de gouvernance.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8">8. Propriété intellectuelle</h2>
            <p>
              Le contenu que vous soumettez (propositions, commentaires) reste votre propriété.
              En le publiant sur Polis, vous accordez une licence non exclusive pour son affichage
              et sa distribution sur la plateforme.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8">9. Limitation de responsabilité</h2>
            <p>
              Polis est fourni "tel quel". Nous ne garantissons pas la disponibilité continue du service.
              Nous ne sommes pas responsables des pertes résultant de l'utilisation de la plateforme,
              y compris les transactions en Pi effectuées entre utilisateurs.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8">10. Résiliation</h2>
            <p>
              Nous nous réservons le droit de suspendre ou de résilier votre accès à Polis en cas
              de violation de ces conditions d'utilisation, sans préavis.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8">11. Modifications</h2>
            <p>
              Nous pouvons modifier ces conditions à tout moment. Les modifications entrent en vigueur
              dès leur publication sur cette page. Votre utilisation continue de Polis après modification
              constitue votre acceptation des nouvelles conditions.
            </p>

            <h2 className="text-xl font-semibold text-white mt-8">12. Contact</h2>
            <p>
              Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter
              via la plateforme Polis.
            </p>
          </div>
        </div>
      </PageTransition>
      <Footer />
    </div>
  );
}