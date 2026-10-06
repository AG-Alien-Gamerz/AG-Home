const keys = ['character.appearance','character.robot','character.hamza','character.fatima','character.animeBoy','character.animeGirl','character.gender'];
const packs = {
    en:['Character appearance','Robot','Hamza · Pakistani boy','Fatima · Pakistani girl','Anime boy','Anime girl','Robot gender'],
    ur:['کردار کی شکل','روبوٹ','حمزہ · پاکستانی لڑکا','فاطمہ · پاکستانی لڑکی','اینیمے لڑکا','اینیمے لڑکی','روبوٹ کی جنس'],
    ar:['مظهر الشخصية','روبوت','حمزة · فتى باكستاني','فاطمة · فتاة باكستانية','فتى أنمي','فتاة أنمي','جنس الروبوت'],
    tr:['Karakter görünümü','Robot','Hamza · Pakistanlı erkek','Fatima · Pakistanlı kız','Anime erkek','Anime kız','Robot cinsiyeti'],
    ja:['キャラクターの外見','ロボット','ハムザ · パキスタンの男の子','ファティマ · パキスタンの女の子','アニメの男の子','アニメの女の子','ロボットの性別'],
    zh:['角色外观','机器人','哈姆扎 · 巴基斯坦男孩','法蒂玛 · 巴基斯坦女孩','动漫男孩','动漫女孩','机器人性别'],
    pa:['کردار دی شکل','روبوٹ','حمزہ · پاکستانی منڈا','فاطمہ · پاکستانی کڑی','اینیمے منڈا','اینیمے کڑی','روبوٹ دی جنس'],
    ps:['د کرکټر بڼه','روبوټ','حمزه · پاکستانی هلک','فاطمه · پاکستانۍ نجلۍ','د انیمې هلک','د انیمې نجلۍ','د روبوټ جنس'],
    bal:['کردار ءِ شکل','روبوٹ','حمزہ · پاکستانی بچک','فاطمہ · پاکستانی جنک','اینیمے بچک','اینیمے جنک','روبوٹ ءِ جنس'],
    fr:['Apparence du personnage','Robot','Hamza · garçon pakistanais','Fatima · fille pakistanaise','Garçon animé','Fille animée','Genre du robot'],
    es:['Apariencia del personaje','Robot','Hamza · chico pakistaní','Fatima · chica pakistaní','Chico de anime','Chica de anime','Género del robot'],
    de:['Aussehen der Figur','Roboter','Hamza · pakistanischer Junge','Fatima · pakistanisches Mädchen','Anime-Junge','Anime-Mädchen','Geschlecht des Roboters'],
    sd:['ڪردار جي شڪل','روبوٽ','حمزه · پاڪستاني ڇوڪرو','فاطمه · پاڪستاني ڇوڪري','اينيمي ڇوڪرو','اينيمي ڇوڪري','روبوٽ جي جنس'],
    hnd:['کردار دی شکل','روبوٹ','حمزہ · پاکستانی منڈا','فاطمہ · پاکستانی کڑی','اینیمے منڈا','اینیمے کڑی','روبوٹ دی جنس'],
    skr:['کردار دی شکل','روبوٹ','حمزہ · پاکستانی چھوہرا','فاطمہ · پاکستانی چھوہری','اینیمے چھوہرا','اینیمے چھوہری','روبوٹ دی جنس'],
    hi:['पात्र का रूप','रोबोट','हमज़ा · पाकिस्तानी लड़का','फ़ातिमा · पाकिस्तानी लड़की','एनीमे लड़का','एनीमे लड़की','रोबोट का लिंग'],
    ur_roman:['Character ki shakal','Robot','Hamza · Pakistani ladka','Fatima · Pakistani ladki','Anime ladka','Anime ladki','Robot ki jins'],
    bn:['চরিত্রের চেহারা','রোবট','হামজা · পাকিস্তানি ছেলে','ফাতিমা · পাকিস্তানি মেয়ে','অ্যানিমে ছেলে','অ্যানিমে মেয়ে','রোবটের লিঙ্গ'],
    ru:['Внешность персонажа','Робот','Хамза · пакистанский мальчик','Фатима · пакистанская девочка','Мальчик аниме','Девочка аниме','Пол робота'],
    it:['Aspetto del personaggio','Robot','Hamza · ragazzo pakistano','Fatima · ragazza pakistana','Ragazzo anime','Ragazza anime','Genere del robot'],
    pt:['Aparência do personagem','Robô','Hamza · menino paquistanês','Fatima · menina paquistanesa','Menino de anime','Menina de anime','Gênero do robô'],
    ko:['캐릭터 외형','로봇','함자 · 파키스탄 소년','파티마 · 파키스탄 소녀','애니메이션 소년','애니메이션 소녀','로봇 성별'],
    id:['Tampilan karakter','Robot','Hamza · anak laki-laki Pakistan','Fatima · anak perempuan Pakistan','Anak laki-laki anime','Anak perempuan anime','Gender robot']
};
export const characterTranslations = Object.fromEntries(Object.entries(packs).map(([language,values]) => {
    if (values.length !== keys.length) throw new Error('Incomplete character translations: '+language);
    return [language,Object.fromEntries(keys.map((key,index) => [key,values[index]]))];
}));
