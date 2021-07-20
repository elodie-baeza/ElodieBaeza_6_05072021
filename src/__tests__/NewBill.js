import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES } from "../constants/routes.js"
import userEvent from "@testing-library/user-event"
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
  describe("When I open new bill form", () => {
    test("Then I submit valid bill", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
      }))

      document.body.innerHTML = NewBillUI()

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const expenseType = screen.getByTestId('expense-type')
      userEvent.selectOptions(expenseType, [ screen.getByText('Transports') ])
      expect(expenseType.value).toBe('Transports')

      const date = screen.getByTestId('datepicker')
      userEvent.type(date, '2021-07-19')
      expect(date.value).toBe('2021-07-19')

      const amount = screen.getByTestId('amount')
      userEvent.type(amount, '23')
      expect(amount.value).toBe('23')

      const pct = screen.getByTestId('pct')
      userEvent.type(pct, '20')
      expect(pct.value).toBe('20')

      const justificatif = screen.getByTestId('file')
      const file = new File(['hello'], 'hello.png', { type: 'image/png' })
      userEvent.upload(justificatif, file)
      expect(justificatif.files[0]).toStrictEqual(file)
      expect(justificatif.files.item(0)).toStrictEqual(file)
      expect(justificatif.files).toHaveLength(1)

      const bill = new NewBill({ document, onNavigate, firestore: null, localStorage: window.localStorage })

      const form = screen.getByTestId('form-new-bill')
      const handleSubmit = jest.fn((e) => bill.handleSubmit(e))

      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form) 
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })
    test("Fetches bill from mock API post", async() => {
      const dataBill = {
        email:  'toto@test',
        type: 'Transports',
        name:  '',
        amount: 50,
        date:  '2021-07-19',
        vat: '',
        pct: 20,
        commentary: '',
        fileUrl: '',
        fileName: 'hello.png',
        status: 'pending'
      }
      const postSpy = jest.spyOn(firebase, 'post')
      const bill = await firebase.post()
      expect(dataBill.email).toMatch(bill.data[0].email)
      expect(postSpy).toHaveBeenCalledTimes(1)
      expect(bill.data.length).toBe(1)
    })
  })
  describe("When new bill is created", () => {
    test("Then bills table is displayed ", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      document.body.innerHTML = NewBillUI()

      const bill = new NewBill({ document, onNavigate, firestore: null, localStorage: window.localStorage })

      const form = screen.getByTestId('form-new-bill')
      const handleSubmit = jest.fn((e) => bill.handleSubmit(e))

      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form) 

      expect(screen.getAllByText('Mes notes de frais')).toBeTruthy()
    })
  })
})
