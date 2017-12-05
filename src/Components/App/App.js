import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify.js';


class App extends Component {

  constructor(props){
    super(props);
    this.state = { searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [] 
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.SpotifySearch = this.SpotifySearch.bind(this);

  }//end constructor

  SpotifySearch(searchTerm){
    Spotify.search(searchTerm).then(searchResults => {
      this.setState({searchResults: searchResults});
    });

  }// end search

  addTrack(track){
    let inPlaylist = false;

    this.state.playlistTracks.forEach(trackObj => {
        if (trackObj.id === track.id ) {
          inPlaylist = true;
        }
    });

  }//end addTrack

  removeTrack(track){
    let tracks = this.state.playlistTracks;

    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({playlistTracks: tracks});

  }// end removeTrack

   updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  savePlaylist(){
    let trackURIs = [];

      this.state.playlistTracks.forEach(track => {
      trackURIs.push(track.uri);
    });

    Spotify.savePlaylist(this.state.playlistName, trackURIs);
     this.setState = ({ 
      playlistName: 'New Playlist',
      searchResults: [] 
    });

  }//end savePlaylist


  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.SpotifySearch} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} 
              onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    ); 
  } // end render
} // end component

export default App;
