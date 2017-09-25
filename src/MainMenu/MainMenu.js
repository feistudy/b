import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import { Button, Icon, Input, Menu } from 'semantic-ui-react';

class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: ''
    };

    //this.handleClick = this.handleClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  //handleClick() {
    //<Button as={Link} to={`/search-results/${this.state.searchString}`} icon='search' color='blue' />
    //<Button icon='search' color='blue' onClick={this.handleClick} />
  //}

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <Menu size='large' fixed='top' inverted>
        <Menu.Item as={Link} to='/'>youtube</Menu.Item>
        <Menu.Item >
          <Input type='text' name='searchString' placeholder='Search' action onChange={this.handleInputChange}>
            <input />
              <SearchButton searchString={this.state.searchString} />
            </Input>
        </Menu.Item>

        <Menu.Menu position='right'>
          <Menu.Item as={Link} to='/playlists'><Icon name='music' />Playlists</Menu.Item>
          <Menu.Item as={Link} to='/logout'><Icon name='log out' />Logout</Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

const SearchButton = withRouter(({ history, searchString }) => (
  <Button icon='search' color='blue' onClick={() => {
      let checkSearchString = searchString;
      if (checkSearchString.trim() === '') return;

      history.push('/search-results/' + searchString);
  }} />
))

export default MainMenu;