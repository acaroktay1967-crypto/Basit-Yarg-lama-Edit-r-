/**
 * CMK 250 Seri Muhakeme Modülleri
 * Merkezi export dosyası
 */

// Rules
export {
  seriMuhakemeUygunlukKontrol,
  basitUygunlukKontrol,
  type UygulanamayacakHal,
  type KontrolSonucu,
  type SucBilgisi,
  type UsulBilgisi,
} from './rules/seriMuhakemeRules';

// Suç Türleri Adapter
export {
  loadSeriMuhakemeSuclar,
  seriMuhakemeSucToSucTuru,
  convertAllToSucTurleri,
  findByTCKMadde,
  filterByKategori,
  filterSeriMuhakemeUygun,
  searchBySucAdi,
  getKategoriler,
  getSucIstatistikleri,
  type SeriMuhakemeSuc,
  type SucTuruItem,
} from './sucturleri/seriMuhakemeAdapter';

// Validation
export {
  validateTalepname,
  getKritikHatalar,
  getUyarilar,
  type TalepnameData,
  type ValidationError,
  type ValidationResult,
} from './validation/talepnameValidation';
