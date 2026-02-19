import express from "express"
import cors from "cors"
import { getPublicAssets } from "./assets.mjs"

const app = express()
app.use(cors())

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


app.get("/passes/:userId", async (req, res) => {
    const userId = req.params.userId

    try {
        const result = await getPublicAssets(userId)
        res.json(result.gamePasses)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Failed" })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
