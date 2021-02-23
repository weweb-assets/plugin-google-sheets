<template>
    <div class="ww-popup-google-sheets-sync">
        <button
            class="google-sheets-sync__all ww-editor-button -primary -green"
            @click="syncAll"
            :disabled="isFetching"
        >
            <div v-if="!isFetching">Synchronize all</div>
            <div v-else>Fetching...</div>
        </button>
        <div class="google-sheets-sync__row" v-for="(sheet, index) in settings.privateData.sheets" :key="index">
            <div class="paragraph-m">{{ sheet.name }}</div>
            <div class="caption-m m-auto-left">
                <template v-if="!isSheetFetching(sheet)">
                    <template v-if="getSource(sheet).lastSyncDate">
                        {{ getSource(sheet).lastSyncDate | dateFromNow }}
                    </template>
                    <template v-else>never synchronized</template>
                </template>
            </div>
            <button
                :disabled="isSheetFetching(sheet)"
                class="ww-editor-button -primary -green -small m-left"
                @click="sync(sheet)"
            >
                <div v-if="!isSheetFetching(sheet)">Synchronize sheet</div>
                <div v-else>Fetching...</div>
            </button>
        </div>
        <div class="google-sheets-sync__separator"></div>
    </div>
</template>

<script>
import moment from 'moment';

export default {
    name: 'SynchronizationPopup',
    props: {
        options: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    filters: {
        dateFromNow(date) {
            return moment(date).fromNow();
        },
    },
    data() {
        return {
            isFetching: false,
            sheetsFetching: [],
            settings: {
                privateData: {},
            },
        };
    },
    methods: {
        getSource(sheet) {
            return wwLib.$store.getters['cms/getData'][sheet.id] || {};
        },
        isSheetFetching(sheet) {
            return this.sheetsFetching.indexOf(sheet.id) !== -1;
        },
        sheetFetching(sheet, value) {
            if (value) {
                this.sheetsFetching.push(sheet.id);
            } else {
                const index = this.sheetsFetching.indexOf(sheet.id);
                if (index !== -1) this.sheetsFetching.splice(index, 1);
            }
        },
        async sync(sheet) {
            this.sheetFetching(sheet, true);
            try {
                await wwLib.wwPlugin.saveCmsDataSet(
                    this.settings.id,
                    sheet.id,
                    sheet.name,
                    sheet.displayBy,
                    'GoogleSheets'
                );

                wwLib.wwNotification.open({
                    text: {
                        en: `Sheet "${sheet.name}" succesfully fetched`,
                    },
                    color: 'green',
                });
            } catch (err) {
                wwLib.wwNotification.open({
                    text: {
                        en: 'An error occured, please try again later.',
                        fr: 'Une erreur est survenue. Veuillez réessayer plus tard.',
                    },
                    color: 'red',
                });
                wwLib.wwLog.error(err);
            }
            this.sheetFetching(sheet, false);
        },
        async syncAll() {
            this.isFetching = true;
            for (const sheet of this.settings.privateData.sheets) await this.sync(sheet);
            this.isFetching = false;
        },
    },
    created() {
        this.settings = this.options.data.settings;
    },
};
</script>

<style scoped lang="scss">
.ww-popup-google-sheets-sync {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: var(--ww-spacing-03) 0;
    .google-sheets-sync {
        &__all {
            margin: 0 auto var(--ww-spacing-02) auto;
        }
        &__row {
            display: flex;
            align-items: center;
            margin-bottom: var(--ww-spacing-04);
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
