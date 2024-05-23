import puppeteer from "puppeteer";


(async () => {
	try {
		const browser = await puppeteer.launch({ headless: false });
		const page = await browser.newPage();
		await page.goto("https://food.grab.com/sg/en/", {
			waitUntil: "networkidle2",
		});

		let data = new Array(); 

		page.on("response", async (response) => {
			try {
				const url = response.url(); 

				if (
					url.includes(
						"https://portal.grab.com/foodweb/v2/search" ||
							"https://portal.grab.com/foodweb/v2/category"
					)
				) {
					const firstResponse = await page.waitForResponse(url);

					const jsonResponse = await firstResponse.json(); 

					const restaurentsData =
						jsonResponse.searchResult.searchMerchants; 

					restaurentsData.forEach((e) => {
						let obj = {
							name: e.address.name,
							latitude: e.latlng.latitude,
							longitude: e.latlng.longitude,
						};

						data.push(obj);
					});
					console.table(data);
				}
			} catch (error) {
				console.log(error, "at page on response on line 29");
			}
		});

	} catch (error) {
		console.log(error);
	}
})();

