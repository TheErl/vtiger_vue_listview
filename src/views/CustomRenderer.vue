<template>
    <div style="display:table-cell;white-space: nowrap;">
        <div style="display: flex; justify-content: space-between; align-items: center;" v-if="value.type == 'checkbox'">
            <input v-model="value.value" @change="setValue('select')" type="checkbox">
            <i class="ml-2 bi bi-eye" @click="showDetail(value.crmid)"></i>
        </div>
        <div v-else-if="value.type == 'selectCheckbox'" class="vue-list-checkbox-container">
            <div style="display:flex;" v-if="col == 1">
                <div v-if="value.photo != undefined" style="position: relative;">
                    <input class="disabled-checkbox" v-model="value.value" disabled="disabled" type="checkbox" id="vue-list-checkbox">
                    <label for="vue-list-checkbox"></label>
                    <img class="contacts__personImage" v-if="value.photo[0] != undefined" :src="value.photo[0].url" @mouseover="(e) => viewZoomImage(e)" @mouseleave="(e) => hideZoomImage(e)">
                    <img class="contacts__personImage" v-else src="/test/upload/images/empty_productimg.png" >
                </div>
            </div>
            <div v-else>
                <input class="disabled-checkbox" v-model="value.value" disabled="disabled" type="checkbox" id="vue-list-checkbox">
                <label for="vue-list-checkbox"></label>
            </div>
             
        </div>
        <div v-else>
            <div style="display:flex;" v-if="col == 1">
                <div v-if="value.photo != undefined" style="position: relative;">
                    <img class="contacts__personImage" v-if="value.photo[0] != undefined" :src="value.photo[0].url" @mouseover="(e) => viewZoomImage(e)" @mouseleave="(e) => hideZoomImage(e)">
                    <img class="contacts__personImage" v-else src="/test/upload/images/empty_productimg.png" >
                </div>
                <span class="ml-1" v-html="value.value"></span> 
            </div>
            <div style="display:flex;" v-else>
                <span v-html="value.value"></span> 
            </div>
        </div> 
       
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import config from 'config'
export default {
    name : 'CustomerRenderer',
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
        // - cellProperties (the cellProperties object for the edited cell)
        hotInstance: null,
        TD: null,
        row: null,
        col: null,
        prop: null,
        value: null,
        cellProperties: null
        }
    },
    computed : {
        ...mapState({
            users: state => state
        })
    },
    methods: {
        showDetail(id){
            window.open(config.apiUrl + '/index.php?module='+this.users.getparams.module+'&view=Detail&record='+id, '_blank');
        },
        setValue(type){
            if(type == 'select'){
                if(this.value.value == true){
                    console.log({type : 'add', value : this.value.crmid});
                    this.changeSelectedItems({type : 'add', value : this.value.crmid});
                } else{
                    this.changeSelectedItems({type : 'remove', value : this.value.crmid});
                }
                console.log(this.users.listview.selectedItems);
            }
            
        },
        ...mapActions({
            changeSelectedItems : 'changeSelectedItems'
        }),
        viewZoomImage(e) {
            const imageBlock = e.target;
            const imageBlockParent = e.target.parentElement;
            const img_src = imageBlock.getAttribute('src');
            let bigBlock = document.createElement('div');
            bigBlock.classList.add('bigBlockImage');
            bigBlock.innerHTML = `<img src="${img_src}" />`;

            imageBlockParent.insertBefore(bigBlock, imageBlock);
        },
        hideZoomImage(e) {
            const imageBlock = e.target;
            const imageBlockParent = e.target.parentElement;
            const bigBlock = imageBlockParent.querySelector('.bigBlockImage');
            bigBlock.remove();
        }
    },
}
</script>

<style>
    .bigBlockImage {
        position: absolute;
        width: 120px;
        height: 120px;
        top: 0;
        right: -122px;
        z-index: 1;

    }

    .bigBlockImage img {
        width: 100%;
                border-radius: 50%;
    }

    .handsontable tr td:nth-child(2) {
        overflow: visible;
    }
</style>