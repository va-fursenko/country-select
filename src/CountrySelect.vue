<template>
    <div class="country-select__container">

        <div ref="inputContainer" class="country-select__input-container">
            <input
                type="text"
                class="country-select__input"
                maxlength="24"
                ref="input"
                :placeholder="placeholder"
                :title="title"
                v-model="caption"
                @click="toggleDropDown(true, false)"
                @keydown.char="toggleDropDown(true, true)"
                @keydown.delete="toggleDropDown(true, true)"
                @keydown.esc="toggleDropDown(false)"
                @keydown.enter="trySelectCountry()"
                @keydown.up="hoverNextCountry(false)"
                @keydown.down="hoverNextCountry(true)"
            >
            <img
                class="country-select__selected-flag"
                :src="flagSrc(value, 28)"
                :alt="value"
            >
            <div
                class="fa country-select__chevron"
                :class="{
                    'fa-chevron-down': !isDroppedDown,
                      'fa-chevron-up': isDroppedDown
                }"
                :title="(isDroppedDown ? 'Hide' : 'Show') + ' drop down countries list'"
                @click="toggleDropDown(!isDroppedDown, false); $refs.input.focus()"
            ></div>
        </div>

        <div
            ref="dropDown"
            class="country-select__drop-down"
            :class="{'country-select__has-options': droppedDown.length > 0}"
            v-show="isDroppedDown"
            @keyup.esc="toggleDropDown(false)"
        >

            <div
                class="country-select__empty"
                ref="emptyItem"
                v-if="allowEmpty"
                @click="selectCountry(null)"
            >
                <span>-</span>
            </div>

            <div
                v-for="(country, index) in droppedDown"
                :class="{'country-select__selected': dropDownHoveredIndex === index}"
                ref="droppedDownCountries"
                @click="selectCountry(country)"
                @mouseover="dropDownHoveredIndex = index"
            >
                <img
                    class="country-select__flag"
                    :src="flagSrc(country.id)"
                    :alt="country.id"
                    :title="country.name"
                >
                <span>{{ country.name }}</span>
            </div>

            <div
                v-if="!allowEmpty && droppedDown.length == 0"
                class="country-select__no-option"
            >
                <span>-</span>
            </div>

        </div>

    </div>
</template>

<script lang="babel">
    import { Country } from './models/country';
    import { App } from './common/app';

    /* Custom component event */
    const EVENT_DROP_DOWN_SHOW = 'drop-down-show';
    const EVENT_DROP_DOWN_HIDE = 'drop-down-hide';

    Vue.config.keyCodes = {
        char: [
            // space
            32,
            // a-z
            65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
            // A-Z
            97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
            // а-я
            1105, 1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102, 1103,
            // А-Я
            1025, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063, 1064, 1065, 1066, 1067, 1068, 1069, 1070, 1071,
        ]
    };

    export default {
        name: 'CountrySelect',

        // Obtained parameters
        props: {
            // Countries list
            countries: {
                type: Array,
                required: true
            },
            // Selected country id or empty string for no selected
            value: {
                type: String,
                validator: Country.idValidator,
                default: '',
                twoWay: true
            },
            // Text input placeholder
            placeholder: {
                type: String,
                default: ''
            },
            // Text input hint message
            title: {
                type: String,
                default: ''
            },
            // Flag, allows empty country
            allowEmpty: {
                type: Boolean,
                default: false
            },
            // Component DOM id
            id: {
                type: String,
                default: 'country'
            }
        },

        // Data store
        data () {
            return {
                // Public properties
                selected: Country.getEmpty(),

                // Component HTML options
                caption: '',

                // Component settings
                dropDownLimit: 0,

                // Inner properties
                isDroppedDown: false,
                dropDownHoveredIndex: null,
                dropDownByCaption: true
            };
        },

        // Computed properties
        computed: {
            /**
             * Get dropped down countries list
             */
            droppedDown () {
                if (this.caption == '' || !this.dropDownByCaption) {
                    return this.countries;
                }
                let selText = this.caption.toLowerCase(),
                    droppedDown = [];
                for (let i = 0; i < this.countries.length && (this.dropDownLimit == 0 || droppedDown.length <= this.dropDownLimit); i++) {
                    if (this.caption == '' || this.countries[i].name.substr(0, selText.length).toLowerCase() == selText) {
                        droppedDown.push(this.countries[i]);
                    }
                }
                return droppedDown;
            }
        },

        // Component's methods
        methods: {
            /**
             * Get flag's picture url
             *
             * @param countryId
             * @param size
             * @returns {string}
             */
            flagSrc (countryId, size = 16) {
                return Country.getFlagSrc(countryId, size);
            },

            /**
             * Finds country name by ID
             *
             * @param id
             * @return string
             */
            findCountry (id) {
                if (!id) {
                    return Country.getEmpty();
                }
                id = id.toUpperCase();
                for (let i = 0; i < this.countries.length; i++) {
                    if (this.countries[i].id == id) {
                        return this.countries[i];
                    }
                }
                return Country.getEmpty();
            },

            /**
             * Toggle drop down container visibility
             *
             * @param {Boolean} dropDown
             * @param {Boolean} byCaption
             */
            toggleDropDown (dropDown, byCaption = true) {
                if (dropDown == this.isDroppedDown) {
                    return;
                }
                // Show drop down list
                if (dropDown) {
                    this.dropDownByCaption = byCaption;
                    this.dropDownHoveredIndex = 0;
                    // Add global document click listener to handle focus lose event
                    document.addEventListener('click', this.documentClickHandler);
                    // Dispatch custom component event
                    this.$emit(EVENT_DROP_DOWN_SHOW);
                    //this.$refs.dropDown.dispatchEvent(new Event(EVENT_DROP_DOWN_SHOW));
                // Hide drop down list
                } else {
                    // Remove global document click listener
                    document.removeEventListener('click', this.documentClickHandler);
                    this.dropDownHoveredIndex = null;
                    // Dispatch custom component event
                    this.$emit(EVENT_DROP_DOWN_HIDE);
                    //this.$refs.dropDown.dispatchEvent(new Event(EVENT_DROP_DOWN_HIDE));
                }
                this.isDroppedDown = dropDown;
            },

            /**
             * Document click handler for drop down toggle
             *
             * @param event
             */
            documentClickHandler (event) {
                // Click coordinates matches drop down list or text input dimensions
                let onElement = App.eventOnElement(event, this.$refs.dropDown)
                    || App.eventOnElement(event, this.$refs.input);
                // If drop down list shown and any one of conditions successful, hide drop down list
                if (this.isDroppedDown && !onElement) {
                    event.preventDefault();
                    this.toggleDropDown(false);
                }
            },

            /**
             * Select option and hide drop down list
             *
             * @param country
             */
            selectCountry (country) {
                if (this.isDroppedDown) {
                    this.toggleDropDown(false);
                }
                this.dropDownHoveredIndex = null;
                if (!country) {
                    country = Country.getEmpty();
                }
                this.value = country.id;
                this.caption = country.name;
                this.selected = country;
                // Dispatch new input event with new value
                this.$emit('input', this.value);
            },

            /**
             * Select first dropped down country
             */
            trySelectCountry () {
                if (!this.isDroppedDown) {
                    return false;
                }
                if (this.droppedDown.length > 0) {
                    let index = this.dropDownHoveredIndex !== null ? this.dropDownHoveredIndex : 0;
                    this.selectCountry(this.droppedDown[index]);
                // Try select empty country if it's allowed
                } else if (this.allowEmpty) {
                    this.selectCountry(null);
                // If typed incorrect country name, select last valid country or empty country object
                } else {
                    this.selectCountry(this.selected);
                }
            },

            /**
             * Focus on one drop down option
             *
             * @param index
             */
            hoverCountry (index) {
                this.dropDownHoveredIndex = index;
                if (index >= 0 && typeof this.$refs.droppedDownCountries[index] != 'undefined') {
                    this.$refs.droppedDownCountries[index].scrollIntoView(false);
                    //this.showSelected(this.droppedDown[index]);
                } else if (index === -1 && this.allowEmpty) {
                    this.$refs.emptyItem.scrollIntoView(false);
                    //this.showSelected(null);
                }
            },

            /**
             * Focus on next one drop down option
             *
             * @param inc
             */
            hoverNextCountry (inc) {
                let index;
                if (this.dropDownHoveredIndex === null) {
                    index = inc ? (this.allowEmpty ? -1 : 0) : this.droppedDown.length - 1;
                } else if (inc && this.dropDownHoveredIndex === this.droppedDown.length - 1) {
                    index = this.allowEmpty ? -1 : 0;
                } else if (!inc && this.dropDownHoveredIndex === 0) {
                    index = this.droppedDown.length - 1;
                } else {
                    index = this.dropDownHoveredIndex + (inc ? 1 : -1);
                }
                this.hoverCountry(index);
            }
        },

        // Caption change watcher
        watch: {
            // After caption changing droppedDown countries should be alike
            caption (value) {
                this.dropDownByCaption = true;
            }
        },

        // Component create event handler
        created () {
            this.selected = this.findCountry(this.value);
            this.caption = this.selected.name;
            Vue.nextTick(() => {
                this.$refs.dropDown.style.width = this.$refs.inputContainer.getBoundingClientRect().width - 4 + 'px';
            });
        },

        // Component mounted event handler
        mounted () {
            // . . .
        },

        // Destroy component event handler
        beforeDestroy () {
            document.removeEventListener('click', this.documentClickHandler);
        }
    }
</script>

<style lang="css">
    /* Component container */
    div.country-select__container {
        display: inline-block;
        height: 36px;
    }
    div.country-select__drop-down > div > span {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 14px;
    }

    /* Text input container */
    div.country-select__input-container {
        display: block;
        clear:both;
    }

    /* Text input */
    input.country-select__input {
        height: 33px;
        position: relative;
        display: block;
        min-width: 250px;
        padding: 0 22px 0 39px;
        font-size: 14px;
        line-height: 1.42857143;
        color: #555;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
    }

    /* Selected country flag */
    img.country-select__selected-flag {
        float: left;
        position: relative;
        display: block;
        top: -31px;
        left: 7px;
    }

    /* Drop down chevron */
    div.country-select__chevron {
        cursor: pointer;
        float: right;
        position: relative;
        display: block;
        top: -26px;
        left: -10px;
        color: #555;
    }

    /* Drop down list container */
    div.country-select__drop-down {
        border: 1px solid lightgray;
        border-radius: 4px;
        position: absolute;
        display: block;
        background-color: white;
        padding: 2px 1px;
        margin-top: 1px;
        min-width: 250px;
        max-height: 300px;
        overflow-x: hidden;
        z-index: 1;
    }
    div.country-select__drop-down.country-select__has-options {
        overflow-y: scroll;
    }

    /* Country flag in drop down list */
    img.country-select__flag {
        margin: 0 6px 0 1px;
    }

    /* Drop down list option block */
    div.country-select__drop-down > div {
        width: 100%;
        height: 24px;
        vertical-align: middle;
        background-color: white;
        font-size: 14px;
    }

    /* Drop down list option */
    div.country-select__drop-down > div {
        border: 1px solid transparent;
        border-radius: 2px;
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    div.country-select__drop-down > div.country-select__selected,
    div.country-select__drop-down > div:hover
    {
        background-color: #eaeaea;
        border: 1px dashed #d1d1d1;
    }

    /* Empty drop down list */
    div.country-select__drop-down > div.country-select__no-option {
        text-align: center;
        color: #4F4F4F;
        border: none;
        background-color: #f5f5f5;
    }
    div.country-select__drop-down > div.country-select__no-option:hover {
        border: none;
        cursor: inherit;
        background-color: inherit;
    }

    /* Empty drop down list option */
    div.country-select__drop-down > div.country-select__empty {
        text-align: center;
    }

</style>