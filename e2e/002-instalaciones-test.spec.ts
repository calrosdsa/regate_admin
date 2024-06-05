import { test, expect, Page } from '@playwright/test';
import moment from 'moment';
import 'moment/locale/es'

import { AppPageRouteModule } from 'next/dist/server/future/route-modules/app-page/module.compiled';


const userFilePath = 'playwright/.auth/user.json';

const adminFilePath = 'playwright/.auth/admin.json';

const uuid = "5992f417-8e38-41de-b91f-5a7a472dd8d5"
const instalacionName = "Test Cancha Play"
const precioHora = "200"

const selectCustomHorario = async(page:Page)=>{
  await expect(page.getByText("Reserva Customizada")).toBeVisible();
  await page.getByTestId("inicio-0").click()
  await page.getByTestId("time-40").click()
  await page.getByTestId("fin-0").click()
  await page.getByTestId("time-42").click()
  await page.getByTestId("repeat").click()
}

test.beforeAll(async ()=>{
  console.log("START WITH TEST")
})

const now = moment().locale("es")


test.describe(() => {
  test.use({ storageState: adminFilePath });
  test('CheckRedirectPageAdminRol', async ({ page }) => {
    await page.goto('/')
    await page.waitForURL('/admin/manage/establecimientos')
    await expect(page).toHaveURL('/admin/manage/establecimientos')
  })
  test("CreateInstalacionAndReservar", async ({page}) =>{
    await page.goto(`/establecimiento/${uuid}/instalaciones`)
    await page.getByTestId("crear-cancha").click()
    await expect(page.getByText("Crear nueva cancha")).toBeVisible()
    await page.locator("[name='name']").fill(instalacionName)  
    await page.locator("[name='description']").fill("instalacionNameDescription")  
    await page.getByTestId("select-category").click()
    await page.getByTestId("category-0").click()
    await page.getByRole("button",{name:"Agregar horas"}).click()
    await page.getByTestId("inicio-0").click()
    await page.getByTestId("time-20").click()
    await page.getByTestId("fin-0").click()
    await page.getByTestId("time-47").click()
    await page.locator("#amount-0").fill(precioHora)
    await page.getByRole('button', { name: 'Crear cancha' }).click();
    await expect(page.getByTestId("cancha-0").getByText(instalacionName)).toBeVisible();  
    await page.getByTestId("cancha-0").click()
    await page.locator("#reservas-tab").click();
    await page.locator("#cupo-reserva-45").click();
    await page.locator("#cupo-reserva-46").click();
    await page.getByRole('button', { name: 'Crear Reserva' }).click();
    await expect(page.getByTestId("reserva-fecha").getByText("de 22:00 a 23:00")).toBeVisible();  
    await page.locator("[name='paid']").fill("100")
    await page.locator("#controllable-states-demo").fill(uuid)
    await page.locator("[name='phone_number']").fill("+591 67953118")
    await page.getByRole('button', { name: 'Crear Reserva' }).click();
    await page.locator("#cupo-reserva-45").click();
    await expect(page.getByTestId("detail-cancha-name").getByText(instalacionName)).toBeVisible();  
    await expect(page.getByTestId("reserva-fecha").getByText("de 22:00 a 23:00")).toBeVisible(); 
    await expect(page.getByTestId("reserva-precio").getByText(precioHora)).toBeVisible();  
    await expect(page.getByTestId("reserva-monto-pagado").getByText("100")).toBeVisible();  
    await expect(page.getByTestId("reserva-estado").getByText("Pendiente")).toBeVisible();  
  })
  test("CreateReservaWithCustomHorario", async({page})=>{
    console.log(now.format("ll"),"12301")
    await page.goto(`/establecimiento/${uuid}/instalaciones`)
    await expect(page.getByTestId("cancha-0").getByText(instalacionName)).toBeVisible();  
    await page.getByTestId("cancha-0").click()
    await page.locator("#reservas-tab").click();
    await page.getByTestId("crear-reserva-custom").click();

    selectCustomHorario(page)
    await page.getByTestId("repeat-option-1").click()

    const days = 8
    const untilDate = now.clone().add(days,"days").format("DD/MM/YYYY")
    await page.getByTestId("until_date").getByPlaceholder("DD/MM/YYYY").fill(untilDate)
    await page.getByTestId("continuar-reserva-c").click()

    // await page.getByTestId(`tab-interval-${i+1}`).click();
    for(let i = 0;i < days;i++){
      const currentD = now.clone().add(i,"days").format("ll")
      console.log("CURRENT",currentD)
      await expect(page.getByTestId("reserva-fecha").getByText(currentD)).toBeVisible();
      await page.getByTestId(`tab-interval-${i+1}`).click();
    }
    await page.getByTestId("seleccionar-hora").click()

    selectCustomHorario(page)
    await page.getByTestId("repeat-option-2").click()
    await page.getByTestId(`day-${now.day()}`).click()
    await page.getByTestId("until_date").getByPlaceholder("DD/MM/YYYY").fill(untilDate)
    await page.getByTestId("continuar-reserva-c").click()

    const iterations = Math.floor(days/7)
    await page.getByTestId(`tab-interval-0`).click();
     for(let i = 0;i <= iterations;i++){
      const currentD = now.clone().add(i*7,"days").format("ll")
      await expect(page.getByTestId("reserva-fecha").getByText(currentD)).toBeVisible();
      if(iterations > i){
        await page.getByTestId(`tab-interval-${i+1}`).click();
      }
    }
  })
  test("EditReserva", async ({page}) =>{
    await page.goto(`/establecimiento/${uuid}/instalaciones`)
    await expect(page.getByTestId("cancha-0").getByText(instalacionName)).toBeVisible();  
    await page.getByTestId("cancha-0").click()
    await page.locator("#reservas-tab").click();
    await page.locator("#cupo-reserva-45").click();
    await expect(page.getByTestId("detail-cancha-name").getByText(instalacionName)).toBeVisible();  
    await expect(page.getByTestId("reserva-fecha").getByText("de 22:00 a 23:00")).toBeVisible();  
    await page.getByTestId("edit-reserva").click()
    await expect(page.getByText("Editar reserva")).toBeVisible();  
    await page.locator("[name='paid']").fill("0");
    await page.getByTestId("s-estado").click();
    await page.getByTestId("s-estado-0").click();
    await page.getByTestId("s-extra-time").click();
    await page.getByTestId("s-extra-time-0").click();
    await page.getByRole('button', { name: 'Guardar cambios' }).click();
    
    await expect(page.getByTestId("reserva-fecha").getByText("de 22:00 a 23:30")).toBeVisible(); 
    await expect(page.getByTestId("reserva-precio").getByText("300")).toBeVisible();  
    await expect(page.getByTestId("reserva-monto-pagado").getByText("0")).toBeVisible();  
    await expect(page.getByTestId("reserva-estado").getByText("Pendiente")).toBeVisible();  
    await page.getByTestId("d-detail-reserva-close").click();
    await page.locator("#cupo-reserva-47").click();
    await expect(page.getByTestId("detail-cancha-name").getByText(instalacionName)).toBeVisible();  
    await expect(page.getByTestId("reserva-fecha").getByText("de 22:00 a 23:30")).toBeVisible(); 
    await expect(page.getByTestId("reserva-precio").getByText("300")).toBeVisible();  
    await expect(page.getByTestId("reserva-monto-pagado").getByText("0")).toBeVisible();  
    await expect(page.getByTestId("reserva-estado").getByText("Pendiente")).toBeVisible();  
  })

  test("CancelarReserva", async ({page}) =>{
    await page.goto(`/establecimiento/${uuid}/instalaciones`)
    await expect(page.getByTestId("cancha-0").getByText(instalacionName)).toBeVisible();  
    await page.getByTestId("cancha-0").click()
    await page.locator("#reservas-tab").click();
    await page.locator("#cupo-reserva-45").click();
    await expect(page.getByTestId("detail-cancha-name").getByText(instalacionName)).toBeVisible();  
    await page.getByTestId("cancelar-reserva").click();
    await expect(page.getByTestId("reasignar")).toBeVisible();
    await page.getByTestId("reasignar").click();
    await page.getByTitle("Next month").click();
    await page.getByRole("gridcell",{name:"23"}).first().click();
    await page.getByRole("button",{name:"OK"}).click();
    await page.getByTestId("confirm-cancellation").click();
    await page.getByTestId("accept").click();
    await expect(page.getByText("Reserva Cancelada")).toBeVisible();
  })



  test("CreateHorarioInstalacion", async ({page}) =>{
    await page.goto('/establecimiento/5992f417-8e38-41de-b91f-5a7a472dd8d5/instalaciones')
    await page.getByTestId("settings-instalacines").click()
    await expect(page.getByText("Configurar horas disponible")).toBeVisible()
    await page.getByRole("button",{name:"Agregar horas"}).click()
    await page.getByTestId("inicio-0").click()
    await page.getByTestId("time-0").click()
    await page.getByTestId("fin-0").click()
    await page.getByTestId("time-4").click()
    await page.locator("#amount-0").fill(precioHora)
    await page.getByTestId("type-action").click()
    await page.getByTestId("Crear").click()
    await page.getByRole("button",{name:"Guardar Cambios"}).click()
    await expect(page.getByText("¡Los cambios realizados han sido guardados exitosamente!")).toBeVisible()
  })
  test("EditarInstalacionesHorario", async ({page}) =>{
    await page.goto('/establecimiento/5992f417-8e38-41de-b91f-5a7a472dd8d5/instalaciones')
    await page.getByTestId("settings-instalacines").click()
    await expect(page.getByText("Configurar horas disponible")).toBeVisible()
    await page.getByRole("button",{name:"Agregar horas"}).click()
    await page.getByTestId("inicio-0").click()
    await page.getByTestId("time-0").click()
    await page.getByTestId("fin-0").click()
    await page.getByTestId("time-4").click()
    await page.locator("#amount-0").fill(precioHora)
    await page.getByRole("button",{name:"Guardar Cambios"}).click()
    await expect(page.getByText("¡Los cambios realizados han sido guardados exitosamente!")).toBeVisible()
  })

  test("EliminarInstalacionesHorario", async ({page}) =>{
    await page.goto('/establecimiento/5992f417-8e38-41de-b91f-5a7a472dd8d5/instalaciones')
    await page.getByTestId("settings-instalacines").click()
    await expect(page.getByText("Configurar horas disponible")).toBeVisible()
    await page.getByRole("button",{name:"Agregar horas"}).click()
    await page.getByTestId("inicio-0").click()
    await page.getByTestId("time-0").click()
    await page.getByTestId("fin-0").click()
    await page.getByTestId("time-4").click()
    await page.locator("#amount-0").fill(precioHora)
    await page.getByTestId("type-action").click()
    await page.getByTestId("Eliminar").click()
    await page.getByRole("button",{name:"Guardar Cambios"}).click()
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


