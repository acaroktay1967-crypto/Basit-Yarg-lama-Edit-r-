#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔨 Portable HTML dosyası oluşturuluyor...\n');

// Read the JSON data
const jsonData = fs.readFileSync(path.join(__dirname, 'suc_turleri_kutuphanesi.json'), 'utf8');

// Read the HTML template from suc_kutuphanesi_editor.html
const htmlTemplate = fs.readFileSync(path.join(__dirname, 'suc_kutuphanesi_editor.html'), 'utf8');

// Replace the fetch call with embedded data
const modifiedHtml = htmlTemplate.replace(
    /async function loadOffenseData\(\) \{[\s\S]*?try \{[\s\S]*?const response = await fetch\('suc_turleri_kutuphanesi\.json'\);[\s\S]*?offenseData = await response\.json\(\);/,
    `async function loadOffenseData() {
        try {
            // Embedded JSON data for portable version
            offenseData = ${jsonData};`
);

// Add portable version note in the title
const finalHtml = modifiedHtml.replace(
    '<title>Basit Yargılama Suç Türleri Kütüphanesi</title>',
    '<title>Basit Yargılama Suç Türleri Kütüphanesi - Portable</title>'
).replace(
    '<p>5271 sayılı Ceza Muhakemesi Kanunu Madde 251</p>',
    '<p>5271 sayılı Ceza Muhakemesi Kanunu - Portable Versiyon</p>'
);

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Write the portable HTML file
const outputPath = path.join(distDir, 'BasitYargilamaEditor-Portable.html');
fs.writeFileSync(outputPath, finalHtml, 'utf8');

console.log('✅ Portable HTML dosyası oluşturuldu!');
console.log(`📁 Dosya konumu: ${outputPath}`);
console.log(`📊 Dosya boyutu: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
console.log('\n🎉 İşlem tamamlandı!');
console.log('\n📖 Kullanım:');
console.log('   - dist/BasitYargilamaEditor-Portable.html dosyasını tarayıcıda açın');
console.log('   - İnternet bağlantısı gerekmez');
console.log('   - USB belleğe kopyalayıp taşınabilir\n');
