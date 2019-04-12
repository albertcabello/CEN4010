let mysql = require('mysql');
let config = require('./config.js');

let connection = mysql.createConnection({
	host	: config.db.host,
	user	: config.db.user,
	port	: config.db.port,
	password: config.db.password
});

//Add the commands that you use to create your tables here in another key, always use CREATE TABLE IF NOT EXISTS
//This file shouldn't have to change except for this object as well as any for loops you need to create dummy data
let tables = {
	stopForeignKey : "SET FOREIGN_KEY_CHECKS = 0", 

	users : "CREATE TABLE IF NOT EXISTS `users` (" + 
		  "`id` int(11) NOT NULL AUTO_INCREMENT," +
		  "`username` varchar(255) DEFAULT NULL," + 
		  "`firstName` varchar(100) NOT NULL," + 
		  "`lastName` varchar(100) NOT NULL," +
		  "`email` varchar(100) NOT NULL," +
		  "`password` varchar(255) DEFAULT NULL," +
		  "`nickname` varchar(50) DEFAULT NULL," + 
		  "`defaultShipping` int(11)," + 
		  "PRIMARY KEY (`id`)," +
		  "CONSTRAINT `defaultShipping` FOREIGN KEY (`defaultShipping`) REFERENCES `addresses`(`id`) ON DELETE SET NULL," + 
		  "UNIQUE KEY `username` (`username`))",

	addresses: "CREATE TABLE IF NOT EXISTS `addresses` (" + 
		     "`id` int(11) NOT NULL AUTO_INCREMENT," +
		     "`fullName` varchar(200) DEFAULT NULL," + 
		     "`firstLine` varchar(200) NOT NULL," + 
		     "`secondLine` varchar(200)," + 
		     "`city` varchar(200) NOT NULL," + 
		     "`state` varchar(2) NOT NULL," + 
		     "`zip` varchar(5) NOT NULL," +
		     "`instr` varchar(1000)," +
		     "`code` varchar(20)," +
			 "PRIMARY KEY (`id`))",
	userWishlists:"CREATE TABLE IF NOT EXISTS `userWishlists` (" + 
			 "`userId` int(11) NOT NULL," +
			 "wishlistId int(11) NOT NULL,"+
			 "FOREIGN KEY (userId) REFERENCES `users`(`id`))", 

	userAddresses: "CREATE TABLE IF NOT EXISTS `userAddresses` (" +
			 "`userId` int(11) NOT NULL, addressId int(11) NOT NULL," +
			 "FOREIGN KEY (userId) REFERENCES `users`(`id`)," + 
			 "FOREIGN KEY (addressId) REFERENCES `addresses`(`id`))",
	wishlists:"CREATE TABLE IF NOT EXISTS `wishlists` (" +
		 	 "`wishlistId` int(11) NOT NULL,"+
		  	 "`ISBN` BIGINT NOT NULL," +
			 "PRIMARY KEY (wishlistId,ISBN),"+
			"FOREIGN KEY (ISBN) REFERENCES `Book`(`ISBN`))",			 
	
	cards: "CREATE TABLE IF NOT EXISTS `cards` (" + 
		 "`id` int(11) NOT NULL AUTO_INCREMENT, `userId` int(11) NOT NULL, cardNumber varchar(19) NOT NULL, expireMonth int(11) NOT NULL, expireYear int(11) NOT NULL," +
		 "PRIMARY KEY (id), FOREIGN KEY (`userId`) REFERENCES `users`(`id`))",
		 
	Book: "CREATE TABLE IF NOT EXISTS `Book` (`ISBN` BIGINT PRIMARY KEY , `authorID` INT(11), `title` VARCHAR(45), `genre` VARCHAR(45), `publisher` VARCHAR(45), `cover` VARCHAR(150), `price` DOUBLE, `avgRating` DOUBLE)",
	
	Author: "CREATE TABLE IF NOT EXISTS `Author` (`ID` INT(11) AUTO_INCREMENT PRIMARY KEY, `authorLast` VARCHAR(45), `authorFirst` VARCHAR(45), `bio` TEXT)", 
	 
	Description: "CREATE TABLE IF NOT EXISTS `Description` (`descriptionID` BIGINT PRIMARY KEY, `Description` TEXT)",

	review: "CREATE TABLE IF NOT EXISTS `Review` (" +
		 "`ReviewID` varchar(20) NOT NULL, UserFirstName varchar(20) NOT NULL, UserLastName varchar(20) NOT NULL,"+
		 "`StarCounter` int(1) NOT NULL, Comments varchar(1000))",
	

	continueForeignKey : "SET FOREIGN_KEY_CHECKS = 1",
}

let inserts = {
	Book: "INSERT IGNORE INTO Book (`ISBN`, `authorId`, `title`, `genre`, `publisher`, `cover`, `price`, `avgRating`) " + 
			"VALUES (9780553278224 , 2, 'The Martian Chronicles', 'Sci-fi', 'Bantam/Spectra', 'https://images.gr-assets.com/books/1374049948l/76778.jpg', 5.99, 4.13)," + 
			"(9780439554930 , 3, 'Harry Potter and the Sorcerer''s Stone', 'Fantasy', 'Scholastic Inc ', 'https://images.gr-assets.com/books/1474154022l/3.jpg', 8.99, 4.46)," + 
			"(9780439064866 , 3, 'Harry Potter and the Chamber of Secrets', 'Fantasy', 'Scholastic Inc ', 'https://images.gr-assets.com/books/1474169725l/15881.jpg', 8.99, 4.41)," +
			"(9780143130239, 1, 'As You Like It', 'Comedy', 'Penguin Publishing', 'https://prodimage.images-bn.com/pimages/9780143130239_p0_v1_s550x406.jpg', 9.99, 3.5)," +
			"(9780143128540, 1, 'Hamlet', 'Tragedy', 'Penguin Publishing', 'https://images.penguinrandomhouse.com/cover/9780143128540', 9.99, 4.6)," + 
			"(9780380729401, 2, 'Something Wicked This Way Comes', 'Horror','Bantam/Spectra', 'https://images.gr-assets.com/books/1409596011l/248596.jpg', 5.99, 3.6), " +
			"(9780307588371, 4, 'Gone Girl', 'Thriller','Broadway Books', 'https://images.gr-assets.com/books/1554086139l/19288043.jpg', 6.75, 4.06), " +
			"(9780142402511, 5, 'Looking for Alaska', 'Young Adult','Speak', 'https://images.gr-assets.com/books/1394798630l/99561.jpg', 7.99, 4.05), " +
			"(9780142424179, 5, 'The Fault in our Stars', 'Young Adult','Penguin Books', 'https://images-na.ssl-images-amazon.com/images/I/81a4kCNuH%2BL.jpg', 7.59, 4.24), " + 
			"(9781560974277, 6, 'Ghost World', 'Graphic Novel','Fantagraphics Books', 'https://images-na.ssl-images-amazon.com/images/I/511mjyfcYNL.jpg', 9.68, 4.00), " +
			"(9780394747231, 7, 'Maus I: A Survivor''s Tale - My Father Bleeds History', 'Graphic Novel','Pantheon', 'https://images-na.ssl-images-amazon.com/images/I/A1RUVrZnIhL.jpg', 12.81, 4.07), " +
			"(9780385741279, 8, 'We Were Liars', 'Young Adult','Delacorte Press', 'https://images.gr-assets.com/books/1402749479l/16143347.jpg', 8.69, 3.84), " +
			"(9781451696196, 9, 'The Perks of Being a Wallflower', 'Young Adult','MTV Books/Pocket Books ', 'https://images.gr-assets.com/books/1554185202l/22628.jpg', 7.35, 4.20), " +
			"(9780374311254, 11, 'Speak', 'Young Adult','Farrar, Straus and Giroux', 'https://images.gr-assets.com/books/1529044298l/39280444.jpg', 7.68, 4.01), " +
			"(9780439023481, 12, 'The Hunger Games', 'Young Adult','Scholastic Press', 'https://images.gr-assets.com/books/1447303603l/2767052.jpg', 7.99, 4.33), " +
			"(9780439023498, 12, 'Catching Fire', 'Young Adult','Scholastic Press', 'https://images.gr-assets.com/books/1358273780l/6148028.jpg', 7.99, 4.29), " +
			"(9780439023511, 12, 'Mockingjay', 'Young Adult','Scholastic Press', 'https://images.gr-assets.com/books/1358275419l/7260188.jpg', 7.99, 4.03), " +
			"(9781250012579, 10, 'Eleanor & Park', 'Young Adult','St. Martin''s Press', 'https://images.gr-assets.com/books/1341952742l/15745753.jpg', 9.99, 4.09), " +
			"(9788542803952, 10, 'Fangirl', 'Young Adult','St. Martin''s Press', 'https://images.gr-assets.com/books/1355886270l/16068905.jpg', 7.80, 4.00), " +
			"(9780141439600, 13, 'A Tale of Two Cities', 'Classic','Penguin Books', 'https://images.gr-assets.com/books/1344922523l/1953.jpg', 8.00, 3.83), " +
			"(9780141439747, 13, 'Oliver Twist', 'Classic','Penguin Books', 'https://images.gr-assets.com/books/1327868529l/18254.jpg', 8.00, 3.86), " +
			"(9780192833594, 13, 'Great Expectations', 'Classic','Oxford University Press', 'https://images.gr-assets.com/books/1327920219l/2623.jpg', 6.95, 3.76), " +
			"(9780142000670, 14, 'Of Mice and Men', 'Classic','Penguin Books', 'https://images.gr-assets.com/books/1511302904l/890.jpg', 8.99, 3.86), " +
			"(9780142000663, 14, 'Grapes of Wrath', 'Classic','Penguin Books', 'https://images.gr-assets.com/books/1511302892l/4395.jpg', 13.99, 3.87), " +
			"(9780143058144, 15, 'Crime and Punishment', 'Classic','Penguin Books', 'https://images.gr-assets.com/books/1327909635l/28348.jpg', 8.99, 4.20), " +
			"(9780374528379, 15, 'The Brothers Karamazov', 'Classic','Farrar, Straus and Giroux', 'https://images.gr-assets.com/books/1427728126l/4934.jpg', 9.99, 4.32), " +
			"(9780679723165, 16, 'Lolita', 'Classic','Penguin Books', 'https://images.gr-assets.com/books/1372767118l/18133.jpg', 11.99, 3.87), " +
			"(9780141185262, 16, 'Pale Fire', 'Classic','Vintage International', 'https://images.gr-assets.com/books/1388155863l/7805.jpg', 11.99, 4.19), " +
			"(9780743273565, 17, 'The Great Gatsby', 'Classic','Penguin Classics', 'https://images.gr-assets.com/books/1401238257l/396094.jpg', 8.79, 4.00), " +
			"(9780684801544, 17, 'Tender is the Night', 'Classic','Scribner', 'https://images.gr-assets.com/books/1438797669l/46164.jpg', 10.85, 3.82), " +
			"(9780142414934, 5,  'Paper Towns', 'Young Adult','Speak', 'https://images.gr-assets.com/books/1349013610l/6442769.jpg', 9.99, 3.84), " +
			"(9780670016907, 14, 'East of Eaden', 'Classic','Penguin Books', 'https://images.gr-assets.com/books/1549346032l/883438.jpg', 14.99, 4.35)",


	Author:"INSERT IGNORE INTO `Author` " + 
			"VALUES (3, 'Rowling', 'J.K', 'Joanne Rowling (born July 31, 1965), who goes by the pen name J.K. Rowling, is a British author and screenwriter best known for her seven-book Harry Potter children''s book series." +
											"J.K. Rowling was living in Edinburgh, Scotland, and struggling to get by as a single mom before her first book, Harry Potter and the Sorcerer''s Stone, was published. The children''s " +
											"fantasy novel became an international hit and Rowling became an international literary sensation in 1999 when the first three installments of Harry Potter took over the top three slots of The New York Times best-seller list after achieving similar success in her native United Kingdom.')," +
			"(1, 'Shakespeare', 'William', 'William Shakespeare (1564–1616) was a poet, playwright, and actor who is widely regarded as one of the most influential writers in the history of the English language. Often referred to as the Bard of Avon, Shakespeare’s vast body of work includes comedic, tragic, and historical plays; poems; and 154 sonnets. His dramatic works have been translated into every major language and are performed more often than those of any other playwright.' ), " +
			"(2, 'Bradbury', 'Ray', 'Ray Bradbury (1920–2012) was America’s foremost writer of science fiction and fantasy. Among his most popular adult books were Fahrenheit 451, The Martian Chronicles, The Illustrated Man, Dandelion Wine, and Death Is a Lonely Business. In addition, he wrote several books for children, including Switch on the Night. In recognition of his stature in the world of literature, Bradbury was awarded the National Book Foundation’s 2000 Medal for Distinguished Contribution to American Letters and the National Medal of Arts in 2004.')," + 
			"(4, 'Flynn', 'Gillian', 'Gillian Flynn is an American author and television critic for Entertainment Weekly. She has so far written three novels, Sharp Objects, for which she won the 2007 Ian Fleming Steel Dagger for the best thriller; Dark Places; and her best-selling third novel Gone Girl.')," + 
			"(5, 'Green', 'John', 'John Green''s first novel, Looking for Alaska, won the 2006 Michael L. Printz Award presented by the American Library Association. His second novel, An Abundance of Katherines, was a 2007 Michael L. Printz Award Honor Book and a finalist for the Los Angeles Times Book Prize. In January 2012, his most recent novel, The Fault in Our Stars, was met with wide critical acclaim, unprecedented in Green''s career. The praise included rave reviews in Time Magazine and The New York Times, on NPR, and from award-winning author Markus Zusak.')," +
			"(6, 'Clowes', 'Daniel', 'Daniel Clowes is the acclaimed cartoonist of the seminal comic book series EIGHTBALL, and the graphic novels GHOST WORLD, DAVID BORING, ICE HAVEN, WILSON, MR. WONDERFUL and THE DEATH-RAY as well as the subject of the monograph THE ART OF DANIEL CLOWES: MODERN CARTOONIST, published in conjunction with a major retrospective at the Oakland Museum of California. He is an Oscar-nominated screenwriter, the recipient of numerous awards including the PEN Award for literature, Eisner, Harvey and Ignatz, and a frequent cover artist for the New Yorker. He is married and lives in Oakland, CA.'), " +
			"(7, 'Spiegelman', 'Art', 'Art Spiegelman is an American cartoonist, editor, and comics advocate best known for his graphic novel Maus. His work as co-editor on the comics magazines Arcade and Raw has been influential, and from 1992 he spent a decade as contributing artist for The New Yorker.'), " +
			"(8, 'Lockhart', 'E.', 'E. Lockhart is the author of Genuine Fraud, We Were Liars, The Disreputable History of Frankie Landau-Banks, The Boyfriend List and several other novels.'), " +
			"(9, 'Chbosky', 'Stephen', 'Stephen Chbosky grew up in Pittsburgh, Pennsylvania, and graduated from the University of Southern California''s Filmic Writing Program. His first film, The Four Corners of Nowhere, premiered at the 1995 Sundance Film Festival and went on to win Best Narrative Feature honors at the Chicago Underground Film Festival.'), " +
			"(10, 'Rowell', 'Rainbow', 'Rainbow Rowell writes books. Sometimes she writes about adults (ATTACHMENTS and LANDLINE). Sometimes she writes about teenagers (ELEANOR & PARK and FANGIRL). But she always writes about people who talk a lot. And people who feel like they''re screwing up. And people who fall in love. She lives in Nebraska with her husband and two sons.'), " +
			"(11, 'Halse Anderson', 'Laurie', 'Laurie Halse Anderson is the New York Times-bestselling author who writes for kids of all ages. Known for tackling tough subjects with humor and sensitivity, her work has earned numerous ALA and state awards. Two of her books, Speak and Chains, were National Book Award finalists.'), " +
			"(12, 'Collins', 'Suzanne', 'Since 1991, Suzanne Collins has been busy writing for children''s television. She has worked on the staffs of several Nickelodeon shows, including the Emmy-nominated hit Clarissa Explains it All and The Mystery Files of Shelby Woo. The books she is most successful for in teenage eyes are The Hunger Games, Catching Fire and Mockingjay. These books have won several awards, including the GA Peach Award.'), " + 
			"(13, 'Dickens', 'Charles', 'Charles John Huffam Dickens was a writer and social critic who created some of the world''s best-known fictional characters and is regarded as the greatest novelist of the Victorian era. His works enjoyed unprecedented popularity during his lifetime, and by the twentieth century critics and scholars had recognised him as a literary genius. His novels and short stories enjoy lasting popularity.'), " +
			"(14, 'Steinbeck', 'John', 'John Steinbeck III was an American writer. He wrote the Pulitzer Prize-winning novel The Grapes of Wrath, published in 1939 and the novella Of Mice and Men, published in 1937. In all, he wrote twenty-five books, including sixteen novels, six non-fiction books and several collections of short stories.'), " +
			"(15, 'Dostoyevsky', 'Fyodor', 'Fyodor Mikhaylovich Dostoyevsky (Russian: Фёдор Михайлович Достоевский), sometimes transliterated Dostoevsky, was a Russian novelist, journalist, and short-story writer whose psychological penetration into the human psyche had a profound influence on the 20th century novel.'), " +
			"(17, 'Fitzgerald', 'F. Scott', 'Francis Scott Key Fitzgerald was an American writer of novels and short stories, whose works have been seen as evocative of the Jazz Age, a term he himself allegedly coined. He is regarded as one of the greatest twentieth century writers.'), " +
			"(16, 'Nabokov', 'Vladimir', 'Vladimir Vladimirovich Nabokov, also known by the pen name Vladimir Sirin, was a Russian-American novelist. Nabokov wrote his first nine novels in Russian, then rose to international prominence as a master English prose stylist. He also made significant contributions to lepidoptery, and had a big interest in chess problems.')",

	Description: "INSERT IGNORE INTO `Description`" + 
				   "VALUES (9780553278224, 'The strange and wonderful tale of man’s experiences on Mars, filled with intense images and astonishing visions. Now part of the Voyager Classics collection.')," + 
				  			"(9780439554930, 'Harry Potter''s life is miserable. His parents are dead and he''s stuck with his heartless relatives, who force him to live in a tiny closet under the stairs. But his fortune changes when he receives a letter that tells him the truth about himself: he''s a wizard. A mysterious visitor rescues him from his relatives and takes him to his new home, Hogwarts School of Witchcraft and Wizardry.')," + 
							"(9780439064866, 'The Dursleys were so mean and hideous that summer that all Harry Potter wanted was to get back to the Hogwarts School for Witchcraft and Wizardry. But just as he''s packing his bags, Harry receives a warning from a strange, impish creature named Dobby who says that if Harry Potter returns to Hogwarts, disaster will strike')," +
							"(9781451673319,'Guy Montag is a fireman who burns books in a futuristic American city. In Montag’s world, firemen start fires rather than putting them out. The people in this society do not read books, enjoy nature, spend time by themselves, think independently, or have meaningful conversations. Instead, they drive very fast, watch excessive amounts of television on wall-size sets, and listen to the radio on “Seashell Radio” sets attached to their ears.')," + 
							"(9780143130239, 'Duke Senior, banished and usurped by his brother, Duke Frederick, now lives in the Forest of Arden, with his noblemen. Senior’s daughter Rosalind has been allowed to remain at court with Frederick’s daughter Celia, but she suddenly incurs Frederick’s displeasure, and is banished. Celia decides to run away with her, and they leave for Arden with Rosalind disguised as a man, and accompanied by Touchstone, a clown. Rosalind changes her name to Ganymede, and Celia to Aliena.')," +
							"(9780143128540, 'Hamlet, Prince of Denmark, is home from school to mourn the death of his father, King Hamlet, who has died two months earlier. Hamlet is disgusted by the marriage of his newly widowed mother, Queen Gertrude, to his Uncle, King Hamlet’s brother, Claudius, who now has the throne.')," +
							"(9780380729401, 'A carnival rolls in sometime after the midnight hour on a chill Midwestern October eve, ushering in Halloween a week before its time. A calliope''s shrill siren song beckons to all with a seductive promise of dreams and youth regained. In this season of dying, Cooger & Dark''s Pandemonium Shadow Show has come to Green Town, Illinois, to destroy every life touched by its strange and sinister mystery. And two inquisitive boys standing precariously on the brink of adulthood will soon discover the secret of the satanic raree-show''s smoke, mazes, and mirrors, as they learn all too well the heavy cost of wishes - and the stuff of nightmare.') ," +
							"(9780307588371, 'Marriage can be a real killer. On a warm summer morning in North Carthage, Missouri, it is Nick and Amy Dunne''s fifth wedding anniversary. Presents are being wrapped and reservations are being made when Nick''s clever and beautiful wife disappears from their rented McMansion on the Mississippi River. Husband-of-the-Year Nick isn''t doing himself any favors with cringe-worthy daydreams about the slope and shape of his wife''s head, but passages from Amy''s diary reveal the alpha-girl perfectionist could have put anyone dangerously on edge. Under mounting pressure from the police and the media—as well as Amy''s fiercely doting parents—the town golden boy parades an endless series of lies, deceits, and inappropriate behavior. Nick is oddly evasive, and he''s definitely bitter—but is he really a killer?'), " +
							"(9780142402511,'Miles ''Pudge'' Halter is done with his safe life at home. His whole life has been one big non-event, and his obsession with famous last words has only made him crave ''the Great Perhaps'' even more (Francois Rabelais, poet). He heads off to the sometimes crazy and anything-but-boring world of Culver Creek Boarding School, and his life becomes the opposite of safe. Because down the hall is Alaska Young. The gorgeous, clever, funny, sexy, self-destructive, screwed up, and utterly fascinating Alaska Young. She is an event unto herself. She pulls Pudge into her world, launches him into the Great Perhaps, and steals his heart.'), " +
							"(9780142424179, 'Despite the tumor-shrinking medical miracle that has bought her a few years, Hazel has never been anything but terminal, her final chapter inscribed upon diagnosis. But when a gorgeous plot twist named Augustus Waters suddenly appears at Cancer Kid Support Group, Hazel''s story is about to be completely rewritten.')," +
							"(9781560974277, 'Inspiration for the feature film and one of the most acclaimed graphic novels ever, following the adventures of two teenage girls, Enid and Becky, best friends facing the prospect of growing up, and more importantly, apart.'), " +
							"(9780394747231, 'A brutally moving work of art—widely hailed as the greatest graphic novel ever written—Maus recounts the chilling experiences of the author''s father during the Holocaust, with Jews drawn as wide-eyed mice and Nazis as menacing cats.'), " +
							"(9780385741279, 'We Were Liars focuses on the theme of self-acceptance, family morals, and the possibly-deadly consequences of one''s mistakes. It is centered on the wealthy, seemingly perfect Sinclair family, who spend every summer gathered on their private island. However, not every summer is the same—when something happens to Cadence during the summer of her fifteenth year, the four ''Liars'' (Cadence, Johnny, Gat and Mirren) re-emerge two years later to prompt Cadence to remember the incident.'), " +
							"(9781451696196, 'The critically acclaimed debut novel from Stephen Chbosky, Perks follows observant ''wallflower'' Charlie as he charts a course through the strange world between adolescence and adulthood. First dates, family drama, and new friends. Sex, drugs, and The Rocky Horror Picture Show. Devastating loss, young love, and life on the fringes. Caught between trying to live his life and trying to run from it, Charlie must learn to navigate those wild and poignant roller-coaster days known as growing up.'), " + 
							"(9780374311254, 'From the first moment of her freshman year at Merryweather High, Melinda knows this is a big fat lie, part of the nonsense of high school. She is friendless, outcast, because she busted an end-of-summer party by calling the cops, so now nobody will talk to her, let alone listen to her. As time passes, she becomes increasingly isolated and practically stops talking altogether.'), " +
							"(9780439023481, 'In the ruins of a place once known as North America lies the nation of Panem, a shining Capitol surrounded by twelve outlying districts. The Capitol is harsh and cruel and keeps the districts in line by forcing them all to send one boy and one girl between the ages of twelve and eighteen to participate in the annual Hunger Games, a fight to the death on live TV. Sixteen-year-old Katniss Everdeen, who lives alone with her mother and younger sister, regards it as a death sentence when she is forced to represent her district in the Games. But Katniss has been close to dead before - and survival, for her, is second nature. Without really meaning to, she becomes a contender. But if she is to win, she will have to start making choices that weigh survival against humanity and life against love.'), " +
							"(9780439023498, 'Against all odds, Katniss has won the Hunger Games. She and fellow District 12 tribute Peeta Mellark are miraculously still alive. Katniss should be relieved, happy even. After all, she has returned to her family and her longtime friend, Gale. Yet nothing is the way Katniss wishes it to be. Gale holds her at an icy distance. Peeta has turned his back on her completely. And there are whispers of a rebellion against the Capitol - a rebellion that Katniss and Peeta may have helped create.'), " +
							"(9780439023511, 'Katniss Everdeen, girl on fire, has survived, even though her home has been destroyed. Gale has escaped. Katniss''s family is safe. Peeta has been captured by the Capitol. District 13 really does exist. There are rebels. There are new leaders. A revolution is unfolding.'), " + 
							"(9781250012579, 'Eleanor... Red hair, wrong clothes. Standing behind him until he turns his head. Lying beside him until he wakes up. Making everyone else seem drabber and flatter and never good enough. Park... He knows she''ll love a song before he plays it for her. He laughs at her jokes before she ever gets to the punch line. This is the story of two star-crossed sixteen-year-olds—smart enough to know that first love almost never lasts, but brave and desperate enough to try.'), " +
							"(9788542803952, 'Cath is a Simon Snow fan. Okay, the whole world is a Simon Snow fan. But for Cath, being a fan is her life—and she''s really good at it. She and her twin sister, Wren, ensconced themselves in the Simon Snow series when they were just kids; it’s what got them through their mother leaving. Cath''s sister has mostly grown away from fandom, but Cath can''t let go and doesn''t want to.'), " +
							"(9780141439600, 'After eighteen years as a political prisoner in the Bastille, the ageing Doctor Manette is finally released and reunited with his daughter in England. There the lives of two very different men, Charles Darnay, an exiled French aristocrat, and Sydney Carton, a disreputable but brilliant English lawyer, become enmeshed through their love for Lucie Manette. From the tranquil roads of London, they are drawn against their will to the vengeful, bloodstained streets of Paris at the height of the Reign of Terror, and they soon fall under the lethal shadow of La Guillotine.'), " +
							"(9780141439747, 'After running away from the workhouse and pompous beadle Mr Bumble, Oliver finds himself lured into a den of thieves peopled by vivid and memorable characters - the Artful Dodger, vicious burglar Bill Sikes, his dog Bull''s Eye, and prostitute Nancy, all watched over by cunning master-thief Fagin. Combining elements of Gothic Romance, the Newgate Novel and popular melodrama, Dickens created an entirely new kind of fiction, scathing in its indictment of a cruel society, and pervaded by an unforgettable sense of threat and mystery.'), " +
							"(9780142000670, 'The compelling story of two outsiders striving to find their place in an unforgiving world. Drifters in search of work, George and his simple-minded friend Lennie have nothing in the world except each other and a dream--a dream that one day they will have some land of their own.'), " +
							"(9780142000663, 'First published in 1939, Steinbeck’s Pulitzer Prize-winning epic of the Great Depression chronicles the Dust Bowl migration of the 1930s and tells the story of one Oklahoma farm family, the Joads—driven from their homestead and forced to travel west to the promised land of California.'), " +
							"(9780670016907, 'Set in the rich farmland of California''s Salinas Valley, this sprawling and often brutal novel follows the intertwined destinies of two families—the Trasks and the Hamiltons—whose generations helplessly reenact the fall of Adam and Eve and the poisonous rivalry of Cain and Abel.'), " +
							"(9780143058144, 'Crime and Punishment focuses on the mental anguish and moral dilemmas of Rodion Raskolnikov, an impoverished ex-student in Saint Petersburg who formulates a plan to kill an unscrupulous pawnbroker for her money. Before the killing, Raskolnikov believes that with the money he could liberate himself from poverty and go on to perform great deeds. However, once it is done he finds himself racked with confusion, paranoia, and disgust for what he has done. His moral justifications disintegrate completely as he struggles with guilt and horror and confronts the real-world consequences of his deed.'), " +
							"(9780374528379, 'The Brothers Karamasov is a murder mystery, a courtroom drama, and an exploration of erotic rivalry in a series of triangular love affairs involving the ''wicked and sentimental'' Fyodor Pavlovich Karamazov and his three sons―the impulsive and sensual Dmitri; the coldly rational Ivan; and the healthy, red-cheeked young novice Alyosha. Through the gripping events of their story, Dostoevsky portrays the whole of Russian life, is social and spiritual striving, in what was both the golden age and a tragic turning point in Russian culture.'), " +
							"(9780679723165, 'Awe and exhiliration--along with heartbreak and mordant wit--abound in Lolita, Nabokov''s most famous and controversial novel, which tells the story of the aging Humbert Humbert''s obsessive, devouring, and doomed passion for the nymphet Dolores Haze. A meditation on love--love as outrage and hallucination, madness and transformation. '), " +
							"(9780141185262, 'The American poet John Shade is dead. His last poem, Pale Fire, is put into a book, together with a preface, a lengthy commentary and notes by his editor, Charles Kinbote. Kinbote is haughty, inquisitive, intolerant, but is he also mad, bad - and even dangerous? As his wildly eccentric annotations slide into the personal and the fantastical, Kinbote reveals perhaps more than he should be.'), " +
							"(9780743273565, 'Young, handsome and fabulously rich, Jay Gatsby is the bright star of the Jazz Age, but as writer Nick Carraway is drawn into the decadent orbit of his Long Island mansion, where the party never seems to end, he finds himself faced by the mystery of Gatsby''s origins and desires. Beneath the shimmering surface of his life, Gatsby is hiding a secret: a silent longing that can never be fulfilled. And soon, this destructive obsession will force his world to unravel.'), " +
							"(9780684801544, 'Set on the French Riviera in the late 1920s, Tender Is the Night is the tragic romance of the young actress Rosemary Hoyt and the stylish American couple Dick and Nicole Diver. A brilliant young psychiatrist at the time of his marriage, Dick is both husband and doctor to Nicole, whose wealth goads him into a lifestyle not his own, and whose growing strength highlights Dick''s harrowing demise.'), " +
							"(9780142414934, 'Quentin Jacobsen has spent a lifetime loving the magnificently adventurous Margo Roth Spiegelman from afar. So when she cracks open a window and climbs into his life—dressed like a ninja and summoning him for an ingenious campaign of revenge—he follows. After their all-nighter ends, and a new day breaks, Q arrives at school to discover that Margo, always an enigma, has now become a mystery.'), " +
"(9780192833594, 'Humble, orphaned Pip is apprenticed to the dirty work of the forge but dares to dream of becoming a gentleman — and one day, under sudden and enigmatic circumstances, he finds himself in possession of ''great expectations.'' In this gripping tale of crime and guilt, revenge and reward, the compelling characters include Magwitch, the fearful and fearsome convict; Estella, whose beauty is excelled only by her haughtiness; and the embittered Miss Havisham, an eccentric jilted bride.')"
}

//Initializes your mysql connection
connection.connect(function(err) {
	if (err) throw err;
	console.log("Connected to mysql");
	console.log(inserts.Book);

});

connection.query("CREATE DATABASE IF NOT EXISTS " + config.db.database, function(err) { //Creates your database if it doesn't exist
	if (err) throw err;
	connection.changeUser({database: config.db.database}, function(err) {
		if (err) throw err;

		for (let table in tables) {//Performs the table creations
			connection.query(tables[table], function(err) {
				if(err) throw err;
				switch (table) {
					case 'Book': 
						connection.query(inserts.Book, function(err) {
							if (err) throw err;
						});
						break;
					case 'Author':
						connection.query(inserts.Author, function(err) {
							if (err) throw err;
						});
						break;
					case 'Description':
						connection.query(inserts.Description, function(err) {
							if (err) throw err;
						});
						break;
				}
			});
		}
	});
});

module.exports = {connection};
