function $Mixin (target, source) {
    var isClass = false;
    if (!target || !source) throw new Error('two params is not undefined and target must be a object source must be a class or object');
    if (typeof target !== 'object' || !(target instanceof Object)) throw new Error('target must be a object ');
    if (Object.prototype.toString.call(source) !== '[object Function]' && !(source instanceof Object)) throw new Error('source must be a class or object');
    try { source() } catch (error) { isClass = true; }
    if (!isClass) throw new Error('source must be a class or object');
    
    if (Object.prototype.toString.call(source) === '[object Object]') {
        var keys = Object.getOwnPropertyNames(Object.getPrototypeOf(source))
        for (const key of Object.getOwnPropertyNames(source)) target[key] = object[key];
        for (const pkey of keys) if (pkey !== 'constructor') target[pkey] = source[pkey];
    } else {
        var object = new source()
        for (const key of Object.getOwnPropertyNames(object)) target[key] = object[key];
        for (const pksy of Object.getOwnPropertyNames(source.prototype))
        if (pksy !== 'constructor') target[pksy] = object[pksy];
    }
    return target
}

export default $Mixin

/**
 * 使用方式
 * 1，引入插件 import $mixin from './plugins/Mixin/index'
 * 2，my.$mixin()... 详情参考：README.md文件
 */