import { formatDate, hasTatkalAlreadyOpened, tatkalOpenTimeForToday } from "../utils";

const MANUAL_CAPTCHA = Cypress.env('MANUAL_CAPTCHA')

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})

Cypress.Commands.add('submitCaptcha', () => {


    let LOGGED_IN = false
    performLogin(LOGGED_IN)



})


Cypress.Commands.add('solveCaptcha', () => {
    solveCaptcha()

})


Cypress.Commands.add('bookUntilTatkalGetsOpen', (div, TRAIN_COACH, TRAVEL_DATE, TRAIN_NO, TATKAL) => {

    BOOK_UNTIL_TATKAL_OPENS(div, TRAIN_COACH, TRAVEL_DATE, TRAIN_NO, TATKAL)

})

function performLogin(LOGGED_IN) {

    // if starts
    if (!LOGGED_IN) {
        cy.wait(500)

        cy.get('body').should('be.visible').then((el) => {

            if (el[0].innerText.includes('Logout')) {
                cy.task("log", "We have logged in successfully at this stage")
            }
            else if ((el[0].innerText.includes('FORGOT ACCOUNT DETAILS')) && !(el[0].innerText.includes('Please Wait...'))) {

                if (MANUAL_CAPTCHA) {


                    cy.get('#captcha').focus()
                    // wait for user to manually enter captcha and login
                    cy.get('.search_btn.loginText').should('include.text', 'Logout').then(() => {

                        performLogin(true)

                    });

                } else {

                    // get captcha value base64 starts---------
                    cy.get('.captcha-img').invoke('attr', 'src').then((value) => {
                        // api call to retrieve captcha value

                        cy.exec(`python irctc-captcha-solver/app.py "${value}"`).then((result) => {
                            cy.get('#captcha').clear().type(result.stdout).type('{enter}');
                            // cy.contains('SIGN IN').click()

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

            }
            else {
                performLogin(false)


            }

        })



    }
    // if ends






}


let MAX_ATTEMPT = 120
// function to solveCaptcha after logging in


function solveCaptcha() {
    // Max attempt for this function to fail
    MAX_ATTEMPT -= 1
    cy.wrap(MAX_ATTEMPT, { timeout: 10000 }).should('be.gt', 0);

    cy.task("log", `Calling solveCaptcha() ${MAX_ATTEMPT}th time`)

    cy.wait(500)
    cy.get('body').should('be.visible').then((el) => {

        if (el[0].innerText.includes('Unable to process current transaction') && el[0].innerText.includes('Payment Mode')) {

            cy.task("log", "Unable to process current transaction...")
            cy.get('.train_Search').click()
            cy.wait(1000)

        }

        if (el[0].innerText.includes('Sorry!!! Please Try again!!')) {
            throw new Error('Sorry!!! Please Try again!! <<< Thrown By IRCTC');
        }

        if (el[0].innerText.includes('Payment Methods')) {

            cy.task("log", "CAPTCHA .... SOLVED")
            return

        }

        if (el[0].innerText.includes('No seats available')) {
            cy.fail('Further execution stopped because there are no more tickets.');
        }

        // Check whether we are at reviewBooking stage or not if yes keep on solving captcha

        if (el[0].innerText.includes('Your ticket will be sent to') && !(el[0].innerText.includes('Please Wait...')) && (el[0].innerHTML.includes('Enter Captcha'))) {


            if (MANUAL_CAPTCHA) {
                cy.get('#captcha').focus()
                cy.get('body').then((el) => {
                    if (el[0].innerText.includes('Payment Methods')) {
                        cy.task("log", "Bypassed Captcha")
                    }
                })
            } else {

                // get captcha value base64 starts---------
                cy.get('.captcha-img').invoke('attr', 'src').then((value) => {
                    // api call to retrieve captcha value
                    cy.exec(`python irctc-captcha-solver/app.py "${value}"`).then((result) => {

                        cy.get('#captcha').clear().type(result.stdout).type('{enter}')
                        cy.get('body').then((el) => {

                            if (el[0].innerText.includes('Payment Methods')) {
                                cy.task("log", "Bypassed Captcha")
                            }
                            else {
                                solveCaptcha()


                            }

                        })

                    })
                    // api call to retrieve captcha value

                });
                // get captcha value base64 ends---------

                // recursing until captcha gets solved
                solveCaptcha()

            }

        }
        else if (el[0].innerText.includes('Payment Methods')) {

            return
        }
        else {
            solveCaptcha()


        }


    })




}



function BOOK_UNTIL_TATKAL_OPENS(div, TRAIN_COACH, TRAVEL_DATE, TRAIN_NO, TATKAL) {

    cy.wait(1900)

    if (TATKAL && !hasTatkalAlreadyOpened(TRAIN_COACH)) {

        // wait for exact time
        cy.task("log", "Waiting for the exact time of opening of TATKAL...")
        const exactTimeToOpen = tatkalOpenTimeForToday(TRAIN_COACH)
        cy.get('div.h_head1', { timeout: 300000 }).should('include.text', exactTimeToOpen)


    }

    cy.get('body').should('be.visible').then((el) => {

        if (el[0].innerText.includes('Booking not yet started for the selected quota and class') && !(el[0].innerText.includes('Please Wait...'))) {

            cy.get('.level_1.hidden-xs > app-modify-search > .layer_2 > form.ng-untouched > .col-md-2 > .hidden-xs').click()

            // Another layer of protection from breaking up the code
            // we again check the body are we at any loading phase as in loading phase content becomes visible but div
            // not active to click it
            // body fetch block starts............
            cy.get('body').should('be.visible').then((el) => {

                if (el[0].innerText.includes('Booking not yet started for the selected quota and class') && !(el[0].innerText.includes('Please Wait...'))) {

                    // iterating each block div of available trains starts here.....
                    cy.get(':nth-child(n) > .bull-back').should('be.visible').each((div, index) => {

                        // confirming we click on same train no and seat class div
                        if (div[0].innerText.includes(TRAIN_NO) && div[0].innerText.includes(TRAIN_COACH)) {

                            cy.wrap(div).contains(TRAIN_COACH).click()
                            cy.get(`:nth-child(${index + 2}) > .bull-back > app-train-avl-enq > :nth-child(1) > :nth-child(7) > :nth-child(1)`).contains(formatDate(TRAVEL_DATE)).click()
                            cy.get(`:nth-child(${index + 2}) > .bull-back > app-train-avl-enq > [style="padding-top: 10px; padding-bottom: 20px;"]`).contains('Book Now').click()
                            BOOK_UNTIL_TATKAL_OPENS(div, TRAIN_COACH, TRAVEL_DATE, TRAIN_NO, TATKAL)

                        }

                    })
                    // iterating each block div of available trains ends here.....

                }
                else {
                    BOOK_UNTIL_TATKAL_OPENS(div, TRAIN_COACH, TRAVEL_DATE, TRAIN_NO, TATKAL)

                }
            })
            // body fetch block ends............



        }
        else if (el[0].innerText.includes('Passenger Details') && el[0].innerText.includes('Contact Details') && !(el[0].innerText.includes('Please Wait...'))) {
            cy.task("log", "TATKAL BOOKING NOW OPEN....STARTING FURTHER PROCESS")

        }
        else if (!(el[0].innerText.includes('Passenger Details')) && !(el[0].innerText.includes('Contact Details')) && !(el[0].innerText.includes('Please Wait...'))) {
            cy.get('body').then((el) => {


                // iterating each block div of available trains starts here.....
                cy.get(':nth-child(n) > .bull-back').each((div, index) => {

                    // confirming we click on same train no and seat class div
                    if (div[0].innerText.includes(TRAIN_NO) && div[0].innerText.includes(TRAIN_COACH)) {

                        cy.wrap(div).contains(TRAIN_COACH).click()
                        cy.get(`:nth-child(${index + 2}) > .bull-back > app-train-avl-enq > :nth-child(1) > :nth-child(7) > :nth-child(1)`).contains(formatDate(TRAVEL_DATE)).click()
                        cy.get(`:nth-child(${index + 2}) > .bull-back > app-train-avl-enq > [style="padding-top: 10px; padding-bottom: 20px;"]`).contains('Book Now').click()
                        BOOK_UNTIL_TATKAL_OPENS(div, TRAIN_COACH, TRAVEL_DATE, TRAIN_NO, TATKAL)

                    }

                })
                // iterating each block div of available trains ends here.....


            })
            // body fetch block ends............


        }
        else {

            BOOK_UNTIL_TATKAL_OPENS(div, TRAIN_COACH, TRAVEL_DATE, TRAIN_NO, TATKAL)


        }




    })





}