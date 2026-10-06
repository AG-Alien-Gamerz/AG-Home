export const PRIVACY_KEYS = ['quickLinks','introduction','information-collection','how-we-use','authentication','data-security','third-parties','user-rights','data-retention','cookies','contact','acknowledgment'];
const copy = {
    en: ['Quick Links','Introduction','Information We Collect','How We Use Information','Authentication','Data Security','Third-Party Services','Your Rights','Data Retention','Cookies','Contact Us','Acknowledgment'],
    ur: ['فوری روابط','تعارف','جمع کردہ معلومات','معلومات کا استعمال','شناخت کی تصدیق','ڈیٹا کی حفاظت','تیسرے فریق کی خدمات','آپ کے حقوق','ڈیٹا محفوظ رکھنا','کوکیز','ہم سے رابطہ','اقرار'],
    ar: ['روابط سريعة','مقدمة','المعلومات التي نجمعها','استخدام المعلومات','المصادقة','أمان البيانات','خدمات الجهات الخارجية','حقوقك','الاحتفاظ بالبيانات','ملفات تعريف الارتباط','اتصل بنا','الإقرار'],
    tr: ['Hızlı bağlantılar','Giriş','Topladığımız bilgiler','Bilgilerin kullanımı','Kimlik doğrulama','Veri güvenliği','Üçüncü taraf hizmetleri','Haklarınız','Veri saklama','Çerezler','İletişim','Onay'],
    ja: ['クイックリンク','はじめに','収集する情報','情報の利用','認証','データの安全性','第三者のサービス','利用者の権利','データの保存','Cookie','お問い合わせ','同意'],
    zh: ['快捷链接','简介','收集的信息','信息使用方式','身份验证','数据安全','第三方服务','您的权利','数据保留','Cookie','联系我们','确认'],
    pa: ['فوری لنک','تعارف','اکٹھی کیتی معلومات','معلومات دی ورتوں','شناخت دی تصدیق','ڈیٹا دی حفاظت','تیجی دھِر دیاں خدمات','تہاڈے حق','ڈیٹا رکھنا','کوکیز','ساڈے نال رابطہ','اقرار'],
    ps: ['چټک لینکونه','پېژندنه','راټول شوي معلومات','د معلوماتو کارول','د هویت تصدیق','د معلوماتو امنیت','د درېیم اړخ خدمتونه','ستاسو حقونه','د معلوماتو ساتل','کوکیز','اړیکه','منل'],
    bal: ['زوت لینک','تعارف','جمع بوتگیں معلومات','معلومات ءِ کارمرز','شناخت ءِ تصدیق','ڈیٹا ءِ حفاظت','دگہ فریق ءِ خدمات','شما ءِ حق','ڈیٹا ءِ نگہداری','کوکیز','رابطہ','اقرار'],
    fr: ['Liens rapides','Introduction','Informations collectées','Utilisation des informations','Authentification','Sécurité des données','Services tiers','Vos droits','Conservation des données','Cookies','Nous contacter','Acceptation'],
    es: ['Enlaces rápidos','Introducción','Información recopilada','Uso de la información','Autenticación','Seguridad de los datos','Servicios de terceros','Tus derechos','Conservación de datos','Cookies','Contacto','Aceptación'],
    de: ['Schnellzugriff','Einleitung','Erfasste Informationen','Verwendung der Informationen','Authentifizierung','Datensicherheit','Dienste Dritter','Ihre Rechte','Datenspeicherung','Cookies','Kontakt','Bestätigung'],
    sd: ['جلدي ڳنڍڻا','تعارف','گڏ ڪيل معلومات','معلومات جو استعمال','سڃاڻپ جي تصديق','ڊيٽا جي حفاظت','ٽئين ڌر جون خدمتون','توهان جا حق','ڊيٽا رکڻ','ڪوڪيز','رابطو ڪريو','اقرار'],
    hnd: ['فوری لنک','تعارف','جمع کیتی معلومات','معلومات دا استعمال','شناخت دی تصدیق','ڈیٹا دی حفاظت','تیجے فریق دیاں خدمات','تہاڈے حق','ڈیٹا رکھنا','کوکیز','ساڈے نال رابطہ','اقرار'],
    skr: ['فوری لنک','تعارف','جمع کیتی معلومات','معلومات دا استعمال','شناخت دی تصدیق','ڈیٹا دی حفاظت','تریجھے فریق دیاں خدمات','تہاݙے حق','ڈیٹا رکھݨ','کوکیز','ساݙے نال رابطہ','اقرار'],
    hi: ['त्वरित लिंक','परिचय','एकत्रित जानकारी','जानकारी का उपयोग','प्रमाणीकरण','डेटा सुरक्षा','तृतीय पक्ष सेवाएँ','आपके अधिकार','डेटा संरक्षण','कुकीज़','संपर्क करें','स्वीकृति'],
    ur_roman: ['Fori links','Taaruf','Jama ki gayi maloomat','Maloomat ka istemal','Shanakht ki tasdeeq','Data ki hifazat','Teesray fareeq ki khidmaat','Aap ke huqooq','Data mehfooz rakhna','Cookies','Hum se rabta','Iqrar'],
    bn: ['দ্রুত লিংক','ভূমিকা','সংগৃহীত তথ্য','তথ্যের ব্যবহার','পরিচয় যাচাই','তথ্যের নিরাপত্তা','তৃতীয় পক্ষের পরিষেবা','আপনার অধিকার','তথ্য সংরক্ষণ','কুকিজ','যোগাযোগ','স্বীকৃতি'],
    ru: ['Быстрые ссылки','Введение','Собираемые сведения','Использование сведений','Аутентификация','Безопасность данных','Сторонние сервисы','Ваши права','Хранение данных','Файлы cookie','Связаться с нами','Подтверждение'],
    it: ['Link rapidi','Introduzione','Informazioni raccolte','Utilizzo delle informazioni','Autenticazione','Sicurezza dei dati','Servizi di terze parti','I tuoi diritti','Conservazione dei dati','Cookie','Contattaci','Accettazione'],
    pt: ['Links rápidos','Introdução','Informações recolhidas','Uso das informações','Autenticação','Segurança dos dados','Serviços de terceiros','Seus direitos','Retenção de dados','Cookies','Contato','Confirmação'],
    ko: ['빠른 링크','소개','수집하는 정보','정보의 이용','인증','데이터 보안','타사 서비스','사용자의 권리','데이터 보관','쿠키','문의하기','동의'],
    id: ['Tautan cepat','Pendahuluan','Informasi yang dikumpulkan','Penggunaan informasi','Autentikasi','Keamanan data','Layanan pihak ketiga','Hak Anda','Penyimpanan data','Cookie','Hubungi kami','Persetujuan']
};
export const privacyTranslations = Object.fromEntries(Object.entries(copy).map(([language, values]) => [language, Object.fromEntries(PRIVACY_KEYS.map((key, index) => ['privacy.' + key, values[index]]))]));
