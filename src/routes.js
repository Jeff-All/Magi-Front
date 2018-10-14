import React from 'react';
import { Redirect, Route, Router } from 'react-router-dom';
import App from './App';
import Home from './Home/Home';
import Profile from './Profile/Profile';
import Callback from './Callback/Callback';
import Auth from './Auth/Auth';
import history from './history';
import Upload from './Upload/Upload'
import Users from './Admin/Users'
import Requests from './Requests/Requests'
import Tags from './Tags/Tags'

const auth = new Auth();

const handleAuthentication = ({location}) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

export const makeMainRoutes = () => {
  return (
    <Router history={history}>
      <div>
        <Route path="/" render={ props => 
          !auth.isAuthenticated() && props.location.pathname !== "/home"
            ? <Redirect to="/home" />
            : <App auth={auth} {...props} />
        } />
        <Route path="/home" render={ props => <Home auth={auth} {...props} />} />
        <Route path="/upload" render={ props => 
          !auth.isAuthenticated() 
          || !auth.isAuthorized("admin", "upload", props)
            ? <Redirect to="/home" />
            : <Upload auth={auth} itemsPerRequest={1} {...props} />
        } />
        <Route path="/requests" render={ props => 
          !auth.isAuthenticated() 
          || !auth.isAuthorized("admin", "requests", props)
            ? <Redirect to="/home" />
            : <Requests/>
        } />
        <Route path="/tags" render={ props => 
          !auth.isAuthenticated() 
          || !auth.isAuthorized("admin", "tags", props)
            ? <Redirect to="/home" />
            : <Tags/>
        } />
        <Route path="/admin/users" render={ props => 
          !auth.isAuthenticated() 
          || !auth.isAuthorized("admin", "admin/users", props)
            ? <Redirect to="/home" />
            : <Users/>
        } />
        

        <Route
          path="/profile"
          render={props =>
            !auth.isAuthenticated()
              ? <Redirect to="/home" />
              : <Profile auth={auth} {...props} />}
        />
        <Route
          path="/callback"
          render={props => {
            handleAuthentication(props);
            return <Callback {...props} />;
          }}
        />
      </div>
    </Router>
  );
};
