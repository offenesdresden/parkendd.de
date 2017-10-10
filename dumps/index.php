    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
        <meta name="description" content="">
        <meta name="author" content="">
        <meta http-equiv="Content-Language" content="en">
        <link rel="icon" href="../media/icon.png">
        <title id="title">ParkenDD</title>
        <!-- Bootstrap core CSS -->
        <link href="../lib/css/bootstrap.min.css" rel="stylesheet">
        <link href="../lib/css/languages.min.css" rel="stylesheet">
        <!-- Custom styles for this template -->
        <link href="../lib/css/carousel.css" rel="stylesheet">
      </head>
    <!-- NAVBAR
    ================================================== -->
      <body>
        <div class="navbar-wrapper">
          <div class="container">
            <nav class="navbar navbar-inverse navbar-static-top">
              <div class="container">
                <div class="navbar-header">
                  <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                  </button>
                  <a class="navbar-brand" href="index.html" style="padding-top: 3px; padding-bottom: 3px; height: 44px;">
                    <img alt="ParkenDD" src="../media/icon44.png">
                  </a>
                </div>
                <div id="navbar" class="navbar-collapse collapse">
                  <ul class="nav navbar-nav">
                    <li><a href="https://parkendd.de">ParkenDD</a></li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>

        <div class="container" style="margin-top:100px;">
            <div class="panel panel-default">
                <div class="panel-heading">
                    Dumps of the database from parkendd.de
                </div>
                <div class="panel-body">
                    <p>Format:
                        UTC timestamp,number of free lots</p>

<p>If larger timespans have 0 free lots, the parking spot isn't necessary full.
    It could also be closed or don't have live data for this time.</p>

<p>If you want to get all data please download <a href="Archive.tar.xz">Archive.tar.xz</a>
    It's a compressed archive of all *.csv dumps.</p>
                </div>
            </div>
            <ul class="list-group">
                <?php
                    function human_filesize($bytes, $decimals = 2) {
                        $sz = 'BKMGTP';
                        $factor = floor((strlen($bytes) - 1) / 3);
                        return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)) . @$sz[$factor];
                    }
                    $files = array_filter(glob('*'), 'is_file');
                    if(($index = array_search("index.php", $files)) != false){
                        unset($files[$index]);
                    }
                    asort($files);
                    foreach($files as $file){
                        echo '<a href="'.$file.'" class="list-group-item" download>'.$file.'<span class="badge">'.human_filesize(filesize($file)).'</span></a>';
                    }
                ?>
            </ul>

            <!-- FOOTER -->
            <footer>
                <p><a href="https://parkendd.de">ParkenDD</a></p>
            </footer>
        </div>



        <!-- Bootstrap core JavaScript
        ================================================== -->
        <!-- Placed at the end of the document so the pages load faster -->
        <script src="../lib/js/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="lib/js/jquery.min.js"><\/script>')</script>
        <script src="../lib/js/bootstrap.min.js"></script>
          <!-- Piwik -->
        <script type="text/javascript">
          var _paq = _paq || [];
          _paq.push(["setDomains", ["*.parkendd.de","*.parkendd.de"]]);
          _paq.push(['trackPageView']);
          _paq.push(['enableLinkTracking']);
          (function() {
            var u="//piwik.jkliemann.de/";
            _paq.push(['setTrackerUrl', u+'piwik.php']);
            _paq.push(['setSiteId', 2]);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
          })();
        </script>
        <noscript><p><img src="//piwik.jkliemann.de/piwik.php?idsite=2" style="border:0;" alt="" /></p></noscript>
        <!-- End Piwik Code -->
      </body>
    </html>
