import { test, expect, Page } from '@playwright/test';
import moment from 'moment';
import 'moment/locale/es'
import { selectCustomHorario } from '.';



export const validateSuccessToast=async(page:Page,text:string="¡Los cambios realizados han sido guardados exitosamente!")=>{
  await expect(page.getByText(text)).toBeVisible()
}

const userFilePath = 'playwright/.auth/user.json';

const adminFilePath = 'playwright/.auth/admin.json';

const uuid = "5992f417-8e38-41de-b91f-5a7a472dd8d5"
const eventoName = "Test Event"
const precioHora = "200"
const days = 8
test.beforeAll(async ()=>{
  console.log("START WITH TEST")
})

const now = moment().locale("es")


test.describe(() => {
  test.use({ storageState: adminFilePath });
  test('CreateEvento', async ({ page }) => {
    await page.goto(`/establecimiento/${uuid}/eventos`)
    await page.getByTestId("crear-evento").click()
    await expect(page.getByTestId("responsive-dialog-title").getByText("Crear evento")).toBeVisible()
    await page.locator("[name='name']").fill(eventoName)
    await page.locator("[name='description']").fill("Event Description")
    await page.locator("#controllable-states-demo").fill(uuid)
    await page.getByTestId(`option-${uuid}`).click()
    await page.getByTestId("sumbit-create-event").click()
    validateSuccessToast(page)
    await page.getByTestId("instalacion-option-0").click()
    await page.getByTestId("aceptar").click()
    await expect(page.getByTestId("responsive-dialog-title").getByText("Reserva Customizada")).toBeVisible()

    await expect(page.getByText("Reserva Customizada")).toBeVisible();
    await page.getByTestId("inicio-0").click()
    await page.getByTestId("time-40").click()
    await page.getByTestId("fin-0").click()
    await page.getByTestId("time-42").click()
    await page.getByTestId("repeat").click()
    await page.getByTestId("repeat-option-1").click()

    const untilDate = now.clone().add(days,"days").format("DD/MM/YYYY")
    await page.getByTestId("until_date").getByPlaceholder("DD/MM/YYYY").fill(untilDate)
    await page.getByTestId("continuar-reserva-c").click()

    await page.locator("[name='total_pagado']").fill("100")
    await page.locator("#controllable-states-demo").click()
    await page.getByTestId(`option-${uuid}`).click()
    await page.getByRole('button', { name: 'Crear Reserva' }).click();

    await expect(page.getByText("Se ha creado exitosamente la reserva")).toBeVisible()

    const eventoStart = moment(now.format("YYYY-MM-DD") + " " + "20:00").format("lll")
    const eventoEnd = moment(now.clone().add(days,"days").format("YYYY-MM-DD") + " " + "21:00").format("lll")

    await expect(page.getByText(eventoStart)).toBeVisible()
    await expect(page.getByText(eventoEnd)).toBeVisible()
    await expect(page.getByText(uuid)).toBeVisible()
    await expect(page.getByText("1800")).toBeVisible()

    await page.getByTestId("evento-name-link-0").click()
    // await expect(page.getByTestId("evento-name").getByText(eventoName)).toBeVisible();
    await page.getByTestId("reservas-tab").click()
    await page.getByTestId("see-reserva-detail-0").click()

    await page.getByTestId("cancelar-reserva").click();
    await expect(page.getByTestId("reasignar")).toBeVisible();
    await page.getByTestId("reasignar").click();
    await page.getByTitle("Next month").click();
    await page.getByRole("gridcell",{name:"24"}).first().click();
    await page.getByRole("button",{name:"OK"}).click();
    await page.getByTestId("confirm-cancellation").click();
    await page.getByTestId("accept").click();
    await expect(page.getByText("Reserva Cancelada")).toBeVisible();
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


