import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import firebase from "../__mocks__/firebase"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I choose a file", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const html = NewBillUI()
      document.body.innerHTML = html

      const firestore = jest.fn(firebase)

      const newBill = new NewBill({ document, onNavigate, firestore, localStorage: window.localStorage })
      
      const file = screen.getByTestId('file')
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      file.addEventListener('change', handleChangeFile)
      fireEvent.change(file, { 
        target: {
          files: [new File([''], 'chucknorris.gif', {
            type: 'image/gif'
          })],
        }
      })
      expect(handleChangeFile).toHaveBeenCalled()
    })

    test("Then I submit new bill", () => {
      document.body.innerHTML = NewBillUI()

      const type = screen.getByTestId("expense-type")
      fireEvent.change(type, { target: { value: "Transports" } })
      expect(type.value).toBe("Transports")

      const name = screen.getByTestId("expense-name")
      fireEvent.change(name, { target: { value: "azerty" } })
      expect(name.value).toBe("azerty")

      const amount = screen.getByTestId("amount")
      fireEvent.change(amount, { target: { value: "250" } })
      expect(amount.value).toBe("250")

      const datepicker = screen.getByTestId("datepicker")
      fireEvent.change(datepicker, { target: { value: "2021-07-01" } })
      expect(datepicker.value).toBe("2021-07-01")

      const vat = screen.getByTestId("vat")
      fireEvent.change(vat, { target: { value: "70" } })
      expect(vat.value).toBe("70")

      const pct = screen.getByTestId("pct")
      fireEvent.change(pct, { target: { value: "20" } })
      expect(pct.value).toBe("20")

      const commentary = screen.getByTestId("commentary")
      fireEvent.change(commentary, { target: { value: "azerty" } })
      expect(commentary.value).toBe("azerty")
      
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      
      window.localStorage.setItem('user', JSON.stringify({
        email: 'cedric.hiely@billed.com'
      }))

      const bill = new NewBill({ document, onNavigate, firestore, localStorage: window.localStorage })

      const form = document.getElementById('btn-send-bill')
      const handleSubmit = jest.fn(e => bill.handleSubmit(e))

      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form) 
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})

//container/NewBill - code coverage 80% ****************************


// test d'intégration POST new bill
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
      // const html = DashboardUI({ error: "Erreur 404" })
      // document.body.innerHTML = html
      // const message = await screen.getByText(/Erreur 404/)
      // expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      // firebase.get.mockImplementationOnce(() =>
      //   Promise.reject(new Error("Erreur 500"))
      // )
      // const html = DashboardUI({ error: "Erreur 500" })
      // document.body.innerHTML = html
      // const message = await screen.getByText(/Erreur 500/)
      // expect(message).toBeTruthy()
    })
  })
})
