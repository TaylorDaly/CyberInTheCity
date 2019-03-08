module.exports = {
    uri: process.env.DB,
    nodePort: process.env.PORT,
    angPort: process.env.ANGULAR_PORT,
    secret: process.env.SECRET,
    registerSecret: process.env.REGISTER_SECRET,
    newsKey: process.env.NEWS_API_KEY
};