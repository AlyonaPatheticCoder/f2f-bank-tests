import { expect, test } from '@playwright/test';
import { registerAndLogin } from '../helpers/auth';
import { addBalance } from '../helpers/balance';
import {makeTransfer} from "../helpers/transfer";

test.describe('Successful transfer', () => {

    test('TRANS-001: should complete transfer with valid data', async ({ page }) => {
        const startBalance = '1000';
        const transferAmount = '100';
        const finalBalance = Number(startBalance) - Number(transferAmount);

        await registerAndLogin(page);
        await addBalance(page, startBalance);

        await makeTransfer(
            page,
            '+79991234567',
            transferAmount,
            'Test transfer'
        );

        await expect(page.getByRole('main').getByText(`Balance: ${finalBalance}`)).toBeVisible();
    });

    test('TRANS-002: should complete transfer with transfer amount equal to balance', async ({ page }) => {
        const startBalance = '1000';
        const transferAmount = '1000';
        const finalBalance = '0';

        await registerAndLogin(page);
        await addBalance(page, startBalance);

        await makeTransfer(
            page,
            '+79991234567',
            transferAmount,
            'Full balance transfer'
        );

        await expect(page.getByRole('main').getByText(`Balance: ${finalBalance}`)).toBeVisible();
    });

    test('TRANS-003: should complete multiple transfers with enough balance', async ({ page }) => {
        const startBalance = '1000';
        const firstTransfer = '100';
        const secondTransfer = '200';
        const finalBalance = '700';

        await registerAndLogin(page);
        await addBalance(page, startBalance);

        await makeTransfer(
            page,
            '+79991234567',
            firstTransfer,
            'First transfer'
        );

        await expect(page.getByRole('main').getByText('Balance: 900')).toBeVisible();

        await page.getByRole('button', { name: 'New transfer' }).click();
        await makeTransfer(
            page,
            '+79991234567',
            secondTransfer,
            'Second transfer'
        );

        await expect(page.getByRole('main').getByText(`Balance: ${finalBalance}`)).toBeVisible();
    });

    //valid phone

    test('TRANS-004: should complete transfer with formatted phone number', async ({ page }) => {
        const startBalance = '1000';
        const transferAmount = '100';
        const finalBalance = Number(startBalance) - Number(transferAmount);

        await registerAndLogin(page);
        await addBalance(page, startBalance);

        await makeTransfer(
            page,
            '+7 (999) 123-45-67',
            transferAmount,
            'Formatted phone transfer'
        );

        await expect(page.getByRole('main').getByText(`Balance: ${finalBalance}`)).toBeVisible();
    });

    test('TRANS-005: should complete transfer with 10 digit phone number', async ({ page }) => {
        const startBalance = '1000';
        const transferAmount = '100';
        const finalBalance = Number(startBalance) - Number(transferAmount);

        await registerAndLogin(page);
        await addBalance(page, startBalance);

        await makeTransfer(
            page,
            '+1234567890',
            transferAmount,
            'Minimum phone length transfer'
        );

        await expect(page.getByRole('main').getByText(`Balance: ${finalBalance}`)).toBeVisible();
    });


    test('TRANS-006: should complete transfer with 15 digit phone number', async ({ page }) => {
        const startBalance = '1000';
        const transferAmount = '100';
        const finalBalance = Number(startBalance) - Number(transferAmount);

        await registerAndLogin(page);
        await addBalance(page, startBalance);

        await makeTransfer(
            page,
            '+123456789012345',
            transferAmount,
            'Maximum phone length transfer'
        );

        await expect(page.getByRole('main').getByText(`Balance: ${finalBalance}`)).toBeVisible();
    });

    //balance consistency

    test('TRANS-007: should not change balance after invalid phone', async ({ page }) => {
        await registerAndLogin(page);
        await addBalance(page, '1000');

        await page.getByRole('textbox', { name: '+7 999 123-45-' }).fill('+123456789');
        await page.getByRole('spinbutton', { name: '0.00' }).fill('100');
        await page.getByRole('textbox', { name: 'e.g. debt repayment' }).fill('Invalid phone');
        await page.getByRole('button', { name: 'Send', exact: true }).click();

        await expect(page.getByText('Phone must contain 10–15 digits')).toBeVisible();
        await expect(page.getByRole('main').getByText('Balance: 1000')).toBeVisible();
    });


});

test.describe('Unsuccessful transfer', () => {

    //invalid phone

    test('TRANS-008: should reject phone number with less than 10 digits', async ({ page }) => {
        await registerAndLogin(page);
        await addBalance(page, '1000');

        await page.getByRole('textbox', { name: '+7 999 123-45-' }).fill('+123456789');
        await page.getByRole('spinbutton', { name: '0.00' }).fill('100');
        await page.getByRole('textbox', { name: 'e.g. debt repayment' }).fill('Too short phone number');
        await page.getByRole('button', { name: 'Send', exact: true }).click();

        await expect(page.getByText('Phone must contain 10–15 digits')).toBeVisible();
        await expect(page.getByText('Transfer completed')).not.toBeVisible();
    });


    test('TRANS-009: should reject phone number with more than 15 digits', async ({ page }) => {
        await registerAndLogin(page);
        await addBalance(page, '1000');

        await page.getByRole('textbox', { name: '+7 999 123-45-' }).fill('+1234567890123456');
        await page.getByRole('spinbutton', { name: '0.00' }).fill('100');
        await page.getByRole('textbox', { name: 'e.g. debt repayment' }).fill('Too long phone number');
        await page.getByRole('button', { name: 'Send', exact: true }).click();

        await expect(page.getByText('Phone must contain 10–15 digits')).toBeVisible();
        await expect(page.getByText('Transfer completed')).not.toBeVisible();
    });


    test('TRANS-010: should reject phone number without plus sign', async ({ page }) => {
        await registerAndLogin(page);
        await addBalance(page, '1000');

        await page.getByRole('textbox', { name: '+7 999 123-45-' }).fill('1234567890');
        await page.getByRole('spinbutton', { name: '0.00' }).fill('100');
        await page.getByRole('textbox', { name: 'e.g. debt repayment' }).fill('No plus sign');
        await page.getByRole('button', { name: 'Send', exact: true }).click();

        await expect(page.getByText('Must start with + and country code. Example: +7 999 123-45-67'))
            .toBeVisible();

        await expect(page.getByText('Transfer completed')).not.toBeVisible();
    });

    test('TRANS-011: should reject transfer when phone is empty', async ({ page }) => {
        await registerAndLogin(page);
        await addBalance(page, '1000');

        await page.getByRole('spinbutton', { name: '0.00' }).fill('100');
        await page.getByRole('textbox', { name: 'e.g. debt repayment' }).fill('Empty phone');
        await page.getByRole('button', { name: 'Send', exact: true }).click();

        await expect(page.getByText('Phone number is required')).toBeVisible();
        await expect(page.getByText('Transfer completed')).not.toBeVisible();
    });

    test('TRANS-012: should not send transfer request for invalid phone', async ({ page }) => {
        await registerAndLogin(page);
        await addBalance(page, '1000');

        await page.getByRole('textbox', { name: '+7 999 123-45-' }).fill('+123456789');
        await page.getByRole('spinbutton', { name: '0.00' }).fill('100');
        await page.getByRole('textbox', { name: 'e.g. debt repayment' }).fill('Invalid phone');

        let transferRequestSent = false;

        page.on('request', request => {
            if (
                request.url().includes('/api/users/transfer') &&
                request.method() === 'POST'
            ) {
                transferRequestSent = true;
            }
        });

        await page.getByRole('button', { name: 'Send', exact: true }).click();

        await expect(page.getByText('Phone must contain 10–15 digits')).toBeVisible();
        expect(transferRequestSent).toBe(false);
    });

    test('TRANS-013: should reject phone number containing only plus sign', async ({ page }) => {
        await registerAndLogin(page);
        await addBalance(page, '1000');

        await page.getByRole('textbox', { name: '+7 999 123-45-' }).fill('+');
        await page.getByRole('spinbutton', { name: '0.00' }).fill('100');
        await page.getByRole('textbox', { name: 'e.g. debt repayment' }).fill('Only plus');
        await page.getByRole('button', { name: 'Send', exact: true }).click();

        await expect(page.getByText('Phone must contain 10–15 digits')).toBeVisible();
        await expect(page.getByRole('main').getByText('Balance: 1000')).toBeVisible();
        await expect(page.getByText('Transfer completed')).not.toBeVisible();
    });

    test('TRANS-014: should handle phone number with non-digit characters', async ({ page }) => {
        await registerAndLogin(page);
        await addBalance(page, '1000');

        await page.getByRole('textbox', { name: '+7 999 123-45-' })
            .fill('+79991234abc567');

        await page.getByRole('spinbutton', { name: '0.00' }).fill('100');
        await page.getByRole('textbox', { name: 'e.g. debt repayment' })
            .fill('Phone with letters');

        const transferResponsePromise = page.waitForResponse(
            response =>
                response.url().includes('/api/users/transfer') &&
                response.request().method() === 'POST'
        );

        await page.getByRole('button', { name: 'Send', exact: true }).click();
        const transferResponse = await transferResponsePromise;

        expect(transferResponse.status()).toBe(200);

        await expect(page.getByRole('main').getByText('Balance: 900')).toBeVisible();
    });

    test('TRANS-015: should reject phone number without digits', async ({ page }) => {
        await registerAndLogin(page);
        await addBalance(page, '1000');

        await page.getByRole('textbox', { name: '+7 999 123-45-' })
            .fill('+---()');

        await page.getByRole('spinbutton', { name: '0.00' }).fill('100');
        await page.getByRole('textbox', { name: 'e.g. debt repayment' })
            .fill('Phone without digits');

        await page.getByRole('button', { name: 'Send', exact: true }).click();

        await expect(page.getByText('Phone must contain 10–15 digits')).toBeVisible();
        await expect(page.getByRole('main').getByText('Balance: 1000')).toBeVisible();
        await expect(page.getByText('Transfer completed')).not.toBeVisible();
    });

    // invalid transfer amount

    test('TRANS-016: should reject zero transfer amount', async ({ page }) => {
        await registerAndLogin(page);
        await addBalance(page, '1000');

        await page.getByRole('textbox', { name: '+7 999 123-45-' }).fill('+1234567890');
        await page.getByRole('spinbutton', { name: '0.00' }).fill('0');
        await page.getByRole('textbox', { name: 'e.g. debt repayment' }).fill('Zero amount');
        await page.getByRole('button', { name: 'Send', exact: true }).click();

        await expect(page.getByText('Amount must be greater than zero')).toBeVisible();
        await expect(page.getByText('Transfer completed')).not.toBeVisible();
    });

    test('TRANS-017: should reject transfer when amount is empty', async ({ page }) => {
        await registerAndLogin(page);
        await addBalance(page, '1000');

        await page.getByRole('textbox', { name: '+7 999 123-45-' }).fill('+1234567890');
        await page.getByRole('textbox', { name: 'e.g. debt repayment' }).fill('Empty amount');

        await page.getByRole('button', { name: 'Send', exact: true }).click();
        await expect(page.getByRole('spinbutton', { name: '0.00' }))
            .toHaveJSProperty('validity.valid', false);

    });

    test('TRANS-018: should reject negative transfer amount', async ({ page }) => {
        await registerAndLogin(page);
        await addBalance(page, '1000');

        await page.getByRole('textbox', { name: '+7 999 123-45-' }).fill('+1234567890');
        await page.getByRole('spinbutton', { name: '0.00' }).fill('-1');
        await page.getByRole('textbox', { name: 'e.g. debt repayment' }).fill('Negative amount');
        await page.getByRole('button', { name: 'Send', exact: true }).click();

        await expect(page.getByText('Amount must be greater than zero')).toBeVisible();
        await expect(page.getByText('Transfer completed')).not.toBeVisible();
    });

    // insufficient balance

    test('TRANS-019: should reject transfer when balance is insufficient', async ({ page }) => {
        await registerAndLogin(page);
        await addBalance(page, '1000');

        await page.getByRole('textbox', { name: '+7 999 123-45-' }).fill('+1234567890');
        await page.getByRole('spinbutton', { name: '0.00' }).fill('1001');
        await page.getByRole('textbox', { name: 'e.g. debt repayment' }).fill('Insufficient funds');

        const transferResponsePromise = page.waitForResponse(
            response =>
                response.url().includes('/api/users/transfer') &&
                response.request().method() === 'POST'
        );

        await page.getByRole('button', { name: 'Send', exact: true }).click();
        const transferResponse = await transferResponsePromise;

        expect(transferResponse.status()).not.toBe(200);

        await expect(page.getByText('Transfer failed. Check your balance.')).toBeVisible();
        await expect(page.getByRole('main').getByText('Balance: 1000')).toBeVisible();
    });

    test('TRANS-020: should not allow transfer after full balance is spent', async ({ page }) => {
        await registerAndLogin(page);
        await addBalance(page, '1000');

        await makeTransfer(
            page,
            '+79991234567',
            '1000',
            'Full balance'
        );

        await expect(page.getByRole('main').getByText('Balance: 0')).toBeVisible();

        await page.getByRole('button', { name: 'New transfer' }).click();
        await page.getByRole('textbox', { name: '+7 999 123-45-' }).fill('+79991234567');
        await page.getByRole('spinbutton', { name: '0.00' }).fill('0.01');
        await page.getByRole('textbox', { name: 'e.g. debt repayment' }).fill('Insufficient balance');

        const transferResponsePromise = page.waitForResponse(
            response =>
                response.url().includes('/api/users/transfer') &&
                response.request().method() === 'POST'
        );

        await page.getByRole('button', { name: 'Send', exact: true }).click();

        const response = await transferResponsePromise;

        expect(response.status()).not.toBe(200);
        await expect(page.getByText('Transfer failed. Check your balance.')).toBeVisible();
        await expect(page.getByRole('main').getByText('Balance: 0')).toBeVisible();
    });

    // invalid purpose

    test('TRANS-021: should reject transfer when purpose is empty', async ({ page }) => {
        await registerAndLogin(page);
        await addBalance(page, '1000');

        await page.getByRole('spinbutton', { name: '0.00' }).fill('100');
        await page.getByRole('textbox', { name: '+7 999 123-45-' }).fill('+1234567890');
        await page.getByRole('button', { name: 'Send', exact: true }).click();

        await expect(page.getByRole('textbox', { name: 'e.g. debt repayment' }))
            .toHaveJSProperty('validity.valid', false);

        await expect(page.getByText('Transfer completed')).not.toBeVisible();
    });
});

test.describe('Transfer form', () => {
    test('TRANS-022: should reset transfer form after successful transfer', async ({ page }) => {
        const startBalance = '1000';
        const transferAmount = '100';

        await registerAndLogin(page);
        await addBalance(page, startBalance);

        await makeTransfer(
            page,
            '+79991234567',
            transferAmount,
            'Test transfer'
        );

        await expect(page.getByText('Transfer completed successfully')).toBeVisible();
        await page.getByRole('button', { name: 'New transfer' }).click();

        await expect(page.getByRole('textbox', { name: '+7 999 123-45-' })).toHaveValue('');
        await expect(page.getByRole('spinbutton', { name: '0.00' })).toHaveValue('');
        await expect(page.getByRole('textbox', { name: 'e.g. debt repayment' })).toHaveValue('');
        await expect(page.getByRole('button', { name: 'Send', exact: true })).toBeVisible();
    });

    test('TRANS-023: should clear transfer form after clicking Cancel', async ({ page }) => {
        await registerAndLogin(page);
        await addBalance(page, '1000');

        const phoneInput = page.getByRole('textbox', { name: '+7 999 123-45-' });
        const amountInput = page.getByRole('spinbutton', { name: '0.00' });
        const purposeInput = page.getByRole('textbox', { name: 'e.g. debt repayment' });

        await phoneInput.fill('+79991234567');
        await amountInput.fill('100');
        await purposeInput.fill('Test transfer');

        await expect(phoneInput).toHaveValue('+79991234567');
        await expect(amountInput).toHaveValue('100');
        await expect(purposeInput).toHaveValue('Test transfer');

        await page.getByRole('button', { name: 'Cancel', exact: true }).click();

        await expect(phoneInput).toHaveValue('');
        await expect(amountInput).toHaveValue('');
        await expect(purposeInput).toHaveValue('');

        await expect(page.getByRole('button', { name: 'Send', exact: true })).toBeVisible();
    });
});
