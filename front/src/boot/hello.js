import hello from 'hellojs'

export default ({
  Vue
}) => {
  hello.init({
    facebook: 'xxxxxxxx'
  })
  Vue.prototype.$hello = hello
}
