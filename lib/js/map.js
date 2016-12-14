var translations = {
  de: {
    closed:'Parkplatz geschlossen.',
    noData: 'Keine Daten verfügbar.',
    available: '{} von {} Parkplätzen sind noch frei.'
  },
  en: {
    closed:'Closed.',
    noData: 'No data available.',
    available: '{} of {} parking lots are free.'
  }
}

var language = document.head.querySelector("[http-equiv='Content-Language']").content || 'de';

function translate(key) {
  var args = [].slice.apply(arguments).slice(1);
  var value = translations[language][key] || key;
  args.forEach(function(arg){
    value = value.replace('{}', arg);
  });
  return value;
}

function createIcon(image) {
  var basePath = './media/icons/';
  if(language != 'de') {
    basePath = basePath.replace('.', '..');
  }
  return L.icon({
  	iconUrl: basePath + image,
  	iconSize: [32, 20],
  	iconAnchor: [9, 9],
  	popupAnchor: [0, -9],
  	labelAnchor: [-12,1]
  });
}

var greyIcon = createIcon('silver.png');
var yellowIcon = createIcon('yellow.png');
var greenIcon = createIcon('green.png');
var blueIcon = createIcon('blue.png');
var redIcon = createIcon('red.png');

var allMarker = [];
var url = "https://api.parkendd.de/"

function onMove(map) {
	$.each(allMarker, function(key , marker) {
		if (map.getZoom() < 14) {
			marker.hideLabel();
		}
		else {
			marker.showLabel();
		}
	});
}

function drawMap(data, map){
  var lots = data.lots;
  for(var i = 0; i < lots.length; i++){
    try{
      if(lots[i].state == "unknown"){
        lots[i].state = "open";
      }
      switch(lots[i].state){
        case "open":
          perc = lots[i].free / lots[i].total;
          if(perc < 0.05){
            var mIcon = redIcon;
            var lClass = 'labelred';
          }else if(perc < 0.2){
            var mIcon = yellowIcon;
            var lClass = 'labelyellow';
          }else{
            var mIcon = greenIcon;
            var lClass = 'labelgreen';
          }
          var popUpText = "<strong>" + lots[i].name + "</strong><br>" + translate('available', lots[i].free, lots[i].total);
          var label = lots[i].free.toString();
          break;
        case "closed":
          var mIcon = redIcon;
          var lClass = 'labelred';
          var popUpText = "<strong>" + lots[i].name + "</strong><br>"+translate('closed');
          var label = '<span style="margin-left:5px;">\u20e0</span>';
          break;
        default:
          var mIcon = blueIcon;
          var lClass = 'labelblue';
          var popUpText = "<strong>" + lots[i].name + "</strong><br>"+translate('noData');
          var label = "P";
          break;
      }
      var lPosition = "right";
      if(lots[i].id == "dresdentaschenbergpalais"){
        lPosition = "left";
      }
      var m = L.marker([lots[i].coords.lat, lots[i].coords.lng], {
        icon: mIcon
      })

      m.bindPopup(popUpText);
      m.bindLabel(label ,{
      noHide: true,
      direction: lPosition,
      className: lClass
      });
      m.showLabel();
      m.addTo(map);
      allMarker.push(m);
    }catch(err){}
  }
}

function appendCities(initdata, cities, ul) {
  for(var i = 0; i < cities.length; i++){
    li = document.createElement("li");
    a = document.createElement("a");
    a.setAttribute("href", "#" + cities[i]);
    a.setAttribute("onClick", "location.hash = \"" + cities[i] + "\"; location.reload();")
    a.appendChild(document.createTextNode(initdata.cities[cities[i]].name));
    li.appendChild(a);
    ul.appendChild(li);
  }
}

function loadParkData(city, map) {
  $.getJSON(url + city, function(data) {
      drawMap(data, map);
  });
}

function loadInitialData(callback) {
  $.getJSON('https://api.parkendd.de', callback);
}

function renderSelects(cid, initdata) {
  var cities = Object.keys(initdata.cities);
  var active_support = [];
  var no_support = [];
  for(var i = 0; i < cities.length; i++){
    if(initdata.cities[cities[i]].active_support){
      active_support.push(cities[i]);
    }else{
      no_support.push(cities[i]);
    }
  }

  var lang = document.getElementById("lang");
  lang.setAttribute("href", "en/map.html#" + cid);
  var title = document.getElementById("title");
  title.innerHTML = "Karte - " + initdata.cities[cid].name;
  var drop = document.getElementById("ccity");
  drop.appendChild(document.createTextNode(initdata.cities[cid].name));
  var caret = document.createElement("span");
  caret.className = "caret";
  drop.appendChild(caret);
  var ul = document.getElementById("citychooser");
  appendCities(initdata, active_support, ul);
  var separator = document.createElement("li");
  separator.className = "divider";
  separator.setAttribute("role", "separator");
  ul.appendChild(separator);
  var beta = document.createElement("li");
  beta.className = "dropdown-header";
  beta.appendChild(document.createTextNode("BETA"));
  ul.appendChild(beta);
  appendCities(initdata, no_support, ul);
}

function createMap(city) {
    var map = L.map('map').setView([city.coords.lat, city.coords.lng], 15);
    if(L.Browser.retina) var tp = "lr";
    else var tp = "ls";
    // var tilesUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var tilesUrl = 'https://tiles.lyrk.org/'+tp+'/{z}/{x}/{y}?apikey=78be313986c84fbfa6c188a1d1385303';
    L.tileLayer(tilesUrl, {
      attribution: 'Dank an <a href="https://github.com/ubahnverleih/parkenDD">ubahnverleih</a>, <a href="http://geodienste.lyrk.de/copyright">OpenStreetMap und andere</a>, Tiles by <a href="http://geodienste.lyrk.de/">Lyrk</a>',
      maxZoom: 18
    }).addTo(map);
    map.on('moveend', function(){onMove(map);});
    return map;
}


$(function() {
  var cid = location.hash.replace("#", "") || 'Dresden';

  loadInitialData(function(initdata) {
    var city = initdata.cities[cid];
    var map = createMap(city);
    renderSelects(cid, initdata);
    loadParkData(cid, map);
  });
});
