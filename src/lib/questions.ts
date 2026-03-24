export interface Question {
  id: number
  text: string
  optionA: { text: string; scores: Record<string, number> }
  optionB: { text: string; scores: Record<string, number> }
  category: 'EI' | 'SN' | 'TF' | 'JP'
}

export const allQuestions: Question[] = [
  // ===== E vs I (25) =====
  { id:1, text:"Sabtu malam, lu lebih milih...", category:'EI', optionA:{text:"🎉 Nongkrong rame-rame di cafe baru",scores:{E:2}}, optionB:{text:"🎧 Rebahan marathon series sendirian",scores:{I:2}} },
  { id:2, text:"Di kelas/kantor, lu biasanya...", category:'EI', optionA:{text:"Yang pertama nyapa dan ajak ngobrol",scores:{E:2}}, optionB:{text:"Tunggu disapa dulu baru nyambung",scores:{I:2}} },
  { id:3, text:"Pas lagi stress, lu butuh...", category:'EI', optionA:{text:"Curhat sama temen biar lega",scores:{E:2}}, optionB:{text:"Waktu sendiri buat mikir jernih",scores:{I:2}} },
  { id:4, text:"Di group chat yang rame, lu...", category:'EI', optionA:{text:"Aktif banget, sering ngirim chat duluan",scores:{E:2}}, optionB:{text:"Lebih sering jadi silent reader",scores:{I:2}} },
  { id:5, text:"Lu di pesta isinya orang baru semua...", category:'EI', optionA:{text:"Seru! Kesempatan kenalan banyak orang",scores:{E:2}}, optionB:{text:"Agak overwhelmed, cari 1-2 orang aja",scores:{I:2}} },
  { id:6, text:"Energi lu paling ke-charge kalau...", category:'EI', optionA:{text:"⚡ Habis ngumpul sama banyak orang",scores:{E:2}}, optionB:{text:"🔋 Habis quality time sendirian",scores:{I:2}} },
  { id:7, text:"Lu lebih produktif kerja di...", category:'EI', optionA:{text:"Coworking space yang rame",scores:{E:2}}, optionB:{text:"Kamar sendiri, pintu ditutup",scores:{I:2}} },
  { id:8, text:"Telpon dari nomor nggak dikenal...", category:'EI', optionA:{text:"Langsung angkat, siapa tau penting",scores:{E:2}}, optionB:{text:"Biarin, kalau penting pasti WA",scores:{I:2}} },
  { id:9, text:"Waktu presentasi depan banyak orang...", category:'EI', optionA:{text:"Malah makin semangat dan energik",scores:{E:2}}, optionB:{text:"Bisa sih, tapi abis itu butuh recharge",scores:{I:2}} },
  { id:10, text:"Liburan ideal lu itu...", category:'EI', optionA:{text:"🏖️ Rame bareng geng besar",scores:{E:2}}, optionB:{text:"🏔️ Solo trip atau sama 1-2 orang terdekat",scores:{I:2}} },
  { id:11, text:"Kalau ada masalah, lu...", category:'EI', optionA:{text:"Langsung cerita ke orang terdekat",scores:{E:2}}, optionB:{text:"Proses sendiri dulu baru cerita",scores:{I:2}} },
  { id:12, text:"Di lingkungan baru, lu...", category:'EI', optionA:{text:"Cepet adaptasi, punya banyak kenalan",scores:{E:2}}, optionB:{text:"Butuh waktu, tapi circle kecil yang deep",scores:{I:2}} },
  { id:13, text:"Ide terbaik lu muncul waktu...", category:'EI', optionA:{text:"Brainstorming bareng orang",scores:{E:2}}, optionB:{text:"Lagi sendiri, hening, dan fokus",scores:{I:2}} },
  { id:14, text:"Weekend ideal lu...", category:'EI', optionA:{text:"Penuh jadwal hangout dan kegiatan",scores:{E:2}}, optionB:{text:"Kosong, bebas, tanpa agenda",scores:{I:2}} },
  { id:15, text:"Lu lebih dikenal sebagai...", category:'EI', optionA:{text:"Si rame, connector, banyak kenalan",scores:{E:2}}, optionB:{text:"Si pendiam tapi kalau udah dekat, deep",scores:{I:2}} },
  { id:16, text:"Makan siang di kantor/kampus, lu...", category:'EI', optionA:{text:"Gabung meja rame-rame",scores:{E:2}}, optionB:{text:"Cari spot tenang atau makan sendiri",scores:{I:2}} },
  { id:17, text:"Setelah seharian meeting/kelas...", category:'EI', optionA:{text:"Masih bisa lanjut hangout malam",scores:{E:2}}, optionB:{text:"Butuh minimal 2 jam sendiri dulu",scores:{I:2}} },
  { id:18, text:"Lu di mall sendirian, lu...", category:'EI', optionA:{text:"Agak kurang nyaman, pengen ada temen",scores:{E:2}}, optionB:{text:"Biasa aja, malah lebih bebas",scores:{I:2}} },
  { id:19, text:"Kerja kelompok, lu cenderung...", category:'EI', optionA:{text:"Lead diskusi dan bagi tugas",scores:{E:2}}, optionB:{text:"Kontribusi lewat tulisan/kerja sendiri",scores:{I:2}} },
  { id:20, text:"Nonton konser, lu lebih suka...", category:'EI', optionA:{text:"🎤 Di depan, joget dan teriak",scores:{E:2}}, optionB:{text:"🎶 Di belakang, nikmatin musik tenang",scores:{I:2}} },
  { id:21, text:"Pindah ke kota baru, hal pertama...", category:'EI', optionA:{text:"Join komunitas/event buat kenalan",scores:{E:2}}, optionB:{text:"Explore sendiri, settle in pelan-pelan",scores:{I:2}} },
  { id:22, text:"Quality time buat lu adalah...", category:'EI', optionA:{text:"Ngumpul bareng orang tersayang",scores:{E:2}}, optionB:{text:"Momen tenang untuk diri sendiri",scores:{I:2}} },
  { id:23, text:"Lu lebih nyaman komunikasi lewat...", category:'EI', optionA:{text:"📞 Telpon/video call langsung",scores:{E:2}}, optionB:{text:"💬 Chat, bisa mikir dulu",scores:{I:2}} },
  { id:24, text:"Waktu kecil, lu anak yang...", category:'EI', optionA:{text:"Rame, main bareng banyak temen",scores:{E:2}}, optionB:{text:"Anteng, main sendiri atau 1-2 temen",scores:{I:2}} },
  { id:25, text:"Superpower pilihan lu...", category:'EI', optionA:{text:"🦸 Connect sama siapapun instantly",scores:{E:2}}, optionB:{text:"🧙 Invisible kapanpun mau",scores:{I:2}} },

  // ===== S vs N (25) =====
  { id:26, text:"Baca berita, lu tertarik sama...", category:'SN', optionA:{text:"📊 Fakta dan data konkret",scores:{S:2}}, optionB:{text:"💡 Teori dan kemungkinan masa depan",scores:{N:2}} },
  { id:27, text:"Belajar hal baru, lu suka...", category:'SN', optionA:{text:"Step-by-step, basic ke advanced",scores:{S:2}}, optionB:{text:"Big picture dulu, detail belakangan",scores:{N:2}} },
  { id:28, text:"Jalan di taman, yang pertama lu notice...", category:'SN', optionA:{text:"🌺 Detail bunga, warna, suara burung",scores:{S:2}}, optionB:{text:"🌈 Vibes keseluruhan, feel-nya",scores:{N:2}} },
  { id:29, text:"Kalau masak, lu tipe yang...", category:'SN', optionA:{text:"Ikutin resep persis step by step",scores:{S:2}}, optionB:{text:"Improvisasi, resep cuma referensi",scores:{N:2}} },
  { id:30, text:"Orang sering bilang lu...", category:'SN', optionA:{text:"Realistis dan practical",scores:{S:2}}, optionB:{text:"Imajinatif dan penuh ide",scores:{N:2}} },
  { id:31, text:"Dikasih puzzle 1000 keping...", category:'SN', optionA:{text:"Mulai dari pinggiran, susun rapi",scores:{S:2}}, optionB:{text:"Cari pattern warna, kelompokin dulu",scores:{N:2}} },
  { id:32, text:"Film yang lu enjoy...", category:'SN', optionA:{text:"🎬 Based on true story",scores:{S:2}}, optionB:{text:"🚀 Sci-fi, fantasi, mind-bending",scores:{N:2}} },
  { id:33, text:"Dalam percakapan, lu sering...", category:'SN', optionA:{text:"Bahas yang udah terjadi, nyata",scores:{S:2}}, optionB:{text:"Bahas 'what if', teori, kemungkinan",scores:{N:2}} },
  { id:34, text:"Lu lebih percaya sama...", category:'SN', optionA:{text:"Pengalaman langsung dan bukti nyata",scores:{S:2}}, optionB:{text:"Intuisi dan firasat sendiri",scores:{N:2}} },
  { id:35, text:"Planning liburan, lu fokus...", category:'SN', optionA:{text:"📋 Itinerary: jam, tempat, budget",scores:{S:2}}, optionB:{text:"✨ Vibe: adventure, chill, explore",scores:{N:2}} },
  { id:36, text:"Di meeting, kontribusi lu...", category:'SN', optionA:{text:"Data, fakta, solusi praktis",scores:{S:2}}, optionB:{text:"Ide baru, perspektif berbeda, visi",scores:{N:2}} },
  { id:37, text:"Lu suka guru/mentor yang...", category:'SN', optionA:{text:"Ngajarin teknik konkret langsung dipake",scores:{S:2}}, optionB:{text:"Nginspirasi dengan cara pandang baru",scores:{N:2}} },
  { id:38, text:"Hidup ideal buat lu...", category:'SN', optionA:{text:"Stabil, terencana, bisa diprediksi",scores:{S:2}}, optionB:{text:"Penuh surprise dan kemungkinan",scores:{N:2}} },
  { id:39, text:"Beli gadget baru, lu...", category:'SN', optionA:{text:"Baca spek lengkap dan review detail",scores:{S:2}}, optionB:{text:"Liat vibes, design, feel-nya aja",scores:{N:2}} },
  { id:40, text:"Pas cerita ke orang, lu...", category:'SN', optionA:{text:"Kronologis dan detail, A sampai Z",scores:{S:2}}, optionB:{text:"Loncat-loncat, nambah teori sendiri",scores:{N:2}} },
  { id:41, text:"Lu suka pekerjaan yang...", category:'SN', optionA:{text:"Jelas SOP-nya, prosedur terstruktur",scores:{S:2}}, optionB:{text:"Bebas eksplorasi, coba cara baru",scores:{N:2}} },
  { id:42, text:"Pintar menurut lu itu...", category:'SN', optionA:{text:"Kuasai skill dan eksekusi dengan baik",scores:{S:2}}, optionB:{text:"Bisa lihat koneksi yang orang miss",scores:{N:2}} },
  { id:43, text:"Dikasih kertas kosong, lu...", category:'SN', optionA:{text:"✏️ Tulis to-do list atau catatan",scores:{S:2}}, optionB:{text:"🎨 Gambar, doodle, random thoughts",scores:{N:2}} },
  { id:44, text:"Soal masa depan, lu...", category:'SN', optionA:{text:"Plan berdasarkan kondisi sekarang",scores:{S:2}}, optionB:{text:"Bayangin berbagai skenario",scores:{N:2}} },
  { id:45, text:"Paling kesel kalau orang...", category:'SN', optionA:{text:"Banyak teori tapi nggak action",scores:{S:2}}, optionB:{text:"Terlalu kaku, nggak mau coba baru",scores:{N:2}} },
  { id:46, text:"Buku favorit lu...", category:'SN', optionA:{text:"📖 How-to, biografi, non-fiksi",scores:{S:2}}, optionB:{text:"📚 Fiksi, filosofi, mind-expanding",scores:{N:2}} },
  { id:47, text:"Lagi jalan dan nyasar, lu...", category:'SN', optionA:{text:"Langsung buka Google Maps",scores:{S:2}}, optionB:{text:"Explore aja, siapa tau nemu seru",scores:{N:2}} },
  { id:48, text:"Lu appreciate orang yang...", category:'SN', optionA:{text:"Reliable, konsisten, bisa diandalkan",scores:{S:2}}, optionB:{text:"Kreatif, visioner, penuh inspirasi",scores:{N:2}} },
  { id:49, text:"Memory terkuat lu soal...", category:'SN', optionA:{text:"Detail: tempat, tanggal, yang dipake",scores:{S:2}}, optionB:{text:"Feeling dan emosi saat itu",scores:{N:2}} },
  { id:50, text:"Kalau bisa punya satu kemampuan...", category:'SN', optionA:{text:"🔧 Master di satu bidang spesifik",scores:{S:2}}, optionB:{text:"🌍 Connect berbagai bidang jadi satu",scores:{N:2}} },

  // ===== T vs F (25) =====
  { id:51, text:"Temen curhat soal masalah, lu...", category:'TF', optionA:{text:"Kasih solusi dan saran praktikal",scores:{T:2}}, optionB:{text:"Dengerin dulu, validasi perasaan",scores:{F:2}} },
  { id:52, text:"Keputusan penting, lu pake...", category:'TF', optionA:{text:"🧠 Logika dan analisa pro-kontra",scores:{T:2}}, optionB:{text:"❤️ Perasaan dan nilai personal",scores:{F:2}} },
  { id:53, text:"Konflik di grup, lu...", category:'TF', optionA:{text:"Cari siapa yang benar dari fakta",scores:{T:2}}, optionB:{text:"Cari cara semua pihak baik-baik",scores:{F:2}} },
  { id:54, text:"Kritik dari orang lain, buat lu...", category:'TF', optionA:{text:"Feedback berguna untuk improve",scores:{T:2}}, optionB:{text:"Agak nyakitin, tergantung caranya",scores:{F:2}} },
  { id:55, text:"Lu bangga sama diri sendiri kalau...", category:'TF', optionA:{text:"Berhasil solve masalah rumit",scores:{T:2}}, optionB:{text:"Berhasil bikin orang lain bahagia",scores:{F:2}} },
  { id:56, text:"Dalam debat, lu...", category:'TF', optionA:{text:"Fokus argumen paling logis",scores:{T:2}}, optionB:{text:"Pertimbangin dampaknya ke orang",scores:{F:2}} },
  { id:57, text:"Ngeliat orang nangis di publik...", category:'TF', optionA:{text:"Mikir 'ada masalah apa ya' objektif",scores:{T:2}}, optionB:{text:"Langsung empati, pengen bantuin",scores:{F:2}} },
  { id:58, text:"Diminta pendapat soal kerjaan orang...", category:'TF', optionA:{text:"Jujur apa adanya, kritik konstruktif",scores:{T:2}}, optionB:{text:"Hati-hati biar nggak nyakitin",scores:{F:2}} },
  { id:59, text:"Lu respect pemimpin yang...", category:'TF', optionA:{text:"Tegas, objektif, decision-maker",scores:{T:2}}, optionB:{text:"Empati, inspiring, peduli tim",scores:{F:2}} },
  { id:60, text:"Kalau harus pecat seseorang...", category:'TF', optionA:{text:"Berat tapi kalau harus, ya harus",scores:{T:2}}, optionB:{text:"Sangat berat, mikirin perasaan terus",scores:{F:2}} },
  { id:61, text:"Sukses menurut lu...", category:'TF', optionA:{text:"Achieve goals dan accomplish things",scores:{T:2}}, optionB:{text:"Hidup bermakna dan penuh connection",scores:{F:2}} },
  { id:62, text:"Temen minta saran hubungan toxic...", category:'TF', optionA:{text:"\"Tinggalin, objectively nggak sehat\"",scores:{T:2}}, optionB:{text:"\"Gimana perasaan lu? Lu yang tau\"",scores:{F:2}} },
  { id:63, text:"Lu suka dipuji karena...", category:'TF', optionA:{text:"\"Lu pinter, logikanya tajam\"",scores:{T:2}}, optionB:{text:"\"Lu baik, bikin semua nyaman\"",scores:{F:2}} },
  { id:64, text:"Dalam tim, peran natural lu...", category:'TF', optionA:{text:"Strategist - rencana dan analisis",scores:{T:2}}, optionB:{text:"Harmonizer - jaga vibes dan semangat",scores:{F:2}} },
  { id:65, text:"Keputusan paling sulit buat lu...", category:'TF', optionA:{text:"Yang nggak ada data cukup",scores:{T:2}}, optionB:{text:"Yang harus pilih antara dua orang",scores:{F:2}} },
  { id:66, text:"Aturan yang nggak fair, lu...", category:'TF', optionA:{text:"Analisis dan propose perubahan",scores:{T:2}}, optionB:{text:"Rasain ketidakadilan, fight for lemah",scores:{F:2}} },
  { id:67, text:"Paling frustrated kalau orang...", category:'TF', optionA:{text:"Nggak logis dan irasional",scores:{T:2}}, optionB:{text:"Nggak pedulian dan insensitif",scores:{F:2}} },
  { id:68, text:"Lu lebih takut...", category:'TF', optionA:{text:"Dianggap bodoh atau incompetent",scores:{T:2}}, optionB:{text:"Dianggap jahat atau nggak berperasaan",scores:{F:2}} },
  { id:69, text:"Belanja, keputusan lu berdasarkan...", category:'TF', optionA:{text:"Value for money, spek, review",scores:{T:2}}, optionB:{text:"Feeling-nya, bikin happy nggak",scores:{F:2}} },
  { id:70, text:"Film yang bikin nangis...", category:'TF', optionA:{text:"Jarang sih nangis nonton film",scores:{T:2}}, optionB:{text:"Banyak! Yang touching pasti mewek",scores:{F:2}} },
  { id:71, text:"Kasih feedback negatif, lu...", category:'TF', optionA:{text:"Langsung to the point, efisien",scores:{T:2}}, optionB:{text:"Positif dulu baru negatif",scores:{F:2}} },
  { id:72, text:"Motivasi kerja utama lu...", category:'TF', optionA:{text:"Achievement, challenge, growth",scores:{T:2}}, optionB:{text:"Purpose, impact, meaningful connections",scores:{F:2}} },
  { id:73, text:"Lu lebih setuju...", category:'TF', optionA:{text:"\"Kebenaran lebih penting dari perasaan\"",scores:{T:2}}, optionB:{text:"\"Kebaikan lebih penting dari kebenaran\"",scores:{F:2}} },
  { id:74, text:"Bikin keputusan besar, lu...", category:'TF', optionA:{text:"Spreadsheet pro-kontra",scores:{T:2}}, optionB:{text:"Ikutin gut feeling setelah refleksi",scores:{F:2}} },
  { id:75, text:"Superpower pilihan...", category:'TF', optionA:{text:"🧠 Super intelligence",scores:{T:2}}, optionB:{text:"💕 Super empathy",scores:{F:2}} },

  // ===== J vs P (25) =====
  { id:76, text:"To-do list buat lu itu...", category:'JP', optionA:{text:"✅ Wajib! Nggak bisa tanpa itu",scores:{J:2}}, optionB:{text:"📝 Ada, tapi jarang diikutin",scores:{P:2}} },
  { id:77, text:"Deadline buat lu...", category:'JP', optionA:{text:"Harus selesai jauh sebelumnya",scores:{J:2}}, optionB:{text:"Pressure deadline bikin produktif",scores:{P:2}} },
  { id:78, text:"Kamar/meja kerja lu...", category:'JP', optionA:{text:"🧹 Rapi dan terorganisir",scores:{J:2}}, optionB:{text:"🎨 Berantakan kreatif",scores:{P:2}} },
  { id:79, text:"Rencana berubah mendadak, lu...", category:'JP', optionA:{text:"Agak kesel, udah plan dari awal",scores:{J:2}}, optionB:{text:"Santai, go with the flow",scores:{P:2}} },
  { id:80, text:"Packing liburan, lu...", category:'JP', optionA:{text:"Bikin list dan pack H-3",scores:{J:2}}, optionB:{text:"Last minute, masukin yang keliatan",scores:{P:2}} },
  { id:81, text:"Lu prefer hidup yang...", category:'JP', optionA:{text:"Terstruktur dengan rutinitas jelas",scores:{J:2}}, optionB:{text:"Fleksibel dan open to possibilities",scores:{P:2}} },
  { id:82, text:"Proyek besar, lu mulai dari...", category:'JP', optionA:{text:"Timeline dan breakdown task",scores:{J:2}}, optionB:{text:"Langsung mulai, figure out sambil jalan",scores:{P:2}} },
  { id:83, text:"Di restoran, lu...", category:'JP', optionA:{text:"Udah tau mau pesen sebelum duduk",scores:{J:2}}, optionB:{text:"Liat menu lama, decide terakhir",scores:{P:2}} },
  { id:84, text:"Weekend, lu...", category:'JP', optionA:{text:"Tetap ada rencana walau santai",scores:{J:2}}, optionB:{text:"Bangun tidur baru decide ngapain",scores:{P:2}} },
  { id:85, text:"Orang bilang lu...", category:'JP', optionA:{text:"Organized dan bisa diandalkan",scores:{J:2}}, optionB:{text:"Spontan dan fun",scores:{P:2}} },
  { id:86, text:"Kerja bareng orang nggak teratur...", category:'JP', optionA:{text:"Frustrated, pengen benerin sistem",scores:{J:2}}, optionB:{text:"Biasa aja, yang penting selesai",scores:{P:2}} },
  { id:87, text:"Email/notifikasi numpuk, lu...", category:'JP', optionA:{text:"Langsung beresin, inbox zero!",scores:{J:2}}, optionB:{text:"Buka yang penting, sisanya biarin",scores:{P:2}} },
  { id:88, text:"Beli baju, lu...", category:'JP', optionA:{text:"Planned: udah tau mau beli apa",scores:{J:2}}, optionB:{text:"Impulsif: liat bagus langsung beli",scores:{P:2}} },
  { id:89, text:"Multitasking buat lu...", category:'JP', optionA:{text:"Fokus satu-satu sampai selesai",scores:{J:2}}, optionB:{text:"Natural, handle banyak sekaligus",scores:{P:2}} },
  { id:90, text:"Aturan itu buat lu...", category:'JP', optionA:{text:"Penting untuk ketertiban",scores:{J:2}}, optionB:{text:"Guidelines, bukan harga mati",scores:{P:2}} },
  { id:91, text:"Udah commit ke rencana, lu...", category:'JP', optionA:{text:"Stick to the plan",scores:{J:2}}, optionB:{text:"Bisa berubah kalau ada yang menarik",scores:{P:2}} },
  { id:92, text:"Morning routine lu...", category:'JP', optionA:{text:"Sama setiap hari, autopilot",scores:{J:2}}, optionB:{text:"Beda-beda tergantung mood",scores:{P:2}} },
  { id:93, text:"Tugas setengah jadi bikin lu...", category:'JP', optionA:{text:"Gelisah, harus selesaiin!",scores:{J:2}}, optionB:{text:"Biasa aja, nanti juga selesai",scores:{P:2}} },
  { id:94, text:"Lu suka cerita yang...", category:'JP', optionA:{text:"Ending jelas dan satisfying",scores:{J:2}}, optionB:{text:"Open ended, biar imajinasi jalan",scores:{P:2}} },
  { id:95, text:"Jam tidur lu...", category:'JP', optionA:{text:"🕙 Konsisten tiap hari",scores:{J:2}}, optionB:{text:"🌙 Random tergantung ngapain",scores:{P:2}} },
  { id:96, text:"Traveling, lu...", category:'JP', optionA:{text:"Semua di-book dan direncanain",scores:{J:2}}, optionB:{text:"Booking hotel aja, sisanya spontan",scores:{P:2}} },
  { id:97, text:"Closet/lemari lu...", category:'JP', optionA:{text:"Diatur per kategori/warna",scores:{J:2}}, optionB:{text:"Yang penting muat",scores:{P:2}} },
  { id:98, text:"3 jam kosong mendadak, lu...", category:'JP', optionA:{text:"Kerjain sesuatu yang pending",scores:{J:2}}, optionB:{text:"Yay free time! Liat nanti",scores:{P:2}} },
  { id:99, text:"Keputusan buat lu...", category:'JP', optionA:{text:"Sekali decide, jarang berubah",scores:{J:2}}, optionB:{text:"Open to new info, bisa berubah",scores:{P:2}} },
  { id:100, text:"Motto hidup lu...", category:'JP', optionA:{text:"📐 Plan your work, work your plan",scores:{J:2}}, optionB:{text:"🌊 Life is what happens when busy planning",scores:{P:2}} },
]

export function getRandomQuestions(count: number = 10): Question[] {
  const cats: ('EI'|'SN'|'TF'|'JP')[] = ['EI','SN','TF','JP']
  const selected: Question[] = []
  const perCat = Math.floor(count / 4)
  const remainder = count % 4
  cats.forEach((cat, idx) => {
    const q = allQuestions.filter(q => q.category === cat)
    const shuffled = [...q].sort(() => Math.random() - 0.5)
    selected.push(...shuffled.slice(0, perCat + (idx < remainder ? 1 : 0)))
  })
  return selected.sort(() => Math.random() - 0.5)
}
