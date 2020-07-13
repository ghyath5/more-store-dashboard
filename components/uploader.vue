<template>
	<div id="file-uploader" class="d-flex bordered rounded-10 mb-2 pa-1" @click="browse">
		<vue-core-image-upload
			:class="['uploader-c', { 'd-none': (file && file.objectId) || loading }]"
			:crop="false"
			@imageuploaded="imageuploaded"
			@imageuploading="uploading"
			@errorhandle="loading = false"
			:max-file-size="5242880"
			:url="serverUrl + '/upload/image'"
			inputAccept="image/jpg,image/jpeg,image/png,image/svg"
			inputOfFile="image"
			:headers="headers"
			credentials
		></vue-core-image-upload>
		<div v-if="loading">Uploading ...</div>
		<image-viewer
			:minWidth="150"
			:maxWidth="150"
			:maxHeight="150"
			v-else-if="file && file.objectId"
			v-model="file"
		/>
	</div>
</template>
<script>
import VueCoreImageUpload from 'vue-core-image-upload';
export default {
	components: {
		'vue-core-image-upload': VueCoreImageUpload,
	},
	name: 'image-uploader',
	props: {
		value: {
			type: null,
			default() {
				return null;
			},
		},
		multiple: {
			type: Boolean,
			default() {
				return false;
			},
		},
	},
	created() {
		this.file = { ...this.value };
	},
	methods: {
		uploading(e) {
			console.log(e);
			this.loading = true;
		},
		browse() {
			document.querySelector('.g-core-image-upload-form input').click();
		},
		imageuploaded(res) {
			if (!res.objectId) {
				this.loading = false;
				return;
			}
			this.file = res;
			this.loading = false;
			this.$emit('input', res);
		},
	},
	computed: {
		serverUrl() {
			return `${this.$store.state.apiUrl}/admin`;
		},
	},
	data() {
		return {
			file: null,
			loading: false,
			headers: {
				authorization: `Bearer ${this.$store.state.token}`,
			},
		};
	},
};
</script>

<style>
#file-uploader {
	align-items: center;
	justify-content: center;
	min-height: 250px;
}
</style>
