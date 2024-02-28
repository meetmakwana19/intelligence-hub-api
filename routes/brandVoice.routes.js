const express = require("express");
const utils = require("../utils/utils");
const fs = require("fs/promises");

const brandVoiceRouter = express.Router();

// TODO: rowActionList- Edit(Update), Delete(Delete)

// Pagination middleware
const paginateResults = require("../middleware/paginationMiddleware");

brandVoiceRouter.get("/:profileId", async (req, res) => {
  const { profileId } = req.params; // Extracting profileId from URL parameters

  try {
    const data = await utils.readProfiles(); // Assuming this reads your profiles data
    const profile = data.find((p) => p.id === profileId); // Find the profile with the given ID

    if (!profile) {
      return res
        .status(404)
        .json({ message: "Profile not found", error: null });
    }

    res.status(200).json({
      message: "Profile fetched successfully.",
      data: profile,
      error: null,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
});

brandVoiceRouter.get("/", (req, res) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 30;

  return utils.readProfiles().then((data) => {
    const paginatedData = paginateResults(data, startIndex, limit);
    const totalCount = data.length; // Calculate total count

    res.status(200).json({
      message: "All voices fetched.",
      data: {
        totalCount,
        paginatedData,
      },
      error: null,
    });
  });
});

brandVoiceRouter.post("/", (req, res) => {
  const newVoice = req.body;
  return utils
    .readProfiles()
    .then((data) => {
      data.push(newVoice);

      return fs.writeFile("profiles.json", JSON.stringify(data));
    })
    .then(() => {
      return res.status(201).json({
        message: "New voice added",
        data: newVoice,
        error: null,
      });
    });
});

brandVoiceRouter.put("/:profileId", async (req, res) => {
  const { profileId } = req.params; // Extract profile ID from URL parameters
  const updatedProfile = req.body; // Get the updated profile data from the request body

  try {
    const data = await utils.readProfiles(); // Read the existing profiles
    const profileIndex = data.findIndex((p) => p.id === profileId); // Find the index of the profile to update

    if (profileIndex === -1) {
      // Profile not found
      return res
        .status(404)
        .json({ message: "Profile not found", error: null });
    }

    // Update the profile
    data[profileIndex] = { ...data[profileIndex], ...updatedProfile };

    await fs.writeFile("profiles.json", JSON.stringify(data, null, 2)); // Save the updated profiles back to the file

    res.status(200).json({
      message: "Profile updated successfully.",
      data: data[profileIndex],
      error: null,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
});

module.exports = brandVoiceRouter;
