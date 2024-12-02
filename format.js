const url =
	'https://ca.milesplit.com/api/v1/meets/646476/performances?isMeetPro=0&resultsId=1107925';

let results = [];
fetch(url)
	.then((res) => res.json())
	.then((json) => {
		let data = json.data;
		data.forEach((performance) => {
			results.push({
				name: performance.firstName + ' ' + performance.lastName,
				time: `${Math.floor(performance.units / 60000)}:${((performance.units % 60000) / 1000).toFixed(3)}`,
				team: {
					name: performance.teamName,
					id: performance.teamProfileUrl.split('/teams/')[1].split('-')[0],
					icon: performance.teamLogo,
					color: '#' + Math.floor(Math.random() * 16777215).toString(16)
				}
			});
		});

		console.log(JSON.stringify(results));
	});
