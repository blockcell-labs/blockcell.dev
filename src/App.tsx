import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/layout';
import HomePage from './pages/home';
import FeaturesPage from './pages/features';
import ArchitecturePage from './pages/architecture';
import InnovationPage from './pages/innovation';
import DocsPage from './pages/docs';
import ExamplesPage from './pages/examples';
import PrivacyPage from './pages/legal/privacy';
import TermsPage from './pages/legal/terms';

import NamingStoryPage from './pages/naming-story';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="architecture" element={<ArchitecturePage />} />
          <Route path="innovation" element={<InnovationPage />} />
          <Route path="docs" element={<DocsPage />} />
          <Route path="examples" element={<ExamplesPage />} />
          <Route path="story" element={<NamingStoryPage />} />
          <Route path="legal/privacy" element={<PrivacyPage />} />
          <Route path="legal/terms" element={<TermsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
