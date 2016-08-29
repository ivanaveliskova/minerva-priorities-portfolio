    // Sets the items into a list with respective IDs (although theoretically this could be set up without the use of IDs)
var listemize = function($inputValue) {
        var $listItems = $('.listItems');
        var itemId = $('.listItems li').length + 1;


        $listItems.append("<li id='item-"+itemId+"'>" + $inputValue + "<a data-remove-item='' class='remove'>X</a></li>");

        getOrder();
    },

    // This function takes the list input and whenever the button is submitted/clicked it will update the list
    listInput = function() {
        // Sets up variables

        var $input = $('#todo'),
            $button = $('[type=submit]');

        // Checks if the page has the input otherwise it will not run the rest of the function
        if( $input.length === 0 ) { return; }

        $button.on('click', function(e) {
            e.preventDefault();
            // Moar var setup
            var $inputValue = $input.val();

            // Initializes the list
            listemize($inputValue);
            // Initializes the ability to remove items from the list only after the list is created 
            // (because the remove buttons don't exist then)
            removeItems();
            
            // Clears input
            $input.val('');


        });
    },

//------------------------------ COOKIE SESSION SAVES
    // set the list selector
    setSelector = "#toDoList",
    // set the cookie name
    setCookieName = "MinervaPriorities",
    // set the cookie expiry time (days):
    setCookieExpiry = 7,
 

    // This function gets the items in the list and saves it to a cookie
    getOrder = function() {

        var $listItems = $(setSelector).sortable("toArray"),
            $listValues = [];

        for (var i = 0; i < $listItems.length; i++) {
            // Removes the inner anchor tag with the x to not be included in the saved list
            var $currentValue = $('#' + $listItems[i]).clone().children().remove().end().text();
            // sets array to be equal to the text inside each list item's ID
            $listValues[i] = $currentValue;
        }

        // Sets array to be cookie. The cookie will remove any white space and replace it with special characters
    	$.cookie(setCookieName, $listValues, { expires: setCookieExpiry, path: "/" });
    },

    // Used to delete unneeded cookie
    // This function isn't used at all, but it is set up here to be used when testing out the cookies
    delete_cookie = function( name ) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },

    getPastList = function() {
        var $button = $('[data-find-cookie]');
        // This takes the past list button and on click will find the previously set cookie, replace special characters with white space and set it to an array.
        // Then using the array, it will recreate the list of tasks
        $button.on('click', function(e) {
            e.preventDefault();

            var cookieData = getCookie(setCookieName);

            // If no cookie data exists it will return and not send back an empty list.
            if (cookieData.length === 0 ) { return; }

            var array = cookieData.replace(/%20/g, ' ').split('%2C');

            for (var i = 0; i < array.length; i++) {
                listemize(array[i]);
            }

            removeItems();
        });
    },

    // This function finds a cookie by the name
    getCookie = function(name) {
        var re = new RegExp(name + "=([^;]+)");
        var value = re.exec(document.cookie);
        return value ? value[1] : '';
    },

    // This function will remove items on the list
    removeItems = function() {
        $('[data-remove-item]').on('click', function(e) {
            e.preventDefault();
            var $this = $(this);

            $this.parent().remove();

            getOrder();

        });
    };





// Starts running all the functions

// code executed when the document loads
$(function() {
	// here, we allow the user to sort the items
	$(setSelector).sortable({
		axis: "y",
		cursor: "move",
		update: function() { getOrder(); }
	});
});

getPastList();

listInput();
