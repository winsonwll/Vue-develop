/**
 * 一些对 URL 操作的方法
 * 如 获取 URL 参数
 */

var URL = {
    parse(needle) {
        var params = location.search,
            reg = new RegExp("(?:[\\?&]" + needle + "\\=)([^&]+)", "gi"),
            result = reg.exec(params);

        return result && result[1] ? result[1] : null;
    }
};

export { URL };
