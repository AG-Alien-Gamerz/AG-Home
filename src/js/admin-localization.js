import { translations, t, getCurrentLanguage, applyTranslations } from './localization.js';
// Administration inherits language preferences; it does not add preference controls.
const keys = ['admin.messages','admin.users','admin.moderators','admin.administrators','admin.super','admin.owner','admin.manage','admin.add','admin.delete','admin.confirm','admin.image','admin.imageURL','admin.upload','admin.save','admin.languageEn','admin.languageUr','admin.json','admin.noData','admin.pending','admin.read','admin.unread','admin.resolved','admin.dismissed','admin.reply','admin.promote','admin.optional'];
const rows = {
en:'Feedback messages|Users|Moderators|Administrators|Super administrator|Owner|Manage|Add|Delete|Confirm this action?|Image|Image URL|Upload image|Save changes|English|Urdu|Enter valid JSON specifications.|Nothing here yet.|Pending|Read|Unread|Resolved|Dismissed|Reply|Promote|Optional',
ur:'رائے کے پیغامات|صارفین|منتظم معاون|منتظمین|اعلیٰ منتظم|مالک|انتظام|شامل کریں|حذف کریں|اس عمل کی تصدیق کریں؟|تصویر|تصویر کا لنک|تصویر اپ لوڈ کریں|تبدیلیاں محفوظ کریں|انگریزی|اردو|درست JSON تفصیلات درج کریں۔|ابھی کوئی اندراج نہیں۔|زیر التوا|پڑھ لیا|بغیر پڑھا|حل شدہ|مسترد|جواب|ترقی دیں|اختیاری',
ar:'رسائل الملاحظات|المستخدمون|المشرفون|المسؤولون|المسؤول الأعلى|المالك|إدارة|إضافة|حذف|تأكيد هذا الإجراء؟|صورة|رابط الصورة|رفع صورة|حفظ التغييرات|الإنجليزية|الأردية|أدخل مواصفات JSON صالحة.|لا توجد بيانات بعد.|قيد الانتظار|مقروء|غير مقروء|تم الحل|مرفوض|رد|ترقية|اختياري',
tr:'Geri bildirim mesajları|Kullanıcılar|Moderatörler|Yöneticiler|Üst yönetici|Sahip|Yönet|Ekle|Sil|Bu işlem onaylansın mı?|Görsel|Görsel URL|Görsel yükle|Değişiklikleri kaydet|İngilizce|Urduca|Geçerli JSON özellikleri girin.|Henüz kayıt yok.|Bekliyor|Okundu|Okunmadı|Çözüldü|Reddedildi|Yanıtla|Yükselt|İsteğe bağlı',
ja:'フィードバック|ユーザー|モデレーター|管理者|最高管理者|所有者|管理|追加|削除|この操作を確認しますか？|画像|画像URL|画像をアップロード|変更を保存|英語|ウルドゥー語|有効なJSON仕様を入力してください。|データはまだありません。|保留|既読|未読|解決済み|却下|返信|昇格|任意',
zh:'反馈消息|用户|版主|管理员|超级管理员|所有者|管理|添加|删除|确认此操作？|图片|图片链接|上传图片|保存更改|英语|乌尔都语|请输入有效的JSON规格。|暂无数据。|待处理|已读|未读|已解决|已忽略|回复|提升|可选',
pa:'رائے دے پیغام|ورتن والے|معاون منتظم|منتظم|وڈا منتظم|مالک|انتظام|شامل کرو|مٹاؤ|ایہ کم پکا کرو؟|تصویر|تصویر دا لنک|تصویر اپ لوڈ کرو|بدلاؤ محفوظ کرو|انگریزی|اردو|درست JSON تفصیل لکھو۔|ہن کوئی اندراج نئیں۔|اُڈیک وچ|پڑھ لیا|نئیں پڑھیا|حل ہویا|رد ہویا|جواب|ترقی دیو|چاہو تے',
ps:'د نظر پیغامونه|کارنان|څارونکي|مدیران|لوی مدیر|مالک|مدیریت|زیات کړئ|ړنګ کړئ|دا کار تاییدوئ؟|انځور|د انځور لینک|انځور پورته کړئ|بدلونونه وساتئ|انګلیسي|اردو|سم JSON مشخصات ولیکئ.|تر اوسه هېڅ نشته.|پاتې|لوستل شوی|نه دی لوستل شوی|حل شوی|رد شوی|ځواب|لوړول|اختیاري',
bal:'رائے ءِ پیغام|کاربر|معاون منتظم|منتظم|مزنین منتظم|مالک|انتظام|شامل کنیت|دور کنیت|اے کار تصدیق کنیت؟|عکس|عکس ءِ لنک|عکس اپ لوڈ کنیت|بدل محفوظ کنیت|انگریزی|اردو|درست JSON تفصیل بنویسیت۔|تاهنوز اندراج نیست۔|انتظار ءَ|وانگ بوتگ|نہ وانگ بوتگ|حل بوتگ|رد بوتگ|جواب|ترقی بدیت|اختیاری',
fr:'Messages de retour|Utilisateurs|Modérateurs|Administrateurs|Super administrateur|Propriétaire|Gérer|Ajouter|Supprimer|Confirmer cette action ?|Image|URL de image|Importer une image|Enregistrer|Anglais|Ourdou|Saisissez des spécifications JSON valides.|Aucune donnée pour le moment.|En attente|Lu|Non lu|Résolu|Rejeté|Répondre|Promouvoir|Facultatif',
es:'Mensajes de opinión|Usuarios|Moderadores|Administradores|Superadministrador|Propietario|Gestionar|Añadir|Eliminar|¿Confirmar esta acción?|Imagen|URL de imagen|Subir imagen|Guardar cambios|Inglés|Urdu|Introduce especificaciones JSON válidas.|Todavía no hay datos.|Pendiente|Leído|Sin leer|Resuelto|Descartado|Responder|Ascender|Opcional',
de:'Feedbacknachrichten|Benutzer|Moderatoren|Administratoren|Superadministrator|Eigentümer|Verwalten|Hinzufügen|Löschen|Diese Aktion bestätigen?|Bild|Bild-URL|Bild hochladen|Änderungen speichern|Englisch|Urdu|Gültige JSON-Spezifikationen eingeben.|Noch keine Daten.|Ausstehend|Gelesen|Ungelesen|Gelöst|Abgelehnt|Antworten|Befördern|Optional',
sd:'راءِ جا پيغام|صارف|معاون منتظم|منتظم|اعليٰ منتظم|مالڪ|انتظام|شامل ڪريو|ختم ڪريو|هن ڪم جي تصديق ڪريو؟|تصوير|تصوير جو لنڪ|تصوير اپ لوڊ ڪريو|تبديليون محفوظ ڪريو|انگريزي|اردو|صحيح JSON تفصيل لکو.|اڃا ڪا داخلا ناهي.|انتظار ۾|پڙهيل|اڻ پڙهيل|حل ٿيل|رد ٿيل|جواب|ترقي ڏيو|اختياري',
hnd:'رائے دے پیغام|صارف|معاون منتظم|منتظم|وڈا منتظم|مالک|انتظام|شامل کرو|مٹاؤ|ایہ کم پکا کرو؟|تصویر|تصویر دا لنک|تصویر اپ لوڈ کرو|بدلاؤ محفوظ کرو|انگریزی|اردو|صحیح JSON تفصیل لکھو۔|ہن کوئی اندراج نئیں۔|اُڈیک وچ|پڑھ لیا|نئیں پڑھیا|حل ہویا|رد ہویا|جواب|ترقی دیو|اختیاری',
skr:'رائے دے پیغام|صارف|معاون منتظم|منتظم|وݙا منتظم|مالک|انتظام|شامل کرو|مٹاؤ|ایہ کم پکا کرو؟|تصویر|تصویر دا لنک|تصویر اپ لوڈ کرو|بدلاؤ محفوظ کرو|انگریزی|اردو|صحیح JSON تفصیل لکھو۔|ہݨ کوئی اندراج کائنی۔|اُڈیک وچ|پڑھ لیا|کائنی پڑھیا|حل تھیا|رد تھیا|جواب|ترقی ݙیو|اختیاری',
hi:'प्रतिक्रिया संदेश|उपयोगकर्ता|मॉडरेटर|प्रशासक|मुख्य प्रशासक|मालिक|प्रबंधित करें|जोड़ें|हटाएँ|इस कार्य की पुष्टि करें?|चित्र|चित्र का लिंक|चित्र अपलोड करें|बदलाव सहेजें|अंग्रेज़ी|उर्दू|सही JSON विवरण दें।|अभी कोई डेटा नहीं है।|लंबित|पढ़ा गया|बिना पढ़ा|हल हुआ|खारिज|जवाब|पदोन्नति|वैकल्पिक',
ur_roman:'Raye ke paighamat|Sarifeen|Madadgar muntazim|Muntazimeen|Aala muntazim|Malik|Intizam|Shamil karein|Hazaf karein|Is amal ki tasdeeq karein?|Tasveer|Tasveer ka link|Tasveer upload karein|Tabdeeliyan mehfooz karein|Angrezi|Urdu|Durust JSON tafseel dein.|Abhi koi indraj nahi.|Zair-e-iltawa|Parh liya|Bina parha|Hal shuda|Mustarad|Jawab|Taraqqi dein|Ikhtiyari',
bn:'মতামতের বার্তা|ব্যবহারকারী|মডারেটর|প্রশাসক|প্রধান প্রশাসক|মালিক|পরিচালনা|যোগ করুন|মুছুন|এই কাজ নিশ্চিত করবেন?|ছবি|ছবির লিঙ্ক|ছবি আপলোড|পরিবর্তন সংরক্ষণ|ইংরেজি|উর্দু|সঠিক JSON বিবরণ দিন।|এখনও কোনো তথ্য নেই।|অপেক্ষমাণ|পঠিত|অপঠিত|সমাধান হয়েছে|বাতিল|জবাব|পদোন্নতি|ঐচ্ছিক',
ru:'Сообщения отзывов|Пользователи|Модераторы|Администраторы|Главный администратор|Владелец|Управление|Добавить|Удалить|Подтвердить действие?|Изображение|URL изображения|Загрузить изображение|Сохранить изменения|Английский|Урду|Введите корректные JSON-характеристики.|Данных пока нет.|Ожидание|Прочитано|Не прочитано|Решено|Отклонено|Ответить|Повысить|Необязательно',
it:'Messaggi di feedback|Utenti|Moderatori|Amministratori|Super amministratore|Proprietario|Gestisci|Aggiungi|Elimina|Confermi questa azione?|Immagine|URL immagine|Carica immagine|Salva modifiche|Inglese|Urdu|Inserisci specifiche JSON valide.|Nessun dato ancora.|In attesa|Letto|Non letto|Risolto|Respinto|Rispondi|Promuovi|Facoltativo',
pt:'Mensagens de opinião|Usuários|Moderadores|Administradores|Superadministrador|Proprietário|Gerir|Adicionar|Excluir|Confirmar esta ação?|Imagem|URL da imagem|Enviar imagem|Salvar alterações|Inglês|Urdu|Digite especificações JSON válidas.|Ainda não há dados.|Pendente|Lido|Não lido|Resolvido|Rejeitado|Responder|Promover|Opcional',
ko:'피드백 메시지|사용자|중재자|관리자|최고 관리자|소유자|관리|추가|삭제|이 작업을 확인할까요?|이미지|이미지 URL|이미지 업로드|변경 저장|영어|우르두어|유효한 JSON 사양을 입력하세요.|아직 데이터가 없습니다.|대기 중|읽음|안 읽음|해결됨|거부됨|답장|승격|선택',
id:'Pesan masukan|Pengguna|Moderator|Administrator|Administrator utama|Pemilik|Kelola|Tambah|Hapus|Konfirmasi tindakan ini?|Gambar|URL gambar|Unggah gambar|Simpan perubahan|Inggris|Urdu|Masukkan spesifikasi JSON valid.|Belum ada data.|Menunggu|Dibaca|Belum dibaca|Selesai|Ditolak|Balas|Promosikan|Opsional'
};
for (const [lang, row] of Object.entries(rows)) {
    const values = row.split('|'); if (values.length !== keys.length) throw new Error('Incomplete admin translations: ' + lang);
    keys.forEach((key, index) => translations[lang][key] = values[index]);
}
const clean = value => value.trim().replace(/[✏️📥🔗👑⚠️✅❌🗑️]/gu, '').replace(/[:*]/g, '').trim().toLowerCase();
const phrases = new Map(Object.entries(translations.en).map(([key, value]) => [clean(value), key]));
const aliases = {
    'home':'nav.home','about us':'nav.about','privacy policy':'nav.privacy','product management':'nav.products','product reports':'product.report','feedback messages':'admin.messages',
    'moderator management':'admin.moderators','admin management':'admin.administrators','super admin management':'admin.super','manage all ranks':'admin.users','owner control':'admin.owner',
    'add product':'admin.add','add new product':'admin.add','edit product':'details.edit','update product':'admin.save','delete product':'admin.delete','add moderator':'admin.add','add new moderator':'admin.add',
    'add admin':'admin.add','add new admin':'admin.add','add super admin':'admin.add','add new super admin':'admin.add','regular admin':'admin.administrators','super admin':'admin.super','moderator':'admin.moderators','user':'admin.users','owner':'admin.owner',
    'image url':'admin.imageURL','product image':'admin.image','image preview':'admin.image','upload image':'admin.upload','image upload':'admin.upload','product name':'details.name','product category':'details.category','price (pkr)':'details.price',
    'product description':'details.description','sub category (optional)':'details.subcategory','sub-category (optional)':'details.subcategory','tags (comma-separated)':'details.tags','specifications (json format)':'details.specs','specifications (json)':'details.specs','email address':'login.email',
    'unlimited (-1)':'details.stockUnlimited','unlimited':'details.stockUnlimited','custom amount':'details.stock','stock quantity':'details.stock','stock availability':'details.stock','rating (0-5)':'details.rating','sku (optional)':'details.sku','brand (optional)':'details.brand',
    'basic information':'details.name','translations':'settings.language','name (english)':'details.name','name (urdu)':'details.name','category (english)':'details.category','category (urdu)':'details.category','description (english)':'details.description','description (urdu)':'details.description',
    'pending':'admin.pending','resolved':'admin.resolved','dismissed':'admin.dismissed','read':'admin.read','unread':'admin.unread','reply':'admin.reply','promote':'admin.promote','remove':'security.remove','delete':'admin.delete','save changes':'admin.save',
    'change role':'admin.changeRole','all status':'admin.allStatus','select...':'admin.choose','custom':'details.stock','email':'login.email','choose image':'admin.upload','image type':'admin.image','price':'details.price','categorization':'details.category','additional details':'admin.details','description & details':'details.description','stock':'details.stock','sku':'details.sku','brand':'details.brand','rating':'details.rating','sub category':'details.subcategory','sub category (sub type)':'details.subcategory',
    'no products found':'product.noProducts','no products yet. add one to get started!':'product.noProducts','no reports found':'admin.noData','no messages yet':'admin.noData','no moderators found':'admin.noData','loading products...':'msg.loading','loading users...':'msg.loading','error loading users':'msg.error','error loading admins':'msg.error','error loading moderators':'msg.error','error loading chat messages':'msg.error',
    'chats':'admin.chats','no image':'admin.noImage','protected':'admin.protected','owner controls':'admin.owner','mark read':'admin.markRead','mark unread':'admin.markUnread','add admin reply':'admin.addReply','reply (email)':'admin.reply','beta':'editor.beta','archived':'admin.archived'
};
Object.entries(aliases).forEach(([phrase, key]) => phrases.set(phrase, key));
function labelKey(text) { return phrases.get(clean(text)); }
export function localizeAdmin(root = document) {
    for (const element of root.querySelectorAll('label, h1, h2, h3, h4, legend, button, .nav-link, header a, option, .loading, .error, .no-messages, .no-products, .no-reports, .no-moderators, .status-badge, .badge, .admin-type, .no-image, .protected-label, .product-card-meta strong, .product-card-category strong')) {
        if (element.dataset.i18n || element.dataset.adminLocalized) continue;
        const textNodes = [...element.childNodes].filter(node => node.nodeType === 3 && node.textContent.trim());
        const text = textNodes.map(node => node.textContent).join(' ').trim();
        const field = element.getAttribute('for')?.replace(/^edit/, '').replace(/^product/i, '').toLowerCase();
        const fieldKeys = {nameen:'details.name',nameur:'details.name',descriptionen:'details.description',descriptionur:'details.description',categoryen:'details.category',categoryur:'details.category',price:'details.price',subcategory:'details.subcategory',tags:'details.tags',sku:'details.sku',brand:'details.brand',stock:'details.stock',rating:'details.rating',specs:'details.specs',imageurl:'admin.imageURL',imagefile:'admin.upload'};
        const key = fieldKeys[field] || labelKey(text);
        if (key) {
            // Compound labels keep translated child spans. Mark the parent too:
            // later DOM mutations must not translate the remaining separator again.
            element.dataset.adminLocalized = 'true';
            const suffix = /\(english\)|(?:name|description|category)en$/i.test(text+' '+field) ? 'admin.languageEn' : /\(urdu\)|اردو|(?:name|description|category)ur$/i.test(text+' '+field) ? 'admin.languageUr' : '';
            if (!element.children.length && !suffix) { element.dataset.i18n = key; element.textContent = t(key); }
            else if (textNodes.length) {
                const span = document.createElement('span'); span.dataset.i18n = key; span.textContent = t(key); textNodes[0].replaceWith(span); textNodes.slice(1).forEach(node => node.remove());
                if (suffix) { const language = document.createElement('small'); language.dataset.i18n = suffix; language.textContent = t(suffix); element.append(' · ', language); }
            }
        }
    }
    for (const input of root.querySelectorAll('input[placeholder],textarea[placeholder]')) {
        if (/^https?:|^\{|^[\d+-]+$/.test(input.placeholder) || input.dataset.i18nPlaceholder) continue;
        const label = input.labels?.[0]?.querySelector('[data-i18n]')?.dataset.i18n || input.labels?.[0]?.dataset.i18n;
        if (label) { input.dataset.i18nPlaceholder = label; input.placeholder = t(label); }
    }
    applyTranslations();
}
export function initAdminLocalization() {
    localizeAdmin();
    new MutationObserver(records => { if (records.some(record => [...record.addedNodes].some(node => node.nodeType === 1 && !node.matches('[data-i18n]')))) localizeAdmin(); }).observe(document.body, { childList: true, subtree: true });
    // Legacy administrative dialogs use canonical localized messages without raw SDK error text.
    const originalAlert = window.alert.bind(window), originalConfirm = window.confirm.bind(window), originalPrompt = window.prompt.bind(window);
    window.alert = message => {
        const source = String(message);
        if (Object.values(translations[getCurrentLanguage()]).includes(source)) { originalAlert(source); return; }
        const key = labelKey(source) || (/success|added|updated|removed|deleted/i.test(source) ? 'msg.success' : /JSON/i.test(source) ? 'admin.json' : /email/i.test(source) ? 'validation.email' : /permission|access|logged in/i.test(source) ? 'auth.verificationRequired' : 'msg.error');
        originalAlert(t(key));
    };
    window.confirm = () => originalConfirm(t('admin.confirm'));
    window.prompt = (message, value) => originalPrompt(t(/reply/i.test(message) ? 'admin.reply' : 'btn.submit'), value);
}
