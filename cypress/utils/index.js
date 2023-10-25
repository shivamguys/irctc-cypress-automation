const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

export function formatDate(inputDate) {
    console.log("inputDate", inputDate)
    return dayjs(inputDate, 'DD/MM/YYYY').format('ddd, DD MMM')
}