#!/usr/bin/python3
""" Starts a Flash Web Application """
from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
from os import environ
from flask import Flask, render_template
from uuid import uuid4


app = Flask(__name__)
# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True

@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()


@app.route('/3-hbnb/', strict_slashes=False)
def hbnb():
    """ HBNB is Working! """
    # Having all states from storage
    states = storage.all(State).values()
    # Sorted the states depending on their names
    states = sorted(states, key=lambda k: k.name)
    # Empty list to resort the states on the city names
    st_ct = []
    # Looping over the states
    for state in states:
        # Add new element to the list after sorting depenging on the city name
        st_ct.append([state, sorted(state.cities, key=lambda k: k.name)])

    # Having all amenities
    amenities = storage.all(Amenity).values()
    # Sorting all amenities on their name
    amenities = sorted(amenities, key=lambda k: k.name)

    # Having all places
    places = storage.all(Place).values()
    # Sorting places on their names
    places = sorted(places, key=lambda k: k.name)

    # Rendreing the HTML
    return render_template('3-hbnb.html',
                           states=st_ct,
                           amenities=amenities,
                           places=places,
                           cache_id=uuid4())


if __name__ == "__main__":
    """ The Main Function """
    app.run(host='0.0.0.0', port=5000)
