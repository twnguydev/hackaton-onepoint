export const pollutantInfo: { [key: string]: { origin: string, healthEffects: string, environmentalEffects: string } } = {
    "SO2": {
        origin: "Provient principalement de la combustion de combustibles fossiles contenant du soufre, tels que le charbon et le pétrole.",
        healthEffects: "Peut irriter les voies respiratoires, aggraver l'asthme et causer des troubles respiratoires chez les personnes sensibles.",
        environmentalEffects: "Contribue à la formation de pluies acides, qui peuvent endommager les écosystèmes et les bâtiments."
    },
    "NO": {
        origin: "Formé lors de la combustion à haute température dans les moteurs de véhicules et les centrales électriques.",
        healthEffects: "Seul, il est moins nocif, mais il réagit avec l'oxygène dans l'air pour former du dioxyde d'azote (NO2), un polluant plus dangereux.",
        environmentalEffects: "Contribue à la formation de smog photochimique et de l'ozone troposphérique."
    },
    "NO2": {
        origin: "Résulte de l'oxydation du monoxyde d'azote (NO). Il provient principalement des gaz d'échappement des véhicules et des centrales thermiques.",
        healthEffects: "Irritant pour les voies respiratoires, il peut aggraver l'asthme et d'autres maladies pulmonaires.",
        environmentalEffects: "Contribue à la formation d'ozone troposphérique et de particules fines, ainsi qu'à l'acidification des écosystèmes."
    },
    "CO": {
        origin: "Produit par la combustion incomplète de combustibles fossiles, notamment dans les véhicules à moteur, les poêles et les feux ouverts.",
        healthEffects: "Réduit la capacité du sang à transporter l'oxygène, ce qui peut entraîner des maux de tête, des étourdissements, et à des concentrations élevées, être mortel.",
        environmentalEffects: "Contribue à la formation d'ozone troposphérique, ce qui impacte la qualité de l'air et la santé des écosystèmes."
    },
    "H2S": {
        origin: "Émis par des sources naturelles telles que les volcans et les marais, ainsi que par les activités industrielles comme le raffinage du pétrole.",
        healthEffects: "A des concentrations élevées, il peut causer des irritations des yeux, du nez, et de la gorge, et à des concentrations très élevées, il peut être mortel.",
        environmentalEffects: "Contribue à la formation de pluies acides et peut causer des dommages à la végétation et aux écosystèmes aquatiques."
    },
    "O3": {
        origin: "Se forme dans l'atmosphère par des réactions chimiques entre les oxydes d'azote (NOx) et les composés organiques volatils (COV) en présence de la lumière du soleil.",
        healthEffects: "Irritant pour les voies respiratoires, il peut aggraver l'asthme et d'autres maladies pulmonaires, et réduire la fonction pulmonaire.",
        environmentalEffects: "A des concentrations élevées, il peut endommager les cultures, les forêts et contribuer à la dégradation des matériaux."
    },
    "C2H3CI": {
        origin: "Produit par des activités industrielles, notamment la fabrication de plastiques et de solvants.",
        healthEffects: "Peut causer des irritations de la peau et des yeux, et des expositions prolongées peuvent entraîner des dommages au foie et aux reins.",
        environmentalEffects: "Contribue à la pollution de l'air et des sols, avec des effets toxiques potentiels pour les écosystèmes."
    },
    "NOx": {
        origin: "Désigne l'ensemble des oxydes d'azote, dont le monoxyde d'azote (NO) et le dioxyde d'azote (NO2). Produit lors de la combustion à haute température.",
        healthEffects: "Les NOx, en particulier le NO2, sont irritants pour le système respiratoire et peuvent provoquer des affections pulmonaires.",
        environmentalEffects: "Contribuent à la formation de smog, de pluies acides et d'ozone troposphérique."
    },
    "CxHx": {
        origin: "Hydrocarbures émis par les véhicules, les industries et les processus de combustion incomplète.",
        healthEffects: "Certains hydrocarbures peuvent être cancérigènes et causer des troubles respiratoires.",
        environmentalEffects: "Contribuent à la formation de l'ozone troposphérique et à la pollution de l'air."
    },
    "CO2": {
        origin: "Principalement émis par la combustion de combustibles fossiles (charbon, pétrole, gaz naturel) dans l'industrie, les transports et la production d'énergie.",
        healthEffects: "En concentrations élevées, peut causer des maux de tête, des vertiges, et dans des cas extrêmes, l'asphyxie. Contribue indirectement aux problèmes de santé liés au changement climatique.",
        environmentalEffects: "Principal gaz à effet de serre responsable du réchauffement climatique. Contribue à l'acidification des océans."
    },
    "NH3": {
        origin: "Provient principalement des activités agricoles, notamment des engrais azotés et des déjections animales.",
        healthEffects: "Peut irriter les yeux, la peau et les voies respiratoires. À des concentrations élevées, il peut causer des dommages aux poumons.",
        environmentalEffects: "Contribue à l'acidification des sols et des eaux, affectant ainsi les écosystèmes terrestres et aquatiques."
    },
    "PMtot": {
        origin: "Proviennent de diverses sources, y compris la combustion de combustibles fossiles, les industries, les véhicules et la poussière naturelle.",
        healthEffects: "Les particules en suspension peuvent irriter les voies respiratoires et augmenter les risques de maladies cardiovasculaires et respiratoires.",
        environmentalEffects: "Réduisent la visibilité, affectent la qualité de l'air et peuvent transporter des substances toxiques affectant la santé des écosystèmes."
    },
    "PM10": {
        origin: "Émis par la combustion de combustibles fossiles, les activités industrielles, les véhicules, et l'érosion des sols.",
        healthEffects: "Peut pénétrer dans les voies respiratoires supérieures et aggraver les maladies respiratoires et cardiaques.",
        environmentalEffects: "Les PM10 peuvent réduire la visibilité et affecter les écosystèmes en transportant des substances toxiques."
    },
    "PM2.5": {
        origin: "Émis par les moteurs diesel, les activités industrielles, et la combustion de biomasse.",
        healthEffects: "Capables de pénétrer profondément dans les poumons, elles augmentent le risque de maladies cardiovasculaires et respiratoires, et peuvent provoquer des cancers.",
        environmentalEffects: "Peut affecter la qualité de l'air, la visibilité et le climat en modifiant la quantité d'énergie solaire atteignant la Terre."
    },
    "PM1": {
        origin: "Produites par des processus de combustion, notamment les moteurs et la combustion de biomasse.",
        healthEffects: "Pénétrant encore plus profondément dans les poumons, elles peuvent atteindre la circulation sanguine, augmentant ainsi les risques de maladies cardiaques, pulmonaires et d'autres troubles systémiques.",
        environmentalEffects: "Moins étudiées que les PM10 et PM2.5, elles sont néanmoins un facteur de pollution atmosphérique et de réduction de la visibilité."
    },
    "Hg": {
        origin: "Émis par les industries, en particulier celles liées à la combustion du charbon, et l'extraction de l'or.",
        healthEffects: "L'exposition au mercure peut causer des dommages au système nerveux, ainsi qu'aux reins et au système cardiovasculaire.",
        environmentalEffects: "Se bioaccumule dans les chaînes alimentaires, affectant les animaux et les écosystèmes aquatiques de manière toxique."
    },
    "Nb PM": {
        origin: "Correspond au nombre total de particules en suspension dans l'air, issues de sources naturelles et anthropiques.",
        healthEffects: "Les particules inhalées peuvent causer des problèmes respiratoires et cardiovasculaires.",
        environmentalEffects: "Peut réduire la qualité de l'air et affecter les écosystèmes, notamment en transportant des toxines."
    },
    "BC": {
        origin: "Provient principalement de la combustion incomplète de combustibles fossiles, de biomasse et de diesel.",
        healthEffects: "Les particules de carbone noir peuvent pénétrer profondément dans les poumons et provoquer des maladies respiratoires et cardiovasculaires.",
        environmentalEffects: "Contribue au réchauffement climatique en absorbant la lumière solaire et en réduisant l'albédo des surfaces enneigées."
    },
    "BCwb": {
        origin: "Carbone noir issu de la combustion de la biomasse, comme le bois ou les déchets agricoles.",
        healthEffects: "Similaires aux autres particules de carbone noir, elles aggravent les maladies respiratoires et cardiovasculaires.",
        environmentalEffects: "A un impact sur le climat et la qualité de l'air, en modifiant les propriétés radiatives de l'atmosphère."
    },
    "BCff": {
        origin: "Carbone noir provenant de la combustion des combustibles fossiles, notamment des moteurs diesel et des centrales thermiques.",
        healthEffects: "Particulièrement dangereux pour les systèmes respiratoire et cardiovasculaire.",
        environmentalEffects: "Contribue au changement climatique et à la pollution de l'air, avec des impacts sur les écosystèmes."
    },
    "C2HCI3": {
        origin: "Utilisé comme solvant industriel et dans certains processus chimiques.",
        healthEffects: "Peut provoquer des irritations des voies respiratoires, et à long terme, causer des dommages au foie et au système nerveux.",
        environmentalEffects: "Peut contaminer les sols et les eaux souterraines, avec des effets toxiques sur les organismes aquatiques."
    },
    "C2CI4": {
        origin: "Principalement utilisé dans l'industrie pour le nettoyage à sec et comme solvant.",
        healthEffects: "Peut provoquer des irritations de la peau, des yeux, et du système respiratoire. Exposition prolongée liée à des dommages au foie et aux reins.",
        environmentalEffects: "Contribue à la pollution de l'air et peut avoir des effets toxiques sur les écosystèmes aquatiques."
    },
    "C4H4CI2": {
        origin: "Utilisé dans la production de solvants et dans l'industrie chimique.",
        healthEffects: "Irritant pour les voies respiratoires, la peau et les yeux. Exposition chronique liée à des effets cancérigènes.",
        environmentalEffects: "Peut polluer les sols et les eaux, avec des effets toxiques sur les organismes aquatiques."
    },
    "SO42-": {
        origin: "Se forme principalement par l'oxydation du dioxyde de soufre (SO2) dans l'atmosphère.",
        healthEffects: "Peut aggraver les affections respiratoires, telles que l'asthme, lorsqu'il est présent sous forme de particules fines.",
        environmentalEffects: "Contribue à l'acidification des sols et des plans d'eau, affectant les écosystèmes."
    },
    "NO3-": {
        origin: "Se forme par l'oxydation des oxydes d'azote dans l'atmosphère.",
        healthEffects: "Peut contribuer à des problèmes respiratoires lorsqu'il est inhalé sous forme de particules fines.",
        environmentalEffects: "Contribue à l'eutrophisation des eaux, perturbant les écosystèmes aquatiques."
    },
    "NH4+": {
        origin: "Provient principalement de l'agriculture, en particulier des engrais et des émissions des élevages.",
        healthEffects: "Peut irriter les voies respiratoires et aggraver les maladies pulmonaires.",
        environmentalEffects: "Contribue à l'acidification des sols et à l'eutrophisation des plans d'eau."
    },
    "CI2": {
        origin: "Utilisé dans les procédés industriels, notamment pour le traitement de l'eau et la production de produits chimiques.",
        healthEffects: "Peut provoquer des irritations des yeux, de la peau et des voies respiratoires. À forte concentration, il est toxique.",
        environmentalEffects: "Contribue à la pollution de l'air et peut avoir des effets nocifs sur les écosystèmes aquatiques."
    },
    "C6H12": {
        origin: "Hydrocarbure cyclique émis par les processus industriels et la combustion incomplète.",
        healthEffects: "Peut causer des irritations des yeux, de la peau et des voies respiratoires. À des niveaux élevés, il peut affecter le système nerveux.",
        environmentalEffects: "Contribue à la pollution atmosphérique et peut avoir des effets toxiques sur les écosystèmes."
    },
    "C8H8": {
        origin: "Produit chimique utilisé dans la fabrication de plastiques et de caoutchouc.",
        healthEffects: "Peut causer des irritations respiratoires et, à long terme, est potentiellement cancérogène.",
        environmentalEffects: "Contribue à la pollution des sols et de l'eau, avec des effets toxiques pour la faune."
    },
    "C4H6": {
        origin: "Utilisé dans la fabrication de plastiques et de produits chimiques.",
        healthEffects: "Irritant pour les yeux, la peau et les voies respiratoires. À des concentrations élevées, il peut affecter le système nerveux.",
        environmentalEffects: "Peut avoir des effets toxiques sur les organismes aquatiques et contribuer à la pollution atmosphérique."
    },
    "C6H6": {
        origin: "Produit par la combustion de combustibles fossiles et utilisé dans l'industrie chimique.",
        healthEffects: "Connu pour être cancérigène et peut provoquer des troubles du sang, comme l'anémie.",
        environmentalEffects: "Contribue à la pollution de l'air et des eaux, affectant les écosystèmes aquatiques et terrestres."
    },
    "C8H10": {
        origin: "Utilisé comme solvant industriel et dans les produits chimiques.",
        healthEffects: "Peut causer des irritations respiratoires et des effets neurotoxiques à des expositions prolongées.",
        environmentalEffects: "Contribue à la pollution de l'air et peut contaminer les sols et les eaux souterraines."
    },
    "C7H8": {
        origin: "Émis par les industries et utilisé comme solvant dans les peintures et les vernis.",
        healthEffects: "Irritant pour les voies respiratoires, la peau et les yeux. L'exposition prolongée peut causer des dommages au système nerveux central.",
        environmentalEffects: "Contribue à la pollution de l'air et de l'eau, avec des effets toxiques pour la faune et la flore."
    },
    "C8H10_mp": {
        origin: "Isomère de xylène utilisé dans les solvants et les produits chimiques industriels.",
        healthEffects: "Peut causer des irritations des voies respiratoires et des effets neurologiques à long terme.",
        environmentalEffects: "Contribue à la pollution de l'air et des eaux, affectant les écosystèmes aquatiques."
    },
    "C8H10_ox": {
        origin: "Produit industriel utilisé dans la fabrication de solvants et de produits chimiques.",
        healthEffects: "Peut entraîner des irritations respiratoires et des troubles neurologiques en cas d'exposition prolongée.",
        environmentalEffects: "Peut contribuer à la pollution atmosphérique et à la contamination des eaux."
    },
};