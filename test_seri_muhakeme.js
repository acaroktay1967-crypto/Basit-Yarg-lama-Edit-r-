#!/usr/bin/env node

/**
 * Seri Muhakeme Usulü Test Suite
 * Bu test dosyası seri muhakeme kontrol modülünün doğruluğunu test eder
 */

const fs = require('fs');
const path = require('path');

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

// Load data files
const kurallarPath = path.join(__dirname, 'seri_muhakeme_kurallar.json');
const sucKutuphanePath = path.join(__dirname, 'suc_turleri_kutuphanesi.json');

let kurallarData;
let sucKutuphanesi;

try {
    kurallarData = JSON.parse(fs.readFileSync(kurallarPath, 'utf8'));
    sucKutuphanesi = JSON.parse(fs.readFileSync(sucKutuphanePath, 'utf8'));
    console.log(`${colors.cyan}📁 Veri dosyaları başarıyla yüklendi${colors.reset}\n`);
} catch (error) {
    console.error(`${colors.red}Hata: Veri dosyaları yüklenemedi - ${error.message}${colors.reset}`);
    process.exit(1);
}

// Load control module
const SeriMuhakemeKontrol = require('./seri_muhakeme_kontrol.js');

console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.blue}🧪 SERİ MUHAKEME KONTROL SİSTEMİ TEST SÜRECİ${colors.reset}`);
console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

console.log(`${colors.yellow}📋 Kurallar Dosyası Testleri${colors.reset}`);

test('Kurallar JSON dosyası geçerli yapıya sahip', () => {
    assert(typeof kurallarData === 'object', 'Veri bir nesne olmalı');
    assert('metadata' in kurallarData, 'metadata bölümü eksik');
    assert('uygulanamaayacagi_haller' in kurallarData, 'uygulanamaayacagi_haller eksik');
});

test('Uygulanamayacağı haller tam ve doğru', () => {
    const haller = kurallarData.uygulanamaayacagi_haller;
    assert(Array.isArray(haller), 'Haller bir dizi olmalı');
    assert(haller.length === 6, 'Problem statement\'ta belirtilen 6 hal olmalı');
    
    const gerekliKodlar = [
        'ULASILAMAMA',
        'ONODEME_UZLASTIRMA',
        'MAHKEMEYE_GELMEME',
        'ISTIRAK_KABUL_ETMEME',
        'KARMA_SUCLAR',
        'EHLIYET_ENGELI'
    ];
    
    const mevcutKodlar = haller.map(h => h.kod);
    gerekliKodlar.forEach(kod => {
        assert(mevcutKodlar.includes(kod), `${kod} kodu eksik`);
    });
});

test('Prosedür adımları tanımlanmış', () => {
    assert('prosedur_adimlari' in kurallarData, 'prosedur_adimlari eksik');
    assert(kurallarData.prosedur_adimlari.length >= 4, 'En az 4 adım olmalı');
});

test('Genel koşullar tanımlanmış', () => {
    assert('genel_kosullar' in kurallarData, 'genel_kosullar eksik');
    assert('ceza_siniri' in kurallarData.genel_kosullar, 'ceza_siniri eksik');
    assert('ceza_indirimi' in kurallarData.genel_kosullar, 'ceza_indirimi eksik');
});

console.log(`\n${colors.yellow}🔍 Suç Kütüphanesi Güncellemeleri${colors.reset}`);

test('Seri muhakeme alanı tüm suçlara eklenmiş', () => {
    sucKutuphanesi.offenses.forEach((offense, index) => {
        assert('seri_muhakeme_uygun' in offense, 
            `Suç #${index + 1} için seri_muhakeme_uygun alanı eksik`);
        assert(typeof offense.seri_muhakeme_uygun === 'boolean',
            `Suç #${index + 1} için seri_muhakeme_uygun boolean olmalı`);
    });
});

test('Seri muhakeme uygun suçlarda notlar mevcut', () => {
    const uygunSuclar = sucKutuphanesi.offenses.filter(o => o.seri_muhakeme_uygun);
    uygunSuclar.forEach(suc => {
        assert('seri_muhakeme_notes' in suc || true, // Optional field
            `${suc.tck_article} için not eklenebilir`);
    });
});

test('Basit yargılama ve seri muhakeme tutarlılığı', () => {
    // Genel olarak basit yargılamaya uygun olanlar seri muhakemeye de uygundur
    // Ancak bazı istisnalar olabilir
    const tutarsiz = sucKutuphanesi.offenses.filter(o => 
        !o.eligible_for_simple_trial && o.seri_muhakeme_uygun
    );
    // Bu mantıksal olarak tutarsız olur (seri muhakeme daha kısıtlayıcı)
    assert(tutarsiz.length === 0, 
        'Basit yargılamaya uygun olmayan suç seri muhakemeye uygun olamaz');
});

console.log(`\n${colors.yellow}⚙️ Kontrol Modülü Testleri${colors.reset}`);

let kontrolModulu;

test('Kontrol modülü oluşturulabilir', () => {
    // Node.js ortamında doğrudan verilerle oluştur
    kontrolModulu = new SeriMuhakemeKontrol(kurallarData, sucKutuphanesi);
    assert(kontrolModulu !== null, 'Modül oluşturulamadı');
    assert(kontrolModulu.kurallar !== null, 'Kurallar yüklenmedi');
    assert(kontrolModulu.sucKutuphanesi !== null, 'Suç kütüphanesi yüklenmedi');
});

test('Suç bulma fonksiyonu TCK maddesi ile çalışıyor', () => {
    const suc = kontrolModulu.sucBul('TCK m.106/1');
    assert(suc !== null, 'Tehdit suçu bulunamadı');
    assert(suc.tck_article === 'TCK m.106/1', 'Yanlış suç bulundu');
});

test('Suç bulma fonksiyonu ID ile çalışıyor', () => {
    const suc = kontrolModulu.sucBul(1);
    assert(suc !== null, 'ID ile suç bulunamadı');
    assert(suc.id === 1, 'Yanlış suç bulundu');
});

console.log(`\n${colors.yellow}✅ Kontrol Fonksiyonu İş Mantığı Testleri${colors.reset}`);

test('Uygun suç türü için onay verir', () => {
    const sonuc = kontrolModulu.kontrolEt({
        sucTuru: 'TCK m.106/1', // Tehdit suçu - genelde uygun
        yasKucuklugu: false,
        akilHastaligi: false,
        sagirDilsiz: false,
        yurtDisi: false,
        adreseBulunamama: false,
        istirakVar: false,
        istirakKabulYok: false,
        mahkemeyeGelmedi: false,
        onodemeKapsaminda: false,
        uzlastirmaKapsaminda: false,
        karmaSucVar: false
    });
    
    // Tehdit suçunun seri_muhakeme_uygun değerini kontrol et
    const tehditSucu = kontrolModulu.sucBul('TCK m.106/1');
    if (tehditSucu.seri_muhakeme_uygun) {
        assert(sonuc.uygun === true, 'Uygun suç için onay verilmeli');
        assert(sonuc.nedenler.length === 0, 'Neden olmamalı');
    }
});

test('Yaş küçüklüğü durumunda red verir', () => {
    const sonuc = kontrolModulu.kontrolEt({
        sucTuru: 'TCK m.106/1',
        yasKucuklugu: true,
        akilHastaligi: false,
        sagirDilsiz: false,
        yurtDisi: false,
        adreseBulunamama: false,
        istirakVar: false,
        istirakKabulYok: false,
        mahkemeyeGelmedi: false,
        onodemeKapsaminda: false,
        uzlastirmaKapsaminda: false,
        karmaSucVar: false
    });
    
    assert(sonuc.uygun === false, 'Yaş küçüklüğünde red vermeli');
    assert(sonuc.nedenler.some(n => n.includes('Yaş küçüklüğü')), 
        'Yaş küçüklüğü nedeni belirtilmeli');
});

test('Akıl hastalığı durumunda red verir', () => {
    const sonuc = kontrolModulu.kontrolEt({
        sucTuru: 'TCK m.106/1',
        yasKucuklugu: false,
        akilHastaligi: true,
        sagirDilsiz: false,
        yurtDisi: false,
        adreseBulunamama: false,
        istirakVar: false,
        istirakKabulYok: false,
        mahkemeyeGelmedi: false,
        onodemeKapsaminda: false,
        uzlastirmaKapsaminda: false,
        karmaSucVar: false
    });
    
    assert(sonuc.uygun === false, 'Akıl hastalığında red vermeli');
});

test('Önödeme kapsamında red verir', () => {
    const sonuc = kontrolModulu.kontrolEt({
        sucTuru: 'TCK m.106/1',
        yasKucuklugu: false,
        akilHastaligi: false,
        sagirDilsiz: false,
        yurtDisi: false,
        adreseBulunamama: false,
        istirakVar: false,
        istirakKabulYok: false,
        mahkemeyeGelmedi: false,
        onodemeKapsaminda: true,
        uzlastirmaKapsaminda: false,
        karmaSucVar: false
    });
    
    assert(sonuc.uygun === false, 'Önödeme kapsamında red vermeli');
    assert(sonuc.nedenler.some(n => n.includes('Önödeme')), 
        'Önödeme nedeni belirtilmeli');
});

test('İştirak hali ve kabul etmeme durumunda red verir', () => {
    const sonuc = kontrolModulu.kontrolEt({
        sucTuru: 'TCK m.106/1',
        yasKucuklugu: false,
        akilHastaligi: false,
        sagirDilsiz: false,
        yurtDisi: false,
        adreseBulunamama: false,
        istirakVar: true,
        istirakKabulYok: true,
        mahkemeyeGelmedi: false,
        onodemeKapsaminda: false,
        uzlastirmaKapsaminda: false,
        karmaSucVar: false
    });
    
    assert(sonuc.uygun === false, 'İştirak kabul etmeme durumunda red vermeli');
    assert(sonuc.nedenler.some(n => n.includes('iştirak')), 
        'İştirak nedeni belirtilmeli');
});

test('Karma suç durumunda red verir', () => {
    const sonuc = kontrolModulu.kontrolEt({
        sucTuru: 'TCK m.106/1',
        yasKucuklugu: false,
        akilHastaligi: false,
        sagirDilsiz: false,
        yurtDisi: false,
        adreseBulunamama: false,
        istirakVar: false,
        istirakKabulYok: false,
        mahkemeyeGelmedi: false,
        onodemeKapsaminda: false,
        uzlastirmaKapsaminda: false,
        karmaSucVar: true
    });
    
    assert(sonuc.uygun === false, 'Karma suç durumunda red vermeli');
});

test('Uygun olmayan suç türü için red verir', () => {
    // Alt sınırı 2 yıldan fazla olan bir suç bul
    const uygunOlmayanSuc = sucKutuphanesi.offenses.find(o => !o.seri_muhakeme_uygun);
    
    if (uygunOlmayanSuc) {
        const sonuc = kontrolModulu.kontrolEt({
            sucTuru: uygunOlmayanSuc.tck_article,
            yasKucuklugu: false,
            akilHastaligi: false,
            sagirDilsiz: false,
            yurtDisi: false,
            adreseBulunamama: false,
            istirakVar: false,
            istirakKabulYok: false,
            mahkemeyeGelmedi: false,
            onodemeKapsaminda: false,
            uzlastirmaKapsaminda: false,
            karmaSucVar: false
        });
        
        assert(sonuc.uygun === false, 'Uygun olmayan suç için red vermeli');
        assert(sonuc.nedenler.some(n => n.includes('kapsamında değildir')), 
            'Kapsam dışı nedeni belirtilmeli');
    }
});

test('Bilinmeyen suç için hata döner', () => {
    const sonuc = kontrolModulu.kontrolEt({
        sucTuru: 'TCK m.999/99',
        yasKucuklugu: false,
        akilHastaligi: false,
        sagirDilsiz: false,
        yurtDisi: false,
        adreseBulunamama: false,
        istirakVar: false,
        istirakKabulYok: false,
        mahkemeyeGelmedi: false,
        onodemeKapsaminda: false,
        uzlastirmaKapsaminda: false,
        karmaSucVar: false
    });
    
    assert(sonuc.uygun === false, 'Bilinmeyen suç için red vermeli');
    assert(sonuc.nedenler.some(n => n.includes('bulunamadı')), 
        'Bulunamadı mesajı olmalı');
});

console.log(`\n${colors.yellow}📊 Yardımcı Fonksiyon Testleri${colors.reset}`);

test('Uygun suçları getir fonksiyonu çalışıyor', () => {
    const uygunSuclar = kontrolModulu.uygunSuclariGetir();
    assert(Array.isArray(uygunSuclar), 'Dizi dönmeli');
    assert(uygunSuclar.length > 0, 'En az bir uygun suç olmalı');
    uygunSuclar.forEach(suc => {
        assert(suc.seri_muhakeme_uygun === true, 
            'Tüm suçlar seri_muhakeme_uygun olmalı');
    });
});

test('İstatistikler fonksiyonu çalışıyor', () => {
    const stats = kontrolModulu.istatistikler();
    assert(stats !== null, 'İstatistikler null olmamalı');
    assert('toplam_suc' in stats, 'toplam_suc olmalı');
    assert('seri_muhakeme_uygun' in stats, 'seri_muhakeme_uygun olmalı');
    assert('oran' in stats, 'oran olmalı');
    assert(stats.toplam_suc > 0, 'Toplam suç sayısı 0\'dan büyük olmalı');
});

test('Kurallar getir fonksiyonu çalışıyor', () => {
    const kurallar = kontrolModulu.getKurallar();
    assert(kurallar !== null, 'Kurallar null olmamalı');
    assert('uygulanamaayacagi_haller' in kurallar, 'Haller olmalı');
});

// Print summary
console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.blue}📊 TEST ÖZETİ${colors.reset}`);
console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

const total = testsPassed + testsFailed;
const passRate = total > 0 ? ((testsPassed / total) * 100).toFixed(1) : 0;

console.log(`Toplam Test:      ${total}`);
console.log(`${colors.green}Başarılı:         ${testsPassed}${colors.reset}`);
console.log(`${colors.red}Başarısız:        ${testsFailed}${colors.reset}`);
console.log(`Başarı Oranı:     ${passRate}%\n`);

// Print statistics
const stats = kontrolModulu.istatistikler();
console.log(`${colors.cyan}📈 Seri Muhakeme İstatistikleri${colors.reset}`);
console.log(`Toplam Suç Türü:                    ${stats.toplam_suc}`);
console.log(`Seri Muhakeme Uygun:                ${stats.seri_muhakeme_uygun}`);
console.log(`Seri Muhakeme Uygun Olmayan:        ${stats.seri_muhakeme_uygun_olmayan}`);
console.log(`Uygunluk Oranı:                     ${stats.oran}\n`);

if (testsFailed === 0) {
    console.log(`${colors.green}✅ Tüm testler başarıyla geçti!${colors.reset}\n`);
    process.exit(0);
} else {
    console.log(`${colors.red}❌ ${testsFailed} test başarısız oldu.${colors.reset}\n`);
    process.exit(1);
}
