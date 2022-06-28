import { loadComponent } from './loadComponent'

describe('loadComponent', () => {
  it('loads the remote component', async () => {
    const sharedScope = 'test-shared-scope'
    const testComponent = './App'
    const expectedResult = 'test-shared-scope'
    const mockedFactory = jest.fn().mockReturnValue(expectedResult)
    const mockedContainer = {
      init: jest.fn(),
      get: jest.fn().mockReturnValue(mockedFactory),
    }
    const scope = 'my_scope'

    // @ts-ignore
    window[scope] = mockedContainer

    // @ts-ignore
    global.__webpack_init_sharing__ = function () {
      return new Promise((res, rej) => {
        res(1)
      })
    }

    // @ts-ignore
    global.__webpack_share_scopes__ = {
      default: sharedScope,
    }

    await expect(loadComponent(scope, testComponent)()).resolves.toBe(expectedResult)
    expect(mockedContainer.init).toHaveBeenCalledWith(sharedScope)
    expect(mockedContainer.get).toHaveBeenCalledWith(testComponent)
  })
})
