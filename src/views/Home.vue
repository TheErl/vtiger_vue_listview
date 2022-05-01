<template>
  <div class="home">
      <div class="pagination-vue">
        <div class="btn-toolbar justify-content-between" style="align-items: center;" role="toolbar" aria-label="Toolbar with button groups">
          <div class="btn-group ml-2" role="group" aria-label="First group" style="height:26px;">
            <button type="button" style="height:25px;" :disabled="columnIsResize != true" class="btn btn-success btn-sm" @click="saveLayout">Speichern</button>
            <button type="button"  style="height:25px;" :disabled="Object.keys(users.listview.selectedItems).length == 0" class="btn btn-warning btn-sm" :onclick="linkMassEdit"><i class="bi bi-pencil"></i></button>
            <button type="button"  style="height:25px;" :disabled="Object.keys(users.listview.selectedItems).length == 0" class="btn btn-danger btn-sm"><i class="bi bi-trash"></i></button>
            <button type="button" class="btn btn-primary btn-sm" onclick="parent.Vtiger_List_Js.listColumnFilterShow();" style="height:25px;"><i class="bi bi-collection"></i></button>
          </div>
          <div class="taglist_container">
            <button class="taglist__tagBtn" @click="tagsHidden = !tagsHidden">Tags <span class="caret"></span></button>
            <button class="taglist__tagBtn" @click="listeHidden = !listeHidden">Liste <span class="caret"></span></button>
            <div class="taglist__tagbody" v-if="!tagsHidden">
              <a class="taglist__tag" @click="tagChange(tag)" :style="(selectedTagId == tag.id) ? 'background-color:darkgoldenrod;' : ''" v-for="tag in users.listview.accessibleTags" href="#" :key="tag.id" :data-tag="tag.id">{{tag.label}}</a>
            </div>
            <div class="taglist__listebody" v-if="!listeHidden">
              <a class="taglist__liste" @click="listChange(tag)" v-for="tag in users.listview.myViews" href="#" :key="tag.id" :data-tag="tag.id">{{tag.label}}</a>
              <template  v-for="tag in users.listview.publicViews">
                <a class="taglist__liste" @click="listChange(tag)" href="#" :key="tag.id+'_public'" :data-tag="tag.id">{{tag.label}}</a>
              </template>
              
            </div>
          </div>
          <div class="slide-navigation-block">
            <button @click="toPage(currentPage,'target')" class="btn btn-sm btn-info" style="padding:0px 12px;height:25px;">Los</button>
            <div class="slidecontainer justify-content-end">
              <!--<input type="range" :min="1" :max="users.listview.pageCount" @change="toPage($event,'target')" :value="users.getparams.page" class="slider" id="myRange"> -->
              
              <input type="number" :min="1" :max="users.listview.pageCount" v-model="currentPage" class="form-control" style="width:70px" id="myRange">
            </div>
            <div class="input-group">
              <nav aria-label="Page navigation">
                <ul class="pagination justify-content-end" style="margin-bottom: 0;">
                  <li v-if="users.getparams.page > 1" @click="toPage(1)" class="page-item"><a class="page-link"  aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                      <span class="sr-only">Previous</span>
                    </a>
                  </li>
                  <li  @click="toPage(users.getparams.page - 2)" v-if="users.getparams.page > 2" class="page-item"><a class="page-link">{{users.getparams.page - 2}}</a></li>
                  <li @click="toPage(users.getparams.page - 1)" v-if="users.getparams.page > 1" class="page-item"><a class="page-link">{{users.getparams.page - 1}}</a></li>
                  <li v-if="users.getparams.page == 1" class="page-item"><a style='background-color: bisque;color: black;' class="page-link">{{users.getparams.page}}</a></li>
                  <li @click="toPage(users.getparams.page)" v-if="users.getparams.page > 1" class="page-item"><a style='background-color: bisque;color: black;' class="page-link">{{users.getparams.page}}</a></li>
                  <li v-if="users.listview.pageCount > users.getparams.page" @click="toPage(users.getparams.page + 1)" class="page-item"><a class="page-link">{{users.getparams.page + 1}}</a></li>
                  <li v-if="users.listview.pageCount > users.getparams.page + 1" @click="toPage(users.getparams.page + 2)" class="page-item"><a class="page-link">{{users.getparams.page + 2}}</a></li>
                  <li v-if="users.listview.pageCount != users.getparams.page" @click="toPage(users.listview.pageCount)" class="page-item"><a class="page-link" aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                      <span class="sr-only">Next</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div class="vue-table">
         <hot-table :data="hotData" id="hotTableComponent" ref="hotTableComponent" :settings="hotSettings" v-if="hotData.length > 0">
            <hot-column :data="hotColumn" v-for="(hotColumn,key,index) in hotColumns" :title="key"  :key="index">
              <custom-renderer hot-renderer></custom-renderer>
              <custom-editor hot-editor></custom-editor>
            </hot-column>
         </hot-table>
      </div>
  </div>
</template>

<script>

// @ is an alias to /src
import { HotTable,HotColumn } from '@handsontable/vue';
import { registerAllModules } from 'handsontable/registry';
import { registerLanguageDictionary, deDE } from 'handsontable/i18n';
import { mapActions, mapState } from 'vuex'
registerAllModules();
registerLanguageDictionary(deDE);
import CustomRenderer from './CustomRenderer.vue';
import CustomEditor from './CustomEditor.vue';

import config from 'config'
export default {
  name: 'Home',
  components: {
    HotTable,HotColumn,CustomRenderer,CustomEditor
  },
  computed: {
        ...mapState({
            users: state => state
            
        }),
  },
  data(){
      return {
        currentPage : 1,
        linkMassEdit : "",
        allSelected : false,
        hotSettings : {
          // data: [],
          autoRowSize: false,
          autoColumnSize : false,
          licenseKey : 'non-commercial-and-evaluation',
          fillHandle : false,
          // rowHeaders : true,
          colHeaders: (col) => {
            if(col == 0){
              let txt = "<input type='checkbox' id='allSelected' class='checker' ";
              txt += this.allSelected ? 'checked="checked"' : '';
              txt += ">";
              return txt;
            }
          },
          afterColumnResize : this.afterColumnResize,
          className : 'vuetable',
          manualColumnMove: false,
          wordWrap: false,
          manualColumnResize: true,
          sortIndicator: false,
          fixedColumnsLeft: 1,
          filters: false,
          colWidths: [],
          language: deDE.languageCode,
          afterGetColHeader: this.addInput,
          afterLoadData : this.afterLoadData,
        },
        hotColumns : [],
        hotData : [],
        hotInstance : null,
        filters : {},
        tagsHidden: true,
        listeHidden: true,
        selectedTagId : null,
        columnIsResize : false,
      };
  },
  methods : {
    ...mapActions({
      getListView : 'getListView',
      changeFieldsWidth : 'changeFieldsWidth',
      changeStore : 'changeStore',
      changeSelectedItems : 'changeSelectedItems',
    }),
    test(){
      console.log(parent);
    },
    afterLoadData(sourceData,initialLoad,source){
      this.users.loader = true;
      setTimeout(() => {
        $("table.htCore thead div.relative input#allSelected").prop('checked',false);
        this.addEventListenerSelectAll();  
        this.users.loader = false;
      }, 1000);
    },
    async toPage(page,type = 'number'){
      this.users.loader = true;
      page = parseInt(page);
      if(page >= this.users.listview.pageCount && type == 'target'){
        page = this.users.listview.pageCount;
        this.currentPage = page;
      } else {
        this.currentPage = page;
      }
      await this.getListView(page);
      this.$refs.hotTableComponent.hotInstance.loadData(this.users.listview.items);
      this.users.loader = false;
    },
    async listChange(tag){
      //open in tab by url
      this.users.loader = true;
      const url = config.apiUrl + '/index.php?module='+this.users.getparams.module+'&view=ListVue&viewname='+tag.id;
      location.href = url;

    },
    afterColumnResize(newSize, column, isDoubleClick){
      this.columnIsResize = true;
    },
    async tagChange(tag){
      // leave only numbers in text
      let tag_params = '';
      let tag_id = '';
      if(this.selectedTagId != tag.id){
        this.selectedTagId = tag.id;
        tag_params = '[[["tags","e","'+tag.id+'"]]]';
        tag_id = tag.id;
      } else {
        this.selectedTagId = "";
      }
      this.users.loader = true;
      this.changeStore({key : 'getparams', inner_key : 'tag_params', value : tag_params});
      this.changeStore({key : 'getparams', inner_key : 'tag', value : tag_id});
      await this.getListView(this.users.getparams.page);
      this.$refs.hotTableComponent.hotInstance.loadData(this.users.listview.items);
      this.users.loader = false;
      this.tagsHidden = true;
    },
    async saveLayout(){
      this.users.loader = true;
      let fields = {};
      const countCols = this.$refs.hotTableComponent.hotInstance.countCols();
      for(let i = 0;i < countCols; i++){
        fields[this.hotColumns[this.$refs.hotTableComponent.hotInstance.getColHeader(i)]] = this.$refs.hotTableComponent.hotInstance.getColWidth(i);
      }
      let data = {fields : fields, cvid : this.users.getparams.viewname};
      await this.changeFieldsWidth(data);
      this.$notify({
        group: 'foo',
        type: 'success',
        title: '<b>Gespeichert</b>',
        duration: 3000,
      });
      this.columnIsResize = false;
      location.reload();
      this.users.loader = false;
    },
    addInput (col, TH) {
      if (typeof col !== 'number') {
        return col;
      }
      // if TH.childElementCount > 2 then appendChild
      if (TH.childElementCount < 2) {
        if(col >= 1){
          const value = Object.values(this.users.listview.headers)[col];
          if(value.uitype == '56'){
           TH.appendChild(this.getInitializedElements(col,'select', 'checkbox'));
          } else {
            TH.appendChild(this.getInitializedElements(col));
          }
        } else {
          TH.appendChild(this.getInitializedElements(col,'button'));
        }
      }
    },
    getInitializedElements (colIndex, type = 'input', additionalType = '') {
      let [div,element] = [document.createElement('div'),document.createElement(type)];
      if(type == 'input'){
          element.setAttribute('type', 'text');
          element.setAttribute('class', 'form-control');
          element.setAttribute('style', 'width:100%;height:16px;border-radius:0px;padding-left:3px;margin-left:-1px;'); 
      } else if(type == 'button'){
        element.setAttribute('type', 'button');
        element.setAttribute('data-type', 'searchRecord');
        element.setAttribute('class', 'btn btn-primary');
        element.setAttribute('style', 'width: 100%; height: 28px; border-radius: 0px; padding-top:2px;');
        element.innerHTML = '<i class="bi bi-search"></i>';
      } else if(type == 'select'){
        element.setAttribute('type', 'select');
        element.setAttribute('class', 'form-control');
        element.setAttribute('style', 'width:100%;height:30px;border-radius:0px;padding-left:3px;margin-left:-1px;'); 
        element.innerHTML = '<option value="" selected>-</option><option value="1" checked>Ja</option><option value="0" checked>Nein</option>';
      }
      div.className = 'filterHeader';
      this.addEventListeners(element, colIndex);
      div.appendChild(element);
      return div;
    },
    addEventListeners (element, colIndex) {
      if(element.tagName == 'BUTTON'){
        element.addEventListener('click', (event) => {
          this.getFilteredData();
        });
      } 
      else if(element.tagName == 'INPUT'){
        element.addEventListener('keyup', (event) => {
          if(event.keyCode === 13) {
            this.getFilteredData();
          }
        });
        element.addEventListener('change', (event) => {
          this.debounceFn(colIndex, event);
        });
      }
      else if(element.tagName == 'SELECT'){
        element.addEventListener('change', (event) => {
          this.debounceFn(colIndex, event);
        });
      }
    },
    debounceFn(colIndex,event){
      const value = event.target.value;
      this.filters[this.hotColumns[this.$refs.hotTableComponent.hotInstance.getColHeader(colIndex)]] = value;
    },
    addEventListenerSelectAll(){
      $("table.htCore thead div.relative input.checker").change(()=>{
          this.users.loader = true;
          setTimeout(() => {
            this.allSelected = $("table.htCore thead div.relative input.checker").is(':checked');
            let count = this.$refs.hotTableComponent.hotInstance.countRows();
            console.log('clicked',count,this.allSelected);
            if(this.allSelected){
              for(let i = 0; i < count; i++){
                this.hotData[i]['select']['value'] = true;
                this.changeSelectedItems({type : 'add', value : this.hotData[i]['select']['crmid']});
              }
            } else {
              for(let i = 0; i < count; i++){
                this.hotData[i]['select']['value'] = false;
                this.changeSelectedItems({type : 'remove', value : this.hotData[i]['select']['crmid']});
              }
            }
            this.users.loader = false;
            console.log(this.hotData)
            const recordsCount = Object.keys(this.users.listview.selectedItems).length;
            this.linkMassEdit = "parent.Vtiger_List_Js.triggerMassEdit('index.php?module="+this.users.getparams.module+"&view=MassActionAjax&mode=showMassEditForm',"+recordsCount+");";
          }, 100);
        });
    },
    async getFilteredData(){
      this.users.loader = true;
      let filterParams = "";
      let i = 0;
      for(let key in this.filters){
        if(this.filters[key].trim() != ""){
          filterParams += `["${key}","c","${this.filters[key]}"]`;
          (i < Object.keys(this.filters).length - 1) ? filterParams += "," : "";
          i++;
        }
      }
      if(filterParams == ""){
        $("div.filterHeader button[data-type='searchRecord']").attr("class",'btn btn-primary');
        $("div.filterHeader button[data-type='searchRecord']").html('<i class="bi bi-search"></i>');
        // remove click event from button
        $("div.filterHeader button[data-type='searchRecord'].btn-primary").off('click');
      } else {
        $("div.filterHeader button[data-type='searchRecord']").attr("class",'btn btn-danger');
        $("div.filterHeader button[data-type='searchRecord']").html('<i class="bi bi-x"></i>');
        // add click event to button
        $("div.filterHeader button[data-type='searchRecord'].btn-danger").click(() => {
          $("div.filterHeader select").val("");
          $("div.filterHeader input").val("");
          this.filters = {};
          this.getFilteredData();
          return;
        });
      }
      filterParams = "[["+filterParams+"]]";
      await this.changeStore({key : 'getparams', inner_key : 'search_params', value : filterParams});
      await this.getListView(this.users.getparams.page);
      this.$refs.hotTableComponent.hotInstance.loadData(this.users.listview.items);
      this.users.loader = false;
    },
  },
  created(){
    const urlParams = new URLSearchParams(window.location.search);
    const entries = urlParams.entries();
    for(const entry of entries) {
      this.changeStore({key : 'getparams', inner_key : entry[0], value : entry[1]});
    }
  },
  async mounted(){
    this.users.loader = true;
    await this.getListView();
    let listviewHeaders = {};
    for(let key in this.users.listview.headers){
      listviewHeaders[key] = this.users.listview.headers[key].label;
    }
    this.hotColumns = listviewHeaders;
    this.hotSettings.columns = this.users.listview.columns_filter;
    this.hotData = this.users.listview.items;
    this.hotSettings.colWidths = this.users.listview.width_headers;
    //////////////////////////////////////////////////////////////////////////////
    this.users.loader = false;

  },
}
</script>
<style>
  /* .pagination-vue{
    margin: 5px 10px -10px 0px;
  } */
  .pagination-vue{
    margin: 13px 10px 10px 0px;
  }
  .pagination-vue .btn-group button.btn{
    padding:7px 12px;
  }
  div[role='toolbar']{
    margin-left:-8px;
  }
  div.relative button.changeType{
    position: absolute;
    right:2px;
    z-index: 1;
  }
  table .btn{
    padding: 0 !important;
  }
  .bi.bi-eye{
    cursor:pointer;
    color: red;
    transition: 0.3s ease-in-out all;
  }
  .bi.bi-eye:hover{
    color: green;
    transform:scale(1.2);
  }
  .pagination-vue .btn-group button.btn{
    padding: 0px 12px;
  }
  .pagination-vue .page-link{
    padding: 2.5px .75rem;
  }

  .taglist_container {
    display: flex;
    column-gap: 10px;
    position: relative;
  }

  .taglist__tag, .taglist__liste {
    display: block;
    background: #3cb878;
    font-family: 'Roboto Condensed';
    font-size: 12px;
    color: #fff;
    margin-bottom: 4px;
    border-radius: 5px;
    padding: 3px 5px;
    transition: 0.3s;
  }

  .taglist__tag:hover {
    background: #29925b;
    color: #fff;
    text-decoration: none;
  }

  .taglist__tagBtn {
    display: flex;
    font-family: 'Roboto Condensed';
    font-size: 14px;
    text-align: center;
    justify-content: center;
    align-items: center;
    width: 210px;
    color: #000;
    border: 1px solid #ddd;
    box-shadow: none;
    cursor: pointer;
  }

  .taglist__tagBtn:focus {
    outline: none;
    -webkit-box-shadow: inset 0 3px 5px rgba(0,0,0,.125);
    box-shadow: inset 0 3px 5px rgba(0,0,0,.125);
  }

  .taglist__tagbody, .taglist__listebody {
    position: absolute;
    top: 29px;
    left: 0;
    z-index: 200;
    background: #fff;
    padding: 15px;
    box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
    border: 1px solid rgba(0,0,0,.2);
    width: 210px;
  }

  .taglist__listebody {
    right: 0;
    left: auto;
    height: 350px;
    overflow-y: scroll;
  }

  .taglist_container .caret {
    margin-left: 4px;
    display: inline-block;
    width: 0;
    height: 0;
    vertical-align: middle;
    border-top: 4px solid;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
    color: #000;
  }
  .contacts__personImage {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  position: relative;
  margin-right: 5px;
  border: 1px solid lightgray;
}
div[role='group']
/* select in div with role group all not disabled buttons */
{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  align-content: flex-start;
}
div[role='group'] button.btn-success.btn-sm:not([disabled]){
  animation: pulsate 1.4s ease-out infinite;
}
@-webkit-keyframes pulsate {
    0%   { box-shadow: 0 0 0 darkgreen; }
    50%  { box-shadow: 0 0 10px darkgreen; }
    100% { box-shadow: 0 0 0 darkgreen; }
}
.taglist_container .taglist__tagBtn{
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Helvetica Neue", Arial, sans-serif;
}
</style>
<style src="../../node_modules/handsontable/dist/handsontable.full.css"></style>