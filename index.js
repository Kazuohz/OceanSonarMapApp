"use strict";
(function() {
    const URL = "http://localhost:8000/sonar";
    window.addEventListener("load", init);

    function init() {
        getCall("/maps");
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

    function getCall(data) {
        fetch(data)
            .then(statusCheck)
            .then(res => res.json())
            .then(function(res) {
                if (data === "/maps") {
                    initPage(res);
                } else {
                    loadEchogram(res);
                }
            })
            .catch(handleError);
    }

    /**
     * Displays to the user that an error has occured.
     */
    function handleError() {
        let paragraph = gen("p");
        paragraph.textContent = "Something is wrong. Please refresh the page.";
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