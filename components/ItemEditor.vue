<template>
	<v-container style="background:white">
		<v-row align="center" justify="center">
			<v-col cols="10">
				<v-form v-model="formValidat" ref="form">
					<template v-for="header of headers">
						<div :key="header.id">
							<slot name="editorField" :header="header" :activeItem.sync="activeItem">
								<template v-if="header.editor === 'imageUploader'">
									<image-uploader v-model="activeItem[header.value]" />
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
										:suffix="header.suffix"
										:rules="header.rules"
										type="number"
										v-model.number="activeItem[header.value]"
										:label="header.text"
									></v-text-field>
								</template>
								<template v-else-if="header.editor === 'checkboxEditor'">
									<v-checkbox v-model="activeItem[header.value]" :label="header.text"></v-checkbox>
								</template>
								<template v-else-if="header.editor === 'autocomplete'">
									<auto-complete
										:label="header.text"
										v-model="activeItem[mode === 'create' ? header.value : header.objectValue]"
										:queryGql="header.settings.queryGql"
										:itemValue="header.settings.itemValue"
										:itemText="header.settings.itemText"
										:searchOptions="header.settings.searchOptions"
										:searchModel="header.settings.model"
										:multiple="header.settings.multiple"
										:limit="header.settings.limit"
										:initialOrderBy="header.settings.orderBy"
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
		pk: {
			type: String,
			default() {
				return 'id';
			},
		},
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
	created() {
		this.activeItem = this.item ? this.item : {};
	},
	methods: {
		action() {
			if (this.customAction) {
				this.$emit('action', { item: this.activeItem, headers: this.headers });
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
					object[header.connectKey] = this.activeItem[header.value]
						? this.activeItem[header.value][header.connectValue]
						: null;
				} else {
					object[header.value] = this.activeItem[header.value];
				}
			}
			console.log(object);

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
				})
				.catch(e => {
					this.loading = false;
				});
		},
		update() {
			let pk = this.activeItem[this.pk];
			let _set = {};
			for (const header of this.headers) {
				if (header.connectKey) {
					_set[header.connectKey] = this.activeItem[header.value]
						? this.activeItem[header.value][header.connectValue]
						: null;
				} else if (header.editor === 'autocomplete') {
					_set[header.value] = this.activeItem[header.objectValue];
				} else {
					_set[header.value] = this.activeItem[header.value];
				}
			}
			this.loading = true;
			this.$apollo
				.mutate({
					mutation: this.updateGql,
					variables: {
						pk_columns: {
							[this.pk]: pk,
						},
						_set,
					},
				})
				.then(({ data }) => {
					this.loading = false;
					this.$emit('itemUpdated', data);
				});
		},
	},
};
</script>
