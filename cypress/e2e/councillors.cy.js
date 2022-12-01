/**
 * This test scrapes the councillor data from the
 * Edinburgh government website and generates a
 * json file with the required data.
 */
describe('Data Collection', () => {

    it('Get councillor details', () => {

      var wards = [];

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
          var number = parseInt(parts[0].replace('WardWard ', '')); // hidden text "Ward"
          var name = parts[1];

          var ward = wards.find(
            w => w.name === name && w.number === number
          )

          // Fix typo on Edinburgh govt website
          if (name === 'Fountainbridge/ Craiglockhart') {
            name = 'Fountainbridge / Craiglockhart';
          }

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
          wards
            .sort((a, b) => a.number - b.number)
            .forEach(function(ward, i) {
              ward.councillors = ward
                .councillors
                .sort((a, b) => a.name.localeCompare(b.name));
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
