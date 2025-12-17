# Basit Yargılama Editörü - Build Instructions

## 📦 Portable Uygulama

Bu proje iki farklı portable format sunar:

### 1. Portable HTML (Önerilen - Hemen Kullanıma Hazır)

**Özellikler:**
- ✅ Kurulum gerektirmez
- ✅ Tek dosya (35 KB)
- ✅ Tüm tarayıcılarda çalışır
- ✅ İnternet bağlantısı gerekmez
- ✅ USB belleğe kopyalayıp taşınabilir
- ✅ Windows, Mac, Linux uyumlu

**Build:**
```bash
npm install
npm run build
```

**Çıktı:**
- `dist/BasitYargilamaEditor-Portable.html`

**Kullanım:**
1. `dist/BasitYargilamaEditor-Portable.html` dosyasını çift tıklayın
2. Varsayılan tarayıcınızda açılır
3. İnternet bağlantısı olmadan kullanabilirsiniz

### 2. Electron Desktop Uygulaması (.exe)

**Not:** Windows .exe dosyası oluşturmak için Wine gerekir veya Windows sisteminde build yapılmalıdır.

**Linux/Mac'te build yapmak için:**
```bash
# Wine kurulumu gerekir
npm run build:exe
```

**Windows'ta build yapmak için:**
```bash
npm install
npm run build:portable
```

## 🚀 Geliştirme

### Gereksinimler
- Node.js (v20 veya üzeri)
- npm

### Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Portable HTML oluştur
npm run build

# Electron uygulamasını test et (geliştirme)
npm start

# Testleri çalıştır
npm test
```

## 📁 Dosya Yapısı

```
Basit-Yargılama-Editör/
├── dist/
│   └── BasitYargilamaEditor-Portable.html  (Build çıktısı)
├── suc_kutuphanesi_editor.html             (Kaynak HTML)
├── suc_turleri_kutuphanesi.json            (Suç veritabanı)
├── main.js                                 (Electron ana dosya)
├── build-portable.js                       (Portable build scripti)
├── package.json                            (Proje yapılandırması)
└── BUILD.md                                (Bu dosya)
```

## 🎯 Kullanım Senaryoları

### Senaryo 1: Hızlı Kullanım (Önerilen)
1. `npm run build` komutuyla portable HTML oluşturun
2. `dist/BasitYargilamaEditor-Portable.html` dosyasını USB belleğe kopyalayın
3. İstediğiniz bilgisayarda çift tıklayarak kullanın

### Senaryo 2: Desktop Uygulama
1. `npm start` ile Electron uygulamasını başlatın
2. Tam ekran desktop deneyimi

### Senaryo 3: Web Sunucu
1. `suc_kutuphanesi_editor.html` dosyasını web sunucunuza yükleyin
2. `suc_turleri_kutuphanesi.json` dosyasını aynı klasöre koyun
3. Tarayıcıdan erişin

## 📊 Özellikler

### Portable HTML Versiyonu
- **Dosya Boyutu:** ~35 KB
- **Bağımlılık:** Yok (sadece modern tarayıcı)
- **Platform:** Tüm işletim sistemleri
- **İnternet:** Gerekmiyor
- **33 Suç Türü:** Tümü embedded
- **Arama ve Filtreleme:** Tam özellikli
- **İstatistikler:** Real-time

### Suç Kütüphanesi
- **Toplam Suç:** 33
- **Basit Yargılama:** 16 suç
- **Seri Muhakeme:** 13 suç  
- **Kategoriler:** 5 farklı kategori

## ⚡ Hızlı Başlangıç

```bash
# Tek komutla kullanıma hazır hale getirin
npm install && npm run build

# Portable HTML dosyası hazır: dist/BasitYargilamaEditor-Portable.html
```

## 🔧 Teknik Detaylar

**Portable HTML Teknolojisi:**
- JSON verisi HTML'e gömülü
- Vanilla JavaScript (harici kütüphane yok)
- Modern CSS3 ile responsive tasarım
- localStorage kullanarak ayarlar (isteğe bağlı)

**Electron Uygulaması:**
- Framework: Electron 28
- Node.js entegrasyonu yok (güvenlik)
- Context isolation aktif
- Auto-hide menu bar

## 📝 Notlar

- Portable HTML versiyonu tüm özellikler içerir
- .exe build için Wine veya Windows sistemi gerekir
- Testler her build öncesi otomatik çalışır
- Portable dosya boyutu optimize edilmiştir

## 📞 Destek

Sorun bildirmek için GitHub Issues kullanın.

## ⚖️ Lisans

MIT License - Detaylar için LICENSE dosyasına bakınız.
