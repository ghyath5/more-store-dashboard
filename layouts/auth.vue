<template>
	<v-app id="inspire">
		<v-main>
			<v-container class="fill-height" fluid>
				<nuxt />
			</v-container>
		</v-main>
		<v-snackbar
			v-model="$store.state.snack.active"
			:color="$store.state.snack.color"
			right
			top
			:timeout="$store.state.snack.timeout"
		>
			{{ $store.state.snack.text }}
		</v-snackbar>
	</v-app>
</template>
<script>
export default {
	middleware: 'notAuth',
};
</script>
