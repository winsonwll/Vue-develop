

export default function(num) {
    var timestamp = +new Date();
    var minutes = parseInt(timestamp / (1000 * 60), 10);
    num = num || 5;
    return parseInt(minutes / num, 10);
}
