/**
 * Talepname Usulleri Kontrol Mekanizması
 * 
 * Bu modül, talepnamelerin (iddianame) yasal gereklilikleri karşılayıp karşılamadığını
 * kontrol eder ve eksik bilgiler hakkında kullanıcıyı bilgilendirir.
 */

class TalepnameKontrol {
    constructor() {
        // Talepnamede olması gereken zorunlu alanlar
        this.zorunluAlanlar = {
            supheliKimlik: {
                name: 'Şüphelinin Kimliği ve Müdafii',
                fields: {
                    adiSoyadi: 'Adı Soyadı',
                    tcKimlikNo: 'T.C. Kimlik No',
                    babaAdi: 'Baba Adı',
                    anaAdi: 'Ana Adı',
                    dogumTarihiYeri: 'Doğum Tarihi/Yeri',
                    nufusaKayitliYer: 'Nüfusa Kayıtlı Olduğu Yer',
                    mudafii: 'Müdafii Bilgileri'
                }
            },
            magdurKimlik: {
                name: 'Mağdur veya Suçtan Zarar Görenlerin Kimlik Bilgileri',
                fields: {
                    adiSoyadi: 'Adı Soyadı',
                    tcKimlikNo: 'T.C. Kimlik No (varsa)',
                    iletisimBilgileri: 'İletişim Bilgileri'
                }
            },
            isnatOlunanSuc: {
                name: 'İsnat Olunan Suç ve İlgili Kanun Maddeleri',
                fields: {
                    sucTanimi: 'Suç Tanımı',
                    tckMaddesi: 'İlgili TCK Maddesi',
                    digeMevzuat: 'Diğer İlgili Mevzuat (varsa)'
                }
            },
            sucunIslendigiYerZaman: {
                name: 'İsnat Edilen Suçun İşlendiği Yer, Tarih ve Zaman Dilimi',
                fields: {
                    yer: 'Suçun İşlendiği Yer',
                    tarih: 'Suçun İşlendiği Tarih',
                    zamanDilimi: 'Zaman Dilimi (saat bilgisi)'
                }
            },
            tutuklulukDurumu: {
                name: 'Şüphelinin Tutuklu Olup Olmadığı, Gözaltı ve Tutuklama Tarihleri',
                fields: {
                    tutuklumu: 'Tutuklu mu? (Evet/Hayır)',
                    gozaltiTarihi: 'Gözaltı Tarihi (varsa)',
                    tutuklamaTarihi: 'Tutuklama Tarihi (varsa)',
                    gozaltiSuresi: 'Gözaltı Süresi (varsa)',
                    tutuklamaSuresi: 'Tutuklama Süresi (varsa)'
                }
            },
            olayinOzeti: {
                name: 'Olayların Özeti',
                fields: {
                    ozetMetin: 'Olayın detaylı özeti'
                }
            },
            teklifEdilenUsul: {
                name: 'Şüpheliye Teklif Edilen Usul ve Kabul Bilgileri',
                fields: {
                    teklifEdilenUsul: 'Teklif Edilen Usul (ör: Basit Yargılama)',
                    mudafiiHuzurundamiTeklif: 'Müdafii Huzurunda Teklif Edildi mi?',
                    teklifKabulEdildiMi: 'Teklif Kabul Edildi mi?',
                    teklifTarihi: 'Teklif Tarihi',
                    beyanMetni: 'Şüphelinin Beyanı'
                }
            },
            cezaVeTedbirler: {
                name: 'Belirlenen Ceza ve/veya Güvenlik Tedbirleri',
                fields: {
                    temelCeza: 'Temel Ceza',
                    cezaAltSinir: 'Ceza Alt Sınırı',
                    cezaUstSinir: 'Ceza Üst Sınırı',
                    guvenlikTedbirleri: 'Güvenlik Tedbirleri (varsa)',
                    aciklama: 'Ceza ve Tedbirlere İlişkin Açıklamalar'
                }
            }
        };

        this.validasyonSonuclari = [];
        this.eksikAlanlar = [];
        this.uyarilar = [];
    }

    /**
     * Talepname verilerini kontrol eder
     * @param {Object} talepnameVerisi - Kontrol edilecek talepname verisi
     * @returns {Object} Validasyon sonucu
     */
    kontrolEt(talepnameVerisi) {
        this.validasyonSonuclari = [];
        this.eksikAlanlar = [];
        this.uyarilar = [];

        // Her zorunlu alan grubunu kontrol et
        for (const [alanKodu, alanBilgisi] of Object.entries(this.zorunluAlanlar)) {
            this.alanGrubunuKontrolEt(alanKodu, alanBilgisi, talepnameVerisi);
        }

        // Genel sonucu hesapla
        const tamMi = this.eksikAlanlar.length === 0;
        const tamamlanmaOrani = this.tamamlanmaOraniHesapla();

        return {
            basarili: tamMi,
            tamamlanmaOrani: tamamlanmaOrani,
            eksikAlanlar: this.eksikAlanlar,
            uyarilar: this.uyarilar,
            detaylar: this.validasyonSonuclari,
            mesaj: tamMi 
                ? 'Talepname tüm zorunlu alanları içermektedir.' 
                : `Talepnamede ${this.eksikAlanlar.length} eksik alan bulunmaktadır.`
        };
    }

    /**
     * Bir alan grubunu kontrol eder
     */
    alanGrubunuKontrolEt(alanKodu, alanBilgisi, talepnameVerisi) {
        const grupSonuc = {
            alan: alanBilgisi.name,
            alanKodu: alanKodu,
            tamamlandiMi: true,
            eksikAlanlar: []
        };

        const veriGrubu = talepnameVerisi[alanKodu] || {};

        // Her bir alt alanı kontrol et
        for (const [fieldKey, fieldName] of Object.entries(alanBilgisi.fields)) {
            const deger = veriGrubu[fieldKey];
            
            if (!this.alanDoluMu(deger)) {
                grupSonuc.tamamlandiMi = false;
                grupSonuc.eksikAlanlar.push(fieldName);
                this.eksikAlanlar.push({
                    grup: alanBilgisi.name,
                    alan: fieldName,
                    alanKodu: alanKodu,
                    fieldKey: fieldKey
                });
            }
        }

        this.validasyonSonuclari.push(grupSonuc);

        // Özel kontroller
        this.ozelKontrollerYap(alanKodu, veriGrubu);
    }

    /**
     * Alanın dolu olup olmadığını kontrol eder
     */
    alanDoluMu(deger) {
        if (deger === null || deger === undefined) {
            return false;
        }
        if (typeof deger === 'string') {
            return deger.trim().length > 0;
        }
        if (typeof deger === 'boolean') {
            return true; // Boolean değerler her zaman dolu kabul edilir
        }
        return true;
    }

    /**
     * Özel kontroller yapar (iş kuralları)
     */
    ozelKontrollerYap(alanKodu, veriGrubu) {
        // Tutukluluk durumu kontrolü
        if (alanKodu === 'tutuklulukDurumu') {
            if (veriGrubu.tutuklumu === 'Evet' || veriGrubu.tutuklumu === true) {
                if (!this.alanDoluMu(veriGrubu.tutuklamaTarihi)) {
                    this.uyarilar.push({
                        tip: 'uyari',
                        mesaj: 'Şüpheli tutuklu olduğu belirtilmiş ancak tutuklama tarihi girilmemiş.'
                    });
                }
            }
        }

        // Suç tanımı kontrolü
        if (alanKodu === 'isnatOlunanSuc') {
            if (this.alanDoluMu(veriGrubu.tckMaddesi)) {
                const madde = veriGrubu.tckMaddesi;
                // TCK maddesi formatını kontrol et
                if (!madde.includes('TCK') && !madde.includes('m.')) {
                    this.uyarilar.push({
                        tip: 'format',
                        mesaj: 'TCK maddesi standart formatta olmayabilir. Örnek: "TCK m.106/1"'
                    });
                }
            }
        }

        // Olayın özeti uzunluk kontrolü
        if (alanKodu === 'olayinOzeti') {
            if (this.alanDoluMu(veriGrubu.ozetMetin)) {
                const uzunluk = veriGrubu.ozetMetin.length;
                if (uzunluk < 50) {
                    this.uyarilar.push({
                        tip: 'kalite',
                        mesaj: 'Olayların özeti çok kısa görünüyor. Daha detaylı açıklama yapılması önerilir.'
                    });
                }
            }
        }

        // Müdafii huzurunda teklif kontrolü
        if (alanKodu === 'teklifEdilenUsul') {
            if (veriGrubu.mudafiiHuzurundamiTeklif === 'Hayır' || veriGrubu.mudafiiHuzurundamiTeklif === false) {
                this.uyarilar.push({
                    tip: 'hukuki',
                    mesaj: 'Usul teklifi müdafii huzurunda yapılmamış. Yasal gereklilik kontrol edilmelidir.'
                });
            }
        }
    }

    /**
     * Tamamlanma oranını hesaplar
     */
    tamamlanmaOraniHesapla() {
        const toplamAlanSayisi = this.toplamAlanSayisiHesapla();
        const doluAlanSayisi = toplamAlanSayisi - this.eksikAlanlar.length;
        const oran = (doluAlanSayisi / toplamAlanSayisi) * 100;
        return Math.round(oran * 10) / 10; // 1 ondalık basamak
    }

    /**
     * Toplam alan sayısını hesaplar
     */
    toplamAlanSayisiHesapla() {
        let toplam = 0;
        for (const alanBilgisi of Object.values(this.zorunluAlanlar)) {
            toplam += Object.keys(alanBilgisi.fields).length;
        }
        return toplam;
    }

    /**
     * Zorunlu alanların listesini döndürür
     */
    zorunluAlanlariGetir() {
        return this.zorunluAlanlar;
    }

    /**
     * Validasyon raporu oluşturur (HTML formatında)
     */
    raporOlustur(validasyonSonucu) {
        let html = '<div class="validasyon-raporu">';
        
        html += `<div class="ozet ${validasyonSonucu.basarili ? 'basarili' : 'hatali'}">`;
        html += `<h3>${validasyonSonucu.mesaj}</h3>`;
        html += `<p>Tamamlanma Oranı: <strong>${validasyonSonucu.tamamlanmaOrani}%</strong></p>`;
        html += '</div>';

        // Eksik alanlar
        if (validasyonSonucu.eksikAlanlar.length > 0) {
            html += '<div class="eksik-alanlar">';
            html += '<h4>❌ Eksik Alanlar:</h4>';
            html += '<ul>';
            for (const eksik of validasyonSonucu.eksikAlanlar) {
                html += `<li><strong>${eksik.grup}:</strong> ${eksik.alan}</li>`;
            }
            html += '</ul>';
            html += '</div>';
        }

        // Uyarılar
        if (validasyonSonucu.uyarilar.length > 0) {
            html += '<div class="uyarilar">';
            html += '<h4>⚠️ Uyarılar:</h4>';
            html += '<ul>';
            for (const uyari of validasyonSonucu.uyarilar) {
                html += `<li><span class="tip-${uyari.tip}">${uyari.tip.toUpperCase()}:</span> ${uyari.mesaj}</li>`;
            }
            html += '</ul>';
            html += '</div>';
        }

        // Detaylı durum
        html += '<div class="detaylar">';
        html += '<h4>📋 Detaylı Durum:</h4>';
        html += '<ul class="grup-listesi">';
        for (const detay of validasyonSonucu.detaylar) {
            const ikon = detay.tamamlandiMi ? '✅' : '❌';
            html += `<li>`;
            html += `<strong>${ikon} ${detay.alan}</strong>`;
            if (!detay.tamamlandiMi && detay.eksikAlanlar.length > 0) {
                html += ` <span class="eksik-sayisi">(${detay.eksikAlanlar.length} eksik)</span>`;
            }
            html += `</li>`;
        }
        html += '</ul>';
        html += '</div>';

        html += '</div>';
        return html;
    }

    /**
     * Konsol için rapor oluşturur
     */
    konsolRaporuOlustur(validasyonSonucu) {
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 TALEPNAME KONTROL RAPORU');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        console.log(`Durum: ${validasyonSonucu.basarili ? '✅ BAŞARILI' : '❌ EKSİKLİKLER VAR'}`);
        console.log(`Mesaj: ${validasyonSonucu.mesaj}`);
        console.log(`Tamamlanma Oranı: ${validasyonSonucu.tamamlanmaOrani}%\n`);

        if (validasyonSonucu.eksikAlanlar.length > 0) {
            console.log('❌ Eksik Alanlar:');
            for (const eksik of validasyonSonucu.eksikAlanlar) {
                console.log(`   - ${eksik.grup}: ${eksik.alan}`);
            }
            console.log('');
        }

        if (validasyonSonucu.uyarilar.length > 0) {
            console.log('⚠️  Uyarılar:');
            for (const uyari of validasyonSonucu.uyarilar) {
                console.log(`   - [${uyari.tip.toUpperCase()}] ${uyari.mesaj}`);
            }
            console.log('');
        }

        console.log('📊 Detaylı Durum:');
        for (const detay of validasyonSonucu.detaylar) {
            const ikon = detay.tamamlandiMi ? '✅' : '❌';
            console.log(`   ${ikon} ${detay.alan}`);
        }
        
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }
}

// Node.js için export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TalepnameKontrol;
}
