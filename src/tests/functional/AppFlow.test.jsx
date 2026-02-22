import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';

describe('App Routing Functional Flow', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('redirects to /login when accessing protected /dashboard without token', () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <App />
            </MemoryRouter>
        );

        // Should land on auth/login page, which probably has "Sign In" or similar
        // Auth page has inputs for Email and Password, and a Login button
        expect(screen.getAllByText(/login/i).length).toBeGreaterThan(0);
    });

    it('renders landing page on /', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );

        // Landing page has multiple "Get Started" buttons
        expect(screen.getAllByText(/get started/i).length).toBeGreaterThan(0);
    });
});
