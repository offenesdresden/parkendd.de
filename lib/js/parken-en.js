greyIcon = L.icon({
	iconUrl: '../media/icons/silver.png',
	iconSize: [32, 20],
	iconAnchor: [9, 9],
	popupAnchor: [0, -9],
	labelAnchor: [-12,1]
});

yellowIcon = L.icon({
	iconUrl: '../media/icons/yellow.png',
	iconSize: [32, 20],
	iconAnchor: [9, 9],
	popupAnchor: [0, -9],
	labelAnchor: [-12,1]
});

greenIcon = L.icon({
	iconUrl: '../media/icons/green.png',
	iconSize: [32, 20],
	iconAnchor: [9, 9],
	popupAnchor: [0, -9],
	labelAnchor: [-12,1]
});

blueIcon = L.icon({
  iconUrl: '../media/icons/blue.png',
  iconSize: [32, 20],
  iconAnchor: [9, 9],
  popupAnchor: [0, -9],
  labelAnchor: [-12,1]
});

redIcon = L.icon({
  iconUrl: '../media/icons/red.png',
  iconSize: [32, 20],
  iconAnchor: [9, 9],
  popupAnchor: [0, -9],
  labelAnchor: [-12,1]
});

allMarker = [];

url = "https://api.parkendd.de/"

function loadParkData(city){
  var req = new XMLHttpRequest();
  req.open("GET", url + city);
  req.onreadystatechange = function(){
    if(req.readyState == 4 && req.status == 200){
      drawMap(JSON.parse(req.responseText));
    }
  }
  req.send();
}

function drawMap(data){
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
          var popUpText = "<strong>" + lots[i].name + "</strong><br>" + lots[i].free.toString() + " of " + lots[i].total.toString() + " parking lots are free.";
          var label = lots[i].free.toString();
          break;
        case "closed":
          var mIcon = redIcon;
          var lClass = 'labelred';
          var popUpText = "<strong>" + lots[i].name + "</strong><br>Closed."
          var label = '<span style="margin-left:5px;">\u20e0</span>';
          break;
        default:
          var mIcon = blueIcon;
          var lClass = 'labelblue';
          var popUpText = "<strong>" + lots[i].name + "</strong><br>No data available.";
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



function onMove (){
	$.each(allMarker, function(key,marker){
		if (map.getZoom()<14){
			marker.hideLabel();
		}
		else {
			marker.showLabel();
		}
	});

	
}

//initial Call
$(function() {
  loadParkData(cid)
});
