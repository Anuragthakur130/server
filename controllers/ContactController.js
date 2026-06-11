const contact = require("../models/contact");

class ContactController {

    // create contact form
    static createContact = async (req, res) => {
        try {
            const { name, email, subject, message } = req.body;
            if (!name || !email || !subject || !message) {
                return res.status(400).json({ message: "All fields are required" });
            }
            const result = new contact({
                name,
                email,
                subject,
                message,
            });
            await result.save();
            res.status(201).json({ message: "Message sent successfully" });


        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal Server Error" });
        }
    }


    // get all contact form
    static getAllContact = async (req, res) => {
        try {
            const contacts = await contact.find();
            res.status(200).json(contacts);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal Server Error" });
        }
    }



}

module.exports = ContactController;