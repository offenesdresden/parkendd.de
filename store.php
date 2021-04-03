<?php
  $useragent = $_SERVER['HTTP_USER_AGENT'];
  if(strpos($useragent, "iPhone") !== false || strpos($useragent, "iPad") !== false){
    header("Location: itms://itunes.apple.com/de/app/parkendd/id957165041");
  }elseif(strpos($useragent, "Windows NT 10.0") !== false || strpos($useragent, "Windows Phone 10.0") !== false){
    header("Location: ms-windows-store://pdp/?ProductId=9nblggh1p0sr");
  }elseif(strpos($useragent, "Android") !== false){
    header("Location: market://details?id=de.jkliemann.parkendd");
  }else{
    header("Location: https://parkendd.de");
  }
?>
