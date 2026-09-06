import {expect, test} from '@playwright/test';

test.describe('Registration', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/register');
    });

    test("REG-001: ensure successful register user with valid data", async ({page}) => {
        await page.getByRole('textbox', { name: 'Type your name' }).fill('Test');
        await page.getByRole('textbox', { name: 'Type your surname' }).fill('User');
        await page.getByRole('textbox', { name: 'Type your email' }).fill(`test-${Date.now()-Math.random()}@example.com`);
        await page.getByRole('textbox', { name: 'Type your message...' }).fill('password');

        const loginResponsePromise = page.waitForResponse(
            response =>
                response.url().includes('/api/auth/register') &&
                response.request().method() === 'POST'
        );

        await page.getByRole('button', { name: 'Register' }).click();
        const loginResponse = await loginResponsePromise;
        expect(loginResponse.status()).toBe(201);
        // await page.getByRole('button', { name: 'Register' }).click();
        await expect(page.getByText('Registration successful!')).toBeVisible();
    });

    test("REG-002: should not register a user with empty name", async ({page}) => {
        await page.getByRole('textbox', { name: 'Type your surname' }).fill('User');
        await page.getByRole('textbox', { name: 'Type your email' }).fill(`test-${Date.now()-Math.random()}@example.com`);
        await page.getByRole('textbox', { name: 'Type your message...' }).fill('password');
        await page.getByRole('button', { name: 'Register' }).click();
        await expect(page.getByRole('textbox', { name: 'Type your name' }))
            .toHaveJSProperty('validity.valid', false);
    });

    test("REG-003: should not register a user with empty surname", async ({page}) => {
        await page.getByRole('textbox', { name: 'Type your name' }).fill('Test');
        await page.getByRole('textbox', { name: 'Type your email' }).fill(`test-${Date.now()-Math.random()}@example.com`);
        await page.getByRole('textbox', { name: 'Type your message...' }).fill('password');
        await page.getByRole('button', { name: 'Register' }).click();
        await expect(page.getByRole('textbox', { name: 'Type your surname' }))
            .toHaveJSProperty('validity.valid', false);
    });

    test("REG-004: should not register a user with empty email", async ({page}) => {
        await page.getByRole('textbox', { name: 'Type your name' }).fill('Test');
        await page.getByRole('textbox', { name: 'Type your surname' }).fill('User');
        await page.getByRole('textbox', { name: 'Type your message...' }).fill('password');
        await page.getByRole('button', { name: 'Register' }).click();
        await expect(page.getByRole('textbox', { name: 'Type your email' }))
            .toHaveJSProperty('validity.valid', false);
    });

    test("REG-005: should not register a user with empty password", async ({page}) => {
        await page.getByRole('textbox', { name: 'Type your name' }).fill('Test');
        await page.getByRole('textbox', { name: 'Type your surname' }).fill('User');
        await page.getByRole('textbox', { name: 'Type your email' }).fill(`test-${Date.now()-Math.random()}@example.com`);
        await page.getByRole('button', { name: 'Register' }).click();
        await expect(page.getByRole('textbox', { name: 'Type your message...' }))
            .toHaveJSProperty('validity.valid', false);
    });

    test("REG-006: should not register a user with email without local", async ({page}) => {
        await page.getByRole('textbox', { name: 'Type your name' }).fill('Test');
        await page.getByRole('textbox', { name: 'Type your surname' }).fill('User');
        await page.getByRole('textbox', { name: 'Type your email' }).fill(`@example.com`);
        await page.getByRole('textbox', { name: 'Type your message...' }).fill('password');
        await page.getByRole('button', { name: 'Register' }).click();
        await expect(page.getByRole('textbox', { name: 'Type your email' }))
            .toHaveJSProperty('validity.valid', false);
    });

    test("REG-007: should not register a user with email without domain", async ({page}) => {
        await page.getByRole('textbox', { name: 'Type your name' }).fill('Test');
        await page.getByRole('textbox', { name: 'Type your surname' }).fill('User');
        await page.getByRole('textbox', { name: 'Type your email' }).fill(`test@`);
        await page.getByRole('textbox', { name: 'Type your message...' }).fill('password');
        await page.getByRole('button', { name: 'Register' }).click();
        await expect(page.getByRole('textbox', { name: 'Type your email' }))
            .toHaveJSProperty('validity.valid', false);
    });

    test("REG-008: should not register a user with email without @", async ({page}) => {
        await page.getByRole('textbox', { name: 'Type your name' }).fill('Test');
        await page.getByRole('textbox', { name: 'Type your surname' }).fill('User');
        await page.getByRole('textbox', { name: 'Type your email' }).fill(`testexample.com`);
        await page.getByRole('textbox', { name: 'Type your message...' }).fill('password');
        await page.getByRole('button', { name: 'Register' }).click();
        await expect(page.getByRole('textbox', { name: 'Type your email' }))
            .toHaveJSProperty('validity.valid', false);
    });

    test('REG-009: should register a user with whitespace-only name', async ({page}) => {
        await page.getByRole('textbox', {name: 'Type your name'}).fill(' ');
        await page.getByRole('textbox', {name: 'Type your surname'}).fill('User');
        await page.getByRole('textbox', {name: 'Type your email'}).fill(`test-${Date.now()-Math.random()}@example.com`);
        await page.getByRole('textbox', {name: 'Type your message...'}).fill('password');
        await page.getByRole('button', {name: 'Register'}).click();
        await expect(page.getByText('Registration successful!')).toBeVisible();
    });

    test('REG-010: should register a user with whitespace-only surname', async ({page}) => {
        await page.getByRole('textbox', {name: 'Type your name'}).fill('Test');
        await page.getByRole('textbox', {name: 'Type your surname'}).fill(' ');
        await page.getByRole('textbox', {name: 'Type your email'}).fill(`test-${Date.now()-Math.random()}@example.com`);
        await page.getByRole('textbox', {name: 'Type your message...'}).fill('password');
        await page.getByRole('button', {name: 'Register'}).click();
        await expect(page.getByText('Registration successful!')).toBeVisible();
    });

    test('REG-011: should register a user with whitespace-only password', async ({page}) => {
        await page.getByRole('textbox', {name: 'Type your name'}).fill('Test');
        await page.getByRole('textbox', {name: 'Type your surname'}).fill('User');
        await page.getByRole('textbox', {name: 'Type your email'}).fill(`test-${Date.now()-Math.random()}@example.com`);
        await page.getByRole('textbox', {name: 'Type your message...'}).fill(' ');
        await page.getByRole('button', {name: 'Register'}).click();
        await expect(page.getByText('Registration successful!')).toBeVisible();
    });

    test('REG-012: should not register a user when all fields are empty', async ({page}) => {
        await page.getByRole('button', {name: 'Register'}).click();
        await expect(page.getByRole('textbox', {name: 'Type your name'}))
            .toHaveJSProperty('validity.valid', false);
    });

    test('REG-013: should keep entered name after invalid registration attempt', async ({page}) => {
        await page.getByRole('textbox', {name: 'Type your name'}).fill('Test');
        await page.getByRole('button', {name: 'Register'}).click();
        await expect(page.getByRole('textbox', {name: 'Type your name'}))
            .toHaveValue('Test');
    });

    test('REG-014: should keep entered surname after invalid registration attempt', async ({page}) => {
        await page.getByRole('textbox', {name: 'Type your name'}).fill('Test');
        await page.getByRole('textbox', {name: 'Type your surname'}).fill('User');
        await page.getByRole('button', {name: 'Register'}).click();
        await expect(page.getByRole('textbox', {name: 'Type your surname'}))
            .toHaveValue('User');
    });

    test('REG-015: should keep entered email after invalid registration attempt', async ({page}) => {
        const email = `test-${Date.now()-Math.random()}@example.com`;
        await page.getByRole('textbox', {name: 'Type your name'}).fill('Test');
        await page.getByRole('textbox', {name: 'Type your surname'}).fill('User');
        await page.getByRole('textbox', {name: 'Type your email'}).fill(email);
        await page.getByRole('button', {name: 'Register'}).click();
        await expect(page.getByRole('textbox', {name: 'Type your email'}))
            .toHaveValue(email);
    });

    test('REG-016: should keep entered password after invalid registration attempt', async ({page}) => {
        await page.getByRole('textbox', {name: 'Type your name'}).fill('Test');
        await page.getByRole('textbox', {name: 'Type your surname'}).fill('User');
        await page.getByRole('textbox', {name: 'Type your email'}).fill(`test-${Date.now()-Math.random()}@example.com`);
        await page.getByRole('textbox', {name: 'Type your message...'}).fill('password');
        await page.getByRole('button', {name: 'Register'}).click();
        await expect(page.getByRole('textbox', {name: 'Type your message...'}))
            .toHaveValue('password');
    });


    test('REG-017: should not register a user with an already registered email', async ({page}) => {
        const email = `test-${Date.now()-Math.random()}@example.com`;

        await page.getByRole('textbox', {name: 'Type your name'}).fill('Test');
        await page.getByRole('textbox', {name: 'Type your surname'}).fill('User');
        await page.getByRole('textbox', {name: 'Type your email'}).fill(email);
        await page.getByRole('textbox', {name: 'Type your message...'}).fill('password');
        await page.getByRole('button', {name: 'Register'}).click();
        await expect(page.getByText('Registration successful!')).toBeVisible();

        await page.goto('/register');
        await page.getByRole('textbox', {name: 'Type your name'}).fill('Test2');
        await page.getByRole('textbox', {name: 'Type your surname'}).fill('User');
        await page.getByRole('textbox', {name: 'Type your email'}).fill(email);
        await page.getByRole('textbox', {name: 'Type your message...'}).fill('another-password');
        await page.getByRole('button', {name: 'Register'}).click();

        await expect(page.getByText('User with this email already')).toBeVisible();
    });

    test('REG-018: should hide password', async ({ page }) => {
        const passwordInput = page.getByRole('textbox', { name: 'Type your message...' });
        await expect(passwordInput).toHaveAttribute('type', 'password');
    });
});

