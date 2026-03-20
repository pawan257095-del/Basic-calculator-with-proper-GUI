// Simple calculator logic
const previousOperandEl = document.getElementById('previousOperand');
const currentOperandEl  = document.getElementById('currentOperand');
const buttons = document.querySelectorAll('button');

let current = '0';
let previous = '';
let operator = null;
let overwrite = false;

function updateDisplay(){
  currentOperandEl.textContent = current;
  previousOperandEl.textContent = previous ? `${previous} ${operator || ''}` : '';
}

function appendNumber(num){
  if (overwrite) {
    current = num === '.' ? '0.' : num;
    overwrite = false;
    return;
  }
  if (num === '.' && current.includes('.')) return;
  if (current === '0' && num !== '.') current = num;
  else current = current + num;
}

function chooseOperator(op){
  if (operator && !overwrite) compute();
  operator = op;
  previous = current;
  overwrite = true;
}

function compute(){
  if (!operator || previous === '') return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  if (Number.isNaN(a) || Number.isNaN(b)) return;
  let result = 0;
  switch(operator){
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/': result = b === 0 ? 'Error' : a / b; break;
    default: return;
  }
  current = (result === 'Error') ? result : String(roundAccurately(result, 12));
  previous = '';
  operator = null;
  overwrite = true;
}

function roundAccurately(number, places) {
  const factor = Math.pow(10, places);
  return Math.round((number + Number.EPSILON) * factor) / factor;
}

function clearAll(){
  current = '0';
  previous = '';
  operator = null;
  overwrite = false;
}

function deleteDigit(){
  if (overwrite) {
    current = '0';
    overwrite = false;
    return;
  }
  if (current.length === 1) current = '0';
  else current = current.slice(0, -1);
}

/* Button handling */
buttons.forEach(btn => {
  const num = btn.dataset.number;
  const action = btn.dataset.action;
  if (num !== undefined) {
    btn.addEventListener('click', () => {
      appendNumber(num);
      updateDisplay();
    });
  } else if (action) {
    switch(action){
      case 'clear':
        btn.addEventListener('click', () => { clearAll(); updateDisplay(); });
        break;
      case 'delete':
        btn.addEventListener('click', () => { deleteDigit(); updateDisplay(); });
        break;
      case 'operator':
        btn.addEventListener('click', () => {
          chooseOperator(btn.dataset.value);
          updateDisplay();
        });
        break;
      case 'equals':
        btn.addEventListener('click', () => { compute(); updateDisplay(); });
        break;
    }
  }
});

/* Keyboard support */
window.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') {
    appendNumber(e.key);
    updateDisplay();
  } else if (e.key === '.') {
    appendNumber('.');
    updateDisplay();
  } else if (['+','-','*','/'].includes(e.key)) {
    chooseOperator(e.key);
    updateDisplay();
  } else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    compute();
    updateDisplay();
  } else if (e.key === 'Backspace') {
    deleteDigit();
    updateDisplay();
  } else if (e.key === 'Escape') {
    clearAll();
    updateDisplay();
  }
});

/* initialize */
updateDisplay();