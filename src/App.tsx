import React from 'react';
import {BrowserRouter as Router, Route ,Switch} from 'react-router-dom'
import './App.scss';

//IMPORT COMPONENTS
import Navbar from './components/Navbar'
import Login from './components/Login'
import Register from './components/Register'
import DetailPage from './components/DetailPage'
import MainPage from './components/MainPage'

const App:React.FC = () => {

  const logo = 'https://araipolska.pl/wp-content/uploads/2014/04/arai-logo-BLK.png'
 
  return (
    <div className="App">
      <Router>
        <Navbar logo={logo} />
        <Switch>
          <Route path={'/helmets'} exact component={MainPage}/>
          <Route path={'/helmet/:id'} exact component={DetailPage}/>
          <Route path={'/Login'} exact component={Login}/>
          <Route path={'/Register'} exact component={Register}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
