const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const AdminController = require("../controllers/AdminController");
const ContactController = require("../controllers/ContactController");
const SkillController = require("../controllers/SkillController");
const ProjectController = require("../controllers/ProjectController");
const UserController = require("../controllers/UserController");
const HeroController = require("../controllers/HeroController");
const AboutController = require("../controllers/AboutController");
const ServiceController = require("../controllers/ServiceController");


// admin route 
router.post("/admin/register", AdminController.register);
router.post("/admin/login", AdminController.login);
router.get("/admin/logout", AdminController.logout);
router.get("/admin/profile", auth,  AdminController.getProfile);
router.put("/adminupdateProfile", auth, AdminController.updateProfile);
router.put("/adminchangePassword", auth, AdminController.changePassword);
                

// contact routes
router.post("/createContact", ContactController.createContact);
router.get("/getAllContacts", auth, ContactController.getAllContact);

// skill routes
router.post("/createSkill", auth, SkillController.createSkill);
router.get("/getAllSkills", auth, SkillController.getAllSkill);
router.put("/updateSkill/:id", auth, SkillController.updateSkill);
router.delete("/deleteSkill/:id", auth, SkillController.deleteSkill);


// project routes
 router.post("/createproject", ProjectController.createProject);
router.get("/getAllProjects", ProjectController.getAllProjects);
router.get("/getSingleProject/:id", auth, ProjectController.getSingleProject);
router.put("/updateProject/:id", auth, ProjectController.updateProject);
router.delete("/deleteProject/:id", auth, ProjectController.deleteProject);

// user routes
router.post("/createUser", UserController.createUser);

//hero routes
router.post("/createHero", HeroController.createHero);
router.get("/getAllHero", HeroController.getAllHero);
router.get("/getSingleHero/:id", HeroController.getSingleHero);
router.put("/updateHero/:id", HeroController.updateHero);
router.delete("/deleteHero/:id", HeroController.deleteHero);

//about routes
router.post("/createAbout", AboutController.createAbout);
router.get("/getabout", AboutController.getAbout);
router.put("/updateAbout/:id", AboutController.updateAbout);
router.delete("/deleteAbout/:id", AboutController.deleteAbout);


// service routes
router.post('/createservice', ServiceController.createService)
router.get('/getAllServices', ServiceController.getServices)
router.put('/updateService/:id', ServiceController.updateService)
router.delete('/deleteService/:id', ServiceController.deleteService)

module.exports = router;