#!/usr/bin/env node

/**
 * Node.js Test Suite for Offense Library
 * Bu test dosyası suc_turleri_kutuphanesi.json dosyasının doğruluğunu test eder
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
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

// Load offense data
const jsonPath = path.join(__dirname, 'suc_turleri_kutuphanesi.json');
let offenseData;

try {
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    offenseData = JSON.parse(rawData);
    console.log(`${colors.cyan}📁 JSON dosyası başarıyla yüklendi${colors.reset}\n`);
} catch (error) {
    console.error(`${colors.red}Hata: JSON dosyası yüklenemedi - ${error.message}${colors.reset}`);
    process.exit(1);
}

// Run tests
console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.blue}🧪 SUÇ KÜTÜPHANESİ TEST SÜRECİ${colors.reset}`);
console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

console.log(`${colors.yellow}📋 Veri Yapısı Testleri${colors.reset}`);
test('JSON dosyası geçerli yapıya sahip', () => {
    assert(typeof offenseData === 'object', 'Veri bir nesne olmalı');
});

test('Metadata bölümü mevcut', () => {
    assert('metadata' in offenseData, 'metadata bölümü eksik');
    assert('version' in offenseData.metadata, 'version bilgisi eksik');
    assert('description' in offenseData.metadata, 'description bilgisi eksik');
});

test('Offenses dizisi mevcut ve geçerli', () => {
    assert('offenses' in offenseData, 'offenses dizisi eksik');
    assert(Array.isArray(offenseData.offenses), 'offenses bir dizi olmalı');
    assert(offenseData.offenses.length > 0, 'offenses dizisi boş');
});

console.log(`\n${colors.yellow}🔍 Veri Bütünlüğü Testleri${colors.reset}`);
test('Tüm suçlarda gerekli alanlar mevcut', () => {
    const requiredFields = ['id', 'category', 'name', 'tck_article', 'description', 
                           'penalty_min', 'penalty_max', 'penalty_type', 'eligible_for_simple_trial'];
    
    offenseData.offenses.forEach((offense, index) => {
        requiredFields.forEach(field => {
            assert(field in offense, 
                `Suç #${index + 1} (${offense.name || 'İsimsiz'}) için '${field}' alanı eksik`);
        });
    });
});

test('ID değerleri benzersiz', () => {
    const ids = offenseData.offenses.map(o => o.id);
    const uniqueIds = new Set(ids);
    assertEquals(ids.length, uniqueIds.size, 'Tekrarlayan ID değerleri var');
});

test('TCK maddeleri formatı doğru', () => {
    offenseData.offenses.forEach(offense => {
        // TCK veya özel kanun numarası (örn: 6136 S.K., 6831 S.K.) ile başlamalı
        const isValid = offense.tck_article.startsWith('TCK') || 
                       /^\d{4}\s*S\.K\./.test(offense.tck_article);
        assert(isValid, 
            `${offense.tck_article} geçersiz format - 'TCK' veya özel kanun formatında olmalı`);
    });
});

console.log(`\n${colors.yellow}⚖️ Suç Türü Doğrulama Testleri${colors.reset}`);
test('Problem statement\'ta belirtilen suçlar mevcut', () => {
    const requiredOffenses = [
        'TCK m.86/2',
        'TCK m.86/3',
        'TCK m.88/1',
        'TCK m.89/1',
        'TCK m.97',
        'TCK m.98',
        'TCK m.106/1',
        'TCK m.105/1',
        'TCK m.116/1'
    ];
    
    const articles = offenseData.offenses.map(o => o.tck_article);
    
    requiredOffenses.forEach(required => {
        assert(articles.includes(required), 
            `Gerekli suç ${required} kütüphanede bulunamadı`);
    });
});

test('Basit kasten yaralama (TCK 86/2) doğru tanımlanmış', () => {
    const offense = offenseData.offenses.find(o => o.tck_article === 'TCK m.86/2');
    assert(offense !== undefined, 'TCK m.86/2 bulunamadı');
    assert(offense.name.includes('yaralama'), 'İsim "yaralama" içermeli');
});

test('Tehdit suçu (TCK 106/1) doğru tanımlanmış', () => {
    const offense = offenseData.offenses.find(o => o.tck_article === 'TCK m.106/1');
    assert(offense !== undefined, 'TCK m.106/1 bulunamadı');
    assert(offense.eligible_for_simple_trial === true, 'Tehdit suçu basit yargılamaya uygun olmalı');
});

console.log(`\n${colors.yellow}🎯 İş Mantığı Testleri${colors.reset}`);
test('En az 15 suç türü tanımlı', () => {
    assert(offenseData.offenses.length >= 15, 
        `En az 15 suç türü bekleniyor, ${offenseData.offenses.length} bulundu`);
});

test('Basit yargılamaya uygun suçlar var', () => {
    const eligible = offenseData.offenses.filter(o => o.eligible_for_simple_trial === true);
    assert(eligible.length > 0, 'Basit yargılamaya uygun suç bulunamadı');
});

test('Kategoriler tutarlı', () => {
    const categories = [...new Set(offenseData.offenses.map(o => o.category))];
    assert(categories.length >= 2, 'En az 2 kategori olmalı');
    categories.forEach(category => {
        assert(category.includes('Karşı') || category.includes('Seri Muhakeme'), 'Kategori standart formatta değil');
    });
});

test('Penalty types geçerli', () => {
    const validTypes = ['Hapis', 'Adli Para Cezası', 'Hapis veya Adli Para Cezası', 'Temel cezada indirim', 'Değişken'];
    offenseData.offenses.forEach(offense => {
        const isValid = validTypes.includes(offense.penalty_type);
        assert(isValid, `${offense.tck_article} için geçersiz ceza türü: ${offense.penalty_type}`);
    });
});

console.log(`\n${colors.yellow}⚡ Seri Muhakeme Usulü Testleri${colors.reset}`);
test('Seri muhakeme usulüne tabi suçlar var', () => {
    const expedited = offenseData.offenses.filter(o => o.eligible_for_expedited_trial === true);
    assert(expedited.length > 0, 'Seri muhakeme usulüne tabi suç bulunamadı');
});

test('En az 13 seri muhakeme suçu tanımlı', () => {
    const expedited = offenseData.offenses.filter(o => o.eligible_for_expedited_trial === true);
    assert(expedited.length >= 13, 
        `En az 13 seri muhakeme suçu bekleniyor, ${expedited.length} bulundu`);
});

test('Seri muhakeme kategorisi mevcut', () => {
    const categories = [...new Set(offenseData.offenses.map(o => o.category))];
    const hasExpeditedCategory = categories.some(cat => cat.includes('Seri Muhakeme'));
    assert(hasExpeditedCategory, 'Seri Muhakeme Usulüne Tabi Suçlar kategorisi bulunamadı');
});

test('Gerekli seri muhakeme suçları mevcut', () => {
    const requiredExpeditedOffenses = [
        'TCK m.154/2-3',  // Hakkı olmayan yere tecavüz
        'TCK m.170',      // Genel güvenliğin kasten tehlikeye sokulması
        'TCK m.179/2-3',  // Trafik güvenliğini tehlikeye sokma
        'TCK m.183',      // Gürültüye neden olma
        'TCK m.197/2-3',  // Parada sahtecilik
        'TCK m.203',      // Mühür bozma
        'TCK m.206',      // Resmi belgenin düzenlenmesinde yalan beyan
        'TCK m.228/1',    // Kumar oynanması için yer ve imkan sağlama
        'TCK m.268'       // Başkasına ait kimlik veya kimlik bilgilerinin kullanılması
    ];
    
    const articles = offenseData.offenses.map(o => o.tck_article);
    
    requiredExpeditedOffenses.forEach(required => {
        assert(articles.includes(required), 
            `Gerekli seri muhakeme suçu ${required} kütüphanede bulunamadı`);
    });
});

test('Özel kanunlardan suçlar mevcut', () => {
    const hasSpecialLaws = offenseData.offenses.some(o => 
        o.tck_article.includes('6136') || 
        o.tck_article.includes('6831') || 
        o.tck_article.includes('1072') || 
        o.tck_article.includes('1163')
    );
    assert(hasSpecialLaws, 'Özel kanunlardan (6136, 6831, 1072, 1163) seri muhakeme suçları bulunamadı');
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

// Print statistics
console.log(`${colors.cyan}📈 Kütüphane İstatistikleri${colors.reset}`);
console.log(`Toplam Suç Türü:                    ${offenseData.offenses.length}`);
console.log(`Basit Yargılamaya Uygun:            ${offenseData.offenses.filter(o => o.eligible_for_simple_trial).length}`);
console.log(`Basit Yargılamaya Uygun Olmayan:    ${offenseData.offenses.filter(o => !o.eligible_for_simple_trial).length}`);
console.log(`Seri Muhakeme Usulüne Tabi:         ${offenseData.offenses.filter(o => o.eligible_for_expedited_trial).length}`);
console.log(`Kategori Sayısı:                    ${[...new Set(offenseData.offenses.map(o => o.category))].length}\n`);

if (testsFailed === 0) {
    console.log(`${colors.green}✅ Tüm testler başarıyla geçti!${colors.reset}\n`);
    process.exit(0);
} else {
    console.log(`${colors.red}❌ ${testsFailed} test başarısız oldu.${colors.reset}\n`);
    process.exit(1);
}
