// PiPolis Internationalization (i18n) - 5 languages: FR, EN, ES, PT, ZH

export type Locale = 'fr' | 'en' | 'es' | 'pt' | 'zh';

export const locales: Locale[] = ['fr', 'en', 'es', 'pt', 'zh'];
export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  pt: 'Português',
  zh: '中文'
};

export const localeFlags: Record<Locale, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
  es: '🇪🇸',
  pt: '🇧🇷',
  zh: '🇨🇳'
};

type TranslationKey = string;
type Translations = Record<TranslationKey, string>;

const messages: Record<Locale, Translations> = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.proposals': 'Propositions',
    'nav.funding': 'Financement',
    'nav.dashboard': 'Tableau de Bord',
    'nav.create': 'Créer',
    'nav.quests': 'Quêtes',
    'nav.connect': 'Connecter Pi',
    'nav.disconnect': 'Déconnecter',

    // Hero
    'hero.title': 'Gouvernance Décentralisée Active',
    'hero.subtitle': 'Construisez l\'avenir de Pi Network avec votre communauté',
    'hero.cta': 'Explorer les Projets',
    'hero.cta2': 'Proposer un Projet',

    // Stats
    'stats.projects': 'Projets Actifs',
    'stats.pioneers': 'Pionniers Actifs',
    'stats.funded': 'π Financés',
    'stats.votes': 'Votes Enregistrés',

    // Projects
    'project.propose': 'Proposer un projet',
    'project.budget': 'Budget',
    'project.raised': 'Collecté',
    'project.goal': 'Objectif',
    'project.status': 'Statut',
    'project.deadline': 'Date limite',
    'project.category': 'Catégorie',
    'project.vote': 'Voter',
    'project.fund': 'Financer',
    'project.details': 'Voir détails',
    'project.milestones': 'Jalons',
    'project.team': 'Équipe',

    // Voting
    'vote.for': 'Pour',
    'vote.against': 'Contre',
    'vote.abstain': 'Abstention',
    'vote.weight': 'Poids de vote',
    'vote.quorum': 'Quorum',
    'vote.threshold': 'Seuil d\'approbation',
    'vote.submitted': 'Vote enregistré !',
    'vote.already': 'Vous avez déjà voté',

    // Funding
    'fund.contribute': 'Contribuer',
    'fund.amount': 'Montant en π',
    'fund.progress': 'Progression',
    'fund.contributors': 'Contributeurs',
    'fund.days_left': 'jours restants',

    // Dashboard
    'dashboard.title': 'Mon Tableau de Bord',
    'dashboard.reputation': 'Réputation',
    'dashboard.level': 'Niveau',
    'dashboard.voting_power': 'Pouvoir de Vote',
    'dashboard.contributions': 'Contributions',
    'dashboard.votes_cast': 'Votes Exprimés',
    'dashboard.streak': 'Jours Consécutifs',
    'dashboard.badges': 'Badges',
    'dashboard.overview': 'Aperçu',
    'dashboard.my_votes': 'Mes Votes',
    'dashboard.my_contributions': 'Mes Contributions',

    // Quests
    'quests.title': 'Quêtes & Récompenses',
    'quests.daily': 'Quotidienne',
    'quests.weekly': 'Hebdomadaire',
    'quests.milestone': 'Jalon',
    'quests.one_time': 'Unique',
    'quests.progress': 'Progression',
    'quests.claim': 'Réclamer',
    'quests.completed': 'Complétée',
    'quests.claimed': 'Réclamée',

    // Categories
    'cat.education': 'Éducation',
    'cat.tech': 'Technologie',
    'cat.environment': 'Environnement',
    'cat.commerce': 'Commerce',
    'cat.health': 'Santé',
    'cat.social': 'Social',

    // Status
    'status.proposed': 'Proposé',
    'status.voting': 'En Vote',
    'status.funded': 'Financé',
    'status.in_progress': 'En Cours',
    'status.completed': 'Terminé',
    'status.failed': 'Échoué',

    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.confirm': 'Confirmer',
    'common.save': 'Enregistrer',
    'common.search': 'Rechercher...',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.all': 'Tous',
    'common.back': 'Retour',

    // Auth
    'auth.connect_pi': 'Connecter avec Pi Network',
    'auth.connecting': 'Connexion...',
    'auth.login_required': 'Connexion requise',
    'auth.login_desc': 'Connectez-vous avec Pi Network pour accéder à cette fonctionnalité',

    // Escrow
    'escrow.locked': 'Fonds Verrouillés',
    'escrow.released': 'Fonds Libérés',
    'escrow.milestone_proof': 'Preuve de Jalon',

    // Notifications
    'notif.vote_ended': 'Vote Terminé',
    'notif.milestone_reached': 'Jalon Atteint',
    'notif.funds_released': 'Fonds Libérés',
    'notif.quest_completed': 'Quête Complétée',
    'notif.project_funded': 'Projet Financé',
  },

  en: {
    'nav.home': 'Home',
    'nav.proposals': 'Proposals',
    'nav.funding': 'Funding',
    'nav.dashboard': 'Dashboard',
    'nav.create': 'Create',
    'nav.quests': 'Quests',
    'nav.connect': 'Connect Pi',
    'nav.disconnect': 'Disconnect',

    'hero.title': 'Active Decentralized Governance',
    'hero.subtitle': 'Build the Future of Pi Network with your community',
    'hero.cta': 'Explore Projects',
    'hero.cta2': 'Propose a Project',

    'stats.projects': 'Active Projects',
    'stats.pioneers': 'Active Pioneers',
    'stats.funded': 'π Funded',
    'stats.votes': 'Votes Recorded',

    'project.propose': 'Propose a Project',
    'project.budget': 'Budget',
    'project.raised': 'Raised',
    'project.goal': 'Goal',
    'project.status': 'Status',
    'project.deadline': 'Deadline',
    'project.category': 'Category',
    'project.vote': 'Vote',
    'project.fund': 'Fund',
    'project.details': 'View Details',
    'project.milestones': 'Milestones',
    'project.team': 'Team',

    'vote.for': 'For',
    'vote.against': 'Against',
    'vote.abstain': 'Abstain',
    'vote.weight': 'Vote Weight',
    'vote.quorum': 'Quorum',
    'vote.threshold': 'Approval Threshold',
    'vote.submitted': 'Vote recorded!',
    'vote.already': 'You already voted',

    'fund.contribute': 'Contribute',
    'fund.amount': 'Amount in π',
    'fund.progress': 'Progress',
    'fund.contributors': 'Contributors',
    'fund.days_left': 'days left',

    'dashboard.title': 'My Dashboard',
    'dashboard.reputation': 'Reputation',
    'dashboard.level': 'Level',
    'dashboard.voting_power': 'Voting Power',
    'dashboard.contributions': 'Contributions',
    'dashboard.votes_cast': 'Votes Cast',
    'dashboard.streak': 'Streak Days',
    'dashboard.badges': 'Badges',
    'dashboard.overview': 'Overview',
    'dashboard.my_votes': 'My Votes',
    'dashboard.my_contributions': 'My Contributions',

    'quests.title': 'Quests & Rewards',
    'quests.daily': 'Daily',
    'quests.weekly': 'Weekly',
    'quests.milestone': 'Milestone',
    'quests.one_time': 'One-time',
    'quests.progress': 'Progress',
    'quests.claim': 'Claim',
    'quests.completed': 'Completed',
    'quests.claimed': 'Claimed',

    'cat.education': 'Education',
    'cat.tech': 'Technology',
    'cat.environment': 'Environment',
    'cat.commerce': 'Commerce',
    'cat.health': 'Health',
    'cat.social': 'Social',

    'status.proposed': 'Proposed',
    'status.voting': 'Voting',
    'status.funded': 'Funded',
    'status.in_progress': 'In Progress',
    'status.completed': 'Completed',
    'status.failed': 'Failed',

    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.search': 'Search...',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.all': 'All',
    'common.back': 'Back',

    'auth.connect_pi': 'Connect with Pi Network',
    'auth.connecting': 'Connecting...',
    'auth.login_required': 'Login Required',
    'auth.login_desc': 'Connect with Pi Network to access this feature',

    'escrow.locked': 'Locked Funds',
    'escrow.released': 'Released Funds',
    'escrow.milestone_proof': 'Milestone Proof',

    'notif.vote_ended': 'Vote Ended',
    'notif.milestone_reached': 'Milestone Reached',
    'notif.funds_released': 'Funds Released',
    'notif.quest_completed': 'Quest Completed',
    'notif.project_funded': 'Project Funded',
  },

  es: {
    'nav.home': 'Inicio',
    'nav.proposals': 'Propuestas',
    'nav.funding': 'Financiamiento',
    'nav.dashboard': 'Panel',
    'nav.create': 'Crear',
    'nav.quests': 'Misiones',
    'nav.connect': 'Conectar Pi',
    'nav.disconnect': 'Desconectar',

    'hero.title': 'Gobernanza Descentralizada Activa',
    'hero.subtitle': 'Construye el futuro de Pi Network con tu comunidad',
    'hero.cta': 'Explorar Proyectos',
    'hero.cta2': 'Proponer un Proyecto',

    'stats.projects': 'Proyectos Activos',
    'stats.pioneers': 'Pioneros Activos',
    'stats.funded': 'π Financiados',
    'stats.votes': 'Votos Registrados',

    'project.propose': 'Proponer un proyecto',
    'project.budget': 'Presupuesto',
    'project.raised': 'Recaudado',
    'project.goal': 'Objetivo',
    'project.status': 'Estado',
    'project.deadline': 'Fecha límite',
    'project.category': 'Categoría',
    'project.vote': 'Votar',
    'project.fund': 'Financiar',
    'project.details': 'Ver detalles',
    'project.milestones': 'Hitos',
    'project.team': 'Equipo',

    'vote.for': 'A favor',
    'vote.against': 'En contra',
    'vote.abstain': 'Abstención',
    'vote.weight': 'Peso del voto',
    'vote.quorum': 'Quórum',
    'vote.threshold': 'Umbral de aprobación',
    'vote.submitted': '¡Voto registrado!',
    'vote.already': 'Ya has votado',

    'fund.contribute': 'Contribuir',
    'fund.amount': 'Monto en π',
    'fund.progress': 'Progreso',
    'fund.contributors': 'Contribuyentes',
    'fund.days_left': 'días restantes',

    'dashboard.title': 'Mi Panel',
    'dashboard.reputation': 'Reputación',
    'dashboard.level': 'Nivel',
    'dashboard.voting_power': 'Poder de Voto',
    'dashboard.contributions': 'Contribuciones',
    'dashboard.votes_cast': 'Votos Emitidos',
    'dashboard.streak': 'Días Consecutivos',
    'dashboard.badges': 'Insignias',
    'dashboard.overview': 'Resumen',
    'dashboard.my_votes': 'Mis Votos',
    'dashboard.my_contributions': 'Mis Contribuciones',

    'quests.title': 'Misiones y Recompensas',
    'quests.daily': 'Diaria',
    'quests.weekly': 'Semanal',
    'quests.milestone': 'Hito',
    'quests.one_time': 'Única',
    'quests.progress': 'Progreso',
    'quests.claim': 'Reclamar',
    'quests.completed': 'Completada',
    'quests.claimed': 'Reclamada',

    'cat.education': 'Educación',
    'cat.tech': 'Tecnología',
    'cat.environment': 'Medio Ambiente',
    'cat.commerce': 'Comercio',
    'cat.health': 'Salud',
    'cat.social': 'Social',

    'status.proposed': 'Propuesto',
    'status.voting': 'En Votación',
    'status.funded': 'Financiado',
    'status.in_progress': 'En Progreso',
    'status.completed': 'Completado',
    'status.failed': 'Fallido',

    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.save': 'Guardar',
    'common.search': 'Buscar...',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.all': 'Todos',
    'common.back': 'Volver',

    'auth.connect_pi': 'Conectar con Pi Network',
    'auth.connecting': 'Conectando...',
    'auth.login_required': 'Inicio de sesión requerido',
    'auth.login_desc': 'Conéctate con Pi Network para acceder a esta función',

    'escrow.locked': 'Fondos Bloqueados',
    'escrow.released': 'Fondos Liberados',
    'escrow.milestone_proof': 'Prueba de Hito',

    'notif.vote_ended': 'Votación Terminada',
    'notif.milestone_reached': 'Hito Alcanzado',
    'notif.funds_released': 'Fondos Liberados',
    'notif.quest_completed': 'Misión Completada',
    'notif.project_funded': 'Proyecto Financiado',
  },

  pt: {
    'nav.home': 'Início',
    'nav.proposals': 'Propostas',
    'nav.funding': 'Financiamento',
    'nav.dashboard': 'Painel',
    'nav.create': 'Criar',
    'nav.quests': 'Missões',
    'nav.connect': 'Conectar Pi',
    'nav.disconnect': 'Desconectar',

    'hero.title': 'Governança Descentralizada Ativa',
    'hero.subtitle': 'Construa o futuro da Pi Network com sua comunidade',
    'hero.cta': 'Explorar Projetos',
    'hero.cta2': 'Propor um Projeto',

    'stats.projects': 'Projetos Ativos',
    'stats.pioneers': 'Pioneiros Ativos',
    'stats.funded': 'π Financiados',
    'stats.votes': 'Votos Registrados',

    'project.propose': 'Propor um projeto',
    'project.budget': 'Orçamento',
    'project.raised': 'Arrecadado',
    'project.goal': 'Meta',
    'project.status': 'Status',
    'project.deadline': 'Prazo',
    'project.category': 'Categoria',
    'project.vote': 'Votar',
    'project.fund': 'Financiar',
    'project.details': 'Ver detalhes',
    'project.milestones': 'Marcos',
    'project.team': 'Equipe',

    'vote.for': 'A favor',
    'vote.against': 'Contra',
    'vote.abstain': 'Abstenção',
    'vote.weight': 'Peso do voto',
    'vote.quorum': 'Quórum',
    'vote.threshold': 'Limiar de aprovação',
    'vote.submitted': 'Voto registrado!',
    'vote.already': 'Você já votou',

    'fund.contribute': 'Contribuir',
    'fund.amount': 'Valor em π',
    'fund.progress': 'Progresso',
    'fund.contributors': 'Contribuidores',
    'fund.days_left': 'dias restantes',

    'dashboard.title': 'Meu Painel',
    'dashboard.reputation': 'Reputação',
    'dashboard.level': 'Nível',
    'dashboard.voting_power': 'Poder de Voto',
    'dashboard.contributions': 'Contribuições',
    'dashboard.votes_cast': 'Votos Emitidos',
    'dashboard.streak': 'Dias Consecutivos',
    'dashboard.badges': 'Distintivos',
    'dashboard.overview': 'Visão Geral',
    'dashboard.my_votes': 'Meus Votos',
    'dashboard.my_contributions': 'Minhas Contribuições',

    'quests.title': 'Missões e Recompensas',
    'quests.daily': 'Diária',
    'quests.weekly': 'Semanal',
    'quests.milestone': 'Marco',
    'quests.one_time': 'Única',
    'quests.progress': 'Progresso',
    'quests.claim': 'Reivindicar',
    'quests.completed': 'Completada',
    'quests.claimed': 'Reivindicada',

    'cat.education': 'Educação',
    'cat.tech': 'Tecnologia',
    'cat.environment': 'Meio Ambiente',
    'cat.commerce': 'Comércio',
    'cat.health': 'Saúde',
    'cat.social': 'Social',

    'status.proposed': 'Proposto',
    'status.voting': 'Em Votação',
    'status.funded': 'Financiado',
    'status.in_progress': 'Em Progresso',
    'status.completed': 'Concluído',
    'status.failed': 'Falhou',

    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.save': 'Salvar',
    'common.search': 'Pesquisar...',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.all': 'Todos',
    'common.back': 'Voltar',

    'auth.connect_pi': 'Conectar com Pi Network',
    'auth.connecting': 'Conectando...',
    'auth.login_required': 'Login necessário',
    'auth.login_desc': 'Conecte-se com Pi Network para acessar este recurso',

    'escrow.locked': 'Fundos Bloqueados',
    'escrow.released': 'Fundos Liberados',
    'escrow.milestone_proof': 'Prova de Marco',

    'notif.vote_ended': 'Votação Encerrada',
    'notif.milestone_reached': 'Marco Alcançado',
    'notif.funds_released': 'Fundos Liberados',
    'notif.quest_completed': 'Missão Completada',
    'notif.project_funded': 'Projeto Financiado',
  },

  zh: {
    'nav.home': '首页',
    'nav.proposals': '提案',
    'nav.funding': '资助',
    'nav.dashboard': '仪表盘',
    'nav.create': '创建',
    'nav.quests': '任务',
    'nav.connect': '连接 Pi',
    'nav.disconnect': '断开连接',

    'hero.title': '主动去中心化治理',
    'hero.subtitle': '与社区一起构建 Pi Network 的未来',
    'hero.cta': '探索项目',
    'hero.cta2': '提出项目',

    'stats.projects': '活跃项目',
    'stats.pioneers': '活跃先驱者',
    'stats.funded': 'π 已资助',
    'stats.votes': '已记录投票',

    'project.propose': '提出项目',
    'project.budget': '预算',
    'project.raised': '已筹集',
    'project.goal': '目标',
    'project.status': '状态',
    'project.deadline': '截止日期',
    'project.category': '类别',
    'project.vote': '投票',
    'project.fund': '资助',
    'project.details': '查看详情',
    'project.milestones': '里程碑',
    'project.team': '团队',

    'vote.for': '赞成',
    'vote.against': '反对',
    'vote.abstain': '弃权',
    'vote.weight': '投票权重',
    'vote.quorum': '法定人数',
    'vote.threshold': '批准门槛',
    'vote.submitted': '投票已记录！',
    'vote.already': '您已经投过票了',

    'fund.contribute': '贡献',
    'fund.amount': '金额 (π)',
    'fund.progress': '进度',
    'fund.contributors': '贡献者',
    'fund.days_left': '天剩余',

    'dashboard.title': '我的仪表盘',
    'dashboard.reputation': '声誉',
    'dashboard.level': '等级',
    'dashboard.voting_power': '投票权',
    'dashboard.contributions': '贡献',
    'dashboard.votes_cast': '已投票数',
    'dashboard.streak': '连续天数',
    'dashboard.badges': '徽章',
    'dashboard.overview': '概览',
    'dashboard.my_votes': '我的投票',
    'dashboard.my_contributions': '我的贡献',

    'quests.title': '任务与奖励',
    'quests.daily': '每日',
    'quests.weekly': '每周',
    'quests.milestone': '里程碑',
    'quests.one_time': '一次性',
    'quests.progress': '进度',
    'quests.claim': '领取',
    'quests.completed': '已完成',
    'quests.claimed': '已领取',

    'cat.education': '教育',
    'cat.tech': '科技',
    'cat.environment': '环境',
    'cat.commerce': '商业',
    'cat.health': '健康',
    'cat.social': '社会',

    'status.proposed': '已提出',
    'status.voting': '投票中',
    'status.funded': '已资助',
    'status.in_progress': '进行中',
    'status.completed': '已完成',
    'status.failed': '失败',

    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.save': '保存',
    'common.search': '搜索...',
    'common.filter': '筛选',
    'common.sort': '排序',
    'common.all': '全部',
    'common.back': '返回',

    'auth.connect_pi': '使用 Pi Network 连接',
    'auth.connecting': '连接中...',
    'auth.login_required': '需要登录',
    'auth.login_desc': '连接 Pi Network 以访问此功能',

    'escrow.locked': '锁定资金',
    'escrow.released': '释放资金',
    'escrow.milestone_proof': '里程碑证明',

    'notif.vote_ended': '投票结束',
    'notif.milestone_reached': '里程碑达成',
    'notif.funds_released': '资金释放',
    'notif.quest_completed': '任务完成',
    'notif.project_funded': '项目已资助',
  }
};

// State management
let currentLocale: Locale = 'fr';
const i18nListeners: Set<() => void> = new Set();

function notifyI18nListeners() {
  i18nListeners.forEach((fn) => fn());
}

export function subscribeI18n(fn: () => void) {
  i18nListeners.add(fn);
  return () => i18nListeners.delete(fn);
}

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  if (locales.includes(locale)) {
    currentLocale = locale;
    localStorage.setItem('pipolis_locale', locale);
    notifyI18nListeners();
  }
}

export function t(key: string): string {
  return messages[currentLocale]?.[key] || messages['fr']?.[key] || key;
}

// Detect browser language on init
function detectLocale(): Locale {
  const saved = localStorage.getItem('pipolis_locale') as Locale | null;
  if (saved && locales.includes(saved)) return saved;

  const browserLang = navigator.language.split('-')[0] as Locale;
  if (locales.includes(browserLang)) return browserLang;

  return 'fr';
}

// Initialize
currentLocale = detectLocale();