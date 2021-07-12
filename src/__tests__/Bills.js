import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import LoadingPage from "../views/LoadingPage.js"
import ErrorPage from "../views/ErrorPage.js"
import NewBillUI from "../views/NewBillUI.js"
import Bills from "../containers/Bills.js"
import { ROUTES } from "../constants/routes.js"
import userEvent from "@testing-library/user-event"
import { localStorageMock } from "../__mocks__/localStorage.js"

//views/Bills - code coverage 100% ****************************

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
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
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
      BillsUI({ loading })
      expect(LoadingPage()).toBeTruthy()
    })
    test("Then billed error page loading", () => {
      const error = true
      BillsUI({ error })
      expect(ErrorPage()).toBeTruthy()
    })
  })
})

//container/Bills - code coverage 80% ****************************

//constructor

//handleClickNewBill 
describe("Given I am a user connected as Employee", () => {
  describe("When user click on new bill button", () => {
    test("Then new bill page should open", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const newBills = new Bills ({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })
      const buttonNewBill = screen.getByTestId("btn-new-bill")
      const handleClickNewBill = jest.fn((e) => newBills.handleClickNewBill)
      buttonNewBill.addEventListener('click', handleClickNewBill)
      userEvent.click(buttonNewBill)
      expect(handleClickNewBill).toHaveBeenCalled()
      expect(NewBillUI()).toBeTruthy()
    })
  })
  //handleClickIconEye 
  describe("When user click on icon eye", () => {
    test("Then modal should open", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      
      const newBills = new Bills ({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })

      const iconEye = screen.getAllByTestId("icon-eye")
      const handleClickIconEye = jest.fn((e) => newBills.handleClickIconEye(e))
      iconEye[0].addEventListener('click', handleClickIconEye)
      userEvent.click(iconEye[0])
      expect(newBills.handleClickIconEye()).toHaveBeenCalled()

      const modale = document.getElementById('modaleFile')
      expect(modale).toBeTruthy()
    })
  })
})

// test d'intégration GET
describe("Given I am a user connected as Admin", () => {
  describe("When I navigate to Dashboard", () => {
    test("fetches bills from mock API GET", async () => {
      //  const getSpy = jest.spyOn(firebase, "get")
      //  const bills = await firebase.get()
      //  expect(getSpy).toHaveBeenCalledTimes(1)
      //  expect(bills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      // firebase.get.mockImplementationOnce(() =>
      //   Promise.reject(new Error("Erreur 404"))
      // )
      // const html = BillsUI({ error: "Erreur 404" })
      // document.body.innerHTML = html
      // const message = await screen.getByText(/Erreur 404/)
      // expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      // firebase.get.mockImplementationOnce(() =>
      //   Promise.reject(new Error("Erreur 500"))
      // )
      // const html = BillsUI({ error: "Erreur 500" })
      // document.body.innerHTML = html
      // const message = await screen.getByText(/Erreur 500/)
      // expect(message).toBeTruthy()
    })
  })
})
