var translations = {
  de: {
    closed: 'Parkplatz geschlossen.',
    noData: 'Keine Daten verfügbar.',
    available: '{} von {} Parkplätzen sind noch frei.',
    mapTitle: 'Karte - {}'
  },
  en: {
    closed: 'Closed.',
    noData: 'No data available.',
    available: '{} of {} parking lots are free.',
    mapTitle: 'Map - {}'
  },
  cs: {
    closed: 'Zavřeno.',
    noData: 'Žádná dostupná data.',
    available: '{} z {} parkovacích míst volných.',
    mapTitle: 'Mapa - {}'
  }
};

// read from HTML <header> of the page, expecting a tag in following form:
// <meta http-equiv="Content-Language" content="en">
// de as default language
var language = document.head.querySelector('[http-equiv=\'Content-Language\']').content || 'de';

function translate (key) {
  var args = [].slice.apply(arguments).slice(1); // take all the arguments passed to the translate function, skipping first (=key)
  var value = translations[language][key] || key; // obtain translation template, if not found use the key itself
  args.forEach(function (arg) {
    value = value.replace('{}', arg); // replace all {} placeholders with provided arguments
  });
  return value;
}

function createIcon (image) {
  var basePath = './media/icons/';
  if (language !== 'de') { // non-de maps are located one level lower in the web structure
    basePath = basePath.replace('.', '..');
  }
  return L.icon({
    iconUrl: basePath + image,
    iconSize: [32, 20],
    iconAnchor: [9, 9],
    popupAnchor: [0, -9],
    labelAnchor: [-12, 1]
  });
}

var yellowIcon = createIcon('yellow.png');
var greenIcon = createIcon('green.png');
var blueIcon = createIcon('blue.png');
var redIcon = createIcon('red.png');

function onMove (map) {
  $.each(allMarker, function (key, marker) {
    if (map.getZoom() < 14) {
      marker.hideLabel();
    } else {
      marker.showLabel();
    }
  });
}

function createMarker (lot) {
  var mIcon, lClass, popUpText, label;

  switch (lot.state) {
  case 'open':
    var perc = lot.free / lot.total;
    if (perc < 0.05) {
      mIcon = redIcon;
      lClass = 'labelred';
    } else if (perc < 0.2) {
      mIcon = yellowIcon;
      lClass = 'labelyellow';
    } else {
      mIcon = greenIcon;
      lClass = 'labelgreen';
    }
    popUpText = '<strong>' + lot.name + '</strong><br>' + translate('available', lot.free, lot.total);
    label = lot.free.toString();
    break;
  case 'closed':
    mIcon = redIcon;
    lClass = 'labelred';
    popUpText = '<strong>' + lot.name + '</strong><br>' + translate('closed');
    label = '<span style="margin-left:5px;">\u20e0</span>';
    break;
  default:
    mIcon = blueIcon;
    lClass = 'labelblue';
    popUpText = '<strong>' + lot.name + '</strong><br>' + translate('noData');
    label = 'P';
    break;
  }
  var lPosition = 'right';
  if (lot.id === 'dresdentaschenbergpalais') { // hack, could be calculated automatically anyhow?
    lPosition = 'left';
  }
  var marker = L.marker([lot.coords.lat, lot.coords.lng], {
    icon: mIcon
  });
  marker.bindPopup(popUpText);
  marker.bindLabel(label, {
    noHide: true,
    direction: lPosition,
    className: lClass
  });
  return marker;
}

function drawMap (data, map) {
  allMarker.forEach(function (marker) {
    map.removeLayer(marker); // remove all current markers, if they exist (important when switching cities)
  });

  data.lots
    .filter(function (lot) {
      return lot.coords != null; // remove those lots without coordinates (we cannot display them anyway)
    })
    .map(function (lot) {
      if (lot.state === 'unknown') { // every lot in unknown state mark as open
        lot.state = 'open';
      }
      return lot;
    })
    .map(createMarker) // convert lot to marker
    .forEach(function (marker) {
      marker.showLabel();
      marker.addTo(map);
      allMarker.push(marker);
    });
}

function cityToListElement (cid, city) {
  var li = document.createElement('li');
  var a = document.createElement('a');
  a.onclick = function () {
    location.hash = cid;
    renderCityData(cid, city);
  };
  a.setAttribute('href', '#' + cid);
  a.appendChild(document.createTextNode(city.name));
  li.appendChild(a);
  return li;
}

function renderSelects (cities) {
  var activeSupport = [];
  var noSupport = [];

  $.each(cities, function (cid, city) {
    if (city.active_support) {
      activeSupport.push(cityToListElement(cid, city));
    } else {
      noSupport.push(cityToListElement(cid, city));
    }
  });

  var drop = document.getElementById('ccity');
  drop.innerHTML = '';

  var currentCityLabel = document.createElement('span');
  currentCityLabel.className = 'currentCity';
  drop.appendChild(currentCityLabel);

  var caret = document.createElement('span');
  caret.className = 'caret';
  drop.appendChild(caret);
  var ul = document.getElementById('citychooser');
  ul.innerHTML = '';

  activeSupport.forEach(function (li) { ul.appendChild(li); });

  var separator = document.createElement('li');
  separator.className = 'divider';
  separator.setAttribute('role', 'separator');
  ul.appendChild(separator);
  var beta = document.createElement('li');
  beta.className = 'dropdown-header';
  beta.appendChild(document.createTextNode('BETA'));
  ul.appendChild(beta);

  noSupport.forEach(function (li) { ul.appendChild(li); });
}

function updateLinks (cityID, city) {
  $.each(document.getElementById('langlist').children, function(i, li){
    li.children[0].hash = '#' + cityID;
  });
  var title = document.getElementById('title');
  title.innerHTML = translate('mapTitle', city.name);
  document.querySelector('.currentCity').innerHTML = city.name;
}

function createMap () {
  var map = L.map('map');
  var tp = 'ls';
  if (L.Browser.retina) {
    tp = 'lr';
  }
  // var tilesUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var tilesUrl = 'https://tiles.lyrk.org/' + tp + '/{z}/{x}/{y}?apikey=78be313986c84fbfa6c188a1d1385303';
  L.tileLayer(tilesUrl, {
    attribution: 'Dank an <a href="https://github.com/ubahnverleih/parkenDD">ubahnverleih</a>, <a href="http://geodienste.lyrk.de/copyright">OpenStreetMap und andere</a>, Tiles by <a href="http://geodienste.lyrk.de/">Lyrk</a>',
    maxZoom: 18
  }).addTo(map);
  map.on('moveend', function () { onMove(map); });
  return map;
}

function renderCityData (cid, city) {
  try{
    updateLinks(cid, city);
  }catch(err){
    console.log(err);
  }
  map.setView([city.coords.lat, city.coords.lng], 15);
  loadParkData(cid, map);
}

function loadParkData (city, map) {
  $.getJSON('https://api.parkendd.de/' + city, function (data) {
    drawMap(data, map);
  });
}

function loadInitialData (callback) {
  $.getJSON('https://api.parkendd.de', callback);
}

var map = null;
var allMarker = []; // holder for all currently displayed markers

$(document).ready(function () {
  var cid = location.hash.replace('#', '') || 'Dresden'; // get cid from hash or fallback to Dresden
  loadInitialData(function (data) {
    map = createMap();
    try{
      renderSelects(data.cities);
    }catch(err){ //if rendering the selection buttons fails, expect to be on the start page
      map.on('moveend', function(){onMove();});
      map.scrollWheelZoom.disable();
      var lltl = document.getElementsByClassName("leaflet-top leaflet-left")[0];
      lltl.style.visibility = "hidden";
    }
    var currentCity = data.cities[cid];
    renderCityData(cid, currentCity);
  });
});
