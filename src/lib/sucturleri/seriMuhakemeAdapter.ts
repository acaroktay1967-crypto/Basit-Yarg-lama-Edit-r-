/**
 * Seri Muhakeme Suçları Adapter
 * Suç türleri bölümü ile seri muhakeme suçlarını entegre eder
 */

export interface SeriMuhakemeSuc {
  id: number;
  suc_adi: string;
  tck_madde: string;
  kategori: string;
  ceza_alt_sinir: string;
  ceza_ust_sinir: string;
  ceza_turu: string;
  aciklama: string;
  seri_muhakeme_uygun: boolean;
  notlar: string;
}

export interface SucTuruItem {
  id: number;
  category: string;
  name: string;
  tck_article: string;
  description: string;
  penalty_min: string;
  penalty_max: string;
  penalty_type: string;
  eligible_for_simple_trial?: boolean;
  eligible_for_seri_muhakeme?: boolean;
  notes: string;
}

/**
 * Seri muhakeme suçlarını yükler
 */
export async function loadSeriMuhakemeSuclar(
  filePath: string = '/data/seri-muhakeme-suclar.json'
): Promise<SeriMuhakemeSuc[]> {
  try {
    const response = await fetch(filePath);
    const data = await response.json();
    return data.suclar || [];
  } catch (error) {
    console.error('Seri muhakeme suçları yüklenemedi:', error);
    return [];
  }
}

/**
 * Seri muhakeme suçlarını suç türleri formatına dönüştürür
 */
export function seriMuhakemeSucToSucTuru(suc: SeriMuhakemeSuc): SucTuruItem {
  return {
    id: suc.id,
    category: suc.kategori,
    name: suc.suc_adi,
    tck_article: suc.tck_madde,
    description: suc.aciklama,
    penalty_min: suc.ceza_alt_sinir,
    penalty_max: suc.ceza_ust_sinir,
    penalty_type: suc.ceza_turu,
    eligible_for_simple_trial: false, // Seri muhakeme farklı
    eligible_for_seri_muhakeme: suc.seri_muhakeme_uygun,
    notes: suc.notlar,
  };
}

/**
 * Tüm seri muhakeme suçlarını suç türleri formatına dönüştürür
 */
export function convertAllToSucTurleri(suclar: SeriMuhakemeSuc[]): SucTuruItem[] {
  return suclar.map(seriMuhakemeSucToSucTuru);
}

/**
 * TCK maddesine göre seri muhakeme suçu arar
 */
export function findByTCKMadde(
  suclar: SeriMuhakemeSuc[],
  tckMadde: string
): SeriMuhakemeSuc | undefined {
  return suclar.find(
    (suc) => suc.tck_madde.toLowerCase() === tckMadde.toLowerCase()
  );
}

/**
 * Kategoriye göre seri muhakeme suçlarını filtreler
 */
export function filterByKategori(
  suclar: SeriMuhakemeSuc[],
  kategori: string
): SeriMuhakemeSuc[] {
  return suclar.filter((suc) => suc.kategori === kategori);
}

/**
 * Seri muhakemeye uygun suçları filtreler
 */
export function filterSeriMuhakemeUygun(
  suclar: SeriMuhakemeSuc[]
): SeriMuhakemeSuc[] {
  return suclar.filter((suc) => suc.seri_muhakeme_uygun);
}

/**
 * Suç adına göre arama yapar
 */
export function searchBySucAdi(
  suclar: SeriMuhakemeSuc[],
  arama: string
): SeriMuhakemeSuc[] {
  const aramaKelimesi = arama.toLowerCase();
  return suclar.filter(
    (suc) =>
      suc.suc_adi.toLowerCase().includes(aramaKelimesi) ||
      suc.tck_madde.toLowerCase().includes(aramaKelimesi) ||
      suc.aciklama.toLowerCase().includes(aramaKelimesi)
  );
}

/**
 * Kategorileri listeler
 */
export function getKategoriler(suclar: SeriMuhakemeSuc[]): string[] {
  const kategoriler = new Set(suclar.map((suc) => suc.kategori));
  return Array.from(kategoriler).sort();
}

/**
 * İstatistik bilgisi döndürür
 */
export function getSucIstatistikleri(suclar: SeriMuhakemeSuc[]) {
  return {
    toplamSuc: suclar.length,
    seriMuhakemeUygun: suclar.filter((s) => s.seri_muhakeme_uygun).length,
    kategoriler: getKategoriler(suclar),
    kategoriDagilim: getKategoriler(suclar).map((kat) => ({
      kategori: kat,
      adet: suclar.filter((s) => s.kategori === kat).length,
    })),
  };
}
