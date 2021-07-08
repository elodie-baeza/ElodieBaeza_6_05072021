import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import LoadingPage from "../views/LoadingPage.js"
import ErrorPage from "../views/ErrorPage.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      //to-do write expect expression
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^([1-9]|[12][0-9]|3[01]) ([a-zé]{3,4}[.]) (\d{2})$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})

describe("Given an employee enter his email and his pwd", () => {
  describe("When user press employee-login-button", () => {
    test("Then billed page loading", () => {
      const loading = true
      const html = BillsUI({ loading })
      document.body.innerHTML = html
      expect(LoadingPage()).toBeTruthy()
    })
    test("Then billed error page loading", () => {
      const error = true
      const html = BillsUI({ error })
      document.body.innerHTML = html
      expect(ErrorPage()).toBeTruthy()
    })
  })
})