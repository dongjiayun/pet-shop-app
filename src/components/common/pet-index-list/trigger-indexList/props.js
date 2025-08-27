export default {

	// 触摸字符显示的方块样式
	moveBoxStyle: {
		type: Object,
		default: () => {
			return {
				color: 'white',
				background: '#5993f7'
			}
		}
	},

	// 检索属性（指定检索属性名）
	retrieveProperties: {
		type: String,
		default: 'name',
	},

	// 索引字母选中后背景色
	indexActiveColor: {
		type: String,
		default: "#5993f7"
	},

	// 数据源 
	list: {
		type: Array,
		default: () => {
			return []
		}
	},

	// 是否展示数据为空的索引
	showEmptyDataElement: {
		type: Boolean,
		default: true
	},

	// h5隐藏了顶栏
	h5NoTopBar: {
		type: Boolean,
		default: false
	},

	// 组件高度，一般不用设置，组件会自动撑满一页，如果组件上方或者下方有其他元素可以使用solt传入
	height: {
		type: String,
		default: '',

	}

}
