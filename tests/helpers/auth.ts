import { expect, Page } from '@playwright/test';

export async function registerAndLogin(page: Page) {
    const email = `test-${Date.now()-Math.random()}@example.com`;
    const password = 'password';
    const name = 'Test';
    const surname = 'User';

    // register
    await page.goto('/register');
    await page.getByRole('textbox', { name: 'Type your name' }).fill(name);
    await page.getByRole('textbox', { name: 'Type your surname' }).fill(surname);
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

    // login
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

    await expect(
        page.getByText('Transfer by phone number')
    ).toBeVisible();

    return {
        email,
        password,
        name,
        surname,
    };
}

