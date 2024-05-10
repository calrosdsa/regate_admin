describe('Navigation', () => {
    it('should navigate to the about page', () => {
      // Start from the index page
      cy.login("jorge@gmail.com", "12ab34cd56ef")
      cy.visit('/admin/manage/establecimientos')
      cy.url().should('include', '/admin/manage/establecimientos')
      // The new page should contain an h1 with "About"
    })
  })