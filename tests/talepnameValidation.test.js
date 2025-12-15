/**
 * Talepname Validasyon Testleri
 */

import {
  validateTalepname,
  getKritikHatalar,
  getUyarilar,
  type TalepnameData,
} from '../src/lib/index';

describe('Talepname Validasyon', () => {
  const gecerliTalepname: TalepnameData = {
    suspehli_bilgileri: {
      ad_soyad: 'Ali YILMAZ',
      tc_kimlik_no: '12345678901',
      dogum_tarihi: '1990-05-15',
      dogum_yeri: 'İstanbul',
      adres: 'Test Mahallesi No:1 İstanbul',
      mudafi_ad_soyad: 'Av. Mehmet KAYA',
      mudafi_baro_no: 'İstanbul 12345',
    },
    isnat_bilgileri: {
      suc_adi: 'Tehdit',
      tck_madde: 'TCK 106/1',
      suc_tarihi: '2024-01-01',
    },
    olay_bilgileri: {
      olay_yeri: 'İstanbul',
      olay_tarihi: '2024-01-01',
    },
    tutukluluk_bilgileri: {
      gozalti_var_mi: false,
      tutukluluk_var_mi: false,
    },
    olay_ozeti: {
      olay_aciklamasi: 'Olay açıklaması test',
      deliller: 'Tanık beyanları',
    },
    teklif_kabul_bilgileri: {
      teklif_tarihi: '2024-01-10',
      mudafi_huzurunda_mi: true,
      kabul_tarihi: '2024-01-10',
      kabul_aciklamasi: 'Müdafi huzurunda kabul edildi',
    },
    ceza_bilgileri: {
      belirlenen_ceza_sure: '6 ay',
      ceza_turu: 'Hapis',
      hagb_uygulanacak_mi: false,
      erteleme_uygulanacak_mi: true,
    },
  };

  test('Geçerli talepname doğrulanıyor', () => {
    const sonuc = validateTalepname(gecerliTalepname);
    expect(sonuc.gecerli).toBe(true);
    expect(getKritikHatalar(sonuc).length).toBe(0);
  });

  test('Şüpheli adı zorunlu', () => {
    const talepname = {
      ...gecerliTalepname,
      suspehli_bilgileri: {
        ...gecerliTalepname.suspehli_bilgileri,
        ad_soyad: '',
      },
    };

    const sonuc = validateTalepname(talepname);
    expect(sonuc.gecerli).toBe(false);
    const kritikHatalar = getKritikHatalar(sonuc);
    expect(kritikHatalar.some((h) => h.alan.includes('ad_soyad'))).toBe(true);
  });

  test('Müdafi bilgileri zorunlu (CMK 250/2)', () => {
    const talepname = {
      ...gecerliTalepname,
      suspehli_bilgileri: {
        ...gecerliTalepname.suspehli_bilgileri,
        mudafi_ad_soyad: '',
      },
    };

    const sonuc = validateTalepname(talepname);
    expect(sonuc.gecerli).toBe(false);
    const kritikHatalar = getKritikHatalar(sonuc);
    expect(kritikHatalar.some((h) => h.mesaj.includes('Müdafii'))).toBe(true);
  });

  test('Müdafi huzurunda kabul zorunlu', () => {
    const talepname = {
      ...gecerliTalepname,
      teklif_kabul_bilgileri: {
        ...gecerliTalepname.teklif_kabul_bilgileri,
        mudafi_huzurunda_mi: false,
      },
    };

    const sonuc = validateTalepname(talepname);
    expect(sonuc.gecerli).toBe(false);
    const kritikHatalar = getKritikHatalar(sonuc);
    expect(
      kritikHatalar.some((h) => h.mesaj.includes('müdafii huzurunda'))
    ).toBe(true);
  });

  test('TC Kimlik No formatı kontrol ediliyor', () => {
    const talepname = {
      ...gecerliTalepname,
      suspehli_bilgileri: {
        ...gecerliTalepname.suspehli_bilgileri,
        tc_kimlik_no: '123', // Geçersiz
      },
    };

    const sonuc = validateTalepname(talepname);
    expect(sonuc.gecerli).toBe(false);
  });

  test('Kritik hatalar ve uyarılar ayrılıyor', () => {
    const talepname = {
      ...gecerliTalepname,
      suspehli_bilgileri: {
        ...gecerliTalepname.suspehli_bilgileri,
        ad_soyad: '', // Kritik
        dogum_tarihi: 'geçersiz-tarih', // Uyarı
      },
    };

    const sonuc = validateTalepname(talepname);
    const kritikHatalar = getKritikHatalar(sonuc);
    const uyarilar = getUyarilar(sonuc);

    expect(kritikHatalar.length).toBeGreaterThan(0);
    expect(kritikHatalar.every((h) => h.oncelik === 'kritik')).toBe(true);
    expect(uyarilar.every((h) => h.oncelik === 'uyari')).toBe(true);
  });

  test('Suç bilgileri zorunlu', () => {
    const talepname = {
      ...gecerliTalepname,
      isnat_bilgileri: {
        ...gecerliTalepname.isnat_bilgileri,
        suc_adi: '',
        tck_madde: '',
      },
    };

    const sonuc = validateTalepname(talepname);
    expect(sonuc.gecerli).toBe(false);
    const kritikHatalar = getKritikHatalar(sonuc);
    expect(kritikHatalar.some((h) => h.alan.includes('suc_adi'))).toBe(true);
    expect(kritikHatalar.some((h) => h.alan.includes('tck_madde'))).toBe(true);
  });

  test('Olay özeti zorunlu', () => {
    const talepname = {
      ...gecerliTalepname,
      olay_ozeti: {
        olay_aciklamasi: '',
        deliller: '',
      },
    };

    const sonuc = validateTalepname(talepname);
    expect(sonuc.gecerli).toBe(false);
    const kritikHatalar = getKritikHatalar(sonuc);
    expect(kritikHatalar.some((h) => h.alan.includes('olay_aciklamasi'))).toBe(
      true
    );
    expect(kritikHatalar.some((h) => h.alan.includes('deliller'))).toBe(true);
  });
});
