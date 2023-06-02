/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      if(!windowIcon.className == "active-icon") {
        return false;
      }
      expect(windowIcon.className).toEqual("active-icon")
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})


const mockStore = {
  bills: () => ({
    list: () => Promise.resolve([
      {
        date: '2023-05-30',
        status: 'paid'
      },
      {
        date: '2023-05-31',
        status: 'pending'
      }
    ])
  })
};

describe('getBills', () => {
  test('should return an array of bills with formatted status', async () => {
    // Arrange
    const expectedOutput = [
      {
        date: '2023-05-30',
        status: 'Paid'
      },
      {
        date: '2023-05-31',
        status: 'Pending'
      }
    ];

    // Act
    const result = await getBills.call({ store: mockStore });

    // Assert
    expect(result).toEqual(expectedOutput);
    expect(console.log).toHaveBeenCalledTimes(3); // Vérifiez que console.log a été appelée trois fois
  });

  test('should return an empty array when store is not defined', async () => {
    // Act
    const result = await getBills.call({});

    // Assert
    expect(result).toEqual([]);
    expect(console.log).toHaveBeenCalledTimes(0); // Vérifiez que console.log n'a pas été appelée
  });

  test('should handle errors and return unformatted dates when encountered', async () => {
    // Arrange
    const mockError = new Error('Something went wrong');

    // Mockez la méthode "list" pour simuler une erreur
    mockStore.bills = () => ({
      list: () => Promise.reject(mockError)
    });

    // Act
    const result = await getBills.call({ store: mockStore });

    // Assert
    expect(result).toEqual([]);
    expect(console.log).toHaveBeenCalledWith(mockError, 'for', undefined); // Vérifiez que console.log a été appelée avec l'erreur et l'objet "doc" undefined
  });
});








