<script>
import { Line } from 'vue-chartjs';

export default {
	extends: Line,
	props: {
		chartdata: {
			type: Object,
			default: null,
		},
		options: {
			type: Object,
			default: null,
		},
	},
	mounted() {
		this.renderChart(this.chartdata, this.options);
		this.$nextTick(()=>{
			const ctx = document.getElementById("line-chart");
			// ctx.height = 400;
		})
	},
};
</script>
