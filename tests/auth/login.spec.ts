import { expect, test } from '@playwright/test';

test.describe('Login', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('LOGIN-001: should login successfully with valid credentials', async ({ page }) => {
        const email = `test-${Date.now()-Math.random()}@example.com`;
        const password = 'password';

        await page.goto('/register');
        await page.getByRole('textbox', { name: 'Type your name' }).fill('Test');
        await page.getByRole('textbox', { name: 'Type your surname' }).fill('User');
        await page.getByRole('textbox', { name: 'Type your email' }).fill(email);
        await page.getByRole('textbox', { name: 'Type your message...' }).fill(password);
        const registerResponsePromise = page.waitForResponse(
            response =>
                response.url().includes('/api/auth/register') &&
                response.request().method() === 'POST'
        );

        await page.getByRole('button', { name: 'Register' }).click();
        const registerResponse = await registerResponsePromise;
        expect(registerResponse.status()).toBe(201);

        await page.goto('/login');
        await page.getByRole('textbox', { name: 'Type your email' }).fill(email);
        await page.getByRole('textbox', { name: 'Type your password' }).fill(password);

        const loginResponsePromise = page.waitForResponse(
            response =>
                response.url().includes('/api/auth/login') &&
                response.request().method() === 'POST'
        );

        await page.getByRole('button', { name: 'Login' }).click();
        const loginResponse = await loginResponsePromise;
        expect(loginResponse.status()).toBe(200);

        await expect( page.getByText('Transfer by phone number') ).toBeVisible();
    });

    test('LOGIN-002: should not login with empty email', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Type your password' }).fill('password');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByRole('textbox', { name: 'Type your email' }))
            .toHaveJSProperty('validity.valid', false);
    });

    test('LOGIN-003: should not login with empty password', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Type your email' }).fill('test@example.com');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByRole('textbox', { name: 'Type your password' }))
            .toHaveJSProperty('validity.valid', false);
    });

    test('LOGIN-004: should not login with empty email and password', async ({ page }) => {
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByRole('textbox', { name: 'Type your email' }))
            .toHaveJSProperty('validity.valid', false);

        await expect(page.getByRole('textbox', { name: 'Type your password' }))
            .toHaveJSProperty('validity.valid', false);
    });

    test('LOGIN-005: should not login with incorrect password', async ({ page }) => {
        const email = `test-${Date.now()-Math.random()}@example.com`;
        const password = 'password';

        await page.goto('/register');
        await page.getByRole('textbox', { name: 'Type your name' }).fill('Test');
        await page.getByRole('textbox', { name: 'Type your surname' }).fill('User');
        await page.getByRole('textbox', { name: 'Type your email' }).fill(email);
        await page.getByRole('textbox', { name: 'Type your message...' }).fill(password);
        await page.getByRole('button', { name: 'Register' }).click();

        await page.goto('/login');
        await page.getByRole('textbox', { name: 'Type your email' }).fill(email);
        await page.getByRole('textbox', { name: 'Type your password' }).fill('not_password');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByText('Login failed')).toBeVisible();
    });


    test('LOGIN-006: should not login with nonexistent email', async ({ page }) => {
        const email = `test-${Date.now()-Math.random()}@example.com`;

        await page.getByRole('textbox', { name: 'Type your email' }).fill(email);
        await page.getByRole('textbox', { name: 'Type your password' }).fill('password');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByText('Login failed')).toBeVisible();
    });

    test('LOGIN-007: should not login with email without @', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Type your email' }).fill('testexample.com');
        await page.getByRole('textbox', { name: 'Type your password' }).fill('password');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByRole('textbox', { name: 'Type your email' }))
            .toHaveJSProperty('validity.valid', false);
    });


    test('LOGIN-008: should not login with email without local', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Type your email' }).fill('@example.com');
        await page.getByRole('textbox', { name: 'Type your password' }).fill('password');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByRole('textbox', { name: 'Type your email' }))
            .toHaveJSProperty('validity.valid', false);
    });


    test('LOGIN-009: should not login with email without domain', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Type your email' }).fill('test@');
        await page.getByRole('textbox', { name: 'Type your password' }).fill('password');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByRole('textbox', { name: 'Type your email' }))
            .toHaveJSProperty('validity.valid', false);
    });


    test('LOGIN-010: should not login with email without domain zone', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Type your email' }).fill('test@example');
        await page.getByRole('textbox', { name: 'Type your password' }).fill('password');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByText('Login failed')).toBeVisible();
    });


    test('LOGIN-011: should not login with email with spaces inside', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Type your email' }).fill('test user@example.com');
        await page.getByRole('textbox', { name: 'Type your password' }).fill('password');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByRole('textbox', { name: 'Type your email' }))
            .toHaveJSProperty('validity.valid', false);
    });


    test('LOGIN-012: should not login with email with spaces in front', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Type your email' }).fill(' test@example.com');
        await page.getByRole('textbox', { name: 'Type your password' }).fill('password');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByText('Login failed')).toBeVisible();
    });


    test('LOGIN-013: should not login with email with spaces behind', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Type your email' }).fill('test@example.com ');
        await page.getByRole('textbox', { name: 'Type your password' }).fill('password');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByText('Login failed')).toBeVisible();
    });

    test('LOGIN-014: should not login with email with consecutive dots', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Type your email' }).fill('test..user@example.com');
        await page.getByRole('textbox', { name: 'Type your password' }).fill('password');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByText('Login failed')).toBeVisible();
    });


    test('LOGIN-015: should not login with email with invalid domain', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Type your email' }).fill('test@example..com');
        await page.getByRole('textbox', { name: 'Type your password' }).fill('password');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByRole('textbox', { name: 'Type your email' }))
            .toHaveJSProperty('validity.valid', false);
    });

    test('LOGIN-016: should login with password with spaces inside', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Type your email' }).fill('test@example.com');
        await page.getByRole('textbox', { name: 'Type your password' }).fill('pass word');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByRole('textbox', { name: 'Type your password' }))
            .toHaveJSProperty('validity.valid', true);
    });

    test('LOGIN-017: should not login with password with spaces in front', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Type your email' }).fill('test@example.com');
        await page.getByRole('textbox', { name: 'Type your password' }).fill(' password');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByText('Login failed')).toBeVisible();
    });


    test('LOGIN-018: should not login with password with spaces behind', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Type your email' }).fill('test@example.com');
        await page.getByRole('textbox', { name: 'Type your password' }).fill('password ');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByText('Login failed')).toBeVisible();
    });


    test('LOGIN-019: should not login with password with leading and trailing spaces', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Type your email' }).fill('test@example.com');
        await page.getByRole('textbox', { name: 'Type your password' }).fill(' password ');
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByText('Login failed')).toBeVisible();
    });


    test('LOGIN-020: should preserve email after failed login', async ({ page }) => {
        const email = 'test@example.com';
        await page.getByRole('textbox', { name: 'Type your email' }).fill(email);
        await page.getByRole('textbox', { name: 'Type your password' }).fill('wrong-password');
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page.getByText('Login failed')).toBeVisible();
        await expect(page.getByRole('textbox', { name: 'Type your email' }))
            .toHaveValue(email);
    });

    test('LOGIN-021: should hide password', async ({ page }) => {
        const passwordInput = page.getByRole('textbox', { name: 'Type your password' });
        await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('LOGIN-022: should logout successfully', async ({ page }) => {
        const email = `test-${Date.now()-Math.random()}@example.com`;
        const password = 'password';

        await page.goto('/register');
        await page.getByRole('textbox', { name: 'Type your name' }).fill('Test');
        await page.getByRole('textbox', { name: 'Type your surname' }).fill('User');
        await page.getByRole('textbox', { name: 'Type your email' }).fill(email);
        await page.getByRole('textbox', { name: 'Type your message...' }).fill(password);
        const registerResponsePromise = page.waitForResponse(
            response =>
                response.url().includes('/api/auth/register') &&
                response.request().method() === 'POST'
        );

        await page.getByRole('button', { name: 'Register' }).click();
        const registerResponse = await registerResponsePromise;
        expect(registerResponse.status()).toBe(201);

        await page.goto('/login');
        await page.getByRole('textbox', { name: 'Type your email' }).fill(email);
        await page.getByRole('textbox', { name: 'Type your password' }).fill(password);

        const loginResponsePromise = page.waitForResponse(
            response =>
                response.url().includes('/api/auth/login') &&
                response.request().method() === 'POST'
        );

        await page.getByRole('button', { name: 'Login' }).click();
        const loginResponse = await loginResponsePromise;
        expect(loginResponse.status()).toBe(200);


        const logoutResponsePromise = page.waitForResponse(
            response =>
                response.url().includes('/api/users/current') &&
                response.request().method() === 'GET'
        );

        await page.getByRole('button').filter({ hasText: /^$/ }).click();
        const logoutResponse = await logoutResponsePromise;
        expect(logoutResponse.status()).toBe(200);

        await expect(page).toHaveURL(/\/login/);
    });
});