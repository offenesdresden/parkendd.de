<?php
  $useragent = $_SERVER['HTTP_USER_AGENT'];
  $trackurl = "https://piwik.jkliemann.de/piwik.php?idsite=2&rec=1&url=parkendd.de/store.php&action_name=Store/";
  if(strpos($useragent, "iPhone") !== false || strpos($useragent, "iPad") !== false){
    file_get_contents($trackurl."iOS");
    header("Location: itms://itunes.apple.com/de/app/parkendd/id957165041");
  }elseif(strpos($useragent, "Windows NT 10.0") !== false || strpos($useragent, "Windows Phone 10.0") !== false){
    file_get_contents($trackurl."Windows");
    header("Location: ms-windows-store://pdp/?ProductId=9nblggh1p0sr");
  }elseif(strpos($useragent, "Android") !== false){
    file_get_contents($trackurl."Android");
    header("Location: market://details?id=de.jkliemann.parkendd");
  }else{
    file_get_contents($trackurl."Other");
    header("Location: https://parkendd.de");
  }
?>