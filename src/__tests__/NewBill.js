import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES } from "../constants/routes.js"
import firebase from "../__mocks__/firebase.js"

//container/NewBill - code coverage 80% ****************************

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I choose a non required file", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const html = NewBillUI()
      document.body.innerHTML = html

      const newBill = new NewBill({ 
        document, 
        onNavigate, 
        firestore: null, 
        localStorage: window.localStorage
      })
      
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
      const btnDisable = document.getElementById('btn-send-bill')
      expect(btnDisable.disabled).toBeTruthy()
    })

    test("Then I choose a require file", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const html = NewBillUI()
      document.body.innerHTML = html

      const newBill = new NewBill({ 
        document, 
        onNavigate, 
        firestore: null, 
        localStorage: window.localStorage
      })
      // const callFirestore = jest.fn(newBill.callFirestore)
      
      const file = screen.getByTestId('file')
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      file.addEventListener('change', handleChangeFile)
      fireEvent.change(file, { 
        target: {
          files: [new File([''], 'chucknorris.jpg', {
            type: 'image/jpg'
          })],
        }
      })
      expect(handleChangeFile).toHaveBeenCalled()
      const btnDisable = document.getElementById('btn-send-bill')
      expect(btnDisable.disabled).not.toBeTruthy()
    })

    test("Then I choose a require file", () => {
      document.body.innerHTML = NewBillUI()
      
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      
      window.localStorage.setItem('user', JSON.stringify({
        email: 'cedric.hiely@billed.com'
      }))

      const bill = new NewBill({ document, onNavigate, firestore: null, localStorage: window.localStorage })

      const form = screen.getByTestId('form-new-bill')
      const handleSubmit = jest.fn((e) => bill.handleSubmit(e))

      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form) 
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})

// test d'intégration POST new bill *********************************

describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Dashboard", () => {
    test("Send new bill in mock API POST", async () => {
      //  const getSpy = jest.spyOn(firebase, "get")
      //  const bills = await firebase.post()
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
