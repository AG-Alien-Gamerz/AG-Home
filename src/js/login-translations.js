export const LOGIN_KEYS = ['login.identifier','phone.hint','phone.sent','phone.resend','phone.expired','phone.captcha'];
const rows = {
en:['Email or Username','Include the country code. SMS rates may apply.','Verification code sent by SMS.','Resend code','This code has expired. Request another code.','Complete the security check and try again.'],
ur:['ای میل یا صارف نام','ملکی کوڈ شامل کریں۔ ایس ایم ایس کے چارجز لاگو ہو سکتے ہیں۔','تصدیقی کوڈ ایس ایم ایس سے بھیج دیا گیا۔','کوڈ دوبارہ بھیجیں','یہ کوڈ ختم ہو چکا ہے۔ نیا کوڈ منگوائیں۔','حفاظتی جانچ مکمل کریں اور دوبارہ کوشش کریں۔'],
ar:['البريد الإلكتروني أو اسم المستخدم','أدخل رمز الدولة. قد تُطبق رسوم الرسائل.','تم إرسال رمز التحقق برسالة نصية.','إعادة إرسال الرمز','انتهت صلاحية الرمز. اطلب رمزًا جديدًا.','أكمل التحقق الأمني ثم حاول مجددًا.'],
tr:['E-posta veya kullanıcı adı','Ülke kodunu ekleyin. SMS ücreti uygulanabilir.','Doğrulama kodu SMS ile gönderildi.','Kodu yeniden gönder','Kodun süresi doldu. Yeni kod isteyin.','Güvenlik kontrolünü tamamlayıp tekrar deneyin.'],
ja:['メールまたはユーザー名','国番号を含めてください。SMS料金がかかる場合があります。','SMSで確認コードを送信しました。','コードを再送','コードの有効期限が切れました。再送してください。','セキュリティ確認を完了して再試行してください。'],
zh:['邮箱或用户名','请输入国家代码，短信可能产生费用。','验证码已通过短信发送。','重新发送验证码','验证码已过期，请重新获取。','请完成安全验证后重试。'],
pa:['ای میل یا صارف ناں','ملک دا کوڈ شامل کرو۔ ایس ایم ایس دے چارج لگ سکدے نیں۔','تصدیق دا کوڈ ایس ایم ایس نال بھیج دتا اے۔','کوڈ دوبارہ بھیجو','کوڈ دی مدت مک گئی اے۔ نواں کوڈ منگواؤ۔','حفاظتی جانچ پوری کرو تے فیر کوشش کرو۔'],
ps:['برېښنالیک یا کارن نوم','د هېواد کوډ ولیکئ. د پیغام لګښت کېدای شي ولګول شي.','د تایید کوډ د پیغام له لارې ولېږل شو.','کوډ بیا ولېږئ','کوډ پای ته رسېدلی. نوی کوډ وغواړئ.','امنیتي کتنه بشپړه او بیا هڅه وکړئ.'],
bal:['ای میل یا کاربر ءِ نام','ملک ءِ کوڈ شامل بکنت۔ ایس ایم ایس ءِ خرچ لاگو بیت۔','تصدیق ءِ کوڈ ایس ایم ایس ءَ دیم داتگ بوت۔','کوڈ پدا دیم بدئے','کوڈ ءِ وخت خلاص بوتگ۔ نوکیں کوڈ بلوت۔','حفاظتی جانچ پورا بکنت ءُ پدا کوشش بکنت۔'],
fr:['E-mail ou nom d’utilisateur','Incluez l’indicatif du pays. Des frais SMS peuvent s’appliquer.','Code de vérification envoyé par SMS.','Renvoyer le code','Ce code a expiré. Demandez un nouveau code.','Terminez le contrôle de sécurité et réessayez.'],
es:['Correo o nombre de usuario','Incluye el prefijo del país. Pueden aplicarse tarifas de SMS.','Código de verificación enviado por SMS.','Reenviar código','Este código ha caducado. Solicita otro.','Completa la verificación de seguridad e inténtalo de nuevo.'],
de:['E-Mail oder Benutzername','Ländervorwahl angeben. SMS-Gebühren können anfallen.','Bestätigungscode per SMS gesendet.','Code erneut senden','Dieser Code ist abgelaufen. Neuen Code anfordern.','Sicherheitsprüfung abschließen und erneut versuchen.'],
sd:['اي ميل يا صارف نالو','ملڪ جو ڪوڊ شامل ڪريو. ايس ايم ايس جا خرچ لڳي سگهن ٿا.','تصديق جو ڪوڊ ايس ايم ايس ذريعي موڪليو ويو.','ڪوڊ ٻيهر موڪليو','ڪوڊ ختم ٿي چڪو آهي. نئون ڪوڊ گهرايو.','حفاظتي جاچ مڪمل ڪري ٻيهر ڪوشش ڪريو.'],
hnd:['ای میل یا صارف ناں','ملک دا کوڈ شامل کرو۔ ایس ایم ایس دے چارج لگ سکدے نیں۔','تصدیق دا کوڈ ایس ایم ایس نال بھیج دتا اے۔','کوڈ دوبارہ بھیجو','کوڈ دی مدت مک گئی اے۔ نواں کوڈ منگواؤ۔','حفاظتی جانچ پوری کرو تے دوبارہ کوشش کرو۔'],
skr:['ای میل یا صارف ناں','ملک دا کوڈ شامل کرو۔ ایس ایم ایس دے چارج لڳ سڳدن۔','تصدیق دا کوڈ ایس ایم ایس نال بھیڄ ݙتا ڳئے۔','کوڈ ول بھیڄو','کوڈ دی مدت مک ڳئی اے۔ نواں کوڈ منگاؤ۔','حفاظتی جانچ پوری کرو تے ول کوشش کرو۔'],
hi:['ईमेल या उपयोगकर्ता नाम','देश का कोड शामिल करें। SMS शुल्क लागू हो सकता है।','सत्यापन कोड SMS से भेजा गया।','कोड फिर भेजें','कोड की अवधि समाप्त हो गई। नया कोड माँगें।','सुरक्षा जाँच पूरी करके फिर प्रयास करें।'],
ur_roman:['Email ya Username','Mulki code shamil karein. SMS charges lag sakte hain.','Tasdeeq ka code SMS se bhej diya gaya.','Code dobara bhejein','Code ki muddat khatam ho gayi. Naya code mangwayein.','Hifazati jaanch mukammal karein aur dobara koshish karein.'],
bn:['ইমেইল বা ব্যবহারকারীর নাম','দেশের কোড দিন। SMS চার্জ প্রযোজ্য হতে পারে।','যাচাইকরণ কোড SMS-এ পাঠানো হয়েছে।','কোড আবার পাঠান','কোডের মেয়াদ শেষ। নতুন কোড চাইুন।','নিরাপত্তা যাচাই সম্পন্ন করে আবার চেষ্টা করুন।'],
ru:['Почта или имя пользователя','Укажите код страны. Возможна плата за SMS.','Код подтверждения отправлен по SMS.','Отправить код снова','Срок действия кода истёк. Запросите новый.','Пройдите проверку безопасности и повторите попытку.'],
it:['E-mail o nome utente','Includi il prefisso internazionale. Potrebbero applicarsi costi SMS.','Codice di verifica inviato via SMS.','Reinvia codice','Il codice è scaduto. Richiedine un altro.','Completa il controllo di sicurezza e riprova.'],
pt:['E-mail ou nome de usuário','Inclua o código do país. Podem ser cobradas taxas de SMS.','Código de verificação enviado por SMS.','Reenviar código','Este código expirou. Solicite outro.','Conclua a verificação de segurança e tente novamente.'],
ko:['이메일 또는 사용자 이름','국가 코드를 포함하세요. SMS 요금이 발생할 수 있습니다.','SMS로 인증 코드를 보냈습니다.','코드 다시 보내기','코드가 만료되었습니다. 새 코드를 요청하세요.','보안 확인을 완료하고 다시 시도하세요.'],
id:['Email atau nama pengguna','Sertakan kode negara. Biaya SMS mungkin berlaku.','Kode verifikasi dikirim melalui SMS.','Kirim ulang kode','Kode ini kedaluwarsa. Minta kode baru.','Selesaikan pemeriksaan keamanan dan coba lagi.']
};
export const loginTranslations = Object.fromEntries(Object.entries(rows).map(([language,values])=>[language,Object.fromEntries(LOGIN_KEYS.map((key,index)=>[key,values[index]]))]));
const credentialErrors = {
    en:'Email/username or password is incorrect.', ur:'ای میل، صارف نام یا پاس ورڈ درست نہیں۔', ar:'البريد أو اسم المستخدم أو كلمة المرور غير صحيحة.',
    tr:'E-posta/kullanıcı adı veya şifre yanlış.', ja:'メール・ユーザー名またはパスワードが正しくありません。', zh:'邮箱、用户名或密码不正确。',
    pa:'ای میل، صارف ناں یا پاس ورڈ ٹھیک نہیں۔', ps:'برېښنالیک، کارن نوم یا پټنوم ناسم دی.', bal:'ای میل، کاربر ءِ نام یا پاس ورڈ درست نہ انت۔',
    fr:'E-mail, nom d’utilisateur ou mot de passe incorrect.', es:'Correo, usuario o contraseña incorrectos.', de:'E-Mail, Benutzername oder Passwort falsch.',
    sd:'اي ميل، صارف نالو يا پاسورڊ درست ناهي.', hnd:'ای میل، صارف ناں یا پاس ورڈ ٹھیک نہیں۔', skr:'ای میل، صارف ناں یا پاس ورڈ درست کائنی۔',
    hi:'ईमेल, उपयोगकर्ता नाम या पासवर्ड गलत है।', ur_roman:'Email, username ya password durust nahi.', bn:'ইমেইল, ব্যবহারকারীর নাম বা পাসওয়ার্ড ভুল।',
    ru:'Неверная почта, имя пользователя или пароль.', it:'E-mail, nome utente o password errati.', pt:'E-mail, nome de usuário ou senha incorretos.',
    ko:'이메일, 사용자 이름 또는 비밀번호가 올바르지 않습니다.', id:'Email, nama pengguna, atau kata sandi salah.'
};
for (const [language,message] of Object.entries(credentialErrors)) loginTranslations[language]['auth.invalidCredentials']=message;
const reloadLabels = { en:'Reload', ur:'دوبارہ لوڈ کریں', ar:'إعادة التحميل', tr:'Yeniden yükle', ja:'再読み込み', zh:'重新加载', pa:'دوبارہ لوڈ کرو', ps:'بیا پورته کړئ', bal:'دگہ لوڈ کنیت', fr:'Recharger', es:'Recargar', de:'Neu laden', sd:'ٻيهر لوڊ ڪريو', hnd:'دوبارہ لوڈ کرو', skr:'ول لوڈ کرو', hi:'फिर लोड करें', ur_roman:'Dobara load karein', bn:'আবার লোড করুন', ru:'Перезагрузить', it:'Ricarica', pt:'Recarregar', ko:'새로고침', id:'Muat ulang' };
for (const [language,label] of Object.entries(reloadLabels)) loginTranslations[language]['auth.reload']=label;
