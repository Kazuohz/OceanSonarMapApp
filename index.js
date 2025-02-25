"use strict";
(function() {
    const URL = "http://localhost:8000/sonar";
    window.addEventListener("load", init);

    function init() {
        genMap();
    }

    function genMap() {
        
        const map = new maplibregl.Map({
            container: "map",
            style: "https://demotiles.maplibre.org/style.json",
            center: [0, 0],
            zoom: 1
        });

        map.on('load', async () => {
            const image = await map.loadImage('https://upload.wikimedia.org/wikipedia/commons/7/7c/201408_cat.png');
            // const image = await map.loadImage('marker.png');
            map.addImage('cat', image.data);
            map.addSource('point', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            "properties": {
                                "description":
                                    '<strong>A Little Night Music</strong><p>The Arlington Players\' production of Stephen Sondheim\'s <em>A Little Night Music</em> comes to the Kogod Cradle at The Mead Center for American Theater (1101 6th Street SW) this weekend and next. 8:00 p.m.</p>'
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [0, 0]
                            }
                        }
                    ]
                }
            });

            map.addLayer({
                'id': 'points',
                'type': 'symbol',
                'source': 'point',
                'layout': {
                    'icon-image': 'cat',
                    'icon-size': 0.25
                }
            });

            map.on('click', 'points', (e) => {
                // Change the cursor style as a UI indicator.
                map.getCanvas().style.cursor = 'pointer';

                const coordinates = e.features[0].geometry.coordinates.slice();
                const description = e.features[0].properties.description;

                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                new maplibregl.Popup().setLngLat(coordinates).setHTML(description).addTo(map);

                makeRequest("/test/5");
            });

            map.on('mouseenter', 'points', () => {
                map.getCanvas().style.cursor = 'pointer';  
            });

            map.on('mouseleave', "points", () => {
                map.getCanvas().style.cursor = "";
            })
        });
    }

    function loadEchogram(data) {
        console.log(data);
        console.log("hello world");
    }

    /**
     * Status checking method that checks feasiblity of usage.
     * @param {data} res Data to be checked.
     * @returns {data} Data that is checked.
     */
    async function statusCheck(res) {
        if (!res.ok) {
            throw new Error(await res.text());
        }
        return res;
    }

    async function makeRequest(data) {
        try {
            let res = await fetch(URL + data);
            await statusCheck(res);
            res = await res.text();
            loadEchogram(res);
        } catch(error) {
            console.error("Error:", error);
        }
    }

    /**
     * Helper method designed to shorten the process of calling HTML elements via ID name.
     * @param {HTML_ID_NAME} id Name of the ID.
     * @returns {HTML_ELEMENT} HTML element with matching ID.
     */
    function id(id) {
        return document.getElementById(id);
    }

    /**
     * Helper method designed to shorten the process of calling HTML elements via selector name.
     * @param {HTML_SELECTOR_NAME} selector Name of the selector.
     * @returns {HTML_ELEMENT} HTML element with matching selector.
     */
    function qs(selector) {
        return document.querySelector(selector);
    }

    /**
     * 
     * @param {HTML_SELECTOR_NAME} selector Name of group of selector elements. 
     * @returns {HTML_ELEMENT} List of HTML elements with matching selectors.
     */
    function qsa(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * Helper method designed to shorten the process of creating HTML elements.
     * @param {HTML_ELEMENT_NAME} tagName Name of the created element.
     * @returns {HTML_ELEMENT} Created HTML element.
     */
    function gen(tagName) {
        return document.createElement(tagName);
    }
})();
