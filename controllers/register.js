
const handleRegister = (req, res, db, bcrypt, saltRounds) => {

    const { name, email, password } = req.body

    if(!name || !email || !password) {
        return res.status(400).json("Invalid form submission")
    } else {
        bcrypt.hash(password, saltRounds, function(err, hash) {
            // Store hash in your password DB.
            db.transaction(trx => {
                trx.insert({
                    hash: hash,
                    email: email
                })
                .into("login")
                .returning("email")
                .then(loginEmail => {
                    return trx("users")
                            .returning("*")
                            .insert({
                                name: name,
                                email: loginEmail[0],
                                joined: new Date()
                            })
                            .then(user => {
                                res.json(user[0])
                            })
                })
                .then(trx.commit)
                .catch(trx.rollback)
            }).catch(err => res.status(400).json("Unable to register"))
        });
    }
}

module.exports = {
    handleRegister: handleRegister
}