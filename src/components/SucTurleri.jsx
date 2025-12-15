import React, { useState, useEffect } from 'react';
import { loadSeriMuhakemeSuclar, type SeriMuhakemeSuc } from '../lib/index';

const SucTurleri: React.FC = () => {
  const [suclar, setSuclar] = useState<SeriMuhakemeSuc[]>([]);
  const [filtrelenmis, setFiltrelenmis] = useState<SeriMuhakemeSuc[]>([]);
  const [filtre, setFiltre] = useState<string>('');
  const [seriMuhakemeFiltre, setSeriMuhakemeFiltre] = useState<boolean>(false);

  useEffect(() => {
    loadSeriMuhakemeSuclar('/data/seri-muhakeme-suclar.json')
      .then((data) => {
        setSuclar(data);
        setFiltrelenmis(data);
      })
      .catch((err) => console.error('Suçlar yüklenemedi:', err));
  }, []);

  useEffect(() => {
    let sonuc = suclar;

    if (seriMuhakemeFiltre) {
      sonuc = sonuc.filter((s) => s.seri_muhakeme_uygun);
    }

    if (filtre) {
      const arama = filtre.toLowerCase();
      sonuc = sonuc.filter(
        (s) =>
          s.suc_adi.toLowerCase().includes(arama) ||
          s.tck_madde.toLowerCase().includes(arama) ||
          s.kategori.toLowerCase().includes(arama)
      );
    }

    setFiltrelenmis(sonuc);
  }, [filtre, seriMuhakemeFiltre, suclar]);

  return (
    <div className="suc-turleri">
      <h2>Suç Türleri Kütüphanesi</h2>

      <div className="filtreler">
        <input
          type="text"
          placeholder="Suç ara..."
          value={filtre}
          onChange={(e) => setFiltre(e.target.value)}
          className="arama-input"
        />

        <label className="seri-muhakeme-filtre">
          <input
            type="checkbox"
            checked={seriMuhakemeFiltre}
            onChange={(e) => setSeriMuhakemeFiltre(e.target.checked)}
          />
          <span className="etiket-seri-muhakeme">📋 Seri Muhakeme</span>
        </label>

        <div className="sonuc-sayisi">
          {filtrelenmis.length} suç listeleniyor
        </div>
      </div>

      <div className="suc-liste">
        {filtrelenmis.map((suc) => (
          <div key={suc.id} className="suc-item">
            <div className="suc-baslik">
              <h3>{suc.suc_adi}</h3>
              {suc.seri_muhakeme_uygun && (
                <span className="badge-seri-muhakeme">Seri Muhakeme</span>
              )}
            </div>
            <div className="suc-detay">
              <div><strong>TCK Madde:</strong> {suc.tck_madde}</div>
              <div><strong>Kategori:</strong> {suc.kategori}</div>
              <div>
                <strong>Ceza:</strong> {suc.ceza_alt_sinir} - {suc.ceza_ust_sinir} ({suc.ceza_turu})
              </div>
              <div><strong>Açıklama:</strong> {suc.aciklama}</div>
              {suc.notlar && (
                <div className="notlar"><em>{suc.notlar}</em></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SucTurleri;
