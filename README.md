# Online Versions of MOT & UFOV Tasks

This is the code used for running the online versions of the Multiple Object Tracking (MOT) and Useful Field of View (UFOV) tasks, as described in the video/paper [Methods to Test Visual Attention Online](http://www.jove.com/video/52470/methods-to-test-visual-attention-online).

## Setup

To run this web application, you will need to upload all of the files to a web server with PHP and a MySQL database. If you are unfamiliar with this process, there are many tutorials available online to get you started. We currently have our web server set up using [Amazon Web Services](https://aws.amazon.com/), which also provides a [tutorial on how to setup a LAMP (Linux-Apache-MySQL-PHP) server](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/install-LAMP.html).

You will also need to fill in your own MySQL user credentials in the file `php_utils/connectToDB.php` so that you can connect to your database properly.

Additionally, the file `db/db-structure.sql` is a replica of our MySQL database's structure. If you import this .sql file into your database, you can then have a matching database structure to ensure all of the PHP scripts accessing the database work as intended.


#### Disclaimer
Unfortunately due to time constraints, I am unable to offer much assistance to those seeking help with using this code. However, I hope the comments throughout the code will be useful!


## Code Structure

The code is mainly split up using directories for the different tasks. The files are organized as follows.

__General use files:__
* db/db-structure.sql
* php_utils/connectToDB.php

__Files for the login/task selection page:__
* index.php
* style.css
* login.js
* checkid.php

__Files for the calibration procedure:__
* Calibration/index.php
* Calibration/calibrationcode.js
* Calibration/addcalibration.php
_Image files in:_
* Calibration/img

__Files for MOT:__

_Practice files:_
* MOT/practice.php
* MOT/practicestyle.css
* MOT/practicecode.php
* MOT/practicecode.js
* MOT/savePractice.php

_Full task files:_
* MOT/index.php
* MOT.exptstyle.css
* MOT/code.php
* MOT/code.js
* MOT/save.php
* MOT/trialorder.txt
* js_utils/seedrandom.js

_Image files in:_
* MOT/img

__Files for UFOV:__

_Practice files:_
* UFOV/practice.php
* UFOV/practicestyle.css
* UFOV/practicecode.php
* UFOV/practicecode.js
* UFOV/savePractice.php

_Full task files:_
* UFOV/index.php
* UFOV/exptstyle.css
* UFOV/code.php
* UFOV/code.js
* UFOV/save.php

_Image files in:_
* UFOV/img
