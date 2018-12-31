module.exports = {
    // RFC 5322 Official Email Standard
    //email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(ucdenver.edu)$/,
    // TODO: Phone number regex
    // Check if password is 8 character and has one capital, one lower case, and one special
    password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    // Check if any characters are not a-z, A-Z, 0-9, or #?!@$%^&*-
    disallowedCharacters: /[^a-zA-Z0-9#?!@$%^&*-]/,
    // Check link has correct number of characters and a . and only accepted characters.
    link: /[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/g
};