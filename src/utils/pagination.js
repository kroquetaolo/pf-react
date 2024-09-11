
export function pagination(size, index, url) {
    let result = {}
    let array = Array.from({ length: size }, (_, index) => index + 1);
    if(index < 0 || index > array.length) return false
    result.url = url
    if(array.length > 5 ) {
        if (index > 5) {
            const max = array.length - 3
            if (index < max) {
                const get_first_five = Array.from({ length: 1 }, (_, x) => index - x -1)
                get_first_five.sort((a, b) => a - b)
                result.first_five = get_first_five

                const get_last_five = Array.from({ length: 1 }, (_, x) => index + x +1)
                get_last_five.sort((a, b) => a - b)
                result.last_five = get_last_five
                result.has_first_page = true
                result.has_last_page = true
                result.index = index
            } else {
                const get_last_five = Array.from({ length: array.length - index }, (_, x) => index + x +1)
                get_last_five.sort((a, b) => a - b)
                result.last_five = get_last_five

                const bofore_sequence = 3 - (array.length - index)
                if(bofore_sequence !== 0) {
                    const get_first_five = Array.from({ length: bofore_sequence }, (_, x) => index - x -1)
                    get_first_five.sort((a, b) => a - b)
                    result.first_five = get_first_five
                }
                result.has_first_page = true
                result.index = index
            }
        } else {
            const get_last_five = Array.from({ length: 5 - index }, (_, x) => index + x + 1)
            get_last_five.sort((a, b) => a - b)
            result.last_five = get_last_five
            if(index !== 1) {
                const get_first_five = Array.from({ length: index - 1 }, (_, x) => index - x -1)
                get_first_five.sort((a, b) => a - b)
                result.first_five = get_first_five
            }
            result.index = index
        }

        result.last = array.length
    } else {
        result.first_five = array
    }
    result.active = index
    return result

}