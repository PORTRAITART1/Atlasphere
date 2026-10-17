# Audit général de traduction — Atlasphere

_Date de l’audit : 17 octobre 2026_

## Résumé exécutif

L’application propose 10 langues dans le sélecteur : anglais, arabe, chinois, russe, espagnol, allemand, portugais, japonais, italien et français.

L’infrastructure de sélection fonctionne : la langue est conservée dans `localStorage`, l’attribut HTML `lang` est mis à jour et la direction RTL est activée pour l’arabe. En revanche, la couverture du contenu n’est pas uniforme sur toutes les pages.

### État global

- **Fonctionnel et largement traduit** : navigation, pied de page, accueil, propositions, financement, tableau de bord, création et détail d’une proposition, quêtes, réputation, sécurité, paramètres, paiements Pi, témoignages et pages juridiques.
- **Traductions présentes mais auparavant non raccordées** : dictionnaires des pages secondaires, dictionnaire russe complet et contenu multilingue des anciens projets. Leur fusion au moteur principal a été rétablie pendant cet audit.
- **Non internationalisé ou partiellement internationalisé** : un groupe important de pages avancées utilise encore des libellés JSX ou des jeux de données en dur.
- **Couverture inégale selon la langue** : les dictionnaires secondaires existent pour EN, AR, ZH, RU, ES, PT et FR. Ils n’existent pas encore pour DE, JA et IT ; ces trois langues retombent donc sur l’anglais pour les pages secondaires.
- **Contenu backend** : les cinq projets Atlasphere actuels ont des titres et descriptions anglais en base. Ils ne sont pas des clés de traduction ; ils restent donc en anglais quelle que soit la langue choisie.

## Corrections transversales appliquées

1. Fusion effective des dictionnaires modulaires `pages-*` dans le catalogue exécuté par `t()`.
2. Fusion du dictionnaire russe complet, qui existait mais n’était pas utilisé par le moteur principal.
3. Fusion du contenu de projets et jalons multilingues déjà disponible.
4. Traduction dynamique des statuts de projet au lieu de libellés français codés en dur.
5. Traduction dynamique des catégories de projet au lieu de libellés français codés en dur.
6. Traduction du texte de chargement global et du libellé accessible du sélecteur de langue.
7. Validation réussie du lint et du build après les corrections.

## Couverture des dictionnaires

| Langue | Catalogue principal | Pages secondaires | Contenu projets historique | Résultat |
|---|---:|---:|---:|---|
| Anglais | Oui | Oui | Oui | Référence complète |
| Arabe | Oui | Oui | Oui | Bonne couverture, RTL actif |
| Chinois | Oui | Oui | Oui | Bonne couverture |
| Russe | Oui | Oui | Oui | Dictionnaire reconnecté pendant l’audit |
| Espagnol | Oui | Oui | Oui | Bonne couverture |
| Allemand | Oui | Non | Non | Pages secondaires en anglais |
| Portugais | Oui | Oui | Oui | Bonne couverture ; quelques anciennes divergences neutralisées par la fusion modulaire |
| Japonais | Oui | Non | Non | Pages secondaires en anglais |
| Italien | Oui | Non | Non | Pages secondaires en anglais |
| Français | Oui | Oui | Oui | Bonne couverture |

## Audit par groupe de pages

### Priorité P0 — contenu central

| Pages / composants | État | Écart restant |
|---|---|---|
| `/`, `/proposals`, `/proposal/:id` | Partiel | Interface traduite ; les cinq vrais projets restent en anglais car stockés comme texte brut en base. |
| `/funding`, `/dashboard`, `/create` | Bon | Quelques messages techniques provenant directement de l’API peuvent rester en anglais. |
| `Navbar`, `Footer`, `LanguageSelector` | Bon | Sélecteur et navigation réagissent au changement de langue. |
| `App` / écran de chargement | Corrigé | Le chargement global utilise désormais le catalogue i18n. |

**Action indispensable :** stocker pour chaque projet un identifiant de contenu stable ou des champs localisés (`title_i18n`, `description_i18n`), puis résoudre la langue côté API ou frontend. Sans ce contrat, un projet créé en anglais ne peut pas être traduit automatiquement de façon fiable.

### Priorité P1 — pages métier importantes déjà reliées à i18n

- `ProposalDetail`
- `CreateProposal`
- `Funding`
- `Dashboard`
- `Quests`
- `Reputation`
- `Security`
- `Settings`
- `ApiDocs`
- `Analytics`
- `Delegation`
- `ProjectMap`
- `EcoWallet`
- `PaymentTest`
- `PioneerFeedback`
- `Privacy` et `Terms`

**État :** ces pages utilisent le moteur i18n, mais certaines conservent des fragments techniques ou des données de démonstration en dur. Les dictionnaires secondaires qui les servent sont désormais fusionnés au runtime.

### Priorité P1 — pages non reliées au moteur i18n

Les pages suivantes n’importent actuellement ni `t()`, ni un hook ou abonnement i18n. Leur interface ne peut donc pas suivre intégralement la langue choisie :

- `Subscriptions`
- `EcoNFT`
- `Community`
- `Predictions`
- `ProjectTracking`
- `EcoSensors`
- `LifestyleOptimizer`
- `EcoPremium`
- `EcoLeaderboard`
- `EcoApi`
- `NotificationSettings`
- `CustomDashboard`
- `Rewards`
- `QuadraticVoting`
- `Committees`
- `Treasury`
- `IoTAnomalies`
- `Guilds`
- `Seasons`
- `CarbonCredits`
- `IPFSStorage`
- `Referral`
- `Partners`
- `EcoAds`
- `Messages`
- `ClimateDashboard`
- `EcoMarket`
- `MarketingDownload`

Plusieurs de ces pages disposent déjà de clés dans `pages-en/fr/es/pt/zh/ar/ru`, mais leurs composants utilisent encore des chaînes codées en dur. Il faut remplacer ces chaînes par `t('préfixe.clé')` et appeler `useI18nRerender()` ou `subscribeI18n()`.

### Priorité P2 — composants globaux partiellement ou non traduits

- `FeedbackForm`
- `EcoChatbot`
- `AIAssistant`
- `GlobalSearch`
- `PushNotifications`
- `NotificationBell`
- `ProposalCard`
- `SocialShare`
- `ThemeToggle`
- `ProtectedAdminRoute`

Ces composants apparaissent sur plusieurs routes : leurs textes codés en dur ont un impact transversal et doivent être corrigés avant les pages à faible fréquentation.

### Priorité P2 — contenu de démonstration

Les données de messagerie dans `src/lib/messaging.ts` sont écrites en français (`Moi`, messages et aperçus de conversations). Même si l’enveloppe de la page est traduite, ce contenu reste français. Il faut soit :

- remplacer les contenus par des clés de traduction ;
- fournir des jeux de démonstration par langue ;
- ou considérer les messages comme du contenu utilisateur non traduisible et les présenter comme tels.

### Hors catalogue SPA

- Les pages juridiques statiques sont déjà déclinées en dix langues via des fichiers HTML séparés.
- Le blog est du contenu SEO statique et n’est pas piloté par le sélecteur i18n de l’application.
- `ValidationKey` est une ressource technique et ne nécessite pas de traduction.

## Défauts d’architecture identifiés

1. **Double source de traductions** : un très grand dictionnaire principal coexistait avec des fichiers modulaires non importés.
2. **Fallback silencieux** : une clé absente retourne l’anglais ou la clé elle-même sans signalement visible en développement.
3. **Pas d’interpolation structurée** : de nombreuses phrases concatènent nombres et libellés, ce qui ne respecte pas toujours l’ordre grammatical de chaque langue.
4. **Pas de gestion des pluriels** : plusieurs écrans utilisent des formes comme `proposal(s)`.
5. **Contenu métier non localisable** : titres et descriptions en base ne possèdent pas de variantes linguistiques.
6. **Formatage local incomplet** : dates et nombres sont parfois forcés en `fr-FR` au lieu d’utiliser la langue active.
7. **Langues annoncées sans couverture secondaire** : DE, JA et IT apparaissent dans le sélecteur mais retombent souvent sur l’anglais.

## Recommandations d’implémentation

### Phase 1 — blocages visibles

1. Internationaliser les composants globaux (`EcoChatbot`, recherche, notifications, partage, formulaire de feedback).
2. Relier les 29 pages listées en P1 au moteur i18n.
3. Ajouter les dictionnaires secondaires DE, JA et IT, ou masquer temporairement ces langues tant que leur couverture n’est pas acceptable.
4. Remplacer les `toLocaleDateString('fr-FR')` par un formatage basé sur `getLocale()`.

### Phase 2 — contenu métier

1. Définir un contrat localisable pour `projects` : clé stable + traductions, table enfant `project_translations`, ou colonnes JSON par locale.
2. Conserver le texte original comme fallback.
3. Étendre ce contrat aux quêtes, notifications système, badges et catégories dynamiques.

### Phase 3 — contrôle qualité continu

1. Ajouter un script CI qui compare toutes les clés de chaque langue avec l’anglais.
2. Signaler en développement chaque clé manquante.
3. Ajouter des tests de changement de langue sur les routes principales.
4. Tester explicitement l’arabe en RTL sur mobile et desktop.
5. Interdire les nouveaux textes JSX visibles en dur via une règle ESLint dédiée ou un script d’audit.

## Critères de clôture recommandés

L’internationalisation pourra être considérée complète lorsque :

- chaque route visible réagit instantanément au sélecteur ;
- aucune chaîne d’interface n’est codée en dur ;
- toutes les langues proposées possèdent les mêmes clés ;
- dates, nombres et pluriels utilisent la locale active ;
- les contenus backend disposent d’un fallback et de variantes traduites ;
- une vérification automatisée empêche les régressions.
