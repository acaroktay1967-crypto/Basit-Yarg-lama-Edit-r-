/**
 * Seri Muhakeme Usulü Kontrol Modülü
 * Bu modül, suç türlerinin seri muhakeme usulüne uygunluğunu kontrol eder
 */

class SeriMuhakemeKontrol {
    constructor(kurallarData = null, sucKutuphanesiData = null) {
        this.kurallar = kurallarData;
        this.sucKutuphanesi = sucKutuphanesiData;
    }

    /**
     * Kuralları ve suç kütüphanesini yükler (tarayıcı için)
     */
    async yukle() {
        try {
            // Seri muhakeme kurallarını yükle
            const kurallarResponse = await fetch('seri_muhakeme_kurallar.json');
            this.kurallar = await kurallarResponse.json();

            // Suç kütüphanesini yükle
            const sucResponse = await fetch('suc_turleri_kutuphanesi.json');
            this.sucKutuphanesi = await sucResponse.json();

            return true;
        } catch (error) {
            console.error('Veriler yüklenirken hata:', error);
            return false;
        }
    }

    /**
     * Suç türünün seri muhakeme usulüne uygun olup olmadığını kontrol eder
     * @param {Object} params - Kontrol parametreleri
     * @returns {Object} Sonuç objesi
     */
    kontrolEt(params) {
        const {
            sucTuru,          // Suç türü (TCK maddesi veya ID)
            yasKucuklugu,     // true/false
            akilHastaligi,    // true/false
            sagirDilsiz,      // true/false
            yurtDisi,         // true/false
            adreseBulunamama, // true/false
            istirakVar,       // true/false
            istirakKabulYok,  // true/false (iştirak halinde biri kabul etmedi mi?)
            mahkemeyeGelmedi, // true/false
            onodemeKapsaminda,// true/false
            uzlastirmaKapsaminda, // true/false
            karmaSucVar       // true/false (seri muhakeme kapsamında olmayan başka suç var mı?)
        } = params;

        const sonuc = {
            uygun: true,
            nedenler: [],
            uyarilar: [],
            sucBilgisi: null
        };

        // 1. Suç türünü bul
        const suc = this.sucBul(sucTuru);
        if (!suc) {
            sonuc.uygun = false;
            sonuc.nedenler.push('Belirtilen suç türü kütüphanede bulunamadı');
            return sonuc;
        }
        sonuc.sucBilgisi = suc;

        // 2. Suçun seri muhakeme kapsamında olup olmadığını kontrol et
        if (!suc.seri_muhakeme_uygun) {
            sonuc.uygun = false;
            sonuc.nedenler.push('Bu suç türü Seri Muhakeme Usulü kapsamında değildir.');
            return sonuc;
        }

        // 3. Ehliyet engellerini kontrol et
        if (yasKucuklugu || akilHastaligi || sagirDilsiz) {
            sonuc.uygun = false;
            if (yasKucuklugu) sonuc.nedenler.push('Yaş küçüklüğü nedeniyle seri muhakeme uygulanamaz');
            if (akilHastaligi) sonuc.nedenler.push('Akıl hastalığı nedeniyle seri muhakeme uygulanamaz');
            if (sagirDilsiz) sonuc.nedenler.push('Sağır ve dilsizlik hali nedeniyle seri muhakeme uygulanamaz');
        }

        // 4. Şüpheliye ulaşılamama durumunu kontrol et
        if (yurtDisi || adreseBulunamama) {
            sonuc.uygun = false;
            sonuc.nedenler.push('Şüpheliye ulaşılamadığı için seri muhakeme uygulanamaz');
        }

        // 5. Önödeme ve uzlaştırma kontrolü
        if (onodemeKapsaminda || uzlastirmaKapsaminda) {
            sonuc.uygun = false;
            sonuc.nedenler.push('Önödeme ve uzlaştırma kapsamındaki suçlarda seri muhakeme uygulanamaz');
        }

        // 6. Mahkemeye gelmeme kontrolü
        if (mahkemeyeGelmedi) {
            sonuc.uygun = false;
            sonuc.nedenler.push('Şüphelinin mazeretsiz olarak mahkemeye gelmemesi nedeniyle seri muhakeme uygulanamaz');
        }

        // 7. İştirak hali kontrolü
        if (istirakVar && istirakKabulYok) {
            sonuc.uygun = false;
            sonuc.nedenler.push('Suçun iştirak halinde işlenmesi ve şüphelilerden birinin seri muhakemeyi kabul etmemesi nedeniyle uygulanamaz');
        }

        // 8. Karma suç kontrolü
        if (karmaSucVar) {
            sonuc.uygun = false;
            sonuc.nedenler.push('Seri muhakeme kapsamında olmayan başka bir suçla birlikte işlendiği için uygulanamaz');
        }

        // 9. Uyarılar ekle
        if (sonuc.uygun) {
            sonuc.uyarilar.push('Şüpheli ve müdafii huzurunda teklif edilmelidir');
            sonuc.uyarilar.push('Kabul halinde ceza yarısı oranında indirilir');
            sonuc.uyarilar.push('Verilen hüküm kesindir, istinaf yoluna başvurulamaz');
        }

        return sonuc;
    }

    /**
     * Suç türünü TCK maddesi veya ID ile bulur
     */
    sucBul(sucTuru) {
        if (!this.sucKutuphanesi || !this.sucKutuphanesi.offenses) {
            return null;
        }

        // ID ile arama
        if (typeof sucTuru === 'number') {
            return this.sucKutuphanesi.offenses.find(s => s.id === sucTuru);
        }

        // TCK maddesi ile arama
        if (typeof sucTuru === 'string') {
            return this.sucKutuphanesi.offenses.find(s => 
                s.tck_article.toLowerCase() === sucTuru.toLowerCase()
            );
        }

        return null;
    }

    /**
     * Tüm kuralları getirir
     */
    getKurallar() {
        return this.kurallar;
    }

    /**
     * Seri muhakemeye uygun tüm suçları listeler
     */
    uygunSuclariGetir() {
        if (!this.sucKutuphanesi) {
            return [];
        }

        return this.sucKutuphanesi.offenses.filter(s => s.seri_muhakeme_uygun === true);
    }

    /**
     * İstatistik bilgilerini döndürür
     */
    istatistikler() {
        if (!this.sucKutuphanesi) {
            return null;
        }

        const toplamSuc = this.sucKutuphanesi.offenses.length;
        const seriMuhakemeUygun = this.sucKutuphanesi.offenses.filter(s => s.seri_muhakeme_uygun).length;

        return {
            toplam_suc: toplamSuc,
            seri_muhakeme_uygun: seriMuhakemeUygun,
            seri_muhakeme_uygun_olmayan: toplamSuc - seriMuhakemeUygun,
            oran: ((seriMuhakemeUygun / toplamSuc) * 100).toFixed(1) + '%'
        };
    }
}

// Node.js için export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SeriMuhakemeKontrol;
}
