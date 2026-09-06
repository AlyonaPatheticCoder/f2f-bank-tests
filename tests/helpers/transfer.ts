import { expect } from '@playwright/test';

export async function makeTransfer(
    page: any,
    phone: string,
    amount: string,
    purpose: string
) {
    await page.getByRole('textbox', { name: '+7 999 123-45-' }).fill(phone);
    await page.getByRole('spinbutton', { name: '0.00' }).fill(amount);
    await page.getByRole('textbox', { name: 'e.g. debt repayment' }).fill(purpose);

    const transferResponsePromise = page.waitForResponse(
        response =>
            response.url().includes('/api/users/transfer') &&
            response.request().method() === 'POST'
    );

    await page.getByRole('button', { name: 'Send', exact: true }).click();
    const transferResponse = await transferResponsePromise;
    expect(transferResponse.status()).toBe(200);
}