<template>
	<div>
		<v-img :max-width="maxWidth" :max-height="maxHeight" :aspect-ratio="aspectRatio" :src="imageSrc" />
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
				return 1.8;
			},
		},
		maxWidth: {
			type: Number,
			default() {
				return 80;
			},
		},
		maxHeight: {
			type: Number,
			default() {
				return 50;
			},
		},
	},
	computed: {
		imageSrc() {
			return this.value && this.value.objectId ? this.value.objectId : '/no_image.png';
		},
	},
};
</script>
