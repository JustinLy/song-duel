class Song {
    constructor(songData) {
        //Get info of contributing artists. We only need name and id and not the rest of the fields
        let artists = (songData.artists || []).map((artistInfo) => {
            return {
                name : artistInfo.name,
                id : artistInfo.id
            };
        });

        this.name = songData.name;
        this.id = songData.id;
        this.previewUrl = songData.preview_url;
        this.artists = artists;
    }
}