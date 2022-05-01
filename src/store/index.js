import Vue from 'vue'
import Vuex from 'vuex'
import { userService } from '@/services/service.js';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    listview : {
      headers : [],
      items : [],
      width_headers : [],
      pageCount : 1,
      columns_filter : [],
      selectedItems : {},
      accessibleTags : [],
      allUserTags : [],
      myViews : [],
      publicViews : [],
    },
    getparams : {
      module : 'Contacts',
      viewname : null,
      tag : null,
      search_params : "",
      tag_params : "",
      page : 1,
    },
    loader : false,
  },
  mutations: {
    changeListView(state,data){
      state.listview.headers = data.headers;
      state.listview.items = data.items;
      for(let i in state.listview.items){
        if(state.listview.selectedItems[state.listview.items[i].crmid]){
          state.listview.items[i].select.value = true;
        }
      }
      state.listview.width_headers = data.width_headers;
      state.listview.pageCount = data.pageCount;
      state.listview.columns_filter = data.columns_filter;
      state.getparams.viewname = data.cvId;
      state.getparams.page = data.currentPage;
      state.listview.accessibleTags = data.accessibleTags;
      state.listview.allUserTags = data.allUserTags;
      state.listview.myViews = data.myViews;
      state.listview.publicViews = data.publicViews;
    },
    changeStore(state,data){
      if(state[data.key][data.inner_key] != undefined){
        state[data.key][data.inner_key] = data.value;
      }
    },
    changeSelectedItems(state,data){
      if(data.type == 'add'){
        state.listview.selectedItems[data.value] = data.value;
      } else if(data.type == 'remove'){
        delete state.listview.selectedItems[data.value];
      }
    }
  },
  actions: {
    async getListView({commit},page = 1){
      const data = {module : this.state.getparams.module, viewname : this.state.getparams.viewname, tag : this.state.getparams.viewname, currentPage : page, search_params : this.state.getparams.search_params, tag_params : this.state.getparams.tag_params};
      let response = await userService.queryToServer('getListView',data);
      console.log(response);
      commit('changeListView',response);
    },
    changeSelectedItems({commit},data){
      commit('changeSelectedItems',data);
    },
    async changeFieldsWidth({commit, dispatch},data){
      let response = await userService.queryToServer('SaveWidthListView',data);
      if(response.result == 'done'){
        dispatch('getListView');
      }
    },
    async saveAjax({commit},data){
      let response = await userService.queryToServer('saveAjax',data);
      return response;
    },
    changeStore({commit},data){
      commit('changeStore', data);
    }
  },
  modules: {
  }
})
