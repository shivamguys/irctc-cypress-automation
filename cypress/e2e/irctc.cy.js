let username = Cypress.env('username')
let password = Cypress.env('password')
import { PASSENGER_DETAILS, SOURCE_STATION, DESTINATION_STATION, TRAIN_NO, TRAIN_COACH, TRAVEL_DATE, TATKAL } from '../fixtures/passenger_data.json'


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

describe('IRCTC BOOKING BEGINS', () => {
  it('passes', () => {
    cy.viewport(1680, 1200)
    cy.visit('https://www.irctc.co.in/nget/train-search')
    cy.get('.h_head1 > .search_btn').click()
    cy.get(':nth-child(1) > .form-control').type(username)
    cy.get(':nth-child(2) > .form-control').type(password)

    cy.submitCaptcha().then(() => {


      // from 
      cy.get('.ui-autocomplete > .ng-tns-c57-8').type(SOURCE_STATION)
      cy.wait(600)
      cy.get('#p-highlighted-option').click()

      // to
      cy.get('.ui-autocomplete > .ng-tns-c57-9').type(DESTINATION_STATION)
      cy.wait(600)
      cy.get('#p-highlighted-option').click()

      // date
      cy.get('.ui-calendar').click()
      // cy.get('.ui-calendar').type('16/09/2023').clear()
      cy.focused().clear()
      cy.get('.ui-calendar').type(TRAVEL_DATE)


      // TATKAL or NORMAL BOOKING
      if (TATKAL) {
        cy.get('#journeyQuota > .ui-dropdown').click()
        cy.get(':nth-child(5) > .ui-dropdown-item').click()

      }


      // search button
      cy.get('.col-md-3 > .search_btn').click()
      // close disha banner
      cy.get('#disha-banner-close').click()

      cy.get(':nth-child(n) > .bull-back').each((div, index) => {

        // confirming we click on same train no and seat class div
        if (div[0].innerText.includes(TRAIN_NO) && div[0].innerText.includes(TRAIN_COACH)) {
          cy.wrap(div).contains(TRAIN_COACH).click()

          cy.get(`:nth-child(${index + 1}) > .bull-back > app-train-avl-enq > :nth-child(1) > :nth-child(7) > :nth-child(1)`).contains(formatDate(TRAVEL_DATE)).click()
          cy.get(`:nth-child(${index + 1}) > .bull-back > app-train-avl-enq > [style="padding-top: 10px; padding-bottom: 20px;"]`).contains('Book Now').click()

          cy.bookUntilTatkalGetsOpen(div, TRAIN_COACH, TRAVEL_DATE, TRAIN_NO).then(() => {

            console.log('*********8')
          })


          // this is to ensure that Form Page has been opened up so untill it fetches it all other execution would be blocked
          cy.get('#ui-panel-12-titlebar >')

          // Nvigating cursor click to some blank non clickable space in page so that clicking add passenger should work
          cy.get('.fill > :nth-child(2)').click()


          // for more passenger we click on add passenger block starts
          for (let i = 0; i < PASSENGER_DETAILS.length; i++) {

            if (i > 0) {

              cy.get('.pull-left > a > :nth-child(1)').click()
              console.log(i, PASSENGER_DETAILS.length, 'Clicked->>>>>>>>>>>>>>>>>>>>>')
            }


          }
          // for more passenger we click on add passenger block ends




          // this is to ensure that Form Page has been opened up so untill it fetches it all other execution would be blocked
          cy.get('#ui-panel-12-titlebar >')
          // FOR NAME 
          cy.get('.ui-autocomplete >').each((inputdiv, index) => {

            cy.wrap(inputdiv).click()
            cy.wrap(inputdiv).focused().clear()
            let PASSENGER = PASSENGER_DETAILS[index]
            cy.wrap(inputdiv).type(PASSENGER.NAME)



          })

          // FOR AGE
          cy.get('.col-sm-1 > .form-control').each((inputdiv, index) => {

            cy.wrap(inputdiv).click()
            cy.wrap(inputdiv).focused().clear()
            let PASSENGER = PASSENGER_DETAILS[index]

            cy.wrap(inputdiv).type(PASSENGER['AGE'])

          })

          // FOR GENDER
          cy.get('.col-sm-2 > .form-control').each((inputdiv, index) => {

            let PASSENGER = PASSENGER_DETAILS[index]
            cy.wrap(inputdiv).select(PASSENGER['GENDER'])
          })

          // FOR PASSENGER SEAT
          cy.get('.Layer_7.ng-star-inserted > .form-control').each((inputdiv, index) => {

            let PASSENGER = PASSENGER_DETAILS[index]
            cy.wrap(inputdiv).select(PASSENGER['SEAT'])

          })


          // Choosing UPI As Payment Option 
          cy.get('#\\32  > .ui-radiobutton > .ui-radiobutton-box').click()

          // Proceed to NEXT STEP Final Confirmation 
          cy.get('.train_Search').click()



          // if next page opens which is review booking stage
          cy.solveCaptcha().then(() => {
            // BHIM UPI At Gateway Confirmation
            cy.get(':nth-child(3) > .col-pad').click()
            cy.get('.col-sm-9 > app-bank > #bank-type').click()
            cy.get('.col-sm-9 > app-bank > #bank-type > :nth-child(2) > table > tr > :nth-child(1) > .col-lg-12 > .border-all > .col-xs-12 > .col-pad').click()

            // Clicking Pay And book
            cy.get('.btn').click()

          })











        }



      })





    })





  })
})