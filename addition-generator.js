// Configuration
const CONFIG = {
    TOTAL_EXERCISES: 40,
    ADD_COUNT: 20,
    SUB_COUNT: 20,
    NUM_MIN: 1,
    NUM_MAX: 99
};

// Translations
const translations = {
    fr: {
        'page-title': 'Générateur de Feuilles d\'Exercices',
        'generate-btn': 'Générer une nouvelle feuille',
        'print-btn': 'Imprimer',
        'name-label': 'Prénom',
        'date-label': 'Date',
        'title': '40 calculs en 5 minutes',
        'score-label': 'Mon score',
        'nav-math': 'Maths',
        'nav-dictation': 'Dictée',
        'nav-addition': 'Addition'
    },
    en: {
        'page-title': 'Math Worksheet Generator',
        'generate-btn': 'Generate New Worksheet',
        'print-btn': 'Print',
        'name-label': 'Name',
        'date-label': 'Date',
        'title': '40 calculations in 5 minutes',
        'score-label': 'My score',
        'nav-math': 'Math',
        'nav-dictation': 'Dictation',
        'nav-addition': 'Addition'
    },
    es: {
        'page-title': 'Generador de Hojas de Ejercicios',
        'generate-btn': 'Generar Nueva Hoja',
        'print-btn': 'Imprimir',
        'name-label': 'Nombre',
        'date-label': 'Fecha',
        'title': '40 cálculos en 5 minutos',
        'score-label': 'Mi puntuación',
        'nav-math': 'Matemáticas',
        'nav-dictation': 'Dictado',
        'nav-addition': 'Adición'
    },
    pt: {
        'page-title': 'Gerador de Folhas de Exercícios',
        'generate-btn': 'Gerar Nova Folha',
        'print-btn': 'Imprimir',
        'name-label': 'Nome',
        'date-label': 'Data',
        'title': '40 cálculos em 5 minutos',
        'score-label': 'Minha pontuação',
        'nav-math': 'Matemática',
        'nav-dictation': 'Ditado',
        'nav-addition': 'Adição'
    },
    de: {
        'page-title': 'Mathe-Arbeitsblatt Generator',
        'generate-btn': 'Neues Arbeitsblatt erstellen',
        'print-btn': 'Drucken',
        'name-label': 'Name',
        'date-label': 'Datum',
        'title': '40 Rechnungen in 5 Minuten',
        'score-label': 'Meine Punktzahl',
        'nav-math': 'Mathe',
        'nav-dictation': 'Diktat',
        'nav-addition': 'Addition'
    }
};

// Current language
let currentLang = localStorage.getItem('preferredLanguage') || 'fr';

// Update page text based on language
function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;

    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.dataset.i18n;
        const translation = translations[lang]?.[key];
        if (translation) {
            element.textContent = translation;
        }
    });

    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

// Utility: Generate random integer between min and max (inclusive)
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Utility: Fisher-Yates shuffle algorithm
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Generate single addition exercise
function generateAddition() {
    const a = randomInt(CONFIG.NUM_MIN, CONFIG.NUM_MAX);
    const b = randomInt(CONFIG.NUM_MIN, CONFIG.NUM_MAX);
    return {
        type: 'add',
        text: `${a} + ${b} = `,
        key: `${a}+${b}`
    };
}

// Generate single subtraction exercise (ensure a >= b for no negative results)
function generateSubtraction() {
    let a = randomInt(CONFIG.NUM_MIN, CONFIG.NUM_MAX);
    let b = randomInt(CONFIG.NUM_MIN, CONFIG.NUM_MAX);

    // Ensure a >= b to prevent negative results
    if (a < b) {
        [a, b] = [b, a];
    }

    return {
        type: 'sub',
        text: `${a} - ${b} = `,
        key: `${a}-${b}`
    };
}

// Generate full exercise set (40 exercises with 50/50 distribution)
function generateExerciseSet() {
    // Create distribution array
    const types = [
        ...Array(CONFIG.ADD_COUNT).fill('add'),
        ...Array(CONFIG.SUB_COUNT).fill('sub')
    ];

    // Shuffle to randomize distribution
    shuffle(types);

    // Generate exercises
    const exercises = [];
    const used = new Set();

    for (let i = 0; i < CONFIG.TOTAL_EXERCISES; i++) {
        let exercise = null;
        let attempts = 0;

        // Try to generate unique exercise (avoid excessive duplicates)
        do {
            exercise = types[i] === 'add'
                ? generateAddition()
                : generateSubtraction();
            attempts++;
        } while (used.has(exercise.key) && attempts < 10);

        used.add(exercise.key);
        exercises.push(exercise);
    }

    return exercises;
}

// Render exercises to DOM
function renderWorksheet() {
    const exercises = generateExerciseSet();
    const columns = ['column-1', 'column-2'].map(id => document.getElementById(id));

    // Clear existing exercises
    columns.forEach(col => col.innerHTML = '');

    // Distribute exercises across columns (20 per column)
    exercises.forEach((ex, index) => {
        const columnIndex = Math.floor(index / 20);
        const exerciseItem = document.createElement('div');
        exerciseItem.className = 'exercise-item';
        exerciseItem.innerHTML = `<span>${ex.text}</span><span class="answer-line"></span>`;
        columns[columnIndex].appendChild(exerciseItem);
    });
}

// Initialize app on DOM load
document.addEventListener('DOMContentLoaded', () => {
    updateLanguage(currentLang);
    renderWorksheet();

    // Event delegation for language buttons
    document.querySelector('.language-selector')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('lang-btn')) {
            updateLanguage(e.target.dataset.lang);
        }
    });

    // Action buttons
    document.getElementById('generate-btn')?.addEventListener('click', renderWorksheet);
    document.getElementById('print-btn')?.addEventListener('click', () => window.print());
});
