import { act, fireEvent, render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import LoginComponent from "./LoginComponent";


describe('LoginComponent tests', () => {

    const loginServiceMock = {
        login: jest.fn()
    }

    const setTokenMock = jest.fn();

    let container: HTMLElement;

    function setUp() {
        container = render(<LoginComponent 
            loginService={loginServiceMock} 
            setToken={setTokenMock} 
        />).container;
    }

    beforeEach(() => {
        setUp();
    });

    it('should render correctly - query by role', () => {
        const mainElement = screen.getByRole('main');
        expect(mainElement).toBeInTheDocument();
        expect(screen.queryByTestId('resultLabel')).not.toBeInTheDocument();
    });

    it('should render correctly - query by test id', () => {
        const inputs = screen.getAllByTestId('input');
        expect(inputs.length).toBe(3);
        expect(inputs[0]).toHaveAttribute('value', '');
        expect(inputs[1]).toHaveAttribute('value', '');
        expect(inputs[2]).toHaveAttribute('value', 'Login');
    });

    it('should render correctly - query by document query', () => {
        // eslint-disable-next-line testing-library/no-node-access
        const inputs = container.querySelectorAll('input');
        expect(inputs).toHaveLength(3);
        expect(inputs[0].value).toBe('');
        expect(inputs[1].value).toBe('');
        expect(inputs[2].value).toBe('Login');
    });

    it('Click login button with incomplete credentials - show required message - with fireEvent and sync', () => {
        const inputs = screen.getAllByTestId('input');
        const loginButton = inputs[2];

        fireEvent.click(loginButton);

        const resultLabel = screen.getByTestId('resultLabel');
        
        expect(resultLabel).toBeInTheDocument();
        expect(resultLabel).toHaveTextContent('UserName and password required!');
    });

    it('Click login button with incomplete credentials - show required message - with user click and async', async () => {
        const inputs = screen.getAllByTestId('input');
        const loginButton = inputs[2];

        // eslint-disable-next-line testing-library/no-unnecessary-act
        act(() => {
            user.click(loginButton);
        });

        const resultLabel = await screen.findByTestId('resultLabel');
        
        expect(resultLabel).toBeInTheDocument();
        expect(resultLabel).toHaveTextContent('UserName and password required!');
    });
    
    it('should successfully login with correct credentials - with fireEvent', async () => {
        loginServiceMock.login.mockResolvedValue('1234');
        const inputs = screen.getAllByTestId('input');
        const userNameInput = inputs[0];
        const passwordInput = inputs[1];
        const loginButton = inputs[2];

        fireEvent.change(userNameInput, { target: { value: 'someUser' } });
        fireEvent.change(passwordInput, { target: { value: 'somePassword' } });
        fireEvent.click(loginButton);

        const resultLabel = await screen.findByTestId('resultLabel');
        expect(resultLabel).toBeInTheDocument();
        expect(resultLabel).toHaveTextContent('successful login');
    });

    it('should successfully login with correct credentials - with user calls', async () => {
        loginServiceMock.login.mockResolvedValue('1234');
        const inputs = screen.getAllByTestId('input');
        const userNameInput = inputs[0];
        const passwordInput = inputs[1];
        const loginButton = inputs[2];

        // eslint-disable-next-line testing-library/no-unnecessary-act
        act(() => {
            user.click(userNameInput);
            user.keyboard('someUser');

            user.click(passwordInput);
            user.keyboard('somePassword');

            user.click(loginButton);
        });

        expect(loginServiceMock.login).toBeCalledWith('someUser', 'somePassword');

        const resultLabel = await screen.findByTestId('resultLabel');
        expect(resultLabel).toBeInTheDocument();
        expect(resultLabel).toHaveTextContent('successful login');
    });

    it('unsuccessful login', async () => {

        loginServiceMock.login.mockResolvedValue(undefined);
        const inputs = screen.getAllByTestId('input');
        const userNameInput = inputs[0];
        const passwordInput = inputs[1];
        const loginButton = inputs[2];

        // eslint-disable-next-line testing-library/no-unnecessary-act
        act(() => {
            user.click(userNameInput);
            user.keyboard('someUser');

            user.click(passwordInput);
            user.keyboard('somePassword');

            user.click(loginButton);
        });

        expect(loginServiceMock.login).toBeCalledWith('someUser', 'somePassword');

        const resultLabel = await screen.findByTestId('resultLabel');
        expect(resultLabel).toBeInTheDocument();
        expect(resultLabel).toHaveTextContent('invalid credentials');
    });
});