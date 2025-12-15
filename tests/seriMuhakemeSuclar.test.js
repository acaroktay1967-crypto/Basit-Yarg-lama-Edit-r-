/**
 * Seri Muhakeme Suçlar Testleri
 */

import {
  loadSeriMuhakemeSuclar,
  findByTCKMadde,
  filterSeriMuhakemeUygun,
  searchBySucAdi,
  getSucIstatistikleri,
} from '../src/lib/index';

describe('Seri Muhakeme Suçlar', () => {
  let suclar: any[];

  beforeAll(async () => {
    suclar = await loadSeriMuhakemeSuclar('/data/seri-muhakeme-suclar.json');
  });

  test('Suçlar başarıyla yükleniyor', () => {
    expect(suclar).toBeDefined();
    expect(Array.isArray(suclar)).toBe(true);
    expect(suclar.length).toBeGreaterThan(0);
  });

  test('Her suçun gerekli alanları var', () => {
    suclar.forEach((suc) => {
      expect(suc).toHaveProperty('id');
      expect(suc).toHaveProperty('suc_adi');
      expect(suc).toHaveProperty('tck_madde');
      expect(suc).toHaveProperty('kategori');
      expect(suc).toHaveProperty('ceza_alt_sinir');
      expect(suc).toHaveProperty('ceza_ust_sinir');
      expect(suc).toHaveProperty('seri_muhakeme_uygun');
    });
  });

  test('TCK maddesine göre arama çalışıyor', () => {
    const suc = findByTCKMadde(suclar, 'TCK 106/1');
    expect(suc).toBeDefined();
    expect(suc?.tck_madde).toBe('TCK 106/1');
  });

  test('Seri muhakemeye uygun suçlar filtreleniyor', () => {
    const uygunSuclar = filterSeriMuhakemeUygun(suclar);
    expect(uygunSuclar.length).toBeGreaterThan(0);
    uygunSuclar.forEach((suc) => {
      expect(suc.seri_muhakeme_uygun).toBe(true);
    });
  });

  test('Suç adına göre arama çalışıyor', () => {
    const sonuc = searchBySucAdi(suclar, 'tehdit');
    expect(sonuc.length).toBeGreaterThan(0);
    sonuc.forEach((suc) => {
      expect(
        suc.suc_adi.toLowerCase().includes('tehdit') ||
          suc.tck_madde.toLowerCase().includes('tehdit')
      ).toBe(true);
    });
  });

  test('İstatistikler doğru hesaplanıyor', () => {
    const istatistik = getSucIstatistikleri(suclar);
    expect(istatistik.toplamSuc).toBe(suclar.length);
    expect(istatistik.seriMuhakemeUygun).toBeGreaterThan(0);
    expect(istatistik.kategoriler.length).toBeGreaterThan(0);
    expect(istatistik.kategoriDagilim.length).toBeGreaterThan(0);
  });

  test('Kategoriler benzersiz', () => {
    const istatistik = getSucIstatistikleri(suclar);
    const benzersizKategoriler = new Set(istatistik.kategoriler);
    expect(benzersizKategoriler.size).toBe(istatistik.kategoriler.length);
  });
});
