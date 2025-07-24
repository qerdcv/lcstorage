import Footer from '@components/Footer';
import Header from '@components/Header';
import AddPage from '@pages/Add';
import CardDetailsPage from '@pages/CardDetails';
import HomePage from '@pages/Home';
import { Route, Routes } from 'react-router';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/lcstorage/' element={<HomePage />} />
        <Route path='/lcstorage/add' element={<AddPage />} />
        <Route path='/lcstorage/cards/:id' element={<CardDetailsPage />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
