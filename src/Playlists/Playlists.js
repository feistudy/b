import React, { Component } from 'react';
import { Accordion, Button, Grid, Icon, List, Segment } from 'semantic-ui-react';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc';



const DragHandle = SortableHandle(() => <List.Icon link name='move' />); // This can be any component you want

const Playlist = SortableElement(({value, index}) => {
  
  return (
    <List.Item>
      <List.Content floated='right'>
      <Icon link name='delete' />
      </List.Content>
      <DragHandle />
      <List.Content>
        <List.Header>{value}</List.Header>
        <List.Description>1:23</List.Description>
      </List.Content>
      
      </List.Item>
  );
});

const SortableList = SortableContainer(({items}) => {
  return (
    <List divided relaxed>
      {items.map((value, index) => (
        <Playlist key={`item-${index}`} index={index} value={value} />
      ))}
    </List>
  );
});

class Playlists extends Component {
  state = {
    Playlists: ['謝霆鋒 Nicholas Tse《愛後餘生》[Official MV]', '謝霆鋒 Nicholas Tse《遊樂場》[Official MV]', '陳奕迅 Eason Chan - 《誰來剪月光》MV', 'Item 4', 'Item 5', 'Item 6'],
  };
  onSortEnd = ({oldIndex, newIndex}) => {
    const {Playlists} = this.state;

    this.setState({
      Playlists: arrayMove(Playlists, oldIndex, newIndex),
    });
  };

  render() {
    const {Playlists} = this.state;

    return (
      <div>
        <Grid stackable columns={2}>
          <Grid.Column>
            <Segment>
              <h2>Playlists</h2>
              <Accordion>
              <Accordion.Title>
      <Icon name='dropdown' />
      What is a dog?
    </Accordion.Title>
    <Accordion.Content>
              <SortableList items={Playlists} onSortEnd={this.onSortEnd} useDragHandle={true} />
              </Accordion.Content>
              </Accordion>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment>
              
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Playlists;
