import React, { useState, useEffect } from 'react';

interface Hukum {
  id: number;
  baslik: string;
  suc: string;
  kimlik_bilgileri: any;
  suc_tanimi: string;
  karar_gerekceleri: string[];
  sonuc: any;
  ek_notlar: string[];
}

const HukumOrnekleri: React.FC = () => {
  const [hukumler, setHukumler] = useState<Hukum[]>([]);
  const [filtrelenmis, setFiltrelenmis] = useState<Hukum[]>([]);
  const [arama, setArama] = useState('');
  const [secili, setSecili] = useState<Hukum | null>(null);

  useEffect(() => {
    fetch('/data/cmk250-ornek-hukumler.json')
      .then((res) => res.json())
      .then((data) => {
        setHukumler(data.ornekler || []);
        setFiltrelenmis(data.ornekler || []);
      })
      .catch((err) => console.error('Hükümler yüklenemedi:', err));
  }, []);

  useEffect(() => {
    if (arama) {
      const aramaKelime = arama.toLowerCase();
      const sonuc = hukumler.filter(
        (h) =>
          h.baslik.toLowerCase().includes(aramaKelime) ||
          h.suc.toLowerCase().includes(aramaKelime) ||
          h.suc_tanimi.toLowerCase().includes(aramaKelime)
      );
      setFiltrelenmis(sonuc);
    } else {
      setFiltrelenmis(hukumler);
    }
  }, [arama, hukumler]);

  return (
    <div className="hukum-ornekleri">
      <h2>CMK 250 Örnek Mahkeme Hükümleri</h2>

      <div className="arama-bolumu">
        <input
          type="text"
          placeholder="Hüküm ara..."
          value={arama}
          onChange={(e) => setArama(e.target.value)}
          className="arama-input"
        />
        <div className="sonuc-sayisi">{filtrelenmis.length} hüküm bulundu</div>
      </div>

      <div className="hukum-liste">
        {filtrelenmis.map((hukum) => (
          <div
            key={hukum.id}
            className="hukum-item"
            onClick={() => setSecili(hukum)}
          >
            <h3>{hukum.baslik}</h3>
            <div className="hukum-suc">{hukum.suc}</div>
            <div className="hukum-ozet">{hukum.suc_tanimi}</div>
            <div className="hukum-sonuc">
              <strong>Karar:</strong> {hukum.sonuc.karar_turu} - {hukum.sonuc.ceza}
            </div>
          </div>
        ))}
      </div>

      {secili && (
        <div className="hukum-detay-modal" onClick={() => setSecili(null)}>
          <div className="hukum-detay" onClick={(e) => e.stopPropagation()}>
            <button className="kapat-btn" onClick={() => setSecili(null)}>
              ✕
            </button>

            <h2>{secili.baslik}</h2>
            
            <section>
              <h3>Kimlik Bilgileri</h3>
              <div className="kimlik">
                <p><strong>Ad Soyad:</strong> {secili.kimlik_bilgileri.sanik_adi}</p>
                <p><strong>Doğum:</strong> {secili.kimlik_bilgileri.dogum_tarihi}, {secili.kimlik_bilgileri.dogum_yeri}</p>
              </div>
            </section>

            <section>
              <h3>Suç Tanımı</h3>
              <p>{secili.suc_tanimi}</p>
            </section>

            <section>
              <h3>Karar Gerekçeleri</h3>
              <ul>
                {secili.karar_gerekceleri.map((gerekce, idx) => (
                  <li key={idx}>{gerekce}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3>Karar Sonucu</h3>
              <p><strong>Karar Türü:</strong> {secili.sonuc.karar_turu}</p>
              <p><strong>Ceza:</strong> {secili.sonuc.ceza}</p>
              {secili.sonuc.hagb && <p><strong>HAGB:</strong> Uygulandı ({secili.sonuc.hagb_denetim_suresi} denetim)</p>}
              {secili.sonuc.erteleme && <p><strong>Erteleme:</strong> Uygulandı</p>}
              <p>{secili.sonuc.aciklama}</p>
            </section>

            <section>
              <h3>Ek Notlar</h3>
              <ul>
                {secili.ek_notlar.map((not, idx) => (
                  <li key={idx}>{not}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default HukumOrnekleri;
