##################
Static Models
##################

Placed at ``/basepath/models/static/``, static models help you with the kind of data that doesn't change that much or even never change, like timezones' names or categories, static models are available in backend and will be comming soon to frontend, in that way you can pretty easily list in a select box and save only a number in the db, relative at the position in the array, saving in that way the overheat of have a string or even worst another joined table. 

******************
Example
******************

.. code-block:: typescript
   :linenos:

    export enum TimeZones {
        "Africa/Abidjan",
        "Africa/Accra",
        "Africa/Addis_Ababa",
        "Africa/Algiers",
        "Africa/Asmara",
        "Africa/Asmera",
        "Africa/Bamako",
        ...
        "Zulu"
    };