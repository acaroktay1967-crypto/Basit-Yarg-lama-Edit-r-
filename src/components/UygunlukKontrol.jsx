import React, { useState, useEffect } from 'react';
import {
  seriMuhakemeUygunlukKontrol,
  type UygulanamayacakHal,
  type SucBilgisi,
  type UsulBilgisi,
} from '../lib/index';

const UygunlukKontrol: React.FC = () => {
  const [uygulanamayacakHaller, setUygulanamayacakHaller] = useState<UygulanamayacakHal[]>([]);
  const [sucBilgisi, setSucBilgisi] = useState<SucBilgisi>({
    suc_adi: '',
    tck_madde: '',
    seri_muhakeme_uygun: true,
  });

  const [usulBilgisi, setUsulBilgisi] = useState<UsulBilgisi>({
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
    suspehli_yasi: 18,
    akil_hastasi_mi: false,
    sagir_dilsiz_mi: false,
  });

  const [kontrolSonucu, setKontrolSonucu] = useState<any>(null);

  useEffect(() => {
    fetch('/data/uygulanamaz-haller.json')
      .then((res) => res.json())
      .then((data) => setUygulanamayacakHaller(data.uygulanamaz_haller || []))
      .catch((err) => console.error('Veri yüklenemedi:', err));
  }, []);

  const handleKontrol = () => {
    const sonuc = seriMuhakemeUygunlukKontrol(
      sucBilgisi,
      usulBilgisi,
      uygulanamayacakHaller
    );
    setKontrolSonucu(sonuc);
  };

  return (
    <div className="uygunluk-kontrol">
      <h2>Seri Muhakeme Uygunluk Kontrolü</h2>

      <div className="kontrol-form">
        <div className="bolum">
          <h3>Suç Bilgileri</h3>
          <div className="form-grup">
            <label>Suç Adı:</label>
            <input
              type="text"
              value={sucBilgisi.suc_adi}
              onChange={(e) =>
                setSucBilgisi({ ...sucBilgisi, suc_adi: e.target.value })
              }
              placeholder="Örn: Tehdit"
            />
          </div>
          <div className="form-grup">
            <label>TCK Maddesi:</label>
            <input
              type="text"
              value={sucBilgisi.tck_madde}
              onChange={(e) =>
                setSucBilgisi({ ...sucBilgisi, tck_madde: e.target.value })
              }
              placeholder="Örn: TCK 106/1"
            />
          </div>
          <div className="form-grup">
            <label>
              <input
                type="checkbox"
                checked={sucBilgisi.seri_muhakeme_uygun}
                onChange={(e) =>
                  setSucBilgisi({
                    ...sucBilgisi,
                    seri_muhakeme_uygun: e.target.checked,
                  })
                }
              />
              Suç seri muhakeme kapsamında
            </label>
          </div>
        </div>

        <div className="bolum">
          <h3>Usul Bilgileri</h3>
          
          <div className="checkbox-grup">
            <label>
              <input
                type="checkbox"
                checked={usulBilgisi.adres_bulundu_mu}
                onChange={(e) =>
                  setUsulBilgisi({ ...usulBilgisi, adres_bulundu_mu: e.target.checked })
                }
              />
              Adres bulundu
            </label>

            <label>
              <input
                type="checkbox"
                checked={usulBilgisi.yurt_disinda_mi}
                onChange={(e) =>
                  setUsulBilgisi({ ...usulBilgisi, yurt_disinda_mi: e.target.checked })
                }
              />
              Yurt dışında
            </label>

            <label>
              <input
                type="checkbox"
                checked={usulBilgisi.sikayete_bagli_mi}
                onChange={(e) =>
                  setUsulBilgisi({ ...usulBilgisi, sikayete_bagli_mi: e.target.checked })
                }
              />
              Şikayete bağlı suç
            </label>

            <label>
              <input
                type="checkbox"
                checked={usulBilgisi.uzlastirma_kapsaminda_mi}
                onChange={(e) =>
                  setUsulBilgisi({
                    ...usulBilgisi,
                    uzlastirma_kapsaminda_mi: e.target.checked,
                  })
                }
              />
              Uzlaştırma kapsamında
            </label>

            <label>
              <input
                type="checkbox"
                checked={usulBilgisi.istirak_var_mi}
                onChange={(e) =>
                  setUsulBilgisi({ ...usulBilgisi, istirak_var_mi: e.target.checked })
                }
              />
              İştirak var
            </label>

            <label>
              <input
                type="checkbox"
                checked={usulBilgisi.akil_hastasi_mi}
                onChange={(e) =>
                  setUsulBilgisi({ ...usulBilgisi, akil_hastasi_mi: e.target.checked })
                }
              />
              Akıl hastası
            </label>

            <label>
              <input
                type="checkbox"
                checked={usulBilgisi.sagir_dilsiz_mi}
                onChange={(e) =>
                  setUsulBilgisi({ ...usulBilgisi, sagir_dilsiz_mi: e.target.checked })
                }
              />
              Sağır ve dilsiz
            </label>
          </div>

          <div className="form-grup">
            <label>Şüpheli Yaşı:</label>
            <input
              type="number"
              value={usulBilgisi.suspehli_yasi}
              onChange={(e) =>
                setUsulBilgisi({
                  ...usulBilgisi,
                  suspehli_yasi: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>
        </div>

        <button onClick={handleKontrol} className="btn btn-kontrol">
          Uygunluk Kontrolü Yap
        </button>
      </div>

      {kontrolSonucu && (
        <div className={`kontrol-sonuc ${kontrolSonucu.uygulanabilir ? 'basarili' : 'uyari'}`}>
          <h3>Kontrol Sonucu</h3>

          {kontrolSonucu.uygulanabilir ? (
            <div className="basarili-mesaj">
              ✓ Seri muhakeme usulü uygulanabilir
            </div>
          ) : (
            <div className="uyari-mesaj">
              ⚠ Seri muhakeme usulü uygulanamaz
            </div>
          )}

          {kontrolSonucu.uyari_mesajlari.length > 0 && (
            <div className="uyari-listesi">
              <h4>Uyarılar:</h4>
              <ul>
                {kontrolSonucu.uyari_mesajlari.map((mesaj: string, idx: number) => (
                  <li key={idx}>{mesaj}</li>
                ))}
              </ul>
            </div>
          )}

          {kontrolSonucu.engel_haller.length > 0 && (
            <div className="engel-listesi">
              <h4>Engel Haller:</h4>
              {kontrolSonucu.engel_haller.map((hal: UygulanamayacakHal) => (
                <div key={hal.id} className="engel-item">
                  <strong>{hal.baslik}</strong>
                  <p>{hal.aciklama}</p>
                  <small>Yasal Dayanak: {hal.yasal_dayanak}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UygunlukKontrol;
