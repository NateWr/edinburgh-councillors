/**
 * Test the critical functionality of the application
 */
describe('Application tests', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5173/edinburgh-councillors');
    cy
      .get('button:contains("Ok, got it!")')
      .click();
  });

  it('Checks welcome modal', () => {
    cy
      .get('button:contains("Ok, got it!")')
      .should('not.exist');
  });

  it('Checks the map is loaded', () => {
    cy
      .get('path.leaflet-interactive')
      .should('have.length', 17);
  });

  it('Checks councillor data is loaded', () => {
    cy
      .get('h3')
      .contains('Almond')
      .then(() => {
        cy.get('h4')
          .contains('Kevin Lang');
        cy.get('a[href="tel:01315294389"]');
        cy.get('a[href="mailto:kevin.lang@edinburgh.gov.uk"]');
        cy.get('a[href="https://democracy.edinburgh.gov.uk/mgUserInfo.aspx?UID=115"]');
      });

    cy
      .get('h3')
      .contains('Portobello')
      .then(() => {
        cy.get('h4')
          .contains('Tim Jones');
          cy.get('a[href="tel:01315294166"]');
          cy.get('a[href="mailto:Cllr.Tim.Jones@edinburgh.gov.uk"]');
          cy.get('a[href="https://democracy.edinburgh.gov.uk/mgUserInfo.aspx?UID=2669"]');
      });
  });

  it('Checks phone button is disabled when telephone number missing', () => {
    cy
      .get('h3')
      .contains('Almond')
      .then(() => {
        cy.get('h4')
          .contains('Lewis Younie');
        cy.get('button[aria-label="Call Lewis Younie"][disabled]');
      });
  });

  it('Checks all councillors have working image URLs', () => {
    cy
      .get('.ec-councillor-image')
      .each($img => {
        expect($img.attr('src')).to.not.have.string('councillor-no-portrait.png');
        cy.request({
            url: $img.attr('src')
          })
          .then(response => {
            expect(response.status).to.eq(200);
          });
      });
  });

  it('Checks click on map highlights ward and scrolls to councillors', () => {
    cy
      .get('.leaflet-interactive')
      .last()
      .click();

    cy.wait(1000);

    cy
      .get('.leaflet-interactive')
      .last()
      .then($path => {
        $path.click();
        expect($path.attr('fill-opacity')).to.eq('0.4');
        cy
          .get('.controls')
          .then($panel => {
            cy
              .get('.ec-councillors')
              .last()
              .then($ward => {
                expect($panel.attr('scrollTop')).to.eq($ward.attr('offsetTop'));
              });
          });
      });
  });

  it('Checks correct postcode search highlights ward and scrolls to councillors, and deleting the postcode resets the map', () => {
    cy
      .get('input[type="search"]')
      .type('EH1 1HZ');

    cy.wait(1000);

    cy
      .get('.leaflet-interactive[fill-opacity="0.4"]')
      .should('have.length', 1);

    cy
      .get('.ec-councillors')
      .contains('City Centre')
      .then($ward => {
        cy
          .get('.controls')
          .then($panel => {
            expect($panel.attr('scrollTop')).to.eq($ward.attr('offsetTop'));
          });
      });

    cy
      .get('input[type="search"]')
      .clear();

    cy.wait(1000);

    cy
      .get('.leaflet-interactive[fill-opacity="0.4"]')
      .should('have.length', 0);
  });

  it('Checks incorrect postcode search displays error messages', () => {
    cy
      .get('input[type="search"]')
      .type('EH$');

    cy.wait(500);

    cy
      .get('.ec-warning')
      .contains('Letters and numbers only');

    cy
      .get('input[type="search"]')
      .clear()
      .type('FH1');

    cy.wait(500);

    cy
      .get('.ec-warning')
      .contains('Enter an EH postcode');

    cy
      .get('input[type="search"]')
      .clear()
      .type('EH12 3456');

    cy.wait(500);

    cy
      .get('.ec-warning')
      .contains('Woops, that\'s too long');

    cy
      .get('input[type="search"]')
      .clear()
      .type('EH12 345');

    cy.wait(500);

    cy
      .get('.ec-warning')
      .contains('Couldn\'t find that postcode');
  });
});