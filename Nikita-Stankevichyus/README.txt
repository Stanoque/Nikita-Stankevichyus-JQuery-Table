Greetings!
Welcome to "jQuery Table" browser application.
------------------------------------------------------------------------------------------------------------------------------------------------------------

This application uses browserify utilite to form bundle from all JavaScript files via 'browserify' CLI command.
It was meant to implement gulp and SASS into project, but it didn't work out yet.


Terms:

static element -- which is rendered regardless of application state (hard-coded into html file).
dynamic element -- which rendering depends on application state.
semi(s) -- comma(s). For whatever reason I call comma char a "semi". It is almost impossible to fix now.


Documentation:

1. file-dependencies.html -- diagramm of file dependencies in HTML format.
2. class-object-relations.html -- diagramm of class and object relations in HTML format.



File structure:

index.css -- basic (spaghetti) css code. Some styles beyond bootstrap functionality.
index.html -- basic html template with hard-coded static elements and storaged dynamic ones (lodash templates).
index.js -- imports all other JS files, defines a Object.prototype method and renders static elements.
bundle.js -- file generated via 'browserify' CLI command. It is included into index.html, not index.js.

  src/javascript:
    class_formSearch.js -- class corresponding to search form.
    const_serverResponseTime.js -- const meaning imitational server response time.
    good_local_object.js -- constructor of local object representing product data gotten from server or user.
    list_local_object.js -- list local object that manages dynamic elements of the page.
    row_local_object.js -- dynamic element of the row table.

      ./abstract_class_form
        abstract_class_form.js -- abstract class from which all forms' classes and subclasses inherit.

      ./price_vidget
        cleanPriceString.js -- simple function cleaning string from dollar and comma signs.
        putSemi.js -- function puts commas each digit in numerical string.
        vidget_price.js -- formats price from number to dollar string format and vice versa.


Known issues:

1. Not all async methods are implemented, only promises.
2. FormGood subtree hierarchy is rough around the edges.
3. Delivery vidget is almso rough around the edges.
4. CSS code has unsatisfactory quality. But it can be neglected due to simple styles and bootstrap. 