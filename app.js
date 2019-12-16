// @ts-nocheck
let stack = [], prevValue = {};
let textBox = document.getElementById('numInput');
let result = document.getElementById('result');

const OperatorType = "Operator", NumberType = "Number";

function calculate(calculation) {
    var parts = calculation.match(
        /(?:\-?[\d\.]+)|[-\+\*\/]|\s+/g
    );
    if (calculation !== parts.join("")) {
        throw new Error("couldn't parse calculation")
    }
    parts = parts.map(Function.prototype.call, String.prototype.trim);
    parts = parts.filter(Boolean);
    var nums = parts.map(parseFloat);
    var processed = [];
    for (var i = 0; i < parts.length; i++) {
        if (nums[i] === nums[i]) { //nums[i] isn't NaN
            processed.push(nums[i]);
        } else {
            switch (parts[i]) {
                case "+":
                    continue; //ignore
                case "-":
                    processed.push(nums[++i] * -1);
                    break;
                case "*":
                    processed.push(processed.pop() * nums[++i]);
                    break;
                case "/":
                    processed.push(processed.pop() / nums[++i]);
                    break;
                default:
                    throw new Error("unknown operation: " + parts[i]);
            }
        }
    }    
    return processed.reduce(function (result, elem) {
        return result + elem;
    });
}

function renderToTextbox({ type, value }) {
    if (!(prevValue.type === OperatorType && type === OperatorType)) {
        stack.push(value);
        prevValue = { type, value };
        console.log('Prev Value :', prevValue);
        console.log('Stack', stack);
        textBox.value = stack.toString().split(',').join('');
    }
}


document.addEventListener('click', (e) => {
    switch (e.target.className) {
        case 'num':
            console.log(e.target.innerHTML);
            renderToTextbox({ type: NumberType, value: e.target.innerHTML });
            break;
        case 'operator':
            let operator = e.target.id;
            renderToTextbox({ type: OperatorType, value: operator });
            break;
        case "equals":
            result.value = calculate(textBox.value);
            break;
    }
});
