import { Page } from "@playwright/test";

export const selectCustomHorario = async(page:Page)=>{
    await expect(page.getByText("Reserva Customizada")).toBeVisible();
    await page.getByTestId("inicio-0").click()
    await page.getByTestId("time-40").click()
    await page.getByTestId("fin-0").click()
    await page.getByTestId("time-42").click()
    await page.getByTestId("repeat").click()
  }
  