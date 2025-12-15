import React, { useState } from 'react';
import KararKutuphane from './components/KararKutuphane';
import KararForm from './components/KararForm';
import UygunlukKontrol from './components/UygunlukKontrol';
import SucTurleri from './components/SucTurleri';
import TalepnameForm from './components/TalepnameForm';
import HukumOrnekleri from './components/HukumOrnekleri';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('karar-kutuphane');

  const tabs = [
    { id: 'karar-kutuphane', label: 'Yargıtay Kararları', icon: '📚' },
    { id: 'karar-form', label: 'Karar Ekle', icon: '➕' },
    { id: 'uygunluk', label: 'Uygunluk Kontrolü', icon: '⚠️' },
    { id: 'suc-turleri', label: 'Suç Türleri', icon: '📋' },
    { id: 'talepname', label: 'Talepname Formu', icon: '✅' },
    { id: 'hukumler', label: 'Örnek Hükümler', icon: '📄' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'karar-kutuphane':
        return <KararKutuphane />;
      case 'karar-form':
        return <KararForm onKaydet={(karar) => console.log('Karar kaydedildi:', karar)} />;
      case 'uygunluk':
        return <UygunlukKontrol />;
      case 'suc-turleri':
        return <SucTurleri />;
      case 'talepname':
        return <TalepnameForm />;
      case 'hukumler':
        return <HukumOrnekleri />;
      default:
        return <div>Modül bulunamadı</div>;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚖️ Basit Yargılama Editörü v2.0</h1>
        <p>CMK 250 - Seri Muhakeme Usulü Modülleri</p>
      </header>

      <nav className="app-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="app-content">{renderContent()}</main>

      <footer className="app-footer">
        <p>Basit Yargılama Çalışma Grubu © 2024</p>
      </footer>
    </div>
  );
};

export default App;
