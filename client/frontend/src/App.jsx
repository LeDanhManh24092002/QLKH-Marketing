import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Register from './components/auth/Register.jsx';
import Login from './components/auth/Login.jsx';
import Home from './components/Home.jsx';
import ProfileEdit from './components/profile/ProfileEdit.jsx';
import ChangePassword from './components/profile/ChangePassword.jsx';
import MyCampaigns from './components/campaign/MyCampaigns.jsx';
import TransactionHistory from './components/transaction/TransactionHistory.jsx';
import Deposit from './components/deposit/Deposit.jsx';
import CreateCampaign from './components/campaign/CreateCampaign.jsx';
import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <main className="flex-grow-1">
          <Switch>
            <Route path="/register">
              <Register setIsAuthenticated={setIsAuthenticated} />
            </Route>
            <Route path="/login">
              <Login setIsAuthenticated={setIsAuthenticated} />
            </Route>
            <Route path="/home">
              {isAuthenticated ? <Home /> : <Redirect to="/login" />}
            </Route>
            <Route path="/profile/edit">
              {isAuthenticated ? <ProfileEdit /> : <Redirect to="/login" />}
            </Route>
            <Route path="/profile/password">
              {isAuthenticated ? <ChangePassword /> : <Redirect to="/login" />}
            </Route>
            <Route path="/campaigns/my">
              {isAuthenticated ? <MyCampaigns /> : <Redirect to="/login" />}
            </Route>
            <Route path="/transactions">
              {isAuthenticated ? <TransactionHistory /> : <Redirect to="/login" />}
            </Route>
            <Route path="/deposit">
              {isAuthenticated ? <Deposit /> : <Redirect to="/login" />}
            </Route>
            <Route path="/campaigns/create">
              {isAuthenticated ? <CreateCampaign /> : <Redirect to="/login" />}
            </Route>
            <Route path="/">
              <Redirect to={isAuthenticated ? "/home" : "/login"} />
            </Route>
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;