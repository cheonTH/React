import logo from './logo.svg';
import './App.css';
import Login from './login/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from './login/Signup';
import Main from './login/Main';
import MyInfo from './login/MyInfo';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/main' element={<Main />} />
          <Route path="/myinfo" element={<MyInfo />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
