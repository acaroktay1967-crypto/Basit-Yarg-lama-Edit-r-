#!/usr/bin/env node

/**
 * Talepname Kontrol Modülü - Birim Testleri
 * 
 * Bu test dosyası talepname_kontrol.js modülünün doğruluğunu test eder
 */

const TalepnameKontrol = require('./talepname_kontrol.js');

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

let testsPassed = 0;
let testsFailed = 0;

function test(name, testFunction) {
    try {
        testFunction();
        console.log(`${colors.green}✓${colors.reset} ${name}`);
        testsPassed++;
    } catch (error) {
        console.log(`${colors.red}✗${colors.reset} ${name}`);
        console.log(`  ${colors.red}Error: ${error.message}${colors.reset}`);
        testsFailed++;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function assertEquals(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`${message}. Expected: ${expected}, Got: ${actual}`);
    }
}

function assertGreaterThan(actual, expected, message) {
    if (actual <= expected) {
        throw new Error(`${message}. Expected > ${expected}, Got: ${actual}`);
    }
}

// Test verileri
const tamVeri = {
    supheliKimlik: {
        adiSoyadi: 'Ahmet Yılmaz',
        tcKimlikNo: '12345678901',
        babaAdi: 'Mehmet',
        anaAdi: 'Fatma',
        dogumTarihiYeri: '15/05/1985 - İstanbul',
        nufusaKayitliYer: 'İstanbul/Kadıköy',
        mudafii: 'Av. Ali Demir - İstanbul Barosu'
    },
    magdurKimlik: {
        adiSoyadi: 'Ayşe Kaya',
        tcKimlikNo: '98765432109',
        iletisimBilgileri: 'İstanbul, Şişli, Tel: 0555 111 2233'
    },
    isnatOlunanSuc: {
        sucTanimi: 'Tehdit suçu',
        tckMaddesi: 'TCK m.106/1',
        digeMevzuat: '-'
    },
    sucunIslendigiYerZaman: {
        yer: 'İstanbul, Kadıköy, Moda Caddesi No: 45',
        tarih: '10.12.2024',
        zamanDilimi: '14:30 - 15:00 arası'
    },
    tutuklulukDurumu: {
        tutuklumu: 'Hayır',
        gozaltiTarihi: '-',
        tutuklamaTarihi: '-',
        gozaltiSuresi: '-',
        tutuklamaSuresi: '-'
    },
    olayinOzeti: {
        ozetMetin: 'Şüpheli Ahmet Yılmaz, 10.12.2024 tarihinde saat 14:30 sıralarında İstanbul Kadıköy\'de bulunan Moda Caddesi No: 45 adresinde mağdur Ayşe Kaya\'ya yönelik tehdit içerikli sözler sarf etmiştir. Tanıkların beyanlarına ve olay yeri inceleme raporuna göre, şüpheli mağdura "Seni öldürürüm" şeklinde tehdit içerikli sözler söylemiştir.'
    },
    teklifEdilenUsul: {
        teklifEdilenUsul: 'Basit Yargılama Usulü',
        mudafiiHuzurundamiTeklif: 'Evet',
        teklifKabulEdildiMi: 'Evet',
        teklifTarihi: '12.12.2024',
        beyanMetni: 'Basit yargılama usulünü kabul ediyorum.'
    },
    cezaVeTedbirler: {
        temelCeza: 'Hapis cezası',
        cezaAltSinir: '6 ay',
        cezaUstSinir: '2 yıl',
        guvenlikTedbirleri: '-',
        aciklama: 'TCK 106/1 uyarınca tehdit suçu için öngörülen ceza'
    }
};

const eksikVeri = {
    supheliKimlik: {
        adiSoyadi: 'Ahmet Yılmaz',
        tcKimlikNo: '12345678901'
        // Diğer alanlar eksik
    },
    magdurKimlik: {
        adiSoyadi: 'Ayşe Kaya'
    }
    // Diğer gruplar eksik
};

const bosVeri = {};

console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.blue}🧪 TALEPNAME KONTROL MODÜLÜ TEST SÜRECİ${colors.reset}`);
console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

// Temel yapı testleri
console.log(`${colors.yellow}📋 Temel Yapı Testleri${colors.reset}`);

test('TalepnameKontrol sınıfı oluşturulabilmeli', () => {
    const kontrol = new TalepnameKontrol();
    assert(kontrol !== null, 'Kontrol nesnesi oluşturulamadı');
    assert(typeof kontrol === 'object', 'Kontrol bir nesne olmalı');
});

test('Zorunlu alanlar doğru tanımlanmış', () => {
    const kontrol = new TalepnameKontrol();
    const alanlar = kontrol.zorunluAlanlariGetir();
    
    assert(alanlar.supheliKimlik !== undefined, 'supheliKimlik tanımlı olmalı');
    assert(alanlar.magdurKimlik !== undefined, 'magdurKimlik tanımlı olmalı');
    assert(alanlar.isnatOlunanSuc !== undefined, 'isnatOlunanSuc tanımlı olmalı');
    assert(alanlar.sucunIslendigiYerZaman !== undefined, 'sucunIslendigiYerZaman tanımlı olmalı');
    assert(alanlar.tutuklulukDurumu !== undefined, 'tutuklulukDurumu tanımlı olmalı');
    assert(alanlar.olayinOzeti !== undefined, 'olayinOzeti tanımlı olmalı');
    assert(alanlar.teklifEdilenUsul !== undefined, 'teklifEdilenUsul tanımlı olmalı');
    assert(alanlar.cezaVeTedbirler !== undefined, 'cezaVeTedbirler tanımlı olmalı');
});

test('Her alan grubu gerekli özelliklere sahip', () => {
    const kontrol = new TalepnameKontrol();
    const alanlar = kontrol.zorunluAlanlariGetir();
    
    for (const [key, value] of Object.entries(alanlar)) {
        assert(value.name !== undefined, `${key} için name eksik`);
        assert(value.fields !== undefined, `${key} için fields eksik`);
        assert(typeof value.fields === 'object', `${key} fields bir nesne olmalı`);
    }
});

// Validasyon testleri
console.log(`\n${colors.yellow}🔍 Validasyon Testleri${colors.reset}`);

test('Tam veri kontrolü başarılı olmalı', () => {
    const kontrol = new TalepnameKontrol();
    const sonuc = kontrol.kontrolEt(tamVeri);
    
    assert(sonuc.basarili === true, 'Tam veri için başarılı olmalı');
    assertEquals(sonuc.tamamlanmaOrani, 100, 'Tamamlanma oranı 100% olmalı');
    assertEquals(sonuc.eksikAlanlar.length, 0, 'Eksik alan olmamalı');
});

test('Eksik veri kontrolü başarısız olmalı', () => {
    const kontrol = new TalepnameKontrol();
    const sonuc = kontrol.kontrolEt(eksikVeri);
    
    assert(sonuc.basarili === false, 'Eksik veri için başarısız olmalı');
    assertGreaterThan(sonuc.eksikAlanlar.length, 0, 'Eksik alanlar tespit edilmeli');
    assertGreaterThan(100, sonuc.tamamlanmaOrani, 'Tamamlanma oranı 100%\'den az olmalı');
});

test('Boş veri kontrolü başarısız olmalı', () => {
    const kontrol = new TalepnameKontrol();
    const sonuc = kontrol.kontrolEt(bosVeri);
    
    assert(sonuc.basarili === false, 'Boş veri için başarısız olmalı');
    assertGreaterThan(sonuc.eksikAlanlar.length, 20, 'Çok sayıda eksik alan olmalı');
});

test('Validasyon sonucu doğru yapıya sahip', () => {
    const kontrol = new TalepnameKontrol();
    const sonuc = kontrol.kontrolEt(tamVeri);
    
    assert(sonuc.basarili !== undefined, 'basarili alanı olmalı');
    assert(sonuc.tamamlanmaOrani !== undefined, 'tamamlanmaOrani alanı olmalı');
    assert(sonuc.eksikAlanlar !== undefined, 'eksikAlanlar alanı olmalı');
    assert(sonuc.uyarilar !== undefined, 'uyarilar alanı olmalı');
    assert(sonuc.detaylar !== undefined, 'detaylar alanı olmalı');
    assert(sonuc.mesaj !== undefined, 'mesaj alanı olmalı');
});

// Özel kontrol testleri
console.log(`\n${colors.yellow}⚖️ Özel Kontrol Testleri${colors.reset}`);

test('Tutuklu ise tutuklama tarihi uyarısı verilmeli', () => {
    const kontrol = new TalepnameKontrol();
    const veri = {
        ...tamVeri,
        tutuklulukDurumu: {
            tutuklumu: 'Evet',
            gozaltiTarihi: '10.12.2024',
            tutuklamaTarihi: '', // Eksik
            gozaltiSuresi: '24 saat',
            tutuklamaSuresi: ''
        }
    };
    
    const sonuc = kontrol.kontrolEt(veri);
    const tutuklamaUyarisi = sonuc.uyarilar.find(u => u.mesaj.includes('tutuklama tarihi'));
    assert(tutuklamaUyarisi !== undefined, 'Tutuklama tarihi uyarısı olmalı');
});

test('TCK maddesi format kontrolü yapılmalı', () => {
    const kontrol = new TalepnameKontrol();
    const veri = {
        ...tamVeri,
        isnatOlunanSuc: {
            sucTanimi: 'Tehdit suçu',
            tckMaddesi: '106/1', // Yanlış format
            digeMevzuat: '-'
        }
    };
    
    const sonuc = kontrol.kontrolEt(veri);
    const formatUyarisi = sonuc.uyarilar.find(u => u.tip === 'format');
    assert(formatUyarisi !== undefined, 'Format uyarısı olmalı');
});

test('Kısa olay özeti için uyarı verilmeli', () => {
    const kontrol = new TalepnameKontrol();
    const veri = {
        ...tamVeri,
        olayinOzeti: {
            ozetMetin: 'Kısa özet' // 50 karakterden az
        }
    };
    
    const sonuc = kontrol.kontrolEt(veri);
    const kaliteUyarisi = sonuc.uyarilar.find(u => u.tip === 'kalite');
    assert(kaliteUyarisi !== undefined, 'Kalite uyarısı olmalı');
});

test('Müdafii huzurunda olmayan teklif için uyarı verilmeli', () => {
    const kontrol = new TalepnameKontrol();
    const veri = {
        ...tamVeri,
        teklifEdilenUsul: {
            teklifEdilenUsul: 'Basit Yargılama Usulü',
            mudafiiHuzurundamiTeklif: 'Hayır', // Hayır
            teklifKabulEdildiMi: 'Evet',
            teklifTarihi: '12.12.2024',
            beyanMetni: 'Kabul ediyorum'
        }
    };
    
    const sonuc = kontrol.kontrolEt(veri);
    const hukukiUyari = sonuc.uyarilar.find(u => u.tip === 'hukuki');
    assert(hukukiUyari !== undefined, 'Hukuki uyarı olmalı');
});

// Tamamlanma oranı testleri
console.log(`\n${colors.yellow}📊 Tamamlanma Oranı Testleri${colors.reset}`);

test('Tam veri için tamamlanma oranı 100% olmalı', () => {
    const kontrol = new TalepnameKontrol();
    const sonuc = kontrol.kontrolEt(tamVeri);
    assertEquals(sonuc.tamamlanmaOrani, 100, 'Tamamlanma oranı 100% olmalı');
});

test('Yarı dolu veri için tamamlanma oranı yaklaşık %50 olmalı', () => {
    const kontrol = new TalepnameKontrol();
    const sonuc = kontrol.kontrolEt(eksikVeri);
    assert(sonuc.tamamlanmaOrani > 0, 'Tamamlanma oranı 0\'dan büyük olmalı');
    assert(sonuc.tamamlanmaOrani < 50, 'Tamamlanma oranı 50\'den az olmalı');
});

test('Boş veri için tamamlanma oranı 0% olmalı', () => {
    const kontrol = new TalepnameKontrol();
    const sonuc = kontrol.kontrolEt(bosVeri);
    assertEquals(sonuc.tamamlanmaOrani, 0, 'Tamamlanma oranı 0% olmalı');
});

// Rapor testleri
console.log(`\n${colors.yellow}📄 Rapor Oluşturma Testleri${colors.reset}`);

test('HTML raporu oluşturulabilmeli', () => {
    const kontrol = new TalepnameKontrol();
    const sonuc = kontrol.kontrolEt(tamVeri);
    const rapor = kontrol.raporOlustur(sonuc);
    
    assert(typeof rapor === 'string', 'Rapor string olmalı');
    assert(rapor.includes('<div'), 'Rapor HTML içermeli');
    assert(rapor.length > 0, 'Rapor boş olmamalı');
});

test('Konsol raporu oluşturulabilmeli', () => {
    const kontrol = new TalepnameKontrol();
    const sonuc = kontrol.kontrolEt(tamVeri);
    
    // Konsol raporu çıktı verir, hata olmamalı
    try {
        kontrol.konsolRaporuOlustur(sonuc);
        assert(true, 'Konsol raporu oluşturuldu');
    } catch (error) {
        assert(false, 'Konsol raporu oluşturulurken hata: ' + error.message);
    }
});

// Alan kontrolü testleri
console.log(`\n${colors.yellow}🔤 Alan Kontrolü Testleri${colors.reset}`);

test('Boş string dolu sayılmamalı', () => {
    const kontrol = new TalepnameKontrol();
    assert(!kontrol.alanDoluMu(''), 'Boş string dolu sayılmamalı');
    assert(!kontrol.alanDoluMu('   '), 'Boşluklu string dolu sayılmamalı');
});

test('Dolu string dolu sayılmalı', () => {
    const kontrol = new TalepnameKontrol();
    assert(kontrol.alanDoluMu('test'), 'Dolu string dolu sayılmalı');
    assert(kontrol.alanDoluMu('  test  '), 'Kenarlarında boşluk olan string dolu sayılmalı');
});

test('null ve undefined dolu sayılmamalı', () => {
    const kontrol = new TalepnameKontrol();
    assert(!kontrol.alanDoluMu(null), 'null dolu sayılmamalı');
    assert(!kontrol.alanDoluMu(undefined), 'undefined dolu sayılmamalı');
});

test('Boolean değerler her zaman dolu sayılmalı', () => {
    const kontrol = new TalepnameKontrol();
    assert(kontrol.alanDoluMu(true), 'true dolu sayılmalı');
    assert(kontrol.alanDoluMu(false), 'false dolu sayılmalı');
});

// Detaylı sonuç testleri
console.log(`\n${colors.yellow}📝 Detaylı Sonuç Testleri${colors.reset}`);

test('Detaylar 8 grup içermeli', () => {
    const kontrol = new TalepnameKontrol();
    const sonuc = kontrol.kontrolEt(tamVeri);
    assertEquals(sonuc.detaylar.length, 8, 'Detaylar 8 grup içermeli');
});

test('Her detay grubu gerekli alanlara sahip', () => {
    const kontrol = new TalepnameKontrol();
    const sonuc = kontrol.kontrolEt(tamVeri);
    
    sonuc.detaylar.forEach(detay => {
        assert(detay.alan !== undefined, 'Her detay alan adı içermeli');
        assert(detay.alanKodu !== undefined, 'Her detay alan kodu içermeli');
        assert(detay.tamamlandiMi !== undefined, 'Her detay tamamlanma durumu içermeli');
        assert(Array.isArray(detay.eksikAlanlar), 'eksikAlanlar bir dizi olmalı');
    });
});

test('Eksik alanlar doğru gruplanmış', () => {
    const kontrol = new TalepnameKontrol();
    const sonuc = kontrol.kontrolEt(eksikVeri);
    
    sonuc.eksikAlanlar.forEach(eksik => {
        assert(eksik.grup !== undefined, 'Eksik alan grup içermeli');
        assert(eksik.alan !== undefined, 'Eksik alan adı içermeli');
        assert(eksik.alanKodu !== undefined, 'Eksik alan kodu içermeli');
        assert(eksik.fieldKey !== undefined, 'Eksik alan field key içermeli');
    });
});

// Print summary
console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.blue}📊 TEST ÖZETİ${colors.reset}`);
console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

const total = testsPassed + testsFailed;
const passRate = ((testsPassed / total) * 100).toFixed(1);

console.log(`Toplam Test:      ${total}`);
console.log(`${colors.green}Başarılı:         ${testsPassed}${colors.reset}`);
console.log(`${colors.red}Başarısız:        ${testsFailed}${colors.reset}`);
console.log(`Başarı Oranı:     ${passRate}%\n`);

// Örnek validasyon raporu
console.log(`${colors.cyan}📋 Örnek Validasyon Raporu (Tam Veri)${colors.reset}`);
const kontrolOrnek = new TalepnameKontrol();
const sonucOrnek = kontrolOrnek.kontrolEt(tamVeri);
kontrolOrnek.konsolRaporuOlustur(sonucOrnek);

if (testsFailed === 0) {
    console.log(`${colors.green}✅ Tüm testler başarıyla geçti!${colors.reset}\n`);
    process.exit(0);
} else {
    console.log(`${colors.red}❌ ${testsFailed} test başarısız oldu.${colors.reset}\n`);
    process.exit(1);
}
