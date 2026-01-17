// Configuration
const CONFIG = {
    TOTAL_EXERCISES: 60,
    MULT_COUNT: 42,  // 70%
    DIV_COUNT: 18,   // 30%
    TABLE_MIN: 1,
    TABLE_MAX: 11
};

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

    // Get column elements
    const columns = [
        document.getElementById('column-1'),
        document.getElementById('column-2'),
        document.getElementById('column-3')
    ];

    // Clear existing columns
    columns.forEach(col => col.innerHTML = '');

    // Distribute exercises to columns (20 per column)
    exercises.forEach((ex, index) => {
        const columnIndex = Math.floor(index / 20);

        const div = document.createElement('div');
        div.className = 'exercise-item';

        const textSpan = document.createElement('span');
        textSpan.textContent = ex.text;

        const lineSpan = document.createElement('span');
        lineSpan.className = 'answer-line';

        div.appendChild(textSpan);
        div.appendChild(lineSpan);

        columns[columnIndex].appendChild(div);
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Generate initial worksheet on load
    renderWorksheet();

    // Generate button
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', renderWorksheet);
    }

    // Print button
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
});
