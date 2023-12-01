import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const bookTitles = [
	"The Great Gatsby",
	"To Kill a Mockingbird",
	"1984",
	"The Catcher in the Rye",
	"Pride and Prejudice",
	"Harry Potter and the Philosopher's Stone",
	"The Lord of the Rings",
	"Animal Farm",
	"Brave New World",
	"The Chronicles of Narnia",
	"The Hobbit",
	"The Alchemist",
	"The Little Prince",
	"One Hundred Years of Solitude",
	"Fahrenheit 451",
	"The Kite Runner",
	"The Picture of Dorian Gray",
	"Wuthering Heights",
	"The Book Thief",
	"Moby-Dick",
	"Lord of the Flies",
	"The Hitchhiker's Guide to the Galaxy",
	"Frankenstein",
	"The Grapes of Wrath",
	"The Da Vinci Code",
	"Anna Karenina",
	"Slaughterhouse-Five",
	"The Handmaid's Tale",
	"The Road",
	"Gone with the Wind",
	"Crime and Punishment",
	"The Sun Also Rises",
	"A Tale of Two Cities",
	"The Adventures of Tom Sawyer",
	"The Count of Monte Cristo",
	"Dracula",
	"Les Misérables",
	"The Stand",
	"Catch-22",
	"Invisible Man",
	"The Color Purple",
	"A Clockwork Orange",
	"The Shining",
	"The Girl with the Dragon Tattoo",
	"East of Eden",
	"The Scarlet Letter",
	"Beloved",
	"Heart of Darkness",
	"The Secret Garden",
];

const bookAuthors = [
	"Haruki Murakami",
	"Chimamanda Ngozi Adichie",
	"Gabriel Garcia Marquez",
	"J.K. Rowling",
	"Margaret Atwood",
	"Ernest Hemingway",
	"Toni Morrison",
	"George Orwell",
	"Jane Austen",
	"Stephen King",
	"Salman Rushdie",
	"Virginia Woolf",
	"Fyodor Dostoevsky",
	"Agatha Christie",
	"James Baldwin",
	"Arundhati Roy",
	"Gabriel Garcia Marquez",
	"Kazuo Ishiguro",
	"Octavia Butler",
	"Milan Kundera",
	"Zadie Smith",
	"Albert Camus",
	"Neil Gaiman",
	"Leo Tolstoy",
	"Franz Kafka",
	"Margaret Atwood",
	"Oscar Wilde",
	"Gabriel García Márquez",
	"Yukio Mishima",
	"Jhumpa Lahiri",
	"Charles Dickens",
	"David Foster Wallace",
	"Paulo Coelho",
	"Virginia Woolf",
	"Doris Lessing",
	"Ken Follett",
	"Colson Whitehead",
	"Jonathan Franzen",
	"Isabel Allende",
	"Thomas Pynchon",
	"Murakami Ryu",
	"Ursula K. Le Guin",
	"John Steinbeck",
	"Philip Roth",
	"Donna Tartt",
	"Margaret Drabble",
	"Julian Barnes",
	"Jean-Paul Sartre",
	"Cormac McCarthy",
	"Chinua Achebe",
];

const description =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.";

function generateBook() {
	const title = bookTitles[Math.floor(Math.random() * bookTitles.length)];
	const author = bookAuthors[Math.floor(Math.random() * bookAuthors.length)];
	const buyingPrice = Math.floor(Math.random() * 8900) + 100; // Range: 100 to 9000 INR
	const sellingPrice =
		Math.floor(Math.random() * (9000 - buyingPrice)) + buyingPrice; // Buying price < Selling price

	return {
		title,
		author,
		description,
		buyable: true,
		BookPrice: {
			create: {
				buyingPrice,
				sellingPrice,
			},
		},
	};
}

const count = 60;

async function seedData() {
	const books = Array.from({ length: count }, generateBook);

	for (const book of books) {
		await prisma.book.create({
			data: book,
		});
	}

	console.log(`Seeded ${count} books`);
}

async function main() {
	try {
		await seedData();
	} catch (error) {
		console.error(error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

main();
