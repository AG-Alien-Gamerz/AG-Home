export const ORGANIZATION_KEYS=['org.history','org.current','org.former','org.joined','org.left','org.present','org.department','org.team','org.role','org.organization','org.map','org.profile','org.expand','org.collapse','org.reset','org.none','org.noFormer','org.year','org.unspecified','org.parent','org.transferDate','org.initial'];
const rows={
en:'Team History|Current Team|Former Team|Joined|Left|Present|Department|Team|Role|Organization Structure|Mind Map|View Profile|Expand|Collapse|Reset View|No team members match.|No former members.|Year|Unspecified|Parent branch|Transfer date|Initial published profile. Live team data is not available yet.',
ur:'ٹیم کی تاریخ|موجودہ ٹیم|سابقہ ٹیم|شمولیت|رخصتی|تاحال|شعبہ|ٹیم|کردار|تنظیمی ساخت|ذہنی نقشہ|پروفائل دیکھیں|پھیلائیں|سمیٹیں|منظر بحال کریں|کوئی رکن نہیں ملا۔|کوئی سابقہ رکن نہیں۔|سال|غیر متعین|بنیادی شاخ|منتقلی کی تاریخ|ابتدائی شائع شدہ پروفائل۔ لائیو ٹیم ڈیٹا ابھی دستیاب نہیں۔',
ar:'تاريخ الفريق|الفريق الحالي|الأعضاء السابقون|انضم|غادر|حتى الآن|القسم|الفريق|الدور|الهيكل التنظيمي|الخريطة الذهنية|عرض الملف|توسيع|طي|إعادة العرض|لا يوجد أعضاء مطابقون.|لا يوجد أعضاء سابقون.|السنة|غير محدد|الفرع الأب|تاريخ الانتقال|الملف الأولي المنشور. بيانات الفريق المباشرة غير متاحة بعد.',
tr:'Ekip geçmişi|Mevcut ekip|Eski üyeler|Katıldı|Ayrıldı|Günümüz|Departman|Ekip|Rol|Organizasyon yapısı|Zihin haritası|Profili görüntüle|Genişlet|Daralt|Görünümü sıfırla|Eşleşen üye yok.|Eski üye yok.|Yıl|Belirtilmemiş|Üst dal|Transfer tarihi|İlk yayınlanan profil. Canlı ekip verileri henüz mevcut değil.',
ja:'チームの歴史|現在のチーム|元メンバー|加入|退会|現在|部門|チーム|役割|組織構造|マインドマップ|プロフィールを見る|展開|折りたたむ|表示をリセット|該当するメンバーはいません。|元メンバーはいません。|年|未指定|親の枝|異動日|初期公開プロフィール。最新のチームデータはまだ利用できません。',
zh:'团队历史|当前团队|前成员|加入|离开|至今|部门|团队|职务|组织结构|思维导图|查看资料|展开|折叠|重置视图|没有匹配的成员。|没有前成员。|年份|未指定|父分支|调动日期|初始公开资料。实时团队数据尚不可用。',
pa:'ٹیم دی تاریخ|موجودہ ٹیم|سابقہ ٹیم|شمولیت|رخصتی|ہن تک|شعبہ|ٹیم|کردار|تنظیمی بناوٹ|ذہنی نقشہ|پروفائل ویکھو|کھولو|سمیٹو|منظر بحال کرو|کوئی رکن نئیں لبھیا۔|کوئی سابقہ رکن نئیں۔|سال|غیر متعین|بنیادی شاخ|منتقلی دی تاریخ|پہلا شائع پروفائل۔ لائیو ٹیم ڈیٹا ہن دستیاب نئیں۔',
ps:'د ټیم تاریخ|اوسنی ټیم|پخواني غړي|یوځای شو|ولاړ|تر اوسه|څانګه|ټیم|دنده|سازماني جوړښت|ذهني نقشه|پروفایل وګورئ|پراخول|راټولول|لید بېرته برابر کړئ|غړي ونه موندل شول.|پخواني غړي نشته.|کال|نامعلوم|اصلي څانګه|د لېږد نېټه|لومړنی خپور شوی پروفایل. ژوندۍ ټیم معلومات لا نشته.',
bal:'ٹیم ءِ تاریخ|ہنوکیں ٹیم|پیشیں ٹیم|شمولیت|رخصتی|ہنوز|شعبہ|ٹیم|کردار|تنظیمی ساخت|ذہنی نقشہ|پروفائل بچار|پراخ کن|جمع کن|منظر بحال کن|ہچ رکن دست نہ کپت۔|پیشیں رکن نیست۔|سال|نامعلوم|بنیادی شاخ|منتقلی ءِ تاریخ|اولی شائعیں پروفائل۔ لائیو ٹیم ڈیٹا ہنوز دسترس ءَ نیست۔',
fr:'Historique de l’équipe|Équipe actuelle|Anciens membres|Arrivée|Départ|Présent|Département|Équipe|Rôle|Structure de l’organisation|Carte mentale|Voir le profil|Développer|Réduire|Réinitialiser la vue|Aucun membre correspondant.|Aucun ancien membre.|Année|Non précisé|Branche parente|Date de transfert|Profil initial publié. Les données en direct ne sont pas encore disponibles.',
es:'Historia del equipo|Equipo actual|Antiguos miembros|Ingreso|Salida|Presente|Departamento|Equipo|Cargo|Estructura organizativa|Mapa mental|Ver perfil|Expandir|Contraer|Restablecer vista|No hay miembros coincidentes.|No hay antiguos miembros.|Año|Sin especificar|Rama superior|Fecha de traslado|Perfil inicial publicado. Los datos en vivo aún no están disponibles.',
de:'Teamgeschichte|Aktuelles Team|Ehemalige Mitglieder|Beitritt|Austritt|Heute|Abteilung|Team|Rolle|Organisationsstruktur|Mindmap|Profil ansehen|Erweitern|Einklappen|Ansicht zurücksetzen|Keine passenden Mitglieder.|Keine ehemaligen Mitglieder.|Jahr|Nicht angegeben|Übergeordneter Zweig|Wechseldatum|Erstes veröffentlichtes Profil. Live-Teamdaten sind noch nicht verfügbar.',
sd:'ٽيم جي تاريخ|موجوده ٽيم|اڳوڻا رڪن|شموليت|روانگي|اڄ تائين|شعبو|ٽيم|ڪردار|تنظيمي ڍانچو|ذهني نقشو|پروفائيل ڏسو|کوليو|ويڙهيو|ڏيک بحال ڪريو|ڪو رڪن نه مليو.|ڪو اڳوڻو رڪن ناهي.|سال|اڻ ڄاڻايل|بنيادي شاخ|منتقلي جي تاريخ|شروعاتي شايع ٿيل پروفائيل. لائيو ٽيم ڊيٽا اڃا موجود ناهي.',
hnd:'ٹیم دی تاریخ|موجودہ ٹیم|سابقہ ٹیم|شمولیت|رخصتی|ہن تک|شعبہ|ٹیم|کردار|تنظیمی بناوٹ|ذہنی نقشہ|پروفائل ویکھو|کھولو|سمیٹو|منظر بحال کرو|کوئی رکن نئیں لبھیا۔|کوئی سابقہ رکن نئیں۔|سال|غیر متعین|بنیادی شاخ|منتقلی دی تاریخ|پہلا شائع پروفائل۔ لائیو ٹیم ڈیٹا ہن دستیاب نئیں۔',
skr:'ٹیم دی تاریخ|موجودہ ٹیم|سابقہ ٹیم|شمولیت|رخصتی|ہݨ تک|شعبہ|ٹیم|کردار|تنظیمی ساخت|ذہنی نقشہ|پروفائل ݙیکھو|کھولو|سمیٹو|منظر بحال کرو|کوئی رکن کائنی لبھیا۔|کوئی سابقہ رکن کائنی۔|سال|غیر متعین|بنیادی شاخ|منتقلی دی تاریخ|پہلا شائع پروفائل۔ لائیو ٹیم ڈیٹا ہݨ دستیاب کائنی۔',
hi:'टीम का इतिहास|वर्तमान टीम|पूर्व सदस्य|जुड़े|छोड़ा|वर्तमान|विभाग|टीम|भूमिका|संगठन की संरचना|माइंड मैप|प्रोफाइल देखें|विस्तार करें|समेटें|दृश्य रीसेट करें|कोई सदस्य नहीं मिला।|कोई पूर्व सदस्य नहीं है।|वर्ष|अनिर्दिष्ट|मूल शाखा|स्थानांतरण तिथि|प्रारंभिक प्रकाशित प्रोफाइल। लाइव टीम डेटा अभी उपलब्ध नहीं है।',
ur_roman:'Team ki tareekh|Maujooda team|Sabqa team|Shamooliyat|Rukhsati|Ta-haal|Shoba|Team|Kirdar|Tanzeemi saakht|Zehni naqsha|Profile dekhein|Phailayein|Sametein|Manzar bahaal karein|Koi rukan nahi mila.|Koi sabqa rukan nahi.|Saal|Ghair mutayyan|Bunyadi shaakh|Muntaqili ki tareekh|Ibtidai shaya profile. Live team data abhi dastiyab nahi.',
bn:'দলের ইতিহাস|বর্তমান দল|প্রাক্তন সদস্য|যোগদান|বিদায়|বর্তমান|বিভাগ|দল|ভূমিকা|সাংগঠনিক কাঠামো|মাইন্ড ম্যাপ|প্রোফাইল দেখুন|প্রসারিত করুন|সংকুচিত করুন|দৃশ্য রিসেট করুন|কোনো সদস্য মেলেনি।|প্রাক্তন সদস্য নেই।|বছর|অনির্দিষ্ট|মূল শাখা|বদলির তারিখ|প্রাথমিক প্রকাশিত প্রোফাইল। লাইভ দলের তথ্য এখনো উপলব্ধ নয়।',
ru:'История команды|Текущая команда|Бывшие участники|Вступил|Покинул|Настоящее время|Отдел|Команда|Роль|Структура организации|Интеллект-карта|Открыть профиль|Развернуть|Свернуть|Сбросить вид|Участники не найдены.|Нет бывших участников.|Год|Не указано|Родительская ветвь|Дата перевода|Начальный опубликованный профиль. Актуальные данные команды пока недоступны.',
it:'Storia del team|Team attuale|Ex membri|Ingresso|Uscita|Presente|Dipartimento|Team|Ruolo|Struttura organizzativa|Mappa mentale|Visualizza profilo|Espandi|Comprimi|Ripristina vista|Nessun membro corrispondente.|Nessun ex membro.|Anno|Non specificato|Ramo superiore|Data trasferimento|Profilo iniziale pubblicato. I dati aggiornati non sono ancora disponibili.',
pt:'Histórico da equipe|Equipe atual|Ex-membros|Entrada|Saída|Presente|Departamento|Equipe|Função|Estrutura organizacional|Mapa mental|Ver perfil|Expandir|Recolher|Redefinir vista|Nenhum membro correspondente.|Nenhum ex-membro.|Ano|Não especificado|Ramo superior|Data da transferência|Perfil inicial publicado. Os dados ao vivo ainda não estão disponíveis.',
ko:'팀 연혁|현재 팀|이전 구성원|합류|탈퇴|현재|부서|팀|역할|조직 구조|마인드맵|프로필 보기|펼치기|접기|보기 초기화|일치하는 구성원이 없습니다.|이전 구성원이 없습니다.|연도|미지정|상위 가지|이동 날짜|최초 공개 프로필입니다. 실시간 팀 데이터는 아직 없습니다.',
id:'Riwayat tim|Tim saat ini|Mantan anggota|Bergabung|Keluar|Sekarang|Departemen|Tim|Peran|Struktur organisasi|Peta pikiran|Lihat profil|Perluas|Ciutkan|Atur ulang tampilan|Tidak ada anggota yang cocok.|Tidak ada mantan anggota.|Tahun|Belum ditentukan|Cabang induk|Tanggal perpindahan|Profil awal yang diterbitkan. Data tim langsung belum tersedia.'
};
export const organizationTranslations=Object.fromEntries(Object.entries(rows).map(([language,row])=>{
    const values=row.split('|');if(values.length!==ORGANIZATION_KEYS.length)throw Error('Incomplete organization translation: '+language);
    return [language,Object.fromEntries(ORGANIZATION_KEYS.map((key,i)=>[key,values[i]]))];
}));
const branchRows={en:'Frontend|Backend|Design|Frontend Team',ur:'فرنٹ اینڈ|بیک اینڈ|ڈیزائن|فرنٹ اینڈ ٹیم',ar:'الواجهة الأمامية|الخدمات الخلفية|التصميم|فريق الواجهة الأمامية',tr:'Ön yüz|Arka uç|Tasarım|Ön yüz ekibi',ja:'フロントエンド|バックエンド|デザイン|フロントエンドチーム',zh:'前端|后端|设计|前端团队',pa:'فرنٹ اینڈ|بیک اینڈ|ڈیزائن|فرنٹ اینڈ ٹیم',ps:'مخکینۍ برخه|شاتنۍ برخه|ډیزاین|د مخکینۍ برخې ټیم',bal:'فرنٹ اینڈ|بیک اینڈ|ڈیزائن|فرنٹ اینڈ ٹیم',fr:'Frontend|Backend|Design|Équipe frontend',es:'Interfaz|Servidor|Diseño|Equipo de interfaz',de:'Frontend|Backend|Design|Frontend-Team',sd:'فرنٽ اينڊ|بيڪ اينڊ|ڊزائن|فرنٽ اينڊ ٽيم',hnd:'فرنٹ اینڈ|بیک اینڈ|ڈیزائن|فرنٹ اینڈ ٹیم',skr:'فرنٹ اینڈ|بیک اینڈ|ڈیزائن|فرنٹ اینڈ ٹیم',hi:'फ्रंटएंड|बैकएंड|डिजाइन|फ्रंटएंड टीम',ur_roman:'Frontend|Backend|Design|Frontend Team',bn:'ফ্রন্টএন্ড|ব্যাকএন্ড|ডিজাইন|ফ্রন্টএন্ড দল',ru:'Фронтенд|Бэкенд|Дизайн|Команда фронтенда',it:'Frontend|Backend|Design|Team frontend',pt:'Frontend|Backend|Design|Equipe frontend',ko:'프론트엔드|백엔드|디자인|프론트엔드 팀',id:'Frontend|Backend|Desain|Tim frontend'};
const notes={
en:'Joining dates and former memberships remain in history. Changing team requires an actual transfer date; it does not end AG membership.',
ur:'شمولیت کی تاریخ اور سابقہ رکنیت تاریخ میں محفوظ رہتی ہے۔ ٹیم بدلنے کے لیے اصل منتقلی کی تاریخ درکار ہے؛ اس سے AG کی رکنیت ختم نہیں ہوتی۔',
ar:'تبقى تواريخ الانضمام والعضويات السابقة في السجل. تغيير الفريق يتطلب تاريخ انتقال فعلي ولا ينهي عضوية AG.',
tr:'Katılım tarihleri ve geçmiş üyelikler korunur. Ekip değişikliği gerçek transfer tarihi gerektirir; AG üyeliğini bitirmez.',
ja:'加入日と過去の在籍は履歴に残ります。チーム変更には実際の異動日が必要です。AGの在籍は終了しません。',
zh:'加入日期和过去的成员记录会保留。更换团队需要实际调动日期，不会结束AG成员身份。',
pa:'شمولیت دی تاریخ تے سابقہ رکنیت محفوظ رہندی اے۔ ٹیم بدلݨ لئی اصل منتقلی دی تاریخ چاہیدی اے؛ AG دی رکنیت ختم نئیں ہوندی۔',
ps:'د یوځای کېدو نېټې او پخوانۍ غړیتوب ساتل کېږي. د ټیم بدلون اصلي لېږد نېټه غواړي او د AG غړیتوب نه ختموي.',
bal:'شمولیت ءِ تاریخ ءُ پیشیں رکنیت محفوظ بنت۔ ٹیم بدل کنگ ءَ اصل منتقلی ءِ تاریخ درکار انت؛ AG ءِ رکنیت ختم نہ بیت۔',
fr:'Les dates d’arrivée et anciennes affiliations sont conservées. Un changement d’équipe exige une date réelle de transfert et ne termine pas l’appartenance à AG.',
es:'Se conservan las fechas de ingreso y la historia. Cambiar de equipo requiere la fecha real del traslado; no termina la pertenencia a AG.',
de:'Beitrittsdaten und frühere Mitgliedschaften bleiben erhalten. Ein Teamwechsel erfordert das tatsächliche Datum und beendet die AG-Mitgliedschaft nicht.',
sd:'شموليت جون تاريخون ۽ اڳوڻي رڪنيت محفوظ رهن ٿيون. ٽيم بدلائڻ لاءِ اصل منتقلي جي تاريخ گهرجي؛ AG جي رڪنيت ختم نٿي ٿئي.',
hnd:'شمولیت دی تاریخ تے سابقہ رکنیت محفوظ رہندی اے۔ ٹیم بدلنے لئی اصل منتقلی دی تاریخ چاہیدی اے؛ AG دی رکنیت ختم نئیں ہوندی۔',
skr:'شمولیت دی تاریخ تے سابقہ رکنیت محفوظ رہندی اے۔ ٹیم بدلݨ لئی اصل منتقلی دی تاریخ چاہیدی اے؛ AG دی رکنیت ختم کائنی تھیندی۔',
hi:'जुड़ने की तारीखें और पुरानी सदस्यता सुरक्षित रहती हैं। टीम बदलने के लिए वास्तविक स्थानांतरण तिथि चाहिए; AG की सदस्यता समाप्त नहीं होती।',
ur_roman:'Shamooliyat ki tareekh aur sabqa rukniyat mehfooz rehti hai. Team badalne ke liye asal muntaqili ki tareekh chahiye; AG ki rukniyat khatam nahi hoti.',
bn:'যোগদানের তারিখ এবং পুরোনো সদস্যতা সংরক্ষিত থাকে। দল বদলাতে প্রকৃত বদলির তারিখ চাই; AG সদস্যতা শেষ হয় না।',
ru:'Даты вступления и прошлое участие сохраняются. Для смены команды нужна фактическая дата перевода; участие в AG не заканчивается.',
it:'Le date di ingresso e le precedenti appartenenze restano nello storico. Cambiare team richiede la data effettiva del trasferimento e non termina l’appartenenza ad AG.',
pt:'As datas de entrada e antigas associações são preservadas. Mudar de equipe exige a data real da transferência; não encerra a participação na AG.',
ko:'합류 날짜와 이전 소속은 기록에 남습니다. 팀 변경에는 실제 이동 날짜가 필요하며 AG 소속이 종료되지 않습니다.',
id:'Tanggal bergabung dan riwayat keanggotaan tetap disimpan. Perubahan tim memerlukan tanggal perpindahan sebenarnya; tidak mengakhiri keanggotaan AG.'
};
for(const [language,values] of Object.entries(branchRows)){
    const pack=organizationTranslations[language];['org.frontend','org.backend','org.design','org.frontendTeam'].forEach((key,i)=>pack[key]=values.split('|')[i]);
    pack['org.historyNote']=notes[language];pack['org.historyError']=notes[language];
    pack['org.dateError']=`${pack['org.joined']} / ${pack['org.left']} / ${pack['org.transferDate']}`;
}
const skills={en:'Skills',ur:'مہارتیں',ar:'المهارات',tr:'Beceriler',ja:'スキル',zh:'技能',pa:'مہارتاں',ps:'مهارتونه',bal:'مہارتاں',fr:'Compétences',es:'Habilidades',de:'Fähigkeiten',sd:'مهارتون',hnd:'مہارتاں',skr:'مہارتاں',hi:'कौशल',ur_roman:'Maharatain',bn:'দক্ষতা',ru:'Навыки',it:'Competenze',pt:'Competências',ko:'기술',id:'Keahlian'};
for(const [language,value] of Object.entries(skills))organizationTranslations[language]['org.skills']=value;
const errors={
en:'Enter valid dates in chronological order, up to today.|The data changed. Reopen the editor and review before saving.|Use a valid PNG, JPEG or WebP image under 4 MB.',
ur:'آج تک کی درست تاریخیں زمانی ترتیب سے درج کریں۔|ڈیٹا بدل گیا ہے۔ ایڈیٹر دوبارہ کھول کر جائزہ لیں۔|۴ ایم بی سے کم درست PNG، JPEG یا WebP تصویر استعمال کریں۔',
ar:'أدخل تواريخ صحيحة مرتبة حتى اليوم.|تغيرت البيانات. أعد فتح المحرر وراجعها قبل الحفظ.|استخدم صورة PNG أو JPEG أو WebP صحيحة دون 4 ميغابايت.',
tr:'Bugüne kadar geçerli tarihleri sırayla girin.|Veriler değişti. Düzenleyiciyi yeniden açıp kontrol edin.|4 MB altında geçerli PNG, JPEG veya WebP kullanın.',
ja:'今日までの正しい日付を時系列順に入力してください。|データが変更されました。編集画面を開き直して確認してください。|4 MB未満のPNG、JPEG、WebP画像を使用してください。',
zh:'按时间顺序输入截至今天的有效日期。|数据已更改。请重新打开编辑器并检查。|使用小于4 MB的有效PNG、JPEG或WebP图片。',
pa:'اج تک دیاں صحیح تاریخاں ترتیب نال لکھو۔|ڈیٹا بدل گیا اے۔ ایڈیٹر فیر کھول کے ویکھو۔|۴ ایم بی توں گھٹ صحیح PNG، JPEG یا WebP تصویر ورتو۔',
ps:'تر نن پورې سمې نېټې په ترتیب ولیکئ.|معلومات بدل شوي. سمونګر بیا پرانیزئ او وګورئ.|له ۴ MB څخه کوچنی سم PNG، JPEG یا WebP انځور وکاروئ.',
bal:'مروچی تک درستیں تاریخاں ترتیب ءَ بنویس۔|ڈیٹا بدل بوتگ۔ ایڈیٹر دوبارہ کن ءُ بچار۔|۴ ایم بی ءَ کم درستیں PNG، JPEG یا WebP عکس کارمرز کن۔',
fr:'Saisissez des dates valides dans l’ordre, jusqu’à aujourd’hui.|Les données ont changé. Rouvrez l’éditeur et vérifiez.|Utilisez une image PNG, JPEG ou WebP valide de moins de 4 Mo.',
es:'Ingrese fechas válidas en orden, hasta hoy.|Los datos cambiaron. Vuelva a abrir el editor y revise.|Use una imagen PNG, JPEG o WebP válida de menos de 4 MB.',
de:'Gültige Daten bis heute in zeitlicher Reihenfolge eingeben.|Die Daten wurden geändert. Editor erneut öffnen und prüfen.|Ein gültiges PNG-, JPEG- oder WebP-Bild unter 4 MB verwenden.',
sd:'اڄ تائين صحيح تاريخون ترتيب سان لکو.|ڊيٽا بدلجي وئي. ايڊيٽر ٻيهر کولي ڏسو.|۴ ايم بي کان گهٽ صحيح PNG، JPEG يا WebP تصوير استعمال ڪريو.',
hnd:'اج تک دیاں صحیح تاریخاں ترتیب نال لکھو۔|ڈیٹا بدل گیا اے۔ ایڈیٹر فیر کھول کے ویکھو۔|۴ ایم بی توں گھٹ صحیح PNG، JPEG یا WebP تصویر ورتو۔',
skr:'اڄ تک دیاں صحیح تاریخاں ترتیب نال لکھو۔|ڈیٹا بدل گیا اے۔ ایڈیٹر ول کھول کے ݙیکھو۔|۴ ایم بی توں گھٹ صحیح PNG، JPEG یا WebP تصویر ورتو۔',
hi:'आज तक की सही तारीखें कालक्रम में दर्ज करें।|डेटा बदल गया है। संपादक फिर खोलकर जाँचें।|4 MB से छोटी सही PNG, JPEG या WebP तस्वीर इस्तेमाल करें।',
ur_roman:'Aaj tak ki durust tareekhein tarteeb se likhein.|Data badal gaya. Editor dobara khol kar jaiza lein.|4 MB se kam durust PNG, JPEG ya WebP tasveer dein.',
bn:'আজ পর্যন্ত বৈধ তারিখগুলি ক্রমানুসারে দিন।|তথ্য বদলেছে। সম্পাদক আবার খুলে যাচাই করুন।|4 MB-এর কম বৈধ PNG, JPEG বা WebP ছবি ব্যবহার করুন।',
ru:'Введите правильные даты до сегодняшнего дня по порядку.|Данные изменились. Откройте редактор заново и проверьте.|Используйте корректное изображение PNG, JPEG или WebP меньше 4 МБ.',
it:'Inserisci date valide in ordine fino a oggi.|I dati sono cambiati. Riapri l’editor e controlla.|Usa un’immagine PNG, JPEG o WebP valida sotto 4 MB.',
pt:'Informe datas válidas em ordem, até hoje.|Os dados mudaram. Reabra o editor e confira.|Use uma imagem PNG, JPEG ou WebP válida com menos de 4 MB.',
ko:'오늘까지의 유효한 날짜를 시간순으로 입력하세요.|데이터가 변경되었습니다. 편집기를 다시 열어 확인하세요.|4 MB 미만의 유효한 PNG, JPEG 또는 WebP 이미지를 사용하세요.',
id:'Masukkan tanggal yang valid berurutan hingga hari ini.|Data berubah. Buka kembali editor dan periksa.|Gunakan gambar PNG, JPEG atau WebP valid di bawah 4 MB.'
};
for(const [language,row] of Object.entries(errors))['org.dateError','org.conflict','org.imageError'].forEach((key,i)=>organizationTranslations[language][key]=row.split('|')[i]);
