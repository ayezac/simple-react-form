import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import UserForm from './components/User/UserForm';

const App = () => (
    <Router>
      <Switch>
        <Route exact path="/">
          Home
        </Route>
        <Route path="/users/signup" component={UserForm} />
      </Switch>
    </Router>
);
export default App;
