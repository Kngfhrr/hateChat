module.exports = function randomNumber(event) {
    const min = event.data.min;
    console.log("fdfsd", min);

    const num = min+"TEST";

    return {
        data: {
            num
        }
    }
};
