const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 3000;
app.get("/", (req, res) => {
    res.send("Server working");
});
app.get("/passes/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        console.log("Getting games for user:", userId);

        // ✅ NEW endpoint (correct one)
        const gamesResponse = await axios.get(
            `https://games.roblox.com/v2/users/${userId}/games?accessFilter=Public&limit=50`
        );

        const games = gamesResponse.data.data;

        if (!games || games.length === 0) {
            console.log("No games found.");
            return res.json([]);
        }

        let allPasses = [];

        for (const game of games) {
            try {
                console.log("Checking universe:", game.id);

                const passesResponse = await axios.get(
                    `https://games.roblox.com/v1/games/${game.id}/game-passes?limit=100`
                );

                if (passesResponse.data.data.length > 0) {
                    allPasses.push(...passesResponse.data.data);
                }

            } catch (err) {
                console.log("Failed pulling passes for universe:", game.id);
            }
        }

        console.log("Total passes found:", allPasses.length);

        res.json(allPasses);

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Failed to fetch passes" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



