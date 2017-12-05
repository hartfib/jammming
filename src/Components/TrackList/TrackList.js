import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends React.Component {
	render(){
		return(
			<div className="TrackList">
			{
    			this.props.tracks.map(track => {
    				return <Track track={track} isRemoval={this.props.isRemoval} key={track.id} onAdd={this.props.onAdd} onRemove={this.props.onRemove} />
    			})
    		}
			</div>

		);
	}
} 

export default TrackList;