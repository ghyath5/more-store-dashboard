<template>
	<div class="pa-2">
		<v-img
			contain
			:max-width="maxWidth"
			:min-width="minWidth"
			:max-height="maxHeight"
			:min-height="minHeight"
			:src="imageSrc"
			eager
		/>
	</div>
</template>
<script>
export default {
	name: 'ImageViewer',
	props: {
		value: {
			type: Object,
			default() {
				return null;
			},
		},
		aspectRatio: {
			type: Number,
			default() {
				return 1;
			},
		},
		maxWidth: {
			type: Number,
			default() {
				return 50;
			},
		},
		minWidth: {
			type: Number,
			default() {
				return 50;
			},
		},
		maxHeight: {
			type: Number,
			default() {
				return 50;
			},
		},
		minHeight: {
			type: Number,
			default() {
				return 50;
			},
		},
	},
	computed: {
		imageSrc() {
			let path = this.$store.state.apiUrl + this.$store.state.imagePath;
			return this.value && this.value.objectId
				? `${path}/${this.value.objectId}/${this.maxWidth}`
				: '/no_image.png';
		},
	},
};
</script>
