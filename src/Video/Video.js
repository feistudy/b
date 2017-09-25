import React from 'react';
import './Video.css';

class Video extends React.Component {
  render() {
    return (
      <div>
        <div id="video" className="video">
          <iframe title="video"
            src={`https://www.youtube.com/embed/${this.props.match.params.videoId}?playlist=${this.props.match.params.videoId}&autoplay=1&loop=1`}>
          </iframe>
        </div>
      </div>
    );
  }
}

export default Video;