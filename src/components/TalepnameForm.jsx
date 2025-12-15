import React, { useState } from 'react';
import { validateTalepname, type TalepnameData } from '../lib/index';

const TalepnameForm: React.FC = () => {
  const [formData, setFormData] = useState<TalepnameData>({
    suspehli_bilgileri: {
      ad_soyad: '',
      tc_kimlik_no: '',
      dogum_tarihi: '',
      dogum_yeri: '',
      adres: '',
      mudafi_ad_soyad: '',
      mudafi_baro_no: '',
    },
    isnat_bilgileri: {
      suc_adi: '',
      tck_madde: '',
      suc_tarihi: '',
    },
    olay_bilgileri: {
      olay_yeri: '',
      olay_tarihi: '',
    },
    tutukluluk_bilgileri: {
      gozalti_var_mi: false,
      tutukluluk_var_mi: false,
    },
    olay_ozeti: {
      olay_aciklamasi: '',
      deliller: '',
    },
    teklif_kabul_bilgileri: {
      teklif_tarihi: '',
      mudafi_huzurunda_mi: true,
      kabul_tarihi: '',
      kabul_aciklamasi: '',
    },
    ceza_bilgileri: {
      belirlenen_ceza_sure: '',
      ceza_turu: 'Hapis',
      hagb_uygulanacak_mi: false,
      erteleme_uygulanacak_mi: false,
    },
  });

  const [validasyonSonucu, setValidasyonSonucu] = useState<any>(null);

  const handleValidate = () => {
    const sonuc = validateTalepname(formData);
    setValidasyonSonucu(sonuc);
  };

  return (
    <div className="talepname-form">
      <h2>Seri Muhakeme Talepname Formu</h2>

      <div className="form-bolumler">
        <section className="form-bolum">
          <h3>Şüpheli Bilgileri</h3>
          <div className="form-grup">
            <label>Ad Soyad *</label>
            <input
              type="text"
              value={formData.suspehli_bilgileri.ad_soyad}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  suspehli_bilgileri: {
                    ...formData.suspehli_bilgileri,
                    ad_soyad: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="form-grup">
            <label>T.C. Kimlik No *</label>
            <input
              type="text"
              value={formData.suspehli_bilgileri.tc_kimlik_no}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  suspehli_bilgileri: {
                    ...formData.suspehli_bilgileri,
                    tc_kimlik_no: e.target.value,
                  },
                })
              }
              maxLength={11}
            />
          </div>
          <div className="form-grup">
            <label>Müdafi Ad Soyad *</label>
            <input
              type="text"
              value={formData.suspehli_bilgileri.mudafi_ad_soyad}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  suspehli_bilgileri: {
                    ...formData.suspehli_bilgileri,
                    mudafi_ad_soyad: e.target.value,
                  },
                })
              }
            />
          </div>
        </section>

        <section className="form-bolum">
          <h3>Teklif ve Kabul Bilgileri</h3>
          <div className="form-grup">
            <label>
              <input
                type="checkbox"
                checked={formData.teklif_kabul_bilgileri.mudafi_huzurunda_mi}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    teklif_kabul_bilgileri: {
                      ...formData.teklif_kabul_bilgileri,
                      mudafi_huzurunda_mi: e.target.checked,
                    },
                  })
                }
              />
              Müdafi huzurunda kabul edildi (CMK 250/2) *
            </label>
          </div>
        </section>

        <button onClick={handleValidate} className="btn btn-validate">
          Formu Doğrula
        </button>
      </div>

      {validasyonSonucu && (
        <div className={`validasyon-sonuc ${validasyonSonucu.gecerli ? 'basarili' : 'hata'}`}>
          <h3>Validasyon Sonucu</h3>
          {validasyonSonucu.gecerli ? (
            <p className="basarili-mesaj">✓ Form geçerli</p>
          ) : (
            <div className="hata-listesi">
              <p className="hata-mesaj">⚠ Form hataları:</p>
              <ul>
                {validasyonSonucu.hatalar.map((hata: any, idx: number) => (
                  <li key={idx} className={`hata-${hata.oncelik}`}>
                    <strong>{hata.alan}:</strong> {hata.mesaj}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TalepnameForm;
