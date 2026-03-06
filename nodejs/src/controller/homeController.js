let gethomePage = (req, res) => {
    return res.render("homepage.ejs");
}

let getAboutPage = (req, res) => {
    return res.render("test/about.ejs");
}
module.exports = {
    gethomePage: gethomePage,
    getAboutPage: getAboutPage
};