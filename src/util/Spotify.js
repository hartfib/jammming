const clientId = 'b72abf065dcc4b19b6188b6333012c32';

const redirectURI = "http://localhost:3000/";
//const redirectURI = 'http://hartfibjamming.surge.sh/'

let accessToken;

const Spotify = {

	//Get a Spotify user's access token 
	getAccessToken(){
		if (accessToken){
			return accessToken;
		}

		const access = window.location.href.match(/access_token=([^&]*)/);
		const expiration = window.location.href.match(/expires_in=([^&]*)/);

		if (access && expiration) {
			accessToken = access[1];
			const expiresIn = Number(expiration[1]);
			window.setTimeout(() => accessToken = '', expiresIn * 1000);
			window.history.pushState('Access Token', null, '/');
			return accessToken;
		} else {
			//const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
			window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
		} 

	},//end accessToken

	//Implement Spotify Search Request
	search(searchTerm){
		const accessToken = Spotify.getAccessToken();

		return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, { 
				headers: {Authorization: `Bearer ${accessToken}`} 
			}).then(response => {
				return response.json();
			}).then(jsonResponse => {
      			if (!jsonResponse.tracks) {
        		return [];
			}

  			return jsonResponse.tracks.items.map(track => ({
  				id: track.id,
  				name: track.name,
  				artist: track.artists[0].name,
  				album: track.album.name,
  				uri: track.uri
  			}));
  		});
  	},//end search

  	savePlaylist(name, trackUris){
  		if(! name || ! trackUris){
  			return;
  		}

  		accessToken = Spotify.getAccessToken();
  		const headers = { Authorization: `Bearer ${accessToken}`};
  		let userId;

  		return fetch('https://api.spotify.com/v1/me', {
  			 headers: headers
  		 }).then(response => response.json()).then(jsonResponse => {
  		 	userId = jsonResponse.id;
  		 	return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
  		 		 method: 'POST',
  		 		 headers: headers,
  		 		 body: JSON.stringify({name: name})
  		 	}).then(response => response.json()
  		 	).then(jsonResponse => {
  		 		const playlistID = jsonResponse.id;
  		 		return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`,
  		 		{
  		 			headers: headers,
  		 			method: 'POST',
  		 			body: JSON.stringify({uris: trackUris})
  		 		});
  		 	});
  		 });


  	}//end savePlaylist
	
}; //end


export default Spotify;