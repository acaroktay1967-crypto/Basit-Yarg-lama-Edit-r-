/**
 * Karar Kütüphanesi Testleri
 */

describe('Karar Kütüphanesi', () => {
  let kararlar: any[];

  beforeAll(async () => {
    const response = await fetch('/data/seri-muhakeme-yargitay-kararlari.json');
    const data = await response.json();
    kararlar = data.kararlar || [];
  });

  test('Kararlar başarıyla yükleniyor', () => {
    expect(kararlar).toBeDefined();
    expect(Array.isArray(kararlar)).toBe(true);
    expect(kararlar.length).toBeGreaterThan(0);
  });

  test('Her kararın gerekli alanları var', () => {
    kararlar.forEach((karar) => {
      expect(karar).toHaveProperty('id');
      expect(karar).toHaveProperty('baslik');
      expect(karar).toHaveProperty('ozet');
      expect(karar).toHaveProperty('suc');
      expect(karar).toHaveProperty('tarih');
      expect(karar).toHaveProperty('mahkeme');
      expect(karar).toHaveProperty('sonuc');
      expect(karar).toHaveProperty('karar_metni');
      expect(karar).toHaveProperty('anahtar_kelimeler');
    });
  });

  test('Anahtar kelimeler dizi formatında', () => {
    kararlar.forEach((karar) => {
      expect(Array.isArray(karar.anahtar_kelimeler)).toBe(true);
    });
  });

  test('Sonuç değerleri geçerli', () => {
    const gecerliSonuclar = ['Onanma', 'Bozma', 'Düzeltme'];
    kararlar.forEach((karar) => {
      expect(gecerliSonuclar).toContain(karar.sonuc);
    });
  });

  test('Tarih formatı kontrol edilebilir', () => {
    kararlar.forEach((karar) => {
      expect(karar.tarih).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  test('Filtreleme - arama çalışıyor', () => {
    const aramaTerimi = 'müdafi';
    const sonuc = kararlar.filter(
      (k) =>
        k.baslik.toLowerCase().includes(aramaTerimi) ||
        k.ozet.toLowerCase().includes(aramaTerimi) ||
        k.karar_metni.toLowerCase().includes(aramaTerimi) ||
        k.anahtar_kelimeler.some((ak: string) => ak.toLowerCase().includes(aramaTerimi))
    );
    expect(sonuc.length).toBeGreaterThan(0);
  });

  test('Filtreleme - sonuç filtreleme çalışıyor', () => {
    const sonucFiltresi = 'Bozma';
    const sonuc = kararlar.filter((k) => k.sonuc === sonucFiltresi);
    sonuc.forEach((k) => {
      expect(k.sonuc).toBe(sonucFiltresi);
    });
  });
});
