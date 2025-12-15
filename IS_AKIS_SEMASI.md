# İŞ AKIŞ ŞEMASI - Basit Yargılama Usulü
## Adım Adım Kılavuz

---

## 📋 GENEL PROSEDÜR

### ADIM 1: DOSYA KABUL VE DEĞERLENDİRME

**Yapılacaklar:**
1. Dosyayı incele
2. CMK 251 koşullarını kontrol et
3. Basit yargılama uygun mu değerlendir

**Kontrol Kriterleri:**
- [ ] Suçun cezasının alt sınırı 2 yıl veya daha az mı?
- [ ] Dosya karmaşık değil mi?
- [ ] Deliller yeterli mi?

**📚 Suç türlerini kontrol etmek için:** `SUC_TURLERI_KUTUPHANESI.md` dosyasına bakınız.

**Karar:**
- ✅ UYGUN → ADIM 2'ye geç
- ❌ UYGUN DEĞİL → Normal yargılama usulü uygula

---

### ADIM 2: TENSİP ZAPTI DÜZENLEME

**Kullanılacak Şablon:** 📄 `1_Tensip_Zapti_CMK251.md`

**Doldurulacak Bilgiler:**
- Mahkeme adı
- Esas numarası
- Sanık bilgileri (tam)
- Suç tanımı (TCK maddesi)
- Atılı fiil özeti

**Karar Metni:**
> "5271 sayılı CMK'nın 251. maddesi uyarınca dosyanın BASİT YARGILAMA USULÜ ile görülmesine karar verildi."

**Önemli:** Bu karar kesindir, aleyhine itiraz edilemez.

---

### ADIM 3: SANIKTAN SAVUNMA ALMA

**Yapılacaklar:**
1. Sanığa yazılı savunma isteme yazısı gönder
2. Katılan varsa yazılı görüşünü iste
3. Mağdur varsa (ihtiyari) görüşünü al

**Süre:** Makul süre ver (örn: 15 gün)

**Önemli:**
- ❌ DURUŞMA AÇMA
- ❌ SÖZLÜ SAVUNMA ALMA
- ✅ Yalnızca YAZILI belgeler al

---

### ADIM 4: DOSYA İNCELEME VE KARAR VERME

#### 4A. HAGB KOŞULLARINI KONTROL ET

**HAGB Koşulları (Hepsi birden gerekli):**

1. **Ceza sınırı:** Belirlenen ceza 2 yıl veya daha az ✓ / ✗

2. **Sabıka:** Sanık daha önce kasıtlı suçtan mahkum olmamış ✓ / ✗

3. **Kanaat:** Sanığın bir daha suç işlemeyeceği kanaati ✓ / ✗

4. **Mağdur rızası:** (Şahsa karşı suçlarda) Mağdur rızası var ✓ / ✗

**Sonuç:**
- **EVET (Tümü ✓)** → 4B'ye geç (HAGB kararı)
- **HAYIR (En az biri ✗)** → 4C'ye geç (Mahkumiyet kararı)

---

#### 4B. HAGB KARARI

**Kullanılacak Şablon:** 📄 `3_HAGB_Karar_Sablonu.md`

**Yapılacaklar:**
1. Temel cezayı belirle (TCK 86/__)
2. TCK 50 ile bireyselleştir
3. HAGB denetim süresini belirle (1, 3 veya 5 yıl)
4. Yükümlülükleri belirle:
   - Zorunlu: Kasıtlı suç işlememek
   - Seçimlik: Tazminat, kamu yararına ödeme, toplum hizmeti vb.

**Karar Özeti:**
> "CMK 231 uyarınca HÜKMÜN AÇIKLANMASININ GERİ BIRAKILMASINA, denetim süresinin __ YIL olmasına karar verildi."

**Sonuç:**
- Denetim süresi başarıyla geçerse → DAVA DÜŞER (sabıka oluşmaz)
- Yükümlülük ihlal edilirse → HÜKÜM AÇIKLANIR

**ADIM 5'e geç (Tebliğ)**

---

#### 4C. MAHKUMİYET KARARI (HAGB Yok)

**Kullanılacak Şablon:** 📄 `4_Mahkumiyet_Karar_Sablonu.md`

**veya TCK 86 için:** 📄 `2_Basit_Yargilama_Karar_Sablonu_TCK86.md`

**Yapılacaklar:**
1. HAGB koşullarının neden sağlanmadığını belirt
2. Temel cezayı belirle
3. TCK 50 ile bireyselleştir
4. TCK 51 erteleme koşullarını değerlendir:
   - Ceza ≤ 2 yıl
   - Kasıtlı suçtan mahkumiyet yok
   - Tekrar suç işlemez kanaati
5. TCK 52 seçenek yaptırımları değerlendir (ceza ≤ 1 yıl ise):
   - Adli para cezası
   - Ev hapsi
   - İnfaz

**Karar Özeti:**
> "Sanık TCK 86/__ uyarınca __ AY/YIL HAPİS CEZASI ile mahkum edilmiştir."

**ADIM 5'e geç (Tebliğ)**

---

### ADIM 5: TEBLİĞ

**Yapılacaklar:**
1. Kararı sanığa tebliğ et
2. Mağdur/katılana tebliğ et
3. Cumhuriyet Savcılığına bildir

**Önemli:** Tebliğ tarihini kaydet (İtiraz süresi başlangıcı)

**İtiraz süresi:** Tebliğden itibaren **7 GÜN**

---

### ADIM 6A: İTİRAZ YOKSA

**Sonuç:**
- Karar KESİNLEŞİR
- HAGB kararı ise denetim süresi başlar
- Mahkumiyet kararı ise infaz edilir

**İŞ BİTTİ** ✅

---

### ADIM 6B: İTİRAZ GELİRSE

**Kullanılacak Şablon:** 📄 `6_Itiraz_Inceleme_Karar.md`

#### ADIM 6B-1: İTİRAZI İNCELE

**Kontroller:**
1. İtiraz süresi içinde mi? (7 gün)
2. Usulüne uygun mu?
3. Gerekçeler ciddi mi?

#### ADIM 6B-2: DEĞERLENDİRME

**SEÇENEK 1: İtiraz Ciddi Değil**

Dosya üzerinden değerlendirme:
- İtiraz gerekçeleri yerinde değil
- Yeni bir durum yok
- Duruşma gerektirmez

**Karar:** İtirazın REDDİNE

**Sonuç:** 
- Karar KESİNLEŞİR
- İstinafa tabi DEĞİL

**İŞ BİTTİ** ✅

---

**SEÇENEK 2: İtiraz Ciddi**

**Kullanılacak Şablon:** 📄 `5_Itiraz_Uzerine_Durusma_Acilmasi.md`

İtiraz ciddi ve duruşma gerektiriyor:
- Yeni deliller var
- Tanık dinlenmesi gerekli
- Hukuki değerlendirme değişebilir
- Sanık sözlü savunma yapacak

**Karar:** DURUŞMA AÇILMASINA

**Yapılacaklar:**
1. Duruşma günü belirle
2. Sanığı çağır
3. Mağdur/katılanı çağır
4. Tanıkları çağır
5. C. Savcılığına bildir

**ÖNEMLİ:**
- ❌ Artık basit yargılama usulü UYGULANMAZ
- ✅ GENEL HÜKÜMLER çerçevesinde yargılama yapılır
- ✅ Duruşma sonrası verilen karar İSTİNAFA TABİDİR

---

### ADIM 7: DURUŞMA VE YENİ KARAR

**Duruşmada:**
1. Sanık dinle
2. Mağdur/katılan dinle
3. Tanıkları dinle
4. Delilleri incele
5. Tarafların sözlü savunmalarını al

**Yeni Karar:**
- Genel hükümler uyarınca karar ver
- Mahkumiyet / Beraat / HAGB

**Sonuç:**
- Bu karar **İSTİNAFA TABİ**dir
- İstinaf süresi: **2 HAFTA**

**İŞ BİTTİ** ✅

---

## 📊 KARAR AĞACI

```
DOSYA
  │
  ├─ CMK 251 uygun mu?
  │   ├─ EVET → TENSİP ZAPTI (1)
  │   └─ HAYIR → Normal yargılama
  │
  ├─ YAZILI SAVUNMA AL
  │
  ├─ HAGB koşulları var mı?
  │   ├─ EVET → HAGB KARARI (3)
  │   └─ HAYIR → MAHKUMİYET (4 veya 2)
  │
  ├─ TEBLİĞ (7 gün)
  │
  ├─ İtiraz var mı?
  │   ├─ HAYIR → KESİN ✅
  │   └─ EVET ↓
  │
  ├─ İtiraz ciddi mi? (6)
  │   ├─ HAYIR → RED (Kesin) ✅
  │   └─ EVET → DURUŞMA AÇ (5)
  │
  └─ DURUŞMA → YENİ KARAR (İstinafa tabi) ✅
```

---

## ⏱️ ZAMAN ÇİZELGESİ

| Gün | İşlem |
|-----|-------|
| **Gün 0** | Dosya gelişi |
| **Gün 1-2** | Tensip zaptı (CMK 251 kararı) |
| **Gün 3-17** | Yazılı savunma bekleme (15 gün süre) |
| **Gün 18-20** | Dosya inceleme ve karar verme |
| **Gün 21** | Tebliğ |
| **Gün 22-28** | İtiraz süresi (7 gün) |
| **Gün 29+** | Kesinleşme VEYA İtiraz inceleme |

**Toplam süre (itiraz yoksa):** Yaklaşık **1 ay**

**Normal yargılama:** Ortalama **6-12 ay**

---

## 🎯 BAŞARI KRİTERLERİ

### ✅ Doğru Uygulama

- [ ] CMK 251 koşulları doğru değerlendirildi
- [ ] Tensip zaptı düzenlendi
- [ ] Yazılı savunma alındı
- [ ] HAGB koşulları tam değerlendirildi
- [ ] TCK 50, 51, 52 uygulandı
- [ ] İtiraz hakkı bildirildi
- [ ] 7 günlük süre belirtildi
- [ ] Gerekçe tam yazıldı

### ❌ Yaygın Hatalar

- Duruşma açmak
- Sözlü savunma almak
- HAGB koşullarını atlamak
- İtiraz süresini yanlış belirtmek
- TCK 50 uygulamayı unutmak
- Gerekçe yazmamak

---

## 📞 HIZLI YARDIM

**Hangi şablonu kullanacağım?**

1. Dosya yeni geldi → `1_Tensip_Zapti_CMK251.md`
2. Karar vereceğim (HAGB var) → `3_HAGB_Karar_Sablonu.md`
3. Karar vereceğim (HAGB yok) → `4_Mahkumiyet_Karar_Sablonu.md`
4. TCK 86 için örnek → `2_Basit_Yargilama_Karar_Sablonu_TCK86.md`
5. İtiraz geldi → `6_Itiraz_Inceleme_Karar.md`
6. Duruşma açacağım → `5_Itiraz_Uzerine_Durusma_Acilmasi.md`

**Suç türlerini kontrol etmek için:** `SUC_TURLERI_KUTUPHANESI.md`

**Detaylı bilgi için:** `README.md` ve `HIZLI_BASVURU.md`

---

**Hazırlayan:** Basit Yargılama Çalışma Grubu  
**Tarih:** 2024  
**Versiyon:** 1.0
