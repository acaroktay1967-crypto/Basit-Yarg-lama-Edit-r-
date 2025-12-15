import React, { useState, useEffect } from 'react';

interface Karar {
  id: number;
  baslik: string;
  ozet: string;
  suc: string;
  tarih: string;
  mahkeme: string;
  esas_no: string;
  karar_no: string;
  sonuc: string;
  karar_metni: string;
  anahtar_kelimeler: string[];
}

interface KararKutuphaneProps {
  dataPath?: string;
}

const KararKutuphane: React.FC<KararKutuphaneProps> = ({ 
  dataPath = '/data/seri-muhakeme-yargitay-kararlari.json' 
}) => {
  const [kararlar, setKararlar] = useState<Karar[]>([]);
  const [filtrelenmisKararlar, setFiltrelenmisKararlar] = useState<Karar[]>([]);
  const [seciliKarar, setSeciliKarar] = useState<Karar | null>(null);
  const [aramaTerimi, setAramaTerimi] = useState('');
  const [sonucFiltresi, setSonucFiltresi] = useState<string>('');
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    fetch(dataPath)
      .then((response) => response.json())
      .then((data) => {
        setKararlar(data.kararlar || []);
        setFiltrelenmisKararlar(data.kararlar || []);
        setYukleniyor(false);
      })
      .catch((error) => {
        console.error('Kararlar yüklenemedi:', error);
        setYukleniyor(false);
      });
  }, [dataPath]);

  useEffect(() => {
    let sonuc = kararlar;

    // Arama filtresi
    if (aramaTerimi) {
      const arama = aramaTerimi.toLowerCase();
      sonuc = sonuc.filter(
        (karar) =>
          karar.baslik.toLowerCase().includes(arama) ||
          karar.ozet.toLowerCase().includes(arama) ||
          karar.suc.toLowerCase().includes(arama) ||
          karar.mahkeme.toLowerCase().includes(arama) ||
          karar.karar_metni.toLowerCase().includes(arama) ||
          karar.anahtar_kelimeler.some((k) => k.toLowerCase().includes(arama))
      );
    }

    // Sonuç filtresi
    if (sonucFiltresi) {
      sonuc = sonuc.filter((karar) => karar.sonuc === sonucFiltresi);
    }

    setFiltrelenmisKararlar(sonuc);
  }, [aramaTerimi, sonucFiltresi, kararlar]);

  const sonuclar = Array.from(new Set(kararlar.map((k) => k.sonuc)));

  if (yukleniyor) {
    return <div className="loading">Yargıtay kararları yükleniyor...</div>;
  }

  return (
    <div className="karar-kutuphane">
      <h2>Seri Muhakeme Usulü - Yargıtay Kararları Kütüphanesi</h2>

      <div className="filtreler">
        <div className="arama">
          <input
            type="text"
            placeholder="Karar ara (başlık, özet, suç, anahtar kelime...)"
            value={aramaTerimi}
            onChange={(e) => setAramaTerimi(e.target.value)}
            className="arama-input"
          />
        </div>

        <div className="sonuc-filtre">
          <label>Sonuç:</label>
          <select
            value={sonucFiltresi}
            onChange={(e) => setSonucFiltresi(e.target.value)}
            className="sonuc-select"
          >
            <option value="">Tümü</option>
            {sonuclar.map((sonuc) => (
              <option key={sonuc} value={sonuc}>
                {sonuc}
              </option>
            ))}
          </select>
        </div>

        <div className="sonuc-sayisi">
          Toplam {filtrelenmisKararlar.length} karar bulundu
        </div>
      </div>

      <div className="karar-liste">
        {filtrelenmisKararlar.length === 0 ? (
          <div className="bos-mesaj">Arama kriterlerine uygun karar bulunamadı.</div>
        ) : (
          filtrelenmisKararlar.map((karar) => (
            <div
              key={karar.id}
              className={`karar-item ${seciliKarar?.id === karar.id ? 'secili' : ''}`}
              onClick={() => setSeciliKarar(karar)}
            >
              <div className="karar-baslik">{karar.baslik}</div>
              <div className="karar-bilgi">
                <span className="suc">{karar.suc}</span>
                <span className="tarih">{karar.tarih}</span>
                <span className={`sonuc sonuc-${karar.sonuc.toLowerCase()}`}>
                  {karar.sonuc}
                </span>
              </div>
              <div className="karar-ozet">{karar.ozet}</div>
              <div className="karar-mahkeme">{karar.mahkeme}</div>
            </div>
          ))
        )}
      </div>

      {seciliKarar && (
        <div className="karar-detay-modal" onClick={() => setSeciliKarar(null)}>
          <div className="karar-detay-icerik" onClick={(e) => e.stopPropagation()}>
            <button className="kapat-btn" onClick={() => setSeciliKarar(null)}>
              ✕
            </button>

            <h3>{seciliKarar.baslik}</h3>

            <div className="detay-bilgiler">
              <div className="bilgi-satir">
                <strong>Suç:</strong> {seciliKarar.suc}
              </div>
              <div className="bilgi-satir">
                <strong>Mahkeme:</strong> {seciliKarar.mahkeme}
              </div>
              <div className="bilgi-satir">
                <strong>Esas No:</strong> {seciliKarar.esas_no}
              </div>
              <div className="bilgi-satir">
                <strong>Karar No:</strong> {seciliKarar.karar_no}
              </div>
              <div className="bilgi-satir">
                <strong>Tarih:</strong> {seciliKarar.tarih}
              </div>
              <div className="bilgi-satir">
                <strong>Sonuç:</strong>{' '}
                <span className={`sonuc sonuc-${seciliKarar.sonuc.toLowerCase()}`}>
                  {seciliKarar.sonuc}
                </span>
              </div>
            </div>

            <div className="ozet-bolum">
              <h4>Özet</h4>
              <p>{seciliKarar.ozet}</p>
            </div>

            <div className="karar-metni-bolum">
              <h4>Karar Metni</h4>
              <p>{seciliKarar.karar_metni}</p>
            </div>

            <div className="anahtar-kelimeler">
              <strong>Anahtar Kelimeler:</strong>
              {seciliKarar.anahtar_kelimeler.map((kelime, idx) => (
                <span key={idx} className="anahtar-kelime">
                  {kelime}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KararKutuphane;
