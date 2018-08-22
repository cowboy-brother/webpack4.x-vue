<template>
	<div id="app">
		<div>{{ test }}</div>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				test: 'this is app test'
			}
		}
	}
</script>

<style scoped>
	#app{
		color: red;
		font-size: 32px;
	}
</style>