module.exports = function deleteChatCustom(event) {
    const value =  event.data.value;
     const id = value+"TEST";
    return {
        data: {
         id
        }
    }
};
