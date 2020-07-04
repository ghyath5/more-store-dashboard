<template>
	<div id="app">
		<file-pond
			name="image"
			ref="pond"
			label-idle="Drop image here..."
			:allow-multiple="multiple"
			accepted-file-types="image/jpeg, image/png, image/jpg"
			:server="server"
			:files="currentFiles"
			@init="handleFilePondInit"
			@processfile="processFile"
			@removefile="removeFile"
		/>
	</div>
</template>
<script>
import vueFilePond from 'vue-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import FilePond plugins
// Please note that you need to install these plugins separately

// Import image preview plugin styles
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

// Create component
const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview);
export default {
	components: {
		FilePond,
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
	computed: {
		currentFiles() {
			if (this.value && this.value.objectId && !this.uploaded) {
				return [
					{
						source: this.value.objectId,
						options: {
							type: 'local',
						},
					},
				];
			}
			return null;
		},
		serverUrl() {
			return `${this.$store.state.apiUrl}/admin`;
		},
		server() {
			return {
				url: this.serverUrl,
				process: {
					url: '/upload/image',
					method: 'POST',
					headers: {
						authorization: `Bearer ${this.$store.state.token}`,
					},
				},
				fetch: null,
				revert: null,
				load: '/image/',
			};
		},
		//
	},
	methods: {
		removeFile(e) {
			if (this.value) {
				// this.$apollo.mutate({
				// mutation: deleteFilesByObjectIdsGql,
				// variables: {
				// 	objectIds: [this.value.objectId]
				// }
				// })
				this.$emit('remove', { ...this.value });
				return;
			}
			this.$emit('remove', { ...this.file });
			// this.$emit('input', null);
		},
		processFile() {
			this.uploaded = true;
			const file = this.$refs.pond.getFile();
			if (file && file.serverId) {
				this.$emit('input', JSON.parse(this.$refs.pond.getFile().serverId));
				this.file = JSON.parse(this.$refs.pond.getFile().serverId);
			}
		},
		handleFilePondInit: function() {
			console.log('FilePond has initialized');
			// FilePond instance methods are available on `this.$refs.pond`
		},
	},
	data() {
		return {
			file: null,
			headers: {
				authorization: `Bearer ${this.$store.state.token}`,
			},
			uploaded: false,
		};
	},
};
</script>
