/* ==========================================================================
   90s REWIND TV — THE TRIVIA QUESTIONS  (add a question: add one line)
   Used by the homepage trivia panel and by the Trivia Challenge on the community page.

     id       short unique id
     cat      tv | ads | cricket | wwf | movies | games     (the label on the question)
     q        the question (keep it to 65 characters or fewer so it fits the small homepage panel)
     options  exactly 4 answers, each 22 characters or fewer (they sit in small buttons)
     answer   the position of the right answer in options: 0, 1, 2 or 3
     why      one or two short sentences shown after answering (80 characters or fewer)

   Every fact here should be checkable. Do not add a question you are not sure about.
   tests/trivia-test.js checks the shape of every line.
   ========================================================================== */
var TRIVIA_CATS = { tv: 'TV', ads: 'Ads', cricket: 'Cricket', wwf: 'WWF', movies: 'Movies & Music', games: 'Toys & Games' };

var TRIVIA = [
  { id: 'shaktimaan', cat: 'tv', q: 'Who played Shaktimaan on Doordarshan?', options: ['Mukesh Khanna', 'Nitish Bharadwaj', 'Arun Govil', 'Dheeraj Kumar'], answer: 0,
    why: 'Mukesh Khanna. The show began on DD National in 1997.' },
  { id: 'ram', cat: 'tv', q: 'Who played Ram in Ramanand Sagar’s Ramayan?', options: ['Sunil Lahri', 'Arun Govil', 'Dara Singh', 'Mukesh Khanna'], answer: 1,
    why: 'Arun Govil. Ramayan aired on Doordarshan from 1987 to 1988.' },
  { id: 'mahabharat-channel', cat: 'tv', q: 'Which channel first aired B. R. Chopra’s Mahabharat?', options: ['Zee TV', 'Star Plus', 'Doordarshan', 'Sony TV'], answer: 2,
    why: 'Doordarshan (DD National), from 1988 to 1990.' },
  { id: 'krishna', cat: 'tv', q: 'Who played Krishna in B. R. Chopra’s Mahabharat?', options: ['Nitish Bharadwaj', 'Gufi Paintal', 'Mukesh Khanna', 'Puneet Issar'], answer: 0,
    why: 'Nitish Bharadwaj. Gufi Paintal played Shakuni and Puneet Issar played Duryodhan.' },
  { id: 'hum-log', cat: 'tv', q: 'Which DD serial of 1984 is called India’s first soap opera?', options: ['Buniyaad', 'Hum Log', 'Nukkad', 'Yeh Jo Hai Zindagi'], answer: 1,
    why: 'Hum Log, which ran on Doordarshan from 1984 to 1985.' },
  { id: 'malgudi', cat: 'tv', q: 'Malgudi Days was based on stories by which writer?', options: ['Premchand', 'Ruskin Bond', 'R. K. Narayan', 'Satyajit Ray'], answer: 2,
    why: 'R. K. Narayan. Shankar Nag directed the DD series in 1986.' },
  { id: 'byomkesh', cat: 'tv', q: 'Who played Byomkesh Bakshi in the 1993 DD series?', options: ['Rajit Kapur', 'Anil Kapoor', 'Pankaj Kapur', 'Kay Kay Menon'], answer: 0,
    why: 'Rajit Kapur, in the series that began on DD in 1993.' },
  { id: 'chandrakanta', cat: 'tv', q: 'Chandrakanta was based on a novel by whom?', options: ['Premchand', 'Bankim Chandra', 'Amrit Lal Nagar', 'Devaki Nandan Khatri'], answer: 3,
    why: 'Devaki Nandan Khatri. The DD serial began in 1994.' },
  { id: 'surabhi', cat: 'tv', q: 'Who co-hosted Surabhi with Renuka Shahane?', options: ['Tom Alter', 'Siddharth Kak', 'Javed Jaffrey', 'Vinod Dua'], answer: 1,
    why: 'Siddharth Kak. Doordarshan’s culture show ran from 1990.' },
  { id: 'kbc', cat: 'tv', q: 'Who hosted the first Kaun Banega Crorepati in 2000?', options: ['Shah Rukh Khan', 'Anupam Kher', 'Amitabh Bachchan', 'Prasoon Joshi'], answer: 2,
    why: 'Amitabh Bachchan, on Star Plus, from July 2000.' },
  { id: 'zee', cat: 'tv', q: 'Which was India’s first private Hindi satellite channel?', options: ['Sony TV', 'Zee TV', 'Star Plus', 'Sahara'], answer: 1,
    why: 'Zee TV, launched in October 1992.' },
  { id: 'antakshari', cat: 'tv', q: 'Who hosted Antakshari on Zee TV in the 1990s?', options: ['Annu Kapoor', 'Satish Shah', 'Shekhar Suman', 'Farooq Sheikh'], answer: 0,
    why: 'Annu Kapoor, whose show began in 1993.' },
  { id: 'boogie', cat: 'tv', q: 'Which channel aired the dance contest Boogie Woogie?', options: ['Zee TV', 'Sony TV', 'DD Metro', 'Star Plus'], answer: 1,
    why: 'Sony Entertainment Television, hosted by Javed and Naved Jaffrey.' },
  { id: 'sargam', cat: 'tv', q: 'Who hosted the early Sa Re Ga Ma on Zee TV?', options: ['Udit Narayan', 'Kumar Sanu', 'Sonu Nigam', 'Abhijeet'], answer: 2,
    why: 'Sonu Nigam hosted the music contest from its start in 1995.' },
  { id: 'mile-sur', cat: 'tv', q: 'What was “Mile Sur Mera Tumhara” made to promote?', options: ['Family planning', 'National integration', 'Cleanliness', 'Adult literacy'], answer: 1,
    why: 'National integration. It was first shown on Doordarshan on 15 August 1988.' },
  { id: 'chitrahaar', cat: 'tv', q: 'What was Chitrahaar on Doordarshan?', options: ['A cricket quiz', 'A cartoon hour', 'A show of film songs', 'A news bulletin'], answer: 2,
    why: 'A programme of Hindi film songs, a family favourite for years.' },
  { id: 'jungle-book', cat: 'tv', q: 'Who wrote the lyrics of “Jungle Jungle Baat Chali Hai”?', options: ['Javed Akhtar', 'Gulzar', 'Anand Bakshi', 'Prasoon Joshi'], answer: 1,
    why: 'Gulzar, with music by Vishal Bhardwaj, for The Jungle Book.' },

  { id: 'bajaj', cat: 'ads', q: 'Which company gave us the “Hamara Bajaj” ad?', options: ['Bajaj Auto', 'Hero Honda', 'LML', 'TVS'], answer: 0,
    why: 'Bajaj Auto, for its Chetak scooter: “Buland Bharat ki buland tasveer.”' },
  { id: 'pepsi', cat: 'ads', q: 'Whose ad line was “Yeh Dil Maange More”?', options: ['Coca-Cola', 'Thums Up', 'Pepsi', 'Campa Cola'], answer: 2,
    why: 'Pepsi. The line caught on across India in the late 1990s.' },
  { id: 'nirma', cat: 'ads', q: '“Doodh si safedi” was the promise of which detergent?', options: ['Nirma', 'Rin', 'Surf', 'Wheel'], answer: 0,
    why: 'Nirma. “Washing powder Nirma” was one of the most-sung jingles of the time.' },
  { id: 'lijjat', cat: 'ads', q: 'Which brand’s ad had a bunny singing “kurram kurram”?', options: ['Kurkure', 'Lijjat Papad', 'Parle-G', 'Maggi'], answer: 1,
    why: 'Lijjat Papad.' },
  { id: 'rasna', cat: 'ads', q: 'Which drink’s ad said “I love you Rasna”?', options: ['Roohafza', 'Frooti', 'Tang', 'Rasna'], answer: 3,
    why: 'Rasna, the powdered fruit drink, in an ad starring a little girl.' },
  { id: 'cadbury', cat: 'ads', q: 'Which chocolate’s ad said “Kuch khaas hai”?', options: ['Nestle Milkybar', 'Amul Chocolate', 'Cadbury Dairy Milk', 'Parle Melody'], answer: 2,
    why: 'Cadbury Dairy Milk, whose ads of the 1990s are still loved.' },
  { id: 'amul', cat: 'ads', q: 'Whose mascot is the polka-dotted “Amul girl”?', options: ['Britannia', 'Nestle', 'Amul', 'Mother Dairy'], answer: 2,
    why: 'Amul. The “utterly butterly delicious” girl first appeared in 1966.' },

  { id: 'kapil', cat: 'cricket', q: 'Who captained India to the 1983 World Cup win?', options: ['Sunil Gavaskar', 'Kapil Dev', 'Mohinder Amarnath', 'Ravi Shastri'], answer: 1,
    why: 'Kapil Dev, at Lord’s on 25 June 1983.' },
  { id: 'wc96', cat: 'cricket', q: 'Who won the 1996 World Cup, co-hosted by India?', options: ['India', 'Australia', 'Sri Lanka', 'Pakistan'], answer: 2,
    why: 'Sri Lanka, who beat Australia in the final in Lahore.' },
  { id: 'sharjah', cat: 'cricket', q: 'In which city was Sachin’s 1998 “Desert Storm” innings?', options: ['Dubai', 'Colombo', 'Sharjah', 'Toronto'], answer: 2,
    why: 'Sharjah, against Australia. He made 143 in the Coca-Cola Cup.' },
  { id: 'debut', cat: 'cricket', q: 'Against whom did Sachin make his debut in 1989?', options: ['Pakistan', 'Australia', 'West Indies', 'England'], answer: 0,
    why: 'Pakistan, in Karachi in November 1989.' },
  { id: 'azhar', cat: 'cricket', q: 'Who captained India at the 1996 World Cup?', options: ['Sourav Ganguly', 'Anil Kumble', 'Mohammad Azharuddin', 'Sachin Tendulkar'], answer: 2,
    why: 'Mohammad Azharuddin, who led India to the semi-final.' },

  { id: 'phenom', cat: 'wwf', q: 'Which WWF star was nicknamed “The Phenom”?', options: ['Stone Cold', 'The Undertaker', 'Shawn Michaels', 'Mankind'], answer: 1,
    why: 'The Undertaker, who debuted at Survivor Series 1990.' },
  { id: 'know-your-role', cat: 'wwf', q: 'Who told rivals to “know your role”?', options: ['Triple H', 'The Rock', 'Mankind', 'Kane'], answer: 1,
    why: 'The Rock, a star of the Attitude Era.' },

  { id: 'ddlj', cat: 'movies', q: 'Which film ran 20+ years at Mumbai’s Maratha Mandir?', options: ['Sholay', 'DDLJ', 'Karan Arjun', 'Border'], answer: 1,
    why: 'Dilwale Dulhania Le Jayenge, released in 1995.' },
  { id: 'hahk', cat: 'movies', q: 'Madhuri Dixit and Salman Khan starred in which 1994 hit?', options: ['Maine Pyar Kiya', 'Hum Saath-Saath Hain', 'Hum Aapke Hain Koun', 'Dil To Pagal Hai'], answer: 2,
    why: 'Hum Aapke Hain Koun..!, directed by Sooraj Barjatya.' },
  { id: 'miss-universe', cat: 'movies', q: 'Who was crowned Miss Universe in 1994?', options: ['Aishwarya Rai', 'Sushmita Sen', 'Lara Dutta', 'Diana Hayden'], answer: 1,
    why: 'Sushmita Sen. Aishwarya Rai won Miss World the same year.' },

  { id: 'gameboy', cat: 'games', q: 'Which game came with the Game Boy in the US in 1989?', options: ['Super Mario Land', 'Tetris', 'Pac-Man', 'Pokémon'], answer: 1,
    why: 'Tetris, which helped make the Game Boy a hit.' },
  { id: 'tamagotchi', cat: 'games', q: 'Which 1996 toy asked you to look after a digital pet?', options: ['Furby', 'Tamagotchi', 'Beyblade', 'Pokédex'], answer: 1,
    why: 'Tamagotchi, launched by Bandai in Japan in 1996.' },
  { id: 'rubik', cat: 'games', q: 'In which country was the Rubik’s Cube invented?', options: ['Japan', 'Hungary', 'Germany', 'USA'], answer: 1,
    why: 'Hungary. Ernő Rubik built the first cube in 1974.' },
  { id: 'sonic', cat: 'games', q: 'Sega’s mascot Sonic is which animal?', options: ['Fox', 'Hedgehog', 'Rabbit', 'Squirrel'], answer: 1,
    why: 'A hedgehog. Sonic the Hedgehog launched on the Mega Drive in 1991.' }
];

if (typeof window !== 'undefined') { window.TRIVIA = TRIVIA; window.TRIVIA_CATS = TRIVIA_CATS; }
if (typeof module !== 'undefined' && module.exports) module.exports = { TRIVIA: TRIVIA, TRIVIA_CATS: TRIVIA_CATS };
