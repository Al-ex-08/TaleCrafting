import OpenAI from 'openai';

// Configuration OpenAI
const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true // Nécessaire pour React Native
});

// Fonction pour générer une histoire avec OpenAI
export const generateStory = async ({
  character,
  age,
  location,
  specialElements,
  theme,
  narrativeStyle,
  length,
  isKidsMode,
  model = 'gpt-3.5-turbo', // Modèle par défaut
  secondaryCharacters = [],
  continueStory = null
}) => {
  try {
    // Définir la longueur en mots selon le paramètre
    const lengthInstructions = {
      short: '200-350 mots (3-4 paragraphes complets avec structure narrative complète : introduction, développement, climax, conclusion)',
      medium: '400-600 mots (5-7 paragraphes complets avec développement approfondi et structure narrative riche)',
      long: '700-1000 mots (8-12 paragraphes complets avec intrigue complexe et développement détaillé de tous les éléments narratifs)'
    };

    // Formater les personnages secondaires
    const formatSecondaryCharacters = () => {
      if (!secondaryCharacters || secondaryCharacters.length === 0) {
        return '';
      }
      const charactersList = secondaryCharacters.map(char => {
        let charInfo = `  • ${char.name} (${char.role})`;
        if (char.description && char.description.trim()) {
          charInfo += ` - ${char.description.trim()}`;
        }
        return charInfo;
      }).join('\n');
      return `\n- Personnages secondaires :\n${charactersList}`;
    };

    // Construire le prompt selon le mode
    let systemPrompt = '';
    let userPrompt = '';

    if (isKidsMode) {
      systemPrompt = `Tu es un conteur d'histoires pour enfants. ${continueStory ? 'Tu continues ou crées un nouvel épisode d\'histoires existantes.' : 'Crée des histoires COMPLÈTES avec un début, un milieu et une fin satisfaisante.'} Utilise un langage simple, des valeurs positives et une fin heureuse. Évite tout contenu effrayant ou inapproprié. ${secondaryCharacters.length > 0 ? 'IMPORTANT: Tu DOIS absolument intégrer TOUS les personnages secondaires mentionnés dans l\'histoire de manière naturelle et significative selon leurs rôles définis.' : ''}`;
      
      if (continueStory) {
        userPrompt = `${continueStory.isNewEpisode ? 'Crée un NOUVEL ÉPISODE' : 'Continue cette histoire'} pour enfants :

Histoire précédente :
"${continueStory.content}"

${continueStory.isNewEpisode ? 
          `Crée un nouvel épisode avec :
- Le même personnage principal : ${character}${location ? `
- Lieu : ${location}` : ''}${specialElements ? `
- Éléments spéciaux : ${specialElements}` : ''}
- Une nouvelle aventure dans le thème : ${theme}
- Style : ${narrativeStyle}
- Longueur : ${lengthInstructions[length]}${formatSecondaryCharacters()}

IMPORTANT : Crée une NOUVELLE aventure complète avec le même personnage, mais une intrigue différente.${secondaryCharacters.length > 0 ? ' OBLIGATOIRE: Tous les personnages secondaires listés ci-dessus DOIVENT apparaître et jouer un rôle actif dans cette nouvelle aventure.' : ''}` :
          `Continue directement cette histoire avec :
- Personnage : ${character}${location ? `
- Lieu : ${location}` : ''}${specialElements ? `
- Éléments spéciaux : ${specialElements}` : ''}
- Thème : ${theme}
- Style : ${narrativeStyle}
- Longueur : ${lengthInstructions[length]}${formatSecondaryCharacters()}

IMPORTANT : Continue naturellement là où l'histoire s'est arrêtée et mène-la vers une conclusion satisfaisante.${secondaryCharacters.length > 0 ? ' OBLIGATOIRE: Tous les personnages secondaires listés ci-dessus DOIVENT apparaître dans la suite de l\'histoire.' : ''}` }`;
      } else {
        userPrompt = `Écris une histoire COMPLÈTE pour enfants avec ces éléments :
- Personnage principal : ${character}
- Âge de l'enfant : ${age} ans${location ? `
- Lieu : ${location}` : ''}${specialElements ? `
- Éléments spéciaux : ${specialElements}` : ''}
- Thème : ${theme}
- Style : ${narrativeStyle}
- Longueur : ${lengthInstructions[length]}${formatSecondaryCharacters()}

IMPORTANT : L'histoire doit être COMPLÈTE et BIEN STRUCTURÉE avec :
1. Une introduction qui présente clairement le personnage et établit le contexte
2. Un développement progressif avec des aventures, défis et péripéties
3. Un climax adapté à l'âge avec tension et résolution
4. Une conclusion satisfaisante qui résout tous les éléments de l'intrigue
5. Une structure narrative cohérente du début à la fin, peu importe la longueur
6. Adaptée à un enfant de ${age} ans avec un vocabulaire approprié${secondaryCharacters.length > 0 ? '\n7. OBLIGATOIRE: Chaque personnage secondaire mentionné ci-dessus DOIT apparaître dans l\'histoire et jouer un rôle actif selon sa fonction définie. Ne les ignore pas.' : ''}

REQUIS ABSOLUS : L'histoire doit avoir un début, un milieu et une fin clairement définis, même pour les histoires courtes. Aucune histoire incomplète ou qui se termine abruptement n'est acceptable.`;
      }
    } else {
      systemPrompt = `Tu es un écrivain talentueux capable de créer des histoires COMPLÈTES et captivantes dans différents styles littéraires. ${continueStory ? 'Tu continues ou crées de nouveaux épisodes d\'histoires existantes.' : 'Adapte ton écriture au style demandé et crée une histoire engageante avec une structure narrative complète.'} ${secondaryCharacters.length > 0 ? 'IMPORTANT: Tu DOIS absolument intégrer TOUS les personnages secondaires mentionnés dans l\'intrigue de manière naturelle et significative selon leurs rôles définis.' : ''}`;
      
      if (continueStory) {
        userPrompt = `${continueStory.isNewEpisode ? 'Crée un NOUVEL ÉPISODE' : 'Continue cette histoire'} :

Histoire précédente :
"${continueStory.content}"

${continueStory.isNewEpisode ? 
          `Crée un nouvel épisode avec :
- Le même personnage principal : ${character}${location ? `
- Lieu : ${location}` : ''}${specialElements ? `
- Éléments spéciaux : ${specialElements}` : ''}
- Une nouvelle intrigue dans le thème : ${theme}
- Style narratif : ${narrativeStyle}
- Longueur : ${lengthInstructions[length]}${formatSecondaryCharacters()}

IMPORTANT : Crée une NOUVELLE aventure COMPLÈTE et BIEN STRUCTURÉE avec le même personnage, mais une intrigue entièrement différente. L'épisode doit avoir sa propre structure narrative complète (début, milieu, fin) et être autonome tout en s'inscrivant dans la continuité.${secondaryCharacters.length > 0 ? ' OBLIGATOIRE: Tous les personnages secondaires listés ci-dessus DOIVENT apparaître et avoir un impact significatif dans ce nouveau chapitre.' : ''}` :
          `Continue directement cette histoire avec :
- Personnage : ${character}${location ? `
- Lieu : ${location}` : ''}${specialElements ? `
- Éléments spéciaux : ${specialElements}` : ''}
- Thème : ${theme}
- Style narratif : ${narrativeStyle}
- Longueur : ${lengthInstructions[length]}${formatSecondaryCharacters()}

IMPORTANT : Continue naturellement là où l'histoire s'est arrêtée et développe l'intrigue vers une conclusion COMPLÈTE et ÉPIQUE. La suite doit avoir une structure narrative claire avec développement, climax et résolution définitive. Ne laisse aucun élément en suspens.${secondaryCharacters.length > 0 ? ' OBLIGATOIRE: Tous les personnages secondaires listés ci-dessus DOIVENT apparaître dans la suite de l\'histoire.' : ''}` }`;
      } else {
        userPrompt = `Écris une histoire COMPLÈTE avec ces éléments :
- Personnage principal : ${character}${location ? `
- Lieu : ${location}` : ''}${specialElements ? `
- Éléments spéciaux : ${specialElements}` : ''}
- Thème : ${theme}
- Style narratif : ${narrativeStyle}
- Longueur : ${lengthInstructions[length]}${formatSecondaryCharacters()}

IMPORTANT : L'histoire doit être COMPLÈTE et PARFAITEMENT STRUCTURÉE avec :
1. Une introduction captivante qui établit clairement le contexte, l'atmosphère et le personnage
2. Un développement riche et progressif avec des péripéties, de l'action et une montée en tension
3. Un climax intense et bien construit qui constitue le point culminant de l'intrigue
4. Une résolution satisfaisante qui répond à tous les enjeux soulevés
5. Une conclusion mémorable qui clôt définitivement l'histoire
6. Une structure narrative cohérente et maîtrisée du début à la fin, peu importe la longueur choisie${secondaryCharacters.length > 0 ? '\n7. OBLIGATOIRE: Chaque personnage secondaire mentionné ci-dessus DOIT apparaître dans l\'intrigue et avoir un impact significatif selon son rôle défini. Ne les ignore pas.' : ''}

REQUIS ABSOLUS : L'histoire doit être une œuvre littéraire complète avec un arc narratif entier (exposition, développement, climax, dénouement). Aucune histoire tronquée, inachevée ou qui se termine de manière abrupte n'est acceptable, même pour les formats courts.`;
      }
    }

    const completion = await openai.chat.completions.create({
      model: model, // Utilise le modèle passé en paramètre
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      max_tokens: length === 'long' ? 1500 : length === 'medium' ? 1000 : 600,
      temperature: 0.8,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Erreur lors de la génération de l\'histoire:', error);
    
    // Retourner une histoire d'exemple en cas d'erreur
    return generateFallbackStory({ character, theme, narrativeStyle, length, isKidsMode });
  }
};

// Histoire de secours en cas d'erreur API
const generateFallbackStory = ({ character, theme, narrativeStyle, length, isKidsMode }) => {
  const stories = {
    short: isKidsMode ? 
      `Il était une fois ${character}, un petit héros plein de courage qui vivait dans un village paisible. Un matin ensoleillé, en explorant le monde fascinant de ${theme}, ${character} découvrit quelque chose de vraiment merveilleux qui allait changer sa vie.\n\nLors de son aventure, ${character} rencontra des défis qui semblaient impossibles à surmonter. Mais grâce à sa gentillesse, sa détermination et l'aide de nouveaux amis qu'il rencontra en chemin, ${character} réussit à triompher de toutes les difficultés.\n\nCette incroyable aventure lui apprit l'importance de croire en soi et de ne jamais abandonner ses rêves. ${character} découvrit qu'avec du courage et de la persévérance, tout est possible.\n\nEt depuis ce jour mémorable, ${character} vécut heureux et épanoui, entouré de ses amis qui l'admiraient pour son grand cœur et son courage. Il était devenu un exemple pour tous les enfants du village.` :
      `${character} se trouvait face à un mystère intriguant lié à ${theme}. Dans un style ${narrativeStyle}, cette histoire captivante révèle comment les apparences peuvent être trompeuses et comment la persévérance mène à la vérité.\n\nAu début de son enquête, ${character} pensait avoir affaire à un simple problème. Mais au fil de ses découvertes, il comprit que la vérité était bien plus complexe et fascinante qu'il ne l'avait imaginé. Chaque indice qu'il découvrait le menait vers une révélation de plus en plus surprenante.\n\nAprès de nombreuses péripéties et des moments de doute, ${character} parvint enfin à résoudre l'énigme qui le tourmentait. Cette expérience extraordinaire le transforma profondément et changea à jamais sa perception du monde qui l'entourait.\n\nFinalement, ${character} réalisa que cette aventure lui avait apporté bien plus que des réponses : elle lui avait donné une nouvelle sagesse et une compréhension plus profonde de la vie.`,
    
    medium: isKidsMode ?
      `Il était une fois ${character}, un enfant extraordinaire qui vivait dans un monde magique rempli de merveilles liées à ${theme}. Chaque jour dans ce royaume enchanté était une nouvelle aventure pleine de surprises, de découvertes et de moments magiques.\n\nUn matin particulièrement radieux, ${character} découvrit un secret extraordinaire caché dans les profondeurs de son monde. Ce mystère fascinant allait complètement changer le cours de sa vie. Avec un courage remarquable et une détermination sans faille, il décida de partir en quête pour résoudre cette énigme mystérieuse.\n\nAu cours de son voyage épique, ${character} rencontra de merveilleux nouveaux amis aux talents uniques qui décidèrent de l'aider dans sa noble mission. Ensemble, cette équipe formidable apprit l'importance précieuse de l'amitié sincère, de l'entraide généreuse et du partage.\n\nLes défis qu'ils affrontèrent ensemble les rendirent plus forts et plus unis. Chaque obstacle surmonté renforçait leur amitié et leur confiance mutuelle. Grâce à leur travail d'équipe exceptionnel et à leur détermination commune, ils réussirent à accomplir l'impossible.\n\n${character} comprit alors une leçon fondamentale : les plus grandes aventures et les plus beaux souvenirs sont ceux qu'on vit avec ses vrais amis. Cette découverte emplit son cœur de joie et de gratitude.\n\nEt depuis ce jour mémorable, ils vécurent tous heureux et épanouis, toujours prêts pour de nouvelles aventures extraordinaires qui les attendaient dans leur monde magique.` :
      `Dans un récit ${narrativeStyle} captivant, ${character} se lance dans une quête extraordinaire liée à ${theme}. Cette histoire profonde explore les méandres de l'âme humaine, les mystères de l'existence et les défis qui forgent le caractère.\n\nDès le début de son périple, ${character} découvre que son voyage sera semé d'embûches inattendues et de défis qui testeront ses limites. Chaque épreuve qu'il traverse révèle une facette cachée et insoupçonnée de sa personnalité, le forçant à se remettre en question et à grandir.\n\nLes rencontres fascinantes qu'il fait en chemin transforment progressivement sa vision du monde et sa compréhension de la vie. Des alliés inattendus aux motivations complexes et des adversaires redoutables aux intentions mystérieuses jalonnent son parcours tumultueux.\n\nLes obstacles s'accumulent et les enjeux deviennent de plus en plus importants. ${character} doit puiser dans ses ressources les plus profondes pour continuer à avancer malgré les difficultés croissantes.\n\nAu climax intense de son aventure, ${character} se trouve confronté à un choix moral crucial et déchirant qui déterminera non seulement son propre destin, mais aussi celui de tous ceux qui l'entourent et qui comptent sur lui.\n\nLa résolution finale apporte une compréhension nouvelle et profonde de la condition humaine. ${character} émerge de cette épreuve transformatrice complètement transformé, porteur d'une sagesse durement acquise et d'une maturité nouvelle qui guidera ses pas futurs.`,
    
    long: isKidsMode ?
      `Il était une fois, dans un royaume lointain et merveilleux, ${character}, un jeune héros extraordinaire au cœur absolument pur et à l'âme généreuse. Ce royaume magique était célèbre dans tous les mondes pour ses merveilles extraordinaires liées à ${theme}, où la joie et l'harmonie régnaient depuis des siècles. Mais un jour fatidique, quelque chose d'étrange et d'inquiétant se produisit qui allait changer le destin de tous.\n\n${character}, qui était connu de tous pour sa bonté et sa sagesse malgré son jeune âge, remarqua avec tristesse que la magie ancestrale du royaume commençait mystérieusement à s'affaiblir jour après jour. Les couleurs vives et chatoyantes devenaient progressivement ternes et grises, les fleurs magiques perdaient leur éclat, et la joie naturelle des habitants diminuait inexorablement, remplacée par une mélancolie grandissante.\n\nDéterminé à aider son peuple bien-aimé et à sauver son royaume de cette malédiction, ${character} prit la courageuse décision de partir en quête périlleuse pour découvrir la véritable cause de ce problème mystérieux qui affligeait leur monde.\n\nSon voyage épique et extraordinaire le mena à travers des forêts enchantées aux arbres millénaires, des montagnes mystérieuses couvertes de brouillard magique, des vallées secrètes où le temps semblait suspendu, et des rivières cristallines qui murmuraient d'anciens secrets. En chemin, il rencontra Luna, une fée sage et bienveillante aux ailes scintillantes, qui lui révéla avec gravité que seul un cœur absolument pur et une âme courageuse pourraient restaurer la magie perdue du royaume.\n\nLuna, touchée par la sincérité et la détermination de ${character}, lui offrit généreusement trois épreuves magiques pour prouver sa valeur et sa noblesse d'âme. La première épreuve, dans une caverne de cristal, testait son courage face à ses peurs les plus profondes. La deuxième, au sommet d'une montagne sacrée, évaluait sa générosité et son altruisme. La troisième, dans un labyrinthe de lumière, mesurait sa sagesse et sa capacité à faire les bons choix. ${character} réussit brillamment et avec honneur chaque défi, impressionnant même les esprits anciens qui observaient ses exploits.\n\nGrâce à sa persévérance inébranlable, à son courage exemplaire et à l'aide précieuse de ses nouveaux amis magiques qu'il avait rencontrés en chemin, ${character} découvrit finalement que la source du problème était un ancien sortilège de tristesse, jeté il y a longtemps par un sorcier jaloux, et qui ne pouvait être brisé que par un acte de pure bonté et d'amour désintéressé.\n\nSans hésiter un seul instant, ${character} accomplit cet acte magique avec joie et amour dans son cœur, offrant sa propre lumière intérieure pour sauver son royaume. Dans un éclat de lumière dorée et de musique céleste, il restaura ainsi complètement la magie du royaume. Tous les habitants, des plus petits aux plus grands, célébrèrent avec émotion son courage extraordinaire, sa générosité sans limites et son amour pour son peuple.\n\nDepuis ce jour mémorable et historique, ${character} devint le gardien éternel et bienveillant de la magie du royaume, veillant avec amour et vigilance à ce que la joie, l'émerveillement et la beauté ne disparaissent jamais de leur monde. Il enseigna aux enfants l'importance de la bonté, du courage et de l'amitié. Et ils vécurent tous heureux, en harmonie parfaite, pour l'éternité, dans un royaume où la magie et l'amour régnaient à jamais.` :
      `Dans les méandres labyrinthiques d'un récit ${narrativeStyle} profondément captivant, ${character} émerge comme une figure d'une complexité saisissante, façonnée et sculptée par les circonstances impitoyables et fascinantes liées à ${theme}. Son histoire extraordinaire commence dans l'apparente banalité du quotidien, mais bascule rapidement et inexorablement vers l'extraordinaire et l'imprévisible.\n\nLe destin apparemment tracé de ${character} se trouve brutalement bouleversé lorsqu'un événement inattendu et déstabilisant vient perturber violemment l'équilibre précaire de son existence tranquille. Cette rupture fondamentale et irréversible l'oblige impitoyablement à questionner et à remettre en cause absolument tout ce qu'il croyait savoir avec certitude sur lui-même, sur sa place dans l'univers et sur la nature même du monde complexe qui l'entoure.\n\nSa quête existentielle et périlleuse le mène inexorablement à travers des territoires inconnus et dangereux, tant géographiques que psychologiques et spirituels. Chaque étape cruciale de son voyage initiatique révèle progressivement de nouvelles facettes insoupçonnées de sa personnalité multiforme, des forces cachées et insoupçonnées qui sommeillaient en lui, ainsi que des faiblesses profondes et douloureuses qu'il doit apprendre courageusement à accepter et à transcender.\n\nLes personnages énigmatiques et fascinants qu'il croise sur son chemin tortueux deviennent autant de miroirs déformants et révélateurs qui reflètent impitoyablement ses propres contradictions intérieures et ses conflits non résolus. Certains deviennent des guides bienveillants qui l'aident à grandir et à évoluer, d'autres se révèlent être des adversaires redoutables qui le défient et le poussent dans ses retranchements, mais tous, sans exception, contribuent de manière significative à forger et à sculpter l'homme qu'il devient progressivement et douloureusement.\n\nLes obstacles s'accumulent et les enjeux deviennent de plus en plus élevés et personnels. ${character} doit faire face à des défis qui testent non seulement ses capacités physiques, mais aussi sa force morale et sa résilience psychologique.\n\nLe climax dramatique et intense de son aventure le confronte brutalement à un choix moral déchirant et impossible, où aucune solution n'est parfaite et où chaque décision entraîne des conséquences irréversibles. ${character} doit puiser courageusement dans toute la sagesse durement acquise au cours de son périple pour naviguer avec habileté cette épreuve ultime qui déterminera non seulement son propre destin, mais aussi celui de tous ceux qui lui sont chers.\n\nLa résolution finale, à la fois teintée d'amertume profonde et de beauté transcendante, révèle avec une clarté aveuglante que la véritable victoire et la vraie sagesse résident parfois dans l'acceptation courageuse de l'imperfection fondamentale de l'existence humaine. ${character} émerge de cette épreuve transformatrice complètement métamorphosé, porteur d'une compréhension nouvelle et profonde de la condition humaine dans toute sa complexité et sa fragilité.\n\nSon histoire poignante et universelle se termine sur une note d'espoir tempéré mais authentique, suggérant avec force que même dans l'adversité la plus sombre et les moments les plus désespérés, la résilience indomptable de l'esprit humain peut triompher des ténèbres et inspirer profondément les générations futures à ne jamais perdre foi en la beauté et la dignité de l'existence.`
  };
  
  return stories[length];
};

export default { generateStory };