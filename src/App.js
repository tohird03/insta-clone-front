import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';
import Public from './Routes/Public';
import Private from './Routes/Private'
import Content from './Pages/Content/Content';
import OtherProfile from './Pages/OtherProfile/OtherProfile';
import Followers from './Pages/Followers/Followers';
import Following from './Pages/Following/Following';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Public/>}>
              <Route path='/' element={<Login/>} />
              <Route path='/content' element={<Content/>}/>
              <Route path='/:userId' element={<OtherProfile/>}/>
              <Route path='/followers/:userId' element={<Followers/>}/>
              <Route path='/following/:userId' element={<Following/>}/>
        </Route>
        <Route path="/" element={<Private/>}>
            <Route path='/home' element={<Home/>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
