const generateMessage = (text)=>{
    return {
        text,
        created_at : new Date().getTime()
    }
}
const generationLink = (url)=>{
    return{
        url,
        created_at : new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generationLink
}