export type Locale = "fr" | "en" | "ar"

type Dictionary = Record<string, string>

export const translations: Record<Locale, Dictionary> = {
  fr: {
    "nav.dashboard": "Tableau de Bord",
    "nav.about": "À Propos",
    "nav.login": "Connexion",
    "nav.register": "Inscription",
    "nav.logout": "Se Déconnecter",
    "nav.anonymous": "Utilisateur Anonyme",

    "dashboard.title": "Tableau de Bord",
    "dashboard.subtitle": "Surveillez les prix en temps réel",

    "auth.login.title": "Connexion",
    "auth.login.subtitle": "Connectez-vous pour accéder à votre compte",
    "auth.login.email": "Email",
    "auth.login.password": "Mot de passe",
    "auth.login.button": "Se Connecter",
    "auth.login.or": "ou",
    "auth.login.anonymous": "Continuer en Anonyme",
    "auth.login.success": "Connexion réussie!",
    "auth.login.error": "Erreur de connexion",
    "auth.login.required": "Veuillez remplir tous les champs",

    "auth.register.title": "Créer un compte",
    "auth.register.subtitle": "Rejoignez la communauté ChoufPrice",
    "auth.register.name": "Nom complet",
    "auth.register.confirm": "Confirmer le mot de passe",
    "auth.register.button": "Créer un compte",
    "auth.register.success": "Compte créé avec succès!",
    "auth.register.error": "Erreur lors de la création du compte",
    "auth.register.required": "Veuillez remplir tous les champs",
    "auth.register.mismatch": "Les mots de passe ne correspondent pas",
    "auth.register.short": "Le mot de passe doit contenir au moins 6 caractères",

    "hero.title": "Suivez les prix en temps réel à travers l'Algérie",
    "hero.subtitle": "La plateforme communautaire pour surveiller et partager les prix des produits dans toutes les wilayas.",
    "hero.feature1.title": "Prix en Direct",
    "hero.feature1.desc": "Mises à jour en temps réel par la communauté",
    "hero.feature2.title": "Communauté Active",
    "hero.feature2.desc": "Des milliers de contributeurs à travers le pays",
    "hero.feature3.title": "Alertes Prix",
    "hero.feature3.desc": "Soyez notifié des prix anormaux",

    "form.name": "Nom complet",
    "form.email": "Email",
    "form.password": "Mot de passe",
    "form.password.placeholder": "••••••••",
    "form.confirmPassword": "Confirmer le mot de passe",
    "form.placeholderEmail": "votre@email.com",

    "toast.anonymous": "Connecté en tant qu'anonyme",

    "chat.title": "Chat Communautaire",
    "chat.placeholder.auth": "Écrire un message...",
    "chat.placeholder.guest": "Connectez-vous pour écrire",
    "chat.send": "Envoyer",
    "chat.noMessages": "Aucun message pour l'instant",

    "stats.totalReports": "Prix Signalés",
    "stats.cities": "Villes Couvertes",
    "stats.products": "Produits Suivis",
    "stats.abnormalPrices": "Prix Anormaux",

    "alerts.title": "Alertes Prix",
  },
  en: {
    "nav.dashboard": "Dashboard",
    "nav.about": "About",
    "nav.login": "Login",
    "nav.register": "Sign Up",
    "nav.logout": "Log Out",
    "nav.anonymous": "Anonymous User",

    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Monitor prices in real time",

    "auth.login.title": "Login",
    "auth.login.subtitle": "Sign in to access your account",
    "auth.login.email": "Email",
    "auth.login.password": "Password",
    "auth.login.button": "Sign In",
    "auth.login.or": "or",
    "auth.login.anonymous": "Continue as Guest",
    "auth.login.success": "Logged in successfully!",
    "auth.login.error": "Login error",
    "auth.login.required": "Please fill in all fields",

    "auth.register.title": "Create an account",
    "auth.register.subtitle": "Join the ChoufPrice community",
    "auth.register.name": "Full name",
    "auth.register.confirm": "Confirm password",
    "auth.register.button": "Create account",
    "auth.register.success": "Account created successfully!",
    "auth.register.error": "Error while creating account",
    "auth.register.required": "Please fill in all fields",
    "auth.register.mismatch": "Passwords do not match",
    "auth.register.short": "Password must be at least 6 characters",

    "hero.title": "Track prices in real time across Algeria",
    "hero.subtitle": "The community platform to monitor and share product prices across all wilayas.",
    "hero.feature1.title": "Live Prices",
    "hero.feature1.desc": "Real-time updates from the community",
    "hero.feature2.title": "Active Community",
    "hero.feature2.desc": "Thousands of contributors across the country",
    "hero.feature3.title": "Price Alerts",
    "hero.feature3.desc": "Get notified of abnormal prices",

    "form.name": "Full name",
    "form.email": "Email",
    "form.password": "Password",
    "form.password.placeholder": "••••••••",
    "form.confirmPassword": "Confirm password",
    "form.placeholderEmail": "you@example.com",

    "toast.anonymous": "Logged in as guest",

    "chat.title": "Community Chat",
    "chat.placeholder.auth": "Type a message...",
    "chat.placeholder.guest": "Sign in to chat",
    "chat.send": "Send",
    "chat.noMessages": "No messages yet",

    "stats.totalReports": "Price Reports",
    "stats.cities": "Cities Covered",
    "stats.products": "Products Tracked",
    "stats.abnormalPrices": "Abnormal Prices",

    "alerts.title": "Price Alerts",
  },
  ar: {
    "nav.dashboard": "لوحة التحكم",
    "nav.about": "حول",
    "nav.login": "تسجيل الدخول",
    "nav.register": "إنشاء حساب",
    "nav.logout": "تسجيل الخروج",
    "nav.anonymous": "مستخدم مجهول",

    "dashboard.title": "لوحة التحكم",
    "dashboard.subtitle": "راقب الأسعار لحظياً",

    "auth.login.title": "تسجيل الدخول",
    "auth.login.subtitle": "سجّل دخولك للوصول إلى حسابك",
    "auth.login.email": "البريد الإلكتروني",
    "auth.login.password": "كلمة المرور",
    "auth.login.button": "دخول",
    "auth.login.or": "أو",
    "auth.login.anonymous": "المتابعة كضيف",
    "auth.login.success": "تم تسجيل الدخول بنجاح!",
    "auth.login.error": "خطأ في تسجيل الدخول",
    "auth.login.required": "يرجى ملء جميع الحقول",

    "auth.register.title": "إنشاء حساب",
    "auth.register.subtitle": "انضم إلى مجتمع ChoufPrice",
    "auth.register.name": "الاسم الكامل",
    "auth.register.confirm": "تأكيد كلمة المرور",
    "auth.register.button": "إنشاء الحساب",
    "auth.register.success": "تم إنشاء الحساب بنجاح!",
    "auth.register.error": "حدث خطأ أثناء إنشاء الحساب",
    "auth.register.required": "يرجى ملء جميع الحقول",
    "auth.register.mismatch": "كلمتا المرور غير متطابقتين",
    "auth.register.short": "يجب أن تكون كلمة المرور 6 أحرف على الأقل",

    "hero.title": "تتبع الأسعار لحظياً في أنحاء الجزائر",
    "hero.subtitle": "منصة مجتمعية لمراقبة ومشاركة أسعار المنتجات في جميع الولايات.",
    "hero.feature1.title": "أسعار مباشرة",
    "hero.feature1.desc": "تحديثات فورية من المجتمع",
    "hero.feature2.title": "مجتمع نشط",
    "hero.feature2.desc": "آلاف المساهمين عبر البلاد",
    "hero.feature3.title": "تنبيهات الأسعار",
    "hero.feature3.desc": "احصل على إشعارات بالأسعار غير الطبيعية",

    "form.name": "الاسم الكامل",
    "form.email": "البريد الإلكتروني",
    "form.password": "كلمة المرور",
    "form.password.placeholder": "••••••••",
    "form.confirmPassword": "تأكيد كلمة المرور",
    "form.placeholderEmail": "you@example.com",

    "toast.anonymous": "تم تسجيل الدخول كضيف",

    "chat.title": "الدردشة المجتمعية",
    "chat.placeholder.auth": "اكتب رسالة...",
    "chat.placeholder.guest": "سجّل الدخول للمشاركة",
    "chat.send": "إرسال",
    "chat.noMessages": "لا توجد رسائل حتى الآن",

    "stats.totalReports": "الأسعار المُبلّغ عنها",
    "stats.cities": "المدن المغطاة",
    "stats.products": "المنتجات المتابعة",
    "stats.abnormalPrices": "الأسعار غير الطبيعية",

    "alerts.title": "تنبيهات الأسعار",
  },
}

export const fallbackLocale: Locale = "en"

export function translate(locale: Locale, key: string) {
  return translations[locale]?.[key] ?? translations[fallbackLocale][key] ?? key
}
