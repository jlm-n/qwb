import antfu from '@antfu/eslint-config'

export default antfu({
	formatters: true,
	react: true,
	stylistic: {
		indent: 'tab',
		quotes: 'single',
	},
})
