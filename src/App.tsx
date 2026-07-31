import React, { useState } from 'react';
import { ModuleKey } from './types';
import HeaderBar from './components/HeaderBar';
import TrialBanner from './components/TrialBanner';
import ApiKeyBanner from './components/ApiKeyBanner';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';
import Dashboard from './components/Dashboard';
import KHBD5512 from './components/modules/KHBD5512';
import SlidePPT from './components/modules/SlidePPT';
import OutlineReview from './components/modules/OutlineReview';
import Test7991 from './components/modules/Test7991';
import Worksheet from './components/modules/Worksheet';
import InteractiveGame from './components/modules/InteractiveGame';
import VideoScript from './components/modules/VideoScript';
import SKKN from './components/modules/SKKN';

const App: React.FC = () => {
  const [active, setActive] = useState<ModuleKey | null>(null);
  const onBack = () => setActive(null);

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderBar />
      <TrialBanner />
      <ApiKeyBanner />

      <main className="flex-1 py-8 px-4">
        {active === null && <Dashboard onSelect={setActive} />}
        {active === 'khbd5512' && <KHBD5512 onBack={onBack} />}
        {active === 'slideppt' && <SlidePPT onBack={onBack} />}
        {active === 'outline' && <OutlineReview onBack={onBack} />}
        {active === 'test7991' && <Test7991 onBack={onBack} />}
        {active === 'worksheet' && <Worksheet onBack={onBack} />}
        {active === 'game' && <InteractiveGame onBack={onBack} />}
        {active === 'video' && <VideoScript onBack={onBack} />}
        {active === 'skkn' && <SKKN onBack={onBack} />}
      </main>

      <Footer />
      <ChatbotWidget />
    </div>
  );
};

export default App;
