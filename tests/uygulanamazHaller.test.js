/**
 * Uygulanamaz Haller Testleri
 */

import {
  seriMuhakemeUygunlukKontrol,
  type UygulanamayacakHal,
  type SucBilgisi,
  type UsulBilgisi,
} from '../src/lib/index';

describe('Seri Muhakeme Uygulanamaz Haller', () => {
  let uygulanamayacakHaller: UygulanamayacakHal[];

  beforeAll(async () => {
    const response = await fetch('/data/uygulanamaz-haller.json');
    const data = await response.json();
    uygulanamayacakHaller = data.uygulanamaz_haller || [];
  });

  test('Uygulanamaz haller yükleniyor', () => {
    expect(uygulanamayacakHaller).toBeDefined();
    expect(Array.isArray(uygulanamayacakHaller)).toBe(true);
    expect(uygulanamayacakHaller.length).toBeGreaterThan(0);
  });

  test('Her halin gerekli alanları var', () => {
    uygulanamayacakHaller.forEach((hal) => {
      expect(hal).toHaveProperty('id');
      expect(hal).toHaveProperty('kod');
      expect(hal).toHaveProperty('baslik');
      expect(hal).toHaveProperty('aciklama');
      expect(hal).toHaveProperty('yasal_dayanak');
      expect(hal).toHaveProperty('kontrol_kriterleri');
    });
  });

  test('Suç uygun - tüm şartlar sağlanıyor', () => {
    const sucBilgisi: SucBilgisi = {
      suc_adi: 'Tehdit',
      tck_madde: 'TCK 106/1',
      seri_muhakeme_uygun: true,
    };

    const usulBilgisi: UsulBilgisi = {
      adres_bulundu_mu: true,
      yurt_disinda_mi: false,
      sikayete_bagli_mi: false,
      onodeme_kapsaminda_mi: false,
      uzlastirma_kapsaminda_mi: false,
      uzlastirma_yapildi_mi: false,
      uzlastirma_sonuclu_mu: false,
      cagri_yapildi_mi: true,
      suspehli_geldi_mi: true,
      mazeret_bildirdi_mi: false,
      savunma_verdi_mi: true,
      istirak_var_mi: false,
      diger_suspehli_kabul_etti_mi: true,
      birlikte_diger_suc_var_mi: false,
      diger_suc_seri_muhakeme_kapsaminda_mi: true,
      suspehli_yasi: 25,
      akil_hastasi_mi: false,
      sagir_dilsiz_mi: false,
    };

    const sonuc = seriMuhakemeUygunlukKontrol(
      sucBilgisi,
      usulBilgisi,
      uygulanamayacakHaller
    );

    expect(sonuc.uygulanabilir).toBe(true);
    expect(sonuc.engel_haller.length).toBe(0);
  });

  test('Adres bulunmama - uygulanamaz', () => {
    const sucBilgisi: SucBilgisi = {
      suc_adi: 'Tehdit',
      tck_madde: 'TCK 106/1',
      seri_muhakeme_uygun: true,
    };

    const usulBilgisi: UsulBilgisi = {
      adres_bulundu_mu: false,
      yurt_disinda_mi: false,
      sikayete_bagli_mi: false,
      onodeme_kapsaminda_mi: false,
      uzlastirma_kapsaminda_mi: false,
      uzlastirma_yapildi_mi: false,
      uzlastirma_sonuclu_mu: false,
      cagri_yapildi_mi: false,
      suspehli_geldi_mi: true,
      mazeret_bildirdi_mi: false,
      savunma_verdi_mi: true,
      istirak_var_mi: false,
      diger_suspehli_kabul_etti_mi: true,
      birlikte_diger_suc_var_mi: false,
      diger_suc_seri_muhakeme_kapsaminda_mi: true,
      suspehli_yasi: 25,
      akil_hastasi_mi: false,
      sagir_dilsiz_mi: false,
    };

    const sonuc = seriMuhakemeUygunlukKontrol(
      sucBilgisi,
      usulBilgisi,
      uygulanamayacakHaller
    );

    expect(sonuc.uygulanabilir).toBe(false);
    expect(sonuc.engel_haller.length).toBeGreaterThan(0);
  });

  test('Yaş küçüklüğü - uygulanamaz', () => {
    const sucBilgisi: SucBilgisi = {
      suc_adi: 'Tehdit',
      tck_madde: 'TCK 106/1',
      seri_muhakeme_uygun: true,
    };

    const usulBilgisi: UsulBilgisi = {
      adres_bulundu_mu: true,
      yurt_disinda_mi: false,
      sikayete_bagli_mi: false,
      onodeme_kapsaminda_mi: false,
      uzlastirma_kapsaminda_mi: false,
      uzlastirma_yapildi_mi: false,
      uzlastirma_sonuclu_mu: false,
      cagri_yapildi_mi: false,
      suspehli_geldi_mi: true,
      mazeret_bildirdi_mi: false,
      savunma_verdi_mi: true,
      istirak_var_mi: false,
      diger_suspehli_kabul_etti_mi: true,
      birlikte_diger_suc_var_mi: false,
      diger_suc_seri_muhakeme_kapsaminda_mi: true,
      suspehli_yasi: 11,
      akil_hastasi_mi: false,
      sagir_dilsiz_mi: false,
    };

    const sonuc = seriMuhakemeUygunlukKontrol(
      sucBilgisi,
      usulBilgisi,
      uygulanamayacakHaller
    );

    expect(sonuc.uygulanabilir).toBe(false);
    expect(sonuc.uyari_mesajlari.some((m) => m.includes('on iki yaş'))).toBe(true);
  });

  test('Suç kapsamda değil - uygulanamaz', () => {
    const sucBilgisi: SucBilgisi = {
      suc_adi: 'Test Suç',
      tck_madde: 'TCK 999',
      seri_muhakeme_uygun: false,
    };

    const usulBilgisi: UsulBilgisi = {
      adres_bulundu_mu: true,
      yurt_disinda_mi: false,
      sikayete_bagli_mi: false,
      onodeme_kapsaminda_mi: false,
      uzlastirma_kapsaminda_mi: false,
      uzlastirma_yapildi_mi: false,
      uzlastirma_sonuclu_mu: false,
      cagri_yapildi_mi: false,
      suspehli_geldi_mi: true,
      mazeret_bildirdi_mi: false,
      savunma_verdi_mi: true,
      istirak_var_mi: false,
      diger_suspehli_kabul_etti_mi: true,
      birlikte_diger_suc_var_mi: false,
      diger_suc_seri_muhakeme_kapsaminda_mi: true,
      suspehli_yasi: 25,
      akil_hastasi_mi: false,
      sagir_dilsiz_mi: false,
    };

    const sonuc = seriMuhakemeUygunlukKontrol(
      sucBilgisi,
      usulBilgisi,
      uygulanamayacakHaller
    );

    expect(sonuc.uygulanabilir).toBe(false);
  });
});
