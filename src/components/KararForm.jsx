import React, { useState } from 'react';

interface KararFormData {
  baslik: string;
  ozet: string;
  suc: string;
  tarih: string;
  mahkeme: string;
  esas_no: string;
  karar_no: string;
  sonuc: string;
  karar_metni: string;
  anahtar_kelimeler: string;
}

interface KararFormProps {
  onKaydet?: (karar: any) => void;
  onIptal?: () => void;
}

const KararForm: React.FC<KararFormProps> = ({ onKaydet, onIptal }) => {
  const [formData, setFormData] = useState<KararFormData>({
    baslik: '',
    ozet: '',
    suc: '',
    tarih: '',
    mahkeme: '',
    esas_no: '',
    karar_no: '',
    sonuc: 'Onanma',
    karar_metni: '',
    anahtar_kelimeler: '',
  });

  const [hatalar, setHatalar] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Hata mesajını temizle
    if (hatalar[name]) {
      setHatalar((prev) => {
        const yeni = { ...prev };
        delete yeni[name];
        return yeni;
      });
    }
  };

  const validateForm = (): boolean => {
    const yeniHatalar: Record<string, string> = {};

    if (!formData.baslik.trim()) {
      yeniHatalar.baslik = 'Başlık zorunludur';
    }

    if (!formData.ozet.trim()) {
      yeniHatalar.ozet = 'Özet zorunludur';
    }

    if (!formData.suc.trim()) {
      yeniHatalar.suc = 'Suç bilgisi zorunludur';
    }

    if (!formData.tarih) {
      yeniHatalar.tarih = 'Tarih zorunludur';
    }

    if (!formData.mahkeme.trim()) {
      yeniHatalar.mahkeme = 'Mahkeme bilgisi zorunludur';
    }

    if (!formData.esas_no.trim()) {
      yeniHatalar.esas_no = 'Esas numarası zorunludur';
    }

    if (!formData.karar_no.trim()) {
      yeniHatalar.karar_no = 'Karar numarası zorunludur';
    }

    if (!formData.karar_metni.trim()) {
      yeniHatalar.karar_metni = 'Karar metni zorunludur';
    }

    setHatalar(yeniHatalar);
    return Object.keys(yeniHatalar).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const anahtar_kelimeler = formData.anahtar_kelimeler
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const yeniKarar = {
      ...formData,
      anahtar_kelimeler,
      id: Date.now(), // Basit ID üretimi
    };

    if (onKaydet) {
      onKaydet(yeniKarar);
    }

    // Formu temizle
    setFormData({
      baslik: '',
      ozet: '',
      suc: '',
      tarih: '',
      mahkeme: '',
      esas_no: '',
      karar_no: '',
      sonuc: 'Onanma',
      karar_metni: '',
      anahtar_kelimeler: '',
    });
  };

  return (
    <div className="karar-form">
      <h3>Yeni Yargıtay Kararı Ekle</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-grup">
          <label htmlFor="baslik">
            Başlık <span className="zorunlu">*</span>
          </label>
          <input
            type="text"
            id="baslik"
            name="baslik"
            value={formData.baslik}
            onChange={handleChange}
            className={hatalar.baslik ? 'hata' : ''}
          />
          {hatalar.baslik && <span className="hata-mesaj">{hatalar.baslik}</span>}
        </div>

        <div className="form-grup">
          <label htmlFor="ozet">
            Özet <span className="zorunlu">*</span>
          </label>
          <textarea
            id="ozet"
            name="ozet"
            rows={3}
            value={formData.ozet}
            onChange={handleChange}
            className={hatalar.ozet ? 'hata' : ''}
          />
          {hatalar.ozet && <span className="hata-mesaj">{hatalar.ozet}</span>}
        </div>

        <div className="form-satir">
          <div className="form-grup">
            <label htmlFor="suc">
              Suç <span className="zorunlu">*</span>
            </label>
            <input
              type="text"
              id="suc"
              name="suc"
              value={formData.suc}
              onChange={handleChange}
              placeholder="Örn: TCK 106/1 - Tehdit"
              className={hatalar.suc ? 'hata' : ''}
            />
            {hatalar.suc && <span className="hata-mesaj">{hatalar.suc}</span>}
          </div>

          <div className="form-grup">
            <label htmlFor="tarih">
              Tarih <span className="zorunlu">*</span>
            </label>
            <input
              type="date"
              id="tarih"
              name="tarih"
              value={formData.tarih}
              onChange={handleChange}
              className={hatalar.tarih ? 'hata' : ''}
            />
            {hatalar.tarih && <span className="hata-mesaj">{hatalar.tarih}</span>}
          </div>
        </div>

        <div className="form-grup">
          <label htmlFor="mahkeme">
            Mahkeme <span className="zorunlu">*</span>
          </label>
          <input
            type="text"
            id="mahkeme"
            name="mahkeme"
            value={formData.mahkeme}
            onChange={handleChange}
            placeholder="Örn: Yargıtay 6. Ceza Dairesi"
            className={hatalar.mahkeme ? 'hata' : ''}
          />
          {hatalar.mahkeme && <span className="hata-mesaj">{hatalar.mahkeme}</span>}
        </div>

        <div className="form-satir">
          <div className="form-grup">
            <label htmlFor="esas_no">
              Esas No <span className="zorunlu">*</span>
            </label>
            <input
              type="text"
              id="esas_no"
              name="esas_no"
              value={formData.esas_no}
              onChange={handleChange}
              placeholder="Örn: 2024/1234"
              className={hatalar.esas_no ? 'hata' : ''}
            />
            {hatalar.esas_no && <span className="hata-mesaj">{hatalar.esas_no}</span>}
          </div>

          <div className="form-grup">
            <label htmlFor="karar_no">
              Karar No <span className="zorunlu">*</span>
            </label>
            <input
              type="text"
              id="karar_no"
              name="karar_no"
              value={formData.karar_no}
              onChange={handleChange}
              placeholder="Örn: 2024/5678"
              className={hatalar.karar_no ? 'hata' : ''}
            />
            {hatalar.karar_no && <span className="hata-mesaj">{hatalar.karar_no}</span>}
          </div>

          <div className="form-grup">
            <label htmlFor="sonuc">
              Sonuç <span className="zorunlu">*</span>
            </label>
            <select
              id="sonuc"
              name="sonuc"
              value={formData.sonuc}
              onChange={handleChange}
            >
              <option value="Onanma">Onanma</option>
              <option value="Bozma">Bozma</option>
              <option value="Düzeltme">Düzeltme</option>
            </select>
          </div>
        </div>

        <div className="form-grup">
          <label htmlFor="karar_metni">
            Karar Metni <span className="zorunlu">*</span>
          </label>
          <textarea
            id="karar_metni"
            name="karar_metni"
            rows={6}
            value={formData.karar_metni}
            onChange={handleChange}
            className={hatalar.karar_metni ? 'hata' : ''}
          />
          {hatalar.karar_metni && (
            <span className="hata-mesaj">{hatalar.karar_metni}</span>
          )}
        </div>

        <div className="form-grup">
          <label htmlFor="anahtar_kelimeler">Anahtar Kelimeler</label>
          <input
            type="text"
            id="anahtar_kelimeler"
            name="anahtar_kelimeler"
            value={formData.anahtar_kelimeler}
            onChange={handleChange}
            placeholder="Virgülle ayırın: müdafi, kabul, talepname"
          />
          <small>Anahtar kelimeleri virgülle ayırarak girin</small>
        </div>

        <div className="form-butonlar">
          <button type="submit" className="btn btn-kaydet">
            Kaydet
          </button>
          {onIptal && (
            <button type="button" className="btn btn-iptal" onClick={onIptal}>
              İptal
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default KararForm;
