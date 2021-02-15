<template>
    <div class="ww-popup-spreadsheet-configuration">
        <template v-if="!profile">
            <label class="spreadsheet-configuration__label caption-s" for="api-key">
                Connection to Google
                <div class="spreadsheet-configuration__label-required">required</div>
            </label>
            <button class="ww-editor-button -primary" @click="authorize">Sign in</button>
        </template>
        <template v-else>
            <label class="spreadsheet-configuration__label caption-s" for="api-key"> Connnected as </label>
            <div class="spreadsheet-configuration__row spreadsheet-configuration__input">
                <img class="spreadsheet-configuration__image" :src="profile.picture" alt="" width="30" height="30" />
                <div class="caption-l m-left">{{ profile.name }}</div>
                <button class="ww-editor-button -primary -small m-auto-left" @click="authorize">Switch account</button>
            </div>
            <label class="spreadsheet-configuration__label caption-s" for="url-spreadsheet">
                Url
                <div class="spreadsheet-configuration__label-required">required</div>
            </label>
            <input
                type="text"
                name="url-spreadsheet"
                class="spreadsheet-configuration__input caption-m ww-editor-input -large"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                v-model="settings.privateData.url"
                @input="setSpreadsheetId"
            />
            <template v-if="settings.privateData.name">
                <label class="spreadsheet-configuration__label caption-s" for="name-spreadsheet">
                    Name
                    <div class="spreadsheet-configuration__label-required">optional</div>
                </label>
                <input
                    type="text"
                    name="name-spreadsheet"
                    class="spreadsheet-configuration__input caption-m ww-editor-input -large"
                    placeholder="Name"
                    v-model="settings.privateData.name"
                    disabled
                />
            </template>
        </template>
    </div>
</template>

<script>
import { GET_GOOGLE_AUTHORIZE, GET_GOOGLE_PROFILE, GET_GOOGLE_SPREADSHEET_META } from '../graphql';

export default {
    name: 'ConfigurationPopup',
    props: {
        options: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    data() {
        return {
            interval: undefined,
            isKeyHidden: true,
            profile: undefined,
            settings: {
                privateData: {
                    token: undefined,
                    url: undefined,
                    spreadsheetId: undefined,
                    name: undefined,
                    sheets: [],
                },
            },
        };
    },
    watch: {
        'settings.privateData.spreadsheetId'() {
            this.getSpreadsheetMeta();
        },
        'settings.privateData.name'() {
            this.options.setButtonState('SAVE', this.settings.privateData.name ? 'ok' : 'disabled');
        },
    },
    methods: {
        async authorize() {
            const { data } = await wwLib.$apollo.query({
                query: GET_GOOGLE_AUTHORIZE,
                variables: {
                    designId: wwLib.wwWebsiteData.getDesign().info.id,
                    pluginId: wwLib.wwPlugins.pluginSpreadsheet.id,
                    settingsId: this.settings.id,
                },
                fetchPolicy: 'no-cache',
            });
            this.profile = undefined;
            window.open(data.getGoogleAuthorize.data.authUrl, '_target');
            this.options.setLoadingStatus(true);
            this.interval = setInterval(this.getProfile, 1000);
        },
        async getProfile() {
            try {
                const { data } = await wwLib.$apollo.query({
                    query: GET_GOOGLE_PROFILE,
                    variables: {
                        designId: wwLib.wwWebsiteData.getDesign().info.id,
                        pluginId: wwLib.wwPlugins.pluginSpreadsheet.id,
                        settingsId: this.settings.id,
                    },
                    fetchPolicy: 'no-cache',
                });
                this.profile = data.getGoogleProfile.data.profile;
                wwLib.wwPlugins.pluginSpreadsheet.settings.privateData.token = data.getGoogleProfile.data.token;
                this.settings.privateData.token = data.getGoogleProfile.data.token;
                this.options.setLoadingStatus(false);
                clearInterval(this.interval);
            } catch (err) {
                this.profile = undefined;
                wwLib.wwLog.error(err);
            }
        },
        async getSpreadsheetMeta() {
            this.options.setLoadingStatus(true);
            try {
                const { data } = await wwLib.$apollo.query({
                    query: GET_GOOGLE_SPREADSHEET_META,
                    variables: {
                        designId: wwLib.wwWebsiteData.getDesign().info.id,
                        pluginId: wwLib.wwPlugins.pluginSpreadsheet.id,
                        settingsId: this.settings.id,
                        spreadsheetId: this.settings.privateData.spreadsheetId,
                    },
                });
                const { properties } = data.getGoogleSpreadsheetMeta.data;
                this.settings.privateData.name = properties.title;
            } catch (err) {
                wwLib.wwLog.error(err);
                wwLib.wwNotification.open({
                    text: {
                        en: "The spreadsheet coun't be found",
                    },
                    color: 'red',
                });
            }
            this.options.setLoadingStatus(false);
        },
        setSpreadsheetId() {
            const spreadsheetIdRegex = new RegExp('/spreadsheets/d/([a-zA-Z0-9-_]+)');
            const found = spreadsheetIdRegex.exec(this.settings.privateData.url);
            this.settings.privateData.spreadsheetId = found && found[1];
        },
        async beforeNext() {
            this.options.setLoadingStatus(true);
            try {
                const plugin = wwLib.wwPlugins.pluginSpreadsheet;
                plugin.settings = await wwLib.wwPlugin.saveSettings(
                    plugin.id,
                    plugin.settings.id,
                    this.settings.data,
                    this.settings.privateData
                );
            } catch (err) {
                wwLib.wwLog.error(err);
            }
            this.options.setLoadingStatus(false);
        },
    },
    created() {
        this.settings = this.options.data.settings || this.settings;
        this.options.result.settings = this.settings;
    },
    async mounted() {
        this.options.setButtonState('SAVE', this.settings.privateData.name ? 'ok' : 'disabled');
        this.options.setLoadingStatus(true);
        await this.getProfile();
        this.options.setLoadingStatus(false);
    },
    beforeDestroy() {
        clearInterval(this.interval);
    },
};
</script>

<style scoped lang="scss">
.ww-popup-spreadsheet-configuration {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .spreadsheet-configuration {
        &__label {
            display: flex;
            align-items: center;
            font-weight: 500;
            color: var(--ww-color-dark-500);
            margin-bottom: var(--ww-spacing-01);
            &-required {
                margin-left: auto;
                color: var(--ww-color-dark-400);
            }
        }
        &__link {
            color: var(--ww-color-blue-500);
            margin-left: var(--ww-spacing-02);
        }
        &__image {
            border: 2px solid var(--ww-color-blue-500);
            border-radius: 50%;
        }
        &__input {
            margin-bottom: var(--ww-spacing-03);
        }
        &__row {
            display: flex;
            align-items: center;
        }
        &__radio-label {
            margin-left: var(--ww-spacing-02);
        }
    }
    .m-auto-left {
        margin-left: auto;
    }
    .m-left {
        margin-left: var(--ww-spacing-02);
    }
}
</style>
