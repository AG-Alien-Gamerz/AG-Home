// New controls retain the same language coverage as the existing Settings.
const copy={
 en:['Notifications','Enable notifications','Firebase SMS requires billing. AG must also configure Phone sign-in, SMS regions and reCAPTCHA.','Report to AG'],
 ur:['اطلاعات','اطلاعات فعال کریں','Firebase ایس ایم ایس کے لیے بلنگ ضروری ہے۔ AG کو فون لاگ ان، ایس ایم ایس علاقوں اور reCAPTCHA کی ترتیبات بھی مکمل کرنا ہوں گی۔','AG کو رپورٹ کریں'],
 ar:['الإشعارات','تفعيل الإشعارات','تتطلب رسائل Firebase تفعيل الفوترة وإعداد تسجيل الهاتف ومناطق الرسائل وreCAPTCHA.','إبلاغ AG'],
 tr:['Bildirimler','Bildirimleri etkinleştir','Firebase SMS için faturalandırma, telefon girişi, SMS bölgeleri ve reCAPTCHA ayarlanmalıdır.','AG’ye bildir'],
 ja:['通知','通知を有効にする','Firebase SMSには課金設定と電話認証、SMS地域、reCAPTCHAの設定が必要です。','AGに報告'],
 zh:['通知','启用通知','Firebase 短信需要启用结算，并配置手机登录、短信地区和 reCAPTCHA。','向 AG 报告'],
 pa:['اطلاعات','اطلاعات چالو کرو','Firebase SMS لئی بلنگ ضروری اے۔ فون لاگ ان، SMS علاقے تے reCAPTCHA وی ترتیب دینا پئے گا۔','AG نوں رپورٹ کرو'],
 ps:['خبرتیاوې','خبرتیاوې فعالې کړئ','د Firebase SMS لپاره بلینګ، د تلیفون ننوتل، د SMS سیمې او reCAPTCHA تنظیمول اړین دي.','AG ته راپور ورکړئ'],
 bal:['اطلاعات','اطلاعات فعال بکن','Firebase SMS ءِ واستا بلنگ، فون لاگ ان، SMS علاقہ ءُ reCAPTCHA ءِ ترتیب ضروری انت۔','AG ءَ رپورٹ بکن'],
 fr:['Notifications','Activer les notifications','Les SMS Firebase nécessitent la facturation et la configuration du téléphone, des régions SMS et de reCAPTCHA.','Signaler à AG'],
 es:['Notificaciones','Activar notificaciones','Los SMS de Firebase requieren facturación y configurar el acceso telefónico, las regiones SMS y reCAPTCHA.','Informar a AG'],
 de:['Benachrichtigungen','Benachrichtigungen aktivieren','Firebase-SMS benötigen Abrechnung sowie die Einrichtung von Telefonanmeldung, SMS-Regionen und reCAPTCHA.','An AG melden'],
 sd:['اطلاعون','اطلاعون فعال ڪريو','Firebase SMS لاءِ بلنگ ضروري آهي. فون لاگ ان، SMS علائقن ۽ reCAPTCHA جون سيٽنگون پڻ ڪرڻيون آهن.','AG کي رپورٽ ڪريو'],
 hnd:['اطلاعات','اطلاعات چالو کرو','Firebase SMS واسطے بلنگ ضروری اے۔ فون لاگ ان، SMS علاقے تے reCAPTCHA دی ترتیب وی کرو۔','AG نوں رپورٹ کرو'],
 skr:['اطلاعات','اطلاعات چالو کرو','Firebase SMS کیتے بلنگ ضروری ہے۔ فون لاگ ان، SMS علاقے تے reCAPTCHA دی ترتیب وی ضروری ہے۔','AG کوں رپورٹ کرو'],
 hi:['सूचनाएँ','सूचनाएँ चालू करें','Firebase SMS के लिए बिलिंग और फ़ोन लॉगिन, SMS क्षेत्र तथा reCAPTCHA का सेटअप ज़रूरी है।','AG को रिपोर्ट करें'],
 ur_roman:['Notifications','Notifications on karein','Firebase SMS ke liye billing zaroori hai. AG ko Phone login, SMS regions aur reCAPTCHA bhi configure karna hoga.','AG ko report karein'],
 bn:['বিজ্ঞপ্তি','বিজ্ঞপ্তি চালু করুন','Firebase SMS-এর জন্য বিলিং এবং ফোন লগইন, SMS অঞ্চল ও reCAPTCHA কনফিগার করা প্রয়োজন।','AG-কে রিপোর্ট করুন'],
 ru:['Уведомления','Включить уведомления','Для Firebase SMS нужны биллинг, настройка входа по телефону, регионов SMS и reCAPTCHA.','Сообщить AG'],
 it:['Notifiche','Attiva notifiche','Gli SMS Firebase richiedono fatturazione e configurazione di accesso telefonico, regioni SMS e reCAPTCHA.','Segnala ad AG'],
 pt:['Notificações','Ativar notificações','O SMS Firebase requer faturamento e configuração do acesso por telefone, regiões SMS e reCAPTCHA.','Reportar à AG'],
 ko:['알림','알림 활성화','Firebase SMS에는 결제 설정과 전화 로그인, SMS 지역 및 reCAPTCHA 구성이 필요합니다.','AG에 신고'],
 id:['Notifikasi','Aktifkan notifikasi','SMS Firebase memerlukan penagihan dan konfigurasi login telepon, wilayah SMS, serta reCAPTCHA.','Laporkan ke AG']
};
export const notificationTranslations=Object.fromEntries(Object.entries(copy).map(([language,[title,enable,billing,report]])=>[language,{'notifications.title':title,'notifications.enable':enable,'phone.billing':billing,'phone.report':report}]));
