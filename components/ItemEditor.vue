<template>
	<v-container style="background:white">
		<v-row align="center" justify="center">
			<v-col cols="10">
				<v-form v-model="formValidat" ref="form">
					<template v-for="header of headers">
						<div :key="header.id">
							<slot name="editorField" :header="header" :activeItem.sync="activeItem">
								<template v-if="header.editor === 'imageUploader'">
									<image-uploader v-model="activeItem[header.connectKey]" />
								</template>
								<template v-if="header.editor === 'textEditor'">
									<v-text-field
										:rules="header.rules"
										v-model="activeItem[header.value]"
										:label="header.text"
									></v-text-field>
								</template>
								<template v-if="header.editor === 'textareaEditor'">
									<v-textarea
										:rules="header.rules"
										v-model="activeItem[header.value]"
										:label="header.text"
									></v-textarea>
								</template>
								<template v-if="header.editor === 'numberEditor'">
									<v-text-field
										:rules="header.rules"
										type="number"
										v-model.number="activeItem[header.value]"
										:label="header.text"
									></v-text-field>
								</template>
								<template v-else-if="header.editor === 'autocomplete'">
									<auto-complete
										:label="header.text"
										v-model="activeItem[header.value]"
										:queryGql="header.settings.queryGql"
										:itemValue="header.settings.itemValue"
										:itemText="header.settings.itemText"
										:searchOptions="header.settings.searchOptions"
										:searchModel="header.settings.model"
										:multiple="header.settings.multiple"
										:limit="header.settings.limit"
									></auto-complete>
								</template>
							</slot>
						</div>
					</template>
					<slot name="sumbitBtn">
						<v-btn :disabled="!formValidat" :loading="loading" @click="action()" color="info">
							<span>{{ mode }}</span>
						</v-btn>
					</slot>
				</v-form>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
export default {
	props: {
		mode: {
			type: String,
			default() {
				return 'create';
			},
		},
		headers: {
			type: Array,
			default() {
				return [];
			},
		},
		item: {
			type: Object,
			default() {
				return null;
			},
		},
		updateGql: {
			type: Object,
			default() {
				return null;
			},
		},
		createGql: {
			type: Object,
			default() {
				return null;
			},
		},
		customAction: {
			type: Boolean,
			default() {
				return false;
			},
		},
	},
	data() {
		return {
			formValidat: true,
			activeItem: {},
			loading: false,
		};
	},
	methods: {
		action() {
			if (this.customAction) {
				this.$emit('action', this.activeItem);
				return;
			}
			this[this.mode]();
		},
		create() {
			let object = {};
			for (const header of this.headers) {
				if (header.settings && header.settings.connectItem) {
					let data;
					if (header.settings.many) {
						data = [];
						this.activeItem[header.value].map(one => {
							data.push({
								[header.settings.connectValue]: one,
							});
						});
					} else {
						data = {
							[header.settings.connectValue]: this.activeItem[header.value],
						};
					}
					object[header.settings.model] = { data };
				} else if (header.connectKey) {
					object[header.connectKey] = this.activeItem[header.connectKey];
				} else {
					object[header.value] = this.activeItem[header.value];
				}
			}
			this.loading = true;
			this.$apollo
				.mutate({
					mutation: this.createGql,
					variables: {
						object,
					},
				})
				.then(({ data }) => {
					this.loading = false;
					this.$emit('itemCreated', data);
				});
		},
		update() {
			this.loading = true;
			this.$apollo
				.mutate({
					mutation: this.createGql,
					variables: {
						object: this.activeItem,
					},
				})
				.then(({ data }) => {
					this.loading = false;
					this.$emit('itemCreated', data);
				});
		},
	},
};
</script>
