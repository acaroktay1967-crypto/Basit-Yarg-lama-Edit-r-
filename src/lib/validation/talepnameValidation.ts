/**
 * Talepname Validasyon Modülü
 * CMK 250 Seri Muhakeme Talepnamesi için zorunlu alan kontrolü
 */

export interface TalepnameData {
  suspehli_bilgileri: {
    ad_soyad: string;
    tc_kimlik_no: string;
    dogum_tarihi: string;
    dogum_yeri: string;
    adres: string;
    mudafi_ad_soyad: string;
    mudafi_baro_no: string;
  };
  magdur_bilgileri?: {
    magdur_ad_soyad?: string;
    magdur_tc_kimlik_no?: string;
    vekil_ad_soyad?: string;
    vekil_baro_no?: string;
  };
  isnat_bilgileri: {
    suc_adi: string;
    tck_madde: string;
    suc_tarihi: string;
  };
  olay_bilgileri: {
    olay_yeri: string;
    olay_tarihi: string;
    olay_saati?: string;
  };
  tutukluluk_bilgileri: {
    gozalti_var_mi: boolean;
    gozalti_baslangic?: string;
    gozalti_bitis?: string;
    tutukluluk_var_mi: boolean;
    tutukluluk_baslangic?: string;
    tutukluluk_suresi_gun?: number;
  };
  olay_ozeti: {
    olay_aciklamasi: string;
    deliller: string;
  };
  teklif_kabul_bilgileri: {
    teklif_tarihi: string;
    mudafi_huzurunda_mi: boolean;
    kabul_tarihi: string;
    kabul_aciklamasi: string;
  };
  ceza_bilgileri: {
    belirlenen_ceza_sure: string;
    ceza_turu: 'Hapis' | 'Adli Para';
    hagb_uygulanacak_mi: boolean;
    erteleme_uygulanacak_mi: boolean;
    secenek_yaptirim?: string;
    guvenlik_tedbiri?: string;
  };
}

export interface ValidationError {
  alan: string;
  mesaj: string;
  oncelik: 'kritik' | 'uyari';
}

export interface ValidationResult {
  gecerli: boolean;
  hatalar: ValidationError[];
}

/**
 * Temel validasyon fonksiyonu - boş alan kontrolü
 */
function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  return false;
}

/**
 * T.C. Kimlik No validasyonu
 */
function validateTCKimlik(tcKimlik: string): boolean {
  if (!tcKimlik || tcKimlik.length !== 11) return false;
  
  // Sadece rakam kontrolü
  if (!/^\d+$/.test(tcKimlik)) return false;
  
  // İlk hane 0 olamaz
  if (tcKimlik[0] === '0') return false;
  
  return true;
}

/**
 * Tarih formatı validasyonu
 */
function validateDate(date: string): boolean {
  if (!date) return false;
  
  // Basit tarih formatı kontrolü (YYYY-MM-DD veya DD.MM.YYYY)
  const regex1 = /^\d{4}-\d{2}-\d{2}$/;
  const regex2 = /^\d{2}\.\d{2}\.\d{4}$/;
  
  return regex1.test(date) || regex2.test(date);
}

/**
 * Talepname verilerini doğrular
 */
export function validateTalepname(data: TalepnameData): ValidationResult {
  const hatalar: ValidationError[] = [];

  // Şüpheli bilgileri kontrolü
  if (isEmpty(data.suspehli_bilgileri.ad_soyad)) {
    hatalar.push({
      alan: 'suspehli_bilgileri.ad_soyad',
      mesaj: 'Şüphelinin adı ve soyadı zorunludur',
      oncelik: 'kritik',
    });
  }

  if (isEmpty(data.suspehli_bilgileri.tc_kimlik_no)) {
    hatalar.push({
      alan: 'suspehli_bilgileri.tc_kimlik_no',
      mesaj: 'T.C. Kimlik Numarası zorunludur',
      oncelik: 'kritik',
    });
  } else if (!validateTCKimlik(data.suspehli_bilgileri.tc_kimlik_no)) {
    hatalar.push({
      alan: 'suspehli_bilgileri.tc_kimlik_no',
      mesaj: 'Geçersiz T.C. Kimlik Numarası formatı',
      oncelik: 'kritik',
    });
  }

  if (isEmpty(data.suspehli_bilgileri.dogum_tarihi)) {
    hatalar.push({
      alan: 'suspehli_bilgileri.dogum_tarihi',
      mesaj: 'Doğum tarihi zorunludur',
      oncelik: 'kritik',
    });
  } else if (!validateDate(data.suspehli_bilgileri.dogum_tarihi)) {
    hatalar.push({
      alan: 'suspehli_bilgileri.dogum_tarihi',
      mesaj: 'Geçersiz tarih formatı',
      oncelik: 'uyari',
    });
  }

  if (isEmpty(data.suspehli_bilgileri.dogum_yeri)) {
    hatalar.push({
      alan: 'suspehli_bilgileri.dogum_yeri',
      mesaj: 'Doğum yeri zorunludur',
      oncelik: 'kritik',
    });
  }

  if (isEmpty(data.suspehli_bilgileri.adres)) {
    hatalar.push({
      alan: 'suspehli_bilgileri.adres',
      mesaj: 'İkametgah adresi zorunludur',
      oncelik: 'kritik',
    });
  }

  // Müdafi bilgileri kontrolü - CMK 250/2 uyarınca zorunlu
  if (isEmpty(data.suspehli_bilgileri.mudafi_ad_soyad)) {
    hatalar.push({
      alan: 'suspehli_bilgileri.mudafi_ad_soyad',
      mesaj: 'Müdafii bilgileri zorunludur (CMK 250/2)',
      oncelik: 'kritik',
    });
  }

  if (isEmpty(data.suspehli_bilgileri.mudafi_baro_no)) {
    hatalar.push({
      alan: 'suspehli_bilgileri.mudafi_baro_no',
      mesaj: 'Müdafii baro sicil numarası zorunludur',
      oncelik: 'kritik',
    });
  }

  // İsnat bilgileri kontrolü
  if (isEmpty(data.isnat_bilgileri.suc_adi)) {
    hatalar.push({
      alan: 'isnat_bilgileri.suc_adi',
      mesaj: 'Suçun adı zorunludur',
      oncelik: 'kritik',
    });
  }

  if (isEmpty(data.isnat_bilgileri.tck_madde)) {
    hatalar.push({
      alan: 'isnat_bilgileri.tck_madde',
      mesaj: 'İlgili TCK maddesi zorunludur',
      oncelik: 'kritik',
    });
  }

  if (isEmpty(data.isnat_bilgileri.suc_tarihi)) {
    hatalar.push({
      alan: 'isnat_bilgileri.suc_tarihi',
      mesaj: 'Suçun işlendiği tarih zorunludur',
      oncelik: 'kritik',
    });
  }

  // Olay bilgileri kontrolü
  if (isEmpty(data.olay_bilgileri.olay_yeri)) {
    hatalar.push({
      alan: 'olay_bilgileri.olay_yeri',
      mesaj: 'Olayın gerçekleştiği yer zorunludur',
      oncelik: 'kritik',
    });
  }

  if (isEmpty(data.olay_bilgileri.olay_tarihi)) {
    hatalar.push({
      alan: 'olay_bilgileri.olay_tarihi',
      mesaj: 'Olayın gerçekleştiği tarih zorunludur',
      oncelik: 'kritik',
    });
  }

  // Olay özeti kontrolü
  if (isEmpty(data.olay_ozeti.olay_aciklamasi)) {
    hatalar.push({
      alan: 'olay_ozeti.olay_aciklamasi',
      mesaj: 'Olayın ayrıntılı açıklaması zorunludur',
      oncelik: 'kritik',
    });
  }

  if (isEmpty(data.olay_ozeti.deliller)) {
    hatalar.push({
      alan: 'olay_ozeti.deliller',
      mesaj: 'Mevcut deliller zorunludur',
      oncelik: 'kritik',
    });
  }

  // Teklif ve kabul bilgileri kontrolü
  if (isEmpty(data.teklif_kabul_bilgileri.teklif_tarihi)) {
    hatalar.push({
      alan: 'teklif_kabul_bilgileri.teklif_tarihi',
      mesaj: 'Teklifin yapıldığı tarih zorunludur',
      oncelik: 'kritik',
    });
  }

  // Müdafi huzurunda kabul kontrolü - CMK 250/2 uyarınca zorunlu
  if (data.teklif_kabul_bilgileri.mudafi_huzurunda_mi !== true) {
    hatalar.push({
      alan: 'teklif_kabul_bilgileri.mudafi_huzurunda_mi',
      mesaj: 'Teklif mutlaka müdafii huzurunda kabul edilmelidir (CMK 250/2)',
      oncelik: 'kritik',
    });
  }

  if (isEmpty(data.teklif_kabul_bilgileri.kabul_tarihi)) {
    hatalar.push({
      alan: 'teklif_kabul_bilgileri.kabul_tarihi',
      mesaj: 'Teklifin kabul edildiği tarih zorunludur',
      oncelik: 'kritik',
    });
  }

  if (isEmpty(data.teklif_kabul_bilgileri.kabul_aciklamasi)) {
    hatalar.push({
      alan: 'teklif_kabul_bilgileri.kabul_aciklamasi',
      mesaj: 'Kabulün nasıl gerçekleştiği zorunludur',
      oncelik: 'kritik',
    });
  }

  // Ceza bilgileri kontrolü
  if (isEmpty(data.ceza_bilgileri.belirlenen_ceza_sure)) {
    hatalar.push({
      alan: 'ceza_bilgileri.belirlenen_ceza_sure',
      mesaj: 'Belirlenen ceza süresi zorunludur',
      oncelik: 'kritik',
    });
  }

  if (isEmpty(data.ceza_bilgileri.ceza_turu)) {
    hatalar.push({
      alan: 'ceza_bilgileri.ceza_turu',
      mesaj: 'Ceza türü zorunludur',
      oncelik: 'kritik',
    });
  }

  // Gözaltı/tutukluluk bilgileri kontrolü
  if (data.tutukluluk_bilgileri.gozalti_var_mi) {
    if (isEmpty(data.tutukluluk_bilgileri.gozalti_baslangic)) {
      hatalar.push({
        alan: 'tutukluluk_bilgileri.gozalti_baslangic',
        mesaj: 'Gözaltı başlangıç tarihi zorunludur',
        oncelik: 'uyari',
      });
    }
  }

  if (data.tutukluluk_bilgileri.tutukluluk_var_mi) {
    if (isEmpty(data.tutukluluk_bilgileri.tutukluluk_baslangic)) {
      hatalar.push({
        alan: 'tutukluluk_bilgileri.tutukluluk_baslangic',
        mesaj: 'Tutukluluk başlangıç tarihi zorunludur',
        oncelik: 'uyari',
      });
    }
  }

  return {
    gecerli: hatalar.filter((h) => h.oncelik === 'kritik').length === 0,
    hatalar,
  };
}

/**
 * Sadece kritik hataları döndürür
 */
export function getKritikHatalar(result: ValidationResult): ValidationError[] {
  return result.hatalar.filter((h) => h.oncelik === 'kritik');
}

/**
 * Sadece uyarıları döndürür
 */
export function getUyarilar(result: ValidationResult): ValidationError[] {
  return result.hatalar.filter((h) => h.oncelik === 'uyari');
}
