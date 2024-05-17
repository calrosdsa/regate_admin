import { test, expect, Page } from '@playwright/test';
import moment from 'moment';
import 'moment/locale/es'

import { AppPageRouteModule } from 'next/dist/server/future/route-modules/app-page/module.compiled';


const userFilePath = 'playwright/.auth/user.json';

const adminFilePath = 'playwright/.auth/admin.json';

const uuid = "5992f417-8e38-41de-b91f-5a7a472dd8d5"
const instalacionName = "Test Cancha Play"
const precioHora = "200"
test.beforeAll(async ()=>{
  console.log("START WITH TEST")
})

const now = moment().locale("es")


test.describe(() => {
  test.use({ storageState: adminFilePath });
  test('DeleteReserva', async ({ page }) => {
    await page.goto(`/establecimiento/${uuid}/reservas`)
    await page.getByTestId("see-reserva-detail-1").click()
    await expect(page.getByText("Detalles de la Reserva")).toBeVisible()
    await page.getByTestId("delete-reserva").click()
    await expect(page.getByText("Por favor, confirme si desea continuar")).toBeVisible()
    await page.getByTestId("accept").click()
    await expect(page.getByText("¡Los cambios realizados han sido guardados exitosamente!")).toBeVisible()
  })
 

})

// test.describe(() => {
  
//   test.use({ storageState: userFilePath });
//   test('CheckRedirectPageUserRol', async ({ page }) => {
//     await page.goto('/')
//     await page.waitForURL('/auth/login')
//     await expect(page).toHaveURL('/auth/login')
//   })
// })


test.afterAll(async ()=>{
  console.log("DONE WITH TEST")
})


