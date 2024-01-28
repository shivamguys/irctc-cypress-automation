const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

export function formatDate(inputDate) {
    console.log("inputDate", inputDate)
    return dayjs(inputDate, 'DD/MM/YYYY').format('ddd, DD MMM')
}

export const tatkalOpenTimings = {
    "2A": "10:00",
    "3A": "10:00",
    "3E": "10:00",
    "1A": "10:00",
    "CC": "10:00",
    "EC": "10:00",
    "2S": "11:00",
    "SL": "11:00",
}

export const hasTatkalAlreadyOpened = (TRAIN_COACH) => {
    const openTime = tatkalOpenTimings[TRAIN_COACH]
    const targetTime = dayjs().set('hour', openTime.split(':')[0]).set('minute', openTime.split(':')[1]).set('second', 0)
    const currentTime = dayjs()
    return currentTime.isAfter(targetTime);
}

export function tatkalOpenTimeForToday(TRAIN_COACH) {
    const openTime = tatkalOpenTimings[TRAIN_COACH]
    return `${openTime}`
}