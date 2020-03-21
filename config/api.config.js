var isPro = process.env.NODE_ENV === 'production' //process.env.NODE_ENV用于区分是生产环境还是开发环境

module.exports = {
    baseURL: isPro ? 'http://123.56.71.60:613/index.php/api/' : '/apis'
}