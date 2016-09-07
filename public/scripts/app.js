/* CLIENT-SIDE JS
 *
 * You may edit this file as you see fit.  Try to separate different components
 * into functions and objects as needed.
 *
 */


$(document).ready(function() {
  console.log('app.js loaded!');

  $.ajax({
    method: 'GET',
    url: '/api/albums',
    success: renderMultipleAlbums
  });

  $('#album-form form').on('submit', function(e) {
    e.preventDefault();
    var formData = $(this).serialize();
    console.log('formData', formData);
    $.post('/api/albums', formData, function(album) {
      console.log('album after POST', album);
      renderAlbum(album);  //render the server's response
    });
    $(this).trigger("reset");
  });

  $('#albums').on('click', '.add-song', function(e){
    console.log('add-song clicked!');
    var id = $(this).closest('.album').data('album-id');
    console.log('id', id);

    $('#songModal').data('album-id', id);
    $('#songModal').modal();
  });

  $('#saveSong').on('click', function(e){
    var songNameData = $('#songName').val();
    var trackNumberData = $('#trackNumber').val();
    var $albumId = $('#songModal').data('album-id');

    $.ajax({
      method: 'POST',
      url: '/api/albums/' + $albumId + '/songs'  ,
      data: {name: songNameData, trackNumber: trackNumberData} ,
      success: createSongSuccess,
      error: createSongError
    });

    function createSongSuccess(data) {
      console.log(data);

    }

    function createSongError(err) {
      console.log(err);
    }

  });
});

function renderMultipleAlbums(albums) {
  albums.forEach(function(album) {
    renderAlbum(album);
  });
}

function renderAlbum(album) {
  console.log('rendering album', album);
  var albumHtml = $('#album-template').html();
  var albumsTemplate = Handlebars.compile(albumHtml);
  var html = albumsTemplate(album);
  $('#albums').prepend(html);
}
