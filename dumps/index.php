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

<p>If you want to get all data please download <a href="Archive.tar.xz" download>Archive.tar.xz</a>
    It's a compressed archive of all *.csv dumps.</p>
<p>The files annotated with <code>backup-2015</code> are a backup from another instance and reach back to July 2015.</p>
                </div>
            </div>
            <ul class="list-group">
                <?php
                    function human_filesize($bytes, $decimals = 2) {
                        $sz = 'BKMGTP';
                        $factor = floor((strlen($bytes) - 1) / 3);
                        return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)) . @$sz[$factor];
                    }
                    echo '<a href="Archive.tar.xz" class="list-group-item" download>Archive.tar.xz<span class="badge">'.human_filesize(filesize("Archive.tar.xz")).'</span></a>';
                    echo '<a href="Backup2015.tar.xz" class="list-group-item" download>Backup2015.tar.xz<span class="badge">'.human_filesize(filesize("Backup2015.tar.xz")).'</span></a>';
                    $files = array_filter(glob('*.csv'), 'is_file');
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
        <script async defer data-domain="parkendd.de" src="https://geiger.kernkraftwerk.lol/js/plausible.js"></script>
      </body>
    </html>
