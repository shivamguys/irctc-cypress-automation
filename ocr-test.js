const tesseract = require("node-tesseract-ocr");
const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
}


const img = "https://tesseract.projectnaptha.com/img/eng_bw.png"
var image_addr = 'iVBORw0KGgoAAAANSUhEUgAAAMsAAAAyCAYAAADyZi/iAAAET0lEQVR42u2cT2QcURzHY62IqhArKocIq6qqhyUiInIIq4eIqlwrciiRQ0VuPVRFRKicoqK3qhxiiaqoqlwqhx6iREVEVKmqqB5KVa2KFba/4S2bn9/MvPf2ZfZN5vvhd9jd997szLzPvD/zZjo6AAAAAAAAAAAAAAAAAABgQr1ez1FMU2xRfKf4R3FWbwJHCcRVIh1OKaoUJxRvKDYo5ihKDre53Wo5EeluUnyO20lPz8GAYVlFH/cxS7JE8YNihaLfwTZHXMtCX19VLUk9pbIsGZa1DFn8laVBTUnT2cI29y5Alscs2TeKss7/9OQcnBiWdQJZEjpRMX3+AsUExTzFDu/zKw4o+lqoHFOOZdllycZTcMH6wz6XNcu5w/L9hSxtkCUkbz/FmnCyvwZiWcryJRDToSxVliyXAlnW2ectzXJesXzPIIsnsjSVMU7xW3fAHtKFa+ahQ1m8n/ESjkdJOD6FmDIKQks/CFk8k0WVMyqcrAnNyrHKPv8MBuaOZLnwyqK6phXVfaqpaelPagzXZ7MfqjvbzEJMGQss/WFS+w9Z7Mpa0RmwC7IUhP71ou1/t5mdsKzQBTV2iyLYr0mLssXKH1HGIUs/D1n8lqVb6FLd0KwcfNaqajpRkKQsakp632CmcNhQlh7hWA6G5B8K67ZBFk9lUeVV4sYfIZWjS92zOTfQ9ViWzcbUrrpB26vSXaGYpfil2zJE7EdF53jQ989ZukqS3VDIYl/eNK9UBpVjlv10JrVM7RizhDh21JBESD8ojOHGDGUpC126PMubF2b8ypAlHbKMsiI/GlSOnLAsZdtTWWpRIqs8L1meNdP/KKw+mGG/z0TdxIQsfsvSxW+wGVaOKaFiDnkoy4ZGHr4vOxay8OUru+z391ETI5DFY1mEMk9NtxnMotnMqiUsyz2NPL1xFw4NWQaEbRfVb8W4hZeQJV2y1CxkGREqwV3PZLmmkScXd+HQPB689VjWaXUgSwZaFpXmLUt27JMslvnOLGURxyXCosn7kCVDY5amNLeEq/lcymWpW8qSFxZXrgqLL/OQJV2yjMWNNwxWOr8QlsF0ZU0WlWZdmFY/t2gyqZ4DZPHgPouQrl+4i/0ko7KUYu6rliBL+mSpRHWdTLcpdDeqJks5LossKt1hiCgHSY5JIYubtWEFoSUotihLj7D8fy2jsiyEyDIPWdIny1NW3AcX26Qkj4T++vUMyiItrgw+d0OWFMkiDOwD7jiSpVOYJt3Kmiwh3dzNJLvZkMXNk5J8avO1y21Ssgc2K4cvmyztHpNCltaewV8X6u1x0GW4gIp3BFkgi/eyqKUbveoR2mCg+S7k7S77YcvWHVS8ScgCWbyRpQWCt1YuSneRHbdme5AFsqRVluB5iyWdFzM4kmUYskAWn2WpqZuBwfvAGu86Dgbct9txAoMHwiALZAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhvwHOJW10+Wk/lwAAAAASUVORK5CYII='
let imagebuff = Buffer.from(image_addr, "base64");

tesseract
    .recognize(imagebuff, config)
    .then((text) => {
        console.log("Result:", text)
    })
    .catch((error) => {
        console.log(error.message)
    })