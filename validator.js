const validateInput = function(input, output) {
    if(input.length < 3) {
        output = 'inp length is less than 3';
        console.log(output)
    }
}

module.exports = validateInput;