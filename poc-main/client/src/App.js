import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.css';

import DetailsPage from './Component/DetailsPage';
import Home from './Component/Home';

const Routing=()=>{
  // var id = "/QRScanned?qid=123";
  return(
      <Switch> 
        <Route exact path="/"> 
          <Home />
        </Route>
        <Route path="/QRScanned/:id"> 
          <DetailsPage />
        </Route>
      </Switch>
   );
}

function App() {
  return (
    <BrowserRouter >
      <Routing />
    </BrowserRouter>
  );
}
export default App;


// 098ef3d0-774e-11eb-ac93-273cbf264ca2
