var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">'
    + '<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + ' <td class="song-item-title">' + songName + '</td>'
    + ' <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
  ;

  var $row = $(template);

  // Click handler function
  var clickHandler = function() {
    var $songNumber = parseInt($(this).attr('data-song-number'));

    // if no song is currently playing
    if (currentlyPlayingSongNumber === null) {
      $(this).html(pauseButtonTemplate);
      setSong($songNumber);
    }
    // if another song is currently playing
    else if (currentlyPlayingSongNumber !== $songNumber) {
      setSong($songNumber);
      currentSoundFile.play();
      var $songNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
      $songNumberCell.html($songNumberCell.attr('data-song-number'));
      $(this).html(pauseButtonTemplate);
      updatePlayerBarSong();
    }
    // if this song is currently playing
    else if (currentlyPlayingSongNumber === $songNumber) {
      if (currentSoundFile.isPaused()) {
        $(this).html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play();
      }
      else {
        $(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();
      }
    }
  };

  //Event listener for mouseover and mouseleave on album contents (aka song list container)
  var onHover = function(event) {
    var $songItem = $(this).find('.song-item-number');
    var $songItemNumber = parseInt($songItem.attr('data-song-number'));
    if ($songItemNumber !== currentlyPlayingSongNumber) {
      $songItem.html(playButtonTemplate);
    }
  };
  var offHover = function(event) {
    var $songItem = $(this).find('.song-item-number');
    var $songItemNumber = parseInt($songItem.attr('data-song-number'));
    if ($songItemNumber !== currentlyPlayingSongNumber) {
      $songItem.html($songItemNumber);
    }
    console.log("songNumber type is " + typeof songNumber + "\n and currentPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
  };

  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;
};

var setCurrentAlbum = function(album) {
  currentAlbum = album;
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};

// Match currently playing song's object with its index in the album's song array
var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

// Keep track of next and previous songs to play
var nextSong = function() {

  // define previous song; if last song in the album, next song is album's first song
  var previousSong = currentSongFromAlbum;
  var previousSongNumber = currentlyPlayingSongNumber;
  var previousSongIndex = previousSongNumber - 1;

  // use trackIndex() to get the index of the current song and increment index value
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex++;
  if (currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }

  // set currentSongFromAlbum as new current song
  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updatePlayerBarSong();

  // update html of previous song's .song-item-number element with number
  var $previousSongNumberElement = getSongNumberCell(previousSongNumber);
  $previousSongNumberElement.html(previousSongNumber);

  // update html of new song's .song-item-number element with pause button
  var $currentSongNumberElement = getSongNumberCell(currentlyPlayingSongNumber);
  $currentSongNumberElement.html(pauseButtonTemplate);
};

var previousSong = function() {

  // define previous song; if last song in the album, next song is album's first song
  var previousSong = currentSongFromAlbum;
  var previousSongNumber = currentlyPlayingSongNumber;
  var previousSongIndex = previousSongNumber - 1;

  // use trackIndex() to get the index of the current song and increment index value
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length - 1;
  }

  // set currentSongFromAlbum as new current song
  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updatePlayerBarSong();

  // update html of previous song's .song-item-number element with number
  var $previousSongNumberElement = getSongNumberCell(previousSongNumber);
  $previousSongNumberElement.html(previousSongNumber);

  // update html of new song's .song-item-number element with pause button
  var $currentSongNumberElement = getSongNumberCell(currentlyPlayingSongNumber);
  $currentSongNumberElement.html(pauseButtonTemplate);
};

// allow users to play/pause a song from the player bar
var togglePlayFromPlayerBar = function() {
  var $songNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  // if a song is paused and the play button is clicked...
  if (currentSoundFile.isPaused() && event.target.className == 'ion-play') {
    $songNumberCell.html(pauseButtonTemplate);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    currentSoundFile.play();
  }
  // if the song is playing and the pause button is clicked...
  else if (currentSoundFile != null && event.target.className == 'ion-pause') {
    $songNumberCell.html(playButtonTemplate);
    $('.main-controls .play-pause').html(playerBarPlayButton);
    currentSoundFile.pause();
  }
};

// Update player bar with song info
var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  $('.currently-playing .artist-name').text(currentAlbum.artist);

  $('.main-controls .play-pause').html(playerBarPauseButton);
};

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

// setSong() function to track currentlyPlayingSongNumber and currentSongFromAlbum
var setSong = function(songNumber) {
  // if a song is playing, stop it
  if (currentSoundFile) {
    currentSoundFile.stop();
  }
  currentlyPlayingSongNumber = songNumber;
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: ['mp3'],
    preload: true
  });
  setVolume(currentVolume);
};

// determine volume levels
var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};

// getSongNumberCell() function to return song number element by song number
var getSongNumberCell = function(number) {
  return $(document).find('.song-item-number[data-song-number="' + number + '"]');
};

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseButton = $('.main-controls .play-pause');

$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  $playPauseButton.click(togglePlayFromPlayerBar);
});
