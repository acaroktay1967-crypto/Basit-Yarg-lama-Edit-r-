# Basit Yargılama Usulü - Karar Şablonları ve Kullanım Kılavuzu

## 📋 Genel Bakış

Bu repository, **5271 sayılı Türk Ceza Muhakemesi Kanunu'nun 251. maddesi** uyarınca **Basit Yargılama Usulü**'nde kullanılacak karar şablonlarını içermektedir.

Basit yargılama usulü, **alt sınırı 2 yıl veya daha az hapis cezası** öngörülen suçlarda, dosya üzerinden (duruşma yapılmaksızın) karar verilmesini sağlayan hızlandırılmış yargılama usulüdür.

---

## 📚 İçindekiler

### 🆕 Suç Türleri Kütüphanesi
**Dosyalar:** 
- `suc_turleri_kutuphanesi.json` - Kapsamlı suç türleri veritabanı
- `suc_kutuphanesi_editor.html` - Görselleştirme ve düzenleme arayüzü
- `test_suc_kutuphanesi.js` - Otomatik test suite (Node.js)
- `test_suc_kutuphanesi.html` - Tarayıcı tabanlı test suite

**Özellikler:**
- 20+ suç türü detaylı veri yapısı ile tanımlanmıştır
- Her suç için TCK maddesi, kategori, ceza aralığı ve basit yargılama uygunluğu bilgisi
- Arama, filtreleme ve sınıflandırma özellikleri
- Kullanıcı dostu web arayüzü
- Kapsamlı otomatik testler

**Kullanım:**
1. `suc_kutuphanesi_editor.html` dosyasını bir tarayıcıda açın
2. Suç türlerini arayın, filtreleyin ve görüntüleyin
3. Testleri çalıştırmak için: `node test_suc_kutuphanesi.js`

---

### 🆕 CMK 250 - Seri Muhakeme Usulü Modülleri

Bu proje artık **CMK 250 - Seri Muhakeme Usulü** kapsamında kapsamlı modüller içermektedir.

#### 1. Seri Muhakeme Yargıtay Kararları Kütüphanesi

**Dosyalar:**
- `data/seri-muhakeme-yargitay-kararlari.json` - Örnek karar kayıtları
- `src/components/KararKutuphane.jsx` - Listeleme, filtreleme, detay görüntüleme
- `src/components/KararForm.jsx` - Yeni karar ekleme formu
- `tests/kararKutuphane.test.js` - Test suite

**Özellikler:**
- Yargıtay kararlarını listeleme ve arama
- Başlık, özet, suç, mahkeme, sonuç bilgileri
- Anahtar kelime bazlı arama
- Sonuç türüne göre filtreleme (Onanma, Bozma, Düzeltme)

#### 2. Seri Muhakemenin Uygulanamayacağı Haller

**Dosyalar:**
- `data/uygulanamaz-haller.json` - CMK 250/13 kapsamındaki haller
- `src/lib/rules/seriMuhakemeRules.ts` - Kontrol kuralları ve fonksiyonlar
- `src/components/UygunlukKontrol.jsx` - Uygunluk kontrol arayüzü
- `tests/uygulanamazHaller.test.js` - Test suite

**Kontrol edilen haller:**
- Adres bulunmaması/yurt dışında olma (CMK 250/13-a)
- Önödeme/uzlaştırma kapsamı (CMK 250/13-b)
- Mazeretsiz gelmeme (CMK 250/13-c)
- İştirak halinde kabul etmeme (CMK 250/13-ç)
- Birlikte işlenen kapsam dışı suç (CMK 250/13-d)
- Yaş küçüklüğü (CMK 250/13-e)
- Akıl hastalığı (CMK 250/13-f)
- Sağır ve dilsiz olma (CMK 250/13-g)

#### 3. Seri Muhakeme Suçları Listesi

**Dosyalar:**
- `data/seri-muhakeme-suclar.json` - CMK 250/1 kapsamındaki suçlar
- `src/lib/sucturleri/seriMuhakemeAdapter.ts` - Entegrasyon fonksiyonları
- `src/components/SucTurleri.jsx` - Suç türleri bileşeni (güncellenmiş)
- `tests/seriMuhakemeSuclar.test.js` - Test suite

**Özellikler:**
- 15+ seri muhakemeye tabi suç
- TCK madde bazlı arama
- Kategori filtreleme
- "Seri Muhakeme" etiketi/filtresi
- İstatistik görüntüleme

#### 4. Talepname Usulleri Validasyon

**Dosyalar:**
- `data/talepname-sablon.json` - Gerekli alanlar listesi
- `src/lib/validation/talepnameValidation.ts` - Validasyon modülü
- `src/components/TalepnameForm.jsx` - Form bileşeni
- `tests/talepnameValidation.test.js` - Test suite

**Validasyon kuralları:**
- Şüpheli ve müdafii bilgileri (zorunlu)
- Müdafi huzurunda kabul kontrolü (CMK 250/2)
- İsnat olunan suç ve madde
- Olay bilgileri (yer, tarih, zaman)
- Tutukluluk/gözaltı süreleri
- Belirlenen ceza/güvenlik tedbirleri
- HAGB/seçenek/erteleme bilgileri

#### 5. CMK 250 Örnek Mahkeme Hükümleri

**Dosyalar:**
- `data/cmk250-ornek-hukumler.json` - Örnek hükümler
- `src/components/HukumOrnekleri.jsx` - Görüntüleme bileşeni

**İçerik:**
- Kimlik bilgileri
- Suç tanımı
- Karar gerekçeleri
- Sonuç (mahkumiyet/HAGB)
- Ek notlar

---

### 1. Tensip Zaptı (Ön Karar)
**Dosya:** `1_Tensip_Zapti_CMK251.md`

Basit yargılama usulü ile yargılama yapılmasına karar verilmesini içeren ön karar.

**Ne zaman kullanılır:**
- Dosya ilk incelendiğinde
- Basit yargılama koşulları (CMK 251) sağlandığında
- Duruşma açılmadan önce

### 2. Basit Yargılama Karar Şablonu (TCK 86/2-3)
**Dosya:** `2_Basit_Yargilama_Karar_Sablonu_TCK86.md`

TCK 86/2 ve 86/3 (Tehdit suçu) için örnek mahkumiyet/beraat kararı.

**İçerik:**
- Temel ceza takdiri
- TCK 50 (Cezanın bireyselleştirilmesi)
- TCK 51 (Erteleme)
- TCK 52 (Seçenek yaptırımlar)

### 3. HAGB Karar Şablonu
**Dosya:** `3_HAGB_Karar_Sablonu.md`

Hükmün Açıklanmasının Geri Bırakılması (HAGB) kararı.

**Koşullar:**
- Ceza 2 yıl veya daha az
- Sanık daha önce kasıtlı suçtan mahkum olmamış
- Bir daha suç işlemeyeceği kanaati
- Mağdurun rızası (gerekirse)

### 4. Mahkumiyet Karar Şablonu
**Dosya:** `4_Mahkumiyet_Karar_Sablonu.md`

HAGB koşulları bulunmadığında kullanılacak mahkumiyet kararı.

**İçerik:**
- HAGB koşullarının neden sağlanmadığı
- Ceza tayini
- Erteleme/seçenek yaptırım uygulaması

### 5. İtiraz Üzerine Duruşma Açılması
**Dosya:** `5_Itiraz_Uzerine_Durusma_Acilmasi.md`

Basit yargılama kararına itiraz üzerine duruşma açılması kararı.

**CMK 251/5:** İtiraz üzerine genel hükümler çerçevesinde duruşma açılır.

### 6. İtiraz İnceleme ve Karar
**Dosya:** `6_Itiraz_Inceleme_Karar.md`

İtirazın dosya üzerinden incelenmesi ve ret/kabul kararı.

**İki seçenek:**
- Dosya üzerinden red (kesin)
- Duruşma açılması (istinafa tabi)

---

## 🔄 İş Akışı (Workflow)

```
┌─────────────────────────────────────────┐
│  1. DOSYA GELİŞİ                        │
│     (Soruşturma evrakı)                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  2. TENSİP ZAPTI                        │
│     (Basit yargılama kararı)            │
│     📄 1_Tensip_Zapti_CMK251.md         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  3. SANIKTAN YAZI İLE SAVUNMA ALMA      │
│     (Duruşma açılmaz)                   │
└──────────────┬──────────────────────────┘
               │
               ▼
        ┌──────┴──────┐
        │             │
        ▼             ▼
┌──────────────┐ ┌──────────────────────┐
│ 4a. HAGB     │ │ 4b. MAHKUMİYET      │
│ KOŞULLARI    │ │ (HAGB yok)          │
│ VAR          │ │                      │
└──────┬───────┘ └────────┬─────────────┘
       │                  │
       ▼                  ▼
┌──────────────┐ ┌──────────────────────┐
│ HAGB KARARI  │ │ MAHKUMİYET KARARI   │
│ 📄 3_HAGB    │ │ 📄 4_Mahkumiyet     │
└──────┬───────┘ └────────┬─────────────┘
       │                  │
       └────────┬─────────┘
                │
                ▼
       ┌────────────────┐
       │   TEBLİĞ       │
       │   (7 gün)      │
       └────────┬───────┘
                │
         ┌──────┴──────┐
         │             │
    İTİRAZ YOK    İTİRAZ VAR
         │             │
         ▼             ▼
    ┌─────────┐  ┌──────────────────────┐
    │ KESİN   │  │ 5. İTİRAZ İNCELEME   │
    │         │  │ 📄 6_Itiraz_Inceleme │
    └─────────┘  └──────┬───────────────┘
                        │
                 ┌──────┴──────┐
                 │             │
           DOSYA REDDİ    DURUŞMA AÇILMASI
                 │             │
                 ▼             ▼
           ┌─────────┐  ┌──────────────────┐
           │ KESİN   │  │ 6. DURUŞMA       │
           │         │  │ 📄 5_Itiraz      │
           └─────────┘  │    Durusma       │
                        └──────┬───────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │ YENİ KARAR   │
                        │ (İstinafa    │
                        │  tabi)       │
                        └──────────────┘
```

---

## 📖 Kullanım Kılavuzu

### Adım 1: Tensip Zaptı Düzenleme

Dosya geldiğinde ilk olarak basit yargılama koşullarını kontrol edin:

**CMK 251 Koşulları:**
1. ✅ Cezanın alt sınırı 2 yıl veya daha az mı?
2. ✅ Yeterli delil var mı?
3. ✅ Dosya karmaşık değil mi?

**Koşullar sağlanıyorsa:** `1_Tensip_Zapti_CMK251.md` şablonunu kullanın.

### Adım 2: Sanıktan Savunma Alma

- Sanığa yazılı savunma istenir
- Katılan varsa görüşü alınır
- Duruşma yapılmaz

### Adım 3: Karar Verme

**A. HAGB Koşulları Varsa:**
- Ceza 2 yıl veya daha az
- Sabıka yok
- Tekrar suç işlemeyeceği kanaati
- Mağdur rızası var (gerekirse)

👉 `3_HAGB_Karar_Sablonu.md` kullanın

**B. HAGB Koşulları Yoksa:**

👉 `4_Mahkumiyet_Karar_Sablonu.md` kullanın

**TCK 86 İçin Örnek:**

👉 `2_Basit_Yargilama_Karar_Sablonu_TCK86.md` kullanın

### Adım 4: İtiraz Süreci

**İtiraz gelirse:**

1. `6_Itiraz_Inceleme_Karar.md` ile dosya üzerinden inceleyin
   - Ciddi değilse: Dosya üzerinden reddedin (KESİN)
   - Ciddi ise: Duruşma açın

2. Duruşma açılırsa: `5_Itiraz_Uzerine_Durusma_Acilmasi.md` kullanın
   - Genel hükümler uygulanır
   - Taraflar dinlenir
   - Yeni karar verilir (istinafa tabi)

---

## ⚖️ Hukuki Çerçeve

### CMK 251 - Basit Yargılama Usulü

**Temel İlkeler:**
- Dosya üzerinden karar verilir
- Duruşma yapılmaz
- Sanıktan yazılı savunma alınır
- İtiraz süresi 7 gündür
- İtiraz üzerine genel hükümlere göre duruşma açılır

### TCK 50 - Cezanın Bireyselleştirilmesi

Ceza belirlenirken dikkate alınır:
- Failin kastı veya taksiri
- Hazırlık hareketleri
- İcra hareketleri ve sonuçları
- Kişisel ve ekonomik durum

### TCK 51 - Hapis Cezasının Ertelenmesi

**Koşullar:**
- Ceza 2 yıl veya daha az
- Daha önce kasıtlı suçtan mahkum olmama
- Tekrar suç işlemeyeceği kanaati

### CMK 231 - HAGB (Hükmün Açıklanmasının Geri Bırakılması)

**Koşullar:**
- Ceza 2 yıl veya daha az
- Sabıka yok
- Tekrar suç işlemeyeceği kanaati
- Mağdur rızası (gerekirse)

**Denetim süresi:** 1-3-5 yıl

**Sonuç:**
- Yükümlülükleri yerine getirirse → Dava düşer
- İhlal ederse → Hüküm açıklanır

---

## 📝 TCK 86 - Tehdit Suçu

### TCK 86/2
> Kişiyi, kendisinin veya yakınının **hayatına, vücut veya cinsel dokunulmazlığına** yönelik bir saldırı gerçekleştireceğinden bahisle tehdit eden kişi, **altı aydan iki yıla kadar hapis** cezası ile cezalandırılır.

### TCK 86/3
> Kişiyi, kendisinin veya yakınının **malvarlığına zarar** vereceğinden bahisle tehdit eden kişi, **altı aya kadar hapis veya adlî para** cezası ile cezalandırılır.

**Not:** Her iki suç da basit yargılama kapsamındadır (alt sınır 2 yılın altında).

---

## 🎯 Önemli Noktalar

### ✅ Basit Yargılama Avantajları

1. **Hızlı:** Duruşma yapılmadan karar verilir
2. **Ekonomik:** Yargılama masrafları düşük
3. **Etkili:** Dosya basitse yeterli

### ⚠️ Dikkat Edilecekler

1. **Tensip zaptı mutlaka düzenlenmeli**
2. **Sanıktan yazılı savunma alınmalı**
3. **HAGB koşulları dikkatlice değerlendirilmeli**
4. **İtiraz süresi 7 gün**
5. **İtiraz üzerine duruşma açılması gerekebilir**

### 🔍 İtiraz Süreci

**İtiraz edilirse:**
- Mahkeme dosya üzerinden inceler
- Ciddi bulursa → Duruşma açar
- Ciddi bulmassa → Reddeder (kesin)

**Duruşma açılırsa:**
- Basit yargılama sona erer
- Genel hükümler uygulanır
- Yeni karar istinafa tabidir

---

## 📁 Dosya Yapısı

```
Basit-Yargılama-Editör/
│
├── README.md (Bu dosya)
│
├── 📚 Karar Şablonları
│   ├── 1_Tensip_Zapti_CMK251.md
│   ├── 2_Basit_Yargilama_Karar_Sablonu_TCK86.md
│   ├── 3_HAGB_Karar_Sablonu.md
│   ├── 4_Mahkumiyet_Karar_Sablonu.md
│   ├── 5_Itiraz_Uzerine_Durusma_Acilmasi.md
│   └── 6_Itiraz_Inceleme_Karar.md
│
├── 🔍 Kılavuzlar
│   ├── HIZLI_BASVURU.md
│   └── IS_AKIS_SEMASI.md
│
└── 🗂️ Suç Türleri Kütüphanesi (YENİ)
    ├── suc_turleri_kutuphanesi.json - Veri tabanı
    ├── suc_kutuphanesi_editor.html - Görselleştirme arayüzü
    ├── test_suc_kutuphanesi.js - Node.js test suite
    └── test_suc_kutuphanesi.html - Tarayıcı test suite
```

---

## 🗂️ Suç Türleri Kütüphanesi - Detaylı Kullanım

### Kütüphane Genel Bakış

Basit yargılama usulüne tabi suç türlerini içeren kapsamlı bir veri tabanı ve yönetim sistemi. Bu kütüphane:

- **20+ suç türü** ile basit yargılama kapsamındaki ana suçları içerir
- **Yapılandırılmış JSON formatı** ile kolay entegrasyon sağlar
- **Web tabanlı arayüz** ile kullanıcı dostu erişim sunar
- **Otomatik testler** ile veri bütünlüğünü garanti eder

### Kütüphanedeki Suç Kategorileri

1. **Kişilere Karşı Suçlar** (En yaygın kategori)
   - Basit kasten yaralama (TCK 86/2, 86/3)
   - Taksirle yaralama (TCK 89/1)
   - Tehdit (TCK 106/1)
   - Cinsel taciz (TCK 105/1)
   - Hakaret (TCK 125/1)
   - Konut dokunulmazlığının ihlali (TCK 116/1-3)
   - Terk (TCK 97)
   - Ve daha fazlası...

2. **Malvarlığına Karşı Suçlar**
   - Mala zarar verme (TCK 151/1)
   - Hırsızlık - basit hal (TCK 141/1)
   - Güveni kötüye kullanma (TCK 155/1)

3. **Kamu Güvenliğine Karşı Suçlar**
   - Tehlikeli maddelerin terk edilmesi (TCK 177/1)
   - Kişiyi hürriyetinden yoksun kılma (TCK 109/1)

4. **Kamu İdaresine Karşı Suçlar**
   - Görevi yaptırmamak için direnme (TCK 265/1)

### Web Arayüzü Kullanımı

**Başlatma:**
```bash
# Tarayıcınızda açın:
suc_kutuphanesi_editor.html
```

**Özellikler:**
- 🔍 **Arama:** Suç ismi, TCK maddesi veya anahtar kelime ile arama
- 📊 **Filtreleme:** Kategori ve basit yargılama uygunluğuna göre filtreleme
- 📈 **İstatistikler:** Gerçek zamanlı istatistik görüntüleme
- 🎯 **Detaylı Bilgi:** Her suç için kapsamlı bilgi kartları
- ⚡ **Hızlı Erişim:** Responsive tasarım, tüm cihazlarda çalışır

### Veri Yapısı

Her suç türü aşağıdaki bilgileri içerir:

```json
{
  "id": 1,
  "category": "Kişilere Karşı Suçlar",
  "name": "Basit kasten yaralama suçu",
  "tck_article": "TCK m.86/2",
  "description": "Kasten yaralama suçunun basit hali",
  "penalty_min": "4 ay",
  "penalty_max": "1 yıl",
  "penalty_type": "Hapis",
  "eligible_for_simple_trial": true,
  "notes": "Alt sınır 2 yılın altında..."
}
```

### Test Suite Kullanımı

**Node.js ile Test:**
```bash
node test_suc_kutuphanesi.js
```

**Tarayıcı ile Test:**
```
test_suc_kutuphanesi.html dosyasını tarayıcıda açın
```

**Test Kategorileri:**
- ✅ Veri yapısı doğrulama
- ✅ Veri bütünlüğü kontrolü
- ✅ Suç türü validasyonu
- ✅ Arama ve filtreleme testleri
- ✅ İş mantığı testleri

### Entegrasyon Örnekleri

**JavaScript ile kullanım:**
```javascript
// JSON dosyasını yükle
fetch('suc_turleri_kutuphanesi.json')
  .then(response => response.json())
  .then(data => {
    // Basit yargılamaya uygun suçları bul
    const eligible = data.offenses.filter(
      o => o.eligible_for_simple_trial === true
    );
    console.log('Uygun suçlar:', eligible.length);
  });
```

**Node.js ile kullanım:**
```javascript
const fs = require('fs');
const data = JSON.parse(
  fs.readFileSync('suc_turleri_kutuphanesi.json', 'utf8')
);

// TCK maddesine göre suç ara
const offense = data.offenses.find(
  o => o.tck_article === 'TCK m.106/1'
);
console.log(offense.name); // "Tehdit suçu..."
```

---

## 💡 Uygulama Önerileri

### Dosya Hazırlık Kontrol Listesi

- [ ] Suçun alt sınırı 2 yıl veya daha az mı?
- [ ] Dosya karmaşık değil mi?
- [ ] Yeterli delil var mı?
- [ ] Sanıktan yazılı savunma alındı mı?
- [ ] Mağdur/katılan görüşü alındı mı?
- [ ] HAGB koşulları kontrol edildi mi?
- [ ] TCK 50 ve 51 değerlendirmesi yapıldı mı?
- [ ] İtiraz süresi doğru hesaplandı mı?

### Karar Kalite Kontrolü

- [ ] Tüm kişisel bilgiler dolduruldu mu?
- [ ] Hukuki gerekçe yeterli mi?
- [ ] Ceza hesaplaması doğru mu?
- [ ] İtiraz hakkı bilgisi var mı?
- [ ] Tarih ve imza alanları dolduruldu mu?

---

## 🚀 Kurulum ve Kullanım (CMK 250 Modülleri)

### Kurulum

```bash
# Bağımlılıkları yükleyin (ilk kez)
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Testleri çalıştırın
npm test
```

### TypeScript Modül Kullanımı

```typescript
import {
  seriMuhakemeUygunlukKontrol,
  validateTalepname,
  loadSeriMuhakemeSuclar,
} from './lib/index';

// Seri muhakeme uygunluk kontrolü
const sonuc = seriMuhakemeUygunlukKontrol(sucBilgisi, usulBilgisi, uygulanamayacakHaller);

// Talepname validasyonu
const validasyonSonucu = validateTalepname(talepnameData);

// Suçları yükle
const suclar = await loadSeriMuhakemeSuclar('/data/seri-muhakeme-suclar.json');
```

### React Bileşenlerini Kullanma

```jsx
import KararKutuphane from './components/KararKutuphane';
import UygunlukKontrol from './components/UygunlukKontrol';
import TalepnameForm from './components/TalepnameForm';
import SucTurleri from './components/SucTurleri';
import HukumOrnekleri from './components/HukumOrnekleri';

// Uygulamanızda kullanın
<KararKutuphane />
<UygunlukKontrol />
<TalepnameForm />
<SucTurleri />
<HukumOrnekleri />
```

### Veri Dosyaları

Tüm veri dosyaları `data/` dizininde JSON formatında saklanmaktadır:
- `data/seri-muhakeme-yargitay-kararlari.json`
- `data/uygulanamaz-haller.json`
- `data/seri-muhakeme-suclar.json`
- `data/talepname-sablon.json`
- `data/cmk250-ornek-hukumler.json`

---

## 📞 Yasal Dayanak

**Basit Yargılama:**
- 5271 Sayılı Ceza Muhakemesi Kanunu Madde 251
- 5237 Sayılı Türk Ceza Kanunu Madde 50, 51, 52, 86
- Yargıtay İçtihatları (basit yargılama ile ilgili)

**Seri Muhakeme:**
- 5271 Sayılı Ceza Muhakemesi Kanunu Madde 250
- 5237 Sayılı Türk Ceza Kanunu (ilgili maddeler)
- Yargıtay İçtihatları (seri muhakeme ile ilgili)

---

## ⚖️ Yasal Uyarı

Bu şablonlar, 5271 sayılı CMK'nın 251. maddesi kapsamında basit yargılama usulünde kullanılmak üzere hazırlanmış örnek şablonlardır. Her dosyanın kendine özgü koşulları ve özellikleri dikkate alınarak kullanılmalıdır.

Şablonlar, mevcut mevzuat ve Yargıtay içtihatlarına göre hazırlanmıştır. Ancak yasal düzenlemelerdeki değişiklikler takip edilmeli ve şablonlar güncellenmelidir.

---

## 📅 Versiyon

**Versiyon:** 2.0 (CMK 250 Modülleri Eklendi)  
**Tarih:** 2024-12-15  
**Düzenleyen:** Basit Yargılama Çalışma Grubu

**Değişiklikler:**
- ✅ CMK 250 Seri Muhakeme Usulü modülleri eklendi
- ✅ Yargıtay kararları kütüphanesi
- ✅ Uygulanamaz haller kontrol mekanizması
- ✅ Seri muhakeme suçları entegrasyonu
- ✅ Talepname validasyon modülü
- ✅ Örnek mahkeme hükümleri
- ✅ TypeScript ve React desteği
- ✅ Kapsamlı test suite

---

## 📋 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakınız.

---

**Not:** Şablonlar Türk hukuk sistemine göredir. Kullanımda dikkatli olunmalı ve her somut olayın özelliklerine göre gerekli değişiklikler yapılmalıdır.
