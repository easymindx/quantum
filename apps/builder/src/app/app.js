import { Route, Routes } from 'react-router-dom';
import MainNav from './components/MainNav';
import Breadcrumb from './components/Breadcrumb';
import Dashboard from './pages/Dashboard';
import Objects from './pages/Objects';
import Footer from './components/Footer';
import Pricing from './pages/Pricing';
import { useEffect } from 'react';
import useStore from './store';

export function App() {
  const apiUrl = process.env.NX_API_URL;
  const setProjectData = useStore((state) => state.setProjectData);
  const projectId = useStore((state) => state.projectId);

  useEffect(() => {
    fetch('https://api.npoint.io/830360b5f6a82edd4912')
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data);
        const project = data.find((project) => project.id === projectId);
        console.log('project', project);
        setProjectData(project);
      });
  }, [projectId]);

  return (
    <>
      <MainNav />
      <Breadcrumb />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/objects" element={<Objects />} />
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
      <Footer />
    </>
  );
}
export default App;
