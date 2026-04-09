import { test, expect } from '@playwright/test';

test('has title and can see home page', async ({ page }) => {
  await page.goto('/');

  // On s'attend à voir le titre de l'application
  await expect(page.locator('text=Raclettator').first()).toBeVisible();

  // On s'attend à voir le bouton pour créer un événement (indépendant de la langue)
  await expect(page.locator('a[href="/admin/events/create"]').first()).toBeVisible();
});
