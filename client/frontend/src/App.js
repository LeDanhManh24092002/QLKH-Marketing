import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Home from './components/Home';
import CreateCampaign from './components/campaign/CreateCampaign';
import EditCampaign from './components/campaign/EditCampaign';
import DeleteCampaign from './components/campaign/DeleteCampaign';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <Switch>
        <Route path="/register" exact>
          <Register setIsAuthenticated={setIsAuthenticated} />
        </Route>

        <Route path="/login" exact>
          <Login setIsAuthenticated={setIsAuthenticated} />
        </Route>

        <Route path="/home" exact>
          {isAuthenticated ? <Home /> : <Redirect to="/login" />}
        </Route>

        <Route path="/campaign/create" exact>
          {isAuthenticated ? <CreateCampaign /> : <Redirect to="/login" />}
        </Route>

        <Route path="/campaign/edit/:id" exact>
          {isAuthenticated ? <EditCampaign /> : <Redirect to="/login" />}
        </Route>

        <Route path="/campaign/delete/:id" exact>
          {isAuthenticated ? <DeleteCampaign /> : <Redirect to="/login" />}
        </Route>

        <Route path="/" exact>
          <Redirect to={isAuthenticated ? "/home" : "/login"} />
        </Route>

        {/* Nếu không khớp route nào, có thể thêm 404 */}
        <Route path="*">
          <h2>404 Not Found</h2>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
