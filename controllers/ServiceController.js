
const Service = require('../models/Service')

class ServiceController {

    // Create Service
    static createService = async (req, res) => {
        try {

            const { title, description, icon } = req.body
            console.log(req.body)

            const service = await Service.create({
                title,
                description,
                icon
            })

            res.status(201).json({
                success: true,
                message: 'Service created successfully',
                service
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    // Get All Services
    static getServices = async (req, res) => {
        try {

            const services = await Service.find()

            res.status(200).json({
                success: true,
                services
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    // Update Service
    static updateService = async (req, res) => {
        try {

            const service = await Service.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            )

            res.status(200).json({
                success: true,
                message: 'Service updated successfully',
                service
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }

    // Delete Service
    static deleteService = async (req, res) => {
        try {

            await Service.findByIdAndDelete(req.params.id)

            res.status(200).json({
                success: true,
                message: 'Service deleted successfully'
            })

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = ServiceController