import { formatDate } from "../utils";

let username = Cypress.env('username')
let password = Cypress.env('password')
import { PASSENGER_DETAILS, SOURCE_STATION, DESTINATION_STATION, TRAIN_NO, TRAIN_COACH, TRAVEL_DATE, TATKAL, BOARDING_STATION, UPI_ID } from '../fixtures/passenger_data.json'

describe('IRCTC TATKAL BOOKING', () => {
  it('Tatkal Booking Begins......', () => {
    cy.viewport(1478, 1056)
    cy.visit('https://www.irctc.co.in/nget/train-search')
    cy.get('.h_head1 > .search_btn').click()
    cy.get(':nth-child(1) > .form-control').invoke('val', username).trigger('input')
    cy.get(':nth-child(2) > .form-control').invoke('val', password).trigger('input')


    // Submitting captcha block starts........
    cy.submitCaptcha().then(() => {


      // from station
      cy.get('.ui-autocomplete > .ng-tns-c57-8').type(SOURCE_STATION)
      cy.wait(600)
      cy.get('#p-highlighted-option').click()

      // to station
      cy.get('.ui-autocomplete > .ng-tns-c57-9').type(DESTINATION_STATION)
      cy.wait(600)
      cy.get('#p-highlighted-option').click()

      // date
      cy.get('.ui-calendar').click()
      // clearing the default date which is prefilled in the box
      cy.focused().clear()
      // filling the date
      cy.get('.ui-calendar').type(TRAVEL_DATE)


      // TATKAL or NORMAL BOOKING
      if (TATKAL) {
        cy.get('#journeyQuota > .ui-dropdown').click()
        cy.get(':nth-child(6) > .ui-dropdown-item').click()

      }


      // search button
      cy.get('.col-md-3 > .search_btn').click()


      // @@@@@ commenting this as IRCTC by default minimizes this now @@@@@
      // close disha banner
      // cy.get('#disha-banner-close').click()

      // iterating each div block to find our train div block starts.....
      cy.get(':nth-child(n) > .bull-back').each((div, index) => {

        // confirming we click on same train no and seat class div if block starts.....
        if (div[0].innerText.includes(TRAIN_NO) && div[0].innerText.includes(TRAIN_COACH)) {

          cy.bookUntilTatkalGetsOpen(div, TRAIN_COACH, TRAVEL_DATE, TRAIN_NO, TATKAL).then(() => {
            console.log('TATKAL TIME STARTED......')
          })

          // this is to ensure that Form Page has been opened up so until it fetches it all other execution would be blocked
          cy.get('.dull-back.train-Header')
          // cy.get('#ui-panel-12-titlebar >')

          // Navigating cursor click to some blank non clickable space in page so that clicking add passenger should work
          cy.get('.fill > :nth-child(2)').click()


          // for more passenger we click on add passenger block starts.....
          for (let i = 0; i < PASSENGER_DETAILS.length; i++) {

            // if i>0 means more than 1 passenger then click Add Passenger div
            if (i > 0) {
              cy.get('.pull-left > a > :nth-child(1)').click()
            }


          }
          // for more passenger we click on add passenger block ends....




          // this is to ensure that Form Page has been opened up so until it fetches it all other execution would be blocked
          // cy.get('#ui-panel-12-titlebar >')
          cy.get('.dull-back.train-Header')

          // FOR BOARDING STATION CHANGE
          if (BOARDING_STATION) {

            cy.get('.ui-dropdown.ui-widget.ui-corner-all').click()
            cy.contains('li.ui-dropdown-item', BOARDING_STATION)
              .then((li) => {
                cy.wrap(li).click();
              });

          }

          /*
          OLD FILLING NAME CODE, CHECKING IF BELOW NEW ONE IS STABLE OR NOT............WOULD BE REMOVED LATER IF BELOW ONE WORKS
          cy.get('.ui-autocomplete >').each((inputDiv, index) => {
            
              cy.wrap(inputDiv).click()
              cy.wrap(inputDiv).focused().clear()
              let PASSENGER = PASSENGER_DETAILS[index]
              cy.wrap(inputDiv).invoke('val', PASSENGER['NAME']).trigger('input')
            
            
            
            })
            */


          // FOR NAME
          cy.get('.ui-autocomplete >').each((inputDiv, index) => {
            cy.wrap(inputDiv).click().as('clickedInput') // Save the clicked input element as an alias
            cy.get('@clickedInput').focused().clear()     // Use the alias to continue the command chain
            let PASSENGER = PASSENGER_DETAILS[index]
            if (PASSENGER && PASSENGER['NAME']) {
              cy.get('@clickedInput').invoke('val', PASSENGER['NAME']).trigger('input')
            } else {
              cy.log('Passenger name not available or undefined.')
            }
          })

          // FOR AGE
          cy.get('input[formcontrolname="passengerAge"]').each((inputDiv, index) => {

            cy.wrap(inputDiv).click()
            cy.wrap(inputDiv).focused().clear()
            let PASSENGER = PASSENGER_DETAILS[index]

            cy.wrap(inputDiv).invoke('val', PASSENGER['AGE']).trigger('input')

          })

          // FOR GENDER
          cy.get('select[formcontrolname="passengerGender"]').each((inputDiv, index) => {

            let PASSENGER = PASSENGER_DETAILS[index]
            cy.wrap(inputDiv).select(PASSENGER['GENDER'])
          })

          // FOR PASSENGER SEAT
          cy.get('select[formcontrolname="passengerBerthChoice"]').each((inputDiv, index) => {

            let PASSENGER = PASSENGER_DETAILS[index]
            cy.wrap(inputDiv).select(PASSENGER['SEAT'])

          })


          // FOR PASSENGER FOOD CHOICE
          cy.get('body').then((body) => {
            if (body.find('select[formcontrolname="passengerFoodChoice"]').length > 0) {
              cy.get('select[formcontrolname="passengerFoodChoice"]').each((inputDiv, index) => {

                let PASSENGER = PASSENGER_DETAILS[index];
                cy.wrap(inputDiv).select(PASSENGER['FOOD']);

              });
            }
          })




          // For Selecting "Book only if confirm berths are allotted.""
          cy.get('body').then((el) => {

            if (el[0].innerText.includes('Book only if confirm berths are allotted')) {
              cy.get(':nth-child(2) > .css-label_c').click()

            }
          })



          // Choosing UPI As Payment Option while filling passenger details
          cy.get('#\\32  > .ui-radiobutton > .ui-radiobutton-box').click()

          // Proceed to NEXT STEP Final Confirmation 
          cy.get('.train_Search').click()


          // ---- note this might appear this is uncertain -----------------

          // For clicking confirmation dialog if opted for no food in vande bharat
          // "Enhance Your Travel with Taste! Opt for Onboard Catering for a Delicious Dining Experience!"
          cy.get('body').then((el) => {

            if (el[0].innerText.includes('Confirmation')) {
              // we are clicking close button as this would pop ou only if you are selecting no food
              // irctc is suggesting that you opt it
              // that's the reason we are clicking close button
              cy.get('[icon="fa fa-close"] > .ui-button-text').click()

            }
          })
          // ---- note this might appear this is uncertain -----------------




          // if next page opens which is review booking stage
          cy.solveCaptcha().then(() => {
            // BHIM UPI At Gateway Confirmation
            cy.get(':nth-child(3) > .col-pad').click()
            cy.get('.col-sm-9 > app-bank > #bank-type').click()
            cy.get('.col-sm-9 > app-bank > #bank-type > :nth-child(2) > table > tr > :nth-child(1) > .col-lg-12 > .border-all > .col-xs-12 > .col-pad').click()

            // Clicking Pay And book
            cy.get('.btn').click()


            cy.intercept("/theia/processTransaction?orderid=*").as("payment")

            // ...
            // https://securegw.paytm.in/theia/processTransaction?orderid=100004437462426

            cy.wait("@payment", { timeout: 200000 }).then((interception) => {
              cy.log(interception)
              console.log(interception.response.body)

              // MAKE SURE UPI ID EXIST THEN PROCEED PLEASE FILL UPI_ID VALUE IN cypress/fixtures/passenger_data.json as something like this "123713278162@paytm"
              if (UPI_ID) {
                cy.get('#ptm-upi').click()
                cy.get('.brdr-box > :nth-child(2) > ._1WLd > :nth-child(1) > .xs-hover-box > ._Mzth > .form-ctrl').type("8604949532@paytm")
                cy.get('.btn').click()

              }


            })




          })











        }
        // confirming we click on same train no and seat class div if block ends......




      })
      // iterating each div block to find our train div block ends.....






    })
    // Submitting captcha block ends........






  })
})
// chrome://settings/content/siteDetails?site=https%3A%2F%2Fsecuregw.paytm.in