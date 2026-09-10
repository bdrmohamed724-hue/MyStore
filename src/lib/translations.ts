export type Locale = "en" | "fr" | "ar";

export const locales: Locale[] = ["en", "fr", "ar"];
export const rtlLocales: Locale[] = ["ar"];

export const localeNames: Record<Locale, string> = { en: "English", fr: "Français", ar: "العربية" };

type TranslationKeys = {
  // Nav
  home: string; products: string; collection: string; cart: string; checkout: string;
  // Products
  allProducts: string; search: string; filter: string; sort: string; addToCart: string;
  outOfStock: string; lowStock: string; inStock: string; noProducts: string;
  price: string; name: string; description: string; category: string; stock: string;
  sortByNewest: string; sortByPriceLow: string; sortByPriceHigh: string; sortByName: string;
  allCategories: string; quantity: string;
  // Cart
  yourCart: string; emptyCart: string; cartSubtitle: string; subtotal: string;
  deliveryFee: string; total: string; remove: string; continueShopping: string;
  proceedToCheckout: string; updateCart: string;
  // Checkout
  checkoutTitle: string; customerInfo: string; deliveryInfo: string; paymentInfo: string;
  fullName: string; email: string; phone: string; wilaya: string; city: string;
  address: string; selectDeliveryZone: string; selectPaymentMethod: string;
  orderSummary: string; placeOrder: string; cashOnDelivery: string;
  cib: string; edahabia: string; baridiMob: string; card: string;
  // Order
  orderConfirmed: string; orderNumber: string; thankYou: string; orderSuccessMsg: string;
  // Newsletter
  newsletter: string; newsletterSubtitle: string; subscribe: string; emailPlaceholder: string;
  subscribed: string; subscribeError: string;
  // Social
  followUs: string; instagram: string; facebook: string; tiktok: string; youtube: string;
  // Footer
  allRightsReserved: string;
  // Admin
  dashboard: string; orders: string; customers: string; delivery: string;
  media: string; storeBuilder: string; settings: string; login: string;
  logout: string; username: string; password: string; signIn: string;
  totalOrders: string; pendingOrders: string; revenue: string; lowStockAlert: string;
  recentOrders: string; manage: string; add: string; edit: string; delete: string;
  save: string; cancel: string; actions: string; yes: string; no: string;
  visible: string; hidden: string; active: string; inactive: string;
  enabled: string; disabled: string; noOrders: string; noCustomers: string;
  noMedia: string; noDeliveryZones: string; upload: string; estimatedTime: string;
  orderStatus: string; paymentStatus: string; paymentMethod: string;
  confirmDelete: string; slug: string; image: string; position: string;
  sectionType: string; hero: string; banner: string; featured: string;
  categoriesLabel: string; generic: string; buttonText: string; buttonUrl: string;
  moveUp: string; moveDown: string; currency: string; language: string;
  darkMode: string; music: string; social: string; payments: string;
  storeName: string;
  // Misc
  loading: string; error: string; success: string; back: string; viewAll: string;
  relatedProducts: string; orderDetails: string;
};

const en: TranslationKeys = {
  home: "Home", products: "Products", collection: "Collection", cart: "Cart", checkout: "Checkout",
  allProducts: "All Products", search: "Search", filter: "Filter", sort: "Sort", addToCart: "Add to Cart",
  outOfStock: "Out of Stock", lowStock: "Low Stock", inStock: "In Stock", noProducts: "No products found",
  price: "Price", name: "Name", description: "Description", category: "Category", stock: "Stock",
  sortByNewest: "Newest", sortByPriceLow: "Price: Low to High", sortByPriceHigh: "Price: High to Low",
  sortByName: "Name A-Z", allCategories: "All Categories", quantity: "Quantity",
  yourCart: "Your Cart", emptyCart: "Your cart is empty", cartSubtitle: "Shopping Cart",
  subtotal: "Subtotal", deliveryFee: "Delivery Fee", total: "Total", remove: "Remove",
  continueShopping: "Continue Shopping", proceedToCheckout: "Proceed to Checkout", updateCart: "Update Cart",
  checkoutTitle: "Checkout", customerInfo: "Customer Information", deliveryInfo: "Delivery Information",
  paymentInfo: "Payment Information", fullName: "Full Name", email: "Email", phone: "Phone",
  wilaya: "Wilaya", city: "City", address: "Address", selectDeliveryZone: "Select Delivery Zone",
  selectPaymentMethod: "Select Payment Method", orderSummary: "Order Summary", placeOrder: "Place Order",
  cashOnDelivery: "Cash on Delivery", cib: "CIB", edahabia: "Edahabia", baridiMob: "BaridiMob", card: "Card",
  orderConfirmed: "Order Confirmed", orderNumber: "Order Number", thankYou: "Thank You!",
  orderSuccessMsg: "Your order has been placed successfully. We'll send you a confirmation email.",
  newsletter: "Newsletter", newsletterSubtitle: "Subscribe for updates", subscribe: "Subscribe",
  emailPlaceholder: "Enter your email", subscribed: "Subscribed!", subscribeError: "Subscription failed",
  followUs: "Follow Us", instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok", youtube: "YouTube",
  allRightsReserved: "All rights reserved",
  dashboard: "Dashboard", orders: "Orders", customers: "Customers", delivery: "Delivery",
  media: "Media", storeBuilder: "Store Builder", settings: "Settings", login: "Login", logout: "Logout",
  username: "Username", password: "Password", signIn: "Sign In",
  totalOrders: "Total Orders", pendingOrders: "Pending Orders", revenue: "Revenue", lowStockAlert: "Low Stock",
  recentOrders: "Recent Orders", manage: "Manage", add: "Add", edit: "Edit", delete: "Delete",
  save: "Save", cancel: "Cancel", actions: "Actions", yes: "Yes", no: "No",
  visible: "Visible", hidden: "Hidden", active: "Active", inactive: "Inactive",
  enabled: "Enabled", disabled: "Disabled", noOrders: "No orders yet", noCustomers: "No customers yet",
  noMedia: "No media files", noDeliveryZones: "No delivery zones", upload: "Upload",
  estimatedTime: "Estimated Time", orderStatus: "Order Status", paymentStatus: "Payment Status",
  paymentMethod: "Payment Method", confirmDelete: "Are you sure?", slug: "Slug", image: "Image",
  position: "Position", sectionType: "Section Type", hero: "Hero", banner: "Banner",
  featured: "Featured Products", categoriesLabel: "Categories", generic: "Generic",
  buttonText: "Button Text", buttonUrl: "Button URL", moveUp: "Move Up", moveDown: "Move Down",
  currency: "Currency", language: "Language", darkMode: "Dark Mode", music: "Music",
  social: "Social", payments: "Payments", storeName: "Store Name",
  loading: "Loading", error: "Error", success: "Success", back: "Back", viewAll: "View All",
  relatedProducts: "Related Products", orderDetails: "Order Details",
};

const fr: TranslationKeys = {
  home: "Accueil", products: "Produits", collection: "Collection", cart: "Panier", checkout: "Commander",
  allProducts: "Tous les Produits", search: "Rechercher", filter: "Filtrer", sort: "Trier",
  addToCart: "Ajouter au Panier", outOfStock: "Rupture de Stock", lowStock: "Stock Limité",
  inStock: "En Stock", noProducts: "Aucun produit trouvé", price: "Prix", name: "Nom",
  description: "Description", category: "Catégorie", stock: "Stock",
  sortByNewest: "Plus Récent", sortByPriceLow: "Prix: Croissant", sortByPriceHigh: "Prix: Décroissant",
  sortByName: "Nom A-Z", allCategories: "Toutes les Catégories", quantity: "Quantité",
  yourCart: "Votre Panier", emptyCart: "Votre panier est vide", cartSubtitle: "Panier",
  subtotal: "Sous-total", deliveryFee: "Frais de Livraison", total: "Total", remove: "Supprimer",
  continueShopping: "Continuer les Achats", proceedToCheckout: "Passer la Commande", updateCart: "Mettre à Jour",
  checkoutTitle: "Commander", customerInfo: "Informations Client", deliveryInfo: "Informations de Livraison",
  paymentInfo: "Mode de Paiement", fullName: "Nom Complet", email: "Email", phone: "Téléphone",
  wilaya: "Wilaya", city: "Ville", address: "Adresse", selectDeliveryZone: "Zone de Livraison",
  selectPaymentMethod: "Mode de Paiement", orderSummary: "Récapitulatif", placeOrder: "Commander",
  cashOnDelivery: "Paiement à la Livraison", cib: "CIB", edahabia: "Edahabia", baridiMob: "BaridiMob",
  card: "Carte",
  orderConfirmed: "Commande Confirmée", orderNumber: "Numéro de Commande", thankYou: "Merci!",
  orderSuccessMsg: "Votre commande a été passée avec succès.",
  newsletter: "Newsletter", newsletterSubtitle: "Abonnez-vous", subscribe: "S'abonner",
  emailPlaceholder: "Votre email", subscribed: "Abonné!", subscribeError: "Échec de l'abonnement",
  followUs: "Suivez-nous", instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok", youtube: "YouTube",
  allRightsReserved: "Tous droits réservés",
  dashboard: "Tableau de Bord", orders: "Commandes", customers: "Clients", delivery: "Livraison",
  media: "Médias", storeBuilder: "Constructeur", settings: "Paramètres", login: "Connexion", logout: "Déconnexion",
  username: "Nom d'utilisateur", password: "Mot de passe", signIn: "Se Connecter",
  totalOrders: "Total Commandes", pendingOrders: "En Attente", revenue: "Revenus", lowStockAlert: "Stock Faible",
  recentOrders: "Commandes Récentes", manage: "Gérer", add: "Ajouter", edit: "Modifier", delete: "Supprimer",
  save: "Enregistrer", cancel: "Annuler", actions: "Actions", yes: "Oui", no: "Non",
  visible: "Visible", hidden: "Masqué", active: "Actif", inactive: "Inactif",
  enabled: "Activé", disabled: "Désactivé", noOrders: "Aucune commande", noCustomers: "Aucun client",
  noMedia: "Aucun média", noDeliveryZones: "Aucune zone", upload: "Télécharger",
  estimatedTime: "Temps Estimé", orderStatus: "Statut", paymentStatus: "Paiement", paymentMethod: "Mode",
  confirmDelete: "Êtes-vous sûr?", slug: "Slug", image: "Image", position: "Position",
  sectionType: "Type", hero: "Hero", banner: "Bannière", featured: "Produits Vedettes",
  categoriesLabel: "Catégories", generic: "Générique", buttonText: "Texte Bouton", buttonUrl: "URL Bouton",
  moveUp: "Monter", moveDown: "Descendre", currency: "Devise", language: "Langue",
  darkMode: "Mode Sombre", music: "Musique", social: "Social", payments: "Paiements", storeName: "Nom du Magasin",
  loading: "Chargement", error: "Erreur", success: "Succès", back: "Retour", viewAll: "Voir Tout",
  relatedProducts: "Produits Similaires", orderDetails: "Détails de Commande",
};

const ar: TranslationKeys = {
  home: "الرئيسية", products: "المنتجات", collection: "المجموعة", cart: "السلة", checkout: "الطلب",
  allProducts: "جميع المنتجات", search: "بحث", filter: "تصفية", sort: "ترتيب",
  addToCart: "أضف إلى السلة", outOfStock: "نفذ المخزون", lowStock: "مخزون محدود",
  inStock: "متوفر", noProducts: "لا توجد منتجات", price: "السعر", name: "الاسم",
  description: "الوصف", category: "الفئة", stock: "المخزون",
  sortByNewest: "الأحدث", sortByPriceLow: "السعر: من الأقل", sortByPriceHigh: "السعر: من الأعلى",
  sortByName: "الاسم أ-ي", allCategories: "جميع الفئات", quantity: "الكمية",
  yourCart: "سلتك", emptyCart: "سلتك فارغة", cartSubtitle: "سلة التسوق",
  subtotal: "المجموع الفرعي", deliveryFee: "رسوم التوصيل", total: "المجموع", remove: "إزالة",
  continueShopping: "متابعة التسوق", proceedToCheckout: "إتمام الطلب", updateCart: "تحديث السلة",
  checkoutTitle: "إتمام الطلب", customerInfo: "معلومات العميل", deliveryInfo: "معلومات التوصيل",
  paymentInfo: "طريقة الدفع", fullName: "الاسم الكامل", email: "البريد الإلكتروني", phone: "الهاتف",
  wilaya: "الولاية", city: "المدينة", address: "العنوان", selectDeliveryZone: "منطقة التوصيل",
  selectPaymentMethod: "طريقة الدفع", orderSummary: "ملخص الطلب", placeOrder: "تقديم الطلب",
  cashOnDelivery: "الدفع عند الاستلام", cib: "CIB", edahabia: "الذهبية", baridiMob: "BaridiMob",
  card: "بطاقة",
  orderConfirmed: "تم تأكيد الطلب", orderNumber: "رقم الطلب", thankYou: "شكراً لك!",
  orderSuccessMsg: "تم تقديم طلبك بنجاح.",
  newsletter: "النشرة", newsletterSubtitle: "اشترك للتحديثات", subscribe: "اشتراك",
  emailPlaceholder: "بريدك الإلكتروني", subscribed: "تم الاشتراك!", subscribeError: "فشل الاشتراك",
  followUs: "تابعنا", instagram: "انستغرام", facebook: "فيسبوك", tiktok: "تيك توك", youtube: "يوتيوب",
  allRightsReserved: "جميع الحقوق محفوظة",
  dashboard: "لوحة التحكم", orders: "الطلبات", customers: "العملاء", delivery: "التوصيل",
  media: "الوسائط", storeBuilder: "بناء المتجر", settings: "الإعدادات", login: "تسجيل الدخول",
  logout: "تسجيل الخروج", username: "اسم المستخدم", password: "كلمة المرور", signIn: "دخول",
  totalOrders: "إجمالي الطلبات", pendingOrders: "قيد الانتظار", revenue: "الإيرادات",
  lowStockAlert: "مخزون منخفض", recentOrders: "طلبات حديثة", manage: "إدارة", add: "إضافة",
  edit: "تعديل", delete: "حذف", save: "حفظ", cancel: "إلغاء", actions: "إجراءات", yes: "نعم", no: "لا",
  visible: "مرئي", hidden: "مخفي", active: "نشط", inactive: "غير نشط",
  enabled: "مفعل", disabled: "معطل", noOrders: "لا توجد طلبات", noCustomers: "لا يوجد عملاء",
  noMedia: "لا توجد وسائط", noDeliveryZones: "لا توجد مناطق", upload: "رفع",
  estimatedTime: "الوقت المقدر", orderStatus: "حالة الطلب", paymentStatus: "حالة الدفع",
  paymentMethod: "طريقة الدفع", confirmDelete: "هل أنت متأكد؟", slug: "الرابط", image: "الصورة",
  position: "الموضع", sectionType: "نوع القسم", hero: "رئيسي", banner: "بانر", featured: "منتجات مميزة",
  categoriesLabel: "الفئات", generic: "عام", buttonText: "نص الزر", buttonUrl: "رابط الزر",
  moveUp: "أعلى", moveDown: "أسفل", currency: "العملة", language: "اللغة",
  darkMode: "الوضع الداكن", music: "الموسيقى", social: "التواصل", payments: "المدفوعات",
  storeName: "اسم المتجر",
  loading: "جاري التحميل", error: "خطأ", success: "نجاح", back: "رجوع", viewAll: "عرض الكل",
  relatedProducts: "منتجات مشابهة", orderDetails: "تفاصيل الطلب",
};

const translations: Record<Locale, TranslationKeys> = { en, fr, ar };

export function t(locale: Locale, key: keyof TranslationKeys): string {
  return translations[locale]?.[key] ?? translations.en[key] ?? key;
}

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export type { TranslationKeys };
