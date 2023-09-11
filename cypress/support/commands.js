
const BASE_URL = Cypress.env('BASE_URL')


Cypress.Commands.add('submitCaptcha', () => {


    let LOGGED_IN = false
    performLogin(LOGGED_IN)



})


Cypress.Commands.add('solveCaptcha', () => {

    solveCaptcha()

})


function performLogin(LOGGED_IN) {
    // if starts
    if (!LOGGED_IN) {
        cy.wait(2000)

        cy.get('body').then((el) => {
            console.log(el[0].innerText, '<<<<<<<<<<<<<-------------')

            if (el[0].innerText.includes('Logout')) {

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