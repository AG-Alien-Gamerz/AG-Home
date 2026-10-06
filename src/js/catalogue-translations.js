// Product relationships use the existing language selection and direction rules.
// Operating-system and AG product names remain proper nouns.
export const CATALOGUE_KEYS = [
    'catalogue.builtBy', 'catalogue.developedProducts', 'catalogue.teams', 'catalogue.products',
    'catalogue.searchMap', 'catalogue.noMatches', 'catalogue.viewProduct', 'catalogue.viewTeam',
    'catalogue.developmentCategories', 'catalogue.owners', 'catalogue.unassigned',
    'catalogue.linkPending', 'catalogue.pendingDescription', 'catalogue.initialize',
    'catalogue.initialized', 'catalogue.initialWarning', 'catalogue.confirmedProjects',
    'catalogue.version', 'catalogue.platform', 'catalogue.metadataOnly', 'catalogue.metadataNote',
    'catalogue.pendingLink', 'catalogue.initializeError', 'catalogue.editRelationships',
    'catalogue.noOwners', 'catalogue.ownerHint', 'catalogue.releasePending',
    'catalogue.catalogueLoadError', 'catalogue.viewProfile', 'catalogue.responsibilities',
    'catalogue.noProducts'
];
const rows = {
    en: 'Built by|Products developed|Teams / Departments|Products|Search products, people, departments or platforms|No matching results.|View Product|View Team|Development areas|Responsible members|Unassigned|Release links are not published yet.|Details and links will be published when available.|Import confirmed projects|Confirmed projects saved.|Confirmed catalogue supplied by AG. Some records still need their published details and links.|Confirmed projects|Version|Platform|Details pending|Keep this project visible until its real website or download links are available.|Links not published yet|The confirmed projects could not be saved. Please try again.|Edit product responsibility|No responsible member has been assigned.|Assign responsibility to real Team records. This does not grant staff access.|Release links are not published yet.|Saved changes could not be loaded. Showing confirmed project metadata.|View Profile|Areas of responsibility|No associated products yet.',
    ur: 'تیار کردہ|تیار کردہ مصنوعات|ٹیمیں / شعبے|مصنوعات|مصنوعات، افراد، شعبے یا پلیٹ فارم تلاش کریں|کوئی نتیجہ نہیں ملا۔|مصنوع دیکھیں|ٹیم دیکھیں|ترقی کے شعبے|ذمہ دار ارکان|غیر متعین|ریلیز کے لنکس ابھی شائع نہیں ہوئے۔|تفصیلات اور لنکس دستیاب ہونے پر شائع کیے جائیں گے۔|تصدیق شدہ منصوبے شامل کریں|تصدیق شدہ منصوبے محفوظ ہو گئے۔|AG کی فراہم کردہ تصدیق شدہ فہرست۔ کچھ ریکارڈز کی تفصیلات اور لنکس ابھی شائع ہونا باقی ہیں۔|تصدیق شدہ منصوبے|ورژن|پلیٹ فارم|تفصیلات جلد دستیاب ہوں گی|اصل ویب سائٹ یا ڈاؤن لوڈ لنکس دستیاب ہونے تک اس منصوبے کو دکھاتے رہیں۔|لنکس ابھی شائع نہیں ہوئے|تصدیق شدہ منصوبے محفوظ نہیں ہو سکے۔ دوبارہ کوشش کریں۔|مصنوع کی ذمہ داری میں ترمیم کریں|ابھی کوئی ذمہ دار رکن متعین نہیں کیا گیا۔|ٹیم کے حقیقی ریکارڈز کو ذمہ داری دیں۔ اس سے انتظامی رسائی نہیں ملتی۔|ریلیز کے لنکس ابھی شائع نہیں ہوئے۔|محفوظ تبدیلیاں لوڈ نہیں ہو سکیں۔ تصدیق شدہ منصوبوں کی معلومات دکھائی جا رہی ہیں۔|پروفائل دیکھیں|ذمہ داری کے شعبے|ابھی کوئی متعلقہ مصنوع نہیں۔',
    ar: 'طوّره|المنتجات المطوّرة|الفرق / الأقسام|المنتجات|ابحث عن منتجات أو أشخاص أو أقسام أو منصات|لا توجد نتائج مطابقة.|عرض المنتج|عرض الفريق|مجالات التطوير|الأعضاء المسؤولون|غير معيّن|لم تُنشر روابط الإصدار بعد.|ستُنشر التفاصيل والروابط عند توفرها.|استيراد المشاريع المؤكدة|حُفظت المشاريع المؤكدة.|قائمة مؤكدة مقدمة من AG. لا تزال بعض السجلات بحاجة إلى نشر تفاصيلها وروابطها.|المشاريع المؤكدة|الإصدار|المنصة|التفاصيل قيد الإعداد|أبقِ المشروع ظاهرًا حتى تتوفر روابط الموقع أو التنزيل الفعلية.|الروابط غير منشورة بعد|تعذر حفظ المشاريع المؤكدة. حاول مجددًا.|تعديل مسؤولية المنتج|لم يُعيّن عضو مسؤول بعد.|عيّن المسؤولية لسجلات الفريق الحقيقية. لا يمنح ذلك صلاحيات الموظفين.|لم تُنشر روابط الإصدار بعد.|تعذر تحميل التغييرات المحفوظة. تُعرض معلومات المشاريع المؤكدة.|عرض الملف|مجالات المسؤولية|لا توجد منتجات مرتبطة بعد.',
    tr: 'Geliştiren|Geliştirilen ürünler|Ekipler / Departmanlar|Ürünler|Ürün, kişi, departman veya platform ara|Eşleşen sonuç yok.|Ürünü görüntüle|Ekibi görüntüle|Geliştirme alanları|Sorumlu üyeler|Atanmamış|Sürüm bağlantıları henüz yayımlanmadı.|Ayrıntılar ve bağlantılar hazır olduğunda yayımlanacak.|Doğrulanmış projeleri içe aktar|Doğrulanmış projeler kaydedildi.|AG tarafından sağlanan doğrulanmış katalog. Bazı kayıtların ayrıntı ve bağlantıları henüz yayımlanmadı.|Doğrulanmış projeler|Sürüm|Platform|Ayrıntılar bekleniyor|Gerçek web veya indirme bağlantıları hazır olana kadar projeyi görünür tut.|Bağlantılar henüz yayımlanmadı|Doğrulanmış projeler kaydedilemedi. Tekrar deneyin.|Ürün sorumluluğunu düzenle|Henüz sorumlu üye atanmamış.|Sorumluluğu gerçek ekip kayıtlarına atayın. Bu işlem personel erişimi vermez.|Sürüm bağlantıları henüz yayımlanmadı.|Kayıtlı değişiklikler yüklenemedi. Doğrulanmış proje bilgileri gösteriliyor.|Profili görüntüle|Sorumluluk alanları|Henüz ilişkili ürün yok.',
    ja: '開発者|開発した製品|チーム / 部門|製品|製品、メンバー、部門、プラットフォームを検索|一致する結果はありません。|製品を見る|チームを見る|開発分野|担当メンバー|未割り当て|リリースのリンクはまだ公開されていません。|詳細とリンクは準備ができ次第公開します。|確認済みプロジェクトを取り込む|確認済みプロジェクトを保存しました。|AGが提供した確認済みカタログです。一部の詳細とリンクはまだ公開されていません。|確認済みプロジェクト|バージョン|プラットフォーム|詳細は準備中|実際のウェブサイトやダウンロードのリンクが用意されるまでプロジェクトを表示します。|リンクは未公開|確認済みプロジェクトを保存できませんでした。再試行してください。|製品の担当を編集|担当メンバーはまだ割り当てられていません。|実在するチームメンバーに担当を割り当てます。スタッフ権限は付与されません。|リリースのリンクはまだ公開されていません。|保存した変更を読み込めませんでした。確認済みのプロジェクト情報を表示しています。|プロフィールを見る|担当分野|関連する製品はまだありません。',
    zh: '开发者|开发的产品|团队 / 部门|产品|搜索产品、成员、部门或平台|没有匹配的结果。|查看产品|查看团队|开发领域|负责成员|未分配|发布链接尚未公布。|详细信息和链接将在可用时公布。|导入已确认项目|已保存已确认项目。|AG提供的已确认目录。部分记录的详细信息和链接尚待公布。|已确认项目|版本|平台|详情待公布|在真实的网站或下载链接可用前，继续显示该项目。|链接尚未公布|无法保存已确认项目。请重试。|编辑产品责任分配|尚未分配负责成员。|将责任分配给真实的团队成员记录。这不会授予员工权限。|发布链接尚未公布。|无法加载保存的更改。正在显示已确认的项目资料。|查看资料|职责领域|尚无关联产品。',
    pa: 'تیار کرن والا|تیار کیتیاں مصنوعات|ٹیمیں / شعبے|مصنوعات|مصنوعات، بندے، شعبے یا پلیٹ فارم لبھو|کوئی نتیجہ نئیں لبھیا۔|مصنوع ویکھو|ٹیم ویکھو|تیاری دے شعبے|ذمہ دار رکن|غیر متعین|ریلیز دے لنک ہن شائع نئیں ہوئے۔|تفصیل تے لنک ملن تے شائع کیتے جان گے۔|تصدیق شدہ منصوبے شامل کرو|تصدیق شدہ منصوبے محفوظ ہو گئے۔|AG دی دتی تصدیق شدہ فہرست۔ کجھ ریکارڈاں دی تفصیل تے لنک ہن شائع ہونے باقی نیں۔|تصدیق شدہ منصوبے|ورژن|پلیٹ فارم|تفصیل دی اُڈیک|اصل ویب سائٹ یا ڈاؤن لوڈ لنک ملن تک منصوبہ وکھاندے رہو۔|لنک ہن شائع نئیں ہوئے|تصدیق شدہ منصوبے محفوظ نئیں ہوئے۔ فیر کوشش کرو۔|مصنوع دی ذمہ داری بدلو|ہن کوئی ذمہ دار رکن متعین نئیں۔|ٹیم دے اصلی ریکارڈاں نوں ذمہ داری دیو۔ ایس نال انتظامی رسائی نئیں ملدی۔|ریلیز دے لنک ہن شائع نئیں ہوئے۔|محفوظ تبدیلیاں لوڈ نئیں ہو سکیاں۔ تصدیق شدہ منصوبیاں دی معلومات دکھائی جا رہی اے۔|پروفائل ویکھو|ذمہ داری دے شعبے|ہن کوئی متعلقہ مصنوع نئیں۔',
    ps: 'جوړوونکی|جوړ شوي محصولات|ټیمونه / څانګې|محصولات|محصولات، کسان، څانګې یا پلیټفارمونه ولټوئ|سمون لرونکې پایلې نشته.|محصول وګورئ|ټیم وګورئ|د پراختیا برخې|مسؤول غړي|نه دی ټاکل شوی|د خپرونې لینکونه لا نه دي خپاره شوي.|تفصیل او لینکونه به د شتون پر مهال خپاره شي.|تایید شوې پروژې ورزیاتې کړئ|تایید شوې پروژې خوندي شوې.|د AG تایید شوی لړلیک. د ځینو ریکارډونو تفصیل او لینکونه لا خپاره شوي نه دي.|تایید شوې پروژې|نسخه|پلیټفارم|تفصیل ته انتظار|پروژه تر هغه ښکاره وساتئ چې اصلي وېب یا ډاونلوډ لینکونه چمتو شي.|لینکونه لا نه دي خپاره شوي|تایید شوې پروژې خوندي نه شوې. بیا هڅه وکړئ.|د محصول مسؤولیت بدل کړئ|مسؤول غړی لا نه دی ټاکل شوی.|مسؤولیت د ټیم ریښتینو غړو ته ورکړئ. دا د کارکوونکو لاسرسی نه ورکوي.|د خپرونې لینکونه لا نه دي خپاره شوي.|خوندي شوي بدلونونه نه پورته کېږي. تایید شوي پروژې ښودل کېږي.|پروفایل وګورئ|د مسؤولیت برخې|اړوند محصولات لا نشته.',
    bal: 'جوڑ کنوک|جوڑ بوتگیں مصنوعات|ٹیمان / شعبہان|مصنوعات|مصنوعات، مردم، شعبہ یا پلیٹ فارم شوہاز کنیت|ہچ نتیجہ دست نہ کپت۔|مصنوع بچار|ٹیم بچار|جوڑ کنگ ءِ شعبہان|ذمہ دار رکنان|نامقرر|ریلیز ءِ لنک ہنوز شائع نہ بوتگ۔|تفصیل ءُ لنک دسترس ءَ بیاینت تے شائع بنت۔|تصدیق بوتگیں منصوبہ شامل کن|تصدیق بوتگیں منصوبہ محفوظ بوتگ۔|AG ءِ داتگیں تصدیق بوتگیں فہرست۔ کُجا ریکارڈانی تفصیل ءُ لنک ہنوز شائع نہ بوتگ۔|تصدیق بوتگیں منصوبہان|نسخہ|پلیٹ فارم|تفصیل ءِ انتظار|اصل ویب سائٹ یا ڈاؤن لوڈ لنک دسترس ءَ بیاینت تا منصوبہ پیش دار۔|لنک ہنوز شائع نہ بوتگ|تصدیق بوتگیں منصوبہ محفوظ نہ بوتگ۔ پدا کوشش کن۔|مصنوع ءِ ذمہ داری بدل کن|ذمہ دار رکن ہنوز مقرر نہ بوتگ۔|ٹیم ءِ اصلی ریکارڈاں ذمہ داری بدئے۔ اے انتظامی رسائی نہ دنت۔|ریلیز ءِ لنک ہنوز شائع نہ بوتگ۔|محفوظ بدلانی لوڈ نہ بوتگ۔ تصدیق بوتگیں منصوبہانی معلومات پیش دارگ بنت۔|پروفائل بچار|ذمہ داری ءِ شعبہان|ہنوز متعلقیں مصنوع نیست۔',
    fr: 'Développé par|Produits développés|Équipes / Départements|Produits|Rechercher un produit, une personne, un département ou une plateforme|Aucun résultat correspondant.|Voir le produit|Voir l’équipe|Domaines de développement|Membres responsables|Non attribué|Les liens de publication ne sont pas encore disponibles.|Les détails et liens seront publiés dès leur disponibilité.|Importer les projets confirmés|Projets confirmés enregistrés.|Catalogue confirmé fourni par AG. Certains détails et liens restent à publier.|Projets confirmés|Version|Plateforme|Détails à venir|Afficher ce projet en attendant ses véritables liens de site ou de téléchargement.|Liens non publiés|Impossible d’enregistrer les projets confirmés. Réessayez.|Modifier la responsabilité du produit|Aucun membre responsable n’a été attribué.|Attribuez la responsabilité à des membres réels de l’équipe. Cela n’accorde aucun accès au personnel.|Les liens de publication ne sont pas encore disponibles.|Impossible de charger les modifications enregistrées. Les informations confirmées sont affichées.|Voir le profil|Domaines de responsabilité|Aucun produit associé pour le moment.',
    es: 'Desarrollado por|Productos desarrollados|Equipos / Departamentos|Productos|Buscar productos, personas, departamentos o plataformas|No hay resultados coincidentes.|Ver producto|Ver equipo|Áreas de desarrollo|Miembros responsables|Sin asignar|Los enlaces de lanzamiento aún no se han publicado.|Los detalles y enlaces se publicarán cuando estén disponibles.|Importar proyectos confirmados|Proyectos confirmados guardados.|Catálogo confirmado proporcionado por AG. Algunos detalles y enlaces aún están pendientes de publicación.|Proyectos confirmados|Versión|Plataforma|Detalles pendientes|Mantener el proyecto visible hasta que estén disponibles sus enlaces reales de sitio o descarga.|Enlaces sin publicar|No se pudieron guardar los proyectos confirmados. Inténtalo de nuevo.|Editar responsabilidad del producto|No se ha asignado ningún miembro responsable.|Asigna la responsabilidad a miembros reales del equipo. Esto no concede acceso de personal.|Los enlaces de lanzamiento aún no se han publicado.|No se pudieron cargar los cambios guardados. Se muestra la información confirmada de los proyectos.|Ver perfil|Áreas de responsabilidad|Aún no hay productos asociados.',
    de: 'Entwickelt von|Entwickelte Produkte|Teams / Abteilungen|Produkte|Produkte, Personen, Abteilungen oder Plattformen suchen|Keine passenden Ergebnisse.|Produkt ansehen|Team ansehen|Entwicklungsbereiche|Verantwortliche Mitglieder|Nicht zugewiesen|Veröffentlichungslinks sind noch nicht verfügbar.|Details und Links werden veröffentlicht, sobald sie verfügbar sind.|Bestätigte Projekte importieren|Bestätigte Projekte gespeichert.|Von AG bereitgestellter bestätigter Katalog. Einige Details und Links sind noch unveröffentlicht.|Bestätigte Projekte|Version|Plattform|Details ausstehend|Das Projekt anzeigen, bis echte Website- oder Downloadlinks verfügbar sind.|Links noch unveröffentlicht|Bestätigte Projekte konnten nicht gespeichert werden. Erneut versuchen.|Produktverantwortung bearbeiten|Noch kein verantwortliches Mitglied zugewiesen.|Verantwortung echten Teammitgliedern zuweisen. Dadurch werden keine Mitarbeiterrechte vergeben.|Veröffentlichungslinks sind noch nicht verfügbar.|Gespeicherte Änderungen konnten nicht geladen werden. Bestätigte Projektinformationen werden angezeigt.|Profil ansehen|Verantwortungsbereiche|Noch keine zugeordneten Produkte.',
    sd: 'تيار ڪندڙ|تيار ڪيل پراڊڪٽس|ٽيمون / شعبا|پراڊڪٽس|پراڊڪٽس، ماڻهو، شعبا يا پليٽ فارم ڳوليو|ڪو نتيجو نه مليو.|پراڊڪٽ ڏسو|ٽيم ڏسو|ترقي جا شعبا|ذميوار رڪن|اڻ مقرر|رليز جا لنڪ اڃا شايع ناهن ٿيا.|تفصيل ۽ لنڪ موجود ٿيڻ تي شايع ڪيا ويندا.|تصديق ٿيل منصوبا شامل ڪريو|تصديق ٿيل منصوبا محفوظ ٿي ويا.|AG جي ڏنل تصديق ٿيل فهرست. ڪجهه رڪارڊن جا تفصيل ۽ لنڪ اڃا شايع ٿيڻا آهن.|تصديق ٿيل منصوبا|نسخو|پليٽ فارم|تفصيل اچڻا آهن|اصل ويب سائيٽ يا ڊائون لوڊ لنڪ ملڻ تائين منصوبي کي ڏيکاريو.|لنڪ اڃا شايع ناهن ٿيا|تصديق ٿيل منصوبا محفوظ نه ٿيا. ٻيهر ڪوشش ڪريو.|پراڊڪٽ جي ذميواري بدلايو|اڃا ڪو ذميوار رڪن مقرر ناهي.|حقيقي ٽيم رڪارڊن کي ذميواري ڏيو. ان سان انتظامي رسائي نٿي ملي.|رليز جا لنڪ اڃا شايع ناهن ٿيا.|محفوظ تبديليون لوڊ نه ٿيون. تصديق ٿيل منصوبن جي معلومات ڏيکاري وڃي ٿي.|پروفائيل ڏسو|ذميواري جا شعبا|اڃا ڪا لاڳاپيل پراڊڪٽ ناهي.',
    hnd: 'تیار کرن والا|تیار کیتیاں مصنوعات|ٹیمیں / شعبے|مصنوعات|مصنوعات، بندے، شعبے یا پلیٹ فارم لبھو|کوئی نتیجہ نئیں لبھیا۔|مصنوع ویکھو|ٹیم ویکھو|تیاری دے شعبے|ذمہ دار رکن|غیر متعین|ریلیز دے لنک ہن شائع نئیں ہوئے۔|تفصیل تے لنک ملن تے شائع کیتے جان گے۔|تصدیق شدہ منصوبے شامل کرو|تصدیق شدہ منصوبے محفوظ ہو گئے۔|AG دی دتی تصدیق شدہ فہرست۔ کجھ ریکارڈاں دی تفصیل تے لنک ہن شائع ہونے باقی نیں۔|تصدیق شدہ منصوبے|ورژن|پلیٹ فارم|تفصیل دی اُڈیک|اصل ویب سائٹ یا ڈاؤن لوڈ لنک ملن تک منصوبہ وکھاندے رہو۔|لنک ہن شائع نئیں ہوئے|تصدیق شدہ منصوبے محفوظ نئیں ہوئے۔ فیر کوشش کرو۔|مصنوع دی ذمہ داری بدلو|ہن کوئی ذمہ دار رکن متعین نئیں۔|ٹیم دے اصلی ریکارڈاں نوں ذمہ داری دیو۔ ایس نال انتظامی رسائی نئیں ملدی۔|ریلیز دے لنک ہن شائع نئیں ہوئے۔|محفوظ تبدیلیاں لوڈ نئیں ہو سکیاں۔ تصدیق شدہ منصوبیاں دی معلومات دکھائی جا رہی اے۔|پروفائل ویکھو|ذمہ داری دے شعبے|ہن کوئی متعلقہ مصنوع نئیں۔',
    skr: 'تیار کرݨ والا|تیار کیتیاں مصنوعات|ٹیمیں / شعبے|مصنوعات|مصنوعات، بندے، شعبے یا پلیٹ فارم لبھو|کوئی نتیجہ کائنی لبھیا۔|مصنوع ݙیکھو|ٹیم ݙیکھو|تیاری دے شعبے|ذمہ دار رکن|غیر متعین|ریلیز دے لنک ہݨ شائع کائنی تھئے۔|تفصیل تے لنک ملݨ تے شائع کیتے ویسن۔|تصدیق شدہ منصوبے شامل کرو|تصدیق شدہ منصوبے محفوظ تھی گئے۔|AG دی ݙتی تصدیق شدہ فہرست۔ کجھ ریکارڈاں دی تفصیل تے لنک ہݨ شائع تھیوݨ باقی ہن۔|تصدیق شدہ منصوبے|ورژن|پلیٹ فارم|تفصیل دی اُڈیک|اصل ویب سائٹ یا ڈاؤن لوڈ لنک ملݨ تک منصوبہ ݙکھاندے رہو۔|لنک ہݨ شائع کائنی تھئے|تصدیق شدہ منصوبے محفوظ کائنی تھئے۔ ول کوشش کرو۔|مصنوع دی ذمہ داری بدلو|ہݨ کوئی ذمہ دار رکن متعین کائنی۔|ٹیم دے اصلی ریکارڈاں کوں ذمہ داری ݙیو۔ ایندے نال انتظامی رسائی کائنی ملدی۔|ریلیز دے لنک ہݨ شائع کائنی تھئے۔|محفوظ تبدیلیاں لوڈ کائنی تھی سکیاں۔ تصدیق شدہ منصوبیاں دی معلومات ݙکھائی ویندی ہے۔|پروفائل ݙیکھو|ذمہ داری دے شعبے|ہݨ کوئی متعلقہ مصنوع کائنی۔',
    hi: 'निर्माता|विकसित उत्पाद|टीमें / विभाग|उत्पाद|उत्पाद, व्यक्ति, विभाग या प्लेटफ़ॉर्म खोजें|कोई परिणाम नहीं मिला।|उत्पाद देखें|टीम देखें|विकास के क्षेत्र|जिम्मेदार सदस्य|अनिर्दिष्ट|रिलीज़ के लिंक अभी प्रकाशित नहीं हुए हैं।|विवरण और लिंक उपलब्ध होने पर प्रकाशित किए जाएँगे।|पुष्ट परियोजनाएँ जोड़ें|पुष्ट परियोजनाएँ सहेजी गईं।|AG द्वारा दी गई पुष्ट सूची। कुछ विवरण और लिंक अभी प्रकाशित होने बाकी हैं।|पुष्ट परियोजनाएँ|संस्करण|प्लेटफ़ॉर्म|विवरण लंबित|वास्तविक वेबसाइट या डाउनलोड लिंक उपलब्ध होने तक परियोजना दिखाते रहें।|लिंक अभी प्रकाशित नहीं हुए|पुष्ट परियोजनाएँ सहेजी नहीं जा सकीं। फिर कोशिश करें।|उत्पाद की जिम्मेदारी संपादित करें|अभी कोई जिम्मेदार सदस्य तय नहीं किया गया है।|वास्तविक टीम रिकॉर्ड को जिम्मेदारी दें। इससे कर्मचारी पहुँच नहीं मिलती।|रिलीज़ के लिंक अभी प्रकाशित नहीं हुए हैं।|सहेजे गए बदलाव लोड नहीं हुए। पुष्ट परियोजनाओं की जानकारी दिखाई जा रही है।|प्रोफाइल देखें|जिम्मेदारी के क्षेत्र|अभी कोई संबंधित उत्पाद नहीं है।',
    ur_roman: 'Tayyar kardah|Tayyar ki gayi masnooat|Teams / Shobay|Masnooat|Masnooat, afraad, shobay ya platforms talash karein|Koi nateeja nahi mila.|Masnooa dekhein|Team dekhein|Taraqqi ke shobay|Zimmedar arkaan|Ghair mutayyan|Release ke links abhi shaya nahi hue.|Tafseelat aur links dastiyab hone par shaya kiye jayenge.|Tasdeeq shuda mansoobay shamil karein|Tasdeeq shuda mansoobay mehfooz ho gaye.|AG ki faraham kardah tasdeeq shuda fehrist. Kuch records ki tafseelat aur links abhi shaya hona baqi hain.|Tasdeeq shuda mansoobay|Version|Platform|Tafseelat ka intezar|Asal website ya download links milne tak mansooba dikhate rahein.|Links abhi shaya nahi hue|Tasdeeq shuda mansoobay mehfooz nahi ho sake. Dobara koshish karein.|Masnooa ki zimmedari badlein|Abhi koi zimmedar rukan mutayyan nahi.|Team ke haqeeqi records ko zimmedari dein. Is se intizami rasai nahi milti.|Release ke links abhi shaya nahi hue.|Mehfooz tabdeeliyan load nahi ho sakeen. Tasdeeq shuda mansoobon ki maloomat dikhai ja rahi hain.|Profile dekhein|Zimmedari ke shobay|Abhi koi mutalliq masnooa nahi.',
    bn: 'নির্মাতা|তৈরি করা পণ্য|দল / বিভাগ|পণ্য|পণ্য, ব্যক্তি, বিভাগ বা প্ল্যাটফর্ম খুঁজুন|কোনো ফলাফল মেলেনি।|পণ্য দেখুন|দল দেখুন|উন্নয়নের ক্ষেত্র|দায়িত্বপ্রাপ্ত সদস্য|অনির্ধারিত|রিলিজের লিংক এখনও প্রকাশিত হয়নি।|বিবরণ ও লিংক পাওয়া গেলে প্রকাশ করা হবে।|নিশ্চিত প্রকল্প আমদানি করুন|নিশ্চিত প্রকল্প সংরক্ষিত হয়েছে।|AG প্রদত্ত নিশ্চিত তালিকা। কিছু বিবরণ ও লিংক এখনও প্রকাশ করা বাকি।|নিশ্চিত প্রকল্প|সংস্করণ|প্ল্যাটফর্ম|বিবরণ অপেক্ষমাণ|আসল ওয়েবসাইট বা ডাউনলোড লিংক পাওয়া পর্যন্ত প্রকল্পটি দেখান।|লিংক এখনও প্রকাশিত হয়নি|নিশ্চিত প্রকল্প সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।|পণ্যের দায়িত্ব সম্পাদনা করুন|দায়িত্বপ্রাপ্ত সদস্য এখনও নির্ধারিত হয়নি।|প্রকৃত দলের সদস্যদের দায়িত্ব দিন। এটি কর্মীদের প্রবেশাধিকার দেয় না।|রিলিজের লিংক এখনও প্রকাশিত হয়নি।|সংরক্ষিত পরিবর্তন লোড করা যায়নি। নিশ্চিত প্রকল্পের তথ্য দেখানো হচ্ছে।|প্রোফাইল দেখুন|দায়িত্বের ক্ষেত্র|এখনও কোনো সংশ্লিষ্ট পণ্য নেই।',
    ru: 'Разработано|Разработанные продукты|Команды / Отделы|Продукты|Поиск продуктов, людей, отделов или платформ|Совпадений не найдено.|Открыть продукт|Открыть команду|Области разработки|Ответственные участники|Не назначено|Ссылки на выпуск пока не опубликованы.|Описание и ссылки появятся, когда будут доступны.|Импортировать подтверждённые проекты|Подтверждённые проекты сохранены.|Подтверждённый каталог от AG. Некоторые описания и ссылки ещё не опубликованы.|Подтверждённые проекты|Версия|Платформа|Описание ожидается|Показывать проект до появления настоящих ссылок на сайт или скачивание.|Ссылки ещё не опубликованы|Не удалось сохранить подтверждённые проекты. Повторите попытку.|Изменить ответственность за продукт|Ответственный участник ещё не назначен.|Назначайте ответственность реальным участникам команды. Это не даёт служебных прав.|Ссылки на выпуск пока не опубликованы.|Не удалось загрузить сохранённые изменения. Показаны подтверждённые сведения о проектах.|Открыть профиль|Области ответственности|Связанных продуктов пока нет.',
    it: 'Sviluppato da|Prodotti sviluppati|Team / Dipartimenti|Prodotti|Cerca prodotti, persone, dipartimenti o piattaforme|Nessun risultato corrispondente.|Visualizza prodotto|Visualizza team|Aree di sviluppo|Membri responsabili|Non assegnato|I collegamenti della versione non sono ancora pubblicati.|Dettagli e collegamenti saranno pubblicati quando disponibili.|Importa progetti confermati|Progetti confermati salvati.|Catalogo confermato fornito da AG. Alcuni dettagli e collegamenti devono ancora essere pubblicati.|Progetti confermati|Versione|Piattaforma|Dettagli in attesa|Mostra il progetto finché non saranno disponibili i collegamenti reali al sito o al download.|Collegamenti non ancora pubblicati|Impossibile salvare i progetti confermati. Riprova.|Modifica responsabilità del prodotto|Nessun membro responsabile è stato assegnato.|Assegna la responsabilità a membri reali del team. Questo non concede accesso al personale.|I collegamenti della versione non sono ancora pubblicati.|Impossibile caricare le modifiche salvate. Sono mostrate le informazioni confermate dei progetti.|Visualizza profilo|Aree di responsabilità|Nessun prodotto associato per ora.',
    pt: 'Desenvolvido por|Produtos desenvolvidos|Equipes / Departamentos|Produtos|Pesquisar produtos, pessoas, departamentos ou plataformas|Nenhum resultado correspondente.|Ver produto|Ver equipe|Áreas de desenvolvimento|Membros responsáveis|Não atribuído|Os links da versão ainda não foram publicados.|Os detalhes e links serão publicados quando disponíveis.|Importar projetos confirmados|Projetos confirmados salvos.|Catálogo confirmado fornecido pela AG. Alguns detalhes e links ainda precisam ser publicados.|Projetos confirmados|Versão|Plataforma|Detalhes pendentes|Exibir o projeto até que seus links reais de site ou download estejam disponíveis.|Links ainda não publicados|Não foi possível salvar os projetos confirmados. Tente novamente.|Editar responsabilidade pelo produto|Nenhum membro responsável foi atribuído.|Atribua a responsabilidade a membros reais da equipe. Isso não concede acesso de funcionário.|Os links da versão ainda não foram publicados.|Não foi possível carregar as alterações salvas. Exibindo informações confirmadas dos projetos.|Ver perfil|Áreas de responsabilidade|Ainda não há produtos associados.',
    ko: '개발자|개발한 제품|팀 / 부서|제품|제품, 사람, 부서 또는 플랫폼 검색|일치하는 결과가 없습니다.|제품 보기|팀 보기|개발 분야|담당 구성원|미지정|출시 링크는 아직 공개되지 않았습니다.|세부 정보와 링크는 준비되는 대로 공개됩니다.|확인된 프로젝트 가져오기|확인된 프로젝트를 저장했습니다.|AG가 제공한 확인된 목록입니다. 일부 정보와 링크는 아직 공개되지 않았습니다.|확인된 프로젝트|버전|플랫폼|세부 정보 준비 중|실제 웹사이트 또는 다운로드 링크가 준비될 때까지 프로젝트를 표시합니다.|링크 미공개|확인된 프로젝트를 저장하지 못했습니다. 다시 시도하세요.|제품 담당 편집|담당 구성원이 아직 지정되지 않았습니다.|실제 팀 구성원에게 담당을 지정합니다. 직원 접근 권한은 부여되지 않습니다.|출시 링크는 아직 공개되지 않았습니다.|저장한 변경 사항을 불러오지 못했습니다. 확인된 프로젝트 정보를 표시합니다.|프로필 보기|담당 분야|연결된 제품이 아직 없습니다.',
    id: 'Dikembangkan oleh|Produk yang dikembangkan|Tim / Departemen|Produk|Cari produk, orang, departemen atau platform|Tidak ada hasil yang cocok.|Lihat produk|Lihat tim|Bidang pengembangan|Anggota penanggung jawab|Belum ditetapkan|Tautan rilis belum diterbitkan.|Rincian dan tautan akan diterbitkan ketika tersedia.|Impor proyek terkonfirmasi|Proyek terkonfirmasi disimpan.|Katalog terkonfirmasi dari AG. Beberapa rincian dan tautan masih belum diterbitkan.|Proyek terkonfirmasi|Versi|Platform|Rincian menunggu|Tampilkan proyek hingga tautan situs atau unduhan yang nyata tersedia.|Tautan belum diterbitkan|Proyek terkonfirmasi tidak dapat disimpan. Coba lagi.|Edit tanggung jawab produk|Belum ada anggota penanggung jawab.|Tetapkan tanggung jawab kepada anggota tim yang nyata. Ini tidak memberikan akses staf.|Tautan rilis belum diterbitkan.|Perubahan tersimpan tidak dapat dimuat. Menampilkan informasi proyek terkonfirmasi.|Lihat profil|Bidang tanggung jawab|Belum ada produk terkait.'
};
export const DEVELOPMENT_KEYS = [
    'development.frontend', 'development.backend', 'development.software', 'development.android',
    'development.uiux', 'development.security', 'development.testingDeployment',
    'development.researchInnovation'
];
const developmentRows = {
    en: 'Frontend|Backend|Software Development|Android Development|UI/UX|Security|Testing & Deployment|Research & Innovation',
    ur: 'فرنٹ اینڈ|بیک اینڈ|سافٹ ویئر ڈیولپمنٹ|اینڈرائیڈ ڈیولپمنٹ|یوزر انٹرفیس اور تجربہ|سیکیورٹی|ٹیسٹنگ اور تعیناتی|تحقیق اور جدت',
    ar: 'الواجهة الأمامية|الخدمات الخلفية|تطوير البرمجيات|تطوير Android|واجهة وتجربة المستخدم|الأمان|الاختبار والنشر|البحث والابتكار',
    tr: 'Ön yüz|Arka uç|Yazılım geliştirme|Android geliştirme|Kullanıcı arayüzü ve deneyimi|Güvenlik|Test ve dağıtım|Araştırma ve yenilik',
    ja: 'フロントエンド|バックエンド|ソフトウェア開発|Android開発|UI・UX|セキュリティ|テスト・デプロイ|研究・革新',
    zh: '前端|后端|软件开发|Android开发|界面与用户体验|安全|测试与部署|研究与创新',
    pa: 'فرنٹ اینڈ|بیک اینڈ|سافٹ ویئر دی تیاری|اینڈرائیڈ دی تیاری|انٹرفیس تے صارف دا تجربہ|حفاظت|ٹیسٹنگ تے تعیناتی|تحقیق تے جدت',
    ps: 'مخکینۍ برخه|شاتنۍ برخه|د سافټویر پراختیا|د Android پراختیا|د کارن مخ او تجربه|امنیت|ازموینه او خپرونه|څېړنه او نوښت',
    bal: 'فرنٹ اینڈ|بیک اینڈ|سافٹ ویئر ءِ جوڑ کنگ|اینڈرائیڈ ءِ جوڑ کنگ|انٹرفیس ءُ کاربر ءِ تجربہ|حفاظت|آزمائش ءُ تعیناتی|تحقیق ءُ جدت',
    fr: 'Frontend|Backend|Développement logiciel|Développement Android|Interface et expérience utilisateur|Sécurité|Tests et déploiement|Recherche et innovation',
    es: 'Interfaz|Servidor|Desarrollo de software|Desarrollo Android|Interfaz y experiencia de usuario|Seguridad|Pruebas y despliegue|Investigación e innovación',
    de: 'Frontend|Backend|Softwareentwicklung|Android-Entwicklung|Oberfläche und Nutzererlebnis|Sicherheit|Tests und Bereitstellung|Forschung und Innovation',
    sd: 'فرنٽ اينڊ|بيڪ اينڊ|سافٽ ويئر جي ترقي|اينڊرائيڊ جي ترقي|انٽرفيس ۽ استعمال ڪندڙ جو تجربو|حفاظت|جاچ ۽ تعيناتي|تحقيق ۽ جدت',
    hnd: 'فرنٹ اینڈ|بیک اینڈ|سافٹ ویئر دی تیاری|اینڈرائیڈ دی تیاری|انٹرفیس تے صارف دا تجربہ|حفاظت|ٹیسٹنگ تے تعیناتی|تحقیق تے جدت',
    skr: 'فرنٹ اینڈ|بیک اینڈ|سافٹ ویئر دی تیاری|اینڈرائیڈ دی تیاری|انٹرفیس تے صارف دا تجربہ|حفاظت|ٹیسٹنگ تے تعیناتی|تحقیق تے جدت',
    hi: 'फ्रंटएंड|बैकएंड|सॉफ्टवेयर विकास|Android विकास|इंटरफेस और उपयोगकर्ता अनुभव|सुरक्षा|परीक्षण और तैनाती|अनुसंधान और नवाचार',
    ur_roman: 'Frontend|Backend|Software ki tayyari|Android ki tayyari|Interface aur sarif ka tajurba|Hifazat|Testing aur taynaati|Tehqeeq aur jiddat',
    bn: 'ফ্রন্টএন্ড|ব্যাকএন্ড|সফটওয়্যার উন্নয়ন|Android উন্নয়ন|ইন্টারফেস ও ব্যবহারকারীর অভিজ্ঞতা|নিরাপত্তা|পরীক্ষা ও স্থাপন|গবেষণা ও উদ্ভাবন',
    ru: 'Фронтенд|Бэкенд|Разработка ПО|Разработка для Android|Интерфейс и пользовательский опыт|Безопасность|Тестирование и развёртывание|Исследования и инновации',
    it: 'Frontend|Backend|Sviluppo software|Sviluppo Android|Interfaccia ed esperienza utente|Sicurezza|Test e distribuzione|Ricerca e innovazione',
    pt: 'Frontend|Backend|Desenvolvimento de software|Desenvolvimento Android|Interface e experiência do usuário|Segurança|Testes e implantação|Pesquisa e inovação',
    ko: '프론트엔드|백엔드|소프트웨어 개발|Android 개발|사용자 인터페이스와 경험|보안|테스트 및 배포|연구와 혁신',
    id: 'Frontend|Backend|Pengembangan perangkat lunak|Pengembangan Android|Antarmuka dan pengalaman pengguna|Keamanan|Pengujian dan penerapan|Riset dan inovasi'
};
export const RESPONSIBILITY_KEYS = [
    'responsibility.softwareDevelopment', 'responsibility.researchInnovation',
    'responsibility.frontendBackend', 'responsibility.uiux',
    'responsibility.securityIntegrations', 'responsibility.testingDeployment'
];
const responsibilityRows = {
    en: 'Software Development|Research & Innovation|Frontend & Backend|UI/UX|Security & Integrations|Testing & Deployment',
    ur: 'سافٹ ویئر ڈیولپمنٹ|تحقیق اور جدت|فرنٹ اینڈ اور بیک اینڈ|یوزر انٹرفیس اور تجربہ|سیکیورٹی اور انضمام|ٹیسٹنگ اور تعیناتی',
    ar: 'تطوير البرمجيات|البحث والابتكار|الواجهة الأمامية والخدمات الخلفية|واجهة وتجربة المستخدم|الأمان والتكاملات|الاختبار والنشر',
    tr: 'Yazılım geliştirme|Araştırma ve yenilik|Ön yüz ve arka uç|Kullanıcı arayüzü ve deneyimi|Güvenlik ve entegrasyonlar|Test ve dağıtım',
    ja: 'ソフトウェア開発|研究・革新|フロントエンド・バックエンド|UI・UX|セキュリティ・統合|テスト・デプロイ',
    zh: '软件开发|研究与创新|前端与后端|界面与用户体验|安全与集成|测试与部署',
    pa: 'سافٹ ویئر دی تیاری|تحقیق تے جدت|فرنٹ اینڈ تے بیک اینڈ|انٹرفیس تے صارف دا تجربہ|حفاظت تے انضمام|ٹیسٹنگ تے تعیناتی',
    ps: 'د سافټویر پراختیا|څېړنه او نوښت|مخکینۍ او شاتنۍ برخې|د کارن مخ او تجربه|امنیت او یوځای کول|ازموینه او خپرونه',
    bal: 'سافٹ ویئر ءِ جوڑ کنگ|تحقیق ءُ جدت|فرنٹ اینڈ ءُ بیک اینڈ|انٹرفیس ءُ کاربر ءِ تجربہ|حفاظت ءُ انضمام|آزمائش ءُ تعیناتی',
    fr: 'Développement logiciel|Recherche et innovation|Frontend et backend|Interface et expérience utilisateur|Sécurité et intégrations|Tests et déploiement',
    es: 'Desarrollo de software|Investigación e innovación|Interfaz y servidor|Interfaz y experiencia de usuario|Seguridad e integraciones|Pruebas y despliegue',
    de: 'Softwareentwicklung|Forschung und Innovation|Frontend und Backend|Oberfläche und Nutzererlebnis|Sicherheit und Integration|Tests und Bereitstellung',
    sd: 'سافٽ ويئر جي ترقي|تحقيق ۽ جدت|فرنٽ اينڊ ۽ بيڪ اينڊ|انٽرفيس ۽ استعمال ڪندڙ جو تجربو|حفاظت ۽ انضمام|جاچ ۽ تعيناتي',
    hnd: 'سافٹ ویئر دی تیاری|تحقیق تے جدت|فرنٹ اینڈ تے بیک اینڈ|انٹرفیس تے صارف دا تجربہ|حفاظت تے انضمام|ٹیسٹنگ تے تعیناتی',
    skr: 'سافٹ ویئر دی تیاری|تحقیق تے جدت|فرنٹ اینڈ تے بیک اینڈ|انٹرفیس تے صارف دا تجربہ|حفاظت تے انضمام|ٹیسٹنگ تے تعیناتی',
    hi: 'सॉफ्टवेयर विकास|अनुसंधान और नवाचार|फ्रंटएंड और बैकएंड|इंटरफेस और उपयोगकर्ता अनुभव|सुरक्षा और एकीकरण|परीक्षण और तैनाती',
    ur_roman: 'Software ki tayyari|Tehqeeq aur jiddat|Frontend aur Backend|Interface aur sarif ka tajurba|Hifazat aur inzimam|Testing aur taynaati',
    bn: 'সফটওয়্যার উন্নয়ন|গবেষণা ও উদ্ভাবন|ফ্রন্টএন্ড ও ব্যাকএন্ড|ইন্টারফেস ও ব্যবহারকারীর অভিজ্ঞতা|নিরাপত্তা ও সমন্বয়|পরীক্ষা ও স্থাপন',
    ru: 'Разработка ПО|Исследования и инновации|Фронтенд и бэкенд|Интерфейс и пользовательский опыт|Безопасность и интеграции|Тестирование и развёртывание',
    it: 'Sviluppo software|Ricerca e innovazione|Frontend e backend|Interfaccia ed esperienza utente|Sicurezza e integrazioni|Test e distribuzione',
    pt: 'Desenvolvimento de software|Pesquisa e inovação|Frontend e backend|Interface e experiência do usuário|Segurança e integrações|Testes e implantação',
    ko: '소프트웨어 개발|연구와 혁신|프론트엔드와 백엔드|사용자 인터페이스와 경험|보안과 통합|테스트 및 배포',
    id: 'Pengembangan perangkat lunak|Riset dan inovasi|Frontend dan backend|Antarmuka dan pengalaman pengguna|Keamanan dan integrasi|Pengujian dan penerapan'
};

function phrasePack(keys, row, language) {
    const values = row.split('|');
    if (values.length !== keys.length || values.some(value => !value.trim())) {
        throw new Error('Incomplete catalogue translation: ' + language);
    }
    return Object.fromEntries(keys.map((key, index) => [key, values[index]]));
}
export const catalogueTranslations = Object.fromEntries(Object.entries(rows).map(([language, row]) => [language, {
    ...phrasePack(CATALOGUE_KEYS, row, language),
    ...phrasePack(DEVELOPMENT_KEYS, developmentRows[language], language),
    ...phrasePack(RESPONSIBILITY_KEYS, responsibilityRows[language], language)
}]));
const aliases = {
    'catalogue.search': 'catalogue.searchMap', 'catalogue.searchEmpty': 'catalogue.noMatches',
    'catalogue.developed': 'catalogue.developedProducts', 'catalogue.areas': 'catalogue.developmentCategories',
    'catalogue.pending': 'catalogue.pendingDescription', 'catalogue.teamProfile': 'catalogue.viewProfile'
};
for (const pack of Object.values(catalogueTranslations)) {
    for (const [key, source] of Object.entries(aliases)) pack[key] = pack[source];
}

// These translations correspond to the supplied initial biography only. Consumers
// compare it with the seed before translating, so future edited bios stay intact.
export const TEAM_BIO_KEYS = ['team.bioParagraph1', 'team.bioParagraph2'];
const biography = {
    en: [
        'Muhammad Hamza Sabir is a software developer at AG, working across the design, development, and maintenance of AG’s digital products and platforms. His work covers frontend and backend development, UI/UX implementation, authentication systems, databases, APIs, security features, integrations, testing, deployment, and ongoing product improvements.',
        'He has independently developed the codebase of every AG product created so far, taking projects from their initial concepts and prototypes to functional applications and production-ready systems. His work spans web applications, desktop software, browsers, productivity and security tools, AI-related projects, and experimental technologies developed under AG.'
    ],
    ur: [
        'محمد حمزہ صابر AG میں سافٹ ویئر ڈویلپر ہیں اور AG کی ڈیجیٹل مصنوعات اور پلیٹ فارمز کے ڈیزائن، تیاری اور دیکھ بھال پر کام کرتے ہیں۔ ان کے کام میں فرنٹ اینڈ اور بیک اینڈ ڈیولپمنٹ، یوزر انٹرفیس اور تجربے کا نفاذ، شناخت کی تصدیق کے نظام، ڈیٹابیس، APIs، حفاظتی خصوصیات، انضمام، ٹیسٹنگ، تعیناتی اور مصنوعات میں مسلسل بہتری شامل ہیں۔',
        'انہوں نے اب تک تیار کی گئی ہر AG مصنوع کا کوڈ بیس خود تیار کیا ہے اور منصوبوں کو ابتدائی تصورات اور نمونوں سے قابلِ استعمال ایپلیکیشنز اور عملی استعمال کے لیے تیار نظاموں تک پہنچایا ہے۔ ان کا کام ویب ایپلیکیشنز، ڈیسک ٹاپ سافٹ ویئر، براؤزرز، پیداواری صلاحیت اور سیکیورٹی کے ٹولز، مصنوعی ذہانت سے متعلق منصوبوں اور AG کے تحت تیار ہونے والی تجرباتی ٹیکنالوجیز پر محیط ہے۔'
    ],
    ar: [
        'محمد حمزة صابر مطور برمجيات في AG، يعمل على تصميم منتجات AG الرقمية ومنصاتها وتطويرها وصيانتها. يشمل عمله تطوير الواجهات الأمامية والخدمات الخلفية، وتنفيذ واجهات وتجربة المستخدم، وأنظمة المصادقة، وقواعد البيانات، وواجهات البرمجة، وميزات الأمان، والتكاملات، والاختبار، والنشر، والتحسين المستمر للمنتجات.',
        'طوّر بشكل مستقل قاعدة الشفرة لكل منتج أنشأته AG حتى الآن، وحوّل المشاريع من أفكار ونماذج أولية إلى تطبيقات تعمل وأنظمة جاهزة للاستخدام الفعلي. يمتد عمله إلى تطبيقات الويب، وبرامج سطح المكتب، والمتصفحات، وأدوات الإنتاجية والأمان، والمشاريع المتعلقة بالذكاء الاصطناعي، والتقنيات التجريبية المطورة تحت اسم AG.'
    ],
    tr: [
        'Muhammad Hamza Sabir, AG’nin dijital ürün ve platformlarının tasarımı, geliştirilmesi ve bakımı üzerinde çalışan bir yazılım geliştiricisidir. Çalışmaları ön yüz ve arka uç geliştirme, kullanıcı arayüzü ve deneyiminin uygulanması, kimlik doğrulama sistemleri, veritabanları, API’ler, güvenlik özellikleri, entegrasyonlar, test, dağıtım ve sürekli ürün iyileştirmelerini kapsar.',
        'Bugüne kadar oluşturulan her AG ürününün kod tabanını bağımsız olarak geliştirmiş, projeleri ilk fikir ve prototiplerinden çalışan uygulamalara ve üretime hazır sistemlere taşımıştır. Çalışmaları web uygulamalarını, masaüstü yazılımlarını, tarayıcıları, verimlilik ve güvenlik araçlarını, yapay zekâ ile ilgili projeleri ve AG bünyesinde geliştirilen deneysel teknolojileri kapsar.'
    ],
    ja: [
        'Muhammad Hamza SabirはAGのソフトウェア開発者として、AGのデジタル製品やプラットフォームの設計、開発、保守を担当しています。フロントエンドとバックエンドの開発、UI・UXの実装、認証システム、データベース、API、セキュリティ機能、統合、テスト、デプロイ、継続的な製品改善に取り組んでいます。',
        'これまでに作られたすべてのAG製品のコードベースを独力で開発し、初期の構想や試作品を、動作するアプリケーションや本番運用に対応したシステムへと育ててきました。その仕事はウェブアプリ、デスクトップソフトウェア、ブラウザー、生産性やセキュリティのツール、AI関連プロジェクト、AGで開発する実験的な技術に及びます。'
    ],
    zh: [
        'Muhammad Hamza Sabir是AG的软件开发者，负责AG数字产品和平台的设计、开发与维护。他的工作涵盖前端和后端开发、用户界面与体验实现、身份验证系统、数据库、API、安全功能、系统集成、测试、部署和持续的产品改进。',
        '迄今为止，每一款AG产品的代码库都由他独立开发。他将项目从最初的概念和原型推进为可运行的应用和可投入实际使用的系统。他的工作涉及网页应用、桌面软件、浏览器、生产力与安全工具、人工智能相关项目，以及AG旗下开发的实验性技术。'
    ],
    pa: [
        'محمد حمزہ صابر AG وچ سافٹ ویئر ڈویلپر نیں تے AG دیاں ڈیجیٹل مصنوعات تے پلیٹ فارماں دے ڈیزائن، تیاری تے دیکھ بھال اُتے کم کردے نیں۔ اوہناں دے کم وچ فرنٹ اینڈ تے بیک اینڈ دی تیاری، انٹرفیس تے صارف دے تجربے دا نفاذ، شناخت دی تصدیق دے نظام، ڈیٹابیس، APIs، حفاظتی خصوصیتاں، انضمام، ٹیسٹنگ، تعیناتی تے مصنوعات وچ لگاتار بہتری شامل اے۔',
        'اوہناں نے ہن تک بنائی گئی ہر AG مصنوع دا کوڈ بیس اپنے آپ تیار کیتا اے تے منصوبیاں نوں پہلیں خیالاں تے نمونیاں توں چلن والیاں ایپلیکیشناں تے اصل استعمال لئی تیار نظاماں تک پہنچایا اے۔ اوہناں دا کم ویب ایپلیکیشناں، ڈیسک ٹاپ سافٹ ویئر، براؤزراں، پیداواری صلاحیت تے حفاظت دے ٹولز، مصنوعی ذہانت نال متعلق منصوبیاں تے AG ہیتھ تیار ہون والیاں تجرباتی ٹیکنالوجیاں تک پھیلیا اے۔'
    ],
    ps: [
        'محمد حمزه صابر په AG کې د سافټویر پراختیاکوونکی دی او د AG د ډیجیټل محصولاتو او پلیټفارمونو پر ډیزاین، پراختیا او ساتنه کار کوي. د هغه کار مخکینۍ او شاتنۍ پراختیا، د کارن مخ او تجربې پلي کول، د هویت تصدیق سیستمونه، ډیټابیسونه، API ګانې، امنیتي ځانګړنې، یوځای کول، ازموینه، خپرونه او د محصولاتو پرله‌پسې ښه کول رانغاړي.',
        'هغه تر اوسه د جوړ شوي هر AG محصول د کوډ بنسټ په خپلواکه توګه پراخ کړی او پروژې یې له لومړنیو مفکورو او نمونو څخه کارکوونکو اپلېکېشنونو او عملي کارونې ته چمتو سیستمونو ته رسولې دي. د هغه کار وېب اپلېکېشنونه، د کمپیوټر سافټویر، براوزرونه، د تولید او امنیت وسایل، د مصنوعي ځیرکتیا اړوند پروژې او د AG تر نامه لاندې تجربوي ټکنالوژۍ رانغاړي.'
    ],
    bal: [
        'محمد حمزہ صابر AG ءَ سافٹ ویئر ڈویلپر انت ءُ AG ءِ ڈیجیٹل مصنوعات ءُ پلیٹ فارمان ءِ ڈیزائن، جوڑ کنگ ءُ نگہداری ءَ کار کنت۔ آئی ءِ کار فرنٹ اینڈ ءُ بیک اینڈ ءِ جوڑ کنگ، انٹرفیس ءُ کاربر ءِ تجربہ ءِ نفاذ، شناخت ءِ تصدیق ءِ نظام، ڈیٹابیس، APIs، حفاظتی خصوصیتان، انضمام، آزمائش، تعیناتی ءُ مصنوعاتانی مسلسل بہتری شامل کنت۔',
        'آئی ءَ ہنوز جوڑ بوتگیں ہر AG مصنوع ءِ کوڈ بیس وت جوڑ کتگ ءُ منصوبہاں اولی خیال ءُ نمونہاں چہ کار کنوکیں ایپلیکیشن ءُ عملی کارمرز ءِ تیاریں نظاماں تک رسینتگ۔ آئی ءِ کار ویب ایپلیکیشن، ڈیسک ٹاپ سافٹ ویئر، براؤزر، پیداواری صلاحیت ءُ حفاظت ءِ ٹولز، مصنوعی ذہانت ءِ متعلقیں منصوبہ ءُ AG ءِ نام ءَ جوڑ بوتگیں تجرباتی ٹیکنالوجیاں شامل کنت۔'
    ],
    fr: [
        'Muhammad Hamza Sabir est développeur logiciel chez AG. Il participe à la conception, au développement et à la maintenance des produits et plateformes numériques d’AG. Son travail couvre le frontend et le backend, la mise en œuvre des interfaces et de l’expérience utilisateur, l’authentification, les bases de données, les API, la sécurité, les intégrations, les tests, le déploiement et l’amélioration continue des produits.',
        'Il a développé seul le code de chaque produit AG créé jusqu’à présent, transformant des concepts et prototypes en applications fonctionnelles et systèmes prêts pour la production. Son travail comprend les applications web, les logiciels de bureau, les navigateurs, les outils de productivité et de sécurité, les projets liés à l’intelligence artificielle et les technologies expérimentales développées sous le nom AG.'
    ],
    es: [
        'Muhammad Hamza Sabir es desarrollador de software en AG y trabaja en el diseño, desarrollo y mantenimiento de sus productos y plataformas digitales. Su trabajo abarca el desarrollo de interfaz y servidor, la implementación de UI/UX, los sistemas de autenticación, bases de datos, API, funciones de seguridad, integraciones, pruebas, despliegue y mejoras continuas de los productos.',
        'Ha desarrollado de forma independiente el código de todos los productos de AG creados hasta ahora, llevando los proyectos desde sus conceptos y prototipos iniciales hasta aplicaciones funcionales y sistemas listos para producción. Su trabajo incluye aplicaciones web, software de escritorio, navegadores, herramientas de productividad y seguridad, proyectos de inteligencia artificial y tecnologías experimentales desarrolladas bajo AG.'
    ],
    de: [
        'Muhammad Hamza Sabir ist Softwareentwickler bei AG und arbeitet an Gestaltung, Entwicklung und Wartung der digitalen Produkte und Plattformen von AG. Seine Arbeit umfasst Frontend- und Backend-Entwicklung, die Umsetzung von UI/UX, Authentifizierungssysteme, Datenbanken, APIs, Sicherheitsfunktionen, Integrationen, Tests, Bereitstellung und laufende Produktverbesserungen.',
        'Er hat die Codebasis jedes bisher entstandenen AG-Produkts eigenständig entwickelt und Projekte von ersten Konzepten und Prototypen zu funktionierenden Anwendungen und produktionsreifen Systemen geführt. Seine Arbeit reicht von Webanwendungen, Desktopsoftware und Browsern über Produktivitäts- und Sicherheitswerkzeuge bis zu KI-Projekten und experimentellen Technologien unter dem Namen AG.'
    ],
    sd: [
        'محمد حمزه صابر AG ۾ سافٽ ويئر ڊولپر آهي ۽ AG جي ڊجيٽل پراڊڪٽس ۽ پليٽ فارمن جي ڊزائن، ترقي ۽ سار سنڀال تي ڪم ڪري ٿو. سندس ڪم ۾ فرنٽ اينڊ ۽ بيڪ اينڊ ترقي، انٽرفيس ۽ استعمال ڪندڙ جي تجربي جو نفاذ، سڃاڻپ جي تصديق جا نظام، ڊيٽابيس، APIs، حفاظتي خاصيتون، انضمام، جاچ، تعيناتي ۽ پراڊڪٽس ۾ لڳاتار سڌارو شامل آهي.',
        'هن اڃا تائين ٺهيل هر AG پراڊڪٽ جو ڪوڊ بيس پاڻ تيار ڪيو آهي ۽ منصوبن کي شروعاتي خيالن ۽ نمونن کان ڪم ڪندڙ ايپليڪيشنن ۽ عملي استعمال لاءِ تيار نظامن تائين پهچايو آهي. سندس ڪم ويب ايپليڪيشنن، ڊيسڪ ٽاپ سافٽ ويئر، برائوزرن، پيداواري صلاحيت ۽ حفاظت جي اوزارن، مصنوعي ذهانت جي منصوبن ۽ AG هيٺ تيار ٿيندڙ تجرباتي ٽيڪنالاجين تي پکڙيل آهي.'
    ],
    hnd: [
        'محمد حمزہ صابر AG وچ سافٹ ویئر ڈویلپر ہن تے AG دیاں ڈیجیٹل مصنوعات تے پلیٹ فارماں دے ڈیزائن، تیاری تے دیکھ بھال اُتے کم کردے ہن۔ انہاں دے کم وچ فرنٹ اینڈ تے بیک اینڈ دی تیاری، انٹرفیس تے صارف دے تجربے دا نفاذ، شناخت دی تصدیق دے نظام، ڈیٹابیس، APIs، حفاظتی خصوصیتاں، انضمام، ٹیسٹنگ، تعیناتی تے مصنوعات وچ مسلسل بہتری شامل اے۔',
        'انہاں نے ہن تک بنائی گئی ہر AG مصنوع دا کوڈ بیس آپ تیار کیتا اے تے منصوبیاں نوں شروع دے خیالاں تے نمونیاں توں چلن والیاں ایپلیکیشناں تے عملی استعمال لئی تیار نظاماں تک پہنچایا اے۔ انہاں دا کم ویب ایپلیکیشناں، ڈیسک ٹاپ سافٹ ویئر، براؤزراں، پیداواری صلاحیت تے حفاظت دے ٹولز، مصنوعی ذہانت نال متعلق منصوبیاں تے AG دے تحت تیار ہون والیاں تجرباتی ٹیکنالوجیاں تک پھیلیا اے۔'
    ],
    skr: [
        'محمد حمزہ صابر AG وچ سافٹ ویئر ڈویلپر ہن تے AG دیاں ڈیجیٹل مصنوعات تے پلیٹ فارماں دے ڈیزائن، تیاری تے دیکھ بھال اُتے کم کریندے ہن۔ انہاں دے کم وچ فرنٹ اینڈ تے بیک اینڈ دی تیاری، انٹرفیس تے صارف دے تجربے دا نفاذ، شناخت دی تصدیق دے نظام، ڈیٹابیس، APIs، حفاظتی خصوصیتاں، انضمام، ٹیسٹنگ، تعیناتی تے مصنوعات وچ لگاتار بہتری شامل ہے۔',
        'انہاں ہݨ تائیں تیار تھیندی ہر AG مصنوع دا کوڈ بیس آپ تیار کیتا ہے تے منصوبیاں کوں ابتدائی خیالاں تے نمونیاں توں چلݨ والیاں ایپلیکیشناں تے عملی استعمال کیتے تیار نظاماں تائیں پہنچایا ہے۔ انہاں دا کم ویب ایپلیکیشناں، ڈیسک ٹاپ سافٹ ویئر، براؤزراں، پیداواری صلاحیت تے حفاظت دے ٹولز، مصنوعی ذہانت نال متعلق منصوبیاں تے AG دے تحت تیار تھیوݨ والیاں تجرباتی ٹیکنالوجیاں اُتے محیط ہے۔'
    ],
    hi: [
        'मुहम्मद हमज़ा साबिर AG में सॉफ्टवेयर डेवलपर हैं और AG के डिजिटल उत्पादों और प्लेटफ़ॉर्म के डिजाइन, विकास तथा रखरखाव पर काम करते हैं। उनका काम फ्रंटएंड और बैकएंड विकास, UI/UX कार्यान्वयन, प्रमाणीकरण प्रणालियों, डेटाबेस, API, सुरक्षा सुविधाओं, एकीकरण, परीक्षण, तैनाती और निरंतर उत्पाद सुधार को शामिल करता है।',
        'उन्होंने अब तक बने प्रत्येक AG उत्पाद का कोडबेस स्वतंत्र रूप से विकसित किया है और परियोजनाओं को प्रारंभिक विचारों और प्रोटोटाइप से कार्यशील एप्लिकेशन और उत्पादन के लिए तैयार प्रणालियों तक पहुँचाया है। उनका काम वेब एप्लिकेशन, डेस्कटॉप सॉफ्टवेयर, ब्राउज़र, उत्पादकता और सुरक्षा उपकरणों, कृत्रिम बुद्धिमत्ता से जुड़ी परियोजनाओं और AG के अंतर्गत विकसित प्रायोगिक तकनीकों तक फैला है।'
    ],
    ur_roman: [
        'Muhammad Hamza Sabir AG mein software developer hain aur AG ki digital masnooat aur platforms ke design, tayyari aur dekh bhaal par kaam karte hain. Un ke kaam mein frontend aur backend development, UI/UX ka nifaz, shanakht ki tasdeeq ke nizam, databases, APIs, hifazati khususiyaat, integrations, testing, taynaati aur masnooat mein musalsal behtari shamil hain.',
        'Unhon ne ab tak tayyar ki gayi har AG masnooa ka codebase khud tayyar kiya hai aur mansoobon ko ibtidai tasawwuraat aur namoonon se kaam karne wali applications aur amli istemal ke liye tayyar nizaamon tak pohanchaya hai. Un ka kaam web applications, desktop software, browsers, paidawari salahiyat aur security ke tools, masnooi zehanat ke mansoobon aur AG ke tehat tayyar hone wali tajribati technologies par muheet hai.'
    ],
    bn: [
        'মুহাম্মদ হামজা সাবির AG-এর একজন সফটওয়্যার ডেভেলপার। তিনি AG-এর ডিজিটাল পণ্য ও প্ল্যাটফর্মের নকশা, উন্নয়ন এবং রক্ষণাবেক্ষণে কাজ করেন। তাঁর কাজের মধ্যে ফ্রন্টএন্ড ও ব্যাকএন্ড উন্নয়ন, UI/UX বাস্তবায়ন, পরিচয় যাচাই ব্যবস্থা, ডেটাবেস, API, নিরাপত্তা সুবিধা, সমন্বয়, পরীক্ষা, স্থাপন এবং পণ্যের ধারাবাহিক উন্নতি অন্তর্ভুক্ত।',
        'এখন পর্যন্ত তৈরি প্রতিটি AG পণ্যের কোডবেস তিনি স্বাধীনভাবে তৈরি করেছেন এবং প্রকল্পগুলোকে প্রাথমিক ধারণা ও প্রোটোটাইপ থেকে কার্যকর অ্যাপ্লিকেশন এবং বাস্তব ব্যবহারের জন্য প্রস্তুত ব্যবস্থায় নিয়ে গেছেন। তাঁর কাজ ওয়েব অ্যাপ্লিকেশন, ডেস্কটপ সফটওয়্যার, ব্রাউজার, উৎপাদনশীলতা ও নিরাপত্তার সরঞ্জাম, কৃত্রিম বুদ্ধিমত্তার প্রকল্প এবং AG-এর অধীনে তৈরি পরীক্ষামূলক প্রযুক্তি জুড়ে বিস্তৃত।'
    ],
    ru: [
        'Мухаммад Хамза Сабир — разработчик программного обеспечения в AG. Он занимается проектированием, разработкой и поддержкой цифровых продуктов и платформ AG. Его работа охватывает фронтенд и бэкенд, реализацию интерфейсов и пользовательского опыта, системы аутентификации, базы данных, API, функции безопасности, интеграции, тестирование, развёртывание и постоянное улучшение продуктов.',
        'Он самостоятельно разработал кодовую базу каждого продукта AG, созданного к настоящему времени, доводя проекты от первоначальных концепций и прототипов до работающих приложений и готовых к эксплуатации систем. Его работа включает веб-приложения, настольное ПО, браузеры, инструменты продуктивности и безопасности, проекты искусственного интеллекта и экспериментальные технологии, разработанные под именем AG.'
    ],
    it: [
        'Muhammad Hamza Sabir è uno sviluppatore software di AG e si occupa della progettazione, dello sviluppo e della manutenzione dei suoi prodotti e delle sue piattaforme digitali. Il suo lavoro comprende frontend e backend, implementazione di UI/UX, sistemi di autenticazione, database, API, funzionalità di sicurezza, integrazioni, test, distribuzione e miglioramenti continui dei prodotti.',
        'Ha sviluppato autonomamente il codice di ogni prodotto AG realizzato finora, portando i progetti dai concetti e prototipi iniziali ad applicazioni funzionanti e sistemi pronti per la produzione. Il suo lavoro comprende applicazioni web, software desktop, browser, strumenti di produttività e sicurezza, progetti di intelligenza artificiale e tecnologie sperimentali sviluppate sotto il nome AG.'
    ],
    pt: [
        'Muhammad Hamza Sabir é desenvolvedor de software da AG e trabalha no design, desenvolvimento e manutenção de seus produtos e plataformas digitais. Seu trabalho abrange frontend e backend, implementação de UI/UX, sistemas de autenticação, bancos de dados, APIs, recursos de segurança, integrações, testes, implantação e melhorias contínuas dos produtos.',
        'Ele desenvolveu de forma independente o código de todos os produtos AG criados até agora, levando os projetos dos conceitos e protótipos iniciais a aplicações funcionais e sistemas prontos para produção. Seu trabalho inclui aplicações web, software desktop, navegadores, ferramentas de produtividade e segurança, projetos de inteligência artificial e tecnologias experimentais desenvolvidas sob a AG.'
    ],
    ko: [
        'Muhammad Hamza Sabir는 AG의 소프트웨어 개발자로서 AG의 디지털 제품과 플랫폼의 설계, 개발, 유지보수를 담당합니다. 프론트엔드 및 백엔드 개발, UI/UX 구현, 인증 시스템, 데이터베이스, API, 보안 기능, 통합, 테스트, 배포, 지속적인 제품 개선을 수행합니다.',
        '지금까지 만들어진 모든 AG 제품의 코드베이스를 독립적으로 개발하여, 초기 아이디어와 프로토타입을 실제로 작동하는 애플리케이션과 운영 가능한 시스템으로 발전시켰습니다. 그의 작업은 웹 애플리케이션, 데스크톱 소프트웨어, 브라우저, 생산성 및 보안 도구, AI 관련 프로젝트, AG에서 개발하는 실험적 기술에 걸쳐 있습니다.'
    ],
    id: [
        'Muhammad Hamza Sabir adalah pengembang perangkat lunak di AG yang menangani desain, pengembangan, dan pemeliharaan produk serta platform digital AG. Pekerjaannya meliputi pengembangan frontend dan backend, penerapan UI/UX, sistem autentikasi, basis data, API, fitur keamanan, integrasi, pengujian, penerapan, dan perbaikan produk yang berkelanjutan.',
        'Ia secara mandiri mengembangkan basis kode setiap produk AG yang dibuat hingga kini, membawa proyek dari konsep dan prototipe awal menjadi aplikasi yang berfungsi serta sistem siap produksi. Pekerjaannya mencakup aplikasi web, perangkat lunak desktop, peramban, alat produktivitas dan keamanan, proyek terkait AI, serta teknologi eksperimental yang dikembangkan di bawah AG.'
    ]
};
for (const [language, paragraphs] of Object.entries(biography)) {
    for (const [index, key] of TEAM_BIO_KEYS.entries()) catalogueTranslations[language][key] = paragraphs[index];
}

export const CATALOGUE_ERROR_KEYS = ['catalogue.ownerError', 'catalogue.areaError', 'catalogue.duplicateError'];
const errors = {
    en: 'Select up to 10 distinct members from the actual Team records.|Select valid development areas without duplicates.|Multiple saved products match one confirmed project. Review the duplicate records before importing.',
    ur: 'ٹیم کے حقیقی ریکارڈز سے زیادہ سے زیادہ ۱۰ مختلف ارکان منتخب کریں۔|درست ترقی کے شعبے منتخب کریں اور کوئی شعبہ دوبارہ شامل نہ کریں۔|ایک تصدیق شدہ منصوبے کے کئی ریکارڈز موجود ہیں۔ شامل کرنے سے پہلے نقل ریکارڈز کا جائزہ لیں۔',
    ar: 'اختر حتى 10 أعضاء مختلفين من سجلات الفريق الفعلية.|اختر مجالات تطوير صحيحة دون تكرار.|توجد منتجات محفوظة متعددة تطابق مشروعًا واحدًا. راجع السجلات المكررة قبل الاستيراد.',
    tr: 'Gerçek ekip kayıtlarından en fazla 10 farklı üye seçin.|Geçerli geliştirme alanlarını tekrarlamadan seçin.|Birden fazla ürün aynı doğrulanmış projeyle eşleşiyor. İçe aktarmadan önce yinelenen kayıtları inceleyin.',
    ja: '実在するチームメンバーから重複せず最大10人を選んでください。|有効な開発分野を重複せず選んでください。|同じ確認済みプロジェクトに複数の保存製品が一致します。取り込む前に重複レコードを確認してください。',
    zh: '从实际团队记录中选择最多10名不同成员。|选择有效且不重复的开发领域。|多个保存的产品对应同一已确认项目。导入前请检查重复记录。',
    pa: 'ٹیم دے اصلی ریکارڈاں توں ودھ توں ودھ ۱۰ وکھرے رکن چنو۔|صحیح تیاری دے شعبے چنو تے کوئی شعبہ فیر شامل نہ کرو۔|اک تصدیق شدہ منصوبے دے کئی ریکارڈ نیں۔ شامل کرن توں پہلاں نقل ریکارڈ ویکھو۔',
    ps: 'د ټیم له اصلي ریکارډونو تر ۱۰ بېلابېل غړي وټاکئ.|د پراختیا سمې برخې له تکرار پرته وټاکئ.|څو خوندي محصولات له یوې تایید شوې پروژې سره سمون لري. له ورزیاتولو مخکې تکراري ریکارډونه وګورئ.',
    bal: 'ٹیم ءِ اصلی ریکارڈاں چہ گیشتر چہ ۱۰ جتا رکن مچین۔|درستیں جوڑ کنگ ءِ شعبہ بچین ءُ دوبارہ شامل مکن۔|یک تصدیق بوتگیں منصوبہ ءِ چند ریکارڈ است۔ شامل کنگ ءَ پیش نقل ریکارڈ بچار۔',
    fr: 'Choisissez jusqu’à 10 membres distincts dans les véritables dossiers de l’équipe.|Choisissez des domaines de développement valides sans doublons.|Plusieurs produits correspondent au même projet confirmé. Vérifiez les doublons avant l’importation.',
    es: 'Selecciona hasta 10 miembros distintos de los registros reales del equipo.|Selecciona áreas de desarrollo válidas sin duplicados.|Varios productos guardados coinciden con el mismo proyecto confirmado. Revisa los duplicados antes de importar.',
    de: 'Bis zu 10 unterschiedliche Mitglieder aus echten Teamdatensätzen auswählen.|Gültige Entwicklungsbereiche ohne Duplikate auswählen.|Mehrere gespeicherte Produkte entsprechen einem bestätigten Projekt. Duplikate vor dem Import prüfen.',
    sd: 'ٽيم جي حقيقي رڪارڊن مان وڌ ۾ وڌ ۱۰ مختلف رڪن چونڊيو.|صحيح ترقي جا شعبا چونڊيو ۽ ڪو شعبو ٻيهر شامل نه ڪريو.|هڪ تصديق ٿيل منصوبي جا ڪيترائي رڪارڊ آهن. شامل ڪرڻ کان اڳ نقل رڪارڊ ڏسو.',
    hnd: 'ٹیم دے اصلی ریکارڈاں توں ودھ توں ودھ ۱۰ وکھرے رکن چنو۔|صحیح تیاری دے شعبے چنو تے کوئی شعبہ فیر شامل نہ کرو۔|اک تصدیق شدہ منصوبے دے کئی ریکارڈ نیں۔ شامل کرن توں پہلاں نقل ریکارڈ ویکھو۔',
    skr: 'ٹیم دے اصلی ریکارڈاں توں ودھ توں ودھ ۱۰ وکھرے رکن چُݨو۔|صحیح تیاری دے شعبے چُݨو تے کوئی شعبہ ول شامل نہ کرو۔|ہک تصدیق شدہ منصوبے دے کئی ریکارڈ ہن۔ شامل کرݨ توں پہلے نقل ریکارڈ ݙیکھو۔',
    hi: 'वास्तविक टीम रिकॉर्ड से अधिकतम 10 अलग-अलग सदस्य चुनें।|सही विकास क्षेत्र चुनें और कोई क्षेत्र दोबारा न जोड़ें।|एक पुष्ट परियोजना से कई सहेजे गए उत्पाद मेल खाते हैं। आयात करने से पहले दोहरे रिकॉर्ड जाँचें।',
    ur_roman: 'Team ke haqeeqi records se zyada se zyada 10 mukhtalif arkaan chunein.|Durust taraqqi ke shobay chunein aur koi shoba dobara shamil na karein.|Aik tasdeeq shuda mansoobay ke kai records maujood hain. Import se pehle naqal records ka jaiza lein.',
    bn: 'প্রকৃত দলের রেকর্ড থেকে সর্বোচ্চ 10 জন আলাদা সদস্য বেছে নিন।|সঠিক উন্নয়নের ক্ষেত্র বেছে নিন, কোনোটি দুবার নয়।|একটি নিশ্চিত প্রকল্পের সঙ্গে একাধিক সংরক্ষিত পণ্য মিলে যাচ্ছে। আমদানির আগে সদৃশ রেকর্ড যাচাই করুন।',
    ru: 'Выберите до 10 разных участников из реальных записей команды.|Выберите допустимые области разработки без повторов.|Несколько продуктов соответствуют одному подтверждённому проекту. Проверьте дубликаты до импорта.',
    it: 'Seleziona fino a 10 membri distinti dai dati reali del team.|Seleziona aree di sviluppo valide senza duplicati.|Più prodotti corrispondono allo stesso progetto confermato. Controlla i duplicati prima dell’importazione.',
    pt: 'Selecione até 10 membros distintos dos registros reais da equipe.|Selecione áreas de desenvolvimento válidas sem duplicatas.|Vários produtos correspondem ao mesmo projeto confirmado. Revise as duplicatas antes de importar.',
    ko: '실제 팀 기록에서 서로 다른 구성원을 최대 10명 선택하세요.|유효한 개발 분야를 중복 없이 선택하세요.|여러 저장된 제품이 하나의 확인된 프로젝트와 일치합니다. 가져오기 전에 중복 기록을 확인하세요.',
    id: 'Pilih hingga 10 anggota berbeda dari catatan tim yang nyata.|Pilih bidang pengembangan yang valid tanpa duplikasi.|Beberapa produk tersimpan cocok dengan satu proyek terkonfirmasi. Periksa catatan duplikat sebelum mengimpor.'
};
for (const [language, row] of Object.entries(errors)) {
    Object.assign(catalogueTranslations[language], phrasePack(CATALOGUE_ERROR_KEYS, row, language));
}

export const CATALOGUE_WEBSITE_KEYS = ['catalogue.informationWebsite', 'catalogue.informationWebsiteHint'];
const informationWebsite = {
    en: 'Product website (optional)|A product information website does not mean the application runs in a browser.',
    ur: 'مصنوع کی معلومات کی ویب سائٹ (اختیاری)|مصنوع کی معلومات کی ویب سائٹ ہونے کا مطلب یہ نہیں کہ ایپلیکیشن براؤزر میں چلتی ہے۔',
    ar: 'موقع المنتج (اختياري)|وجود موقع معلومات للمنتج لا يعني أن التطبيق يعمل في المتصفح.',
    tr: 'Ürün web sitesi (isteğe bağlı)|Ürün hakkında bilgi veren bir web sitesi, uygulamanın tarayıcıda çalıştığı anlamına gelmez.',
    ja: '製品のウェブサイト（任意）|製品情報のウェブサイトがあっても、アプリがブラウザーで動作するとは限りません。',
    zh: '产品网站（可选）|产品信息网站不代表应用程序在浏览器中运行。',
    pa: 'مصنوع دی ویب سائٹ (چاہو تے)|مصنوع دی معلومات دی ویب سائٹ ہون دا مطلب ایہ نئیں کہ ایپلیکیشن براؤزر وچ چل دی اے۔',
    ps: 'د محصول وېبپاڼه (اختیاري)|د محصول د معلوماتو وېبپاڼه دا نه معنا کوي چې اپلېکېشن په براوزر کې کار کوي.',
    bal: 'مصنوع ءِ ویب سائٹ (اختیاری)|مصنوع ءِ معلومات ءِ ویب سائٹ ءِ بوگ ءِ مطلب اے نہ انت کہ ایپلیکیشن براؤزر ءَ کار کنت۔',
    fr: 'Site du produit (facultatif)|Un site présentant un produit ne signifie pas que l’application fonctionne dans un navigateur.',
    es: 'Sitio web del producto (opcional)|Un sitio informativo del producto no significa que la aplicación funcione en un navegador.',
    de: 'Produktwebsite (optional)|Eine Informationswebsite zum Produkt bedeutet nicht, dass die Anwendung im Browser läuft.',
    sd: 'پراڊڪٽ جي ويب سائيٽ (اختياري)|پراڊڪٽ جي معلومات جي ويب سائيٽ هجڻ جو مطلب ناهي ته ايپليڪيشن برائوزر ۾ هلي ٿي.',
    hnd: 'مصنوع دی ویب سائٹ (اختیاری)|مصنوع دی معلومات دی ویب سائٹ ہون دا مطلب ایہ نئیں کہ ایپلیکیشن براؤزر وچ چل دی اے۔',
    skr: 'مصنوع دی ویب سائٹ (اختیاری)|مصنوع دی معلومات دی ویب سائٹ ہووݨ دا مطلب ایہ کائنی کہ ایپلیکیشن براؤزر وچ چل دی ہے۔',
    hi: 'उत्पाद की वेबसाइट (वैकल्पिक)|उत्पाद की जानकारी देने वाली वेबसाइट का मतलब यह नहीं है कि एप्लिकेशन ब्राउज़र में चलता है।',
    ur_roman: 'Masnooa ki website (ikhtiyari)|Masnooa ki maloomat ki website hone ka matlab yeh nahi ke application browser mein chalti hai.',
    bn: 'পণ্যের ওয়েবসাইট (ঐচ্ছিক)|পণ্যের তথ্যের ওয়েবসাইট থাকা মানে এই নয় যে অ্যাপ্লিকেশনটি ব্রাউজারে চলে।',
    ru: 'Сайт продукта (необязательно)|Наличие информационного сайта продукта не означает, что приложение работает в браузере.',
    it: 'Sito del prodotto (facoltativo)|Un sito informativo sul prodotto non significa che l’applicazione funzioni in un browser.',
    pt: 'Site do produto (opcional)|Um site com informações do produto não significa que o aplicativo funciona em um navegador.',
    ko: '제품 웹사이트 (선택 사항)|제품 안내 웹사이트가 있다고 해서 애플리케이션이 브라우저에서 실행되는 것은 아닙니다.',
    id: 'Situs produk (opsional)|Situs informasi produk tidak berarti aplikasinya berjalan di peramban.'
};
for (const [language, row] of Object.entries(informationWebsite)) {
    Object.assign(catalogueTranslations[language], phrasePack(CATALOGUE_WEBSITE_KEYS, row, language));
}

// Database errors never imply a fallback catalogue is being displayed.
const databaseLoadErrors = {
    "en": "Products could not be loaded. Please try again.",
    "ur": "مصنوعات لوڈ نہیں ہو سکیں۔ دوبارہ کوشش کریں۔",
    "ar": "تعذر تحميل المنتجات. حاول مرة أخرى.",
    "tr": "Ürünler yüklenemedi. Lütfen tekrar deneyin.",
    "ja": "製品を読み込めませんでした。もう一度お試しください。",
    "zh": "无法加载产品。请重试。",
    "pa": "مصنوعات لوڈ نہیں ہو سکیاں۔ دوبارہ کوشش کرو۔",
    "ps": "محصولات پورته نه شول. بیا هڅه وکړئ.",
    "bal": "مصنوعات لوڈ نہ بوتگ۔ پدا کوشش بکن۔",
    "fr": "Impossible de charger les produits. Veuillez réessayer.",
    "es": "No se pudieron cargar los productos. Inténtalo de nuevo.",
    "de": "Produkte konnten nicht geladen werden. Bitte erneut versuchen.",
    "sd": "مصنوعات لوڊ نه ٿي سگهيون. ٻيهر ڪوشش ڪريو.",
    "hnd": "مصنوعات لوڈ نہیں ہو سکیاں۔ دوبارہ کوشش کرو۔",
    "skr": "مصنوعات لوڈ نہیں تھی سکیاں۔ ول کوشش کرو۔",
    "hi": "उत्पाद लोड नहीं हो सके। फिर से कोशिश करें।",
    "ur_roman": "Products load nahi ho sake. Dobara koshish karein.",
    "bn": "পণ্য লোড করা যায়নি। আবার চেষ্টা করুন।",
    "ru": "Не удалось загрузить продукты. Попробуйте ещё раз.",
    "it": "Impossibile caricare i prodotti. Riprova.",
    "pt": "Não foi possível carregar os produtos. Tente novamente.",
    "ko": "제품을 불러오지 못했습니다. 다시 시도하세요.",
    "id": "Produk tidak dapat dimuat. Silakan coba lagi."
};
for (const [language,message] of Object.entries(databaseLoadErrors)) catalogueTranslations[language]["catalogue.catalogueLoadError"]=message;
