const { createNote, updateNotes, getNotes, getAllNotes } = require("../controller/Controller");
const router = require("express").Router();


router.get("/notes/all", getAllNotes);
router.post("/notes", createNote);
router.get("/notes/:id", getNotes);
router.put("/notes/:id", updateNotes);



module.exports = router;