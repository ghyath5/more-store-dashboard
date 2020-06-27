<template>
	<div id="app">
		<file-pond
			name="image"
			ref="pond"
			label-idle="Drop image here..."
			:allow-multiple="multiple"
			accepted-file-types="image/jpeg, image/png"
			:server="server"
			:files="files"
			@init="handleFilePondInit"
			@processfile="processFile"
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
			};
		},
	},
	methods: {
		processFile() {
			const file = this.$refs.pond.getFile();
			if (file && file.serverId) {
				this.$emit('input', JSON.parse(this.$refs.pond.getFile().serverId).id);
			}
		},
		handleFilePondInit: function() {
			console.log('FilePond has initialized');

			// FilePond instance methods are available on `this.$refs.pond`
		},
	},
	data() {
		return {
			headers: {
				authorization: `Bearer ${this.$store.state.token}`,
			},
			files: [],
		};
	},
};
</script>
