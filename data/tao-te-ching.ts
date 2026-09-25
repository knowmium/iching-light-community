// Tao Te Ching verses mapped to I Ching hexagrams
// Using James Legge's 1891 public domain translation
// Each hexagram is paired with a thematically relevant chapter

export interface TaoVerse {
  chapter: number;
  text: string;
  reflection: string;
}

// Tao Te Ching chapters mapped to hexagram themes
const taoByHexagram: Record<number, TaoVerse> = {
  // 1. The Creative - Chapter 1: The Tao that can be told
  1: {
    chapter: 1,
    text: "The Tao that can be trodden is not the enduring and unchanging Tao. The name that can be named is not the enduring and unchanging name. Having no name, it is the Originator of heaven and earth; having a name, it is the Mother of all things.",
    reflection: "What in your situation cannot be fully expressed in words, yet feels deeply true?"
  },
  
  // 2. The Receptive - Chapter 8: The highest excellence is like water
  2: {
    chapter: 8,
    text: "The highest excellence is like that of water. The excellence of water appears in its benefiting all things, and in its occupying, without striving to the contrary, the low place which all men dislike.",
    reflection: "Where might yielding serve you better than pushing forward?"
  },
  
  // 3. Difficulty at Beginning - Chapter 64: A journey of a thousand li
  3: {
    chapter: 64,
    text: "A journey of a thousand li commences with a single step. He who acts with an ulterior purpose does harm; he who takes hold of a thing in the same way loses his hold.",
    reflection: "What single small step could you take today, without attachment to the outcome?"
  },
  
  // 4. Youthful Folly - Chapter 71: To know and yet think we do not know
  4: {
    chapter: 71,
    text: "To know and yet think we do not know is the highest attainment; not to know and yet think we do know is a disease. It is simply by being pained at the thought of having this disease that we are preserved from it.",
    reflection: "What assumptions might you be holding that deserve questioning?"
  },
  
  // 5. Waiting - Chapter 15: The skillful masters of old
  5: {
    chapter: 15,
    text: "The skillful masters of the Tao in old times, with a subtle and exquisite penetration, comprehended its mysteries. They were cautious like those who wade through a stream in winter; irresolute like those who are afraid of all around them.",
    reflection: "What wisdom might emerge if you simply waited a little longer?"
  },
  
  // 6. Conflict - Chapter 81: Sincere words are not fine
  6: {
    chapter: 81,
    text: "Sincere words are not fine; fine words are not sincere. Those who are skilled in the Tao do not dispute about it; the disputatious are not skilled in it.",
    reflection: "Is this conflict about being right, or about something deeper?"
  },
  
  // 7. The Army - Chapter 31: Arms are instruments of evil omen
  7: {
    chapter: 31,
    text: "Arms, however beautiful, are instruments of evil omen, hateful to all creatures. Therefore they who have the Tao do not like to employ them. The superior man ordinarily considers the left hand the most honourable place, but in time of war the right hand.",
    reflection: "What discipline serves your highest purpose, and what merely feeds conflict?"
  },
  
  // 8. Holding Together - Chapter 17: In the highest antiquity
  8: {
    chapter: 17,
    text: "In the highest antiquity, the people did not know that there were rulers. In the next age they loved them and praised them. In the next they feared them; in the next they despised them.",
    reflection: "How can you lead by supporting rather than controlling?"
  },
  
  // 9. Small Taming - Chapter 22: The partial becomes complete
  9: {
    chapter: 22,
    text: "The partial becomes complete; the crooked, straight; the empty, full; the worn out, new. He whose desires are few gets them; he whose desires are many goes astray.",
    reflection: "What small adjustment might create significant change?"
  },
  
  // 10. Treading - Chapter 46: When the Tao prevails
  10: {
    chapter: 46,
    text: "When the Tao prevails in the world, they send back their swift horses to draw the dung-carts. When the Tao is disregarded in the world, the war-horses breed in the border lands. There is no guilt greater than to sanction ambition.",
    reflection: "Are you walking your own path, or one that was handed to you?"
  },
  
  // 11. Peace - Chapter 55: He who has in himself abundantly the attributes
  11: {
    chapter: 55,
    text: "He who has in himself abundantly the attributes of the Tao is like an infant. Poisonous insects will not sting him; fierce beasts will not seize him; birds of prey will not strike him.",
    reflection: "What would it feel like to rest in complete trust right now?"
  },
  
  // 12. Standstill - Chapter 16: The state of vacancy
  12: {
    chapter: 16,
    text: "The state of vacancy should be brought to the utmost degree, and that of stillness guarded with unwearying vigour. All things alike go through their processes of activity, and then we see them return to their original state.",
    reflection: "What needs to complete its cycle before new growth can begin?"
  },
  
  // 13. Fellowship - Chapter 49: The sage has no invariable mind
  13: {
    chapter: 49,
    text: "The sage has no invariable mind of his own; he makes the mind of the people his mind. To those who are good to me, I am good; and to those who are not good to me, I am also good; and thus all get to be good.",
    reflection: "How might you extend goodwill even to those who challenge you?"
  },
  
  // 14. Great Possession - Chapter 33: He who knows other men is discerning
  14: {
    chapter: 33,
    text: "He who knows other men is discerning; he who knows himself is intelligent. He who overcomes others is strong; he who overcomes himself is mighty. He who is satisfied with his lot is rich.",
    reflection: "What abundance do you already possess that you may have overlooked?"
  },
  
  // 15. Modesty - Chapter 9: It is better to leave a vessel unfilled
  15: {
    chapter: 9,
    text: "It is better to leave a vessel unfilled, than to attempt to carry it when it is full. If you keep feeling a point that has been sharpened, the point cannot long preserve its sharpness.",
    reflection: "Where might holding back actually serve you better than pushing forward?"
  },
  
  // 16. Enthusiasm - Chapter 35: To him who holds the Great Image
  16: {
    chapter: 35,
    text: "To him who holds in his hands the Great Image of the invisible Tao, the whole world repairs. Men resort to him, and receive no hurt, but find rest, peace, and the feeling of ease.",
    reflection: "What genuinely inspires you, and how can you share that with others?"
  },
  
  // 17. Following - Chapter 23: Abstaining from speech marks him who is obeying
  17: {
    chapter: 23,
    text: "Abstaining from speech marks him who is obeying the spontaneity of his nature. A violent wind does not last for a whole morning; a sudden rain does not last for the whole day.",
    reflection: "What would it mean to follow the natural flow of this situation?"
  },
  
  // 18. Work on the Decayed - Chapter 18: When the Great Tao ceased to be observed
  18: {
    chapter: 18,
    text: "When the Great Tao ceased to be observed, benevolence and righteousness came into vogue. Then appeared wisdom and shrewdness, and there ensued great hypocrisy.",
    reflection: "What old pattern needs to be examined and perhaps released?"
  },
  
  // 19. Approach - Chapter 62: Tao has of all things the most honoured place
  19: {
    chapter: 62,
    text: "Tao has of all things the most honoured place. It is the good man's treasure, and the guardian of the bad man. Its admirable words can purchase honour; its admirable deeds can raise their performer above others.",
    reflection: "How are you approaching this situation—with openness or with agenda?"
  },
  
  // 20. Contemplation - Chapter 47: Without going outside his door
  20: {
    chapter: 47,
    text: "Without going outside his door, one understands all that takes place under the sky; without looking out from his window, one sees the Tao of Heaven. The farther that one goes out from himself, the less he knows.",
    reflection: "What might you discover by looking more deeply inward?"
  },
  
  // 21. Biting Through - Chapter 30: He who would assist a lord of men
  21: {
    chapter: 30,
    text: "He who would assist a lord of men in harmony with the Tao will not assert his mastery in the kingdom by force of arms. Such a course is sure to meet with its proper return.",
    reflection: "What decisive action is needed, and how can you take it without force?"
  },
  
  // 22. Grace - Chapter 12: Colour's five hues from the eyes their sight will take
  22: {
    chapter: 12,
    text: "Colour's five hues from the eyes their sight will take; Music's five notes the ears as deaf can make; The flavours five deprive the mouth of taste. The chariot course, and the wild hunting waste make mad the mind.",
    reflection: "What simple beauty have you been overlooking in pursuit of the elaborate?"
  },
  
  // 23. Splitting Apart - Chapter 76: Man at his birth is supple and weak
  23: {
    chapter: 76,
    text: "Man at his birth is supple and weak; at his death, firm and strong. So it is with all things. Trees and plants, in their early growth, are soft and brittle; at their death, dry and withered.",
    reflection: "What needs to fall away so that something new can emerge?"
  },
  
  // 24. Return - Chapter 40: The movement of the Tao by contraries proceeds
  24: {
    chapter: 40,
    text: "The movement of the Tao by contraries proceeds; and weakness marks the course of Tao's mighty deeds. All things under heaven sprang from It as existing and named; that existence sprang from It as non-existent and not named.",
    reflection: "What is returning to you now that you thought was lost?"
  },
  
  // 25. Innocence - Chapter 28: Who knows his manhood's strength
  25: {
    chapter: 28,
    text: "Who knows his manhood's strength, yet still his female feebleness maintains; as to one channel flow the many drains, all come to him. And he the simple child again.",
    reflection: "What would it mean to approach this situation with beginner's mind?"
  },
  
  // 26. Great Taming - Chapter 26: Gravity is the root of lightness
  26: {
    chapter: 26,
    text: "Gravity is the root of lightness; stillness, the ruler of movement. Therefore a wise prince, marching the whole day, does not go far from his baggage waggons.",
    reflection: "What inner resources are you drawing upon for strength?"
  },
  
  // 27. Nourishment - Chapter 13: Favour and disgrace would seem equally to be feared
  27: {
    chapter: 13,
    text: "Favour and disgrace would seem equally to be feared; honour and great calamity, to be regarded as personal conditions of the same kind. What is meant by speaking thus of favour and disgrace? Disgrace is being in a low position after the enjoyment of favour.",
    reflection: "What truly nourishes you, beyond external validation?"
  },
  
  // 28. Great Exceeding - Chapter 36: When one is about to take an inspiration
  28: {
    chapter: 36,
    text: "When one is about to take an inspiration, he is sure to make a previous expiration; when he is going to weaken another, he will first strengthen him; when he is going to overthrow another, he will first have raised him up.",
    reflection: "What extraordinary measure does this extraordinary time require?"
  },
  
  // 29. The Abysmal - Chapter 78: There is nothing in the world more soft and weak than water
  29: {
    chapter: 78,
    text: "There is nothing in the world more soft and weak than water, and yet for attacking things that are firm and strong there is nothing that can take precedence of it—for there is nothing so effectual for which it can be changed.",
    reflection: "How might you move through this difficulty like water through rock?"
  },
  
  // 30. The Clinging - Chapter 52: The Tao which originated all under the sky
  30: {
    chapter: 52,
    text: "The Tao which originated all under the sky is to be considered as the mother of them all. When the mother is found, we know what her children should be. When one knows that he is his mother's child, and proceeds to guard the qualities of the mother that belong to him, to the end of his life he will be free from all peril.",
    reflection: "What source of light are you clinging to, and is it serving you?"
  },
  
  // 31. Influence - Chapter 61: What makes a great state is its being like a low-lying, down-flowing stream
  31: {
    chapter: 61,
    text: "What makes a great state is its being like a low-lying, down-flowing stream; it becomes the centre to which tend all the small states under heaven. The female always overcomes the male by her stillness.",
    reflection: "How might receptivity create more influence than assertion?"
  },
  
  // 32. Duration - Chapter 32: The Tao, considered as unchanging, has no name
  32: {
    chapter: 32,
    text: "The Tao, considered as unchanging, has no name. Though in its primordial simplicity it may be small, the whole world dares not deal with one embodying it as a minister. If a feudal prince or the king could guard and hold it, all would spontaneously submit themselves to him.",
    reflection: "What endures in your life, and what is merely passing through?"
  },
  
  // 33. Retreat - Chapter 44: Or fame or life, which do you hold more dear?
  33: {
    chapter: 44,
    text: "Or fame or life, which do you hold more dear? Or life or wealth, to which would you adhere? Keep life and lose those other things; keep them and lose your life—which brings sorrow and pain more near?",
    reflection: "What strategic withdrawal might actually be an advance in disguise?"
  },
  
  // 34. Great Power - Chapter 34: All-pervading is the Great Tao!
  34: {
    chapter: 34,
    text: "All-pervading is the Great Tao! It may be found on the left hand and on the right. All things depend on it for their production, which it gives to them, not one refusing obedience to it.",
    reflection: "How can you wield your power in service of something greater than yourself?"
  },
  
  // 35. Progress - Chapter 41: Scholars of the highest class
  35: {
    chapter: 41,
    text: "Scholars of the highest class, when they hear about the Tao, earnestly carry it into practice. Scholars of the middle class, when they have heard about it, seem now to keep it and now to lose it. Scholars of the lowest class, when they have heard about it, laugh greatly at it.",
    reflection: "What progress are you making that others might not yet see?"
  },
  
  // 36. Darkening of the Light - Chapter 27: The skilful traveller leaves no traces
  36: {
    chapter: 27,
    text: "The skilful traveller leaves no traces of his wheels or footsteps; the skilful speaker says nothing that can be found fault with or blamed; the skilful reckoner uses no tallies.",
    reflection: "How can you protect your inner light while navigating darkness?"
  },
  
  // 37. The Family - Chapter 54: What Tao's skilful planter plants can never be uptorn
  37: {
    chapter: 54,
    text: "What Tao's skilful planter plants can never be uptorn; what his skilful arms enfold, from him can ne'er be borne. Sons shall bring in lengthening line, sacrifices to his shrine.",
    reflection: "What are you cultivating in your closest relationships?"
  },
  
  // 38. Opposition - Chapter 2: All in the world know the beauty of the beautiful
  38: {
    chapter: 2,
    text: "All in the world know the beauty of the beautiful, and in doing this they have the idea of what ugliness is; they all know the skill of the skilful, and in doing this they have the idea of what the want of skill is.",
    reflection: "How might these apparent opposites actually complement each other?"
  },
  
  // 39. Obstruction - Chapter 63: It is the way of the Tao to act without thinking of acting
  39: {
    chapter: 63,
    text: "It is the way of the Tao to act without thinking of acting; to conduct affairs without feeling the trouble of them; to taste without discerning any flavour. Consider what is small as large, and a few as many; and recompense injury with kindness.",
    reflection: "What small step might help you navigate around this obstacle?"
  },
  
  // 40. Deliverance - Chapter 48: He who devotes himself to learning
  40: {
    chapter: 48,
    text: "He who devotes himself to learning seeks from day to day to increase his knowledge; he who devotes himself to the Tao seeks from day to day to diminish his doing. He diminishes it and again diminishes it, till he arrives at doing nothing.",
    reflection: "What are you being released from, and what space does that create?"
  },
  
  // 41. Decrease - Chapter 77: May not the Way of Heaven be compared to the method of bending a bow?
  41: {
    chapter: 77,
    text: "May not the Way of Heaven be compared to the method of bending a bow? The part of the bow which was high is brought low, and what was low is raised up. So Heaven diminishes where there is superabundance, and supplements where there is deficiency.",
    reflection: "What can you let go of to create better balance?"
  },
  
  // 42. Increase - Chapter 42: The Tao produced One; One produced Two
  42: {
    chapter: 42,
    text: "The Tao produced One; One produced Two; Two produced Three; Three produced All things. All things leave behind them the Obscurity out of which they have come, and go forward to embrace the Brightness into which they emerge.",
    reflection: "What is growing in your life, and how can you nurture it?"
  },
  
  // 43. Breakthrough - Chapter 43: The softest thing in the world
  43: {
    chapter: 43,
    text: "The softest thing in the world dashes against and overcomes the hardest; that which has no substantial existence enters where there is no crevice. I know hereby what advantage belongs to doing nothing with a purpose.",
    reflection: "What truth is breaking through that you've been avoiding?"
  },
  
  // 44. Coming to Meet - Chapter 5: Heaven and earth do not act from any wish to be benevolent
  44: {
    chapter: 5,
    text: "Heaven and earth do not act from any wish to be benevolent; they deal with all things as the dogs of grass are dealt with. The sages do not act from any wish to be benevolent; they deal with the people as the dogs of grass are dealt with.",
    reflection: "What is coming to meet you, and how will you receive it?"
  },
  
  // 45. Gathering Together - Chapter 39: The things which from of old have got the One
  45: {
    chapter: 39,
    text: "The things which from of old have got the One are—Heaven which by it is bright and pure; Earth rendered thereby firm and sure; Spirits with powers by it supplied; Valleys kept full throughout their void.",
    reflection: "What brings you together with others in shared purpose?"
  },
  
  // 46. Pushing Upward - Chapter 64: That which is at rest is easily kept hold of
  46: {
    chapter: 64,
    text: "That which is at rest is easily kept hold of; before a thing has given indications of its presence, it is easy to take measures against it. That which is brittle is easily broken; that which is very small is easily dispersed.",
    reflection: "What steady effort will carry you upward toward your goal?"
  },
  
  // 47. Oppression - Chapter 20: When we renounce learning we have no troubles
  47: {
    chapter: 20,
    text: "When we renounce learning we have no troubles. The multitude of men look satisfied and pleased; as if enjoying a full banquet, as if mounted on a tower in spring. I alone seem listless and still, my desires having as yet given no indication of their presence.",
    reflection: "What inner resource can sustain you through this difficult time?"
  },
  
  // 48. The Well - Chapter 4: The Tao is like the emptiness of a vessel
  48: {
    chapter: 4,
    text: "The Tao is like the emptiness of a vessel; and in our employment of it we must be on our guard against all fulness. How deep and unfathomable it is, as if it were the Honoured Ancestor of all things!",
    reflection: "What deep source are you drawing from, and is it being replenished?"
  },
  
  // 49. Revolution - Chapter 29: If any one should wish to get the kingdom for himself
  49: {
    chapter: 29,
    text: "If any one should wish to get the kingdom for himself, and to effect this by what he does, I see that he will not succeed. The kingdom is a spirit-like thing, and cannot be got by active doing. He who would so win it destroys it.",
    reflection: "What fundamental change is this situation calling for?"
  },
  
  // 50. The Cauldron - Chapter 10: When the intelligent and animal souls are held together in one embrace
  50: {
    chapter: 10,
    text: "When the intelligent and animal souls are held together in one embrace, they can be kept from separating. When one gives undivided attention to the vital breath, and brings it to the utmost degree of pliancy, he can become as a tender babe.",
    reflection: "What transformation is being prepared in the vessel of your life?"
  },
  
  // 51. The Arousing - Chapter 25: There was something undefined and complete
  51: {
    chapter: 25,
    text: "There was something undefined and complete, coming into existence before Heaven and Earth. How still it was and formless, standing alone, and undergoing no change, reaching everywhere and in no danger of being exhausted!",
    reflection: "What has shaken you awake, and what is it asking you to see?"
  },
  
  // 52. Keeping Still - Chapter 37: The Tao in its regular course does nothing
  52: {
    chapter: 37,
    text: "The Tao in its regular course does nothing for the sake of doing it, and so there is nothing which it does not do. If princes and kings were able to maintain it, all things would of themselves be transformed by them.",
    reflection: "What wisdom might emerge from simply being still?"
  },
  
  // 53. Development - Chapter 59: For regulating the human in our constitution and rendering the proper service to the heavenly
  53: {
    chapter: 59,
    text: "For regulating the human in our constitution and rendering the proper service to the heavenly, there is nothing like moderation. It is only by this moderation that there is effected an early return to man's normal state.",
    reflection: "What gradual development is unfolding that requires your patience?"
  },
  
  // 54. The Marrying Maiden - Chapter 6: The valley spirit dies not, aye the same
  54: {
    chapter: 6,
    text: "The valley spirit dies not, aye the same; the female mystery thus do we name. Its gate, from which at first they issued forth, is called the root from which grew heaven and earth.",
    reflection: "What relationship dynamic is asking for your attention?"
  },
  
  // 55. Abundance - Chapter 45: Who thinks his great achievements poor
  55: {
    chapter: 45,
    text: "Who thinks his great achievements poor shall find his vigour long endure. Of greatest fulness, deemed a void, exhaustion ne'er shall stem the tide. Do thou what's straight still crooked deem; thy greatest art still stupid seem.",
    reflection: "How can you remain humble in the midst of abundance?"
  },
  
  // 56. The Wanderer - Chapter 80: In a little state with a small population
  56: {
    chapter: 80,
    text: "In a little state with a small population, I would so order it, that, though there were individuals with the abilities of ten or a hundred men, there should be no employment of them. I would make the people, while looking on death as a grievous thing, yet not remove elsewhere to avoid it.",
    reflection: "What are you seeking in your wandering, and might it be found closer to home?"
  },
  
  // 57. The Gentle - Chapter 57: A state may be ruled by measures of correction
  57: {
    chapter: 57,
    text: "A state may be ruled by measures of correction; weapons of war may be used with crafty dexterity; but the kingdom is made one's own only by freedom from action and purpose. Therefore a sage has said, 'I will do nothing of purpose, and the people will be transformed of themselves.'",
    reflection: "What gentle influence might accomplish more than forceful action?"
  },
  
  // 58. The Joyous - Chapter 58: The government that seems the most unwise
  58: {
    chapter: 58,
    text: "The government that seems the most unwise, oft goodness to the people best supplies; that which is meddling, touching everything, will work but ill, and disappointment bring. Misery! happiness is to be found by its side! Happiness! misery lurks beneath it!",
    reflection: "What joy is available to you right now, in this very moment?"
  },
  
  // 59. Dispersion - Chapter 56: He who knows the Tao does not care to speak about it
  59: {
    chapter: 56,
    text: "He who knows the Tao does not care to speak about it; he who is ever ready to speak about it does not know it. He who knows it will keep his mouth shut and close the portals of his nostrils.",
    reflection: "What needs to dissolve or disperse for clarity to emerge?"
  },
  
  // 60. Limitation - Chapter 60: Governing a great state is like cooking small fish
  60: {
    chapter: 60,
    text: "Governing a great state is like cooking small fish. Let the kingdom be governed according to the Tao, and the manes of the departed will not manifest their spiritual energy.",
    reflection: "What healthy limitations might actually create more freedom?"
  },
  
  // 61. Inner Truth - Chapter 21: The grandest forms of active force from Tao come
  61: {
    chapter: 21,
    text: "The grandest forms of active force from Tao come, their only source. Who can of Tao the nature tell? Our sight it flies, our touch as well. Eluding sight, eluding touch, the forms of things all in it crouch.",
    reflection: "What inner truth is asking to be acknowledged?"
  },
  
  // 62. Small Exceeding - Chapter 63: It is the way of the Tao to act without thinking of acting
  62: {
    chapter: 63,
    text: "It is the way of the Tao to act without thinking of acting; to conduct affairs without feeling the trouble of them. Consider what is small as large, and a few as many; and recompense injury with kindness.",
    reflection: "What small detail deserves more attention than you've been giving it?"
  },
  
  // 63. After Completion - Chapter 73: He whose boldness appears in his daring to do wrong
  63: {
    chapter: 73,
    text: "He whose boldness appears in his daring to do wrong, in death shall lose his life; he whose boldness appears in his not daring to do so, in life shall preserve it. Of these two cases the one appears to be advantageous, and the other to be injurious.",
    reflection: "What has been completed, and what vigilance does this new phase require?"
  },
  
  // 64. Before Completion - Chapter 14: We look at it, and we do not see it
  64: {
    chapter: 14,
    text: "We look at it, and we do not see it, and we name it 'the Equable.' We listen to it, and we do not hear it, and we name it 'the Inaudible.' We try to grasp it, and do not get hold of it, and we name it 'the Subtle.'",
    reflection: "What is on the verge of completion, and what final step remains?"
  }
};

// Get a Tao Te Ching verse for a specific hexagram
export function getTaoVerse(hexagramNumber: number): TaoVerse {
  return taoByHexagram[hexagramNumber] || taoByHexagram[1];
}

// Get all verses for browsing
export function getAllTaoVerses(): Record<number, TaoVerse> {
  return taoByHexagram;
}
