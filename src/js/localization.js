import { LANGUAGES, extraTranslations } from './language-data.js';
import { interfaceTranslations } from './interface-translations.js';
import { authTranslations } from './auth-translations.js';
import { siteCopy } from './site-copy.js';
import { emailTranslations } from './email-translations.js';
import { privacyTranslations } from './privacy-translations.js';
import { loginTranslations } from './login-translations.js';
import {notificationTranslations} from './notification-translations.js';
import {mapTranslations} from './map-translations.js';
import {teamTranslations} from './team-translations.js';
import {organizationTranslations} from './organization-translations.js';
import {catalogueTranslations} from './catalogue-translations.js';
import {characterTranslations} from './character-translations.js';
// Localization/i18n system for multi-language support
// Supports English (en) and Urdu (ur)

export const translations = {
    en: {
        // Navigation & Headers
        'nav.home': 'Home',
        'nav.about': 'About Us',
        'nav.products': 'Products',
        'nav.privacy': 'Privacy',
        'nav.contact': 'Contact Us',
        'nav.controlPanel': 'Control Panel',

        'head.contact': 'AG | Contact Us',
        'head.products': 'AG | Products',
        'head.about': 'AG | About Us',
        'head.home': 'AG | Home',

        // Login Page
        'head.welcome': 'Welcome Back!',
        'login.email': 'Email',
        'login.password': 'Password',
        'login.submit': 'Log In',
        'login.noAccount': "Don't have an account?",
        'login.signUp': "Sign Up",
        'login.or': 'or',
        'login.createAccount': 'Create Account',

        //Home Page
        'body.heading.home': 'Welcome to AG Electronics Pvt. Ltd.',
        'body.description.home': 'Your trusted partner in softwares mainly.',

        // About Page
        'body.heading.about': 'Welcome to AG Electronics Pvt. Ltd.',
        'body.description.about': 'here information was goind to add after company was registered',

        // Authentication Methods
        'auth.google': 'Login with Google',
        'auth.googleSignup': 'Sign up with Google',
        'auth.github': 'Sign in with GitHub',
        'auth.githubSignup': 'Sign up with GitHub',
        'auth.facebook': 'Login with Facebook',
        'auth.facebookSignup': 'Sign up with Facebook',
        'auth.yahoo': 'Login with Yahoo',
        'auth.yahooSignup': 'Sign up with Yahoo',
        'auth.phone': 'Login with Phone',
        'auth.phoneSignup': 'Sign up with Phone',
        'auth.guest': 'Continue as Guest',
        'auth.guestSignup': 'Continue as Guest',

        // Phone Authentication
        'phone.enterNumber': 'Enter your phone number:',
        'phone.sendOtp': 'Send OTP',
        'phone.enterCode': 'Enter the 6-digit code sent to your phone:',
        'phone.verifyLogin': 'Verify & Login',
        'phone.useNumber': 'Use different number',

        // Modals & Dialogs
        'modal.settings': 'Settings',
        'modal.phoneLogin': 'Phone Number Login',
        'modal.selectCategory': 'Select Category',

        // Settings Modal
        'settings.theme': 'Theme Settings',
        'settings.themeLight': 'Light',
        'settings.themeDark': 'Dark',
        'settings.viewMode': 'View Mode',
        'settings.viewModeGrid': '🔲 Grid',
        'settings.viewModeList': '☰ List',
        'settings.language': 'Language',
        'settings.languageEn': '🇺🇸 English',
        'settings.languageUr': '🇵🇰 اردو',
        'settings.close': 'Close Settings',
        'settings.display': 'Display Settings',
        'settings.showEmail': 'Show email in header',

        // Product Page
        'product.noProducts': 'No products in this category',
        'product.loadingProducts': 'Loading products...',
        'product.wheelHint': '🖱️ Mouse Wheel or Left Click to rotate | 🖱️ Right Click for all categories',
        'product.viewDetails': 'View Details',
        'product.price': 'Price',
        'product.category': 'Category',
        'product.description': 'Description',
        'product.report': 'Report Product',
        'product.reportReason': 'Reason for reporting',
        'product.reportDetails': 'Details (optional)',
        'product.submitReport': 'Submit Report',

        // Product Details Modal
        'details.name': 'Name',
        'details.price': 'Price',
        'details.category': 'Category',
        'details.subcategory': 'Sub Category',
        'details.brand': 'Brand',
        'details.sku': 'SKU',
        'details.stock': 'Stock',
        'details.stockUnlimited': 'Unlimited',
        'details.stockUnits': 'units',
        'details.rating': 'Rating',
        'details.description': 'Description',
        'details.tags': 'Tags',
        'details.specs': 'Specifications',
        'details.edit': '✏️ Edit Product',
        'details.visit': '🔗 Visit Product',
        'details.download': '📥 Download',

        // Contact Page
        'contact.getInTouch': 'Get in Touch',
        'contact.sendMessage': 'Send us a Message',
        'contact.name': 'Name',
        'contact.email': 'Email',
        'contact.message': 'Message',
        'contact.submitBtn': 'Send Message',
        'contact.phone': '+92-330-XXXXXXX',
        'contact.location': 'Karachi, Pakistan',
        'contact.emailAddr': 'ag.aliengamerz@gmail.com',

        // Buttons & Controls
        'btn.logout': 'Logout',
        'btn.submit': 'Submit',
        'btn.cancel': 'Cancel',
        'btn.close': 'Close',
        'btn.yes': 'Yes',
        'btn.no': 'No',

        // Common Messages
        'msg.loading': 'Loading...',
        'msg.error': 'Error',
        'msg.success': 'Success',
        'msg.welcome': 'Welcome',
        'msg.userId': 'User ID',
        'msg.haveAccount': 'Already have an account?',
    },
    ur: {
        // Navigation & Headers
        'nav.home': 'ہوم',
        'nav.about': 'ہمارے بارے میں',
        'nav.products': 'مصنوعات',
        'nav.privacy': 'رازداری',
        'nav.contact': 'ہم سے رابطہ کریں',
        'nav.controlPanel': 'کنٹرول پینل',

        'head.contact': 'AG | ہم سے رابطہ کریں',
        'head.privacy': 'AG | رازداری کی پالیسی',
        'head.products': 'AG | مصنوعات',
        'head.about': 'AG | ہمارے بارے میں',
        'head.home': 'AG | ہوم',

        // Login Page
        'head.welcome': 'خوش آمدید دوبارہ!',
        'login.email': 'ای میل',
        'login.password': 'پاس ورڈ',
        'login.submit': 'لاگ ان',
        'login.noAccount': "اکاؤنٹ نہیں ہے؟",
        'login.signUp': "سائن اپ کریں",
        'login.or': 'یا',
        'login.createAccount': 'اکاؤنٹ بنائیں',

        //Home Page
        'body.heading.home': 'AG الیکٹرانکس پرائیویٹ لمیٹڈ میں خوش آمدید',
        'body.description.home': 'آپ کا قابل اعتماد شراکت دار، خاص طور پر سافٹ ویئر میں۔',

        // About Page
        'body.heading.about': 'AG الیکٹرانکس پرائیویٹ لمیٹڈ میں خوش آمدید',
        'body.description.about': 'کمپنی کے رجسٹر ہونے کے بعد یہاں معلومات شامل کی جا رہی تھی',

        // Authentication Methods
        'auth.google': 'Google کے ساتھ لاگ ان',
        'auth.googleSignup': 'Google کے ساتھ سائن اپ',
        'auth.github': 'GitHub کے ساتھ سائن ان',
        'auth.githubSignup': 'GitHub کے ساتھ سائن اپ',
        'auth.facebook': 'Facebook کے ساتھ لاگ ان',
        'auth.facebookSignup': 'Facebook کے ساتھ سائن اپ',
        'auth.yahoo': 'Yahoo کے ساتھ لاگ ان',
        'auth.yahooSignup': 'Yahoo کے ساتھ سائن اپ',
        'auth.phone': 'فون کے ساتھ لاگ ان',
        'auth.phoneSignup': 'فون کے ساتھ سائن اپ',
        'auth.guest': 'مہمان کے طور پر جاری رکھیں',
        'auth.guestSignup': 'مہمان کے طور پر جاری رکھیں',

        // Phone Authentication
        'phone.enterNumber': 'اپنا فون نمبر درج کریں:',
        'phone.sendOtp': 'OTP بھیجیں',
        'phone.enterCode': 'اپنے فون پر بھیجے گئے 6 ہندسے کوڈ درج کریں:',
        'phone.verifyLogin': 'تصدیق اور لاگ ان کریں',
        'phone.useNumber': 'مختلف نمبر استعمال کریں',

        // Modals & Dialogs
        'modal.settings': 'ترتیبات',
        'modal.phoneLogin': 'فون نمبر لاگ ان',
        'modal.selectCategory': 'زمرہ منتخب کریں',

        // Settings Modal
        'settings.theme': 'تھیم سیٹنگز',
        'settings.themeLight': 'روشن',
        'settings.themeDark': 'تاریک',
        'settings.viewMode': 'دیکھنے کا موڈ',
        'settings.viewModeGrid': '🔲 گرڈ',
        'settings.viewModeList': '☰ فہرست',
        'settings.language': 'زبان',
        'settings.languageEn': '🇺🇸 English',
        'settings.languageUr': '🇵🇰 اردو',
        'settings.close': 'سیٹنگز بند کریں',
        'settings.display': 'نمائش کی ترتیبات',
        'settings.showEmail': 'ہیڈر میں ای میل دکھائیں',

        // Product Page
        'product.noProducts': 'اس زمرے میں کوئی مصنوعات نہیں',
        'product.loadingProducts': 'مصنوعات لوڈ ہو رہی ہیں...',
        'product.wheelHint': '🖱️ ماؤس وہیل یا بائیں کلک سے گھومائیں | 🖱️ تمام زمرہ جات کے لیے دائیں کلک کریں',
        'product.viewDetails': 'تفصیلات دیکھیں',
        'product.price': 'قیمت',
        'product.category': 'زمرہ',
        'product.description': 'تفصیل',
        'product.report': 'مصنوع کی اطلاع دیں',
        'product.reportReason': 'اطلاع دینے کی وجہ',
        'product.reportDetails': 'تفصیلات (اختیاری)',
        'product.submitReport': 'اطلاع جمع کریں',

        // Product Details Modal
        'details.name': 'نام',
        'details.price': 'قیمت',
        'details.category': 'زمرہ',
        'details.subcategory': 'ذیلی زمرہ',
        'details.brand': 'برانڈ',
        'details.sku': 'SKU',
        'details.stock': 'ذخیرہ',
        'details.stockUnlimited': 'غیر محدود',
        'details.stockUnits': 'اکائی',
        'details.rating': 'درجہ بندی',
        'details.description': 'تفصیل',
        'details.tags': 'ٹیگز',
        'details.specs': 'تفصیلات',
        'details.edit': '✏️ مصنوع میں ترمیم کریں',
        'details.visit': '🔗 مصنوع دیکھیں',
        'details.download': '📥 ڈاؤن لوڈ کریں',

        // Contact Page
        'contact.getInTouch': 'ہم سے رابطہ کریں',
        'contact.sendMessage': 'ہمیں ایک پیغام بھیجیں',
        'contact.name': 'نام',
        'contact.email': 'ای میل',
        'contact.message': 'پیغام',
        'contact.submitBtn': 'پیغام بھیجیں',
        'contact.phone': '+92-330-XXXXXXX',
        'contact.location': 'کراچی، پاکستان',
        'contact.emailAddr': 'ag.aliengamerz@gmail.com',

        // Buttons & Controls
        'btn.logout': 'لاگ آؤٹ',
        'btn.submit': 'جمع کریں',
        'btn.cancel': 'منسوخ کریں',
        'btn.close': 'بند کریں',
        'btn.yes': 'جی ہاں',
        'btn.no': 'نہیں',

        // Common Messages
        'msg.loading': 'لوڈ ہو رہا ہے...',
        'msg.error': 'خرابی',
        'msg.success': 'کامیاب',
        'msg.welcome': 'خوش آمدید',
        'msg.userId': 'صارف کی شناخت',
        'msg.haveAccount': 'پہلے سے اکاؤنٹ ہے؟',
    },
    ar: {
    // Navigation & Headers
    'nav.home': 'الرئيسية',
    'nav.about': 'من نحن',
    'nav.products': 'المنتجات',
    'nav.privacy': 'الخصوصية',
    'nav.contact': 'اتصل بنا',
    'nav.controlPanel': 'لوحة التحكم',

    'head.contact': 'AG | اتصل بنا',
    'head.products': 'AG | المنتجات',
    'head.about': 'AG | من نحن',
    'head.home': 'AG | الرئيسية',

    // Login Page
    'head.welcome': 'مرحباً بعودتك!',
    'login.email': 'البريد الإلكتروني',
    'login.password': 'كلمة المرور',
    'login.submit': 'تسجيل الدخول',
    'login.noAccount': 'ليس لديك حساب؟',
    'login.signUp': 'إنشاء حساب',
    'login.or': 'أو',
    'login.createAccount': 'إنشاء حساب جديد',

    // Home Page
    'body.heading.home': 'مرحباً بكم في AG Electronics Pvt. Ltd.',
    'body.description.home': 'شريكك الموثوق به بشكل أساسي في البرمجيات.',

    // About Page
    'body.heading.about': 'مرحباً بكم في AG Electronics Pvt. Ltd.',
    'body.description.about': 'سيتم إضافة المعلومات هنا بعد تسجيل الشركة',

    // Authentication Methods
    'auth.google': 'تسجيل الدخول باستخدام Google',
    'auth.googleSignup': 'الاشتراك باستخدام Google',
    'auth.github': 'تسجيل الدخول باستخدام GitHub',
    'auth.githubSignup': 'الاشتراك باستخدام GitHub',
    'auth.facebook': 'تسجيل الدخول باستخدام Facebook',
    'auth.facebookSignup': 'الاشتراك باستخدام Facebook',
    'auth.yahoo': 'تسجيل الدخول باستخدام Yahoo',
    'auth.yahooSignup': 'الاشتراك باستخدام Yahoo',
    'auth.phone': 'تسجيل الدخول برقم الهاتف',
    'auth.phoneSignup': 'الاشتراك برقم الهاتف',
    'auth.guest': 'المتابعة كضيف',
    'auth.guestSignup': 'المتابعة كضيف',

    // Phone Authentication
    'phone.enterNumber': 'أدخل رقم هاتفك:',
    'phone.sendOtp': 'إرسال رمز OTP',
    'phone.enterCode': 'أدخل الرمز المكون من 6 أرقام المرسل إلى هاتفك:',
    'phone.verifyLogin': 'التحقق وتسجيل الدخول',
    'phone.useNumber': 'استخدام رقم آخر',

    // Modals & Dialogs
    'modal.settings': 'الإعدادات',
    'modal.phoneLogin': 'تسجيل الدخول برقم الهاتف',
    'modal.selectCategory': 'اختر الفئة',

    // Settings Modal
    'settings.theme': 'إعدادات المظهر',
    'settings.themeLight': 'فاتح',
    'settings.themeDark': 'داكن',
    'settings.viewMode': 'طريقة العرض',
    'settings.viewModeGrid': '🔲 شبكة',
    'settings.viewModeList': '☰ قائمة',
    'settings.language': 'اللغة',
    'settings.languageEn': '🇺🇸 English',
    'settings.languageUr': '🇵🇰 اردو',
    'settings.close': 'إغلاق الإعدادات',
    'settings.display': 'إعدادات العرض',
    'settings.showEmail': 'إظهار البريد الإلكتروني في الشريط العلوي',

    // Product Page
    'product.noProducts': 'لا توجد منتجات في هذه الفئة',
    'product.loadingProducts': 'جاري تحميل المنتجات...',
    'product.wheelHint': '🖱️ عجلة الماوس أو النقر الأيسر للتدوير | 🖱️ النقر الأيمن لعرض جميع الفئات',
    'product.viewDetails': 'عرض التفاصيل',
    'product.price': 'السعر',
    'product.category': 'الفئة',
    'product.description': 'الوصف',
    'product.report': 'الإبلاغ عن منتج',
    'product.reportReason': 'سبب الإبلاغ',
    'product.reportDetails': 'التفاصيل (اختياري)',
    'product.submitReport': 'إرسال البلاغ',

    // Product Details Modal
    'details.name': 'الاسم',
    'details.price': 'السعر',
    'details.category': 'الفئة',
    'details.subcategory': 'الفئة الفرعية',
    'details.brand': 'العلامة التجارية',
    'details.sku': 'رمز المنتج (SKU)',
    'details.stock': 'المخزون',
    'details.stockUnlimited': 'غير محدود',
    'details.stockUnits': 'وحدة',
    'details.rating': 'التقييم',
    'details.description': 'الوصف',
    'details.tags': 'الوسوم',
    'details.specs': 'المواصفات',
    'details.edit': '✏️ تعديل المنتج',
    'details.visit': '🔗 زيارة المنتج',
    'details.download': '📥 تحميل',

    // Contact Page
    'contact.getInTouch': 'تواصل معنا',
    'contact.sendMessage': 'أرسل لنا رسالة',
    'contact.name': 'الاسم',
    'contact.email': 'البريد الإلكتروني',
    'contact.message': 'الرسالة',
    'contact.submitBtn': 'إرسال الرسالة',
    'contact.phone': '+92-330-XXXXXXX',
    'contact.location': 'كراتشي، باكستان',
    'contact.emailAddr': 'ag.aliengamerz@gmail.com',

    // Buttons & Controls
    'btn.logout': 'تسجيل الخروج',
    'btn.submit': 'إرسال',
    'btn.cancel': 'إلغاء',
    'btn.close': 'إغلاق',
    'btn.yes': 'نعم',
    'btn.no': 'لا',

    // Common Messages
    'msg.loading': 'جاري التحميل...',
    'msg.error': 'خطأ',
    'msg.success': 'نجاح',
    'msg.welcome': 'مرحباً',
    'msg.userId': 'معرف المستخدم',
    'msg.haveAccount': 'لديك حساب بالفعل؟',
    },
    tr: {
    // Navigation & Headers
    'nav.home': 'Ana Sayfa',
    'nav.about': 'Hakkımızda',
    'nav.products': 'Ürünler',
    'nav.privacy': 'Gizlilik',
    'nav.contact': 'İletişim',
    'nav.controlPanel': 'Kontrol Paneli',

    'head.contact': 'AG | İletişim',
    'head.products': 'AG | Ürünler',
    'head.about': 'AG | Hakkımızda',
    'head.home': 'AG | Ana Sayfa',

    // Login Page
    'head.welcome': 'Tekrar Hoş Geldiniz!',
    'login.email': 'E-posta',
    'login.password': 'Şifre',
    'login.submit': 'Giriş Yap',
    'login.noAccount': 'Hesabınız yok mu?',
    'login.signUp': 'Kayıt Ol',
    'login.or': 'veya',
    'login.createAccount': 'Hesap Oluştur',

    // Home Page
    'body.heading.home': 'AG Electronics Pvt. Ltd.\'ye Hoş Geldiniz',
    'body.description.home': 'Ağırlıklı olarak yazılım alanında güvenilir ortağınız.',

    // About Page
    'body.heading.about': 'AG Electronics Pvt. Ltd.\'ye Hoş Geldiniz',
    'body.description.about': 'Şirket tescil edildikten sonra bilgiler buraya eklenecektir.',

    // Authentication Methods
    'auth.google': 'Google ile Giriş Yap',
    'auth.googleSignup': 'Google ile Kayıt Ol',
    'auth.github': 'GitHub ile Giriş Yap',
    'auth.githubSignup': 'GitHub ile Kayıt Ol',
    'auth.facebook': 'Facebook ile Giriş Yap',
    'auth.facebookSignup': 'Facebook ile Kayıt Ol',
    'auth.yahoo': 'Yahoo ile Giriş Yap',
    'auth.yahooSignup': 'Yahoo ile Kayıt Ol',
    'auth.phone': 'Telefon ile Giriş Yap',
    'auth.phoneSignup': 'Telefon ile Kayıt Ol',
    'auth.guest': 'Misafir olarak Devam Et',
    'auth.guestSignup': 'Misafir olarak Devam Et',

    // Phone Authentication
    'phone.enterNumber': 'Telefon numaranızı girin:',
    'phone.sendOtp': 'OTP Gönder',
    'phone.enterCode': 'Telefonunuza gönderilen 6 haneli kodu girin:',
    'phone.verifyLogin': 'Doğrula ve Giriş Yap',
    'phone.useNumber': 'Farklı bir numara kullan',

    // Modals & Dialogs
    'modal.settings': 'Ayarlar',
    'modal.phoneLogin': 'Telefon Numarası ile Giriş',
    'modal.selectCategory': 'Kategori Seç',

    // Settings Modal
    'settings.theme': 'Tema Ayarları',
    'settings.themeLight': 'Açık',
    'settings.themeDark': 'Karanlık',
    'settings.viewMode': 'Görünüm Modu',
    'settings.viewModeGrid': '🔲 Izgara',
    'settings.viewModeList': '☰ Liste',
    'settings.language': 'Dil',
    'settings.languageEn': '🇺🇸 English',
    'settings.languageUr': '🇵🇰 اردو',
    'settings.close': 'Ayarları Kapat',
    'settings.display': 'Ekran Ayarları',
    'settings.showEmail': 'E-postayı üst bilgide göster',

    // Product Page
    'product.noProducts': 'Bu kategoride ürün bulunamadı',
    'product.loadingProducts': 'Ürünler yükleniyor...',
    'product.wheelHint': '🖱️ Döndürmek için Fare Tekerleği veya Sol Tık | 🖱️ Tüm kategoriler için Sağ Tık',
    'product.viewDetails': 'Detayları Gör',
    'product.price': 'Fiyat',
    'product.category': 'Kategori',
    'product.description': 'Açıklama',
    'product.report': 'Ürünü Bildir',
    'product.reportReason': 'Bildirim Nedeni',
    'product.reportDetails': 'Detaylar (isteğe bağlı)',
    'product.submitReport': 'Raporu Gönder',

    // Product Details Modal
    'details.name': 'İsim',
    'details.price': 'Fiyat',
    'details.category': 'Kategori',
    'details.subcategory': 'Alt Kategori',
    'details.brand': 'Marka',
    'details.sku': 'SKU',
    'details.stock': 'Stok',
    'details.stockUnlimited': 'Sınırsız',
    'details.stockUnits': 'adet',
    'details.rating': 'Değerlendirme',
    'details.description': 'Açıklama',
    'details.tags': 'Etiketler',
    'details.specs': 'Özellikler',
    'details.edit': '✏️ Ürünü Düzenle',
    'details.visit': '🔗 Ürünü Ziyaret Et',
    'details.download': '📥 İndir',

    // Contact Page
    'contact.getInTouch': 'İletişime Geçin',
    'contact.sendMessage': 'Bize Mesaj Gönderin',
    'contact.name': 'İsim',
    'contact.email': 'E-posta',
    'contact.message': 'Mesaj',
    'contact.submitBtn': 'Mesaj Gönder',
    'contact.phone': '+92-330-XXXXXXX',
    'contact.location': 'Karaçi, Pakistan',
    'contact.emailAddr': 'ag.aliengamerz@gmail.com',

    // Buttons & Controls
    'btn.logout': 'Çıkış Yap',
    'btn.submit': 'Gönder',
    'btn.cancel': 'İptal',
    'btn.close': 'Kapat',
    'btn.yes': 'Evet',
    'btn.no': 'Hayır',

    // Common Messages
    'msg.loading': 'Yükleniyor...',
    'msg.error': 'Hata',
    'msg.success': 'Başarılı',
    'msg.welcome': 'Hoş Geldiniz',
    'msg.userId': 'Kullanıcı ID',
    'msg.haveAccount': 'Zaten bir hesabınız var mı?',
    },
    ja: {
    // Navigation & Headers
    'nav.home': 'ホーム',
    'nav.about': '会社概要',
    'nav.products': '製品一覧',
    'nav.privacy': 'プライバシーポリシー',
    'nav.contact': 'お問い合わせ',
    'nav.controlPanel': 'コントロールパネル',

    'head.contact': 'AG | お問い合わせ',
    'head.products': 'AG | 製品一覧',
    'head.about': 'AG | 会社概要',
    'head.home': 'AG | ホーム',

    // Login Page
    'head.welcome': 'おかえりなさい！',
    'login.email': 'メールアドレス',
    'login.password': 'パスワード',
    'login.submit': 'ログイン',
    'login.noAccount': 'アカウントをお持ちでないですか？',
    'login.signUp': '新規登録',
    'login.or': 'または',
    'login.createAccount': 'アカウントを作成',

    // Home Page
    'body.heading.home': 'AG Electronics Pvt. Ltd. へようこそ',
    'body.description.home': 'ソフトウェアを中心とした信頼できるパートナー。',

    // About Page
    'body.heading.about': 'AG Electronics Pvt. Ltd. へようこそ',
    'body.description.about': '会社登録完了後に情報を追加する予定です。',

    // Authentication Methods
    'auth.google': 'Googleでログイン',
    'auth.googleSignup': 'Googleで登録',
    'auth.github': 'GitHubでログイン',
    'auth.githubSignup': 'GitHubで登録',
    'auth.facebook': 'Facebookでログイン',
    'auth.facebookSignup': 'Facebookで登録',
    'auth.yahoo': 'Yahooでログイン',
    'auth.yahooSignup': 'Yahooで登録',
    'auth.phone': '電話番号でログイン',
    'auth.phoneSignup': '電話番号で登録',
    'auth.guest': 'ゲストとして継続',
    'auth.guestSignup': 'ゲストとして継続',

    // Phone Authentication
    'phone.enterNumber': '電話番号を入力してください:',
    'phone.sendOtp': 'OTPを送信',
    'phone.enterCode': '送信された6桁のコードを入力してください:',
    'phone.verifyLogin': '認証してログイン',
    'phone.useNumber': '別の電話番号を使用',

    // Modals & Dialogs
    'modal.settings': '設定',
    'modal.phoneLogin': '電話番号ログイン',
    'modal.selectCategory': 'カテゴリを選択',

    // Settings Modal
    'settings.theme': 'テーマ設定',
    'settings.themeLight': 'ライト',
    'settings.themeDark': 'ダーク',
    'settings.viewMode': '表示モード',
    'settings.viewModeGrid': '🔲 グリッド',
    'settings.viewModeList': '☰ リスト',
    'settings.language': '言語',
    'settings.languageEn': '🇺🇸 English',
    'settings.languageUr': '🇵🇰 اردو',
    'settings.close': '設定を閉じる',
    'settings.display': '表示設定',
    'settings.showEmail': 'ヘッダーにメールアドレスを表示',

    // Product Page
    'product.noProducts': 'このカテゴリに製品はありません',
    'product.loadingProducts': '製品を読み込み中...',
    'product.wheelHint': '🖱️ マウスホイールまたは左クリックで回転 | 🖱️ 右クリックで全カテゴリ表示',
    'product.viewDetails': '詳細を見る',
    'product.price': '価格',
    'product.category': 'カテゴリ',
    'product.description': '説明',
    'product.report': '問題を報告',
    'product.reportReason': '通報の理由',
    'product.reportDetails': '詳細（任意）',
    'product.submitReport': '報告を送信',

    // Product Details Modal
    'details.name': '商品名',
    'details.price': '価格',
    'details.category': 'カテゴリ',
    'details.subcategory': 'サブカテゴリ',
    'details.brand': 'ブランド',
    'details.sku': 'SKU',
    'details.stock': '在庫',
    'details.stockUnlimited': '無制限',
    'details.stockUnits': '点',
    'details.rating': '評価',
    'details.description': '説明',
    'details.tags': 'タグ',
    'details.specs': '仕様',
    'details.edit': '✏️ 製品を編集',
    'details.visit': '🔗 製品ページを開く',
    'details.download': '📥 ダウンロード',

    // Contact Page
    'contact.getInTouch': 'お問い合わせ',
    'contact.sendMessage': 'メッセージを送信',
    'contact.name': 'お名前',
    'contact.email': 'メールアドレス',
    'contact.message': 'メッセージ',
    'contact.submitBtn': '送信する',
    'contact.phone': '+92-330-XXXXXXX',
    'contact.location': 'パキスタン、カラチ',
    'contact.emailAddr': 'ag.aliengamerz@gmail.com',

    // Buttons & Controls
    'btn.logout': 'ログアウト',
    'btn.submit': '送信',
    'btn.cancel': 'キャンセル',
    'btn.close': '閉じる',
    'btn.yes': 'はい',
    'btn.no': 'いいえ',

    // Common Messages
    'msg.loading': '読み込み中...',
    'msg.error': 'エラー',
    'msg.success': '成功',
    'msg.welcome': 'ようこそ',
    'msg.userId': 'ユーザーID',
    'msg.haveAccount': 'すでにアカウントをお持ちですか？',
    },
    zh: {
    // Navigation & Headers
    'nav.home': '首页',
    'nav.about': '关于我们',
    'nav.products': '产品',
    'nav.privacy': '隐私政策',
    'nav.contact': '联系我们',
    'nav.controlPanel': '控制面板',

    'head.contact': 'AG | 联系我们',
    'head.products': 'AG | 产品',
    'head.about': 'AG | 关于我们',
    'head.home': 'AG | 首页',

    // Login Page
    'head.welcome': '欢迎回来！',
    'login.email': '电子邮件',
    'login.password': '密码',
    'login.submit': '登录',
    'login.noAccount': '还没有账号？',
    'login.signUp': '注册',
    'login.or': '或',
    'login.createAccount': '创建账号',

    // Home Page
    'body.heading.home': '欢迎来到 AG Electronics Pvt. Ltd.',
    'body.description.home': '您在软件领域值得信赖的合作伙伴。',

    // About Page
    'body.heading.about': '欢迎来到 AG Electronics Pvt. Ltd.',
    'body.description.about': '公司注册完成后将在此添加相关信息。',

    // Authentication Methods
    'auth.google': '使用 Google 登录',
    'auth.googleSignup': '使用 Google 注册',
    'auth.github': '使用 GitHub 登录',
    'auth.githubSignup': '使用 GitHub 注册',
    'auth.facebook': '使用 Facebook 登录',
    'auth.facebookSignup': '使用 Facebook 注册',
    'auth.yahoo': '使用 Yahoo 登录',
    'auth.yahooSignup': '使用 Yahoo 注册',
    'auth.phone': '使用手机号登录',
    'auth.phoneSignup': '使用手机号注册',
    'auth.guest': '以访客身份继续',
    'auth.guestSignup': '以访客身份继续',

    // Phone Authentication
    'phone.enterNumber': '请输入您的手机号码：',
    'phone.sendOtp': '发送验证码',
    'phone.enterCode': '请输入发送至您手机的 6 位数验证码：',
    'phone.verifyLogin': '验证并登录',
    'phone.useNumber': '使用其他号码',

    // Modals & Dialogs
    'modal.settings': '设置',
    'modal.phoneLogin': '手机号登录',
    'modal.selectCategory': '选择分类',

    // Settings Modal
    'settings.theme': '主题设置',
    'settings.themeLight': '浅色',
    'settings.themeDark': '深色',
    'settings.viewMode': '视图模式',
    'settings.viewModeGrid': '🔲 网格',
    'settings.viewModeList': '☰ 列表',
    'settings.language': '语言',
    'settings.languageEn': '🇺🇸 English',
    'settings.languageUr': '🇵🇰 اردو',
    'settings.close': '关闭设置',
    'settings.display': '显示设置',
    'settings.showEmail': '在页眉中显示电子邮件',

    // Product Page
    'product.noProducts': '该分类下暂无产品',
    'product.loadingProducts': '正在加载产品...',
    'product.wheelHint': '🖱️ 鼠标滚轮或左键旋转 | 🖱️ 右键查看所有分类',
    'product.viewDetails': '查看详情',
    'product.price': '价格',
    'product.category': '分类',
    'product.description': '描述',
    'product.report': '举报产品',
    'product.reportReason': '举报原因',
    'product.reportDetails': '详细说明（可选）',
    'product.submitReport': '提交举报',

    // Product Details Modal
    'details.name': '名称',
    'details.price': '价格',
    'details.category': '分类',
    'details.subcategory': '子分类',
    'details.brand': '品牌',
    'details.sku': 'SKU 编码',
    'details.stock': '库存',
    'details.stockUnlimited': '无限制',
    'details.stockUnits': '件',
    'details.rating': '评分',
    'details.description': '描述',
    'details.tags': '标签',
    'details.specs': '规格参数',
    'details.edit': '✏️ 编辑产品',
    'details.visit': '🔗 访问产品页',
    'details.download': '📥 下载',

    // Contact Page
    'contact.getInTouch': '保持联系',
    'contact.sendMessage': '给我们留言',
    'contact.name': '姓名',
    'contact.email': '电子邮件',
    'contact.message': '留言内容',
    'contact.submitBtn': '发送留言',
    'contact.phone': '+92-330-XXXXXXX',
    'contact.location': '巴基斯坦，卡拉奇',
    'contact.emailAddr': 'ag.aliengamerz@gmail.com',

    // Buttons & Controls
    'btn.logout': '退出登录',
    'btn.submit': '提交',
    'btn.cancel': '取消',
    'btn.close': '关闭',
    'btn.yes': '是',
    'btn.no': '否',

    // Common Messages
    'msg.loading': '加载中...',
    'msg.error': '错误',
    'msg.success': '成功',
    'msg.welcome': '欢迎',
    'msg.userId': '用户 ID',
    'msg.haveAccount': '已有账号？',
    },
    pa: {
    // Navigation & Headers
    'nav.home': 'ہوم',
    'nav.about': 'ساڈے بارے',
    'nav.products': 'پروڈکٹس',
    'nav.privacy': 'پرائیویسی',
    'nav.contact': 'رابطہ کرو',
    'nav.controlPanel': 'کنٹرول پینل',

    'head.contact': 'AG | رابطہ کرو',
    'head.products': 'AG | پروڈکٹس',
    'head.about': 'AG | ساڈے بارے',
    'head.home': 'AG | ہوم',

    // Login Page
    'head.welcome': 'جی آیاں نوں!',
    'login.email': 'ای میل',
    'login.password': 'پاسورڈ',
    'login.submit': 'لاگ ان کرو',
    'login.noAccount': 'اکاؤنٹ نہیں ہے؟',
    'login.signUp': 'سائن اپ کرو',
    'login.or': 'یا',
    'login.createAccount': 'نواں اکاؤنٹ بناؤ',

    // Home Page
    'body.heading.home': 'AG Electronics Pvt. Ltd. وچ جی آیاں نوں',
    'body.description.home': 'خاص طور تے سافٹ ویئر وچ تہاڈا بااعتماد ساتھی۔',

    // About Page
    'body.heading.about': 'AG Electronics Pvt. Ltd. وچ جی آیاں نوں',
    'body.description.about': 'کمپنی رجسٹر ہون توں بعد معلومات ایتھے شامل کیتی جائے گی۔',

    // Authentication Methods
    'auth.google': 'گوگل نال لاگ ان کرو',
    'auth.googleSignup': 'گوگل نال سائن اپ کرو',
    'auth.github': 'گٹ ہب نال لاگ ان کرو',
    'auth.githubSignup': 'گٹ ہب نال سائن اپ کرو',
    'auth.facebook': 'فیس بک نال لاگ ان کرو',
    'auth.facebookSignup': 'فیس بک نال سائن اپ کرو',
    'auth.yahoo': 'یاہو نال لاگ ان کرو',
    'auth.yahooSignup': 'یاہو نال سائن اپ کرو',
    'auth.phone': 'فون نمبر نال لاگ ان کرو',
    'auth.phoneSignup': 'فون نمبر نال سائن اپ کرو',
    'auth.guest': 'مہمان ਵਜੋਂ آگے ودھو',
    'auth.guestSignup': 'مہمان ਵਜੋਂ آگے ودھو',

    // Phone Authentication
    'phone.enterNumber': 'اپنا فون نمبر لکھو:',
    'phone.sendOtp': 'OTP بھیجو',
    'phone.enterCode': 'فون تے آیا 6 ہندسیاں دا کوڈ درج کرو:',
    'phone.verifyLogin': 'تصدق کرو تے لاگ ان کرو',
    'phone.useNumber': 'ہور نمبر استعمال کرو',

    // Modals & Dialogs
    'modal.settings': 'سیٹنگز',
    'modal.phoneLogin': 'فون نمبر لاگ ان',
    'modal.selectCategory': 'کیٹیگری چنو',

    // Settings Modal
    'settings.theme': 'تھیم سیٹنگز',
    'settings.themeLight': 'لائٹ',
    'settings.themeDark': 'ڈارک',
    'settings.viewMode': 'ویکھن دا طریقہ',
    'settings.viewModeGrid': '🔲 گرڈ',
    'settings.viewModeList': '☰ لسٹ',
    'settings.language': 'زبان',
    'settings.languageEn': '🇺🇸 English',
    'settings.languageUr': '🇵🇰 اردو',
    'settings.close': 'سیٹنگز بند کرو',
    'settings.display': 'ڈسپلے سیٹنگز',
    'settings.showEmail': 'ہیڈر وچ ای میل دکھاؤ',

    // Product Page
    'product.noProducts': 'ایس کیٹیگری وچ کوئی پروڈکٹ نہیں',
    'product.loadingProducts': 'پروڈکٹس لوڈ ہو رہیاں نے...',
    'product.wheelHint': '🖱️️ گھماؤن لئی ماؤس ویل یا لیفٹ کلک | 🖱️ ساری کیٹیگریز لئی رائٹ کلک',
    'product.viewDetails': 'تفصیلات ویکھو',
    'product.price': 'قیمت',
    'product.category': 'کیٹیگری',
    'product.description': 'تفصیل',
    'product.report': 'رپورٹ کرو',
    'product.reportReason': 'رپورٹ دی وجہ',
    'product.reportDetails': 'تفصیل (اختياری)',
    'product.submitReport': 'رپورٹ جمع کرو',

    // Product Details Modal
    'details.name': 'ناں',
    'details.price': 'قیمت',
    'details.category': 'کیٹیگری',
    'details.subcategory': 'ذیلی کیٹیگری',
    'details.brand': 'برانڈ',
    'details.sku': 'SKU',
    'details.stock': 'سٹاک',
    'details.stockUnlimited': 'ان گنت',
    'details.stockUnits': 'نقص',
    'details.rating': 'ریٹنگ',
    'details.description': 'تفصیل',
    'details.tags': 'ٹیگز',
    'details.specs': 'خصوصیات',
    'details.edit': '✏️ پروڈکٹ ایڈٹ کرو',
    'details.visit': '🔗 پروڈکٹ لنِک ویکھو',
    'details.download': '📥 ڈاؤن لوڈ',

    // Contact Page
    'contact.getInTouch': 'رابطے وچ رہو',
    'contact.sendMessage': 'سانوں میسج بھیجو',
    'contact.name': 'ناں',
    'contact.email': 'ای میل',
    'contact.message': 'میسج',
    'contact.submitBtn': 'میسج بھیجو',
    'contact.phone': '+92-330-XXXXXXX',
    'contact.location': 'کراچی، پاکستان',
    'contact.emailAddr': 'ag.aliengamerz@gmail.com',

    // Buttons & Controls
    'btn.logout': 'لاگ آؤٹ',
    'btn.submit': 'جمع کرو',
    'btn.cancel': 'منسوخ',
    'btn.close': 'بند کرو',
    'btn.yes': 'ہاں',
    'btn.no': 'نہِیں',

    // Common Messages
    'msg.loading': 'لوڈنگ ہو رہی اے...',
    'msg.error': 'خرابی',
    'msg.success': 'کامیابی',
    'msg.welcome': 'جی آیاں نوں',
    'msg.userId': 'یوزر ID',
    'msg.haveAccount': 'پہلاں ہی اکاؤنٹ ہے؟',
    },
    ps: {
    // Navigation & Headers
    'nav.home': 'کور',
    'nav.about': 'زموږ په اړه',
    'nav.products': 'محصولات',
    'nav.privacy': 'محرمیت',
    'nav.contact': 'اریکه',
    'nav.controlPanel': 'د کنټرول پینل',

    'head.contact': 'AG | اریکه',
    'head.products': 'AG | محصولات',
    'head.about': 'AG | زموږ په اړه',
    'head.home': 'AG | کور',

    // Login Page
    'head.welcome': 'بېرته ښه راغلاست!',
    'login.email': 'برېښنالیک',
    'login.password': 'پټنوم',
    'login.submit': 'ننوتل',
    'login.noAccount': 'حساب نه لرئ؟',
    'login.signUp': 'نوم لیکنه',
    'login.or': 'یا',
    'login.createAccount': 'حساب جوړ کړئ',

    // Home Page
    'body.heading.home': 'AG Electronics Pvt. Ltd. ته ښه راغلاست',
    'body.description.home': 'په نرم افزار (سافټویر) کې ستاسو د باور وړ ملګری.',

    // About Page
    'body.heading.about': 'AG Electronics Pvt. Ltd. ته ښه راغلاست',
    'body.description.about': 'د دغې کمپنۍ له ثبتېدو وروسته به دلته معلومات اضافه شي',

    // Authentication Methods
    'auth.google': 'د ګوګل له لارې ننوتل',
    'auth.googleSignup': 'د ګوګل له لارې نوم لیکنه',
    'auth.github': 'د ګېټ هب له لارې ننوتل',
    'auth.githubSignup': 'د ګېټ هب له لارې نوم لیکنه',
    'auth.facebook': 'د فېسبوک له لارې ننوتل',
    'auth.facebookSignup': 'د فېسبوک له لارې نوم لیکنه',
    'auth.yahoo': 'د یاهو له لارې ننوتل',
    'auth.yahooSignup': 'د یاهو له لارې نوم لیکنه',
    'auth.phone': 'د تلیفون شمیرې له لارې ننوتل',
    'auth.phoneSignup': 'د تلیفون شمیرې له لارې نوم لیکنه',
    'auth.guest': 'د مېلمه په توګه دوام ورکړئ',
    'auth.guestSignup': 'د مېلمه په توګه دوام ورکړئ',

    // Phone Authentication
    'phone.enterNumber': 'پخپله د تلیفون شمیره ولیکئ:',
    'phone.sendOtp': 'OTP واستوئ',
    'phone.enterCode': 'ستاسو تلیفون ته استول شوی ۶ عددي کوډ ولیکئ:',
    'phone.verifyLogin': 'تایید او ننوتل',
    'phone.useNumber': 'بله شمیره وکاروئ',

    // Modals & Dialogs
    'modal.settings': 'تعدیلات (سټینګز)',
    'modal.phoneLogin': 'د تلیفون شمیرې له لارې ننوتل',
    'modal.selectCategory': 'کټګوري وټاکئ',

    // Settings Modal
    'settings.theme': 'د بڼې امستنې',
    'settings.themeLight': 'روښانه',
    'settings.themeDark': 'تياره',
    'settings.viewMode': 'د لیدلو بڼه',
    'settings.viewModeGrid': '🔲 جالۍ (ګرډ)',
    'settings.viewModeList': '☰ لړلیک (لیست)',
    'settings.language': 'ژبه',
    'settings.languageEn': '🇺🇸 English',
    'settings.languageUr': '🇵🇰 اردو',
    'settings.close': 'امستنې بندې کړئ',
    'settings.display': 'د ښودلو امستنې',
    'settings.showEmail': 'په هېډر کې برېښنالیک وښایئ',

    // Product Page
    'product.noProducts': 'په دې کټګورۍ کې هیڅ محصول نشته',
    'product.loadingProducts': 'محصولات بارېږي...',
    'product.wheelHint': '🖱️ د څرخولو لپاره ماؤس ویل یا چپ کلېک | 🖱️ د ټولو کټګوریو لپاره ښي کلېک',
    'product.viewDetails': 'تفصیلات وګورئ',
    'product.price': 'بیع (قیمت)',
    'product.category': 'کټګوري',
    'product.description': 'تشریح',
    'product.report': 'د محصول راپور ورکړئ',
    'product.reportReason': 'د راپور د ورکولو لامل',
    'product.reportDetails': 'تفصیل (اختیاري)',
    'product.submitReport': 'راپور واستوئ',

    // Product Details Modal
    'details.name': 'نوم',
    'details.price': 'قیمت',
    'details.category': 'کټګوري',
    'details.subcategory': 'فرعي کټګوري',
    'details.brand': 'برانډ',
    'details.sku': 'SKU',
    'details.stock': 'ذخیره (اسټاک)',
    'details.stockUnlimited': 'لامحدود',
    'details.stockUnits': 'واحدونه',
    'details.rating': 'درجه بندي',
    'details.description': 'تشریح',
    'details.tags': 'ټاګونه',
    'details.specs': 'مشخصات',
    'details.edit': '✏️ محصول سم کړئ',
    'details.visit': '🔗 د محصول پاڼه وګورئ',
    'details.download': '📥 ښکته کول (ډاونلوډ)',

    // Contact Page
    'contact.getInTouch': 'په اړیکه کې شئ',
    'contact.sendMessage': 'موږ ته پیغام واستوئ',
    'contact.name': 'نوم',
    'contact.email': 'برېښنالیک',
    'contact.message': 'پیغام',
    'contact.submitBtn': 'پیغام واستوئ',
    'contact.phone': '+92-330-XXXXXXX',
    'contact.location': 'کراچۍ، پاکستان',
    'contact.emailAddr': 'ag.aliengamerz@gmail.com',

    // Buttons & Controls
    'btn.logout': 'وتل',
    'btn.submit': 'لیږل',
    'btn.cancel': 'منسوخ کول',
    'btn.close': 'بندول',
    'btn.yes': 'هو',
    'btn.no': 'نه',

    // Common Messages
    'msg.loading': 'بارېږي...',
    'msg.error': 'تېروتنه',
    'msg.success': 'بریالیتوب',
    'msg.welcome': 'ښه راغلاست',
    'msg.userId': 'د کاروونکي آی ډي',
    'msg.haveAccount': 'مخکې له مخکې حساب لرئ؟',
    },
    bal: {
    // Navigation & Headers
    'nav.home': 'لوگ',
    'nav.about': 'می بارئا',
    'nav.products': 'جنس / چيزاں',
    'nav.privacy': 'رازدارئی',
    'nav.contact': 'باهند / رابطگ',
    'nav.controlPanel': 'کنٹرول پینل',

    'head.contact': 'AG | رابطگ',
    'head.products': 'AG | جنس / چيزاں',
    'head.about': 'AG | می بارئا',
    'head.home': 'AG | لوگ',

    // Login Page
    'head.welcome': 'وش آتکے!',
    'login.email': 'ای میل',
    'login.password': 'پاسورڈ',
    'login.submit': 'داخل بیگ (لاگ ان)',
    'login.noAccount': 'اکاؤنٹ نیست انت؟',
    'login.signUp': 'سائن اپ بکن',
    'login.or': 'یا',
    'login.createAccount': 'نوکیں اکاؤنٹ جوڑ بکن',

    // Home Page
    'body.heading.home': 'AG Electronics Pvt. Ltd. ئا وش آتکے',
    'body.description.home': 'گیشتر سافٹ ویئر ئِ تہئ می سرپدیں ملگاری۔',

    // About Page
    'body.heading.about': 'AG Electronics Pvt. Ltd. ئا وش آتکے',
    'body.description.about': 'کمپنی ئِ رجسٹریشنا پد ادان معلومات مان کنگ بیت',

    // Authentication Methods
    'auth.google': 'گوگل ئِ برکت ئا لاگ ان بکن',
    'auth.googleSignup': 'گوگل ئِ برکت ئا سائن اپ بکن',
    'auth.github': 'گٹ ہب ئِ برکت ئا لاگ ان بکن',
    'auth.githubSignup': 'گٹ ہب ئِ برکت ئا سائن اپ بکن',
    'auth.facebook': 'فیس بک ئِ برکت ئا لاگ ان بکن',
    'auth.facebookSignup': 'فیس بک ئِ برکت ئا سائن اپ بکن',
    'auth.yahoo': 'یاہو ئِ برکت ئا لاگ ان بکن',
    'auth.yahooSignup': 'یاہو ئِ برکت ئا سائن اپ بکن',
    'auth.phone': 'فون نمبر ئِ سرا لاگ ان بکن',
    'auth.phoneSignup': 'فون نمبر ئِ سرا سائن اپ بکن',
    'auth.guest': 'مہمان ئِ رنگا دیمئا برو',
    'auth.guestSignup': 'مہمان ئِ رنگا دیمئا برو',

    // Phone Authentication
    'phone.enterNumber': 'وتی فون نمبرئا نبشتہ بکن:',
    'phone.sendOtp': 'OTP راہ دئے',
    'phone.enterCode': 'تئی فونئا آتگیں 6 ہندسگی کوڈا داخل بکن:',
    'phone.verifyLogin': 'تصدق بکن ءُ لاگ ان بکن',
    'phone.useNumber': 'دگہ نمبر کارمرز بکن',

    // Modals & Dialogs
    'modal.settings': 'سیٹنگز',
    'modal.phoneLogin': 'فون نمبر ئِ سرا لاگ ان',
    'modal.selectCategory': 'کیٹیگری گچین بکن',

    // Settings Modal
    'settings.theme': 'تھیم سیٹنگز',
    'settings.themeLight': 'روک',
    'settings.themeDark': 'تہار',
    'settings.viewMode': 'گندگ ئِ وڑ',
    'settings.viewModeGrid': '🔲 گرڈ',
    'settings.viewModeList': '☰ لسٹ',
    'settings.language': 'زبان',
    'settings.languageEn': '🇺🇸 English',
    'settings.languageUr': '🇵🇰 اردو',
    'settings.close': 'سیٹنگزا بند بکن',
    'settings.display': 'ڈسپلے سیٹنگز',
    'settings.showEmail': 'ہیڈر ئِ تہئ ای میل پیش بکن',

    // Product Page
    'product.noProducts': 'اے کیٹیگری ئِ تہئ ہچ چیز نیست',
    'product.loadingProducts': 'چیزاں لوڈ بوان انت...',
    'product.wheelHint': '🖱️ ترینگ ئِ واستہ ماؤس ویل یا چپ کلک | 🖱️ ڈائریکٹ دراہیں کیٹیگریز لئی راست کلک',
    'product.viewDetails': 'تفصیلات بچار',
    'product.price': 'قیمت',
    'product.category': 'کیٹیگری',
    'product.description': 'تفصیل',
    'product.report': 'رپورٹ بکن',
    'product.reportReason': 'رپورٹ ئِ سبب',
    'product.reportDetails': 'تفصیل (واستہ دل)',
    'product.submitReport': 'رپورٹ دیمئا راہ دئے',

    // Product Details Modal
    'details.name': 'نام',
    'details.price': 'قیمت',
    'details.category': 'کیٹیگری',
    'details.subcategory': 'ذیلی کیٹیگری',
    'details.brand': 'برانڈ',
    'details.sku': 'SKU',
    'details.stock': 'سٹاک',
    'details.stockUnlimited': 'بے کچ / بے مٹ',
    'details.stockUnits': 'عدد / دانگ',
    'details.rating': 'ریٹنگ',
    'details.description': 'تفصیل',
    'details.tags': 'ٹیگز',
    'details.specs': 'بنیادی گپ / خصوصیات',
    'details.edit': '✏️ چیزا ایڈٹ بکن',
    'details.visit': '🔗 ویب سائٹ بچار',
    'details.download': '📥 ڈاؤن لوڈ',

    // Contact Page
    'contact.getInTouch': 'می گوما رابطہ بکن',
    'contact.sendMessage': 'مارا کلوہ (میسج) راہ دئے',
    'contact.name': 'نام',
    'contact.email': 'ای میل',
    'contact.message': 'کلوہ / میسج',
    'contact.submitBtn': 'کلوہ راہ دئے',
    'contact.phone': '+92-330-XXXXXXX',
    'contact.location': 'کراچی، پاکستان',
    'contact.emailAddr': 'ag.aliengamerz@gmail.com',

    // Buttons & Controls
    'btn.logout': 'در کپگ (لاگ آؤٹ)',
    'btn.submit': 'جمع بکن',
    'btn.cancel': 'منسوخ',
    'btn.close': 'بند بکن',
    'btn.yes': 'جی / ئو',
    'btn.no': 'انّا / نہ',

    // Common Messages
    'msg.loading': 'لوڈ بوان انت...',
    'msg.error': 'خرابی',
    'msg.success': 'کامیابی',
    'msg.welcome': 'وش آتکے',
    'msg.userId': 'کارمرزکنوک آی ڈی',
    'msg.haveAccount': 'پیشئیا اکاؤنٹ ہست انت؟',
    },
    fr: {
    // Navigation & Headers
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.products': 'Produits',
    'nav.privacy': 'Confidentialité',
    'nav.contact': 'Contactez-nous',
    'nav.controlPanel': 'Panneau de configuration',

    'head.contact': 'AG | Contactez-nous',
    'head.products': 'AG | Produits',
    'head.about': 'AG | À propos',
    'head.home': 'AG | Accueil',

    // Login Page
    'head.welcome': 'Bon retour !',
    'login.email': 'E-mail',
    'login.password': 'Mot de passe',
    'login.submit': 'Se connecter',
    'login.noAccount': 'Vous n\'avez pas de compte ?',
    'login.signUp': 'S\'inscrire',
    'login.or': 'ou',
    'login.createAccount': 'Créer un compte',

    // Home Page
    'body.heading.home': 'Bienvenue chez AG Electronics Pvt. Ltd.',
    'body.description.home': 'Votre partenaire de confiance, principalement dans les logiciels.',

    // About Page
    'body.heading.about': 'Bienvenue chez AG Electronics Pvt. Ltd.',
    'body.description.about': 'Les informations seront ajoutées une fois l\'entreprise enregistrée.',

    // Authentication Methods
    'auth.google': 'Se connecter avec Google',
    'auth.googleSignup': 'S\'inscrire avec Google',
    'auth.github': 'Se connecter avec GitHub',
    'auth.githubSignup': 'S\'inscrire avec GitHub',
    'auth.facebook': 'Se connecter avec Facebook',
    'auth.facebookSignup': 'S\'inscrire avec Facebook',
    'auth.yahoo': 'Se connecter avec Yahoo',
    'auth.yahooSignup': 'S\'inscrire avec Yahoo',
    'auth.phone': 'Se connecter avec un numéro de téléphone',
    'auth.phoneSignup': 'S\'inscrire avec un numéro de téléphone',
    'auth.guest': 'Continuer en tant qu\'invité',
    'auth.guestSignup': 'Continuer en tant qu\'invité',

    // Phone Authentication
    'phone.enterNumber': 'Entrez votre numéro de téléphone :',
    'phone.sendOtp': 'Envoyer le code OTP',
    'phone.enterCode': 'Entrez le code à 6 chiffres envoyé sur votre téléphone :',
    'phone.verifyLogin': 'Vérifier et se connecter',
    'phone.useNumber': 'Utiliser un autre numéro',

    // Modals & Dialogs
    'modal.settings': 'Paramètres',
    'modal.phoneLogin': 'Connexion par téléphone',
    'modal.selectCategory': 'Sélectionner une catégorie',

    // Settings Modal
    'settings.theme': 'Paramètres du thème',
    'settings.themeLight': 'Clair',
    'settings.themeDark': 'Sombre',
    'settings.viewMode': 'Mode d\'affichage',
    'settings.viewModeGrid': '🔲 Grille',
    'settings.viewModeList': '☰ Liste',
    'settings.language': 'Langue',
    'settings.languageEn': '🇺🇸 English',
    'settings.languageUr': '🇵🇰 اردو',
    'settings.close': 'Fermer les paramètres',
    'settings.display': 'Paramètres d\'affichage',
    'settings.showEmail': 'Afficher l\'e-mail dans l\'en-tête',

    // Product Page
    'product.noProducts': 'Aucun produit dans cette catégorie',
    'product.loadingProducts': 'Chargement des produits...',
    'product.wheelHint': '🖱️ Molette ou clic gauche pour faire pivoter | 🖱️ Clic droit pour toutes les catégories',
    'product.viewDetails': 'Voir les détails',
    'product.price': 'Prix',
    'product.category': 'Catégorie',
    'product.description': 'Description',
    'product.report': 'Signaler le produit',
    'product.reportReason': 'Raison du signalement',
    'product.reportDetails': 'Détails (facultatif)',
    'product.submitReport': 'Soumettre le signalement',

    // Product Details Modal
    'details.name': 'Nom',
    'details.price': 'Prix',
    'details.category': 'Catégorie',
    'details.subcategory': 'Sous-catégorie',
    'details.brand': 'Marque',
    'details.sku': 'SKU',
    'details.stock': 'Stock',
    'details.stockUnlimited': 'Illimité',
    'details.stockUnits': 'unités',
    'details.rating': 'Évaluation',
    'details.description': 'Description',
    'details.tags': 'Étiquettes',
    'details.specs': 'Spécifications',
    'details.edit': '✏️ Modifier le produit',
    'details.visit': '🔗 Visiter le produit',
    'details.download': '📥 Télécharger',

    // Contact Page
    'contact.getInTouch': 'Entrer en contact',
    'contact.sendMessage': 'Envoyez-nous un message',
    'contact.name': 'Nom',
    'contact.email': 'E-mail',
    'contact.message': 'Message',
    'contact.submitBtn': 'Envoyer le message',
    'contact.phone': '+92-330-XXXXXXX',
    'contact.location': 'Karachi, Pakistan',
    'contact.emailAddr': 'ag.aliengamerz@gmail.com',

    // Buttons & Controls
    'btn.logout': 'Déconnexion',
    'btn.submit': 'Soumettre',
    'btn.cancel': 'Annuler',
    'btn.close': 'Fermer',
    'btn.yes': 'Oui',
    'btn.no': 'Non',

    // Common Messages
    'msg.loading': 'Chargement...',
    'msg.error': 'Erreur',
    'msg.success': 'Succès',
    'msg.welcome': 'Bienvenue',
    'msg.userId': 'ID Utilisateur',
    'msg.haveAccount': 'Vous avez déjà un compte ?',
    },
    es: {
    // Navigation & Headers
    'nav.home': 'Inicio',
    'nav.about': 'Sobre nosotros',
    'nav.products': 'Productos',
    'nav.privacy': 'Privacidad',
    'nav.contact': 'Contacto',
    'nav.controlPanel': 'Panel de control',

    'head.contact': 'AG | Contacto',
    'head.products': 'AG | Productos',
    'head.about': 'AG | Sobre nosotros',
    'head.home': 'AG | Inicio',

    // Login Page
    'head.welcome': '¡Bienvenido de nuevo!',
    'login.email': 'Correo electrónico',
    'login.password': 'Contraseña',
    'login.submit': 'Iniciar sesión',
    'login.noAccount': '¿No tienes una cuenta?',
    'login.signUp': 'Registrarse',
    'login.or': 'o',
    'login.createAccount': 'Crear cuenta',

    // Home Page
    'body.heading.home': 'Bienvenido a AG Electronics Pvt. Ltd.',
    'body.description.home': 'Su socio de confianza principalmente en software.',

    // About Page
    'body.heading.about': 'Bienvenido a AG Electronics Pvt. Ltd.',
    'body.description.about': 'La información se agregará una vez que la empresa esté registrada.',

    // Authentication Methods
    'auth.google': 'Iniciar sesión con Google',
    'auth.googleSignup': 'Registrarse con Google',
    'auth.github': 'Iniciar sesión con GitHub',
    'auth.githubSignup': 'Registrarse con GitHub',
    'auth.facebook': 'Iniciar sesión con Facebook',
    'auth.facebookSignup': 'Registrarse con Facebook',
    'auth.yahoo': 'Iniciar sesión con Yahoo',
    'auth.yahooSignup': 'Registrarse con Yahoo',
    'auth.phone': 'Iniciar sesión con teléfono',
    'auth.phoneSignup': 'Registrarse con teléfono',
    'auth.guest': 'Continuar como invitado',
    'auth.guestSignup': 'Continuar como invitado',

    // Phone Authentication
    'phone.enterNumber': 'Ingrese su número de teléfono:',
    'phone.sendOtp': 'Enviar OTP',
    'phone.enterCode': 'Ingrese el código de 6 dígitos enviado a su teléfono:',
    'phone.verifyLogin': 'Verificar e iniciar sesión',
    'phone.useNumber': 'Usar un número diferente',

    // Modals & Dialogs
    'modal.settings': 'Configuración',
    'modal.phoneLogin': 'Inicio de sesión con número de teléfono',
    'modal.selectCategory': 'Seleccionar categoría',

    // Settings Modal
    'settings.theme': 'Configuración del tema',
    'settings.themeLight': 'Claro',
    'settings.themeDark': 'Oscuro',
    'settings.viewMode': 'Modo de vista',
    'settings.viewModeGrid': '🔲 Cuadrícula',
    'settings.viewModeList': '☰ Lista',
    'settings.language': 'Idioma',
    'settings.languageEn': '🇺🇸 English',
    'settings.languageUr': '🇵🇰 اردو',
    'settings.close': 'Cerrar configuración',
    'settings.display': 'Configuración de pantalla',
    'settings.showEmail': 'Mostrar correo electrónico en el encabezado',

    // Product Page
    'product.noProducts': 'No hay productos en esta categoría',
    'product.loadingProducts': 'Cargando productos...',
    'product.wheelHint': '🖱️ Rueda del ratón o clic izquierdo para girar | 🖱️ Clic derecho para todas las categorías',
    'product.viewDetails': 'Ver detalles',
    'product.price': 'Precio',
    'product.category': 'Categoría',
    'product.description': 'Descripción',
    'product.report': 'Reportar producto',
    'product.reportReason': 'Motivo del reporte',
    'product.reportDetails': 'Detalles (opcional)',
    'product.submitReport': 'Enviar reporte',

    // Product Details Modal
    'details.name': 'Nombre',
    'details.price': 'Precio',
    'details.category': 'Categoría',
    'details.subcategory': 'Subcategoría',
    'details.brand': 'Marca',
    'details.sku': 'SKU',
    'details.stock': 'Stock',
    'details.stockUnlimited': 'Ilimitado',
    'details.stockUnits': 'unidades',
    'details.rating': 'Calificación',
    'details.description': 'Descripción',
    'details.tags': 'Etiquetas',
    'details.specs': 'Especificaciones',
    'details.edit': '✏️ Editar producto',
    'details.visit': '🔗 Visitar producto',
    'details.download': '📥 Descargar',

    // Contact Page
    'contact.getInTouch': 'Ponte en contacto',
    'contact.sendMessage': 'Envíanos un mensaje',
    'contact.name': 'Nombre',
    'contact.email': 'Correo electrónico',
    'contact.message': 'Mensaje',
    'contact.submitBtn': 'Enviar mensaje',
    'contact.phone': '+92-330-XXXXXXX',
    'contact.location': 'Karachi, Pakistán',
    'contact.emailAddr': 'ag.aliengamerz@gmail.com',

    // Buttons & Controls
    'btn.logout': 'Cerrar sesión',
    'btn.submit': 'Enviar',
    'btn.cancel': 'Cancelar',
    'btn.close': 'Cerrar',
    'btn.yes': 'Sí',
    'btn.no': 'No',

    // Common Messages
    'msg.loading': 'Cargando...',
    'msg.error': 'Error',
    'msg.success': 'Éxito',
    'msg.welcome': 'Bienvenido',
    'msg.userId': 'ID de usuario',
    'msg.haveAccount': '¿Ya tienes una cuenta?',
    },
    de: {
    // Navigation & Headers
    'nav.home': 'Startseite',
    'nav.about': 'Über uns',
    'nav.products': 'Produkte',
    'nav.privacy': 'Datenschutz',
    'nav.contact': 'Kontakt',
    'nav.controlPanel': 'Systemsteuerung',

    'head.contact': 'AG | Kontakt',
    'head.products': 'AG | Produkte',
    'head.about': 'AG | Über uns',
    'head.home': 'AG | Startseite',

    // Login Page
    'head.welcome': 'Willkommen zurück!',
    'login.email': 'E-Mail',
    'login.password': 'Passwort',
    'login.submit': 'Anmelden',
    'login.noAccount': 'Noch kein Konto?',
    'login.signUp': 'Registrieren',
    'login.or': 'oder',
    'login.createAccount': 'Konto erstellen',

    // Home Page
    'body.heading.home': 'Willkommen bei AG Electronics Pvt. Ltd.',
    'body.description.home': 'Ihr vertrauenswürdiger Partner, hauptsächlich für Software.',

    // About Page
    'body.heading.about': 'Willkommen bei AG Electronics Pvt. Ltd.',
    'body.description.about': 'Informationen werden nach der Registrierung des Unternehmens hinzugefügt.',

    // Authentication Methods
    'auth.google': 'Mit Google anmelden',
    'auth.googleSignup': 'Mit Google registrieren',
    'auth.github': 'Mit GitHub anmelden',
    'auth.githubSignup': 'Mit GitHub registrieren',
    'auth.facebook': 'Mit Facebook anmelden',
    'auth.facebookSignup': 'Mit Facebook registrieren',
    'auth.yahoo': 'Mit Yahoo anmelden',
    'auth.yahooSignup': 'Mit Yahoo registrieren',
    'auth.phone': 'Mit Telefonnummer anmelden',
    'auth.phoneSignup': 'Mit Telefonnummer registrieren',
    'auth.guest': 'Als Gast fortfahren',
    'auth.guestSignup': 'Als Gast fortfahren',

    // Phone Authentication
    'phone.enterNumber': 'Geben Sie Ihre Telefonnummer ein:',
    'phone.sendOtp': 'OTP senden',
    'phone.enterCode': 'Geben Sie den 6-stelligen Code ein, der an Ihr Telefon gesendet wurde:',
    'phone.verifyLogin': 'Bestätigen & Anmelden',
    'phone.useNumber': 'Andere Nummer verwenden',

    // Modals & Dialogs
    'modal.settings': 'Einstellungen',
    'modal.phoneLogin': 'Anmeldung mit Telefonnummer',
    'modal.selectCategory': 'Kategorie auswählen',

    // Settings Modal
    'settings.theme': 'Design-Einstellungen',
    'settings.themeLight': 'Hell',
    'settings.themeDark': 'Dunkel',
    'settings.viewMode': 'Ansichtsmodus',
    'settings.viewModeGrid': '🔲 Raster',
    'settings.viewModeList': '☰ Liste',
    'settings.language': 'Sprache',
    'settings.languageEn': '🇺🇸 English',
    'settings.languageUr': '🇵🇰 اردو',
    'settings.close': 'Einstellungen schließen',
    'settings.display': 'Anzeigeeinstellungen',
    'settings.showEmail': 'E-Mail im Header anzeigen',

    // Product Page
    'product.noProducts': 'Keine Produkte in dieser Kategorie',
    'product.loadingProducts': 'Produkte werden geladen...',
    'product.wheelHint': '🖱️ Mausrad oder Linksklick zum Drehen | 🖱️ Rechtsklick für alle Kategorien',
    'product.viewDetails': 'Details anzeigen',
    'product.price': 'Preis',
    'product.category': 'Kategorie',
    'product.description': 'Beschreibung',
    'product.report': 'Produkt melden',
    'product.reportReason': 'Grund für die Meldung',
    'product.reportDetails': 'Details (optional)',
    'product.submitReport': 'Meldung absenden',

    // Product Details Modal
    'details.name': 'Name',
    'details.price': 'Preis',
    'details.category': 'Kategorie',
    'details.subcategory': 'Unterkategorie',
    'details.brand': 'Marke',
    'details.sku': 'SKU',
    'details.stock': 'Lagerbestand',
    'details.stockUnlimited': 'Unbegrenzt',
    'details.stockUnits': 'Stück',
    'details.rating': 'Bewertung',
    'details.description': 'Beschreibung',
    'details.tags': 'Tags',
    'details.specs': 'Spezifikationen',
    'details.edit': '✏️ Produkt bearbeiten',
    'details.visit': '🔗 Produkt besuchen',
    'details.download': '📥 Herunterladen',

    // Contact Page
    'contact.getInTouch': 'Kontakt aufnehmen',
    'contact.sendMessage': 'Senden Sie uns eine Nachricht',
    'contact.name': 'Name',
    'contact.email': 'E-Mail',
    'contact.message': 'Nachricht',
    'contact.submitBtn': 'Nachricht senden',
    'contact.phone': '+92-330-XXXXXXX',
    'contact.location': 'Karatschi, Pakistan',
    'contact.emailAddr': 'ag.aliengamerz@gmail.com',

    // Buttons & Controls
    'btn.logout': 'Abmelden',
    'btn.submit': 'Absenden',
    'btn.cancel': 'Abbrechen',
    'btn.close': 'Schließen',
    'btn.yes': 'Ja',
    'btn.no': 'Nein',

    // Common Messages
    'msg.loading': 'Laden...',
    'msg.error': 'Fehler',
    'msg.success': 'Erfolg',
    'msg.welcome': 'Willkommen',
    'msg.userId': 'Benutzer-ID',
    'msg.haveAccount': 'Haben Sie bereits ein Konto?',
    },
    sd: {
    // Navigation & Headers
    'nav.home': 'هوم',
    'nav.about': 'اسان بابت',
    'nav.products': 'پراڊڪٽس',
    'nav.privacy': 'رازداري',
    'nav.contact': 'رابطو ڪريو',
    'nav.controlPanel': 'ڪنٽرول پينل',

    'head.contact': 'AG | رابطو ڪريو',
    'head.products': 'AG | پراڊڪٽس',
    'head.about': 'AG | اسان بابت',
    'head.home': 'AG | هوم',

    // Login Page
    'head.welcome': 'ڀليڪار!',
    'login.email': 'اي ميل',
    'login.password': 'پاسورڊ',
    'login.submit': 'لاگ ان ٿيو',
    'login.noAccount': 'اڪائونٽ ناهي؟',
    'login.signUp': 'سائين اپ',
    'login.or': 'يا',
    'login.createAccount': 'نئون اڪائونٽ ٺاهيو',

    // Home Page
    'body.heading.home': 'AG Electronics Pvt. Ltd. ۾ ڀليڪار',
    'body.description.home': 'خاص طور تي سافٽ ويئر ۾ توهان جو قابل اعتماد ساٿي.',

    // About Page
    'body.heading.about': 'AG Electronics Pvt. Ltd. ۾ ڀليڪار',
    'body.description.about': 'کمپني رجسٽر ٿيڻ کان پوءِ معلومات هتي شامل ڪئي ويندي.',

    // Authentication Methods
    'auth.google': 'گوگل ذريعي لاگ ان',
    'auth.googleSignup': 'گوگل ذريعي سائين اپ',
    'auth.github': 'گٽ هب ذريعي لاگ ان',
    'auth.githubSignup': 'گٽ هب ذريعي سائين اپ',
    'auth.facebook': 'فيس بوڪ ذريعي لاگ ان',
    'auth.facebookSignup': 'فيس بوڪ ذريعي سائين اپ',
    'auth.yahoo': 'ياهو ذريعي لاگ ان',
    'auth.yahooSignup': 'ياهو ذريعي سائين اپ',
    'auth.phone': 'فون نمبر ذريعي لاگ ان',
    'auth.phoneSignup': 'فون نمبر ذريعي سائين اپ',
    'auth.guest': 'مهمان طور جاري رکو',
    'auth.guestSignup': 'مهمان طور جاري رکو',

    // Phone Authentication
    'phone.enterNumber': 'پنهنجو فون نمبر درخاست ڪريو:',
    'phone.sendOtp': 'OTP موڪليو',
    'phone.enterCode': 'فون تي موڪليل 6 انگن وارو ڪوڊ داخل ڪريو:',
    'phone.verifyLogin': 'تصديق ڪريو ۽ لاگ ان ٿيو',
    'phone.useNumber': 'ٻيو نمبر استعمال ڪريو',

    // Modals & Dialogs
    'modal.settings': 'سيٽنگون',
    'modal.phoneLogin': 'فون نمبر لاگ ان',
    'modal.selectCategory': 'ڪيٽيگري چونڊيو',

    // Settings Modal
    'settings.theme': 'ٿيم سيٽنگون',
    'settings.themeLight': 'لائيٽ',
    'settings.themeDark': 'ڊارڪ',
    'settings.viewMode': 'ڏسڻ جو طريقو',
    'settings.viewModeGrid': '🔲 گرڊ',
    'settings.viewModeList': '☰ لسٽ',
    'settings.language': 'ٻولي',
    'settings.languageEn': '🇺🇸 English',
    'settings.languageUr': '🇵🇰 اردو',
    'settings.close': 'سيٽنگون بند ڪريو',
    'settings.display': 'ڊسپلي سيٽنگون',
    'settings.showEmail': 'هيڊر ۾ اي ميل ڏيخاريو',

    // Product Page
    'product.noProducts': 'هن ڪيٽيگري ۾ ڪوبه پراڊڪٽ ناهي',
    'product.loadingProducts': 'پراڊڪٽس لوڊ ٿي رهيون آهن...',
    'product.wheelHint': '🖱️ ڦيرائڻ لاءِ ماؤس ويل يا ليٽ ڪلڪ | 🖱️ سڀني ڪيٽيگريز لاءِ رائٽ ڪلڪ',
    'product.viewDetails': 'تفصيل ڏسو',
    'product.price': 'قيمت',
    'product.category': 'ڪيٽيگري',
    'product.description': 'تفصيل',
    'product.report': 'رپورٽ ڪريو',
    'product.reportReason': 'رپورٽ جو سبب',
    'product.reportDetails': 'تفصيل (اختياري)',
    'product.submitReport': 'رپورٽ جمع ڪريو',

    // Product Details Modal
    'details.name': 'نام',
    'details.price': 'قيمت',
    'details.category': 'ڪيٽيگري',
    'details.subcategory': 'ذيلي ڪيٽيگري',
    'details.brand': 'برانڊ',
    'details.sku': 'SKU',
    'details.stock': 'اسٽاڪ',
    'details.stockUnlimited': 'انگن کان سواءِ',
    'details.stockUnits': 'يونٽ',
    'details.rating': 'ريٽنگ',
    'details.description': 'تفصيل',
    'details.tags': 'ٽئگس',
    'details.specs': 'خاصيتون',
    'details.edit': '✏️ پراڊڪٽ ايڊٽ ڪريو',
    'details.visit': '🔗 پراڊڪٽ ڏسو',
    'details.download': '📥 ڊائون لوڊ',

    // Contact Page
    'contact.getInTouch': 'رابطي ۾ رهو',
    'contact.sendMessage': 'اسان کي پيغام موڪليو',
    'contact.name': 'نام',
    'contact.email': 'اي ميل',
    'contact.message': 'پيغام',
    'contact.submitBtn': 'پيغام موڪليو',
    'contact.phone': '+92-330-XXXXXXX',
    'contact.location': 'ڪراچي، پاڪستان',
    'contact.emailAddr': 'ag.aliengamerz@gmail.com',

    // Buttons & Controls
    'btn.logout': 'لاگ آئوٽ',
    'btn.submit': 'جمع ڪريو',
    'btn.cancel': 'منسوخ',
    'btn.close': 'بند ڪريو',
    'btn.yes': 'جي ها',
    'btn.no': 'نه',

    // Common Messages
    'msg.loading': 'لوڊ ٿي رهيو آهي...',
    'msg.error': 'غلطي',
    'msg.success': 'کاميابي',
    'msg.welcome': 'ڀليڪار',
    'msg.userId': 'يوزر ID',
    'msg.haveAccount': 'پهرين ئي اڪائونٽ آهي؟',
    },
    hnd: {
    // Navigation & Headers
    'nav.home': 'ہوم',
    'nav.about': 'ساڈے بارے۔',
    'nav.products': 'پروڈکٹس',
    'nav.privacy': 'پرائیویسی',
    'nav.contact': 'رابطہ کرو',
    'nav.controlPanel': 'کنٹرول پینل',

    'head.contact': 'AG | رابطہ کرو',
    'head.products': 'AG | پروڈکٹس',
    'head.about': 'AG | ساڈے بارے۔',
    'head.home': 'AG | ہوم',

    // Login Page
    'head.welcome': 'جی آیاں نوں!',
    'login.email': 'ای میل',
    'login.password': 'پاسورڈ',
    'login.submit': 'لاگ ان کرو',
    'login.noAccount': 'اکاؤنٹ ناہی ہے؟',
    'login.signUp': 'سائن اپ کرو',
    'login.or': 'یا',
    'login.createAccount': 'نواں اکاؤنٹ بناؤ',

    // Home Page
    'body.heading.home': 'AG Electronics Pvt. Ltd. وچ جی آیاں نوں',
    'body.description.home': 'خاص طور پر سافٹ ویئر وچ تھاڈا بااعتماد ساتھی۔',

    // About Page
    'body.heading.about': 'AG Electronics Pvt. Ltd. وچ جی آیاں نوں',
    'body.description.about': 'کمپنی رجسٹر ہوݨ توں بعد معلومات اتھے شامل کیتی جاۓ گی۔',

    // Authentication Methods
    'auth.google': 'گوگل نال لاگ ان کرو',
    'auth.googleSignup': 'گوگل نال سائن اپ کرو',
    'auth.github': 'گٹ ہب نال لاگ ان کرو',
    'auth.githubSignup': 'گٹ ہب نال سائن اپ کرو',
    'auth.facebook': 'فیس بک نال لاگ ان کرو',
    'auth.facebookSignup': 'فیس بک نال سائن اپ کرو',
    'auth.yahoo': 'یاہو نال لاگ ان کرو',
    'auth.yahooSignup': 'یاہو نال سائن اپ کرو',
    'auth.phone': 'فون نمبر نال لاگ ان کرو',
    'auth.phoneSignup': 'فون نمبر نال سائن اپ کرو',
    'auth.guest': 'مہمان بن کے آگے وُدھو',
    'auth.guestSignup': 'مہمان بن کے آگے وُدھو',

    // Phone Authentication
    'phone.enterNumber': 'اپنا فون نمبر لکھو:',
    'phone.sendOtp': 'OTP بھیجو',
    'phone.enterCode': 'فون تے آيا 6 ہندسیاں دا کوڈ لکھو:',
    'phone.verifyLogin': 'تصدیق کرو تے لاگ ان کرو',
    'phone.useNumber': 'ہور نمبر استعمال کرو',

    // Modals & Dialogs
    'modal.settings': 'سیٹنگز',
    'modal.phoneLogin': 'فون نمبر لاگ ان',
    'modal.selectCategory': 'کیٹیگری چنو',

    // Settings Modal
    'settings.theme': 'تھیم سیٹنگز',
    'settings.themeLight': 'لائٹ',
    'settings.themeDark': 'ڈارک',
    'settings.viewMode': 'تکن دا طریقہ',
    'settings.viewModeGrid': '🔲 گرڈ',
    'settings.viewModeList': '☰ لسٹ',
    'settings.language': 'زبان',
    'settings.languageEn': '🇺🇸 English',
    'settings.languageUr': '🇵🇰 اردو',
    'settings.close': 'سیٹنگز بند کرو',
    'settings.display': 'ڈسپلے سیٹنگز',
    'settings.showEmail': 'ہیڈر وچ ای میل دکھاؤ',

    // Product Page
    'product.noProducts': 'اس کیٹیگری وچ کوئی پروڈکٹ ناہی',
    'product.loadingProducts': 'پروڈکٹس لوڈ ہو رہیاں نیں...',
    'product.wheelHint': '🖱️ گھماوݨ لئی ماؤس ویل یا لیفٹ کلک | 🖱️ ساریاں کیٹیگریز لئی رائٹ کلک',
    'product.viewDetails': 'تفصیل تکھو',
    'product.price': 'قیمت',
    'product.category': 'کیٹیگری',
    'product.description': 'تفصیل',
    'product.report': 'رپورٹ کرو',
    'product.reportReason': 'رپورٹ دی وجہ',
    'product.reportDetails': 'تفصیل (اختیاری)',
    'product.submitReport': 'رپورٹ جمع کرو',

    // Product Details Modal
    'details.name': 'ناں',
    'details.price': 'قیمت',
    'details.category': 'کیٹیگری',
    'details.subcategory': 'سب کیٹیگری',
    'details.brand': 'برانڈ',
    'details.sku': 'SKU',
    'details.stock': 'سٹاک',
    'details.stockUnlimited': 'بے شمار',
    'details.stockUnits': 'اکائیاں',
    'details.rating': 'ریٹنگ',
    'details.description': 'تفصیل',
    'details.tags': 'ٹیگز',
    'details.specs': 'خصوصیات',
    'details.edit': '✏️ پروڈکٹ ایڈٹ کرو',
    'details.visit': '🔗 پروڈکٹ تکھو',
    'details.download': '📥 ڈاؤن لوڈ',

    // Contact Page
    'contact.getInTouch': 'رابطے وچ رہو',
    'contact.sendMessage': 'ساڑھے نال رابطہ کرو',
    'contact.name': 'ناں',
    'contact.email': 'ای میل',
    'contact.message': 'میسج',
    'contact.submitBtn': 'میسج بھیجو',
    'contact.phone': '+92-330-XXXXXXX',
    'contact.location': 'کراچی، پاکستان',
    'contact.emailAddr': 'ag.aliengamerz@gmail.com',

    // Buttons & Controls
    'btn.logout': 'لاگ آؤٹ',
    'btn.submit': 'جمع کرو',
    'btn.cancel': 'منسوخ',
    'btn.close': 'بند کرو',
    'btn.yes': 'اہاں',
    'btn.no': 'ناں',

    // Common Messages
    'msg.loading': 'لوڈنگ ہو رہی اے...',
    'msg.error': 'خرابی',
    'msg.success': 'کامیابی',
    'msg.welcome': 'جی آیاں نوں',
    'msg.userId': 'یوزر ID',
    'msg.haveAccount': 'پہلاں توں اڪاؤنٹ ہے؟',
    },
    skr: {
    // Navigation & Headers
    'nav.home': 'ہوم',
    'nav.about': 'ساݙے بارے',
    'nav.products': 'پروڈکٹس',
    'nav.privacy': 'پرائیویسی',
    'nav.contact': 'رابطہ کرو',
    'nav.controlPanel': 'کنٹرول پینل',

    'head.contact': 'AG | رابطہ کرو',
    'head.products': 'AG | پروڈکٹس',
    'head.about': 'AG | ساݙے بارے',
    'head.home': 'AG | ہوم',

    // Login Page
    'head.welcome': 'ڀلی کار!',
    'login.email': 'ای میل',
    'login.password': 'پاسورڈ',
    'login.submit': 'لاگ ان تھیوو',
    'login.noAccount': 'اکاؤنٹ کائنی؟',
    'login.signUp': 'سائن اپ تھیوو',
    'login.or': 'یا',
    'login.createAccount': 'نواں اکاؤنٹ بݨاؤ',

    // Home Page
    'body.heading.home': 'AG Electronics Pvt. Ltd. وچ ڀلی کار',
    'body.description.home': 'خاص طور تے سافٹ ویئر وچ تھاݙا بااعتماد ساتھی۔',

    // About Page
    'body.heading.about': 'AG Electronics Pvt. Ltd. وچ ڀلی کار',
    'body.description.about': 'کمپنی رجسٹر تھیوݨ توں بعد معلومات اتھاں شامل کیتی ویسے۔',

    // Authentication Methods
    'auth.google': 'گوگل نال لاگ ان تھیوو',
    'auth.googleSignup': 'گوگل نال سائن اپ تھیوو',
    'auth.github': 'گٽ هب نال لاگ ان تھیوو',
    'auth.githubSignup': 'گٽ هب نال سائن اپ تھیوو',
    'auth.facebook': 'فیس بک نال لاگ ان تھیوو',
    'auth.facebookSignup': 'فیس بک نال سائن اپ تھیوو',
    'auth.yahoo': 'یاہو نال لاگ ان تھیوو',
    'auth.yahooSignup': 'یاہو نال سائن اپ تھیوو',
    'auth.phone': 'فون نمبر نال لاگ ان تھیوو',
    'auth.phoneSignup': 'فون نمبر نال سائن اپ تھیوو',
    'auth.guest': 'مہمان بن تے اڳاں ودو',
    'auth.guestSignup': 'مہمان بن تے اڳاں ودو',

    // Phone Authentication
    'phone.enterNumber': 'اپݨا فون نمبر لکھو:',
    'phone.sendOtp': 'OTP بھیجو',
    'phone.enterCode': 'فون تے آیا 6 ہندسیاں دا کوڈ داخل کرو:',
    'phone.verifyLogin': 'تصدیق کرو تے لاگ ان تھیوو',
    'phone.useNumber': 'ٻیا نمبر استعمال کرو',

    // Modals & Dialogs
    'modal.settings': 'سیٹنگز',
    'modal.phoneLogin': 'فون نمبر لاگ ان',
    'modal.selectCategory': 'کیٹیگری چݨو',

    // Settings Modal
    'settings.theme': 'تھیم سیٹنگز',
    'settings.themeLight': 'لائيٽ',
    'settings.themeDark': 'ڊارڪ',
    'settings.viewMode': 'ݙیکھݨ دا طریقہ',
    'settings.viewModeGrid': '🔲 گرڈ',
    'settings.viewModeList': '☰ لسٹ',
    'settings.language': 'زبان',
    'settings.languageEn': '🇺🇸 English',
    'settings.languageUr': '🇵🇰 اردو',
    'settings.close': 'سیٹنگز بند کرو',
    'settings.display': 'ڊسپلي سيٽنگز',
    'settings.showEmail': 'هيڊر وچ اي ميل ݙکھاؤ',

    // Product Page
    'product.noProducts': 'انہیں ڪيٽيگري وچ کوئی پروڊڪٽ ڪائنی',
    'product.loadingProducts': 'پروڊڪٽس لوڊ ٿيندیاں پیاں ہن...',
    'product.wheelHint': '🖱️ ڦيراوݨ لاءِ ماؤس ويل يا ليٽ ڪلڪ | 🖱️ سبھے ڪيٽيگريز لاءِ رائٽ ڪلڪ',
    'product.viewDetails': 'تفصیل ݙیکھو',
    'product.price': 'قیمت',
    'product.category': 'ڪيٽيگري',
    'product.description': 'تفصیل',
    'product.report': 'رپورٽ کرو',
    'product.reportReason': 'رپورٽ دی وجہ',
    'product.reportDetails': 'تفصیل (اختیاری)',
    'product.submitReport': 'رپورٽ جمع کرو',

    // Product Details Modal
    'details.name': 'ناں',
    'details.price': 'قیمت',
    'details.category': 'ڪيٽيگري',
    'details.subcategory': 'ذیلی ڪيٽيگري',
    'details.brand': 'برانڊ',
    'details.sku': 'SKU',
    'details.stock': 'اسٽاڪ',
    'details.stockUnlimited': 'بے حساب',
    'details.stockUnits': 'اکائیاں',
    'details.rating': 'ريٽنگ',
    'details.description': 'تفصیل',
    'details.tags': 'ٽئگس',
    'details.specs': 'خصوصیات',
    'details.edit': '✏️ پروڊڪٽ ايڊٽ کرو',
    'details.visit': '🔗 پروڊڪٽ ݙیکھو',
    'details.download': '📥 ڊائون لوڊ',

    // Contact Page
    'contact.getInTouch': 'رابطے وچ رہو',
    'contact.sendMessage': 'ساݙے نال رابطہ کرو',
    'contact.name': 'ناں',
    'contact.email': 'ای میل',
    'contact.message': 'میسج',
    'contact.submitBtn': 'میسج بھیجو',
    'contact.phone': '+92-330-XXXXXXX',
    'contact.location': 'کراچی، پاکستان',
    'contact.emailAddr': 'ag.aliengamerz@gmail.com',

    // Buttons & Controls
    'btn.logout': 'لاگ آئوٽ',
    'btn.submit': 'جمع کرو',
    'btn.cancel': 'منسوخ',
    'btn.close': 'بند کرو',
    'btn.yes': 'ہا',
    'btn.no': 'ناں',

    // Common Messages
    'msg.loading': 'لوڊ ٿیندا پئے...',
    'msg.error': 'خرابی',
    'msg.success': 'کامیابی',
    'msg.welcome': 'ڀلی کار',
    'msg.userId': 'یوزر ID',
    'msg.haveAccount': 'پہلے توں اڪاؤنٽ ہے؟',
    },
    hi: {
    // Navigation & Headers
    'nav.home': 'होम',
    'nav.about': 'हमारे बारे में',
    'nav.products': 'उत्पाद',
    'nav.privacy': 'गोपनीयता',
    'nav.contact': 'संपर्क करें',
    'nav.controlPanel': 'नियंत्रण कक्ष',

    'head.contact': 'AG | संपर्क करें',
    'head.products': 'AG | उत्पाद',
    'head.about': 'AG | हमारे बारे में',
    'head.home': 'AG | होम',

    // Login Page
    'head.welcome': 'वापसी पर स्वागत है!',
    'login.email': 'ईमेल',
    'login.password': 'पासवर्ड',
    'login.submit': 'लॉग इन करें',
    'login.noAccount': 'खाता नहीं है?',
    'login.signUp': 'साइन अप करें',
    'login.or': 'या',
    'login.createAccount': 'खाता बनाएं',

    // Home Page
    'body.heading.home': 'AG Electronics Pvt. Ltd. में आपका स्वागत है',
    'body.description.home': 'मुख्य रूप से सॉफ्टवेयर में आपका विश्वसनीय साथी।',

    // About Page
    'body.heading.about': 'AG Electronics Pvt. Ltd. में आपका स्वागत है',
    'body.description.about': 'कंपनी पंजीकृत होने के बाद जानकारी यहां जोड़ी जाएगी।',

    // Authentication Methods
    'auth.google': 'Google के साथ लॉगिन करें',
    'auth.googleSignup': 'Google के साथ साइन अप करें',
    'auth.github': 'GitHub के साथ लॉगिन करें',
    'auth.githubSignup': 'GitHub के साथ साइन अप करें',
    'auth.facebook': 'Facebook के साथ लॉगिन करें',
    'auth.facebookSignup': 'Facebook के साथ साइन अप करें',
    'auth.yahoo': 'Yahoo के साथ लॉगिन करें',
    'auth.yahooSignup': 'Yahoo के साथ साइन अप करें',
    'auth.phone': 'फोन नंबर के साथ लॉगिन करें',
    'auth.phoneSignup': 'फोन नंबर के साथ साइन अप करें',
    'auth.guest': 'अतिथि के रूप में जारी रखें',
    'auth.guestSignup': 'अतिथि के रूप में जारी रखें',

    // Phone Authentication
    'phone.enterNumber': 'अपना फोन नंबर दर्ज करें:',
    'phone.sendOtp': 'OTP भेजें',
    'phone.enterCode': 'अपने फोन पर भेजा गया 6-अंकों का कोड दर्ज करें:',
    'phone.verifyLogin': 'सत्यापित करें और लॉगिन करें',
    'phone.useNumber': 'अलग नंबर का उपयोग करें',

    // Modals & Dialogs
    'modal.settings': 'सेटिंग्स',
    'modal.phoneLogin': 'फोन नंबर लॉगिन',
    'modal.selectCategory': 'श्रेणी चुनें',

    // Settings Modal
    'settings.theme': 'थीम सेटिंग्स',
    'settings.themeLight': 'लाइट',
    'settings.themeDark': 'डार्क',
    'settings.viewMode': 'व्यू मोड',
    'settings.viewModeGrid': '🔲 ग्रिड',
    'settings.viewModeList': '☰ सूची',
    'settings.language': 'भाषा',
    'settings.languageEn': '🇺🇸 English',
    'settings.languageUr': '🇵🇰 اردو',
    'settings.close': 'सेटिंग्स बंद करें',
    'settings.display': 'डिस्प्ले सेटिंग्स',
    'settings.showEmail': 'हेडर में ईमेल दिखाएं',

    // Product Page
    'product.noProducts': 'इस श्रेणी में कोई उत्पाद नहीं है',
    'product.loadingProducts': 'उत्पाद लोड हो रहे हैं...',
    'product.wheelHint': '🖱️ घुमाने के लिए माउस व्हील या लेफ्ट क्लिक | 🖱️ सभी श्रेणियों के लिए राइट क्लिक',
    'product.viewDetails': 'विवरण देखें',
    'product.price': 'कीमत',
    'product.category': 'श्रेणी',
    'product.description': 'विवरण',
    'product.report': 'उत्पाद की रिपोर्ट करें',
    'product.reportReason': 'रिपोर्ट करने का कारण',
    'product.reportDetails': 'विवरण (वैकल्पिक)',
    'product.submitReport': 'रिपोर्ट सबमिट करें',

    // Product Details Modal
    'details.name': 'नाम',
    'details.price': 'कीमत',
    'details.category': 'श्रेणी',
    'details.subcategory': 'उप श्रेणी',
    'details.brand': 'ब्रांड',
    'details.sku': 'SKU',
    'details.stock': 'स्टॉक',
    'details.stockUnlimited': 'असीमित',
    'details.stockUnits': 'इकाइयां',
    'details.rating': 'रेटिंग',
    'details.description': 'विवरण',
    'details.tags': 'टैग',
    'details.specs': 'विनिर्देश (Specifications)',
    'details.edit': '✏️ उत्पाद संपादित करें',
    'details.visit': '🔗 उत्पाद पर जाएं',
    'details.download': '📥 डाउनलोड',

    // Contact Page
    'contact.getInTouch': 'संपर्क में रहें',
    'contact.sendMessage': 'हमें एक संदेश भेजें',
    'contact.name': 'नाम',
    'contact.email': 'ईमेल',
    'contact.message': 'संदेश',
    'contact.submitBtn': 'संदेश भेजें',
    'contact.phone': '+92-330-XXXXXXX',
    'contact.location': 'कराची, पाकिस्तान',
    'contact.emailAddr': 'ag.aliengamerz@gmail.com',

    // Buttons & Controls
    'btn.logout': 'लॉग आउट',
    'btn.submit': 'सबमिट करें',
    'btn.cancel': 'रद्द करें',
    'btn.close': 'बंद करें',
    'btn.yes': 'हां',
    'btn.no': 'नहीं',

    // Common Messages
    'msg.loading': 'लोड हो रहा है...',
    'msg.error': 'त्रुटि',
    'msg.success': 'सफलता',
    'msg.welcome': 'स्वागत है',
    'msg.userId': 'यूज़र ID',
    'msg.haveAccount': 'पहले से ही एक खाता है?',
    },
    ur_roman: {
    // Navigation & Headers
    'nav.home': 'Home',
    'nav.about': 'Humare Bare Mein',
    'nav.products': 'Products',
    'nav.privacy': 'Privacy',
    'nav.contact': 'Hum Se Raabta Karein',
    'nav.controlPanel': 'Control Panel',

    'head.contact': 'AG | Hum Se Raabta Karein',
    'head.products': 'AG | Products',
    'head.about': 'AG | Humare Bare Mein',
    'head.home': 'AG | Home',

    // Login Page
    'head.welcome': 'KhushAamdeed Dobara!',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.submit': 'Log In',
    'login.noAccount': 'Account nahi hai?',
    'login.signUp': 'Sign Up',
    'login.or': 'ya',
    'login.createAccount': 'Account Banayein',

    // Home Page
    'body.heading.home': 'AG Electronics Pvt. Ltd. Mein KhushAamdeed',
    'body.description.home': 'Khas taur par softwares mein aap ka qabil-e-etimad partner.',

    // About Page
    'body.heading.about': 'AG Electronics Pvt. Ltd. Mein KhushAamdeed',
    'body.description.about': 'Company register hone ke baad yahan maloomat add ki jayengi.',

    // Authentication Methods
    'auth.google': 'Google ke sath Login karein',
    'auth.googleSignup': 'Google ke sath Sign Up karein',
    'auth.github': 'GitHub ke sath Sign In karein',
    'auth.githubSignup': 'GitHub ke sath Sign Up karein',
    'auth.facebook': 'Facebook ke sath Login karein',
    'auth.facebookSignup': 'Facebook ke sath Sign Up karein',
    'auth.yahoo': 'Yahoo ke sath Login karein',
    'auth.yahooSignup': 'Yahoo ke sath Sign Up karein',
    'auth.phone': 'Phone number ke sath Login karein',
    'auth.phoneSignup': 'Phone number ke sath Sign Up karein',
    'auth.guest': 'Mehman ke taur par jari rakhein',
    'auth.guestSignup': 'Mehman ke taur par jari rakhein',

    // Phone Authentication
    'phone.enterNumber': 'Apna phone number darj karein:',
    'phone.sendOtp': 'OTP Bhejein',
    'phone.enterCode': 'Apne phone par bheja gaya 6-digit code darj karein:',
    'phone.verifyLogin': 'Verify & Login',
    'phone.useNumber': 'Dusra number istemal karein',

    // Modals & Dialogs
    'modal.settings': 'Settings',
    'modal.phoneLogin': 'Phone Number Login',
    'modal.selectCategory': 'Category Select Karein',

    // Settings Modal
    'settings.theme': 'Theme Settings',
    'settings.themeLight': 'Light',
    'settings.themeDark': 'Dark',
    'settings.viewMode': 'View Mode',
    'settings.viewModeGrid': '🔲 Grid',
    'settings.viewModeList': '☰ List',
    'settings.language': 'Zuban (Language)',
    'settings.languageEn': '🇺🇸 English',
    'settings.languageUr': '🇵🇰 اردو',
    'settings.close': 'Settings Band Karein',
    'settings.display': 'Display Settings',
    'settings.showEmail': 'Header mein email dikhayein',

    // Product Page
    'product.noProducts': 'Is category mein koi product nahi hai',
    'product.loadingProducts': 'Products load ho rahe hain...',
    'product.wheelHint': '🖱️ Rotate karne ke liye Mouse Wheel ya Left Click | 🖱️ Tamam categories ke liye Right Click',
    'product.viewDetails': 'Tafseelat Dekhein',
    'product.price': 'Qeemat',
    'product.category': 'Category',
    'product.description': 'Tafseel',
    'product.report': 'Product Report Karein',
    'product.reportReason': 'Report karne ki waja',
    'product.reportDetails': 'Tafseelat (optional)',
    'product.submitReport': 'Report Submit Karein',

    // Product Details Modal
    'details.name': 'Naam',
    'details.price': 'Qeemat',
    'details.category': 'Category',
    'details.subcategory': 'Sub Category',
    'details.brand': 'Brand',
    'details.sku': 'SKU',
    'details.stock': 'Stock',
    'details.stockUnlimited': 'Unlimited',
    'details.stockUnits': 'units',
    'details.rating': 'Rating',
    'details.description': 'Tafseel',
    'details.tags': 'Tags',
    'details.specs': 'Specifications',
    'details.edit': '✏️ Product Edit Karein',
    'details.visit': '🔗 Product Page Par Jayein',
    'details.download': '📥 Download',

    // Contact Page
    'contact.getInTouch': 'Hum Se Raabte Mein Rahein',
    'contact.sendMessage': 'Humhein Paigham Bhejein',
    'contact.name': 'Naam',
    'contact.email': 'Email',
    'contact.message': 'Paigham',
    'contact.submitBtn': 'Paigham Bhejein',
    'contact.phone': '+92-330-XXXXXXX',
    'contact.location': 'Karachi, Pakistan',
    'contact.emailAddr': 'ag.aliengamerz@gmail.com',

    // Buttons & Controls
    'btn.logout': 'Logout',
    'btn.submit': 'Submit',
    'btn.cancel': 'Cancel',
    'btn.close': 'Band Karein',
    'btn.yes': 'Haan',
    'btn.no': 'Nahi',

    // Common Messages
    'msg.loading': 'Loading...',
    'msg.error': 'Error',
    'msg.success': 'Kamyabi',
    'msg.welcome': 'KhushAamdeed',
    'msg.userId': 'User ID',
    'msg.haveAccount': 'Pehle se account hai?',
    },
    bn: {
    // Navigation & Headers
    'nav.home': 'হোম',
    'nav.about': 'আমাদের সম্পর্কে',
    'nav.products': 'পণ্যসমূহ',
    'nav.privacy': 'গোপনীয়তা',
    'nav.contact': 'যোগাযোগ করুন',
    'nav.controlPanel': 'কন্ট্রোল প্যানেল',

    'head.contact': 'AG | যোগাযোগ করুন',
    'head.products': 'AG | পণ্যসমূহ',
    'head.about': 'AG | আমাদের সম্পর্কে',
    'head.home': 'AG | হোম',

    // Login Page
    'head.welcome': 'আবার স্বাগতম!',
    'login.email': 'ইমেইল',
    'login.password': 'পাসওয়ার্ড',
    'login.submit': 'লগ ইন করুন',
    'login.noAccount': 'অ্যাকাউন্ট নেই?',
    'login.signUp': 'সাইন আপ করুন',
    'login.or': 'অথবা',
    'login.createAccount': 'অ্যাকাউন্ট তৈরি করুন',

    // Home Page
    'body.heading.home': 'AG Electronics Pvt. Ltd.-এ স্বাগতম',
    'body.description.home': 'প্রধানত সফটওয়্যারে আপনার বিশ্বস্ত অংশীদার।',

    // About Page
    'body.heading.about': 'AG Electronics Pvt. Ltd.-এ স্বাগতম',
    'body.description.about': 'কোম্পানি নিবন্ধিত হওয়ার পর তথ্য এখানে যোগ করা হবে।',

    // Authentication Methods
    'auth.google': 'Google দিয়ে লগ ইন করুন',
    'auth.googleSignup': 'Google দিয়ে সাইন আপ করুন',
    'auth.github': 'GitHub দিয়ে সাইন ইন করুন',
    'auth.githubSignup': 'GitHub দিয়ে সাইন আপ করুন',
    'auth.facebook': 'Facebook দিয়ে লগ ইন করুন',
    'auth.facebookSignup': 'Facebook দিয়ে সাইন আপ করুন',
    'auth.yahoo': 'Yahoo দিয়ে লগ ইন করুন',
    'auth.yahooSignup': 'Yahoo দিয়ে সাইন আপ করুন',
    'auth.phone': 'ফোন নম্বর দিয়ে লগ ইন করুন',
    'auth.phoneSignup': 'ফোন নম্বর দিয়ে সাইন আপ করুন',
    'auth.guest': 'গেস্ট হিসেবে চালিয়ে যান',
    'auth.guestSignup': 'গেস্ট হিসেবে চালিয়ে যান',

    // Phone Authentication
    'phone.enterNumber': 'আপনার ফোন নম্বর লিখুন:',
    'phone.sendOtp': 'OTP পাঠান',
    'phone.enterCode': 'আপনার ফোনে পাঠানো ৬ ডিজিটের কোডটি লিখুন:',
    'phone.verifyLogin': 'যাচাই করুন এবং লগ ইন করুন',
    'phone.useNumber': 'অন্য নম্বর ব্যবহার করুন',

    // Modals & Dialogs
    'modal.settings': 'সেটিংস',
    'modal.phoneLogin': 'ফোন নম্বর লগইন',
    'modal.selectCategory': 'ক্যাটাগরি নির্বাচন করুন',

    // Settings Modal
    'settings.theme': 'থিম সেটিংস',
    'settings.themeLight': 'লাইট',
    'settings.themeDark': 'ডার্ক',
    'settings.viewMode': 'ভিউ মোড',
    'settings.viewModeGrid': '🔲 গ্রিড',
    'settings.viewModeList': '☰ তালিকা',
    'settings.language': 'ভাষা',
    'settings.languageEn': '🇺🇸 English',
    'settings.languageUr': '🇵🇰 اردو',
    'settings.close': 'সেটিংস বন্ধ করুন',
    'settings.display': 'ডিসপ্লে সেটিংস',
    'settings.showEmail': 'হেডারে ইমেইল দেখান',

    // Product Page
    'product.noProducts': 'এই ক্যাটাগরিতে কোনো পণ্য নেই',
    'product.loadingProducts': 'পণ্য লোড হচ্ছে...',
    'product.wheelHint': '🖱️ ঘোরাতে মাউস হুইল বা বাম ক্লিক করুন | 🖱️ সব ক্যাটাগরির জন্য ডান ক্লিক করুন',
    'product.viewDetails': 'বিস্তারিত দেখুন',
    'product.price': 'মূল্য',
    'product.category': 'ক্যাটাগরি',
    'product.description': 'বিবরণ',
    'product.report': 'পণ্য রিপোর্ট করুন',
    'product.reportReason': 'রিপোর্ট করার কারণ',
    'product.reportDetails': 'বিস্তারিত (ঐচ্ছিক)',
    'product.submitReport': 'রিপোর্ট জমা দিন',

    // Product Details Modal
    'details.name': 'নাম',
    'details.price': 'মূল্য',
    'details.category': 'ক্যাটাগরি',
    'details.subcategory': 'সাব-ক্যাটাগরি',
    'details.brand': 'ব্র্যান্ড',
    'details.sku': 'SKU',
    'details.stock': 'স্টক',
    'details.stockUnlimited': 'অসীম',
    'details.stockUnits': 'ইউনিট',
    'details.rating': 'রেটিং',
    'details.description': 'বিবরণ',
    'details.tags': 'ট্যাগসমূহ',
    'details.specs': 'স্পেসিফিকেশন',
    'details.edit': '✏️ পণ্য এডিট করুন',
    'details.visit': '🔗 পণ্য দেখুন',
    'details.download': '📥 ডাউনলোড',

    // Contact Page
    'contact.getInTouch': 'যোগাযোগে থাকুন',
    'contact.sendMessage': 'আমাদের একটি বার্তা পাঠান',
    'contact.name': 'নাম',
    'contact.email': 'ইমেইল',
    'contact.message': 'বার্তা',
    'contact.submitBtn': 'বার্তা পাঠান',
    'contact.phone': '+92-330-XXXXXXX',
    'contact.location': 'করাচি, পাকিস্তান',
    'contact.emailAddr': 'ag.aliengamerz@gmail.com',

    // Buttons & Controls
    'btn.logout': 'লগ আউট',
    'btn.submit': 'জমা দিন',
    'btn.cancel': 'বাতিল করুন',
    'btn.close': 'বন্ধ করুন',
    'btn.yes': 'হ্যাঁ',
    'btn.no': 'না',

    // Common Messages
    'msg.loading': 'লোড হচ্ছে...',
    'msg.error': 'ত্রুটি',
    'msg.success': 'সফলতা',
    'msg.welcome': 'স্বাগতম',
    'msg.userId': 'ইউজার ID',
    'msg.haveAccount': 'ইতিমধ্যে একটি অ্যাকাউন্ট আছে?',
    },
    ru: {
    // Navigation & Headers
    'nav.home': 'Главная',
    'nav.about': 'О нас',
    'nav.products': 'Товары',
    'nav.privacy': 'Конфиденциальность',
    'nav.contact': 'Контакты',
    'nav.controlPanel': 'Панель управления',

    'head.contact': 'AG | Контакты',
    'head.products': 'AG | Товары',
    'head.about': 'AG | О нас',
    'head.home': 'AG | Главная',

    // Login Page
    'head.welcome': 'С возвращением!',
    'login.email': 'Электронная почта',
    'login.password': 'Пароль',
    'login.submit': 'Войти',
    'login.noAccount': 'Нет аккаунта?',
    'login.signUp': 'Зарегистрироваться',
    'login.or': 'или',
    'login.createAccount': 'Создать аккаунт',

    // Home Page
    'body.heading.home': 'Добро пожаловать в AG Electronics Pvt. Ltd.',
    'body.description.home': 'Ваш надежный партнер, в основном в сфере программного обеспечения.',

    // About Page
    'body.heading.about': 'Добро пожаловать в AG Electronics Pvt. Ltd.',
    'body.description.about': 'Информация будет добавлена после регистрации компании.',

    // Authentication Methods
    'auth.google': 'Войти через Google',
    'auth.googleSignup': 'Зарегистрироваться через Google',
    'auth.github': 'Войти через GitHub',
    'auth.githubSignup': 'Зарегистрироваться через GitHub',
    'auth.facebook': 'Войти через Facebook',
    'auth.facebookSignup': 'Зарегистрироваться через Facebook',
    'auth.yahoo': 'Войти через Yahoo',
    'auth.yahooSignup': 'Зарегистрироваться через Yahoo',
    'auth.phone': 'Войти по номеру телефона',
    'auth.phoneSignup': 'Зарегистрироваться по номеру телефона',
    'auth.guest': 'Продолжить как гость',
    'auth.guestSignup': 'Продолжить как гость',

    // Phone Authentication
    'phone.enterNumber': 'Введите ваш номер телефона:',
    'phone.sendOtp': 'Отправить SMS-код',
    'phone.enterCode': 'Введите 6-значный код, отправленный на ваш телефон:',
    'phone.verifyLogin': 'Подтвердить и войти',
    'phone.useNumber': 'Использовать другой номер',

    // Modals & Dialogs
    'modal.settings': 'Настройки',
    'modal.phoneLogin': 'Вход по номеру телефона',
    'modal.selectCategory': 'Выберите категорию',

    // Settings Modal
    'settings.theme': 'Настройки темы',
    'settings.themeLight': 'Светлая',
    'settings.themeDark': 'Темная',
    'settings.viewMode': 'Режим отображения',
    'settings.viewModeGrid': '🔲 Сетка',
    'settings.viewModeList': '☰ Список',
    'settings.language': 'Язык',
    'settings.languageEn': '🇺🇸 English',
    'settings.languageUr': '🇵🇰 اردو',
    'settings.close': 'Закрыть настройки',
    'settings.display': 'Настройки экрана',
    'settings.showEmail': 'Показывать email в шапке',

    // Product Page
    'product.noProducts': 'В этой категории нет товаров',
    'product.loadingProducts': 'Загрузка товаров...',
    'product.wheelHint': '🖱️ Колесико мыши или левый клик для вращения | 🖱️ Правый клик для всех категорий',
    'product.viewDetails': 'Посмотреть детали',
    'product.price': 'Цена',
    'product.category': 'Категория',
    'product.description': 'Описание',
    'product.report': 'Пожаловаться на товар',
    'product.reportReason': 'Причина жалобы',
    'product.reportDetails': 'Детали (необязательно)',
    'product.submitReport': 'Отправить жалобу',

    // Product Details Modal
    'details.name': 'Название',
    'details.price': 'Цена',
    'details.category': 'Категория',
    'details.subcategory': 'Подкатегория',
    'details.brand': 'Бренд',
    'details.sku': 'Артикул (SKU)',
    'details.stock': 'В наличии',
    'details.stockUnlimited': 'Неограничено',
    'details.stockUnits': 'шт.',
    'details.rating': 'Рейтинг',
    'details.description': 'Описание',
    'details.tags': 'Теги',
    'details.specs': 'Характеристики',
    'details.edit': '✏️ Редактировать товар',
    'details.visit': '🔗 Перейти к товару',
    'details.download': '📥 Скачать',

    // Contact Page
    'contact.getInTouch': 'Свяжитесь с нами',
    'contact.sendMessage': 'Отправьте нам сообщение',
    'contact.name': 'Имя',
    'contact.email': 'Электронная почта',
    'contact.message': 'Сообщение',
    'contact.submitBtn': 'Отправить сообщение',
    'contact.phone': '+92-330-XXXXXXX',
    'contact.location': 'Карачи, Пакистан',
    'contact.emailAddr': 'ag.aliengamerz@gmail.com',

    // Buttons & Controls
    'btn.logout': 'Выйти',
    'btn.submit': 'Отправить',
    'btn.cancel': 'Отмена',
    'btn.close': 'Закрыть',
    'btn.yes': 'Да',
    'btn.no': 'Нет',

    // Common Messages
    'msg.loading': 'Загрузка...',
    'msg.error': 'Ошибка',
    'msg.success': 'Успешно',
    'msg.welcome': 'Добро пожаловать',
    'msg.userId': 'ID пользователя',
    'msg.haveAccount': 'Уже есть аккаунт?',
    },
    it: {
    // Navigation & Headers
    'nav.home': 'Home',
    'nav.about': 'Chi siamo',
    'nav.products': 'Prodotti',
    'nav.privacy': 'Privacy',
    'nav.contact': 'Contatti',
    'nav.controlPanel': 'Pannello di controllo',

    'head.contact': 'AG | Contatti',
    'head.products': 'AG | Prodotti',
    'head.about': 'AG | Chi siamo',
    'head.home': 'AG | Home',

    // Login Page
    'head.welcome': 'Bentornato!',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.submit': 'Accedi',
    'login.noAccount': 'Non hai un account?',
    'login.signUp': 'Registrati',
    'login.or': 'o',
    'login.createAccount': 'Crea un account',

    // Home Page
    'body.heading.home': 'Benvenuto in AG Electronics Pvt. Ltd.',
    'body.description.home': 'Il tuo partner di fiducia, principalmente nel settore software.',

    // About Page
    'body.heading.about': 'Benvenuto in AG Electronics Pvt. Ltd.',
    'body.description.about': 'Le informazioni verranno aggiunte dopo la registrazione dell\'azienda.',

    // Authentication Methods
    'auth.google': 'Accedi con Google',
    'auth.googleSignup': 'Registrati con Google',
    'auth.github': 'Accedi con GitHub',
    'auth.githubSignup': 'Registrati con GitHub',
    'auth.facebook': 'Accedi con Facebook',
    'auth.facebookSignup': 'Registrati con Facebook',
    'auth.yahoo': 'Accedi con Yahoo',
    'auth.yahooSignup': 'Registrati con Yahoo',
    'auth.phone': 'Accedi con numero di telefono',
    'auth.phoneSignup': 'Registrati con numero di telefono',
    'auth.guest': 'Continua come ospite',
    'auth.guestSignup': 'Continua come ospite',

    // Phone Authentication
    'phone.enterNumber': 'Inserisci il tuo numero di telefono:',
    'phone.sendOtp': 'Invia OTP',
    'phone.enterCode': 'Inserisci il codice a 6 cifre inviato al tuo telefono:',
    'phone.verifyLogin': 'Verifica e accedi',
    'phone.useNumber': 'Usa un altro numero',

    // Modals & Dialogs
    'modal.settings': 'Impostazioni',
    'modal.phoneLogin': 'Accesso con numero di telefono',
    'modal.selectCategory': 'Seleziona categoria',

    // Settings Modal
    'settings.theme': 'Impostazioni tema',
    'settings.themeLight': 'Chiaro',
    'settings.themeDark': 'Scuro',
    'settings.viewMode': 'Modalità di visualizzazione',
    'settings.viewModeGrid': '🔲 Griglia',
    'settings.viewModeList': '☰ Elenco',
    'settings.language': 'Lingua',
    'settings.languageEn': '🇺🇸 English',
    'settings.languageUr': '🇵🇰 اردو',
    'settings.close': 'Chiudi impostazioni',
    'settings.display': 'Impostazioni display',
    'settings.showEmail': 'Mostra email nell\'intestazione',

    // Product Page
    'product.noProducts': 'Nessun prodotto in questa categoria',
    'product.loadingProducts': 'Caricamento prodotti...',
    'product.wheelHint': '🖱️ Rotella del mouse o clic sinistro per ruotare | 🖱️ Clic destro per tutte le categorie',
    'product.viewDetails': 'Mostra dettagli',
    'product.price': 'Prezzo',
    'product.category': 'Categoria',
    'product.description': 'Descrizione',
    'product.report': 'Segnala prodotto',
    'product.reportReason': 'Motivo della segnalazione',
    'product.reportDetails': 'Dettagli (opzionale)',
    'product.submitReport': 'Invia segnalazione',

    // Product Details Modal
    'details.name': 'Nome',
    'details.price': 'Prezzo',
    'details.category': 'Categoria',
    'details.subcategory': 'Sottocategoria',
    'details.brand': 'Marca',
    'details.sku': 'SKU',
    'details.stock': 'Disponibilità',
    'details.stockUnlimited': 'Illimitato',
    'details.stockUnits': 'unità',
    'details.rating': 'Valutazione',
    'details.description': 'Descrizione',
    'details.tags': 'Tag',
    'details.specs': 'Specifiche tecniche',
    'details.edit': '✏️ Modifica prodotto',
    'details.visit': '🔗 Visita pagina prodotto',
    'details.download': '📥 Scarica',

    // Contact Page
    'contact.getInTouch': 'Mettiti in contatto',
    'contact.sendMessage': 'Inviaci un messaggio',
    'contact.name': 'Nome',
    'contact.email': 'Email',
    'contact.message': 'Messaggio',
    'contact.submitBtn': 'Invia messaggio',
    'contact.phone': '+92-330-XXXXXXX',
    'contact.location': 'Karachi, Pakistan',
    'contact.emailAddr': 'ag.aliengamerz@gmail.com',

    // Buttons & Controls
    'btn.logout': 'Disconnettiti',
    'btn.submit': 'Invia',
    'btn.cancel': 'Annulla',
    'btn.close': 'Chiudi',
    'btn.yes': 'Sì',
    'btn.no': 'No',

    // Common Messages
    'msg.loading': 'Caricamento...',
    'msg.error': 'Errore',
    'msg.success': 'Operazione completata',
    'msg.welcome': 'Benvenuto',
    'msg.userId': 'ID utente',
    'msg.haveAccount': 'Hai già un account?',
    },
    pt: {
    // Navigation & Headers
    'nav.home': 'Início',
    'nav.about': 'Sobre nós',
    'nav.products': 'Produtos',
    'nav.privacy': 'Privacidade',
    'nav.contact': 'Contato',
    'nav.controlPanel': 'Painel de Controle',

    'head.contact': 'AG | Contato',
    'head.products': 'AG | Produtos',
    'head.about': 'AG | Sobre nós',
    'head.home': 'AG | Início',

    // Login Page
    'head.welcome': 'Bem-vindo de volta!',
    'login.email': 'E-mail',
    'login.password': 'Senha',
    'login.submit': 'Entrar',
    'login.noAccount': 'Não tem uma conta?',
    'login.signUp': 'Cadastre-se',
    'login.or': 'ou',
    'login.createAccount': 'Criar conta',

    // Home Page
    'body.heading.home': 'Bem-vindo à AG Electronics Pvt. Ltd.',
    'body.description.home': 'Seu parceiro de confiança, focado principalmente em software.',

    // About Page
    'body.heading.about': 'Bem-vindo à AG Electronics Pvt. Ltd.',
    'body.description.about': 'As informações serão adicionadas após o registro da empresa.',

    // Authentication Methods
    'auth.google': 'Entrar com o Google',
    'auth.googleSignup': 'Cadastrar com o Google',
    'auth.github': 'Entrar com o GitHub',
    'auth.githubSignup': 'Cadastrar com o GitHub',
    'auth.facebook': 'Entrar com o Facebook',
    'auth.facebookSignup': 'Cadastrar com o Facebook',
    'auth.yahoo': 'Entrar com o Yahoo',
    'auth.yahooSignup': 'Cadastrar com o Yahoo',
    'auth.phone': 'Entrar com número de telefone',
    'auth.phoneSignup': 'Cadastrar com número de telefone',
    'auth.guest': 'Continuar como visitante',
    'auth.guestSignup': 'Continuar como visitante',

    // Phone Authentication
    'phone.enterNumber': 'Digite seu número de telefone:',
    'phone.sendOtp': 'Enviar OTP',
    'phone.enterCode': 'Digite o código de 6 dígitos enviado para o seu telefone:',
    'phone.verifyLogin': 'Verificar e Entrar',
    'phone.useNumber': 'Usar outro número',

    // Modals & Dialogs
    'modal.settings': 'Configurações',
    'modal.phoneLogin': 'Login por Telefone',
    'modal.selectCategory': 'Selecionar categoria',

    // Settings Modal
    'settings.theme': 'Configurações de tema',
    'settings.themeLight': 'Claro',
    'settings.themeDark': 'Escuro',
    'settings.viewMode': 'Modo de visualização',
    'settings.viewModeGrid': '🔲 Grade',
    'settings.viewModeList': '☰ Lista',
    'settings.language': 'Idioma',
    'settings.languageEn': '🇺🇸 English',
    'settings.languageUr': '🇵🇰 اردو',
    'settings.close': 'Fechar configurações',
    'settings.display': 'Configurações de exibição',
    'settings.showEmail': 'Mostrar e-mail no cabeçalho',

    // Product Page
    'product.noProducts': 'Nenhum produto nesta categoria',
    'product.loadingProducts': 'Carregando produtos...',
    'product.wheelHint': '🖱️ Roda do mouse ou clique esquerdo para girar | 🖱️️ Clique direito para todas as categorias',
    'product.viewDetails': 'Ver detalhes',
    'product.price': 'Preço',
    'product.category': 'Categoria',
    'product.description': 'Descrição',
    'product.report': 'Denunciar produto',
    'product.reportReason': 'Motivo da denúncia',
    'product.reportDetails': 'Detalhes (opcional)',
    'product.submitReport': 'Enviar denúncia',

    // Product Details Modal
    'details.name': 'Nome',
    'details.price': 'Preço',
    'details.category': 'Categoria',
    'details.subcategory': 'Subcategoria',
    'details.brand': 'Marca',
    'details.sku': 'SKU',
    'details.stock': 'Estoque',
    'details.stockUnlimited': 'Ilimitado',
    'details.stockUnits': 'unidades',
    'details.rating': 'Avaliação',
    'details.description': 'Descrição',
    'details.tags': 'Tags',
    'details.specs': 'Especificações',
    'details.edit': '✏️ Editar produto',
    'details.visit': '🔗 Visitar página do produto',
    'details.download': '📥 Baixar',

    // Contact Page
    'contact.getInTouch': 'Entre em contato',
    'contact.sendMessage': 'Envie-nos uma mensagem',
    'contact.name': 'Nome',
    'contact.email': 'E-mail',
    'contact.message': 'Mensagem',
    'contact.submitBtn': 'Enviar mensagem',
    'contact.phone': '+92-330-XXXXXXX',
    'contact.location': 'Karachi, Paquistão',
    'contact.emailAddr': 'ag.aliengamerz@gmail.com',

    // Buttons & Controls
    'btn.logout': 'Sair',
    'btn.submit': 'Enviar',
    'btn.cancel': 'Cancelar',
    'btn.close': 'Fechar',
    'btn.yes': 'Sim',
    'btn.no': 'Não',

    // Common Messages
    'msg.loading': 'Carregando...',
    'msg.error': 'Erro',
    'msg.success': 'Sucesso',
    'msg.welcome': 'Bem-vindo',
    'msg.userId': 'ID do usuário',
    'msg.haveAccount': 'Já tem uma conta?',
    },
    ko: {
    // Navigation & Headers
    'nav.home': '홈',
    'nav.about': '회사 소개',
    'nav.products': '제품',
    'nav.privacy': '개인정보 처리방침',
    'nav.contact': '문의하기',
    'nav.controlPanel': '제어판',

    'head.contact': 'AG | 문의하기',
    'head.products': 'AG | 제품',
    'head.about': 'AG | 회사 소개',
    'head.home': 'AG | 홈',

    // Login Page
    'head.welcome': '다시 오신 것을 환영합니다!',
    'login.email': '이메일',
    'login.password': '비밀번호',
    'login.submit': '로그인',
    'login.noAccount': '계정이 없으신가요?',
    'login.signUp': '회원가입',
    'login.or': '또는',
    'login.createAccount': '계정 만들기',

    // Home Page
    'body.heading.home': 'AG Electronics Pvt. Ltd.에 오신 것을 환영합니다',
    'body.description.home': '소프트웨어를 중심으로 신뢰할 수 있는 파트너가 되어 드립니다.',

    // About Page
    'body.heading.about': 'AG Electronics Pvt. Ltd.에 오신 것을 환영합니다',
    'body.description.about': '회사 등록 완료 후 정보가 추가될 예정입니다.',

    // Authentication Methods
    'auth.google': 'Google로 로그인',
    'auth.googleSignup': 'Google로 회원가입',
    'auth.github': 'GitHub로 로그인',
    'auth.githubSignup': 'GitHub로 회원가입',
    'auth.facebook': 'Facebook으로 로그인',
    'auth.facebookSignup': 'Facebook으로 회원가입',
    'auth.yahoo': 'Yahoo로 로그인',
    'auth.yahooSignup': 'Yahoo로 회원가입',
    'auth.phone': '전화번호로 로그인',
    'auth.phoneSignup': '전화번호로 회원가입',
    'auth.guest': '게스트로 계속하기',
    'auth.guestSignup': '게스트로 계속하기',

    // Phone Authentication
    'phone.enterNumber': '전화번호를 입력하세요:',
    'phone.sendOtp': '인증번호 전송',
    'phone.enterCode': '휴대전화로 전송된 6자리 코드를 입력하세요:',
    'phone.verifyLogin': '인증 및 로그인',
    'phone.useNumber': '다른 번호 사용',

    // Modals & Dialogs
    'modal.settings': '설정',
    'modal.phoneLogin': '전화번호 로그인',
    'modal.selectCategory': '카테고리 선택',

    // Settings Modal
    'settings.theme': '테마 설정',
    'settings.themeLight': '라이트 모드',
    'settings.themeDark': '다크 모드',
    'settings.viewMode': '보기 모드',
    'settings.viewModeGrid': '🔲 그리드',
    'settings.viewModeList': '☰ 목록',
    'settings.language': '언어',
    'settings.languageEn': '🇺🇸 English',
    'settings.languageUr': '🇵🇰 اردو',
    'settings.close': '설정 닫기',
    'settings.display': '디스플레이 설정',
    'settings.showEmail': '헤더에 이메일 표시',

    // Product Page
    'product.noProducts': '이 카테고리에 제품이 없습니다',
    'product.loadingProducts': '제품을 불러오는 중...',
    'product.wheelHint': '🖱️️ 마우스 휠 또는 좌클릭으로 회전 | 🖱️ 우클릭으로 전체 카테고리 보기',
    'product.viewDetails': '상세보기',
    'product.price': '가격',
    'product.category': '카테고리',
    'product.description': '설명',
    'product.report': '제품 신고하기',
    'product.reportReason': '신고 사유',
    'product.reportDetails': '세부 내용 (선택 사항)',
    'product.submitReport': '신고 제출',

    // Product Details Modal
    'details.name': '제품명',
    'details.price': '가격',
    'details.category': '카테고리',
    'details.subcategory': '하위 카테고리',
    'details.brand': '브랜드',
    'details.sku': 'SKU',
    'details.stock': '재고',
    'details.stockUnlimited': '무제한',
    'details.stockUnits': '개',
    'details.rating': '평점',
    'details.description': '설명',
    'details.tags': '태그',
    'details.specs': '사양',
    'details.edit': '✏️ 제품 수정',
    'details.visit': '🔗 제품 페이지 방문',
    'details.download': '📥 다운로드',

    // Contact Page
    'contact.getInTouch': '문의하기',
    'contact.sendMessage': '메시지 보내기',
    'contact.name': '이름',
    'contact.email': '이메일',
    'contact.message': '메시지',
    'contact.submitBtn': '메시지 전송',
    'contact.phone': '+92-330-XXXXXXX',
    'contact.location': '카라치, 파키스탄',
    'contact.emailAddr': 'ag.aliengamerz@gmail.com',

    // Buttons & Controls
    'btn.logout': '로그아웃',
    'btn.submit': '제출',
    'btn.cancel': '취소',
    'btn.close': '닫기',
    'btn.yes': '예',
    'btn.no': '아니오',

    // Common Messages
    'msg.loading': '로딩 중...',
    'msg.error': '오류',
    'msg.success': '성공',
    'msg.welcome': '환영합니다',
    'msg.userId': '사용자 ID',
    'msg.haveAccount': '이미 계정이 있으신가요?',
    },
    id: {
    // Navigation & Headers
    'nav.home': 'Beranda',
    'nav.about': 'Tentang Kami',
    'nav.products': 'Produk',
    'nav.privacy': 'Privasi',
    'nav.contact': 'Hubungi Kami',
    'nav.controlPanel': 'Panel Kontrol',

    'head.contact': 'AG | Hubungi Kami',
    'head.products': 'AG | Produk',
    'head.about': 'AG | Tentang Kami',
    'head.home': 'AG | Beranda',

    // Login Page
    'head.welcome': 'Selamat datang kembali!',
    'login.email': 'Email',
    'login.password': 'Kata Sandi',
    'login.submit': 'Masuk',
    'login.noAccount': 'Belum punya akun?',
    'login.signUp': 'Daftar',
    'login.or': 'atau',
    'login.createAccount': 'Buat Akun',

    // Home Page
    'body.heading.home': 'Selamat Datang di AG Electronics Pvt. Ltd.',
    'body.description.home': 'Mitra terpercaya Anda, terutama dalam bidang perangkat lunak.',

    // About Page
    'body.heading.about': 'Selamat Datang di AG Electronics Pvt. Ltd.',
    'body.description.about': 'Informasi akan ditambahkan setelah perusahaan terdaftar.',

    // Authentication Methods
    'auth.google': 'Masuk dengan Google',
    'auth.googleSignup': 'Daftar dengan Google',
    'auth.github': 'Masuk dengan GitHub',
    'auth.githubSignup': 'Daftar dengan GitHub',
    'auth.facebook': 'Masuk dengan Facebook',
    'auth.facebookSignup': 'Daftar dengan Facebook',
    'auth.yahoo': 'Masuk dengan Yahoo',
    'auth.yahooSignup': 'Daftar dengan Yahoo',
    'auth.phone': 'Masuk dengan Nomor Telepon',
    'auth.phoneSignup': 'Daftar dengan Nomor Telepon',
    'auth.guest': 'Lanjutkan sebagai Tamu',
    'auth.guestSignup': 'Lanjutkan sebagai Tamu',

    // Phone Authentication
    'phone.enterNumber': 'Masukkan nomor telepon Anda:',
    'phone.sendOtp': 'Kirim OTP',
    'phone.enterCode': 'Masukkan kode 6 digit yang dikirim ke telepon Anda:',
    'phone.verifyLogin': 'Verifikasi & Masuk',
    'phone.useNumber': 'Gunakan nomor lain',

    // Modals & Dialogs
    'modal.settings': 'Pengaturan',
    'modal.phoneLogin': 'Login Nomor Telepon',
    'modal.selectCategory': 'Pilih Kategori',

    // Settings Modal
    'settings.theme': 'Pengaturan Tema',
    'settings.themeLight': 'Terang',
    'settings.themeDark': 'Gelap',
    'settings.viewMode': 'Mode Tampilan',
    'settings.viewModeGrid': '🔲 Kisi',
    'settings.viewModeList': '☰ Daftar',
    'settings.language': 'Bahasa',
    'settings.languageEn': '🇺🇸 English',
    'settings.languageUr': '🇵🇰 اردو',
    'settings.close': 'Tutup Pengaturan',
    'settings.display': 'Pengaturan Tampilan',
    'settings.showEmail': 'Tampilkan email di header',

    // Product Page
    'product.noProducts': 'Tidak ada produk di kategori ini',
    'product.loadingProducts': 'Memuat produk...',
    'product.wheelHint': '🖱️ Roda mouse atau klik kiri untuk memutar | 🖱️ Klik kanan untuk semua kategori',
    'product.viewDetails': 'Lihat Detail',
    'product.price': 'Harga',
    'product.category': 'Kategori',
    'product.description': 'Deskripsi',
    'product.report': 'Laporkan Produk',
    'product.reportReason': 'Alasan pelaporan',
    'product.reportDetails': 'Detail (opsional)',
    'product.submitReport': 'Kirim Laporan',

    // Product Details Modal
    'details.name': 'Nama',
    'details.price': 'Harga',
    'details.category': 'Kategori',
    'details.subcategory': 'Sub Kategori',
    'details.brand': 'Merek',
    'details.sku': 'SKU',
    'details.stock': 'Stok',
    'details.stockUnlimited': 'Tak Terbatas',
    'details.stockUnits': 'unit',
    'details.rating': 'Penilaian',
    'details.description': 'Deskripsi',
    'details.tags': 'Tag',
    'details.specs': 'Spesifikasi',
    'details.edit': '✏️ Edit Produk',
    'details.visit': '🔗 Kunjungi Halaman Produk',
    'details.download': '📥 Unduh',

    // Contact Page
    'contact.getInTouch': 'Hubungi Kami',
    'contact.sendMessage': 'Kirimkan Pesan',
    'contact.name': 'Nama',
    'contact.email': 'Email',
    'contact.message': 'Pesan',
    'contact.submitBtn': 'Kirim Pesan',
    'contact.phone': '+92-330-XXXXXXX',
    'contact.location': 'Karachi, Pakistan',
    'contact.emailAddr': 'ag.aliengamerz@gmail.com',

    // Buttons & Controls
    'btn.logout': 'Keluar',
    'btn.submit': 'Kirim',
    'btn.cancel': 'Batal',
    'btn.close': 'Tutup',
    'btn.yes': 'Ya',
    'btn.no': 'Tidak',

    // Common Messages
    'msg.loading': 'Memuat...',
    'msg.error': 'Gagal',
    'msg.success': 'Berhasil',
    'msg.welcome': 'Selamat datang',
    'msg.userId': 'ID Pengguna',
    'msg.haveAccount': 'Sudah memiliki akun?',
    },
};

// Merge new phrases into the existing dictionaries rather than replacing them.
for (const language of Object.keys(translations)) {
    Object.assign(translations[language], extraTranslations[language], interfaceTranslations[language], authTranslations[language], siteCopy[language], emailTranslations[language], privacyTranslations[language], loginTranslations[language],notificationTranslations[language],mapTranslations[language],teamTranslations[language],organizationTranslations[language],catalogueTranslations[language],characterTranslations[language]);
    translations[language]['settings.themeLightLegacy'] = translations[language]['settings.themeLight'] + ' Legacy';
    translations[language]['settings.themeDarkLegacy'] = translations[language]['settings.themeDark'] + ' Legacy';
    const dict = translations[language];
    for(const key of ['org.invalid','org.hierarchyError'])dict[key]=dict['msg.error'];
    dict['body.description.about'] = dict['business.description'];
    dict['body.heading.about'] = dict['nav.about'] + ' · AG Home';
    dict['body.description.home'] = dict['business.description'];
    const aliases = {
        'editor.downloadURL': 'link.downloadSite', 'validation.inactiveLink': 'validation.url',
        'auth.accountError': 'msg.error', 'auth.popup': 'auth.reauthenticate', 'auth.cancelled': 'btn.cancel',
        'auth.unavailable': 'msg.error', 'auth.invalidCode': 'phone.enterCode',
        'link.website': 'platform.website', 'link.windows': 'platform.windows', 'link.linux': 'platform.linux',
        'link.chromeOS': 'platform.chromeOS', 'link.android': 'platform.android', 'link.apple': 'platform.apple',
        'report.signIn': 'auth.verificationRequired', 'report.sent': 'msg.success', 'product.retry': 'auth.network',
        'head.privacy': 'nav.privacy'
    };
    for (const [key, source] of Object.entries(aliases)) dict[key] ||= dict[source];
    for (const id of ['windows', 'linux', 'chromeOS', 'android', 'apple']) dict['link.' + id] = dict['platform.' + id] + ' · ' + dict['details.download'].replace(/📥\s*/, '');
}
Object.assign(translations.en, {
    'link.website':'Website Link', 'link.windows':'Windows Download Link', 'link.linux':'Linux Download Link',
    'link.chromeOS':'Chrome OS Link', 'link.android':'Android Application Link', 'link.apple':'Apple Application Link',
    'editor.downloadURL':'Download Website Link'
});
Object.assign(translations.ur, {
    'link.website':'ویب سائٹ کا لنک', 'link.windows':'ونڈوز ڈاؤن لوڈ لنک', 'link.linux':'لینکس ڈاؤن لوڈ لنک',
    'link.chromeOS':'کروم او ایس لنک', 'link.android':'اینڈرائیڈ ایپلیکیشن لنک', 'link.apple':'ایپل ایپلیکیشن لنک',
    'editor.downloadURL':'ڈاؤن لوڈ ویب سائٹ کا لنک'
});
let currentLanguage = 'ur';
try { currentLanguage = localStorage.getItem('language') || 'ur'; } catch {}
if (!LANGUAGES[currentLanguage]) currentLanguage = 'ur';
export function t(key, language = currentLanguage) {
    return translations[language]?.[key] || translations.en[key] || key;
}
export function applyTranslations(language = currentLanguage, root = document) {
    currentLanguage = LANGUAGES[language] ? language : 'en';
    for (const element of root.querySelectorAll('[data-i18n], [data-i18n-placeholder], [data-i18n-aria], [data-i18n-title]')) {
        if (element.dataset.i18nPlaceholder) element.placeholder = t(element.dataset.i18nPlaceholder);
        if (element.dataset.i18nAria) element.setAttribute('aria-label', t(element.dataset.i18nAria));
        if (element.dataset.i18nTitle) element.title = t(element.dataset.i18nTitle);
        const key = element.dataset.i18n;
        if (!key) continue;
        if (['INPUT', 'TEXTAREA'].includes(element.tagName)) element.placeholder = t(key);
        else if (element.children.length) {
            // Preserve checkboxes, icons and other controls inside translated labels.
            let node = [...element.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
            if (node) node.textContent = ' ' + t(key) + ' ';
            else if (!element.querySelector('[data-i18n]')) element.append(document.createTextNode(' ' + t(key)));
        } else element.textContent = t(key);
    }
    document.documentElement.lang = LANGUAGES[currentLanguage][2];
    document.documentElement.dir = LANGUAGES[currentLanguage][1];
    document.body.dataset.language = currentLanguage;
    document.body.style.direction = LANGUAGES[currentLanguage][1];
}
let initialized = false;
export function initLocalization() {
    applyTranslations();
    if (initialized) return;
    initialized = true;
    window.addEventListener('languageChanged', event => applyTranslations(event.detail.language));
    // Translate newly inserted administrative, modal and loading content.
    const observer = new MutationObserver(records => {
        for (const record of records) for (const node of record.addedNodes) {
            if (node.nodeType !== 1) continue;
            if (node.matches('[data-i18n]') && !node.children.length) node.textContent = t(node.dataset.i18n);
            if (node.querySelector('[data-i18n]')) applyTranslations(currentLanguage, node);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
export function setCurrentLanguage(language) {
    currentLanguage = LANGUAGES[language] ? language : 'en';
    try { localStorage.setItem('language', currentLanguage); } catch {}
    applyTranslations();
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: currentLanguage } }));
}
export function getCurrentLanguage() { return currentLanguage; }
export { LANGUAGES };
