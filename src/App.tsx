import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import routes from './utils/routes';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<NavBar />}>
          {routes.map((route) => {
            const { Component, isIndex, path, id } = route;
            return <Route path={path} index={isIndex} element={<Component />} key={id} />
          })}
        </Route>
        {/* TODO ADD 404 PATH */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
