<template>
  <div id="vue-listvue">
    <notifications group="foo"  position="top center"/>
    <div v-if="users.loader" class="overlay">
        <div class="overlay__inner">
            <div class="overlay__content">
              <div class="orbit-spinner">
                <div class="orbit"></div>
                <div class="orbit"></div>
                <div class="orbit"></div>
              </div>
            </div>
        </div>
    </div>
    <router-view/>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      users: state => state
    }),
  },
}
</script>
<style>
#vue-listvue {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
li.page-item a.page-link{
  color:cornflowerblue;
}

.slidecontainer input[type='number']{
  height: 27px;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 15px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: bisque;
  border:1px solid black;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: bisque;
  border:1px solid black;
  cursor: pointer;
}
.orbit-spinner, .orbit-spinner * {
      box-sizing: border-box;
    }

    .orbit-spinner {
      height: 100px;
      width: 100px;
      border-radius: 50%;
      perspective: 800px;
    }

    .orbit-spinner .orbit {
      position: absolute;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

    .orbit-spinner .orbit:nth-child(1) {
      left: 0%;
      top: 0%;
      animation: orbit-spinner-orbit-one-animation 1200ms linear infinite;
      border-bottom: 3px solid #0069d9;
    }

    .orbit-spinner .orbit:nth-child(2) {
      right: 0%;
      top: 0%;
      animation: orbit-spinner-orbit-two-animation 1200ms linear infinite;
      border-right: 3px solid #d39e00;
    }

    .orbit-spinner .orbit:nth-child(3) {
      right: 0%;
      bottom: 0%;
      animation: orbit-spinner-orbit-three-animation 1200ms linear infinite;
      border-top: 3px solid #bd2130;
    }

    @keyframes orbit-spinner-orbit-one-animation {
      0% {
        transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
      }
      100% {
        transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
      }
    }

    @keyframes orbit-spinner-orbit-two-animation {
      0% {
        transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
      }
      100% {
        transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
      }
    }

    @keyframes orbit-spinner-orbit-three-animation {
      0% {
        transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
      }
      100% {
        transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
      }
    }
    .overlay {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    background: rgba(0,0,0,0.6);
    z-index:1000;
}

.overlay__inner {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    position: absolute;
}

.overlay__content {
    left: 50%;
    position: absolute;
    top: 45%;
    transform: translate(-50%, -50%);
}

div.relative {
  text-align: left;
  border-bottom: 1px solid #d0d0d0;
  padding-bottom: 6px;
}
#editorElement input[type="checkbox"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer; 
}
#editorElement input[type="checkbox"]:focus {
    outline: 0; 
}

.toggle {
  height: 32px;
  width: 52px;
  border-radius: 16px;
  display: inline-block;
  position: relative;
  margin: 0;
  border: 2px solid #474755;
  background: white;
  transition: all .2s ease; }
  .toggle:after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: gray;
    box-shadow: 0 1px 2px rgba(44, 44, 44, 0.2);
    transition: all 0.2s cubic-bezier(0.5, 0.1, 0.75, 1.35); }
  .toggle:checked {
    border-color: #42b983; 
  }
  .toggle:checked:after {
      background: #218838;
      transform: translatex(20px); 
  }



  .handsontable td{
    border-right: 0px !important;
  }
  .handsontable tr td:last-child{
    border-right: 1px solid #ccc !important;
  }
  /* if tr odd then gray background color */
  .handsontable tr:nth-child(odd) td {
    background-color: #e6e6e6;
  }
  .handsontable a{
    color : #7d601e !important;
  }

  .slide-navigation-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: 20px;
  }

  .vue-list-checkbox-container {
    position: relative;
  }
  
  #vue-list-checkbox {
    opacity: 0;
  }

  label[for="vue-list-checkbox"] {
    margin-bottom: 0;
  }

  label[for="vue-list-checkbox"]::after {
    display: block;
    content: '';
    width: 13px;
    height: 13px;
    border: 1px solid #000;
    background: #d4d4be;
    position: absolute;
    left: 0;
    top: 4px;
  }

  #vue-list-checkbox:checked + label[for="vue-list-checkbox"]::before {
    content: '';
    background: url('./assets/check-svgrepo-com.svg');
    background-size: contain;
    background-repeat: no-repeat;
    width: 9px;
    height: 11px;
    position: absolute;
    top: 6px;
    left: 2px;
    z-index: 2;
  }
</style>
