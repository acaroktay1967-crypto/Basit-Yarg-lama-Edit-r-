#!/usr/bin/env node

/**
 * Node.js Test Suite for Seri Muhakeme Usulü Yargıtay Kararları
 * Bu test dosyası seri_muhakeme_kararlari.json dosyasının doğruluğunu test eder
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

// Load decision data
const jsonPath = path.join(__dirname, 'seri_muhakeme_kararlari.json');
let decisionData;

try {
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    decisionData = JSON.parse(rawData);
    console.log(`${colors.cyan}📁 JSON dosyası başarıyla yüklendi${colors.reset}\n`);
} catch (error) {
    console.error(`${colors.red}Hata: JSON dosyası yüklenemedi - ${error.message}${colors.reset}`);
    process.exit(1);
}

// Run tests
console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.blue}🧪 SERİ MUHAKEME USULÜ KARARLAR TEST SÜRECİ${colors.reset}`);
console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

console.log(`${colors.yellow}📋 Veri Yapısı Testleri${colors.reset}`);
test('JSON dosyası geçerli yapıya sahip', () => {
    assert(typeof decisionData === 'object', 'Veri bir nesne olmalı');
});

test('Metadata bölümü mevcut ve geçerli', () => {
    assert('metadata' in decisionData, 'metadata bölümü eksik');
    assert('version' in decisionData.metadata, 'version bilgisi eksik');
    assert('description' in decisionData.metadata, 'description bilgisi eksik');
    assert('legal_basis' in decisionData.metadata, 'legal_basis bilgisi eksik');
    assert(decisionData.metadata.legal_basis.includes('7188'), 'Legal basis 7188 sayılı kanunu içermeli');
});

test('Decisions dizisi mevcut ve geçerli', () => {
    assert('decisions' in decisionData, 'decisions dizisi eksik');
    assert(Array.isArray(decisionData.decisions), 'decisions bir dizi olmalı');
    assert(decisionData.decisions.length > 0, 'decisions dizisi boş');
});

console.log(`\n${colors.yellow}🔍 Veri Bütünlüğü Testleri${colors.reset}`);
test('Tüm kararlarda gerekli alanlar mevcut', () => {
    const requiredFields = ['id', 'title', 'court', 'decision_number', 'date', 'category', 
                           'description', 'keywords', 'summary', 'legal_principle', 
                           'application_area', 'result'];
    
    decisionData.decisions.forEach((decision, index) => {
        requiredFields.forEach(field => {
            assert(field in decision, 
                `Karar #${index + 1} (${decision.title || 'İsimsiz'}) için '${field}' alanı eksik`);
        });
    });
});

test('ID değerleri benzersiz', () => {
    const ids = decisionData.decisions.map(d => d.id);
    const uniqueIds = new Set(ids);
    assertEquals(ids.length, uniqueIds.size, 'Tekrarlayan ID değerleri var');
});

test('Karar numaraları benzersiz', () => {
    const decisionNumbers = decisionData.decisions.map(d => d.decision_number);
    const uniqueNumbers = new Set(decisionNumbers);
    assertEquals(decisionNumbers.length, uniqueNumbers.size, 'Tekrarlayan karar numaraları var');
});

test('Tarih formatı geçerli (YYYY-MM-DD)', () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    decisionData.decisions.forEach(decision => {
        assert(dateRegex.test(decision.date), 
            `${decision.decision_number} için tarih formatı geçersiz: ${decision.date}`);
        
        // Verify it's a valid date
        const date = new Date(decision.date);
        assert(!isNaN(date.getTime()), 
            `${decision.decision_number} için geçersiz tarih: ${decision.date}`);
    });
});

test('Keywords dizisi geçerli', () => {
    decisionData.decisions.forEach(decision => {
        assert(Array.isArray(decision.keywords), 
            `${decision.decision_number} için keywords bir dizi olmalı`);
        assert(decision.keywords.length > 0, 
            `${decision.decision_number} için en az bir keyword olmalı`);
    });
});

console.log(`\n${colors.yellow}⚖️ Karar İçerik Doğrulama Testleri${colors.reset}`);
test('Problem statement\'ta belirtilen kararlar mevcut', () => {
    const requiredDecisions = [
        'Seri Muhakeme Usulünde İtiraz ve İtiraz Merciinin İnceleme Kapsamı',
        'Seri Muhakeme Usulünde Talepnamenin Mahkeme Huzurunda Reddi',
        'Davete İcabet Etmeyen Şüpheliye Seri Muhakeme Usulü Uygulanmaz',
        'Adreste Bulunmama Halinde Seri Muhakeme Usulü Uygulanmaz',
        'Seri Muhakeme Usulünde TCK m.62\'deki Takdiri İndirim Uygulanmaz'
    ];
    
    const titles = decisionData.decisions.map(d => d.title);
    
    requiredDecisions.forEach(required => {
        assert(titles.includes(required), 
            `Gerekli karar "${required}" kütüphanede bulunamadı`);
    });
});

test('En az 5 karar tanımlı', () => {
    assert(decisionData.decisions.length >= 5, 
        `En az 5 karar bekleniyor, ${decisionData.decisions.length} bulundu`);
});

test('Mahkeme isimleri "Yargıtay" içeriyor', () => {
    decisionData.decisions.forEach(decision => {
        assert(decision.court.includes('Yargıtay'), 
            `${decision.decision_number} için mahkeme ismi "Yargıtay" içermeli`);
    });
});

test('İtiraz incelemesi kararı doğru tanımlanmış', () => {
    const itirazDecision = decisionData.decisions.find(d => 
        d.title.includes('İtiraz ve İtiraz Merciinin İnceleme Kapsamı')
    );
    assert(itirazDecision !== undefined, 'İtiraz incelemesi kararı bulunamadı');
    assert(itirazDecision.category === 'İtiraz İncelemesi', 
        'İtiraz kararı kategorisi "İtiraz İncelemesi" olmalı');
    assert(itirazDecision.keywords.includes('itiraz'), 
        'İtiraz kararı "itiraz" keyword\'ünü içermeli');
});

test('TCK m.62 indirimi kararı doğru tanımlanmış', () => {
    const tck62Decision = decisionData.decisions.find(d => 
        d.title.includes('TCK m.62')
    );
    assert(tck62Decision !== undefined, 'TCK m.62 kararı bulunamadı');
    assert(tck62Decision.category === 'Ceza Belirlenmesi', 
        'TCK m.62 kararı kategorisi "Ceza Belirlenmesi" olmalı');
    assert(tck62Decision.court.includes('Ceza Genel Kurulu'), 
        'TCK m.62 kararı Ceza Genel Kurulu kararı olmalı');
});

console.log(`\n${colors.yellow}🎯 İş Mantığı Testleri${colors.reset}`);
test('Kategoriler tutarlı ve anlamlı', () => {
    const categories = [...new Set(decisionData.decisions.map(d => d.category))];
    assert(categories.length >= 2, 'En az 2 kategori olmalı');
    
    const validCategories = [
        'İtiraz İncelemesi',
        'Talepname Reddi',
        'Usul Şartları',
        'Ceza Belirlenmesi',
        'Diğer'
    ];
    
    categories.forEach(category => {
        assert(validCategories.includes(category), 
            `Geçersiz kategori: ${category}`);
    });
});

test('Tüm kararlarda özet ve hukuki ilke mevcut', () => {
    decisionData.decisions.forEach(decision => {
        assert(decision.summary && decision.summary.length > 20, 
            `${decision.decision_number} için özet eksik veya çok kısa`);
        assert(decision.legal_principle && decision.legal_principle.length > 20, 
            `${decision.decision_number} için hukuki ilke eksik veya çok kısa`);
    });
});

test('Açıklamalar yeterli detayda', () => {
    decisionData.decisions.forEach(decision => {
        assert(decision.description.length > 100, 
            `${decision.decision_number} için açıklama çok kısa (min 100 karakter)`);
    });
});

test('Uygulama alanı "Seri Muhakeme Usulü" içeriyor', () => {
    decisionData.decisions.forEach(decision => {
        assert(decision.application_area.includes('Seri Muhakeme'), 
            `${decision.decision_number} için uygulama alanı "Seri Muhakeme" içermeli`);
    });
});

test('Sonuç alanı dolu ve anlamlı', () => {
    decisionData.decisions.forEach(decision => {
        assert(decision.result && decision.result.length > 10, 
            `${decision.decision_number} için sonuç alanı eksik veya çok kısa`);
    });
});

test('Karar tarihleri makul aralıkta (2019-2024)', () => {
    decisionData.decisions.forEach(decision => {
        const year = new Date(decision.date).getFullYear();
        assert(year >= 2019 && year <= 2024, 
            `${decision.decision_number} için tarih makul aralıkta değil: ${year}`);
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

// Print statistics
console.log(`${colors.cyan}📈 Kütüphane İstatistikleri${colors.reset}`);
console.log(`Toplam Karar Sayısı:        ${decisionData.decisions.length}`);
console.log(`Kategori Sayısı:            ${[...new Set(decisionData.decisions.map(d => d.category))].length}`);

const categoryCounts = {};
decisionData.decisions.forEach(d => {
    categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
});

console.log(`\n${colors.cyan}Kategorilere Göre Dağılım:${colors.reset}`);
Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} karar`);
});

console.log();

if (testsFailed === 0) {
    console.log(`${colors.green}✅ Tüm testler başarıyla geçti!${colors.reset}\n`);
    process.exit(0);
} else {
    console.log(`${colors.red}❌ ${testsFailed} test başarısız oldu.${colors.reset}\n`);
    process.exit(1);
}
