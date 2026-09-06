import { expect, Page } from '@playwright/test';

export async function addBalance(page: Page, amount: string) {
    await page.goto('/transactions');
    await page.getByRole('button', { name: 'Add balance' }).click();
    const amountInput = page.getByRole('spinbutton', { name: 'Enter sum' });

    await expect(amountInput).toBeVisible();
    await amountInput.fill(amount);

    const balanceResponsePromise = page.waitForResponse(
        response =>
            response.url().includes('/api/users/balance/add') &&
            response.request().method() === 'POST'
    );

    await page.getByRole('button', { name: 'Add', exact: true }).click();
    const balanceResponse = await balanceResponsePromise;
    expect(balanceResponse.status()).toBe(200);

    await page.goto('/');
    await expect(page.getByRole('main').getByText(`Balance: ${amount}`)).toBeVisible();
}
