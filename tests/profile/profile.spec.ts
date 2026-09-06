import { expect, test } from '@playwright/test';
import { registerAndLogin } from '../helpers/auth';

test.describe('Profile', () => {

    test('PROFILE-001: should display correct user data', async ({ page }) => {
        const user = await registerAndLogin(page);

        await page.goto('/profile');
        await expect(page.getByText(`Name: ${user.name}`, { exact: true })).toBeVisible();
        await expect(page.getByText(`Surname: ${user.surname}`, { exact: true })).toBeVisible();
        await expect(page.getByText(`Email: ${user.email}`, { exact: true })).toBeVisible();
    });


    test('PROFILE-002: should display correct user data after reload', async ({ page }) => {
        const user = await registerAndLogin(page);

        await page.goto('/profile');
        await expect(page.getByText(`Name: ${user.name}`, { exact: true })).toBeVisible();
        await expect(page.getByText(`Surname: ${user.surname}`, { exact: true })).toBeVisible();
        await expect(page.getByText(`Email: ${user.email}`, { exact: true })).toBeVisible();

        await page.reload();

        await expect(page.getByText(`Name: ${user.name}`, { exact: true })).toBeVisible();
        await expect(page.getByText(`Surname: ${user.surname}`, { exact: true })).toBeVisible();
        await expect(page.getByText(`Email: ${user.email}`, { exact: true })).toBeVisible();
    });


    test('PROFILE-003: should display correct user data after opening another page', async ({ page }) => {
        const user = await registerAndLogin(page);

        await page.goto('/profile');
        await expect(page.getByText(`Name: ${user.name}`, { exact: true })).toBeVisible();
        await expect(page.getByText(`Surname: ${user.surname}`, { exact: true })).toBeVisible();

        await expect(page.getByText(`Email: ${user.email}`, { exact: true })).toBeVisible();

        await page.goto('/');
        await page.goto('/profile');

        await expect(page.getByText(`Name: ${user.name}`, { exact: true })).toBeVisible();
        await expect(page.getByText(`Surname: ${user.surname}`, { exact: true })).toBeVisible();
        await expect(page.getByText(`Email: ${user.email}`, { exact: true })).toBeVisible();
    });

});
