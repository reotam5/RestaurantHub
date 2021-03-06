## My Web Application (Title)

* [General info](#general-info)
* [Technologies](#technologies)
* [Contents](#content)

## General Info
Our app allows users to browse and find restaurants, view restaurant specific information
including COVID-19 related precautions, and make reservations. It is designed to be the
only app or information source that the user needs to make dining plans.

## Contributers
* Reo Tamai (reotam5)
* KevinNha
* s-lando
	
## Technologies
Technologies used for this project:
* HTML, CSS
* JavaScript
* Bootstrap 
* jQuery

## Resources
Logos are from <a href="https://icooon-mono.com/?lang=en">Icooon Mono</a>
<!-- Temporary restaurants' pictures are from <a href="unsplash.com">Unsplash</a> -->
Restaurant images are from respective restaurant websites.
A Map API we used: <a href="https://www.mapbox.com/">MapBox</a><br/>

## Content
Content of the project folder:

```
 Top level of project folder: 
├── .gitignore               # Git ignore file
├── index.html               # main page with list of restaurants
├── favorite.html            # page for displaying list of favorited restaurnts.(require logged in)
├── profile.html             # page for user profile
├── restaurant.html          # page for restaurant information (restaurant.html?req=REST_ID displays information about restaurnt with id REST_ID)
├── login.html               # Log in page.(only email login supproted)
├── maptest.html             # an ongoing developing page for map feature.
├── template
    /loading.html             # loading screen template
    /restaurntOwner.html      # A temporary page for debugging purpose. It allows adding a restaurnt in firebase.
    /universalTemplate.html   # page for shared work. (ex. header, slidebar...)
└── README.md

It has the following subfolders and files:
├── .git                     # Folder for git repo
├── images                   # Folder for images
    /calender.png
    /close.png
    /darkStar.png
    /favorite.png
    /delete.png
    /edit.png
    /home.png
    /logo.png
    /location.png
    /login.png
    /go-to-favourites.png
    /map.png
    /menu.png
    /person.png
    /star.png
    /tableTracker.png
    /verifiedHours.png
├── scripts                  # Folder for scripts
    /favorite.js             # get and display user favorite restuarnt list
    /firebase_api.js         # contains api key for firebase
    /loading.js              # loading page animation
    /login.js                # firebase auth UI
    /main.js                 # lists all restaurants. Also has search, filter, sorting option.
    /map.js                  # Creates map
    /profile.js              # get user information including name, profile img, upcoming reservations, and reservatino history.
    /restaurant.js           # get restaurant information from REST_ID in url parameter, and display.
    /restaurantOwner.js      # add restaurant to restaurants collection.
    /universal.js            # contain universally used functions. (sign in prompt)
    ├── classes              # Folder for classes
        /Restaurant.js       # a class that holds necessary information about a restaurnt to display in restaurnat.html
├── styles                   # Folder for styles
    /favorite.css            # css for favorite.html
    /loading.css             # css for loading.html
    /mainPallette1.css       # green dark theme
    /mainPallette2.css       # yellow light theme
    /mainPallette3.css       # green light theme
    /profile.css             # css for profile.html
    /restaurant.css          # css for restaurant.html
    /universal.css           # styles universal contents.  


```


