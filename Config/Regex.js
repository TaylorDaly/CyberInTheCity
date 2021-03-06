module.exports = {
    // RFC 5322 Official Email Standard. Replaced last bit with @ucdenver.edu so it must be a school email.
    //email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(ucdenver.edu)$/,
    // Checks phone number is right number of characters, country code optional, area code can be surrounded by
    // parenthesis and separator is space, period or dash. Ex. +1 (555) 555 5555 or 303.333.3333 or 222-222-2222
    phone: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
    // Check if password is 8 character and has one capital, one lower case, and one special
    password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    // Check if any characters are not a-z, A-Z, 0-9, or #?!@$%^&*-
    // the ^ denotes NOT these characters.
    disallowedCharacters: /[^a-zA-Z0-9#?!@$%^&*-]/,
    link: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
};