const wedding = window.WEDDING;
const $ = (selector) => document.querySelector(selector);

const textFields = [
	"bride",
	"groom",
	"date",
	"venue",
	"locationName",
	"address",
];

textFields.forEach((field) => {
	const element = $(`#${field}`);

	if (element) {
		element.textContent = wedding[field];
	}
});

$("#openNames").textContent = `${wedding.bride} & ${wedding.groom}`;
$("#openDate").textContent = wedding.dateText;
$("#mapLink").href = wedding.mapUrl;

$("#events").innerHTML = wedding.events
	.map(
		(event) => `
			<article>
				<h2>${event.name}</h2>
				<p>${event.date}</p>
				<p>${event.time}</p>
				<small>${event.venue}</small>
			</article>
		`,
	)
	.join("");

$("#openButton").onclick = () => {
	$("#envelope").classList.add("open");

	setTimeout(() => {
		$("#opening").classList.add("fade", "hidden");
		$("#site").classList.remove("hidden");
	}, 850);
};

function updateCountdown() {
	const remaining = Math.max(0, new Date(wedding.dateISO) - Date.now());
	const values = [
		Math.floor(remaining / 864e5),
		Math.floor(remaining / 36e5) % 24,
		Math.floor(remaining / 6e4) % 60,
		Math.floor(remaining / 1e3) % 60,
	];
	const labels = ["days", "hours", "minutes", "seconds"];

	$("#countdown").innerHTML = values
		.map((value, index) => `<span>${value}<small>${labels[index]}</small></span>`)
		.join("");
}

updateCountdown();
setInterval(updateCountdown, 1e3);

$("#rsvpForm").onsubmit = async (event) => {
	event.preventDefault();
	const status = $("#rsvpStatus");

	try {
		const response = await fetch(`${wedding.apiUrl}/api/rsvp`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(Object.fromEntries(new FormData(event.target))),
		});

		if (!response.ok) {
			throw new Error("RSVP request failed");
		}

		event.target.reset();
		status.textContent = "Thank you - your RSVP has been received.";
	} catch {
		status.textContent = "Sorry, we couldn't send that. Please try again.";
	}
};
