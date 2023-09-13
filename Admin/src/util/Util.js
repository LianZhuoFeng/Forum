export default {
    sizeToStr: (size) => {
        let data = ''
        if (size < 0.1 * 1024) {
            data = size.toFixed(2) + 'B'
        } else if (size < 0.1 * 1024 * 1024) {
            data = (size / 1024).toFixed(2) + 'KB'
        } else if (size < 0.1 * 1024 * 1024 * 1024) {
            data = (size / (1024 * 1024)).toFixed(2) + 'Mb'
        } else if (size < 0.1 * 1024 * 1024 * 1024 * 1024) {
            data = (size / (1024 * 1024 * 1024)).toFixed(2) + 'Gb'
        }
        let sizestr = data + ''
        let len = sizestr.indexOf('.')
        let dec = sizestr.substr(len + 1, 2)
        if (dec == '00') {
            return sizestr.substring(0, len) + sizestr.substr(len + 3, 2)
        }   
        return sizestr
    }
}