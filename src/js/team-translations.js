// Interface labels; the member's supplied biography remains authored content.
const rows={
en:'Our Team|Lead Developer & Software Engineer|View Portfolio',
ur:'ہماری ٹیم|لیڈ ڈویلپر اور سافٹ ویئر انجینئر|پورٹ فولیو دیکھیں',
ar:'فريقنا|المطور الرئيسي ومهندس البرمجيات|عرض الأعمال',
tr:'Ekibimiz|Baş geliştirici ve yazılım mühendisi|Portföyü görüntüle',
ja:'私たちのチーム|リード開発者・ソフトウェアエンジニア|ポートフォリオを見る',
zh:'我们的团队|首席开发者与软件工程师|查看作品集',
pa:'ساڈی ٹیم|لیڈ ڈویلپر تے سافٹ ویئر انجینئر|پورٹ فولیو ویکھو',
ps:'زموږ ټیم|مخکښ پراختیاکوونکی او د سافټویر انجنیر|پورټ فولیو وګورئ',
bal:'ما ءِ ٹیم|لیڈ ڈویلپر ءُ سافٹ ویئر انجینئر|پورٹ فولیو بچار',
fr:'Notre équipe|Développeur principal et ingénieur logiciel|Voir le portfolio',
es:'Nuestro equipo|Desarrollador principal e ingeniero de software|Ver portafolio',
de:'Unser Team|Leitender Entwickler und Softwareingenieur|Portfolio ansehen',
sd:'اسان جي ٽيم|ليڊ ڊولپر ۽ سافٽ ويئر انجنيئر|پورٽ فوليو ڏسو',
hnd:'ساڈی ٹیم|لیڈ ڈویلپر تے سافٹ ویئر انجینئر|پورٹ فولیو ویکھو',
skr:'ساݙی ٹیم|لیڈ ڈویلپر تے سافٹ ویئر انجینئر|پورٹ فولیو ݙیکھو',
hi:'हमारी टीम|प्रमुख डेवलपर और सॉफ्टवेयर इंजीनियर|पोर्टफोलियो देखें',
ur_roman:'Hamari Team|Lead Developer aur Software Engineer|Portfolio dekhein',
bn:'আমাদের দল|প্রধান ডেভেলপার ও সফটওয়্যার প্রকৌশলী|পোর্টফোলিও দেখুন',
ru:'Наша команда|Ведущий разработчик и инженер программного обеспечения|Посмотреть портфолио',
it:'Il nostro team|Sviluppatore principale e ingegnere del software|Visualizza portfolio',
pt:'Nossa equipe|Desenvolvedor principal e engenheiro de software|Ver portfólio',
ko:'우리 팀|수석 개발자 및 소프트웨어 엔지니어|포트폴리오 보기',
id:'Tim kami|Pengembang utama dan insinyur perangkat lunak|Lihat portofolio'
};
export const teamTranslations=Object.fromEntries(Object.entries(rows).map(([language,row])=>[language,Object.fromEntries(['team.title','team.role','team.portfolio'].map((key,index)=>[key,row.split('|')[index]]))]));
