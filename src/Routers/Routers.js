import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import Home from '../Home/Home';
import MainMenu from '../MainMenu/MainMenu';
import Playlists from '../Playlists/Playlists';
import SearchResults from '../SearchResults/SearchResults';
import './Routers.css';

class Routers extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <MainMenu />
          
          <div id='content'>
            <Route exact path="/" component={Home} />
            <Route path="/search-results/:searchString" component={SearchResults} />
            <Route path="/playlists" component={Playlists} />
            <Route path="/logout" component={Topics} />
          </div>
        </div>
      </Router>
    );
  }
}

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>
          Rendering with React
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>
          Components
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>
          Props v. State
        </Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic}/>
    <Route exact path={match.url} render={() => (
      <h3>Please select a topic.</h3>
    )}/>
  </div>
)

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)

export default Routers