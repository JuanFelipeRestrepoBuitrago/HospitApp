Feature: Filter IPSs
  As a patient, I want to filter IPSs by specialism, EPS and location range so that I can find an IPS that meets my needs.

  Scenario: The user filters IPSs without location
    Given the user is on the HospitApp home page
    When the user clicks the "Buscar" button
    And the user selects the "ANESTESIA" specialism
    And the user selects the "COOSALUD EPS" EPS
    And the user submits the "Buscar" button
    Then the user should be redirected to the IPS list page with "ANESTESIA" specialism and "COOSALUD EPS" EPS selected
    And the user should see the "CLINICA LAS AMERICAS" IPS first in the List