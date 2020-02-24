# Local install

For local use, you need a php server and a sql database. The easiest solution is to install one of the following package depending of your OS.

## For Windows

Install WAMP from http://localhost/online-visual-attention-fork

## For Linux

Install Apache, MySQL and PHP following this procedure https://doc.ubuntu-fr.org/lamp

## For OSX

Install MAMP from http://www.mamp.info/en/downloads

The *amp should be running after install, you can try by navigating to http://localhost inside your browser (Chrome or Firefox).
If you do not have the *amp welcome page, find the executable and start it.

# Clone the repository

Clone this repository directly inside the www folder of your *amp installation folder.

By default: 
- Windows: C:\wamp64\www
- Linux: /var/www/html
- osX: /Applications/MAMP/htdocs (more info: https://apple.stackexchange.com/questions/50590/mamp-html-source-folder/52917)

# Create a db

- Go to phpmyadmin (http://localhost/phpmyadmin/) and login, default Username: ***root***, no password.
    - Windows: http://localhost/phpmyadmin
    - OSX: http://localhost:8888/phpmyadmin
- Create a new database from the new command on the left pane.
- Add a name and Select ***utf8_general_ci*** 
- Inside your new DB, go to the SQL tab (second from the left)
- Copy the content of online-visual-attention/db/db-structure.sql inside the Run SQL query text area
- Click on the ***Go*** button on the bottom right

Your db is now ready to use

# Update server config

Inside online-visual-attention/php_utils/connectToDB.php, replace the DB config line with your connexion data.
For local usage with all default settings and database named `ova` use: 

```php
$bdd = new PDO('mysql:host=localhost;dbname=ova;', 'root', '');
```

# Go to the app

Everything is ready fo use, got to http://localhost/online-visual-attention to see your app running.

Remember to reload the page after every code change (ctrl+R / cmd+R)

# Support

If this procedure is incomplete od doesn't work for you, contact me at [pejoessel@gmail.com](mailto:pejoessel@gmail.com)
