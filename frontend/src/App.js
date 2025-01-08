import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

import PortfolioTracker from './components/PortfolioTracker';

function App() {
  return (
    <Router>
      <Switch>
        {/* Route for the portfolio page */}
        <Route exact path="/portfolio" component={PortfolioTracker} />

        {/* Redirect any unknown routes to /portfolio */}
        <Redirect to="/portfolio" />
      </Switch>
    </Router>
  );
}

export default App;
