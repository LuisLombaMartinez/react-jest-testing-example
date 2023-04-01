import { render, screen } from "@testing-library/react";
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
});