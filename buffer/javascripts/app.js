$('#js-finish').click(function() {
  $('.buffer').toggleClass('loading');
  $('button').toggleClass('go');
  if ($('button').hasClass('go')) {
    $('button').text('Finished');
  } else {
    $('button').text('Loading');
  }
});
