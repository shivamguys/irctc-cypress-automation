
const BASE_URL = Cypress.env('BASE_URL')


Cypress.Commands.add('submitCaptcha', () => {


    let LOGGED_IN = false
    performLogin(LOGGED_IN)



})


Cypress.Commands.add('solveCaptcha', () => {

    solveCaptcha()

})


Cypress.Commands.add('bookUntilTatkalGetsOpen', (div, TRAIN_COACH, TRAVEL_DATE, TRAIN_NO) => {

    BOOK_UNTILL_TATKAL_OPENS(div, TRAIN_COACH, TRAVEL_DATE, TRAIN_NO)

})

function formatDate(inputDate) {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const parts = inputDate.split('/');
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            const date = new Date(year, month - 1, day);
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dayOfMonth = date.getDate();
            const monthName = months[date.getMonth()];

            // Add leading zero for single-digit day
            const formattedDay = dayOfMonth < 10 ? `0${dayOfMonth}` : dayOfMonth;

            return `${dayOfWeek}, ${formattedDay} ${monthName}`;
        }
    }

    return 'Invalid Date';
}


function performLogin(LOGGED_IN) {
    // if starts
    if (!LOGGED_IN) {
        cy.wait(1300)

        cy.get('body').then((el) => {

            if (el[0].innerText.includes('Logout')) {
                console.log("We have logged in successfully at this stage")
            }
            else if ((el[0].innerText.includes('FORGOT ACCOUNT DETAILS')) && !(el[0].innerText.includes('Please Wait...'))) {


                // get captcha value base64 starts---------
                cy.get('.captcha-img').invoke('attr', 'src').then((value) => {
                    // api call to retrieve captcha value
                    cy.request({
                        url: `${BASE_URL}getCaptchaToText?base64_image=${value}`,

                    }).then((response) => {

                        cy.get('#captcha').type(response.body)
                        cy.get('body').then((el) => {
                            if (el[0].innerText.includes('Invalid Captcha')) {

                                performLogin(false)

                            }
                            else if (el[0].innerText.includes('Logout')) {
                                performLogin(true)

                            }
                            else {
                                performLogin(false)

                            }

                        })


                    })
                    // api call to retrieve captcha value

                });
                // get captcha value base64 ends---------



            }
            else {
                performLogin(false)


            }

        })



    }
    // if ends






}



// function to solveCaptcha after logging in


function solveCaptcha() {


    cy.wait(1200)
    cy.get('body').then((el) => {

        // Check wether we are at reviewBooking stage or not if yes keep on solving captcha
        if (el[0].innerText.includes('Your ticket will be sent to') && !(el[0].innerText.includes('Please Wait...'))) {


            // get captcha value base64 starts---------
            cy.get('.captcha-img').invoke('attr', 'src').then((value) => {
                // api call to retrieve captcha value
                cy.request({
                    url: `${BASE_URL}getCaptchaToText?base64_image=${value}`,

                }).then((response) => {

                    cy.get('#captcha').type(response.body)
                    cy.get('body').then((el) => {
                        if (el[0].innerText.includes('Your ticket will be sent to')) {

                            solveCaptcha()

                        }
                        else if (el[0].innerText.includes('Payment Methods')) {
                            console.log("Bypassed Captcha")
                        }
                        else {
                            solveCaptcha()


                        }

                    })





                })
                // api call to retrieve captcha value

            });
            // get captcha value base64 ends---------

            // recusrsing untill captcha gets solved
            solveCaptcha()

        }
        else if (el[0].innerText.includes('Payment Methods')) {

            console.log("CAPTCHA .... SOLVED")
        }
        else {
            solveCaptcha()


        }


    })




}



function BOOK_UNTILL_TATKAL_OPENS(div, TRAIN_COACH, TRAVEL_DATE, TRAIN_NO) {


    cy.wait(1900)

    cy.get('body').then((el) => {

        if (el[0].innerText.includes('Booking not yet started for the selected quota and class') && !(el[0].innerText.includes('Please Wait...'))) {

            cy.get('.level_1.hidden-xs > app-modify-search > .layer_2 > form.ng-untouched > .col-md-2 > .hidden-xs').click()


            // Another layer of protection from breaking up the code
            // we again check the body are we at any loading phase as in loading phase content becomes visible but div
            // not active to click it
            // body fetch block starts............
            cy.get('body').then((el) => {

                if (el[0].innerText.includes('Booking not yet started for the selected quota and class') && !(el[0].innerText.includes('Please Wait...'))) {

                    // iterating each block div of available trains starts here.....
                    cy.get(':nth-child(n) > .bull-back').each((div, index) => {

                        // confirming we click on same train no and seat class div
                        if (div[0].innerText.includes(TRAIN_NO) && div[0].innerText.includes(TRAIN_COACH)) {

                            cy.wrap(div).contains(TRAIN_COACH).click()
                            cy.get(`:nth-child(${index + 1}) > .bull-back > app-train-avl-enq > :nth-child(1) > :nth-child(7) > :nth-child(1)`).contains(formatDate(TRAVEL_DATE)).click()
                            cy.get(`:nth-child(${index + 1}) > .bull-back > app-train-avl-enq > [style="padding-top: 10px; padding-bottom: 20px;"]`).contains('Book Now').click()
                            BOOK_UNTILL_TATKAL_OPENS(div, TRAIN_COACH, TRAVEL_DATE, TRAIN_NO)

                        }

                    })
                    // iterating each block div of available trains ends here.....

                }
                else {
                    BOOK_UNTILL_TATKAL_OPENS(div, TRAIN_COACH, TRAVEL_DATE, TRAIN_NO)

                }
            })
            // body fetch block ends............



        }
        else if (el[0].innerText.includes('Passenger Details') && el[0].innerText.includes('Contact Details') && !(el[0].innerText.includes('Please Wait...'))) {
            console.log("TATKAL BOOKING NOW OPEN....STARTING FURTHUR PROCESS")

        }
        else {

            BOOK_UNTILL_TATKAL_OPENS(div, TRAIN_COACH, TRAVEL_DATE, TRAIN_NO)


        }




    })





}