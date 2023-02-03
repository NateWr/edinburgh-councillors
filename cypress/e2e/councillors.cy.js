/**
 * This test scrapes the councillor data from the
 * Edinburgh government website and generates a
 * json file with the required data.
 */
describe('Data Collection', () => {

  var wards = [];

  it('Get councillor details', () => {

    cy.visit('https://democracy.edinburgh.gov.uk/mgMemberIndex.aspx?VW=TABLE&PIC=1&FN=WARD');

    cy.get('#mgTable1 tbody tr')

      /**
       * Get the data for each councillor
       */
      .each($row => {
        var councillor = {};

        var $detailsColumn = $row.find('td:eq(1)');
        var $link = $detailsColumn.find('a[title^="Link to details of Councillor"]');

        councillor.url = $link.prop('href');

        councillor.name = $link
          .text()
          .replace('Councillor', '')
          .trim();

        councillor.phone = $detailsColumn
          .find('p:contains("0131")')
          .text()
          .replace(/[^0-9]/g, '');

        councillor.email = $detailsColumn
          .find('a[href^="mailto"]')
          .attr('href')
          .replace('mailto:', '')
          .trim();

        councillor.party = $row
          .find('td:eq(2)')
          .text()
          .replace('Political party', '') // hidden text
          .trim();

        var parts = $row
          .find('td:eq(3)')
          .text()
          .trim()
          .split(' - ');
        var number = parseInt(parts[0].replace('Ward ', '')); // hidden text "Ward"
        var name = parts[1];

        // Fix typo on Edinburgh govt website
        if (name === 'Fountainbridge/ Craiglockhart') {
          name = 'Fountainbridge / Craiglockhart';
        }

        var ward = wards.find(
          w => w.name === name && w.number === number
        )

        if (!ward) {
          ward = {
            name,
            number,
            councillors: []
          };
          wards.push(ward);
        }

        ward.councillors.push(councillor);

      })

      /**
       * Order wards and councillors alphanumerically
       */
      .then(() => {
        cy.then(() => {
          wards
            .sort((a, b) => a.number - b.number)
            .forEach(function(ward, i) {
              wards[i].councillors = ward
                .councillors
                .sort((a, b) => a.name.localeCompare(b.name));
            });
        })
      })

      .then(() => {
        wards
          .forEach((ward, w) => {
            ward
              .councillors
              .forEach((councillor, c) => {
                cy.visit(councillor.url)
                  .then(() => {
                    cy.get('.mgBigPhoto img')
                      .then($el => {
                        wards[w]
                          .councillors[c]
                          .photo = $el.prop('src');
                      })
                    })
                })
          });
      })

      /**
       * Save the data to a json file
       */
      .then(() => {
        cy.writeFile('public/councillors.json', JSON.stringify(wards));
      })
  })
})
