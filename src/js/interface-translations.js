export const INTERFACE_KEYS = ['report.select','report.inappropriate','report.fake','report.misleading','report.broken_link','report.spam','report.offensive','report.other','admin.reviewed','admin.changeRole','admin.choose','admin.allStatus','admin.details'];
const rows = {
en:'Select a reason|Inappropriate content|Counterfeit product|Misleading information|Broken link or download|Spam|Offensive material|Other|Reviewed|Change role|Select…|All statuses|Details',
ur:'وجہ منتخب کریں|نامناسب مواد|جعلی پروڈکٹ|گمراہ کن معلومات|خراب لنک یا ڈاؤن لوڈ|غیر ضروری پیغامات|توہین آمیز مواد|دیگر|جائزہ لیا گیا|کردار تبدیل کریں|منتخب کریں…|تمام حالتیں|تفصیلات',
ar:'اختر السبب|محتوى غير مناسب|منتج مزيف|معلومات مضللة|رابط أو تنزيل معطل|رسائل مزعجة|محتوى مسيء|أخرى|تمت المراجعة|تغيير الدور|اختر…|جميع الحالات|التفاصيل',
tr:'Neden seçin|Uygunsuz içerik|Sahte ürün|Yanıltıcı bilgi|Bozuk bağlantı veya indirme|İstenmeyen mesaj|Saldırgan içerik|Diğer|İncelendi|Rolü değiştir|Seçin…|Tüm durumlar|Ayrıntılar',
ja:'理由を選択|不適切な内容|偽造品|誤解を招く情報|リンクやダウンロードの不具合|迷惑行為|攻撃的な内容|その他|確認済み|役割を変更|選択…|すべての状態|詳細',
zh:'选择原因|不当内容|假冒产品|误导信息|链接或下载失效|垃圾信息|冒犯性内容|其他|已审核|更改角色|选择…|所有状态|详情',
pa:'وجہ چُنو|نامناسب مواد|جعلی پروڈکٹ|گمراہ کرن والی معلومات|خراب لنک یا ڈاؤن لوڈ|فضول پیغام|توہین والا مواد|ہور|جائزہ لیا گیا|کردار بدلو|چُنو…|ساریاں حالتاں|تفصیل',
ps:'دلیل وټاکئ|نامناسب مواد|جعلي محصول|ګمراه کوونکي معلومات|خراب لینک یا ډاونلوډ|بې ځایه پیغامونه|سپکوونکي مواد|نور|کتل شوی|دنده بدله کړئ|وټاکئ…|ټول حالتونه|تفصیل',
bal:'سبب انتخاب کنیت|نامناسب مواد|جعلی پروڈکٹ|گمراہ کن معلومات|خراب لنک یا ڈاؤن لوڈ|بے فائدہ پیغام|توہین آمیز مواد|دگہ|جائزہ گپتگ|کردار بدل کنیت|انتخاب کنیت…|درست حالت|تفصیل',
fr:'Choisir un motif|Contenu inapproprié|Produit contrefait|Information trompeuse|Lien ou téléchargement défectueux|Messages indésirables|Contenu offensant|Autre|Examiné|Changer le rôle|Sélectionner…|Tous les statuts|Détails',
es:'Selecciona un motivo|Contenido inapropiado|Producto falsificado|Información engañosa|Enlace o descarga dañados|Correo no deseado|Contenido ofensivo|Otro|Revisado|Cambiar rol|Seleccionar…|Todos los estados|Detalles',
de:'Grund auswählen|Unangemessener Inhalt|Gefälschtes Produkt|Irreführende Information|Defekter Link oder Download|Spam|Beleidigender Inhalt|Sonstiges|Geprüft|Rolle ändern|Auswählen…|Alle Status|Details',
sd:'سبب چونڊيو|نامناسب مواد|جعلي پراڊڪٽ|گمراهه ڪندڙ ڄاڻ|خراب لنڪ يا ڊائون لوڊ|غيرضروري پيغام|توھين وارو مواد|ٻيو|جائزو ورتل|ڪردار بدلايو|چونڊيو…|سڀ حالتون|تفصيل',
hnd:'وجہ چُنو|نامناسب مواد|جعلی پروڈکٹ|گمراہ کرن والی معلومات|خراب لنک یا ڈاؤن لوڈ|فضول پیغام|توہین والا مواد|ہور|جائزہ لیا گیا|کردار بدلو|چُنو…|ساریاں حالتاں|تفصیل',
skr:'وجہ چُݨو|نامناسب مواد|جعلی پروڈکٹ|گمراہ کرݨ والی معلومات|خراب لنک یا ڈاؤن لوڈ|فضول پیغام|توہین والا مواد|ٻیا|جائزہ گھدا گیا|کردار بدلو|چُݨو…|ساریاں حالتاں|تفصیل',
hi:'कारण चुनें|अनुचित सामग्री|नकली उत्पाद|भ्रामक जानकारी|खराब लिंक या डाउनलोड|अनचाहे संदेश|आपत्तिजनक सामग्री|अन्य|समीक्षित|भूमिका बदलें|चुनें…|सभी स्थितियाँ|विवरण',
ur_roman:'Wajah chunain|Na munasib mawad|Jali product|Gumrah kun maloomat|Kharab link ya download|Fazool paighamat|Tauheen amez mawad|Doosra|Jaiza liya gaya|Kirdar badlein|Chunain…|Tamam halatein|Tafseel',
bn:'কারণ নির্বাচন করুন|অনুপযুক্ত বিষয়বস্তু|নকল পণ্য|বিভ্রান্তিকর তথ্য|ভাঙা লিঙ্ক বা ডাউনলোড|অবাঞ্ছিত বার্তা|আপত্তিকর বিষয়বস্তু|অন্যান্য|পর্যালোচিত|ভূমিকা বদলান|নির্বাচন…|সমস্ত অবস্থা|বিবরণ',
ru:'Выберите причину|Неподходящий контент|Поддельный продукт|Вводящая в заблуждение информация|Неработающая ссылка или загрузка|Спам|Оскорбительный контент|Другое|Проверено|Изменить роль|Выберите…|Все статусы|Подробности',
it:'Seleziona un motivo|Contenuto inappropriato|Prodotto contraffatto|Informazioni ingannevoli|Link o download non funzionante|Messaggi indesiderati|Materiale offensivo|Altro|Esaminato|Cambia ruolo|Seleziona…|Tutti gli stati|Dettagli',
pt:'Selecione um motivo|Conteúdo inadequado|Produto falsificado|Informações enganosas|Link ou download com erro|Mensagens indesejadas|Material ofensivo|Outro|Analisado|Alterar função|Selecionar…|Todos os estados|Detalhes',
ko:'사유 선택|부적절한 콘텐츠|위조 제품|오해를 부르는 정보|링크 또는 다운로드 오류|스팸|불쾌한 콘텐츠|기타|검토됨|역할 변경|선택…|모든 상태|세부 정보',
id:'Pilih alasan|Konten tidak pantas|Produk palsu|Informasi menyesatkan|Tautan atau unduhan rusak|Pesan sampah|Materi menyinggung|Lainnya|Ditinjau|Ubah peran|Pilih…|Semua status|Detail'
};
export const interfaceTranslations = Object.fromEntries(Object.entries(rows).map(([language, row]) => {
    const values = row.split('|');
    if (values.length !== INTERFACE_KEYS.length) throw new Error('Incomplete interface translations: ' + language);
    return [language, Object.fromEntries(INTERFACE_KEYS.map((key, index) => [key, values[index]]))];
}));
const adminKeys=['admin.chats','admin.noImage','admin.added','admin.by','admin.joined','admin.protected','admin.archived','admin.markRead','admin.markUnread','admin.addReply','editor.beta'];
const adminRows={
en:'Chats|No image|Added|By|Joined|Protected|Archived|Mark read|Mark unread|Add reply|Beta',
ur:'گفتگو|تصویر نہیں|شامل کیا گیا|بذریعہ|شمولیت|محفوظ|محفوظ شدہ پیغام|پڑھا ہوا نشان لگائیں|بغیر پڑھا نشان لگائیں|جواب شامل کریں|آزمائشی',
ar:'المحادثات|لا توجد صورة|أضيف|بواسطة|انضم|محمي|مؤرشف|تحديد كمقروء|تحديد كغير مقروء|إضافة رد|تجريبي',
tr:'Sohbetler|Görsel yok|Eklendi|Tarafından|Katıldı|Korumalı|Arşivlendi|Okundu işaretle|Okunmadı işaretle|Yanıt ekle|Deneme',
ja:'チャット|画像なし|追加|担当|参加|保護対象|アーカイブ済み|既読にする|未読にする|返信を追加|ベータ',
zh:'聊天|无图片|添加于|操作人|加入于|受保护|已归档|标记已读|标记未读|添加回复|测试版',
pa:'گلاں باتاں|تصویر نئیں|شامل کیتا|ولوں|شمولیت|محفوظ|محفوظ پیغام|پڑھیا نشان لاؤ|نئیں پڑھیا نشان لاؤ|جواب شامل کرو|آزمائشی',
ps:'خبرې|انځور نشته|زیات شوی|له خوا|ګډون|خوندي|آرشیف شوی|لوستل شوی نښه کړئ|نه لوستل شوی نښه کړئ|ځواب زیات کړئ|ازمایښتي',
bal:'گپ شپ|عکس نیست|شامل بوتگ|پہ|شامل بوتگ|محفوظ|محفوظ پیغام|وانگ بوتگ نشان کنیت|نہ وانگ بوتگ نشان کنیت|جواب شامل کنیت|آزمائشی',
fr:'Discussions|Aucune image|Ajouté|Par|Inscrit|Protégé|Archivé|Marquer lu|Marquer non lu|Ajouter une réponse|Bêta',
es:'Chats|Sin imagen|Añadido|Por|Se unió|Protegido|Archivado|Marcar leído|Marcar sin leer|Añadir respuesta|Beta',
de:'Chats|Kein Bild|Hinzugefügt|Von|Beigetreten|Geschützt|Archiviert|Als gelesen markieren|Als ungelesen markieren|Antwort hinzufügen|Beta',
sd:'ڳالھ ٻولھ|تصوير ناهي|شامل ٿيل|پاران|شموليت|محفوظ|محفوظ پيغام|پڙهيل نشان لڳايو|اڻ پڙهيل نشان لڳايو|جواب شامل ڪريو|آزمائشي',
hnd:'گلاں باتاں|تصویر نئیں|شامل کیتا|ولوں|شمولیت|محفوظ|محفوظ پیغام|پڑھیا نشان لاؤ|نئیں پڑھیا نشان لاؤ|جواب شامل کرو|آزمائشی',
skr:'گلاں باتاں|تصویر کائنی|شامل کیتا|ولوں|شمولیت|محفوظ|محفوظ پیغام|پڑھیا نشان لاؤ|کائنی پڑھیا نشان لاؤ|جواب شامل کرو|آزمائشی',
hi:'चैट|चित्र नहीं|जोड़ा गया|द्वारा|शामिल हुए|सुरक्षित|संग्रहीत|पढ़ा हुआ चिह्नित करें|बिना पढ़ा चिह्नित करें|जवाब जोड़ें|परीक्षण',
ur_roman:'Guftagu|Tasveer nahi|Shamil kiya gaya|Ba zariya|Shamooliyat|Mehfooz|Mehfooz paigham|Parha hua nishan lagayein|Bina parha nishan lagayein|Jawab shamil karein|Azmaishi',
bn:'চ্যাট|ছবি নেই|যোগ হয়েছে|দ্বারা|যোগদান|সুরক্ষিত|সংরক্ষিত|পঠিত চিহ্নিত করুন|অপঠিত চিহ্নিত করুন|জবাব যোগ করুন|পরীক্ষামূলক',
ru:'Чаты|Нет изображения|Добавлено|Автор|Регистрация|Защищено|В архиве|Отметить прочитанным|Отметить непрочитанным|Добавить ответ|Бета',
it:'Chat|Nessuna immagine|Aggiunto|Da|Iscritto|Protetto|Archiviato|Segna come letto|Segna come non letto|Aggiungi risposta|Beta',
pt:'Conversas|Sem imagem|Adicionado|Por|Inscrito|Protegido|Arquivado|Marcar como lido|Marcar como não lido|Adicionar resposta|Beta',
ko:'채팅|이미지 없음|추가됨|작성자|가입|보호됨|보관됨|읽음으로 표시|안 읽음으로 표시|답장 추가|베타',
id:'Obrolan|Tanpa gambar|Ditambahkan|Oleh|Bergabung|Dilindungi|Diarsipkan|Tandai dibaca|Tandai belum dibaca|Tambah balasan|Beta'
};
for(const [language,row] of Object.entries(adminRows)){
    const values=row.split('|');if(values.length!==adminKeys.length)throw new Error('Incomplete administrative phrases: '+language);
    adminKeys.forEach((key,index)=>interfaceTranslations[language][key]=values[index]);
}
