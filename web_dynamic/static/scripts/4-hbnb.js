$(() => {
  const selectedAmenities = $('.amenities h4');
  selectedAmenities.css({
    'text-wrap': 'nowrap',
    'text-overflow': 'ellipsis',
    overflow: 'hidden',
    width: '212px',
    height: '16px'
  });
  let checkedBoxes = [];

  $("input[type='checkbox']").change(function () {
    if (this.checked) {
      checkedBoxes.push({ id: this.dataset.id, name: this.dataset.name });
    } else {
      checkedBoxes = checkedBoxes.filter((amenity) => amenity.id !== this.dataset.id);
    }
    let text = '';
    checkedBoxes.forEach((amenity, idx) => {
      if (idx === 0) {
        text += amenity.name;
      } else {
        text += `, ${amenity.name}`;
      }
    });
    selectedAmenities.text(text);
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, status) {
    if (status === 'success') {
      if (data.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    }
  });

  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    data: '{}',
    success: function (data) { renderPlaces(data); },
    contentType: 'application/json'
  });

  $('button').click(function () {
    const data = { amenities: [] };
    $('input[type="checkbox"]').each(function () {
      if (this.checked) {
        data.amenities.push(this.dataset.id);
      }
    });

    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      data: JSON.stringify(data),
      success: function (data) { renderPlaces(data); },
      contentType: 'application/json'
    });
  });
});

function renderPlaces (places) {
  $('section.places').html('');
  places.forEach(place => {
    $('section.places').append(`<article><div class="title_box"><h2>${place.name}</h2><div class="price_by_night">$${place.price_by_night}</div></div><div class="information"><div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div><div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div><div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div></div><div class="description">${place.description}</div></article>`);
  });
}
