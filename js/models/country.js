/**
 * Country prototype
 */
export const Country = {
    // CRUD urls
    URL_LIST: 'cp/crud/country/list',

    /**
     * Returns empty object
     *
     * @return object
     */
    getEmpty () {
        return {
            id: '',
            name: ''
        };
    },

    /**
     * Object validator
     *
     * @return boolean
     */
    validator (value) {
        return typeof value.id == 'string'
            && typeof value.name == 'string'
            && (value.id == '' || value.id.length == 2);
    },

    /**
     * ID validator
     *
     * @return boolean
     */
    idValidator (value) {
        return typeof value == 'string'
            && (value == '' || value.length == 2);
    },

    /**
     * Getting flag picture src
     *
     * @param id
     * @param size
     * @return string
     */
    getFlagSrc (id, size = 16) {
        return '/img/flags/' + size + '/' +
            (id ? id.toString().toLowerCase() : 'empty') + '.png';
    }
};
