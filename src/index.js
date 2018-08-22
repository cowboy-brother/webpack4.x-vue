import Vue from 'vue'
import App from './app.vue'
import './css/index.css'
import './css/stylus.styl'

// const root = document.createElement('div');
// document.body.appendChild(root);

// new Vue({
// 	// el: root,
//   render: (h) => h(App)
// }).$mount(root)

new Vue({
  el: '#app',
  render: h => h(App) //渲染模板
  // 这里的render: x => x(App)是es6的写法
	// 转换过来就是：  暂且可理解为是渲染App组件
	// render:(function(x){
	//  return x(App);
	// });
  // template: '<App/>',//要增加配置才能用
  // components: { App }
})