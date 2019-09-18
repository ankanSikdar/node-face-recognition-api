const Clarifai = require('clarifai')

const app = new Clarifai.App({apiKey: process.env.CLARIFAI_API});

const handleImage = (req, res, db) => {
    const { id } = req.body
    db("users").where("id", "=", id)
        .increment("entries", 1)
        .returning("entries")
        .then(entry => res.json(entry))
        .catch(err => res.status(400).json("Unable to get entries"))
}

const handleApiCall = (req, res) => {
    const {input} = req.body
    app.models.predict(Clarifai.FACE_DETECT_MODEL, input)
        .then(response => res.json(response))
        .catch(err => res.status(400).json(err))
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}
