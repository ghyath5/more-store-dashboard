import Vue from 'vue';
import BaseCard from '@/components/base/Card';
import Paginate from 'vuejs-paginate';
Vue.component(BaseCard.name, BaseCard);
Vue.component('paginate', Paginate);
