var fs = require("fs");
var setting = require('./Setting')

function replacer (key, value) {
  return value
}

const txt = JSON.stringify(setting, replacer, 2)

fs.writeFile('./app.json',txt, (err) => {
    if (err) throw err;
    console.log('文件已被保存');
})

// node ./plugins/AutoSetting/index.js 自动生成app.json