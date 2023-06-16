import NewBill from '../containers/NewBill.js';
import Logout from "../containers/Logout.js"
import { ROUTES_PATH } from '../constants/routes';
import { fireEvent, screen, waitFor, wait } from "@testing-library/dom"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { mockedBills } from "../__mocks__/store.js"
import NewBillUI from '../views/NewBillUI.js';

const bill = {
  "id": "47qAXb6fIm2zOKkLzMro",
  "vat": "80",
  "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
  "status": "accepted",
  "type": "Hôtel et logement",
  "commentAdmin": "ok",
  "commentary": "séminaire billed",
  "name": "encore",
  "fileName": "preview-facture-free-201801-pdf-1.jpg",
  "date": "2004-04-04",
  "amount": "400",
  "email": "a@a",
  "pct": "20"
}

describe("Given I am connected as an employee", () => {
  let newBill;
  let inputFile
  let inputFileGet

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
  })

  describe("When I am on NewBill Page", () => {
    beforeAll(() => {
      document.body.innerHTML = NewBillUI()
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
      newBill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      })
    })

    test("Then form new bill is displayed", async () => {
      const formNewBill = await waitFor(() => screen.getByTestId('form-new-bill'))
      expect(formNewBill).toBeTruthy()
    })

    describe("When i add a file", () => {
      beforeEach(async () => {
        inputFile = await waitFor(() => screen.getByTestId('file'))
        inputFileGet = jest.fn()
        Object.defineProperty(inputFile, 'files', {
          get: inputFileGet,
          configurable: true
        })
        jest.spyOn(window, 'alert').mockImplementation(() => {})
      })

      test("with an invalid extension then an alert is displayed and no file is created", async () => {
        inputFileGet.mockReturnValue([{
          name: 'file.doc',
          size: 12345,
          blob: 'some-blob'
        }])
        const createFile = jest.spyOn(newBill, 'createFile')

        fireEvent.change(inputFile)
        
        expect(window.alert).toHaveBeenCalled()
        expect(createFile).not.toHaveBeenCalled()
      })

      test("with a valid extension then no alert is displayed and a file is created", async () => {
        inputFileGet.mockReturnValue([{
          name: 'file.png',
          size: 12345,
          blob: 'some-blob'
        }])
        const createFile = jest.spyOn(newBill, 'createFile')

        fireEvent.change(inputFile)
        
        expect(createFile).toHaveBeenCalled()
      })

    })
    describe('When i submit form on newBill', () => {
      beforeEach(async () => {
        

      })
      test("with valid select input", async ()=> {
        const selectType = screen.getByTestId('expense-type');
        selectType[2].click();
        expect(selectType[2]).toBeTruthy()
      })
      test("with valid name expend ", () => {
        const inputExpense = screen.getByTestId('expense-name')
        fireEvent.change(inputExpense, { target: { value: '123' } })
        expect(inputExpense.value).toBe("123")
      })
      test("with valid datepicker ", async () => {
        const timePicker = await screen.findByTestId('datepicker');
        fireEvent.click(timePicker);
        await waitFor(() =>
        fireEvent.change(timePicker, { target: { value: "2020-05-24" } })
    );
        expect(timePicker.value).toBe("2020-05-24");
      })
      test("with valid amount", async () =>{
        const inputAmount = screen.getByTestId("amount")
        fireEvent.change(inputAmount, {target: {value: bill.amount}})
        
        expect(inputAmount.value).toBe(bill.amount)
      })
      test("with valid vat", async () =>{
        const inputVat = screen.getByTestId("vat")
        fireEvent.change(inputVat, {target: {value: bill.vat}})
        expect(inputVat.value).toBe(bill.vat)
      })
      test("with valid pct", async () =>{
        const inputPct = screen.getByTestId("pct")
        fireEvent.change(inputPct, {target: {value: bill.pct}})
        expect(inputPct.value).toBe(bill.pct)
      })
      test("with commentary", async () => {
        const inputComment = screen.getByTestId("commentary")
        fireEvent.change(inputComment, {target: {value: bill.commentary}})
        expect(inputComment.value).toBe(bill.commentary)
      })
      test("with event trigger", async () => {
        const createFile = jest.spyOn(newBill, 'createFile')
        const submitForm = jest.spyOn(newBill, 'handleSubmit')
        const selectType = screen.getByTestId('expense-type');
        selectType[2].click();
        const inputExpense = screen.getByTestId('expense-name')
        fireEvent.change(inputExpense, { target: { value: bill.name } })
        const timePicker = await screen.findByTestId('datepicker');
        fireEvent.click(timePicker);
        await waitFor(() =>
        fireEvent.change(timePicker, { target: { value: "2020-05-24" } }));
        inputFileGet.mockReturnValue([{
          name: 'file.png',
          size: 12345,
          blob: 'some-blob'
          }])
        fireEvent.change(inputFile)
        const inputAmount = screen.getByTestId("amount")
        fireEvent.change(inputAmount, {target: {value: bill.amount}})
        const inputVat = screen.getByTestId("vat")
        fireEvent.change(inputVat, {target: {value: bill.vat}})
        const inputPct = screen.getByTestId("pct")
        fireEvent.change(inputPct, {target: {value: bill.pct}})
        const inputComment = screen.getByTestId("commentary")
        fireEvent.change(inputComment, {target: {value: bill.commentary}})
        expect(createFile).toHaveBeenCalled(),
        expect(submitForm).toHaveBeenCalled()
        })

      })

    })
    
});