/**
 * Seri Muhakeme Kuralları ve Değerlendirme Fonksiyonları
 * CMK 250/13 - Seri Muhakemenin Uygulanamayacağı Haller
 */

export interface UygulanamayacakHal {
  id: number;
  kod: string;
  baslik: string;
  aciklama: string;
  yasal_dayanak: string;
  kontrol_kriterleri: string[];
  oncelik: number;
}

export interface KontrolSonucu {
  uygulanabilir: boolean;
  engel_haller: UygulanamayacakHal[];
  uyari_mesajlari: string[];
}

export interface SucBilgisi {
  suc_adi: string;
  tck_madde: string;
  seri_muhakeme_uygun: boolean;
}

export interface UsulBilgisi {
  adres_bulundu_mu: boolean;
  yurt_disinda_mi: boolean;
  sikayete_bagli_mi: boolean;
  onodeme_kapsaminda_mi: boolean;
  uzlastirma_kapsaminda_mi: boolean;
  uzlastirma_yapildi_mi: boolean;
  uzlastirma_sonuclu_mu: boolean;
  cagri_yapildi_mi: boolean;
  suspehli_geldi_mi: boolean;
  mazeret_bildirdi_mi: boolean;
  savunma_verdi_mi: boolean;
  istirak_var_mi: boolean;
  diger_suspehli_kabul_etti_mi: boolean;
  birlikte_diger_suc_var_mi: boolean;
  diger_suc_seri_muhakeme_kapsaminda_mi: boolean;
  suspehli_yasi: number;
  akil_hastasi_mi: boolean;
  sagir_dilsiz_mi: boolean;
}

/**
 * Seri muhakeme uygunluğunu kontrol eder
 */
export function seriMuhakemeUygunlukKontrol(
  sucBilgisi: SucBilgisi,
  usulBilgisi: UsulBilgisi,
  uygulanamayacakHaller: UygulanamayacakHal[]
): KontrolSonucu {
  const engelHaller: UygulanamayacakHal[] = [];
  const uyariMesajlari: string[] = [];

  // Suç seri muhakeme kapsamında mı kontrol et
  if (!sucBilgisi.seri_muhakeme_uygun) {
    uyariMesajlari.push(
      `${sucBilgisi.suc_adi} (${sucBilgisi.tck_madde}) seri muhakeme kapsamında değildir.`
    );
    return {
      uygulanabilir: false,
      engel_haller: engelHaller,
      uyari_mesajlari: uyariMesajlari,
    };
  }

  // CMK 250/13-a: Adres bulunmaması veya yurt dışında olma
  if (!usulBilgisi.adres_bulundu_mu || usulBilgisi.yurt_disinda_mi) {
    const hal = uygulanamayacakHaller.find((h) => h.kod === 'ADRES_BULUNMAMA');
    if (hal) {
      engelHaller.push(hal);
      uyariMesajlari.push(
        'Şüphelinin adresinin bulunamaması veya yurt dışında olması nedeniyle seri muhakeme uygulanamaz (CMK 250/13-a).'
      );
    }
  }

  // CMK 250/13-b: Önödeme veya uzlaştırma kapsamı
  if (usulBilgisi.sikayete_bagli_mi) {
    if (usulBilgisi.onodeme_kapsaminda_mi) {
      const hal = uygulanamayacakHaller.find((h) => h.kod === 'ONODEME_UZLASTIRMA');
      if (hal) {
        engelHaller.push(hal);
        uyariMesajlari.push(
          'Suç önödeme kapsamında olduğundan seri muhakeme uygulanamaz (CMK 250/13-b).'
        );
      }
    }

    if (usulBilgisi.uzlastirma_kapsaminda_mi) {
      if (!usulBilgisi.uzlastirma_yapildi_mi) {
        const hal = uygulanamayacakHaller.find((h) => h.kod === 'ONODEME_UZLASTIRMA');
        if (hal) {
          engelHaller.push(hal);
          uyariMesajlari.push(
            'Uzlaştırma kapsamındaki suçlarda önce uzlaştırma yapılmalıdır (CMK 250/13-b).'
          );
        }
      } else if (usulBilgisi.uzlastirma_sonuclu_mu) {
        uyariMesajlari.push(
          'Uzlaştırma başarılı olduğundan seri muhakemeye gerek yoktur.'
        );
        return {
          uygulanabilir: false,
          engel_haller: engelHaller,
          uyari_mesajlari: uyariMesajlari,
        };
      }
    }
  }

  // CMK 250/13-c: Mazeretsiz gelmeme veya savunma vermeme
  if (usulBilgisi.cagri_yapildi_mi) {
    if (!usulBilgisi.suspehli_geldi_mi && !usulBilgisi.mazeret_bildirdi_mi) {
      const hal = uygulanamayacakHaller.find((h) => h.kod === 'MAZERETSIZ_GELMEME');
      if (hal) {
        engelHaller.push(hal);
        uyariMesajlari.push(
          'Şüphelinin mazereti olmaksızın çağrıya gelmemesi nedeniyle seri muhakeme uygulanamaz (CMK 250/13-c).'
        );
      }
    } else if (usulBilgisi.suspehli_geldi_mi && !usulBilgisi.savunma_verdi_mi) {
      const hal = uygulanamayacakHaller.find((h) => h.kod === 'MAZERETSIZ_GELMEME');
      if (hal) {
        engelHaller.push(hal);
        uyariMesajlari.push(
          'Şüphelinin savunma vermemesi nedeniyle seri muhakeme uygulanamaz (CMK 250/13-c).'
        );
      }
    }
  }

  // CMK 250/13-ç: İştirak halinde kabul etmeme
  if (usulBilgisi.istirak_var_mi && !usulBilgisi.diger_suspehli_kabul_etti_mi) {
    const hal = uygulanamayacakHaller.find((h) => h.kod === 'ISTIRAK_KABUL_ETMEME');
    if (hal) {
      engelHaller.push(hal);
      uyariMesajlari.push(
        'Suça iştirak eden diğer şüphelilerin teklifi kabul etmemesi nedeniyle seri muhakeme uygulanamaz (CMK 250/13-ç).'
      );
    }
  }

  // CMK 250/13-d: Birlikte işlenen kapsam dışı suç
  if (usulBilgisi.birlikte_diger_suc_var_mi) {
    if (!usulBilgisi.diger_suc_seri_muhakeme_kapsaminda_mi) {
      const hal = uygulanamayacakHaller.find((h) => h.kod === 'BIRLIKTE_KAPSAM_DISI');
      if (hal) {
        engelHaller.push(hal);
        uyariMesajlari.push(
          'Şüphelinin birlikte işlediği seri muhakeme kapsamı dışındaki başka bir suçtan da soruşturulması nedeniyle seri muhakeme uygulanamaz (CMK 250/13-d).'
        );
      }
    }
  }

  // CMK 250/13-e: Yaş küçüklüğü
  if (usulBilgisi.suspehli_yasi < 12) {
    const hal = uygulanamayacakHaller.find((h) => h.kod === 'YAS_KUCUKLUGU');
    if (hal) {
      engelHaller.push(hal);
      uyariMesajlari.push(
        'Şüphelinin on iki yaşını doldurmamış olması nedeniyle seri muhakeme uygulanamaz (CMK 250/13-e).'
      );
    }
  }

  // CMK 250/13-f: Akıl hastalığı
  if (usulBilgisi.akil_hastasi_mi) {
    const hal = uygulanamayacakHaller.find((h) => h.kod === 'AKIL_HASTALIGI');
    if (hal) {
      engelHaller.push(hal);
      uyariMesajlari.push(
        'Şüphelinin akıl hastası olması nedeniyle seri muhakeme uygulanamaz (CMK 250/13-f).'
      );
    }
  }

  // CMK 250/13-g: Sağır ve dilsiz olma
  if (usulBilgisi.sagir_dilsiz_mi) {
    const hal = uygulanamayacakHaller.find((h) => h.kod === 'SAGIR_DILSIZ');
    if (hal) {
      engelHaller.push(hal);
      uyariMesajlari.push(
        'Şüphelinin sağır ve dilsiz olması nedeniyle seri muhakeme uygulanamaz (CMK 250/13-g).'
      );
    }
  }

  const uygulanabilir = engelHaller.length === 0 && uyariMesajlari.length === 0;

  return {
    uygulanabilir,
    engel_haller: engelHaller,
    uyari_mesajlari: uyariMesajlari,
  };
}

/**
 * Basit bir uygunluk kontrolü (sadece suç bilgisine göre)
 */
export function basitUygunlukKontrol(sucBilgisi: SucBilgisi): boolean {
  return sucBilgisi.seri_muhakeme_uygun;
}
