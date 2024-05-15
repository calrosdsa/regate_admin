  import { test, expect } from '@playwright/test';


  const userFilePath = 'playwright/.auth/user.json';

  const adminFilePath = 'playwright/.auth/admin.json';

  test.describe(() => {
    test('login-admin', async ({ page }) => {
      await page.goto('/auth/login')
      await page.locator("[name='email']").fill("jorge@gmail.com")
      await page.locator("[name='password']").fill("12ab34cd56ef")
    
      await page.getByRole('button',{name:"Submit"}).click()
      await page.waitForURL('/admin/manage/establecimientos')
      await expect(page).toHaveURL('/admin/manage/establecimientos')
      await page.context().storageState({ path: adminFilePath });
    })
  })

  // test.describe(() => {
  //   test('login-user', async ({ page }) => {
  //     await page.goto('/auth/login')
  //     await page.locator("[name='email']").fill("jorgemiranda0180@gmail.com")
  //     await page.locator("[name='password']").fill("12ab34cd56ef")
    
  //     await page.getByRole('button',{name:"Submit"}).click()
  //     await page.waitForURL('/auth/establecimientos')
  //     await expect(page).toHaveURL('/auth/establecimientos')
  //     await page.context().storageState({ path: userFilePath });
  //   })
  // })
