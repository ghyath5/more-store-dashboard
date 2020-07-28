import Vue from 'vue';
import BaseCard from '@/components/base/Card';
import Paginate from 'vuejs-paginate';
import vueNumeralFilterInstaller from 'vue-numeral-filter';
 
Vue.use(vueNumeralFilterInstaller, { locale: 'en-gb' });
Vue.component(BaseCard.name, BaseCard);
Vue.component('paginate', Paginate);
