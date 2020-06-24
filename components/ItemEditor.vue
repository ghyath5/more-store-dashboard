<template>
	<v-container style="background:white">
		<v-row align="center" justify="center">
			<v-col cols="10">
				<v-form>
					<template v-for="header of headers">
						<slot name="editorField" :header="header">
							<div :key="header.id" v-if="header.editor === 'textEditor'">
								<v-text-field v-model="activeItem[header.value]" :label="header.text"></v-text-field>
							</div>
							<div :key="header.id" v-else-if="header.editor === 'autocomplete'">
								<auto-complete
									:label="header.text"
									v-model="activeItem[header.value]"
									:queryGql="header.settings.queryGql"
									:itemValue="header.settings.itemValue"
									:itemText="header.settings.itemText"
									:searchOptions="header.settings.searchOptions"
									:searchModel="header.settings.searchModel"
								></auto-complete>
							</div>
						</slot>
					</template>
					<slot name="sumbitBtn">
						<v-btn @click="action()" color="info">
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
	},
	data() {
		return {
			activeItem: {},
		};
	},
	methods: {
		action() {
			this[this.mode]();
		},
		create() {
			console.log('action');
		},
	},
};
</script>
