<template>
    <div v-if="isVisible" id="editorElement" :style="style" v-on:mousedown="stopMousedownPropagation" >
        <input v-if="uitype != '56'" style="width:100%;border-radius:4px;border:1.5px solid cornflowerblue;padding-left:7.5px" class="m-1" type="text" v-model="value" @input="setValue(value)">
        <div v-else-if="uitype == '56'" style="width:100%;" class="ml-2 mt-2">
            <input v-model="value" @change="setValue(value)" type="checkbox" class="toggle">
        </div>
        <button class="btn btn-danger btn-sm mb-1 ml-1" @click="finishEditing">Abbrechen</button>
        <button class="btn btn-success btn-sm mb-1 ml-1" @click="saveFieldData">Speichern</button>
    </div>
</template>
<script>
import { BaseEditorComponent } from '@handsontable/vue';
import { mapActions, mapState } from 'vuex'
export default {
    name: 'CustomEditor',
    extends: BaseEditorComponent,
    data(){
        return {
            // We'll need to define properties in our data object,
            // corresponding to all of the data being injected from
            // the BaseEditorComponent class, which are:
            // - hotInstance (instance of Handsontable)
            // - row (row index)
            // - col (column index)
            // - prop (column property name)
            // - TD (the HTML cell element)
            // - originalValue (cell value passed to the editor)
            // - cellProperties (the cellProperties object for the edited cell)
            hotInstance: null,
            TD: null,
            row: null,
            col: null,
            prop: null,
            originalValue: null,
            value: '',
            cellProperties: null,
            isVisible: false,
            uitype : null,
            style: {
                position: 'absolute',
                // padding: '5px',
                background: '#fff',
                zIndex: 999,
                width: '20%',
                border: '1.5px solid rgba(225, 0, 231, 0.4)',
                display: 'flex',
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
                borderRadius: '4.4px'
            }
        }
    },
    computed : {
        ...mapState({
            users: state => state
        })
    },
    methods: {
        ...mapActions({
            saveAjax : 'saveAjax',
            getListView : 'getListView'
        }),
        stopMousedownPropagation(e) {
            e.stopPropagation();
        },
        extractContent(s) {
            const span = document.createElement('span');
            span.innerHTML = s;
            return span.textContent || span.innerText;
        },
        prepare(row, col, prop, td, originalValue, cellProperties) {
        // We'll need to call the `prepare` method from
        // the `BaseEditorComponent` class, as it provides
        // the component with the information needed to use the editor
        // (hotInstance, row, col, prop, TD, originalValue, cellProperties)
        BaseEditorComponent.options.methods.prepare.call(this, row, col, prop, td, originalValue, cellProperties);

        if (!document.body.contains(this.$el)) {
            document.body.appendChild(this.$el);
        }

        const tdPosition = td.getBoundingClientRect();

        // As the `prepare` method is triggered after selecting
        // any cell, we're updating the styles for the editor element,
        // so it shows up in the correct position.
        this.style.left = tdPosition.left + window.pageXOffset + 'px';
        this.style.top = tdPosition.top + window.pageYOffset+25 + 'px';
        },
        // setLowerCase() {
        // this.setValue(this.value.toLowerCase());
        // this.finishEditing();
        // },
        // setUpperCase() {
        // this.setValue(this.value.toUpperCase());
        // this.finishEditing();
        // },
        open() {
            if(this.prop == 'select'){
                this.finishEditing();
                this.isVisible = false;
                return;
            }

            let openValue = this.originalValue.value;
            this.uitype = this.originalValue.uitype;
            if(this.uitype == '13'){
                let email = this.extractContent(openValue);
                this.value = email;
            }
            else {
                this.value = openValue;
            }
            // if(this.uitype == '56'){
            //     this.value = (this.value == 'Ja')
            // }
            this.isVisible = true;
        },
        close() {
            this.isVisible = false;
        },
        setValue(value) {
            this.value = value;
        },
        async saveFieldData(){
            const value = this.value;
            this.users.loader = true;
            const crmid = this.hotInstance.getDataAtRowProp(this.row,'crmid');
            if(this.uitype == '56'){
                this.value = (this.value) ? 1 : 0;
            }
            const params = {fieldName : this.prop, fieldValue : value, module : this.users.getparams.module, crmid : crmid};
            let response = await this.saveAjax(params);
            if(response.result == 'success'){
                this.$notify({
                group: 'foo',
                type: 'success',
                title: '<b>'+response.message+'</b>',
                duration: 3000,
                });
                this.$root.$children[0].$children[1].toPage(this.users.getparams.page);
            }
            this.finishEditing();
            this.users.loader = false;
        },
        getValue() {
        return this.value;
        }
    }
}
</script>