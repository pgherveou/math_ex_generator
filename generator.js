// Configuration
const CONFIG = {
    TOTAL_EXERCISES: 60,
    MULT_COUNT: 42,  // 70%
    DIV_COUNT: 18,   // 30%
    TABLE_MIN: 1,
    TABLE_MAX: 11
};

// Translations
const translations = {
    fr: {
        'page-title': 'Générateur de Feuilles d\'Exercices',
        'generate-btn': 'Générer une nouvelle feuille',
        'print-btn': 'Imprimer',
        'name-label': 'Prénom',
        'date-label': 'Date',
        'title': '60 calculs en 5 minutes',
        'score-label': 'Mon score'
    },
    en: {
        'page-title': 'Math Worksheet Generator',
        'generate-btn': 'Generate New Worksheet',
        'print-btn': 'Print',
        'name-label': 'Name',
        'date-label': 'Date',
        'title': '60 calculations in 5 minutes',
        'score-label': 'My score'
    },
    es: {
        'page-title': 'Generador de Hojas de Ejercicios',
        'generate-btn': 'Generar Nueva Hoja',
        'print-btn': 'Imprimir',
        'name-label': 'Nombre',
        'date-label': 'Fecha',
        'title': '60 cálculos en 5 minutos',
        'score-label': 'Mi puntuación'
    },
    pt: {
        'page-title': 'Gerador de Folhas de Exercícios',
        'generate-btn': 'Gerar Nova Folha',
        'print-btn': 'Imprimir',
        'name-label': 'Nome',
        'date-label': 'Data',
        'title': '60 cálculos em 5 minutos',
        'score-label': 'Minha pontuação'
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

// Generate single multiplication exercise
function generateMultiplication() {
    const a = randomInt(CONFIG.TABLE_MIN, CONFIG.TABLE_MAX);
    const b = randomInt(CONFIG.TABLE_MIN, CONFIG.TABLE_MAX);
    return {
        type: 'mult',
        text: `${a} × ${b} = `,
        key: `${a}×${b}`
    };
}

// Generate single division exercise (whole numbers only)
function generateDivision() {
    const divisor = randomInt(CONFIG.TABLE_MIN, CONFIG.TABLE_MAX);
    const quotient = randomInt(CONFIG.TABLE_MIN, CONFIG.TABLE_MAX);
    const dividend = divisor * quotient;
    return {
        type: 'div',
        text: `${dividend} : ${divisor} = `,
        key: `${dividend}:${divisor}`
    };
}

// Generate full exercise set (60 exercises with 70/30 distribution)
function generateExerciseSet() {
    // Create distribution array
    const types = [
        ...Array(CONFIG.MULT_COUNT).fill('mult'),
        ...Array(CONFIG.DIV_COUNT).fill('div')
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
            exercise = types[i] === 'mult'
                ? generateMultiplication()
                : generateDivision();
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
    const columns = ['column-1', 'column-2', 'column-3'].map(id => document.getElementById(id));

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
