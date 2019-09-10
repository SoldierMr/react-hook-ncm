const pxtoviewport = require('postcss-px-to-viewport')
module.exports = {
    plugins: [
        require('autoprefixer'),
        pxtoviewport({
            unitToConvert: 'px',
            unitPrecision: 5,
            propList: ['*'],
            viewportWidth: 375,
            viewportUnit: 'vw',
            fontViewportUnit: 'vw',
            selectorBlackList: [],
            minPixelValue: 1,
            mediaQuery: false,
            replace: true,
            exclude: [],
            landscape: false,
            landscapeUnit: 'vw',
            landscapeWidth: 812
        })
    ]
}