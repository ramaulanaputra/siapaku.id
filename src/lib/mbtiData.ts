export interface MBTIType {
  code: string
  name: string
  nickname: string
  squad: string
  squadColor: string
  emoji: string
  tagline: string
  description: string
  strengths: string[]
  weaknesses: string[]
  selfLove: string
  emotionalBlindSpot: string
  shadowSide: string
  loveLanguage: string
  careerMatch: string[]
  famousPeople: string[]
}

export const squads = {
  analis: { name: 'Analis', emoji: '🧠', color: '#8B5CF6', gradient: 'from-purple-500 to-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', desc: 'Pemikir strategis dan inovatif' },
  diplomat: { name: 'Diplomat', emoji: '💚', color: '#10B981', gradient: 'from-emerald-500 to-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', desc: 'Idealis dan penuh empati' },
  sentinel: { name: 'Sentinel', emoji: '🛡️', color: '#3B82F6', gradient: 'from-blue-500 to-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', desc: 'Penjaga yang dapat diandalkan' },
  explorer: { name: 'Explorer', emoji: '🌟', color: '#F59E0B', gradient: 'from-amber-500 to-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', desc: 'Petualang penuh energi' },
}

export const mbtiTypes: Record<string, MBTIType> = {
  INTJ: {
    code: 'INTJ', name: 'Sang Arsitek', nickname: 'Si Strategis Visioner', squad: 'analis', squadColor: '#8B5CF6', emoji: '♟️',
    tagline: 'Otak brilian dengan rencana untuk segalanya',
    description: 'Kamu adalah pemikir strategis yang selalu punya master plan. Di balik sikap tenangmu, ada otak yang terus menganalisis dan merancang masa depan. Kamu nggak butuh validasi orang lain — kamu tahu apa yang kamu mau.',
    strengths: ['Strategis dan visioner', 'Independen dan mandiri', 'Determinasi tinggi', 'Pemikir kritis tajam', 'Efisien dan terstruktur'],
    weaknesses: ['Terlalu perfeksionis', 'Terkesan dingin atau arogan', 'Sulit express emosi', 'Impatient dengan yang lambat', 'Overthinking'],
    selfLove: 'Kamu sering lupa bahwa istirahat bukan kelemahan. Self-love buat INTJ: berhenti sejenak dari planning dan nikmati momen sekarang. Kamu nggak harus selalu produktif untuk berharga.',
    emotionalBlindSpot: 'Kamu cenderung intellectualize emosi — menganggap perasaan bisa dipecahkan seperti puzzle. Padahal kadang emosi cuma butuh dirasakan, bukan di-solve.',
    shadowSide: 'Perfeksionisme yang berlebihan dan tendensi menghakimi diri sendiri (dan orang lain) dengan standar yang terlalu tinggi.',
    loveLanguage: 'Quality Time yang bermakna + Intellectual Stimulation. Kamu merasa dicintai ketika seseorang menghargai pemikiranmu.',
    careerMatch: ['Ilmuwan/Peneliti', 'Software Architect', 'Konsultan Strategi', 'Dosen/Profesor', 'Entrepreneur'],
    famousPeople: ['Elon Musk', 'Christopher Nolan', 'Michelle Obama']
  },
  INTP: {
    code: 'INTP', name: 'Sang Logikawan', nickname: 'Si Penemu Ide', squad: 'analis', squadColor: '#8B5CF6', emoji: '🔬',
    tagline: 'Penasaran tanpa batas, logika tanpa kompromi',
    description: 'Kamu adalah mesin ide yang nggak pernah berhenti berpikir. Dunia di kepalamu jauh lebih kaya dari yang orang tahu. Kamu suka membongkar konsep, mencari pattern, dan memahami "kenapa" di balik segalanya.',
    strengths: ['Logika tajam dan analitis', 'Kreativitas tinggi', 'Open-minded', 'Problem solver natural', 'Belajar cepat'],
    weaknesses: ['Procrastinator', 'Terlalu di dalam kepala', 'Susah fokus satu hal', 'Kurang peka sosial', 'Lupa kebutuhan dasar'],
    selfLove: 'Kamu sering stuck di kepala dan lupa punya tubuh. Self-love buat INTP: keluar dari dunia ide sesekali. Jalan-jalan, makan teratur, tidur cukup. Otakmu butuh istirahat.',
    emotionalBlindSpot: 'Kamu sering disconnect dari emosi sendiri. Bukan nggak punya perasaan — tapi kamu nggak terbiasa navigate emosi. Belajar mengenali apa yang kamu rasakan itu valid.',
    shadowSide: 'Tendensi withdraw total dari dunia luar dan merasa superior secara intelektual, padahal ini kadang masking insecurity.',
    loveLanguage: 'Words of Affirmation yang cerdas + Diberi ruang untuk eksplorasi. Kamu merasa dicintai ketika diberi kebebasan berpikir.',
    careerMatch: ['Programmer/Developer', 'Data Scientist', 'Filsuf', 'Penulis', 'Game Designer'],
    famousPeople: ['Albert Einstein', 'Bill Gates', 'Tina Fey']
  },
  ENTJ: {
    code: 'ENTJ', name: 'Sang Komandan', nickname: 'Si Pemimpin Tegas', squad: 'analis', squadColor: '#8B5CF6', emoji: '👑',
    tagline: 'Born to lead, built to conquer',
    description: 'Kamu natural leader yang nggak takut ambil keputusan besar. Energi dan determinasimu menular ke orang-orang di sekitarmu. Kalau ada halangan, kamu bukan tipe yang ngeluh — kamu cari jalan.',
    strengths: ['Leadership alami', 'Confidence tinggi', 'Efisien dan tegas', 'Strategis dan ambisius', 'Karismatik'],
    weaknesses: ['Terlalu dominan', 'Kurang sabar', 'Bisa insensitif', 'Workaholic', 'Sulit terima kritik'],
    selfLove: 'Kamu sering measure self-worth dari achievement. Self-love buat ENTJ: kamu berharga bukan karena apa yang kamu capai, tapi karena siapa kamu. Rest is productive too.',
    emotionalBlindSpot: 'Kamu cenderung lihat emosi sebagai weakness. Padahal vulnerability itu bukan kelemahan — itu keberanian tertinggi.',
    shadowSide: 'Kebutuhan kontrol yang berlebihan dan ketakutan terlihat lemah. Kadang kamu push orang terlalu keras karena push diri sendiri juga terlalu keras.',
    loveLanguage: 'Acts of Service + Respect & Loyalty. Kamu merasa dicintai ketika orang menunjukkan komitmen lewat tindakan.',
    careerMatch: ['CEO/Eksekutif', 'Entrepreneur', 'Lawyer', 'Konsultan Manajemen', 'Politikus'],
    famousPeople: ['Steve Jobs', 'Gordon Ramsay', 'Kamala Harris']
  },
  ENTP: {
    code: 'ENTP', name: 'Sang Pendebat', nickname: 'Si Inovator Berani', squad: 'analis', squadColor: '#8B5CF6', emoji: '⚡',
    tagline: 'Challenge everything, fear nothing',
    description: 'Kamu adalah provocateur intelektual yang suka menantang status quo. Debat buat kamu adalah foreplay otak. Kamu melihat kemungkinan di mana orang lain melihat batasan.',
    strengths: ['Quick-witted dan cerdas', 'Charismatic debater', 'Visioner', 'Adaptif', 'Penuh energi kreatif'],
    weaknesses: ['Argumentatif', 'Cepat bosan', 'Procrastinator', 'Insensitif tanpa sadar', 'Follow-through lemah'],
    selfLove: 'Kamu sering lompat dari satu ide ke ide lain tanpa selesai. Self-love buat ENTP: belajar commit ke satu hal sampai selesai. Completion juga bentuk self-respect.',
    emotionalBlindSpot: 'Kamu tend to intellectualize emosi dan avoid deep emotional conversations. Debat bisa jadi mekanisme defense dari kerentanan.',
    shadowSide: 'Ketakutan akan stagnasi dan komitmen. Di balik persona yang confident, ada fear of being ordinary.',
    loveLanguage: 'Intellectual Banter + Quality Time yang stimulating. Kamu merasa dicintai ketika ada yang bisa match energi otakmu.',
    careerMatch: ['Entrepreneur', 'Creative Director', 'Lawyer', 'Stand-up Comedian', 'Product Manager'],
    famousPeople: ['Robert Downey Jr', 'Mark Twain', 'Tom Hanks']
  },
  INFJ: {
    code: 'INFJ', name: 'Sang Advokat', nickname: 'Si Bijak Misterius', squad: 'diplomat', squadColor: '#10B981', emoji: '🔮',
    tagline: 'Langka, mendalam, dan penuh makna',
    description: 'Kamu adalah tipe paling langka — dan bukan tanpa alasan. Empati dan intuisimu begitu kuat, kadang kamu merasa bisa "membaca" orang. Kamu hidup dengan misi, bukan sekadar goals.',
    strengths: ['Empati sangat dalam', 'Intuisi kuat', 'Idealis dan bermakna', 'Penulis/komunikator hebat', 'Visioner yang inspiring'],
    weaknesses: ['Terlalu perfeksionis', 'Burnout dari empati', 'Sulit bilang "tidak"', 'Overthinking', 'Terlalu idealis'],
    selfLove: 'Kamu sering menyerap emosi orang lain sampai lupa emosi sendiri. Self-love buat INFJ: set boundaries tanpa rasa bersalah. Kamu nggak bisa nuangin dari gelas yang kosong.',
    emotionalBlindSpot: 'Kamu terlalu fokus memahami emosi orang lain sampai neglect emosi sendiri. Siapa yang jaga INFJ? Kamu juga butuh dijaga.',
    shadowSide: 'Martyr complex — merasa harus menyelamatkan semua orang. Dan ketika merasa unappreciated, bisa door-slam secara tiba-tiba.',
    loveLanguage: 'Words of Affirmation yang tulus + Deep Emotional Connection. Kamu merasa dicintai ketika ada yang benar-benar mau mengenal inner world-mu.',
    careerMatch: ['Psikolog/Konselor', 'Penulis', 'Humanitarian', 'Guru/Dosen', 'UX Researcher'],
    famousPeople: ['Martin Luther King Jr', 'Lady Gaga', 'Plato']
  },
  INFP: {
    code: 'INFP', name: 'Sang Mediator', nickname: 'Si Pemimpi Idealis', squad: 'diplomat', squadColor: '#10B981', emoji: '🌸',
    tagline: 'Hati selembut awan, jiwa sekuat baja',
    description: 'Kamu adalah dreamer yang nggak sekadar bermimpi — kamu hidup dengan values yang kuat. Di balik sifat pendiam, ada universe emosi dan kreativitas yang dalam banget.',
    strengths: ['Kreativitas tanpa batas', 'Empati yang dalam', 'Authentic dan genuine', 'Pendengar yang baik', 'Passionate tentang values'],
    weaknesses: ['Terlalu sensitif', 'Idealis berlebihan', 'Self-critical', 'Procrastinator', 'Sulit dengan konflik'],
    selfLove: 'Kamu sering merasa "kurang" karena standar idealmu terlalu tinggi. Self-love buat INFP: kamu sudah cukup apa adanya. Nggak perlu jadi versi ideal — versi sekarang sudah berharga.',
    emotionalBlindSpot: 'Kamu merasakan segalanya sangat dalam tapi struggle untuk communicate emosi itu ke orang lain. Ini bikin kamu sering merasa misunderstood.',
    shadowSide: 'Self-pity dan tendency untuk retreat ke dunia fantasi ketika realita terasa terlalu harsh. Kadang passivity-mu adalah bentuk avoidance.',
    loveLanguage: 'Quality Time yang intim + Creative Expression of Love. Kamu merasa dicintai ketika seseorang menghargai keunikanmu.',
    careerMatch: ['Penulis/Penyair', 'Seniman', 'Psikolog', 'Social Worker', 'Musisi'],
    famousPeople: ['William Shakespeare', 'J.R.R. Tolkien', 'Princess Diana']
  },
  ENFJ: {
    code: 'ENFJ', name: 'Sang Protagonis', nickname: 'Si Pemberi Semangat', squad: 'diplomat', squadColor: '#10B981', emoji: '🌟',
    tagline: 'Menerangi jalan orang lain, kadang lupa menerangi jalannya sendiri',
    description: 'Kamu adalah natural motivator yang genuine care tentang orang lain. Kehadiranmu bikin ruangan terasa lebih hangat. Kamu lihat potensi terbaik di setiap orang.',
    strengths: ['Karismatik dan inspiring', 'Empati tinggi', 'Natural leader', 'Komunikator hebat', 'Motivator alami'],
    weaknesses: ['People-pleaser', 'Terlalu self-sacrificing', 'Overly idealistic', 'Sensitive terhadap kritik', 'Burnout dari caring too much'],
    selfLove: 'Kamu selalu mendahulukan orang lain. Self-love buat ENFJ: berhenti sejenak dan tanya "aku butuh apa?" Menyayangi diri sendiri bukan egois — itu necessary.',
    emotionalBlindSpot: 'Kamu terlalu fokus membahagiakan orang lain sampai kehilangan koneksi dengan kebutuhan emosimu sendiri.',
    shadowSide: 'Manipulatif tanpa sadar — karena kamu terlalu baik "membaca" orang, kadang kamu tanpa sadar mengarahkan mereka. Control disguised as care.',
    loveLanguage: 'Words of Affirmation + Acts of Service. Kamu merasa dicintai ketika usahamu diakui dan diapresiasi.',
    careerMatch: ['Life Coach', 'Teacher/Dosen', 'HR Manager', 'Motivational Speaker', 'Non-profit Leader'],
    famousPeople: ['Barack Obama', 'Oprah Winfrey', 'Malala Yousafzai']
  },
  ENFP: {
    code: 'ENFP', name: 'Sang Juru Kampanye', nickname: 'Si Kupu-Kupu Sosial', squad: 'diplomat', squadColor: '#10B981', emoji: '🦋',
    tagline: 'Penuh warna, penuh makna, penuh kejutan',
    description: 'Kamu adalah sunshine dalam bentuk manusia. Antusiasme dan kreativitasmu menular. Kamu melihat koneksi dan kemungkinan di mana-mana, dan hidupmu adalah rangkaian petualangan bermakna.',
    strengths: ['Antusias dan energik', 'Sangat kreatif', 'Empati tinggi', 'Adaptif dan spontan', 'Connector alami'],
    weaknesses: ['Sulit fokus', 'Overthinking', 'Terlalu idealis', 'People-pleasing', 'Disorganized'],
    selfLove: 'Kamu sering chase excitement dan lupa check in sama diri sendiri. Self-love buat ENFP: slow down. Nggak semua momen harus magical — ordinary juga oke.',
    emotionalBlindSpot: 'Di balik persona yang selalu happy dan energik, kadang kamu suppress sadness karena takut membebani orang lain.',
    shadowSide: 'Commitment issues dan tendency untuk ghost ketika things get too real. Freedom bisa jadi excuse untuk avoid depth.',
    loveLanguage: 'Words of Affirmation + Physical Touch + Quality Time (semuanya!). Kamu merasa dicintai ketika diberi perhatian penuh.',
    careerMatch: ['Creative Writer', 'Marketing/Brand Strategist', 'Entrepreneur Kreatif', 'Aktor/Performer', 'Travel Blogger'],
    famousPeople: ['Robin Williams', 'Robert Downey Jr', 'Ellen DeGeneres']
  },
  ISTJ: {
    code: 'ISTJ', name: 'Sang Logistik', nickname: 'Si Bisa Diandalkan', squad: 'sentinel', squadColor: '#3B82F6', emoji: '📋',
    tagline: 'Kalau bukan aku, siapa? Kalau bukan sekarang, kapan?',
    description: 'Kamu adalah backbone dari setiap organisasi. Reliable, responsible, dan detail-oriented. Ketika orang lain panic, kamu yang tetap tenang dan kerjakan yang harus dikerjakan.',
    strengths: ['Sangat reliable', 'Detail-oriented', 'Terorganisir', 'Loyal dan dedicated', 'Praktis dan realistis'],
    weaknesses: ['Terlalu kaku', 'Sulit terima perubahan', 'Workaholic', 'Judgemental', 'Sulit express feelings'],
    selfLove: 'Kamu sering merasa harus "berguna" terus-menerus. Self-love buat ISTJ: value-mu bukan dari seberapa produktif kamu. Bersantai bukan berarti malas.',
    emotionalBlindSpot: 'Kamu cenderung suppress emosi karena dianggap "nggak produktif". Tapi emosi yang ditekan bisa meledak tanpa terduga.',
    shadowSide: 'Rigidity dan resistance terhadap perubahan. Ketika merasa out of control, kamu bisa jadi overly critical dan controlling.',
    loveLanguage: 'Acts of Service + Quality Time yang tenang. Kamu merasa dicintai ketika seseorang ada di saat kamu butuhkan, tanpa drama.',
    careerMatch: ['Akuntan', 'Project Manager', 'Auditor', 'Engineer', 'Administrator'],
    famousPeople: ['Angela Merkel', 'Denzel Washington', 'Queen Elizabeth II']
  },
  ISFJ: {
    code: 'ISFJ', name: 'Sang Pelindung', nickname: 'Si Penjaga Setia', squad: 'sentinel', squadColor: '#3B82F6', emoji: '🛡️',
    tagline: 'Diam-diam menjaga, tanpa minta diperhatikan',
    description: 'Kamu adalah unsung hero yang nggak pernah minta recognition. Perhatianmu ke detail dan kebutuhan orang lain itu luar biasa. Kamu ingat hal-hal kecil yang bahkan orang itu sendiri lupa.',
    strengths: ['Perhatian dan caring', 'Reliable luar biasa', 'Sabar dan penuh dedikasi', 'Detail-oriented', 'Loyal tanpa syarat'],
    weaknesses: ['Sulit bilang "tidak"', 'Terlalu self-sacrificing', 'Menghindari konflik', 'Perfectionist', 'Menanggung beban sendiri'],
    selfLove: 'Kamu selalu mendahulukan orang lain. Self-love buat ISFJ: bilang "tidak" itu bukan jahat. Prioritaskan diri sendiri kadang-kadang — kamu pantas.',
    emotionalBlindSpot: 'Kamu menyimpan banyak beban emosional orang lain tanpa pernah sharing bebanmu sendiri. Siapa yang jagain si penjaga?',
    shadowSide: 'Passive-aggressiveness ketika merasa unappreciated. Resentment yang menumpuk karena terlalu banyak give tanpa receive.',
    loveLanguage: 'Acts of Service (giving AND receiving!) + Words of Appreciation. Kamu merasa dicintai ketika usahamu dihargai.',
    careerMatch: ['Perawat/Dokter', 'Teacher', 'Social Worker', 'HR Specialist', 'Librarian'],
    famousPeople: ['Mother Teresa', 'Beyoncé', 'Kate Middleton']
  },
  ESTJ: {
    code: 'ESTJ', name: 'Sang Eksekutif', nickname: 'Si Bos Tegas', squad: 'sentinel', squadColor: '#3B82F6', emoji: '📊',
    tagline: 'Aturan ada bukan untuk dilanggar, tapi untuk ditegakkan',
    description: 'Kamu adalah organizer supreme. Ketika ada kekacauan, kamu yang bikin sistem dan structure. Kamu percaya pada kerja keras, kejujuran, dan tanggung jawab.',
    strengths: ['Organized dan terstruktur', 'Tegas dan decisive', 'Dedicated dan hardworking', 'Leader yang kuat', 'Honest dan direct'],
    weaknesses: ['Terlalu kaku', 'Bossy', 'Kurang fleksibel', 'Insensitif kadang', 'Sulit terima pendapat berbeda'],
    selfLove: 'Kamu sering measure everything by productivity. Self-love buat ESTJ: learn to be, not just do. Kadang doing nothing is the most productive thing you can do.',
    emotionalBlindSpot: 'Kamu menganggap emosi sebagai distraction dari goals. Padahal emosi adalah data penting yang kamu abaikan.',
    shadowSide: 'Need for control yang berlebihan dan tendency untuk memaksakan cara-mu ke orang lain karena yakin itu "yang benar".',
    loveLanguage: 'Acts of Service + Quality Time yang terstruktur. Kamu merasa dicintai ketika orang menunjukkan reliability.',
    careerMatch: ['Manager/Direktur', 'Hakim/Jaksa', 'Financial Advisor', 'Military Officer', 'Business Owner'],
    famousPeople: ['Sonia Sotomayor', 'Frank Sinatra', 'Judge Judy']
  },
  ESFJ: {
    code: 'ESFJ', name: 'Sang Konsul', nickname: 'Si Tuan Rumah Hangat', squad: 'sentinel', squadColor: '#3B82F6', emoji: '🤗',
    tagline: 'Hangat seperti pelukan di hari dingin',
    description: 'Kamu adalah social glue yang bikin setiap kelompok terasa seperti keluarga. Empati dan perhatianmu genuine. Kamu ingat ulang tahun semua orang dan selalu tahu siapa yang butuh dihibur.',
    strengths: ['Sangat caring dan warm', 'Social connector alami', 'Loyal dan supportive', 'Organized', 'Harmonizer handal'],
    weaknesses: ['Terlalu butuh approval', 'People-pleaser', 'Sensitive banget', 'Gossip tendency', 'Sulit handle kritik'],
    selfLove: 'Kamu sering cari validasi dari luar. Self-love buat ESFJ: approval terpenting adalah dari diri sendiri. Kamu nggak perlu semua orang suka kamu.',
    emotionalBlindSpot: 'Kamu terlalu fokus pada harmoni sosial sampai suppress perasaan sendiri yang "mengancam" keharmonisan itu.',
    shadowSide: 'Gossiping dan manipulasi sosial untuk maintain control over social dynamics. Juga tendency untuk guilt-trip orang.',
    loveLanguage: 'Quality Time + Words of Affirmation + Acts of Service. Kamu merasa dicintai ketika jadi prioritas seseorang.',
    careerMatch: ['Event Planner', 'PR Specialist', 'Teacher', 'Nurse', 'Customer Service Manager'],
    famousPeople: ['Taylor Swift', 'Jennifer Garner', 'Ed Sheeran']
  },
  ISTP: {
    code: 'ISTP', name: 'Sang Virtuoso', nickname: 'Si Tukang Utak-Atik', squad: 'explorer', squadColor: '#F59E0B', emoji: '🔧',
    tagline: 'Cool, calm, dan bisa benerin apa aja',
    description: 'Kamu adalah problem solver praktis yang cool under pressure. Tangan dan otakmu bekerja sama dengan sempurna. Kamu lebih suka action daripada ngomong, dan hasilnya selalu impressive.',
    strengths: ['Cool under pressure', 'Hands-on problem solver', 'Adaptif dan fleksibel', 'Logis dan efisien', 'Independen'],
    weaknesses: ['Emotionally detached', 'Risk-taker berlebihan', 'Commitment-phobic', 'Blunt/too direct', 'Bosen cepat'],
    selfLove: 'Kamu sering avoid emosi dengan sibuk "benerin" sesuatu. Self-love buat ISTP: kadang yang perlu dibenerin bukan barang, tapi perasaan. Sit with your emotions.',
    emotionalBlindSpot: 'Kamu cenderung treat emosi seperti masalah teknis — cari solusi dan move on. Tapi emosi butuh dirasakan, bukan di-fix.',
    shadowSide: 'Detachment yang berlebihan dan tendency self-destructive (adrenaline junkie). Running from emotions through constant stimulation.',
    loveLanguage: 'Physical Touch + Acts of Service + Space. Kamu merasa dicintai ketika diberi kebebasan tapi tetap ada yang care.',
    careerMatch: ['Mekanik/Engineer', 'Pilot', 'Programmer', 'Forensic Scientist', 'Atlet'],
    famousPeople: ['Clint Eastwood', 'Tom Cruise', 'Bruce Lee']
  },
  ISFP: {
    code: 'ISFP', name: 'Sang Petualang', nickname: 'Si Seniman Lembut', squad: 'explorer', squadColor: '#F59E0B', emoji: '🎨',
    tagline: 'Dunia ini kanvas, dan hidupku adalah seni',
    description: 'Kamu adalah seniman di hati yang merasakan dunia lebih intens dari kebanyakan orang. Keindahan ada di mana-mana bagimu — dan kamu punya cara unik untuk mengekspresikannya.',
    strengths: ['Artistic dan kreatif', 'Warm dan gentle', 'Spontan dan adventurous', 'Empati yang dalam', 'Authentic'],
    weaknesses: ['Terlalu sensitif', 'Menghindari konflik', 'Unpredictable', 'Sulit planning', 'Self-esteem rendah'],
    selfLove: 'Kamu sering meragukan diri sendiri. Self-love buat ISFP: suaramu valid, perasaanmu valid, senimu valid. Stop comparing dengan orang lain — keunikanmu adalah gift.',
    emotionalBlindSpot: 'Kamu merasakan segalanya sangat dalam tapi struggle untuk articulate emosi itu. Ini bikin kamu sering merasa misunderstood dan lonely.',
    shadowSide: 'Self-doubt yang mendalam dan tendency untuk withdraw total ketika overwhelmed. Passive avoidance dari masalah.',
    loveLanguage: 'Quality Time + Physical Touch + Gifts yang bermakna. Kamu merasa dicintai ketika seseorang memperhatikan detail kecil tentangmu.',
    careerMatch: ['Seniman/Desainer', 'Fotografer', 'Chef', 'Veterinarian', 'Fashion Designer'],
    famousPeople: ['Bob Ross', 'Frida Kahlo', 'Lana Del Rey']
  },
  ESTP: {
    code: 'ESTP', name: 'Sang Pengusaha', nickname: 'Si Aksi Nyata', squad: 'explorer', squadColor: '#F59E0B', emoji: '🏄',
    tagline: 'Hidup cuma sekali, kenapa harus boring?',
    description: 'Kamu adalah life of the party yang nggak cuma seru, tapi juga street-smart. Action-oriented dan quick-thinking, kamu bisa read any room dan adapt instantly.',
    strengths: ['Energik dan bold', 'Street smart', 'Quick thinker', 'Charismatic', 'Adaptif luar biasa'],
    weaknesses: ['Impulsif', 'Risk-taker', 'Insensitif', 'Commitment issues', 'Bosan dengan rutinitas'],
    selfLove: 'Kamu sering lari dari quiet moments karena takut sama apa yang muncul di keheningan. Self-love buat ESTP: slow down. Inner peace bukan kelemahan.',
    emotionalBlindSpot: 'Kamu menggunakan action dan excitement untuk avoid deep emotional processing. Ketika akhirnya harus face emosi, bisa overwhelming.',
    shadowSide: 'Recklessness dan tendency menggunakan orang untuk entertainment. Superficiality yang masking deeper insecurities.',
    loveLanguage: 'Physical Touch + Quality Time yang adventure. Kamu merasa dicintai ketika ada yang mau ikut crazy ride-mu.',
    careerMatch: ['Entrepreneur', 'Sales Executive', 'Atlet Profesional', 'Paramedic', 'Marketing Director'],
    famousPeople: ['Dwayne Johnson', 'Madonna', 'Ernest Hemingway']
  },
  ESFP: {
    code: 'ESFP', name: 'Sang Penghibur', nickname: 'Si Bintang Panggung', squad: 'explorer', squadColor: '#F59E0B', emoji: '🎭',
    tagline: 'Life is a party, and I brought the confetti',
    description: 'Kamu adalah sunshine yang nggak perlu diminta untuk bersinar. Spontan, warm, dan penuh joy — kehadiranmu bikin setiap ruangan jadi lebih hidup dan fun.',
    strengths: ['Energi menular', 'Spontan dan fun', 'Empati practical', 'Performer alami', 'Generous dan warm'],
    weaknesses: ['Sulit fokus jangka panjang', 'Impulsif', 'Menghindari masalah serius', 'Attention-seeking', 'Over-spending'],
    selfLove: 'Kamu sering jadi entertainer untuk orang lain tapi siapa yang entertain kamu? Self-love buat ESFP: kamu boleh sedih, boleh diam, boleh nggak seru. You are more than your performance.',
    emotionalBlindSpot: 'Kamu menyembunyikan kesedihan di balik humor dan keceriaan. Orang jarang tahu kalau kamu struggling karena kamu selalu terlihat fine.',
    shadowSide: 'Running from depth dan using entertainment as escapism. Ketakutan akan being alone with thoughts.',
    loveLanguage: 'Physical Touch + Words of Affirmation + Experiences together. Kamu merasa dicintai ketika jadi center of someone\'s world.',
    careerMatch: ['Entertainer/Aktor', 'Event Organizer', 'Tour Guide', 'Personal Trainer', 'Sales'],
    famousPeople: ['Marilyn Monroe', 'Jamie Oliver', 'Adele']
  }
}

export function getMBTIType(code: string): MBTIType | undefined {
  return mbtiTypes[code.toUpperCase()]
}

export function getSquadByType(code: string) {
  const type = mbtiTypes[code.toUpperCase()]
  if (!type) return null
  return squads[type.squad as keyof typeof squads]
}
