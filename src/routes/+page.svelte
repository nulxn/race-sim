<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { BarChart } from 'layerchart';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';

	interface Result {
		name: string;
		time: string;
		team: {
			name: string;
			id: number;
			icon: string;
			color: string;
		};
	}

	interface TeamResult {
		name: string;
		id: number;
		icon: string;
		points: number;
		color: string;
		athletes: number;
	}

	let results: Result[] = $state([
		{ name: 'Alice', time: '1:23', team: { name: 'Team A', id: 1, icon: '🔴', color: 'red' } },
		{ name: 'Bob', time: '1:45', team: { name: 'Team B', id: 2, icon: '🔵', color: 'blue' } },
		{ name: 'Charlie', time: '1:30', team: { name: 'Team A', id: 1, icon: '🔴', color: 'red' } },
		{ name: 'Dave', time: '1:50', team: { name: 'Team C', id: 3, icon: '🟢', color: 'green' } },
		{ name: 'Dave', time: '1:50', team: { name: 'Team C', id: 3, icon: '🟢', color: 'green' } },
		{ name: 'Dave', time: '1:50', team: { name: 'Team C', id: 3, icon: '🟢', color: 'green' } },
		{ name: 'Dave', time: '1:50', team: { name: 'Team C', id: 3, icon: '🟢', color: 'green' } },
		{ name: 'Dave', time: '1:50', team: { name: 'Team C', id: 3, icon: '🟢', color: 'green' } }
	]);

	function sortResults(arr: Result[]) {
		return arr.sort((a, b) => {
			if (a.time < b.time) return -1;
			if (a.time > b.time) return 1;
			return 0;
		});
	}

	function updateTime(i: number) {
		let inputElement = document.getElementById(`t-${i}`);
		let newTime = inputElement ? (inputElement as HTMLInputElement).value : null;

		if (newTime) {
			results[i].time = newTime;
		}
	}

	function calculateTeamResults(results: Result[]): TeamResult[] {
		let teams: { [key: number]: TeamResult } = {};
		results.forEach((result, i) => {
			if (!teams[result.team.id]) {
				teams[result.team.id] = {
					name: result.team.name,
					id: result.team.id,
					icon: result.team.icon,
					color: result.team.color,
					athletes: 0,
					points: 0
				};
			}

			teams[result.team.id].athletes += 1;
			if (teams[result.team.id].athletes < 6) {
				teams[result.team.id].points += i + 1;
			}
		});

		return Object.values(teams).sort((a, b) => a.points - b.points);
	}

	let teamResults: TeamResult[] = $derived(
		calculateTeamResults(results).filter((t) => t.athletes >= 5)
	);
	let doesntScore = $derived(calculateTeamResults(results).filter((t) => t.athletes < 5));

	let chosenTeam = $state('');

	$effect(() => {
		results = sortResults(results);
	});

	let hidden = $state(true);
</script>

<div class="results pb-5">
	<Table.Root class="w-[600px]">
		<Table.Caption>Race Results</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head>Place</Table.Head>
				<Table.Head>Name</Table.Head>
				<Table.Head>Time</Table.Head>
				<Table.Head>Team</Table.Head>
				<Table.Head>Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each results as result, i (i)}
				<Table.Row>
					<Table.Cell class="font-medium">{i + 1}</Table.Cell>
					<Table.Cell>{result.name}</Table.Cell>
					<Table.Cell>
						<form onsubmit={() => updateTime(i)}>
							<Input id="t-{i}" value={result.time} />
						</form>
					</Table.Cell>
					<Table.Cell>
						<span class="flex items-center">
							<Avatar.Root>
								<Avatar.Image src={result.team.icon} />
								<Avatar.Fallback>{result.team.icon}</Avatar.Fallback>
							</Avatar.Root>
							<span class="ml-2">{result.team.name}</span>
						</span>
					</Table.Cell>
					<Table.Cell>
						<Button
							variant="destructive"
							onclick={() => {
								results = results.filter((r, index) => index !== i);
							}}
						>
							Delete
						</Button>
					</Table.Cell>
				</Table.Row>
			{/each}
			<Table.Footer>
				<Drawer.Root>
					<Drawer.Trigger class={buttonVariants({ variant: 'outline' })}>Add Result</Drawer.Trigger>

					<Drawer.Content>
						<div class="mx-auto w-full max-w-sm">
							<Drawer.Header>
								<Drawer.Title>Add result</Drawer.Title>
								<Drawer.Description>Create a new athlete in the simulation</Drawer.Description>
							</Drawer.Header>
							<div class="p-4 pb-0">
								<h2>Create a result</h2>
								<Input id="r-name" placeholder="Name" />
								<Input id="r-time" class="mb-2 mt-2" placeholder="Time" />
								<Select.Root type="single" name="chosenTeam" bind:value={chosenTeam}>
									<Select.Trigger class="w-[180px]"
										>{chosenTeam === '' ? 'Find a team' : chosenTeam}</Select.Trigger
									>
									<Select.Content>
										<Select.Group>
											<Select.GroupHeading
												><Dialog.Root>
													<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}
														>Or create a new one</Dialog.Trigger
													>
													<Dialog.Content class="sm:max-w-[425px]">
														<Dialog.Header>
															<Dialog.Title>Create a new Team</Dialog.Title>
															<Dialog.Description>
																Create a new team to add to the simulation
															</Dialog.Description>
														</Dialog.Header>
														<div class="grid gap-4 py-4">
															<Input id="t-name" placeholder="Team Name" />
															<Input id="t-icon" placeholder="Team Icon" />
															<Input id="t-color" placeholder="Team Color" />
															<Button
																onclick={() => {
																	let data: TeamResult = {
																		name: (document.getElementById('t-name') as HTMLInputElement)
																			.value,
																		icon: (document.getElementById('t-icon') as HTMLInputElement)
																			.value,
																		color: (document.getElementById('t-color') as HTMLInputElement)
																			.value,
																		id: [...teamResults, ...doesntScore].length + 1,
																		points: 0,
																		athletes: 0
																	};

																	results = [
																		...results,
																		{
																			name: 'New Team',
																			time: '99:99',
																			team: data
																		}
																	];
																}}>Submit</Button
															>
														</div>
													</Dialog.Content>
												</Dialog.Root></Select.GroupHeading
											>
											{#each [...teamResults, ...doesntScore] as team, i (i)}
												<Select.Item value={team.name}>{team.name}</Select.Item>
											{/each}
										</Select.Group>
									</Select.Content>
								</Select.Root>
							</div>
							<Drawer.Footer>
								<Button
									onclick={() => {
										let data: Result = {
											name: (document.getElementById('r-name') as HTMLInputElement).value,
											time: (document.getElementById('r-time') as HTMLInputElement).value,
											team: teamResults.find((t) => t.name === chosenTeam) ||
												doesntScore.find((t) => t.name === chosenTeam) || {
													name: 'No Team',
													id: 0,
													icon: '❌',
													color: 'black'
												}
										};

										results = [...results, data];
									}}>Submit</Button
								>
								<Drawer.Close>Close</Drawer.Close>
							</Drawer.Footer>
						</div>
					</Drawer.Content>
				</Drawer.Root>
			</Table.Footer>
		</Table.Body>
	</Table.Root>

	<div class="team-graphs">
		<h2 class="pb-2">Team Graphs</h2>
		<div class="h-[300px] rounded border p-4">
			<BarChart
				data={teamResults}
				x="name"
				y="points"
				c="id"
				cRange={teamResults.map((t) => t.color)}
			/>
		</div>
		<h3><strong>Teams that don't score:</strong></h3>
		<ul>
			{#each doesntScore as team}
				<li>{team.name} ({team.athletes} runner(s))</li>
			{/each}
		</ul>
	</div>

	<Button
		variant="secondary"
		onclick={() => {
			navigator.clipboard.writeText(JSON.stringify(results));
		}}>Copy Results</Button
	>

	<Button variant="secondary" class="mb-2 mt-2" onclick={() => (hidden = !hidden)}
		>Input JSON</Button
	>

	<Button variant="destructive" onclick={() => (results = [])}>Clear Results</Button>

	<div {hidden}>
		<textarea id="json" class="h-32 w-full rounded border p-2" placeholder="Paste JSON here"
		></textarea>
		<Button
			class="mt-2"
			onclick={() =>
				(results = JSON.parse((document.getElementById('json') as HTMLTextAreaElement).value))}
		>
			Submit
		</Button>
	</div>
</div>

<style>
	.results {
		justify-content: center;
		margin: 0 auto;
	}
</style>
