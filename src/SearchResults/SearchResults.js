import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom';
import ytDurationFormat from 'youtube-duration-format';
import {convertDuration, convertYouTubeDuration} from 'duration-iso-8601';
import Video from '../Video/Video';
import { Container, Button, Grid, Icon, Item, Menu, Segment } from 'semantic-ui-react';
import './SearchResults.css';

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: null,
      durationViewCount: null,
      isShowVideo: false,
      returnPosition: null
    };

    this.handleClickLoadmore = this.handleClickLoadmore.bind(this);
    this.handleClickReturnPosition = this.handleClickReturnPosition.bind(this);
    this.handleClickTitle = this.handleClickTitle.bind(this);
  }
  
  componentDidMount() {
    this.search(this.props.match.params.searchString);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.searchString !== this.props.match.params.searchString) {
      this.search(nextProps.match.params.searchString);

      this.setState({
        isShowVideo: false,
        returnPosition: null
      });

      window.scrollTo(0, 0);
    }
  }

  handleClickLoadmore() {
    this.loadmore(this.props.match.params.searchString);
  }

  handleClickReturnPosition() {
    if (this.state.returnPosition !== null) {
      this.state.returnPosition.scrollIntoView();
      window.scroll(0, window.scrollY - 55);
    }
    else
      window.scrollTo(0, 0);
  }

  handleClickTitle(event) {
    this.setState({
      isShowVideo: true,
      returnPosition: event.currentTarget
    });
    
    window.scrollTo(0, 0);
  }

  getKey() {
    return 'AIzaSyCLL40tIbmo-_gs-1VclCm0gZea-auU7LM';
  }

  getDomain() {
    return 'https://www.googleapis.com/youtube/v3';
  }

  async search(searchString) {
    const fields = 'items(id/videoId,snippet(channelTitle,description,publishedAt,thumbnails/default/url,title)),nextPageToken,pageInfo/totalResults';
    const searchURL = `${this.getDomain()}/search?part=snippet&maxResults=20&q=${searchString}&type=video&fields=${fields}&key=${this.getKey()}`;

    let fetchSearchResults = await fetch(searchURL, {method: 'get'});
    let fetchSearchResultsJSON = await fetchSearchResults.json();

    let fetchDurationViewCountJSON = await this.fetchDurationViewCount(fetchSearchResultsJSON);
    
    this.setState({
      searchResults: fetchSearchResultsJSON,
      durationViewCount: fetchDurationViewCountJSON
    });
  }

  async loadmore(searchString) {
    const fields = 'items(id/videoId,snippet(channelTitle,description,publishedAt,thumbnails/default/url,title)),nextPageToken,pageInfo/totalResults';
    const searchURL = `${this.getDomain()}/search?part=snippet&maxResults=20&pageToken=${this.state.searchResults.nextPageToken}&q=${searchString}&type=video&fields=${fields}&key=${this.getKey()}`;

    let fetchSearchResults = await fetch(searchURL, {method: 'get'});
    let fetchSearchResultsJSON = await fetchSearchResults.json();

    let newSearchResults = this.state.searchResults;
    newSearchResults.nextPageToken = fetchSearchResultsJSON.nextPageToken;

    if (newSearchResults.nextPageToken === undefined)
      delete newSearchResults.nextPageToken;

    newSearchResults.items = newSearchResults.items.concat(fetchSearchResultsJSON.items);

    let fetchDurationViewCountJSON = await this.fetchDurationViewCount(fetchSearchResultsJSON);
    let newDurationViewCount = this.state.durationViewCount;
    newDurationViewCount.items = newDurationViewCount.items.concat(fetchDurationViewCountJSON.items);

    this.setState({
      searchResults: newSearchResults,
      durationViewCount: newDurationViewCount
    });
  }

  async fetchDurationViewCount(fetchSearchResultsJSON) {
    let videosID = '';
    
    for (let itemsIndex = 0; itemsIndex < fetchSearchResultsJSON.items.length; itemsIndex++) {
      if (itemsIndex === 0)
        videosID += fetchSearchResultsJSON.items[itemsIndex].id.videoId;
      else
        videosID += ',' + fetchSearchResultsJSON.items[itemsIndex].id.videoId;
    }

    const fields = 'items(contentDetails/duration,statistics/viewCount)';
    const videosURL = `${this.getDomain()}/videos?part=contentDetails,statistics&id=${videosID}&fields=${fields}&key=${this.getKey()}`;

    let fetchDurationViewCount = await fetch(videosURL, {method: 'get'});
    let fetchDurationViewCountJSON = await fetchDurationViewCount.json();

    return fetchDurationViewCountJSON;
  }

  render() {
    if (this.state.searchResults === null) {
      return (
        <div></div>
      );
    }
    
    if (this.state.searchResults.items.length === 0) {
      return (
        <div>
          <Container>
            <Grid columns={1} stackable>
              <Grid.Row>
                <Grid.Column>
                  <Segment>
                    No results for {this.props.match.params.searchString}.
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
      );
    }
    
    return (
      <div>
        <Container>
          <Grid columns={1} stackable>
            { this.state.isShowVideo ? 
                <Grid.Row>
                  <Grid.Column>
                    <Route path={`${this.props.match.url}/:videoId`} component={Video}/>
                  </Grid.Column>
                </Grid.Row>
              :
                null
            }

            <Grid.Row>
              <Grid.Column>
                <Segment>
                  <Item.Group divided>
                    {
                      this.state.searchResults.items.map((item, index) =>
                        <Item key={index}>
                          <Item.Image src={item.snippet.thumbnails.default.url} />
                          <Item.Content>
                            <Item.Header onClick={this.handleClickTitle} as={Link} to={`${this.props.match.url}/${item.id.videoId}`}>{item.snippet.title}</Item.Header>
                            <Item.Meta>
                              <span>{convertYouTubeDuration(this.state.durationViewCount.items[index].contentDetails.duration)}</span>
                              <br/>
                              <span>{item.snippet.channelTitle}</span>
                              <br/>
                              <span>{item.snippet.publishedAt.slice(0, 10)} · {Number(this.state.durationViewCount.items[index].statistics.viewCount).toLocaleString()} views</span>
                            </Item.Meta>
                            <Item.Description>{item.snippet.description}</Item.Description>
                          </Item.Content>
                        </Item>
                      )
                    }
                  </Item.Group>
                  {
                    this.state.searchResults.hasOwnProperty('nextPageToken') ?
                      <Button fluid onClick={this.handleClickLoadmore}>Load more</Button>
                    :
                      null
                  }
                </Segment>
              </Grid.Column>
            </Grid.Row>

            <Button id='returnPosition' icon='undo' color='blue' onClick={this.handleClickReturnPosition} />
          </Grid>
        </Container>
      </div>
    );
  }
}

export default SearchResults;