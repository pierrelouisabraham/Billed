import NewBill from '../containers/NewBill.js';
import Logout from "../containers/Logout.js"
import { ROUTES_PATH } from '../constants/routes';
import { screen, waitFor } from "@testing-library/dom"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { mockedBills } from "../__mocks__/store.js"

describe('NewBill', () => {
  var newBill;
  let document;
  let onNavigate;
  let store;
  let localStorage;

  beforeEach(() => {
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
      "amount": 400,
      "email": "a@a",
      "pct": 20
    }
    document = {
      querySelector: jest.fn(() => ({
        addEventListener: jest.fn(),
      })),
    };
    onNavigate = jest.fn();
    store = {
      bills: jest.fn(() => ({
        create: jest.fn(() =>
          Promise.resolve({ fileUrl: bill.fileUrl, key: bill.selector })
        ),
        update: jest.fn(() => Promise.resolve()),
      })),
    };
    
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        email: 'employee@test.tld'
      }))
    new Logout({ document, localStorage, onNavigate });
    newBill = new NewBill({ document, onNavigate, store, localStorage });
    const inputElementMock = {
      files: [new File([''], 'mock-file.png', { type: 'image/png' })],
    };
    jest.spyOn(document, "querySelector").mockReturnValue(inputElementMock)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('handleChangeFile should handle file change and create a new bill', () => {
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
      "amount": 400,
      "email": "a@a",
      "pct": 20
    }
    const event = {
      preventDefault: jest.fn(),
      target: {
        value: bill.filename,
      },
    };
    newBill.handleChangeFile(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(document.querySelector).toHaveBeenCalledWith(
      'input[data-testid="file"]'
    );
    expect(newBill.billId).toBe(bill.id);
    expect(newBill.fileUrl).toBe(bill.fileUrl);
    expect(newBill.fileName).toBe(bill.fileName);
  });
});

/* describe('68452480', () => {
  test('should pass', async () => {
    const { getByTestId, queryByTestId } = render(<App />);
    const str = JSON.stringify(someValues);
    const blob = new Blob([str]);
    const file = new File([blob], 'values.json', {
      type: 'application/JSON',
    });
    File.prototype.text = jest.fn().mockResolvedValueOnce(str);
    const input = getByTestId('upInput');
    user.upload(input, file);
    await waitFor(() => expect(queryByTestId('handler')).toBeTruthy());
  });
}); */